/* ===================================================================
   AGORA AID PROGRAM — interactions
   Vanilla JS, no dependencies. Progressive enhancement only:
   the page is fully readable with JS disabled.
   =================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------------------------------
     1. Sticky nav: add background after a little scroll
     ----------------------------------------------------------------- */
  var nav = document.getElementById("nav");

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -----------------------------------------------------------------
     2. Mobile menu toggle
     ----------------------------------------------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openMenu() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu after tapping any link inside it
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  /* -----------------------------------------------------------------
     3. FAQ accordion
     One item open at a time; smooth height transition; ARIA-wired.
     ----------------------------------------------------------------- */
  var faqRoot = document.querySelector("[data-faq]");
  if (faqRoot) {
    var items = faqRoot.querySelectorAll(".faq__item");

    items.forEach(function (item, i) {
      var btn = item.querySelector(".faq__q");
      var panel = item.querySelector(".faq__a");

      // Wire ARIA relationships
      var pid = "faq-panel-" + i;
      var bid = "faq-btn-" + i;
      panel.id = pid;
      btn.id = bid;
      btn.setAttribute("aria-controls", pid);
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", bid);

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        // Close all
        items.forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq__a").style.maxHeight = null;
        });

        // Open this one (toggle behavior)
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });

    // Keep an open panel correctly sized on resize
    window.addEventListener("resize", function () {
      var open = faqRoot.querySelector(".faq__item.is-open .faq__a");
      if (open) open.style.maxHeight = open.scrollHeight + "px";
    });
  }

  /* -----------------------------------------------------------------
     4. Scroll reveal (fade-up) via IntersectionObserver
     ----------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    // Show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* -----------------------------------------------------------------
     5. Active nav link based on section in view
     ----------------------------------------------------------------- */
  var navAnchors = Array.prototype.slice
    .call(links.querySelectorAll("a"))
    .filter(function (a) {
      return a.getAttribute("href") && a.getAttribute("href").charAt(0) === "#";
    });

  var sectionMap = navAnchors
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      return section ? { anchor: a, section: section } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sectionMap.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          sectionMap.forEach(function (m) {
            m.anchor.classList.toggle(
              "is-active",
              m.section.id === id && !m.anchor.classList.contains("nav__cta")
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionMap.forEach(function (m) {
      spy.observe(m.section);
    });
  }

  /* -----------------------------------------------------------------
     6. Lightbox for the offer-letter gallery
     ----------------------------------------------------------------- */
  var lb = document.getElementById("lightbox");
  var tiles = Array.prototype.slice.call(
    document.querySelectorAll(".gallery__tile")
  );

  if (lb && tiles.length) {
    var lbImg = document.getElementById("lightbox-img");
    var lbCount = document.getElementById("lightbox-count");
    var btnClose = document.getElementById("lightbox-close");
    var btnPrev = document.getElementById("lightbox-prev");
    var btnNext = document.getElementById("lightbox-next");
    var current = 0;
    var lastFocused = null;

    function show(i) {
      current = (i + tiles.length) % tiles.length; // wrap around
      var tile = tiles[current];
      var img = tile.querySelector("img");
      lbImg.src = tile.getAttribute("data-full");
      lbImg.alt = img ? img.alt : "Offer letter";
      lbCount.textContent = current + 1 + " / " + tiles.length;
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      btnNext.focus();
    }

    function close() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      lbImg.src = "";
      if (lastFocused) lastFocused.focus();
    }

    tiles.forEach(function (tile, i) {
      tile.addEventListener("click", function () {
        open(i);
      });
    });

    btnPrev.addEventListener("click", function () { show(current - 1); });
    btnNext.addEventListener("click", function () { show(current + 1); });
    btnClose.addEventListener("click", close);

    // Click on the dark backdrop (not the image or buttons) closes
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) {
        close();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
