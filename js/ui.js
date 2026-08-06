(function () {
  "use strict";

  var THEME_KEY = "lostFound_theme";

  var SUN_SVG =
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />' +
    "</svg>";

  var MOON_SVG =
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />' +
    "</svg>";

  var UI = {
    applyTheme: function (theme) {
      var dark =
        theme === "dark" ||
        (theme !== "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
      var btn = document.getElementById("btn-theme");
      if (btn) {
        btn.innerHTML = dark ? SUN_SVG : MOON_SVG;
        btn.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
      }
    },

    syncLangButton: function () {
      var btn = document.getElementById("btn-lang");
      if (btn) btn.textContent = I18n.lang === "ar" ? "EN" : "عربي";
    },

    init: function () {
      var saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (e) {}
      this.applyTheme(saved || "auto");

      var btnTheme = document.getElementById("btn-theme");
      if (btnTheme) {
        btnTheme.addEventListener("click", function () {
          var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
          try {
            localStorage.setItem(THEME_KEY, next);
          } catch (e) {}
          UI.applyTheme(next);
        });
      }

      var btnLang = document.getElementById("btn-lang");
      if (btnLang) {
        btnLang.addEventListener("click", function () {
          I18n.toggle();
          UI.syncLangButton();
        });
      }

      this.syncLangButton();
    },
  };

  window.UI = UI;
})();
