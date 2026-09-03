/* ==========================================================================
   Renamix — Site scripts
   Small, dependency-free enhancements only.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("primary-nav");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu after a nav link is chosen.
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Exclusive accordion groups ----------
     Native <details name="..."> already makes a group exclusive in most
     modern browsers. This fallback keeps the same behavior in browsers
     that don't support the "name" attribute on <details> yet. */
  var groups = {};
  document.querySelectorAll(".accordion-item[name]").forEach(function (item) {
    var group = item.getAttribute("name");
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  });

  Object.keys(groups).forEach(function (group) {
    groups[group].forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          groups[group].forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });

  /* ---------- User guide: scroll-spy for the table of contents ---------- */
  var tocLinks = document.querySelectorAll(".guide-toc a");
  if (tocLinks.length) {
    var sections = Array.prototype.map.call(tocLinks, function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    }).filter(Boolean);

    var setActive = function (id) {
      tocLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }
})();
