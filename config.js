// ============================================================
//  KRAAPHT BAGS LTD — WEBSITE CONFIGURATION FILE
//  Edit this file to update prices, images, contact info
//  and text across the entire website automatically.
//
//  HOW TO EDIT:
//  1. Go to your GitHub repository
//  2. Click on "config.js"
//  3. Click the pencil icon (top right of the file)
//  4. Change the value you need
//  5. Click "Commit changes" at the bottom
//  6. Vercel auto-deploys in ~60 seconds. Done.
//
//  RULES:
//  - Only change the VALUES after the colon (:)
//  - Text values need "quotes"
//  - Numbers do NOT need quotes
//  - Keep all commas exactly where they are
// ============================================================

const KRAAPHT_CONFIG = {

  // ----------------------------------------------------------
  // CONTACT DETAILS
  // ----------------------------------------------------------
  contact: {
    whatsapp_number:  "233558619224",
    whatsapp_display: "+233 558 619 224",
    email:            "kraaphtbags@gmail.com",
    website:          "https://kraaphtbags.com",
    location:         "Accra, Ghana",
  },

  // ----------------------------------------------------------
  // ORDER RULES
  // ----------------------------------------------------------
  order: {
    minimum_qty:    200,
    delivery_cost:  30,
    designer_fee:   100,
    die_cut_run:    60,
    die_cut_board:  300,
    labour_per_bag: 1,
  },

  // ----------------------------------------------------------
  // PAPER PRICES (GHS per ream — 100 sheets per ream)
  // Change these when material costs change in the market
  // ----------------------------------------------------------
  paper_prices: {
    chromo_coat:    525,
    brown_card_250: 550,
    brown_paper_80: 420,
    matt_150:       695,
    duplex_300:     300,
  },

  // ----------------------------------------------------------
  // PRINTING COSTS (GHS per print run)
  // ----------------------------------------------------------
  printing: {
    one_colour:   50,
    two_colour:   100,
    three_colour: 150,
    full_colour:  200,
  },

  // ----------------------------------------------------------
  // PLATE MAKING COSTS (GHS — one-time per design)
  // Waived for returning customers with the same design
  // ----------------------------------------------------------
  plate_making: {
    one_colour:   60,
    two_colour:   120,
    three_colour: 180,
    full_colour:  240,
  },

  // ----------------------------------------------------------
  // BAGS PER SHEET
  // ----------------------------------------------------------
  bags_per_sheet: {
    a5_small:  3,
    a4_medium: 2,
    a3_large:  2,
    custom:    2,
  },

  // ----------------------------------------------------------
  // IMAGES — HOMEPAGE
  // Change the filename here when you upload a new image
  // to GitHub. Use the exact filename you upload.
  // ----------------------------------------------------------

  // =================================================================
  //  PORTFOLIO CARD LABELS
  //  Change these to update all card text across index.html
  //  and order.html automatically. No HTML editing needed.
  //
  //  Each card has:
  //    label  — small gold text  (paper type · category)
  //    name   — large white text (business name)
  //    detail — small grey line  (location / tagline)
  //             only used on 2×2 homepage cards and lifestyle rows
  //             leave as "" to hide it
  // =================================================================
  portfolio: {

    // ── HOMEPAGE 2×2 lifestyle grid ──────────────────────────────────
    //    [card_1]  [card_2]
    //    [card_3]  [card_4]
    card_1: { label: "Brown Paper 80gsm · Gold Print",      name: "The Abachs Cocktail Bar & Grill",  detail: "Dansoman, Accra" },
    card_2: { label: "Duplex Board · African Print",         name: "AL Lounge Bar & Restaurant",       detail: "Accra, Ghana"    },
    card_3: { label: "Chromo Coat · Event Bag",              name: "Young African Women Congress",     detail: "Accra, Ghana"    },
    card_4: { label: "Matt Paper 150gsm · 2-Colour Print",  name: "Channay",                          detail: "Clothing & Lifestyle Brand · Accra" },

    // ── HOMEPAGE product mockup row (label + name, always visible) ───
    //    [card_5] [card_6] [card_7] [card_8]
    card_5: { label: "Brown Card 250gsm",   name: "Braised & Assorted"    },
    card_6: { label: "Brown Paper 80gsm",   name: "The Abachs"       },
    card_7: { label: "White / Chromo Coat", name: "Clean Canvas"     },
    card_8: { label: "Duplex Board",        name: "old skull food joint"        },

    // ── ORDER PAGE top 4 hover cards (label + name on hover) ─────────
    //    [card_9] [card_10] [card_11] [card_12]
    card_9:  { label: "Brown Card 250gsm",   name: "Freedom Taste"    },
    card_10: { label: "Brown Paper 80gsm",   name: "Kassy's Kussine"       },
    card_11: { label: "Black / Chromo Coat", name: "Channay"     },
    card_12: { label: "Matt Card",        name: "Channay"        },

    // ── ORDER PAGE lifestyle row (label + name, always visible) ──────
    //    [card_13] [card_14] [card_15]
    card_13: { label: "Brown Paper 80gsm · Lifestyle",  name: "Le Pavillon"       },
    card_14: { label: "Duplex Board · Street Market",   name: "Nayasha"    },
    card_15: { label: "Chromo Coat · Event",            name: "Funeral Bag"  },

  },
  homepage: {
    hero_headline:    "Premium Paper Bags Built for Your Brand",
    hero_subtext:     "Custom-printed, eco-friendly flat bottom bags and food bowls. Pre-payment production. Delivered to your business in Accra.",
    stat_min_order:   "200+",
    stat_paper_types: "5",
    stat_delivery:    "7–10",
    stat_eco:         "100%",
  },
  // =================================================================
  //  IMAGES
  //  Change the filename value to swap any image on the website.
  //  Upload the new file to GitHub with the exact filename you type.
  //  Leave a value as "" to keep the built-in CSS placeholder.
  //  All pages update automatically on next deployment.
  // =================================================================
  images: {

    // ── GLOBAL ───────────────────────────────────────────────────────
    logo:           "logo.png",          // Site logo — top of every page

    // ── HOMEPAGE HERO ────────────────────────────────────────────────
    hero_video:     "hero_video.mp4",    // Background video
    hero_poster:    "bag_lady.png",      // Fallback image if video fails to play
    hero_ad_image:  "bag_lady.png",      // "Path to Superior Packaging" left image

    // ── HOMEPAGE PORTFOLIO — 2×2 grid ────────────────────────────────
    //  Reading order: top-left → top-right → bottom-left → bottom-right
    //
    //    [client_bag_1]  [client_bag_2]
    //    [client_bag_3]  [client_bag_4]
    //
    client_bag_1:  "client_bag_1_v2.png",   // top-left
    client_bag_2:  "client_bag_2_v2.png",   // top-right
    client_bag_3:  "client_bag_3_v2.png",   // bottom-left
    client_bag_4:  "client_bag_4_v2.png",   // bottom-right

    // ── HOMEPAGE PORTFOLIO — bottom product row ───────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_5] [client_bag_6] [client_bag_7] [client_bag_8]
    //
    client_bag_5:  "client_bag_5_v2.png",   // left
    client_bag_6:  "client_bag_6_v2.png",   // 2nd
    client_bag_7:  "client_bag_7_v2.png",   // 3rd
    client_bag_8:  "client_bag_8_v2.png",   // right

    // ── ORDER PAGE GALLERY — top 4 product shots ─────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_9] [client_bag_10] [client_bag_11] [client_bag_12]
    //
    client_bag_9:   "client_bag_9_v3.png",  // left
    client_bag_10:  "client_bag_10_v3.png", // 2nd
    client_bag_11:  "client_bag_11_v3.png", // 3rd
    client_bag_12:  "client_bag_12_v3.png", // right

    // ── ORDER PAGE GALLERY — lifestyle row ───────────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_13] [client_bag_14] [client_bag_15]
    //
    client_bag_13: "client_bag_13_v2.png",  // left
    client_bag_14: "client_bag_14_v2.png",  // centre
    client_bag_15: "client_bag_15_v2.png",  // right

    // ── ORDER PAGE — PAPER TYPE SELECTORS ────────────────────────────
    //  Shown inside the paper selection cards on the order form
    chromo_coat_paper:    "paper_chromo_v2.png",      // White / Chromo Coat
    brown_card_paper:     "paper_brown_card_v2.png",  // Brown Card 250gsm
    brown_paper_80_paper: "paper_brown_80_v2.png",    // Brown Paper 80gsm
    duplex_board_paper:   "paper_duplex_v2.png",      // Duplex Board
    matt_card_paper:      "matt_card_paper_v2.png",     // Matt Paper 150gsm

  },

};

// ============================================================
//  APPLY CONFIG TO PAGE — DO NOT EDIT BELOW THIS LINE
// ============================================================

// =================================================================
//  IMAGE UPDATER — runs on every page load
//  Finds elements with data-img="key" and sets their src from config
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
  var C = (typeof KRAAPHT_CONFIG !== "undefined") ? KRAAPHT_CONFIG : null;
  if (!C) return;

  // ── Contact & text ──────────────────────────────────────────────
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
    var cur = el.getAttribute("href");
    var hasText = cur.includes("?text=");
    el.href = "https://wa.me/" + C.contact.whatsapp_number +
      (hasText ? cur.substring(cur.indexOf("?text=")) : "");
  });
  document.querySelectorAll(".whatsapp-number").forEach(function(el) {
    el.textContent = C.contact.whatsapp_display;
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
    el.href = "mailto:" + C.contact.email;
    if (el.textContent.includes("@")) el.textContent = C.contact.email;
  });
  document.querySelectorAll(".min-order-qty").forEach(function(el) {
    el.textContent = C.order.minimum_qty;
  });
  document.querySelectorAll(".delivery-cost").forEach(function(el) {
    el.textContent = "GHS " + C.order.delivery_cost;
  });

  // ── Homepage stats ──────────────────────────────────────────────
  var stats = {
    "stat-min-order":   C.homepage.stat_min_order,
    "stat-paper-types": C.homepage.stat_paper_types,
    "stat-delivery":    C.homepage.stat_delivery,
    "stat-eco":         C.homepage.stat_eco,
  };
  Object.keys(stats).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = stats[id];
  });

  // ── IMAGE UPDATER ───────────────────────────────────────────────
  var imgs = C.images;

  // 1. All elements with data-img attribute
  document.querySelectorAll("[data-img]").forEach(function(el) {
    var key = el.getAttribute("data-img");
    var src = imgs[key];
    if (!src) return;
    if (el.tagName === "IMG") {
      el.src = src;
    } else if (el.tagName === "SOURCE") {
      el.src = src;
      var vid = el.closest("video");
      if (vid) { vid.load(); vid.play().catch(function(){}); }
    } else {
      el.style.backgroundImage = "url('" + src + "')";
    }
  });

  // 2. Hero video special handling
  var heroVid = document.getElementById("hero-vid");
  if (heroVid) {
    if (imgs.hero_poster) heroVid.poster = imgs.hero_poster;
    var heroSrc = heroVid.querySelector("source");
    if (heroSrc && imgs.hero_video) {
      heroSrc.src = imgs.hero_video;
      heroVid.load();
      heroVid.play().catch(function(){});
    }
  }

  // 3. Channay card (client_bag_4) — swap CSS bag for real image if uploaded
  var channayCard = document.getElementById("channay-card");
  if (channayCard && imgs.client_bag_4) {
    var p4 = C.portfolio.card_4;
    channayCard.innerHTML =
      '<img src="' + imgs.client_bag_4 + '" data-img="client_bag_4"' +
      ' alt="' + p4.name + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>' +
      '<div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>' +
      '<div class="absolute bottom-0 left-0 right-0 p-6">' +
      '<span class="font-label-sm text-label-sm text-accent uppercase tracking-widest text-xs mb-1 block">' + p4.label + '</span>' +
      '<p class="font-body-lg font-semibold text-white">' + p4.name + '</p>' +
      (p4.detail ? '<p class="font-body-md text-white/70 text-sm">' + p4.detail + '</p>' : '') +
      '</div>';
  }

  // ── PORTFOLIO LABEL UPDATER ─────────────────────────────────────
  var P = C.portfolio;

  // Applies label + name + optional detail to a card element
  function applyCardLabel(el, card) {
    if (!el || !card) return;
    var labelEl  = el.querySelector("[data-card-label]");
    var nameEl   = el.querySelector("[data-card-name]");
    var detailEl = el.querySelector("[data-card-detail]");
    if (labelEl)  labelEl.textContent  = card.label  || "";
    if (nameEl)   nameEl.textContent   = card.name   || "";
    if (detailEl) {
      detailEl.textContent = card.detail || "";
      detailEl.style.display = card.detail ? "" : "none";
    }
  }

  // Apply to all 15 cards by data-card attribute
  for (var i = 1; i <= 15; i++) {
    var cardEl  = document.querySelector("[data-card='" + i + "']");
    var cardCfg = P["card_" + i];
    applyCardLabel(cardEl, cardCfg);
  }

  // 4. Paper price display update on order page
  var paperPrices = C.paper_prices;
  var paperMap = {
    "chromo_coat":    paperPrices.chromo_coat,
    "brown_card_250": paperPrices.brown_card_250,
    "brown_paper_80": paperPrices.brown_paper_80,
    "matt_150":       paperPrices.matt_150,
    "duplex_300":     paperPrices.duplex_300,
  };
  document.querySelectorAll("#paper-options label[data-paper]").forEach(function(label) {
    var key = label.dataset.paper;
    if (paperMap[key] !== undefined) {
      label.dataset.price = paperMap[key];
      var priceEl = label.querySelector(".paper-price-display");
      if (priceEl) priceEl.textContent = "GHS " + paperMap[key].toLocaleString() + " / ream";
    }
  });

});
