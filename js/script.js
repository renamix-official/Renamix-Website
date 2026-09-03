(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Sticky nav — background/compact state on scroll
  --------------------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile menu
  --------------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileMenu.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — lightweight IntersectionObserver, transform/opacity only
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------------------
     Interactive rename demo
  --------------------------------------------------------------------- */
  var demo = document.querySelector("[data-demo]");
  if (demo) {
    var baseNames = [
      "IMG_2026_001.jpg",
      "IMG_2026_002.jpg",
      "IMG_2026_003.jpg",
      "IMG_2026_004.jpg",
      "IMG_2026_005.jpg"
    ];

    var modeSelect = demo.querySelector("[data-demo-mode]");
    var textInput = demo.querySelector("[data-demo-text]");
    var rows = demo.querySelectorAll("[data-demo-row]");

    function applyRule(name, mode, value) {
      var dot = name.lastIndexOf(".");
      var stem = dot !== -1 ? name.slice(0, dot) : name;
      var ext = dot !== -1 ? name.slice(dot) : "";
      value = value || "";

      switch (mode) {
        case "prefix":
          return { text: value + stem + ext, diffStart: 0, diffEnd: value.length };
        case "suffix":
          return { text: stem + value + ext, diffStart: stem.length, diffEnd: stem.length + value.length };
        case "replace":
          var target = "IMG";
          var replaced = stem.replace(target, value || target);
          var idx = replaced.indexOf(value || target);
          return { text: replaced + ext, diffStart: idx, diffEnd: idx + (value || target).length };
        case "case":
          return { text: (stem + ext).toLowerCase(), diffStart: 0, diffEnd: stem.length };
        default:
          return { text: name, diffStart: 0, diffEnd: 0 };
      }
    }

    function render() {
      var mode = modeSelect ? modeSelect.value : "prefix";
      var value = textInput ? textInput.value : "";

      rows.forEach(function (row, i) {
        var name = baseNames[i];
        var oldEl = row.querySelector(".old");
        var newEl = row.querySelector(".new");
        if (!oldEl || !newEl) return;

        oldEl.textContent = name;
        var result = applyRule(name, mode, value);

        if (result.diffEnd > result.diffStart) {
          var before = result.text.slice(0, result.diffStart);
          var mid = result.text.slice(result.diffStart, result.diffEnd);
          var after = result.text.slice(result.diffEnd);
          newEl.innerHTML = escapeHtml(before) + '<span class="diff">' + escapeHtml(mid) + "</span>" + escapeHtml(after);
        } else {
          newEl.textContent = result.text;
        }
      });
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    if (modeSelect) modeSelect.addEventListener("change", render);
    if (textInput) textInput.addEventListener("input", render);

    render();
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
