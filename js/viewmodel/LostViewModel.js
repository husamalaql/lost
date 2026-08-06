(function () {
  "use strict";

  class LostViewModel {
    constructor(store) {
      this.store = store;
      this.filterEl = document.getElementById("lost-filter");
      this.listEl = document.getElementById("lost-list");
      this.emptyEl = document.getElementById("lost-empty");
      this.bind();
    }

    bind() {
      var vm = this;
      this.filterEl.addEventListener("change", function () {
        vm.render();
      });
    }

    getFiltered() {
      var type = this.filterEl.value;
      if (type === "all") return this.store.getAll("lost");
      return this.store.getAll("lost").filter(function (item) {
        return item.type === type;
      });
    }

    render() {
      Views.fillTypes(this.filterEl, this.store.getTypes("lost"));
      Views.renderList(this.listEl, this.emptyEl, this.getFiltered(), "lost");
    }
  }

  window.LostViewModel = LostViewModel;
})();
