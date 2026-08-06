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

    compressImage: function (file, cb, maxKB) {
      if (!file) return cb("");
      var maxLen = (maxKB || 100) * 1024;
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var dims = [900, 700, 520, 380, 280, 200, 140];
          var qualities = [0.85, 0.7, 0.55, 0.42, 0.3, 0.2];
          var result = "";
          for (var i = 0; i < dims.length && !result; i++) {
            var scale = Math.min(1, dims[i] / Math.max(img.width, img.height));
            var w = Math.max(1, Math.round(img.width * scale));
            var h = Math.max(1, Math.round(img.height * scale));
            var canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            for (var j = 0; j < qualities.length && !result; j++) {
              var dataUrl = canvas.toDataURL("image/jpeg", qualities[j]);
              if (dataUrl.length <= maxLen) result = dataUrl;
            }
          }
          cb(result || "");
        };
        img.onerror = function () {
          cb("");
        };
        img.src = reader.result;
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
