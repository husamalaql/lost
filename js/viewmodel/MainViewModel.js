(function () {
  "use strict";

  class MainViewModel {
    constructor(store, lostVM, foundVM) {
      this.store = store;
      this.lostVM = lostVM;
      this.foundVM = foundVM;
      this.bind();
    }

    bind() {
      var vm = this;
      document.getElementById("btn-goto-lost").addEventListener("click", function () {
        vm.show("screen-lost");
        vm.lostVM.render();
      });
      document.getElementById("btn-goto-found").addEventListener("click", function () {
        vm.show("screen-found");
        vm.foundVM.render();
      });
      document.querySelectorAll("[data-back]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          vm.show("screen-main");
        });
      });
    }

    show(id) {
      document.querySelectorAll(".screen").forEach(function (s) {
        s.classList.add("hidden");
      });
      var el = document.getElementById(id);
      el.classList.remove("hidden");
      el.classList.remove("animate-screen-in");
      void el.offsetWidth;
      el.classList.add("animate-screen-in");
      window.scrollTo(0, 0);
    }
  }

  window.MainViewModel = MainViewModel;
})();
