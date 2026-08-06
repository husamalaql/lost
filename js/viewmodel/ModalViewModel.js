(function () {
  "use strict";

  class ModalViewModel {
    constructor(store) {
      this.store = store;
      this.section = "found";
      this.saving = false;
      this.isOpen = false;
      this.modal = document.getElementById("modal-add");
      this.form = document.getElementById("modal-form");
      this.imageInput = document.getElementById("field-image");
      this.submitBtn = document.getElementById("modal-submit");
      this.placeInput = document.getElementById("field-place");
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

    setSaving(on) {
      if (!this.submitBtn) return;
      this.submitBtn.disabled = on;
      if (on) {
        this.submitBtn.classList.add("opacity-60", "cursor-not-allowed");
        this.submitBtn.innerHTML =
          '<span class="inline-flex items-center justify-center gap-2">' +
          '<span class="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>' +
          I18n.t("saving") +
          "</span>";
      } else {
        this.submitBtn.classList.remove("opacity-60", "cursor-not-allowed");
        this.submitBtn.textContent = I18n.t("save");
      }
    }

    setLabels() {
      var isLost = this.section === "lost";
      document.getElementById("modal-title").textContent = I18n.t("addTitle");
      document.getElementById("label-name").textContent = I18n.t(isLost ? "labelNameLost" : "labelNameFound");
      document.getElementById("label-place").textContent = I18n.t(isLost ? "labelPlaceLost" : "labelPlaceFound");
      document.getElementById("label-person").textContent = I18n.t(isLost ? "labelPersonLost" : "labelPersonFound");
    }

    open(section) {
      this.section = section;
      this.isOpen = true;
      this.saving = false;
      this.setSaving(false);
      this.setLabels();
      this.form.reset();
      this.modal.classList.remove("hidden");
      document.getElementById("field-name").focus();
    }

    refresh() {
      if (this.isOpen) {
        this.setLabels();
        this.setSaving(false);
      }
    }

    close() {
      this.modal.classList.add("hidden");
      this.isOpen = false;
    }

    save() {
      if (this.saving) return;
      this.saving = true;
      this.setSaving(true);
      var vm = this;
      var startedAt = Date.now();
      var finish = function (fn) {
        var remain = Math.max(0, 500 - (Date.now() - startedAt));
        setTimeout(function () {
          vm.saving = false;
          vm.setSaving(false);
          if (typeof fn === "function") fn();
        }, remain);
      };
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
      var place = this.placeInput ? this.placeInput.value.trim() : "";
      if (isLost) {
        base.ownerName = document.getElementById("field-person").value.trim();
        base.lostTime = time;
        base.lostPlace = place || "غير محدد";
      } else {
        base.finderName = document.getElementById("field-person").value.trim();
        base.foundTime = time;
        base.foundPlace = place || "غير محدد";
      }

      Utils.compressImage(this.imageInput.files[0], function (dataUrl) {
        base.image = dataUrl;
        vm.store.add(vm.section, base).then(function () {
          finish(function () {
            vm.close();
            if (typeof vm.onSaved === "function") vm.onSaved();
          });
        }).catch(function () {
          finish();
        });
      });
    }
  }

  window.ModalViewModel = ModalViewModel;
})();
