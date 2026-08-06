(function () {
  "use strict";

  class FoundViewModel {
    constructor(store) {
      this.store = store;
      this.filterEl = document.getElementById("found-filter");
      this.listEl = document.getElementById("found-list");
      this.emptyEl = document.getElementById("found-empty");
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
      if (type === "all") return this.store.getAll("found");
      return this.store.getAll("found").filter(function (item) {
        return item.type === type;
      });
    }

    render() {
      Views.fillTypes(this.filterEl, this.store.getTypes("found"));
      Views.renderList(this.listEl, this.emptyEl, this.getFiltered(), "found");
    }
  }

  window.FoundViewModel = FoundViewModel;
})();
