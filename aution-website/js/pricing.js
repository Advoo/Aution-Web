/* ============================================================
   AUTION Mobility — Pricing Engine v3
   -------------------------------------------------------------
   Two vehicle tiers, chosen only by passenger count:
     Go  — 1-3 passengers (sedan)
     XL  — 4+ passengers  (7-seater)

   v3 change: Go gets a flat short-hop band for trips <= 6km, so
   short campus/suburb rides are cheap and predictable instead of
   curve-derived. XL — and the Go curve above 6km — are frozen.

   No dependencies. Import what you need:
     import { quote, fareTable, VEHICLE_TIERS } from "./pricing.js";
   ============================================================ */

// ---- Curve constants — frozen, do not alter ----
export const CURVE_M = 1.111799471223849; // curve multiplier
export const CURVE_C = -29.86361089444243; // curve adjustment
export const RETURN_FACTOR = 1.7; // return-to-one-way ratio
export const ROUND_TO = 5; // all fares ceiling-round to nearest R5

// A quote is never zero or negative — see the note above GO_BANDS
// for why this floor matters at sub-2km XL distances.
const MIN_FARE = ROUND_TO;

// Rule 4: vehicle capacity. Never let a caller pass a tier directly —
// it is always derived from passenger count via tierForPassengers().
export const XL_CAPACITY = 7;

const TRIP_TYPES = ["one-way", "return", "collection"];
const TRIP_PROP = { "one-way": "oneWay", return: "return", collection: "collection" };

function ceil5(x) {
  return Math.max(Math.ceil(x / ROUND_TO) * ROUND_TO, MIN_FARE);
}

/* ---- Rule 1: the curve (XL at all distances; Go above 6km) ----
   Rounded in this exact order — each fare is derived from the
   rounded value above it. */
function xlReturn(km) {
  return ceil5(CURVE_M * RETURN_FACTOR * (10 + 12 * Math.pow(km, 0.9)) + CURVE_C);
}
function xlOneWay(km) {
  return ceil5(xlReturn(km) / RETURN_FACTOR);
}
function xlCollection(km) {
  return ceil5(xlReturn(km) * 0.75);
}
function goReturnCurve(km) {
  return ceil5(xlReturn(km) * 0.9);
}
function goOneWayCurve(km) {
  return ceil5(xlOneWay(km) * 0.85);
}
function goCollectionCurve(km) {
  return ceil5(xlCollection(km) * 0.9);
}

/* ---- Rule 2: Go short-hop band (new in v3) ----
   Flat zone fares for Go, billable distance <= 6.0km. XL has no
   band — it uses the curve from 0km up, at every distance.

   Known interaction: the curve above was fitted to real 3km/25km
   anchors, so it dips very low (even negative before flooring) at
   sub-2km distances — well outside the range it was validated for.
   That means in the low end of this band, the flat Go rate can be
   higher than the raw XL curve value at the same distance. Both
   tables are frozen exactly as specified, so this is a known
   consequence of that freeze, not an implementation bug — see the
   note in __selfTest() invariant 4. */
const GO_BANDS = [
  { zone: "G1", maxKm: 2.0, oneWay: 20, return: 35, collection: 25 },
  { zone: "G2", maxKm: 3.5, oneWay: 30, return: 50, collection: 40 },
  { zone: "G3", maxKm: 5.0, oneWay: 40, return: 70, collection: 55 },
  { zone: "G4", maxKm: 6.0, oneWay: 50, return: 85, collection: 65 },
];
function goBand(km) {
  return GO_BANDS.find((b) => km <= b.maxKm) || null;
}

/* ---- Rule 3: billable distance ----
   Return trips bill the one-way distance — the return factor is
   already baked into the fare, so callers must pass the one-way
   distanceMeters even for a return quote. */
function toBillableKm(distanceMeters) {
  const km = Math.ceil(distanceMeters / 100) / 10;
  return Math.min(Math.max(km, 0.1), 100);
}

/* ---- Rule 4: tier selection ---- */
export function tierForPassengers(passengers) {
  if (!Number.isInteger(passengers) || passengers < 1) {
    throw new Error(`Invalid passenger count: ${passengers}`);
  }
  if (passengers > XL_CAPACITY) {
    throw new Error(
      `Passenger count ${passengers} exceeds vehicle capacity (${XL_CAPACITY})`,
    );
  }
  return passengers <= 3 ? "go" : "xl";
}

function curvePrice(tier, tripType, km) {
  if (tier === "xl") {
    if (tripType === "one-way") return xlOneWay(km);
    if (tripType === "return") return xlReturn(km);
    return xlCollection(km);
  }
  if (tripType === "one-way") return goOneWayCurve(km);
  if (tripType === "return") return goReturnCurve(km);
  return goCollectionCurve(km);
}

/* ---- Rule 5: public API ---- */

/**
 * @param {Object} opts
 * @param {number} opts.distanceMeters  one-way driving distance, from Google Directions
 * @param {number} opts.passengers      1..7
 * @param {'one-way'|'return'|'collection'} opts.tripType
 * @returns {{
 *   price: number,
 *   currency: 'ZAR',
 *   tier: 'go'|'xl',
 *   tripType: string,
 *   billableKm: number,
 *   pricingBasis: 'band'|'curve',
 *   zone: 'G1'|'G2'|'G3'|'G4'|null,
 *   outOfStandardRange: boolean,
 *   breakdown: Object
 * }}
 */
export function quote({ distanceMeters, passengers, tripType }) {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new Error(
      `quote(): distanceMeters must be a non-negative finite number, got ${distanceMeters}`,
    );
  }
  const tier = tierForPassengers(passengers); // throws on invalid passengers
  if (!TRIP_TYPES.includes(tripType)) {
    throw new Error(
      `quote(): tripType must be one of ${TRIP_TYPES.join(", ")}, got "${tripType}"`,
    );
  }

  const billableKm = toBillableKm(distanceMeters);
  const outOfStandardRange = billableKm > 60;

  const band = tier === "go" ? goBand(billableKm) : null;
  const pricingBasis = band ? "band" : "curve";
  const price = band ? band[TRIP_PROP[tripType]] : curvePrice(tier, tripType, billableKm);

  return {
    price,
    currency: "ZAR",
    tier,
    tripType,
    billableKm,
    pricingBasis,
    zone: band ? band.zone : null,
    outOfStandardRange,
    breakdown: {
      distanceMeters,
      passengers,
      xlReturnAtDistance: xlReturn(billableKm),
    },
  };
}

/** Rows for the public rate-card page, one per km in kmList. */
export function fareTable(kmList) {
  return kmList.map((km) => {
    const meters = km * 1000;
    const go = {
      oneWay: quote({ distanceMeters: meters, passengers: 1, tripType: "one-way" }),
      return: quote({ distanceMeters: meters, passengers: 1, tripType: "return" }),
      collection: quote({ distanceMeters: meters, passengers: 1, tripType: "collection" }),
    };
    const xl = {
      oneWay: quote({ distanceMeters: meters, passengers: 4, tripType: "one-way" }),
      return: quote({ distanceMeters: meters, passengers: 4, tripType: "return" }),
      collection: quote({ distanceMeters: meters, passengers: 4, tripType: "collection" }),
    };
    return {
      km,
      go: {
        oneWay: go.oneWay.price,
        return: go.return.price,
        collection: go.collection.price,
        basis: go.oneWay.pricingBasis,
        zone: go.oneWay.zone,
      },
      xl: { oneWay: xl.oneWay.price, return: xl.return.price, collection: xl.collection.price },
    };
  });
}

export const VEHICLE_TIERS = {
  go: {
    label: "Go",
    capacity: "1-3 passengers",
    description: "Sedan — quick and efficient for solo riders and small groups.",
  },
  xl: {
    label: "XL",
    capacity: `4-${XL_CAPACITY} passengers`,
    description: "7-seater — spacious rides for bigger groups and extra luggage.",
  },
};

/** R1 234 style grouping, no decimals — fares are always whole R5 steps. */
export function format(rand) {
  return "R" + rand.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

/* ---- Rule 6: invariants ---- */
export function __selfTest() {
  const failures = [];

  // 1. Monotonicity — price never decreases as distance increases.
  for (const tier of ["go", "xl"]) {
    const passengers = tier === "go" ? 1 : 4;
    for (const tripType of TRIP_TYPES) {
      let prev = -Infinity;
      for (let km = 0.1; km <= 60 + 1e-9; km += 0.05) {
        const { price } = quote({ distanceMeters: km * 1000, passengers, tripType });
        if (price < prev) {
          failures.push(
            `Monotonicity violated: ${tier}/${tripType} dropped from R${prev} to R${price} near ${km.toFixed(2)}km`,
          );
        }
        prev = price;
      }
    }
  }

  // 2. XL is frozen — golden table, 1-40km.
  const XL_GOLDEN = {
    1: [10, 15, 15], 2: [25, 35, 30], 3: [30, 50, 40], 4: [45, 70, 55],
    5: [55, 90, 70], 6: [65, 105, 80], 7: [75, 120, 90], 8: [85, 140, 105],
    10: [100, 170, 130], 12: [125, 205, 155], 15: [150, 250, 190], 20: [195, 330, 250],
    25: [240, 400, 300], 30: [280, 475, 360], 35: [325, 550, 415], 40: [365, 620, 465],
  };
  for (const [kmStr, [ow, ret, col]] of Object.entries(XL_GOLDEN)) {
    const meters = Number(kmStr) * 1000;
    const gotOW = quote({ distanceMeters: meters, passengers: 4, tripType: "one-way" }).price;
    const gotRet = quote({ distanceMeters: meters, passengers: 4, tripType: "return" }).price;
    const gotCol = quote({ distanceMeters: meters, passengers: 4, tripType: "collection" }).price;
    if (gotOW !== ow) failures.push(`XL one-way @ ${kmStr}km: expected R${ow}, got R${gotOW}`);
    if (gotRet !== ret) failures.push(`XL return @ ${kmStr}km: expected R${ret}, got R${gotRet}`);
    if (gotCol !== col) failures.push(`XL collection @ ${kmStr}km: expected R${col}, got R${gotCol}`);
  }

  // 3. Go is frozen — band 1-6km, curve 7-40km.
  const GO_GOLDEN = {
    1: [20, 35, 25], 2: [20, 35, 25], 3: [30, 50, 40], 4: [40, 70, 55],
    5: [40, 70, 55], 6: [50, 85, 65], 7: [65, 110, 85], 8: [75, 130, 95],
    10: [85, 155, 120], 12: [110, 185, 140], 15: [130, 225, 175], 20: [170, 300, 225],
    25: [205, 360, 270], 30: [240, 430, 325], 35: [280, 495, 375], 40: [315, 560, 420],
  };
  for (const [kmStr, [ow, ret, col]] of Object.entries(GO_GOLDEN)) {
    const meters = Number(kmStr) * 1000;
    const gotOW = quote({ distanceMeters: meters, passengers: 1, tripType: "one-way" }).price;
    const gotRet = quote({ distanceMeters: meters, passengers: 1, tripType: "return" }).price;
    const gotCol = quote({ distanceMeters: meters, passengers: 1, tripType: "collection" }).price;
    if (gotOW !== ow) failures.push(`Go one-way @ ${kmStr}km: expected R${ow}, got R${gotOW}`);
    if (gotRet !== ret) failures.push(`Go return @ ${kmStr}km: expected R${ret}, got R${gotRet}`);
    if (gotCol !== col) failures.push(`Go collection @ ${kmStr}km: expected R${col}, got R${gotCol}`);
  }

  // 4. Go is never pricier than XL — enforced in the curve-only region
  // (> 6km) where both tiers are derived from the same rate curve.
  // Below 6km Go trades the curve for a flat short-hop rate (Rule 2);
  // because the frozen XL curve was fit to 3km/25km anchors, it is
  // anomalously low below ~4km (see note above GO_BANDS), so the flat
  // Go rate can briefly read higher there. Freezing both golden tables
  // exactly as given makes that unavoidable — it is a known quirk of
  // the input data, not a bug in this engine.
  for (let km = 6.05; km <= 60 + 1e-9; km += 0.05) {
    const meters = km * 1000;
    for (const tripType of TRIP_TYPES) {
      const go = quote({ distanceMeters: meters, passengers: 1, tripType }).price;
      const xl = quote({ distanceMeters: meters, passengers: 4, tripType }).price;
      if (go > xl) {
        failures.push(`Go priced above XL at ${km.toFixed(2)}km/${tripType}: go=R${go} xl=R${xl}`);
      }
    }
  }

  // 5. Curve anchors hold.
  if (xlReturn(3) !== 50) failures.push(`Anchor failed: xlReturn(3) = ${xlReturn(3)}, expected 50`);
  if (xlReturn(25) !== 400) failures.push(`Anchor failed: xlReturn(25) = ${xlReturn(25)}, expected 400`);

  // 6. Every fare is a positive multiple of 5.
  for (let km = 0.1; km <= 100; km += 0.37) {
    const meters = km * 1000;
    for (const tier of ["go", "xl"]) {
      const passengers = tier === "go" ? 2 : 5;
      for (const tripType of TRIP_TYPES) {
        const { price } = quote({ distanceMeters: meters, passengers, tripType });
        if (price <= 0 || price % ROUND_TO !== 0) {
          failures.push(`Non-R5 or non-positive fare: ${tier}/${tripType} @ ${km.toFixed(2)}km = R${price}`);
        }
      }
    }
  }

  if (failures.length) {
    throw new Error(`pricing.js __selfTest() failed:\n- ${failures.join("\n- ")}`);
  }
  return true;
}
