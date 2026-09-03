(function () {
  "use strict";

  var sections = document.querySelectorAll(".guide-section[id]");
  var navLinks = document.querySelectorAll(".guide-nav a");
  if (!sections.length || !navLinks.length) return;

  var map = {};
  navLinks.forEach(function (link) {
    map[link.getAttribute("href").replace("#", "")] = link;
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { io.observe(s); });
  }
})();
