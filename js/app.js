(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    I18n.init();
    UI.init();

    var store = new Store();
    var bootEl = document.getElementById("app-loading");
    var errEl = document.getElementById("app-error");

    store.onError = function (msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.classList.remove("hidden");
      clearTimeout(errEl._t);
      errEl._t = setTimeout(function () {
        errEl.classList.add("hidden");
      }, 7000);
    };

    store.init().then(function () {
      var lostVM = new LostViewModel(store);
      var foundVM = new FoundViewModel(store);
      var modalVM = new ModalViewModel(store);
      var detailVM = new DetailViewModel();

      modalVM.onSaved = function () {
        lostVM.render();
        foundVM.render();
      };

      I18n.onChange = function () {
        lostVM.render();
        foundVM.render();
        if (modalVM.isOpen) modalVM.refresh();
        if (detailVM.isOpen) detailVM.refresh();
      };

      detailVM.onDelete = function (item, section) {
        store.remove(section, item.id).catch(function () {});
        lostVM.render();
        foundVM.render();
      };

      function refresh() {
        lostVM.render();
        foundVM.render();
      }

      function findItem(section, id) {
        return store.getAll(section).find(function (i) {
          return i.id === id;
        });
      }

      function wireList(listEl, section) {
        listEl.addEventListener("click", function (e) {
          var delBtn = e.target.closest("[data-delete]");
          if (delBtn) {
            e.stopPropagation();
            var dId = Number(delBtn.getAttribute("data-id"));
            var dItem = findItem(section, dId);
            if (dItem && window.confirm(I18n.t("confirmDelete"))) {
              store.remove(section, dId).catch(function () {});
              refresh();
            }
            return;
          }

          var card = e.target.closest("[data-id]");
          if (!card) return;
          var item = findItem(section, Number(card.getAttribute("data-id")));
          if (item) detailVM.open(item, section);
        });
      }

      wireList(document.getElementById("lost-list"), "lost");
      wireList(document.getElementById("found-list"), "found");

      new MainViewModel(store, lostVM, foundVM);

      if (bootEl) bootEl.classList.add("hidden");
    });
  });
})();
