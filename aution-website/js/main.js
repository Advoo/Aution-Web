/* ============================================================
   AUTION (Pty) Ltd — Shared JavaScript (loaded on every page)
   EDIT YOUR CONTACT DETAILS HERE:
   ============================================================ */
const AUTION = {
  whatsapp: "27846681513", // digits only, no + or spaces
  email: "aution.pty.ltd@gmail.com",
  youtube: "https://www.youtube.com/@THECOLLECTIONPODCAST", // channel link
};

/* ---------- helpers ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = (txt) =>
  `https://wa.me/${AUTION.whatsapp}?text=${encodeURIComponent(txt)}`;
const openWA = (txt) => window.open(waLink(txt), "_blank");

/* ---------- nav: scroll shadow + mobile menu ---------- */
const nav = $(".nav");
if (nav)
  addEventListener(
    "scroll",
    () => nav.classList.toggle("scrolled", scrollY > 12),
    { passive: true },
  );

const burger = $("#burger"),
  mobileMenu = $("#mobileMenu"),
  backdrop = $("#menuBackdrop");
function toggleMenu(open) {
  if (!burger) return;
  burger.classList.toggle("open", open);
  mobileMenu.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
}
burger &&
  burger.addEventListener("click", () =>
    toggleMenu(!mobileMenu.classList.contains("open")),
  );
backdrop && backdrop.addEventListener("click", () => toggleMenu(false));
$$(".mobile-menu a").forEach((a) =>
  a.addEventListener("click", () => toggleMenu(false)),
);

/* ---------- highlight active nav link by page ---------- */
const page = document.body.dataset.page;
$$(".nav-links a, .mobile-menu a").forEach((a) => {
  if (a.dataset.page === page) a.classList.add("active");
});

/* ---------- wire WhatsApp / email links ---------- */
$$("[data-wa]").forEach((el) => {
  el.href = waLink(el.dataset.wa || "Hi AUTION 👋");
  el.target = "_blank";
  el.rel = "noopener";
});
$$("[data-mail]").forEach((el) => {
  el.href = `mailto:${AUTION.email}`;
});
$$("[data-yt]").forEach((el) => {
  el.href = AUTION.youtube;
  if (AUTION.youtube !== "#") {
    el.target = "_blank";
    el.rel = "noopener";
  }
});

/* ---------- floating chat widget ---------- */
const chatPanel = $("#chatPanel"),
  chatToggle = $("#chatToggle"),
  chatClose = $("#chatClose");
function toggleChat(open) {
  chatPanel && chatPanel.classList.toggle("open", open);
}
chatToggle &&
  chatToggle.addEventListener("click", () =>
    toggleChat(!chatPanel.classList.contains("open")),
  );
chatClose && chatClose.addEventListener("click", () => toggleChat(false));
$$(".chat-q").forEach((b) =>
  b.addEventListener("click", () => {
    openWA(b.dataset.msg || "Hi AUTION 👋");
    toggleChat(false);
  }),
);

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- stat counters ---------- */
const cio = new IntersectionObserver(
  (es) =>
    es.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      cio.unobserve(el);
      if (el.dataset.plain) {
        el.textContent = el.dataset.count;
        return;
      }
      const end = +el.dataset.count,
        suf = el.dataset.suffix || "";
      let s = null;
      const step = (t) => {
        if (!s) s = t;
        const p = Math.min((t - s) / 1100, 1),
          e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }),
  { threshold: 0.5 },
);
$$("[data-count]").forEach((el) => cio.observe(el));

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    t.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9"/></svg><span></span>';
    document.body.appendChild(t);
  }
  t.querySelector("span").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ============================================================
   Cape Town neighbourhoods (approx coords) — used by booking
   ============================================================ */
const PLACES = [
  ["UWC / Bellville campus", -33.9326, 18.6296],
  ["Bellville", -33.9026, 18.6293],
  ["Cape Town CBD", -33.9249, 18.4241],
  ["CPT International Airport", -33.969, 18.6017],
  ["Observatory", -33.937, 18.467],
  ["Rondebosch", -33.9608, 18.475],
  ["Mowbray", -33.947, 18.472],
  ["Claremont", -33.9842, 18.465],
  ["Newlands", -33.978, 18.454],
  ["Kenilworth", -33.997, 18.467],
  ["Wynberg", -34.005, 18.466],
  ["Plumstead", -34.015, 18.464],
  ["Woodstock", -33.927, 18.445],
  ["Salt River", -33.929, 18.465],
  ["Sea Point", -33.915, 18.387],
  ["Green Point", -33.907, 18.41],
  ["Camps Bay", -33.955, 18.378],
  ["Gardens", -33.932, 18.411],
  ["Bo-Kaap", -33.921, 18.411],
  ["Maitland", -33.923, 18.487],
  ["Pinelands", -33.932, 18.517],
  ["Athlone", -33.96, 18.51],
  ["Langa", -33.946, 18.53],
  ["Gugulethu", -33.98, 18.57],
  ["Nyanga", -33.99, 18.587],
  ["Samora Machel", -34.015, 18.58],
  ["Philippi", -34.005, 18.59],
  ["Mitchells Plain", -34.05, 18.618],
  ["Khayelitsha", -34.04, 18.677],
  ["Goodwood", -33.907, 18.552],
  ["Parow", -33.899, 18.592],
  ["Century City", -33.892, 18.511],
  ["Milnerton", -33.877, 18.494],
  ["Table View", -33.823, 18.487],
  ["Durbanville", -33.83, 18.65],
  ["Brackenfell", -33.873, 18.697],
  ["Kuils River", -33.923, 18.697],
  ["Atlantis", -33.566, 18.496],
  ["Strand", -34.108, 18.823],
  ["Somerset West", -34.078, 18.85],
  ["Stellenbosch", -33.932, 18.86],
].map((p) => ({ name: p[0], lat: p[1], lng: p[2] }));
// Runtime store for addresses picked from live search (not in the fixed PLACES list).
// byName() checks this too, so distance/map/WhatsApp logic works the same either way.
const dynamicPlaces = [];
const byName = (n) =>
  PLACES.find((p) => p.name === n) || dynamicPlaces.find((p) => p.name === n);
function rememberDynamicPlace(place) {
  if (!dynamicPlaces.some((p) => p.name === place.name))
    dynamicPlaces.push(place);
}
function fillSelect(el, first) {
  if (!el) return;
  el.innerHTML =
    `<option value="">${first}</option>` +
    PLACES.map((p) => `<option value="${p.name}">${p.name}</option>`).join("");
}
function km(a, b) {
  const R = 6371,
    dLat = ((b.lat - a.lat) * Math.PI) / 180,
    dLng = ((b.lng - a.lng) * Math.PI) / 180,
    s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/* ============================================================
   LIVE ADDRESS SEARCH — Photon (free, keyless OpenStreetMap geocoder)
   -------------------------------------------------------------
   Enabled. Same OSM data your map tiles already use, so it's a
   zero-cost, zero-key addition — no Google billing account needed.
   Biased toward whichever coordinates are passed in (the visitor's
   live location for pickup, or the chosen pickup point for
   destination), so results are relevant to Cape Town, not the
   world at large.

   Scaling note: the public photon.komoot.io endpoint is rate-limited
   and meant for light/demo traffic. If booking volume grows enough
   that this becomes a bottleneck, self-host Photon or move to a
   paid provider (Google Places, Mapbox) — the rest of this code
   doesn't need to change, just what liveSearchOSM() calls.
   ============================================================ */
const USE_LIVE_SEARCH = true;
async function liveSearchOSM(query, bias) {
  const lat = bias ? bias.lat : -33.93; // default centre: Cape Town, if no bias available yet
  const lon = bias ? bias.lng : 18.6;
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=6`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Photon request failed: " + res.status);
  const data = await res.json();
  return (data.features || [])
    .map((f) => {
      const p = f.properties || {};
      const label = [p.name, p.street, p.district || p.city, p.state].filter(
        Boolean,
      );
      return {
        name: [...new Set(label)].slice(0, 3).join(", "),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        live: true,
      };
    })
    .filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));
}

/* ============================================================
   Reusable Uber-style location search
   Mount on any text input to get: instant filtering of AUTION's
   own service-area list, live-fetched address suggestions from
   Photon underneath that, keyboard navigation, and a km figure per
   suggestion — distance from the chosen pickup for a destination
   field, or distance from the visitor's live location (if they
   allow it) for a pickup field. Selecting a live address stores
   its coordinates in dynamicPlaces so distance/map/WhatsApp logic
   works exactly the same as for a fixed service area.
   ============================================================ */
function mountLocationSearch({
  input,
  rowEl,
  suggestBox,
  clearBtn,
  isDestination,
  getOther,
  onChange,
}) {
  let items = []; // combined, ordered list backing keyboard nav + selection
  let activeIndex = -1;
  let userCoords = null;
  let liveResults = [];
  let liveLoading = false;
  let debounceTimer = null;
  let requestSeq = 0;

  function requestGeo() {
    if (userCoords || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!isDestination) render(input.value); // re-sort pickup list now distance is known
      },
      () => {}, // permission denied / unavailable — fail silently, local list still works
      { timeout: 5000 },
    );
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function highlight(name, q) {
    if (!q) return esc(name);
    const i = name.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return esc(name);
    return (
      esc(name.slice(0, i)) +
      "<mark>" +
      esc(name.slice(i, i + q.length)) +
      "</mark>" +
      esc(name.slice(i + q.length))
    );
  }

  function withDistance(list) {
    const other = isDestination ? getOther && getOther() : null;
    return list.map((place) => {
      let distKm = null;
      if (isDestination && other)
        distKm = km(other, place) * 1.3; // road-distance estimate, same factor used elsewhere
      else if (!isDestination && userCoords) distKm = km(userCoords, place);
      return { place, distKm };
    });
  }

  function localMatches(query) {
    const q = query.trim().toLowerCase();
    const list = q
      ? PLACES.filter((p) => p.name.toLowerCase().includes(q))
      : PLACES.slice();
    return withDistance(list);
  }

  function scheduleLiveSearch(query) {
    clearTimeout(debounceTimer);
    liveResults = [];
    liveLoading = false;
    if (!USE_LIVE_SEARCH || query.trim().length < 3) return;

    const seq = ++requestSeq;
    liveLoading = true;
    debounceTimer = setTimeout(async () => {
      try {
        const bias = isDestination ? getOther && getOther() : userCoords;
        const results = await liveSearchOSM(query, bias);
        if (seq !== requestSeq) return; // a newer keystroke already superseded this request
        // drop anything that duplicates a service-area name already shown
        liveResults = results.filter(
          (r) => !PLACES.some((p) => p.name === r.name),
        );
        liveLoading = false;
        render(input.value);
      } catch (e) {
        if (seq !== requestSeq) return;
        liveResults = [];
        liveLoading = false;
        render(input.value);
      }
    }, 300);
  }

  function render(query) {
    const local = localMatches(query);
    const live = withDistance(liveResults);
    const other = isDestination ? getOther && getOther() : null;
    const sorted = other || userCoords;

    if (sorted) {
      local.sort((a, b) => (a.distKm ?? 1e9) - (b.distKm ?? 1e9));
      live.sort((a, b) => (a.distKm ?? 1e9) - (b.distKm ?? 1e9));
    }
    items = [...local, ...live];
    activeIndex = -1;

    let html = "";
    if (!items.length && !liveLoading) {
      html = `<div class="loc-empty">No match for "${esc(query)}" — try a nearby suburb, mall, or street name.</div>`;
    } else {
      if (local.length) {
        html += `<div class="loc-suggest-label">${sorted ? "AUTION service areas · by distance" : "AUTION service areas"}</div>`;
        local.forEach((it) => {
          html += suggestionRow(it, items.indexOf(it), query);
        });
      }
      if (live.length) {
        html += `<div class="loc-suggest-label">More places nearby</div>`;
        live.forEach((it) => {
          html += suggestionRow(it, items.indexOf(it), query);
        });
      }
      if (liveLoading) {
        html += `<div class="loc-empty">Searching more places…</div>`;
      }
    }
    suggestBox.innerHTML = html;
    suggestBox.querySelectorAll(".loc-item").forEach((row) => {
      row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        select(items[+row.dataset.i].place);
      });
      row.addEventListener("mouseenter", () => {
        activeIndex = +row.dataset.i;
        paintActive();
      });
    });
  }

  function suggestionRow(it, i, query) {
    return `<div class="loc-item" data-i="${i}" role="option">
            <div class="loc-item-main">
                <span class="loc-item-ico">${it.place.live ? "🔎" : "📍"}</span>
                <span class="loc-item-name">${highlight(it.place.name, query)}</span>
            </div>
            ${it.distKm != null ? `<span class="loc-item-km">${it.distKm.toFixed(1)} km</span>` : ""}
        </div>`;
  }

  function paintActive() {
    suggestBox
      .querySelectorAll(".loc-item")
      .forEach((row) =>
        row.classList.toggle("active", +row.dataset.i === activeIndex),
      );
    const el = suggestBox.querySelector(".loc-item.active");
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function select(place) {
    if (place.live) rememberDynamicPlace(place); // so byName() can resolve it later
    input.value = place.name;
    rowEl.classList.add("has-value");
    close();
    onChange && onChange();
  }

  function open() {
    requestGeo();
    suggestBox.classList.add("open");
    render(input.value);
    scheduleLiveSearch(input.value);
  }
  function close() {
    suggestBox.classList.remove("open");
  }

  input.addEventListener("focus", open);
  input.addEventListener("input", () => {
    rowEl.classList.toggle("has-value", input.value.length > 0);
    suggestBox.classList.add("open");
    render(input.value);
    scheduleLiveSearch(input.value);
    onChange && onChange();
  });
  input.addEventListener("keydown", (e) => {
    if (!suggestBox.classList.contains("open")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      paintActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      paintActive();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[activeIndex]) select(items[activeIndex].place);
    } else if (e.key === "Escape") {
      close();
      input.blur();
    }
  });
  input.addEventListener("blur", () => setTimeout(close, 120));
  clearBtn &&
    clearBtn.addEventListener("click", () => {
      input.value = "";
      rowEl.classList.remove("has-value");
      liveResults = [];
      input.focus();
      suggestBox.classList.add("open");
      render("");
      onChange && onChange();
    });
  document.addEventListener("mousedown", (e) => {
    if (!rowEl.contains(e.target)) close();
  });

  return {
    setValue(name) {
      input.value = name || "";
      rowEl.classList.toggle("has-value", !!name);
    },
  };
}
/* ===== Reviews: see more + add-review modal (home page) ===== */
(function reviews() {
  const grid = $("#reviewsGrid"),
    seeMore = $("#seeMoreBtn");
  seeMore &&
    grid &&
    seeMore.addEventListener("click", () => {
      grid.classList.add("expanded");
      seeMore.style.display = "none";
    });

  const backdrop = $("#reviewModalBackdrop"),
    modal = $("#reviewModal"),
    openBtn = $("#addReviewBtn"),
    closeBtn = $("#reviewModalClose");
  const openModal = () => {
    backdrop.classList.add("open");
    modal.classList.add("open");
  };
  const closeModal = () => {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
  };
  openBtn && openBtn.addEventListener("click", openModal);
  closeBtn && closeBtn.addEventListener("click", closeModal);
  backdrop && backdrop.addEventListener("click", closeModal);

  const starBtns = document.querySelectorAll("#starPicker [data-star]");
  let rating = 5;
  const paintStars = () =>
    starBtns.forEach((b) =>
      b.classList.toggle("on", +b.dataset.star <= rating),
    );
  starBtns.forEach((b) =>
    b.addEventListener("click", () => {
      rating = +b.dataset.star;
      paintStars();
    }),
  );
  paintStars();

  $("#revSubmit") &&
    $("#revSubmit").addEventListener("click", () => {
      const name = $("#revName").value.trim() || "A rider";
      const role = $("#revRole").value.trim();
      const text = $("#revText").value.trim();
      if (!text) {
        $("#revText").focus();
        return;
      }
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const msg = `Hi AUTION! I'd like to leave a review.\n${stars}\nName: ${name}${role ? " (" + role + ")" : ""}\n"${text}"`;
      window.open(
        `https://wa.me/27846681513?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
      closeModal();
    });

  // gentle count-up for the numeric stats, once scrolled into view
  const counters = document.querySelectorAll(".stat-pro-num[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target,
            target = +el.dataset.count,
            span = el.querySelector(".count-target");
          let n = 0;
          const step = Math.max(1, Math.round(target / 40));
          const tick = () => {
            n = Math.min(target, n + step);
            span.textContent = n;
            if (n < target) requestAnimationFrame(tick);
          };
          tick();
          io.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => io.observe(el));
  }
})();
/* ============================================================
   BOOKING PAGE (only runs if #map exists)
   ============================================================ */
(function booking() {
  const mapEl = $("#map");
  const fromEl = $("#bkFrom"),
    toEl = $("#bkTo");
  if (!fromEl || !toEl) return;

  const fromSearch = mountLocationSearch({
    input: fromEl,
    rowEl: $("#bkFromRow"),
    suggestBox: $("#bkFromSuggest"),
    clearBtn: $('[data-clear="bkFrom"]'),
    isDestination: false,
    onChange: () => sync(),
  });
  const toSearch = mountLocationSearch({
    input: toEl,
    rowEl: $("#bkToRow"),
    suggestBox: $("#bkToSuggest"),
    clearBtn: $('[data-clear="bkTo"]'),
    isDestination: true,
    getOther: () => byName(fromEl.value),
    onChange: () => sync(),
  });
  $("#bkSwap") &&
    $("#bkSwap").addEventListener("click", () => {
      const a = fromEl.value,
        b = toEl.value;
      fromSearch.setValue(b);
      toSearch.setValue(a);
      sync();
    });

  let map,
    group,
    ready = false;
  function init() {
    if (ready || typeof L === "undefined") return;
    try {
      map = L.map(mapEl, { scrollWheelZoom: false }).setView(
        [-33.95, 18.55],
        10,
      );
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          maxZoom: 19,
          subdomains: "abcd",
        },
      ).addTo(map);
      group = L.layerGroup().addTo(map);
      ready = true;
      sync();
    } catch (e) {
      mapEl.innerHTML =
        '<div style="display:grid;place-items:center;height:100%;color:#5C6F86;text-align:center;padding:20px;font-size:.9rem">Map preview unavailable here — routing still works, just send your booking.</div>';
    }
  }
  function draw(a, b) {
    if (!ready) return;
    group.clearLayers();
    const dot = (p, c, lab) =>
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;border-radius:50%;background:${c};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).bindTooltip(lab, { direction: "top" });
    dot(a, "#1E5BFF", "Pickup: " + a.name).addTo(group);
    dot(b, "#15D6E6", "Drop-off: " + b.name).addTo(group);
    const line = L.polyline(
      [
        [a.lat, a.lng],
        [b.lat, b.lng],
      ],
      {
        color: "#1E5BFF",
        weight: 4,
        opacity: 0.9,
        dashArray: "1 9",
        lineCap: "round",
      },
    ).addTo(group);
    map.fitBounds(line.getBounds().pad(0.35));
  }
  function sync() {
    const a = byName(fromEl.value),
      b = byName(toEl.value);
    const bar = $("#estBar");
    if (a && b) {
      if (ready) draw(a, b);
      const d = km(a, b) * 1.3,
        mins = Math.max(8, Math.round((d / 40) * 60));
      $("#estDist").innerHTML = d.toFixed(1) + " <small>km</small>";
      $("#estTime").innerHTML = "~" + mins + " <small>min</small>";
      bar.style.display = "flex";
    } else if (bar) bar.style.display = "none";
  }
  // prefill from URL (?from=..&to=..) when arriving from the home hero
  const q = new URLSearchParams(location.search);
  if (q.get("from")) fromSearch.setValue(q.get("from"));
  if (q.get("to")) toSearch.setValue(q.get("to"));

  init();
  sync();

  $("#bkSubmit") &&
    $("#bkSubmit").addEventListener("click", () => {
      const g = (id) => ($("#" + id).value || "").trim();
      const from = g("bkFrom"),
        to = g("bkTo"),
        name = g("bkName"),
        phone = g("bkPhone"),
        date = g("bkDate"),
        time = g("bkTime"),
        pax = g("bkPax"),
        notes = g("bkNotes");
      if (!from || !to || !name || !phone || !date || !time) {
        toast("Please fill pickup, destination, name, number, date & time.");
        return;
      }
      let est = "";
      const a = byName(from),
        b = byName(to);
      if (a && b)
        est = `\n📍 Est. distance: ~${(km(a, b) * 1.3).toFixed(1)} km`;
      openWA(
        `🚐 *AUTION TRIP BOOKING*\n\n👤 Name: ${name}\n📞 Contact: ${phone}\n\n🟦 Pickup: ${from}\n🟩 Destination: ${to}${est}\n\n📅 Date: ${date}\n🕒 Time: ${time}\n👥 Passengers: ${pax}` +
          (notes ? `\n📝 Notes: ${notes}` : "") +
          `\n\nPlease confirm availability & fare. Thank you!`,
      );
    });
})();
/* ===== Reviews: see more + add-review modal (home page) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("reviewsTrack");
  const modal = document.getElementById("reviewModal");
  const openBtn = document.getElementById("openReviewModal");
  const closeBtn = document.getElementById("closeReviewModal");
  const reviewForm = document.getElementById("addReviewForm");

  // 1. Helper: Create HTML structure for a Review Card
  function createReviewCard(name, tag, rating, text) {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="stars">${rating}</div>
      <p>"${text}"</p>
      <div class="reviewer">
        <span class="avatar">${initials}</span>
        <div>
          <strong>${name.toUpperCase()}</strong>
          <small>${tag}</small>
        </div>
      </div>
    `;
    return card;
  }

  // 2. Load custom user reviews stored in localStorage
  const savedReviews = JSON.parse(
    localStorage.getItem("aution_reviews") || "[]",
  );
  savedReviews.forEach((r) => {
    const card = createReviewCard(r.name, r.tag, r.rating, r.text);
    track.appendChild(card);
  });

  // 3. Duplicate cards to create seamless infinite loop effect
  function setupInfiniteLoop() {
    const cards = Array.from(track.children);
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }
  setupInfiniteLoop();

  // 4. Modal Open & Close logic
  openBtn.addEventListener("click", () => modal.classList.add("active"));
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));

  // 5. Handle Form Submission (Add directly to page without reload)
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewerName").value;
    const tag = document.getElementById("reviewerTag").value;
    const rating = document.getElementById("rating").value;
    const text = document.getElementById("reviewComment").value;

    // Create & prepend new card to original track segment
    const newCard = createReviewCard(name, tag, rating, text);
    const newCloneCard = newCard.cloneNode(true);

    // Insert at front of original list and cloned list
    track.prepend(newCard);
    track.appendChild(newCloneCard);

    // Persist to localStorage
    savedReviews.push({ name, tag, rating, text });
    localStorage.setItem("aution_reviews", JSON.stringify(savedReviews));

    // Reset and close
    reviewForm.reset();
    modal.classList.remove("active");
  });
});

(function reviews() {
  const grid = $("#reviewsGrid"),
    seeMore = $("#seeMoreBtn");
  seeMore &&
    grid &&
    seeMore.addEventListener("click", () => {
      grid.classList.add("expanded");
      seeMore.style.display = "none";
    });

  const backdrop = $("#reviewModalBackdrop"),
    modal = $("#reviewModal"),
    openBtn = $("#addReviewBtn"),
    closeBtn = $("#reviewModalClose");
  const openModal = () => {
    backdrop.classList.add("open");
    modal.classList.add("open");
  };
  const closeModal = () => {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
  };
  openBtn && openBtn.addEventListener("click", openModal);
  closeBtn && closeBtn.addEventListener("click", closeModal);
  backdrop && backdrop.addEventListener("click", closeModal);

  const starBtns = document.querySelectorAll("#starPicker [data-star]");
  let rating = 5;
  const paintStars = () =>
    starBtns.forEach((b) =>
      b.classList.toggle("on", +b.dataset.star <= rating),
    );
  starBtns.forEach((b) =>
    b.addEventListener("click", () => {
      rating = +b.dataset.star;
      paintStars();
    }),
  );
  paintStars();

  $("#revSubmit") &&
    $("#revSubmit").addEventListener("click", () => {
      const name = $("#revName").value.trim() || "A rider";
      const role = $("#revRole").value.trim();
      const text = $("#revText").value.trim();
      if (!text) {
        $("#revText").focus();
        return;
      }
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const msg = `Hi AUTION! I'd like to leave a review.\n${stars}\nName: ${name}${role ? " (" + role + ")" : ""}\n"${text}"`;
      window.open(
        `https://wa.me/27846681513?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
      closeModal();
    });

  // gentle count-up for the numeric stats, once scrolled into view
  const counters = document.querySelectorAll(".stat-pro-num[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target,
            target = +el.dataset.count,
            span = el.querySelector(".count-target");
          let n = 0;
          const step = Math.max(1, Math.round(target / 40));
          const tick = () => {
            n = Math.min(target, n + step);
            span.textContent = n;
            if (n < target) requestAnimationFrame(tick);
          };
          tick();
          io.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => io.observe(el));
  }
})();
/* ============================================================
   HERO QUICK-BOOK (home page)
   ============================================================ */
(function heroBook() {
  const f = $("#pickup"),
    t = $("#destination");
  if (!f || !t) return;

  const fromSearch = mountLocationSearch({
    input: f,
    rowEl: $("#pickupRow"),
    suggestBox: $("#pickupSuggest"),
    clearBtn: $('[data-clear="pickup"]'),
    isDestination: false,
  });
  const toSearch = mountLocationSearch({
    input: t,
    rowEl: $("#destinationRow"),
    suggestBox: $("#destinationSuggest"),
    clearBtn: $('[data-clear="destination"]'),
    isDestination: true,
    getOther: () => byName(f.value),
  });
  $("#qbSwap") &&
    $("#qbSwap").addEventListener("click", () => {
      const a = f.value,
        b = t.value;
      fromSearch.setValue(b);
      toSearch.setValue(a);
    });

  $("#qbGo") &&
    $("#qbGo").addEventListener("click", () => {
      const name = ($("#qbName")?.value || "").trim(),
        phone = ($("#qbPhone")?.value || "").trim();
      const from = f.value,
        to = t.value;
      if (!from || !to) {
        toast("Pick where you are and where you’re going.");
        return;
      }
      openWA(
        `🚐 *AUTION — QUICK BOOKING*\n\n👤 Name: ${name || "(not given)"}\n📞 Contact: ${phone || "(not given)"}\n\n🟦 Pickup: ${from}\n🟩 Destination: ${to}\n\nCould you confirm availability & a fare? Thanks!`,
      );
    });
  // "see full booking + map" jumps to book page with route prefilled
  $("#qbFull") &&
    $("#qbFull").addEventListener("click", (e) => {
      if (f.value && t.value) {
        e.currentTarget.href = `book.html?from=${encodeURIComponent(f.value)}&to=${encodeURIComponent(t.value)}`;
      }
    });
})();

/* ============================================================
   COMMUNITY signup
   ============================================================ */
(function community() {
  const btn = $("#cmSubmit");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const g = (id) => ($("#" + id).value || "").trim();
    const name = g("cmName"),
      uni = g("cmUni"),
      contact = g("cmContact");
    if (!name || !contact) {
      toast("Add your name and a way to reach you.");
      return;
    }
    openWA(
      `✨ *JOIN AUTION COMMUNITY*\n\n👤 Name: ${name}\n🎓 University/City: ${uni || "—"}\n📬 Contact: ${contact}\n\nI'd like to join the community!`,
    );
    toast("Opening WhatsApp — welcome aboard!");
  });
})();

/* ============================================================
   CONTACT form
   ============================================================ */
(function contact() {
  const btn = $("#ctSubmit");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const g = (id) => ($("#" + id).value || "").trim();
    const name = g("ctName"),
      topic = $("#ctTopic")?.value || "General",
      msg = g("ctMsg");
    if (!name || !msg) {
      toast("Please add your name and a message.");
      return;
    }
    openWA(
      `💬 *AUTION ENQUIRY*\n\n👤 Name: ${name}\n🏷️ Topic: ${topic}\n\n${msg}`,
    );
  });
})();

/* ============================================================
   TEAM grid (renders on team.html) — edit names/roles/bios here
   ============================================================ */
(function team() {
  const grid = $("#teamGrid");
  if (!grid) return;
  const TEAM = [
    {
      n: "Advocate Tladi",
      r: "CTO · Chief Technology Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-1.jpg",
      b: "Drives direction and keeps the eight aligned on the long-term plan.",
    },
    {
      n: "Sfundo Makhanya",
      r: "CFO · Chief Financial Officer",
      u: "KwaZulu-Natal",
      img: "assets/img/team-2.jpg",
      b: "Keeps trips running smoothly and the day-to-day moving.",
    },
    {
      n: "Elihle Zenzile",
      r: "COO · Chief Operating Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-3.jpg",
      b: "Tracks every rand in and out — discipline is the foundation.",
    },
    {
      n: "Awethu Hero Nzimande",
      r: "CHRO · Chief Human Resource Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-4.jpg",
      b: "Builds the relationships that open new routes and opportunities.",
    },
    {
      n: "Sibabalwe Mbange",
      r: "CMP · Chief Marketing Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-5.jpg",
      b: "Manages drivers, schedules and the standard riders feel every trip.",
    },
    {
      n: "Yamukela Mafenuka",
      r: "Chief Growth Officer · Company Secretary",
      u: "University of the Western Cape",
      img: "assets/img/team-6.jpg",
      b: "Qoute.",
    },
    {
      n: "Denzel Vundla",
      r: "CEO · Chief Executive Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-7.jpg",
      b: "Leads The Collection and how AUTION shows up to the world.",
    },
    {
      n: "Nkululeko Sedi",
      r: "CCO · Chief Compliance Officer",
      u: "University of the Western Cape",
      img: "assets/img/team-8.jpg",
      b: "Grows the community and keeps students at the centre of it all.",
    },
  ];
  grid.innerHTML = TEAM.map(
    (m, i) => `
    <div class="team-card reveal d${i % 3}">
      <div class="team-photo"><img src="${m.img}" alt="${m.n}" loading="lazy"></div>
      <h3>${m.n}</h3>
      <div class="role">${m.r}</div>
      <div class="bar"></div>
      <p>${m.b}</p>
      <div class="uni"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" stroke-linecap="round" stroke-linejoin="round"/></svg>${m.u}</div>
    </div>`,
  ).join("");
  $$("#teamGrid .reveal").forEach((el) => io.observe(el));
})();

/* set current year in footers */
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ============================================================
   CAPE TOWN NIGHT CANVAS — animated hero background
   Table Mountain · Lion's Head · Signal Hill skyline with
   twinkling stars, city lights, moon, and bokeh depth effect.
   ============================================================ */
(function ctNight() {
  const canvas = document.getElementById("ctNight");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // ── Mountain silhouette (Devil's Peak → Table Mountain → Lion's Head → Signal Hill) ──
  // Normalized x,y (0-1). y=0 is top, y=1 is bottom.
  const MTN = [
    [0, 0.9],
    [0.05, 0.78],
    [0.1, 0.69],
    [0.16, 0.62],
    [0.21, 0.56],
    [0.25, 0.51],
    [0.28, 0.482],
    [0.31, 0.47],
    [0.33, 0.48], // Devil's Peak saddle
    [0.36, 0.46],
    [0.39, 0.442],
    [0.43, 0.435],
    [0.47, 0.431],
    [0.51, 0.433],
    [0.55, 0.44], // Table Mountain flat top
    [0.58, 0.454],
    [0.61, 0.482],
    [0.63, 0.518],
    [0.65, 0.562], // right descent
    [0.67, 0.53], // saddle
    [0.69, 0.488],
    [0.715, 0.442],
    [0.725, 0.436],
    [0.735, 0.442],
    [0.755, 0.478],
    [0.78, 0.524], // Lion's Head
    [0.82, 0.568],
    [0.88, 0.626],
    [0.94, 0.678],
    [1, 0.722], // Signal Hill
    [1, 1],
    [0, 1],
  ];

  // ── City buildings (seeded so they're stable every run) ──
  const BLDS = (() => {
    const arr = [];
    let x = 0,
      s = 2401;
    const rng = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    while (x < 1) {
      const w = 0.006 + rng() * 0.017,
        h = 0.05 + rng() * 0.22;
      arr.push({ x, w, h });
      x += w + rng() * 0.004;
    }
    return arr;
  })();

  // ── Stars ──
  const STARS = Array.from({ length: 125 }, () => ({
    xr: Math.random(),
    yr: Math.random() * 0.49,
    r: 0.4 + Math.random() * 1.3,
    base: 0.35 + Math.random() * 0.65,
    ph: Math.random() * 6.28,
    sp: 0.006 + Math.random() * 0.022,
  }));

  // ── Bokeh (soft out-of-focus city lights for depth) ──
  const BOKEH = Array.from({ length: 30 }, () => ({
    xr: Math.random(),
    yr: 0.57 + Math.random() * 0.4,
    r: 5 + Math.random() * 22,
    base: 0.035 + Math.random() * 0.1,
    ph: Math.random() * 6.28,
    sp: 0.003 + Math.random() * 0.009,
    c: [
      "255,175,55",
      "255,215,90",
      "255,245,190",
      "170,220,255",
      "210,195,255",
    ][~~(Math.random() * 5)],
  }));

  // ── City point lights ──
  const LTRS = Array.from({ length: 260 }, () => ({
    xr: Math.random(),
    yr: 0.65 + Math.random() * 0.33,
    r: 0.5 + Math.random() * 1.8,
    base: 0.3 + Math.random() * 0.68,
    ph: Math.random() * 6.28,
    sp: 0.004 + Math.random() * 0.017,
    c: [
      "255,215,120",
      "255,175,75",
      "255,245,195",
      "175,225,255",
      "255,255,255",
    ][~~(Math.random() * 5)],
  }));

  // ── Resize ──
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);
  resize();

  // ── Main draw loop ──
  function draw() {
    const W = canvas.width,
      H = canvas.height;
    if (!W || !H) {
      requestAnimationFrame(draw);
      return;
    }
    const t = Date.now() / 1000;

    // Clear canvas — real Cape Town photo background shows through
    ctx.clearRect(0, 0, W, H);

    // Semi-transparent atmospheric overlay (night mood on top of photo)
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(1,2,4,0.65)");
    sky.addColorStop(0.3, "rgba(2,10,28,0.50)");
    sky.addColorStop(0.57, "rgba(4,18,44,0.35)");
    sky.addColorStop(0.75, "rgba(12,21,40,0.45)");
    sky.addColorStop(0.89, "rgba(19,15,8,0.58)");
    sky.addColorStop(1, "rgba(27,16,5,0.70)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // City warm glow at horizon
    const gy = H * 0.8;
    const cg = ctx.createRadialGradient(W * 0.48, gy, 0, W * 0.48, gy, W * 0.7);
    cg.addColorStop(0, "rgba(255,138,38,.17)");
    cg.addColorStop(0.45, "rgba(235,95,18,.08)");
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);

    // Moon
    const mx = W * 0.79,
      my = H * 0.11;
    const moonHalo = ctx.createRadialGradient(mx, my, 0, mx, my, H * 0.08);
    moonHalo.addColorStop(0, "rgba(255,255,245,.95)");
    moonHalo.addColorStop(0.26, "rgba(240,240,220,.45)");
    moonHalo.addColorStop(0.55, "rgba(210,220,255,.10)");
    moonHalo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = moonHalo;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,248,.92)";
    ctx.beginPath();
    ctx.arc(mx, my, H * 0.022, 0, 6.28);
    ctx.fill();

    // Stars
    STARS.forEach((s) => {
      s.ph += s.sp;
      const a = s.base * (0.55 + 0.45 * Math.sin(s.ph));
      const x = s.xr * W,
        y = s.yr * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 2.4);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, s.r * 2.4, 0, 6.28);
      ctx.fill();
    });

    // Bokeh
    BOKEH.forEach((b) => {
      b.ph += b.sp;
      const a = b.base * (0.5 + 0.5 * Math.sin(b.ph));
      const x = b.xr * W,
        y = b.yr * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, `rgba(${b.c},${a})`);
      g.addColorStop(1, `rgba(${b.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, 6.28);
      ctx.fill();
    });

    // City point lights
    LTRS.forEach((l) => {
      l.ph += l.sp;
      const a = l.base * (0.62 + 0.38 * Math.sin(l.ph));
      const x = l.xr * W,
        y = l.yr * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, l.r * 4.2);
      g.addColorStop(0, `rgba(${l.c},${a})`);
      g.addColorStop(1, `rgba(${l.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, l.r * 4.2, 0, 6.28);
      ctx.fill();
    });

    // Lion's Head summit beacon (slow pulse)
    const bx = W * 0.725,
      by = H * 0.436;
    const bp = Math.max(0, Math.sin(t * 1.8));
    const bG = ctx.createRadialGradient(bx, by, 0, bx, by, H * 0.026);
    bG.addColorStop(0, `rgba(255,255,255,${0.22 + 0.56 * bp})`);
    bG.addColorStop(0.4, `rgba(190,210,255,${0.08 + 0.18 * bp})`);
    bG.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bG;
    ctx.beginPath();
    ctx.arc(bx, by, H * 0.026, 0, 6.28);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();
