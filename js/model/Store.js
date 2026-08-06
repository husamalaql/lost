(function () {
  "use strict";

  var DEFAULT_DATA = {
    lost: [],
    found: [],
  };

  var API_URL = "/api/db";

  class Store {
    constructor() {
      this.data = null;
      this.onError = null;
    }

    _fail(e, message) {
      if (typeof this.onError === "function") {
        this.onError(message || I18n.t("errServer"), e);
      }
    }

    _readServerError(res) {
      return res
        .json()
        .then(function (j) {
          return (j && j.error) || null;
        })
        .catch(function () {
          return null;
        });
    }

    async init() {
      try {
        var res = await fetch(API_URL);
        if (!res.ok) throw new Error("HTTP " + res.status);
        var parsed = await res.json();
        if (parsed && Array.isArray(parsed.lost) && Array.isArray(parsed.found)) {
          this.data = parsed;
        } else {
          this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
      } catch (e) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this._fail(e, I18n.t("errLoad"));
      }
      return this.data;
    }

    getAll(section) {
      return (this.data && this.data[section]) || [];
    }

    getTypes(section) {
      var set = new Set();
      this.getAll(section).forEach(function (item) {
        if (item.type) set.add(item.type);
      });
      return Array.from(set);
    }

    nextId(section) {
      var max = 0;
      this.getAll(section).forEach(function (item) {
        if (Number(item.id) > max) max = Number(item.id);
      });
      return max + 1;
    }

    async add(section, item) {
      item.browserId = Utils.getBrowserId();
      item.id = this.nextId(section);
      this.data[section].push(item);

      try {
        var res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: section, item: item }),
        });
        if (!res.ok) {
          var serr = await this._readServerError(res);
          throw new Error("HTTP " + res.status + (serr ? " - " + serr : ""));
        }
        var saved = await res.json();
        item.id = saved.id;
      } catch (e) {
        this.data[section] = this.data[section].filter(function (x) {
          return x !== item;
        });
        this._fail(e, I18n.t("errSave") + ": " + e.message);
        throw e;
      }
      return item;
    }

    async remove(section, id) {
      var list = this.data[section];
      var idx = -1;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      var removed = list[idx];
      list.splice(idx, 1);

      try {
        var res = await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: section, id: id }),
        });
        if (!res.ok) {
          var serr = await this._readServerError(res);
          throw new Error("HTTP " + res.status + (serr ? " - " + serr : ""));
        }
      } catch (e) {
        list.splice(idx, 0, removed);
        this._fail(e, I18n.t("errDelete") + ": " + e.message);
        throw e;
      }
    }
  }

  Store.API = API_URL;
  Store.DEFAULT = DEFAULT_DATA;

  window.Store = Store;
})();
