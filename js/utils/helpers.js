(function () {
  "use strict";

  var Utils = {
    uid: function () {
      return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    },

    esc: function (str) {
      return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    readImage: function (file, cb) {
      if (!file) return cb("");
      var reader = new FileReader();
      reader.onload = function () {
        cb(reader.result || "");
      };
      reader.onerror = function () {
        cb("");
      };
      reader.readAsDataURL(file);
    },

    waLink: function (contact, text) {
      var num = String(contact || "").replace(/[^0-9]/g, "");
      if (num.charAt(0) === "0" && num.length === 10) {
        num = "966" + num.slice(1);
      } else if (num.length === 9) {
        num = "966" + num;
      }
      return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
    },

    getBrowserId: function () {
      var KEY = "lostFound_browserId";
      var id = localStorage.getItem(KEY);
      if (!id) {
        id = "b-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(KEY, id);
      }
      return id;
    },
  };

  window.Utils = Utils;
})();
