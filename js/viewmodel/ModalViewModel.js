(function () {
  "use strict";

  class ModalViewModel {
    constructor(store) {
      this.store = store;
      this.section = "found";
      this.modal = document.getElementById("modal-add");
      this.form = document.getElementById("modal-form");
      this.imageInput = document.getElementById("field-image");
      this.onSaved = null;

      var vm = this;
      document.getElementById("btn-add-found").addEventListener("click", function () {
        vm.open("found");
      });
      document.getElementById("btn-add-lost").addEventListener("click", function () {
        vm.open("lost");
      });
      document.getElementById("modal-close").addEventListener("click", function () {
        vm.close();
      });
      document.getElementById("modal-cancel").addEventListener("click", function () {
        vm.close();
      });
      this.modal.addEventListener("click", function (e) {
        if (e.target === vm.modal) vm.close();
      });
      this.form.addEventListener("submit", function (e) {
        e.preventDefault();
        vm.save();
      });
    }

    open(section) {
      this.section = section;
      var isLost = section === "lost";
      document.getElementById("modal-title").textContent = isLost ? "إضافة عنصر مفقود" : "إضافة عنصر موجود";
      document.getElementById("label-name").textContent = isLost ? "اسم المفقود" : "اسم الموجود";
      document.getElementById("label-person").textContent = isLost ? "اسم صاحب المفقود" : "اسم المتحصل";
      this.form.reset();
      this.modal.classList.remove("hidden");
      document.getElementById("field-name").focus();
    }

    close() {
      this.modal.classList.add("hidden");
    }

    save() {
      var vm = this;
      var now = new Date();
      var pad = function (n) {
        return String(n).padStart(2, "0");
      };
      var time =
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate()) +
        " " +
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes());

      var base = {
        name: document.getElementById("field-name").value.trim(),
        type: document.getElementById("field-type").value.trim(),
        contact: document.getElementById("field-phone").value.trim(),
        image: "",
      };

      var isLost = this.section === "lost";
      if (isLost) {
        base.ownerName = document.getElementById("field-person").value.trim();
        base.lostTime = time;
        base.lostPlace = "غير محدد";
      } else {
        base.finderName = document.getElementById("field-person").value.trim();
        base.foundTime = time;
        base.foundPlace = "غير محدد";
      }

      Utils.readImage(this.imageInput.files[0], function (dataUrl) {
        base.image = dataUrl;
        vm.store.add(vm.section, base);
        vm.close();
        if (typeof vm.onSaved === "function") vm.onSaved();
      });
    }
  }

  window.ModalViewModel = ModalViewModel;
})();
