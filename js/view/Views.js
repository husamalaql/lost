(function () {
  "use strict";

  var PLACEHOLDER =
    '<div class="w-full h-28 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">' +
    '<svg class="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />' +
    "</svg></div>";

  var TRASH_SVG =
    '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />' +
    "</svg>";

  var Views = {
    card: function (item, section, idx) {
      var isLost = section === "lost";
      var img = item.image
        ? '<img src="' + item.image + '" alt="' + Utils.esc(item.name) + '" class="h-28 w-full object-contain bg-white dark:bg-slate-700" />'
        : PLACEHOLDER;
      var badgeColor = isLost
        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300";
      var deleteBtn = "";
      if (item.browserId && item.browserId === Utils.getBrowserId()) {
        deleteBtn =
          '<button data-delete data-id="' + item.id + '" title="' + I18n.t("delete") + '" ' +
          'class="absolute top-1.5 end-1.5 w-6 h-6 bg-white/90 dark:bg-slate-900 rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition" style="animation-delay:' +
          (Math.min(idx, 15) * 40) + 'ms">' +
          TRASH_SVG +
          "</button>";
      }
      var delay = Math.min(idx, 15) * 40;

      return (
        '<article data-id="' + item.id + '" style="animation-delay:' + delay + 'ms" class="animate-card-pop bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition duration-300 hover:-translate-y-0.5">' +
        '<div class="relative">' + img + deleteBtn + "</div>" +
        '<div class="p-2 space-y-1">' +
        '<h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">' + Utils.esc(item.name) + "</h3>" +
        '<span class="text-[11px] font-medium px-2 py-0.5 rounded-full ' + badgeColor + '">' +
        Utils.esc(item.type || "-") +
        "</span>" +
        "</div>" +
        "</article>"
      );
    },

    renderList: function (el, emptyEl, items, section) {
      if (!items.length) {
        el.innerHTML = "";
        emptyEl.classList.remove("hidden");
        return;
      }
      emptyEl.classList.add("hidden");
      el.innerHTML = items
        .map(function (item, idx) {
          return Views.card(item, section, idx);
        })
        .join("");
    },

    fillTypes: function (select, types) {
      var selected = select.value || "all";
      var html = '<option value="all">' + I18n.t("allTypes") + "</option>";
      types.forEach(function (t) {
        html += '<option value="' + Utils.esc(t) + '">' + Utils.esc(t) + "</option>";
      });
      select.innerHTML = html;
      if (types.indexOf(selected) !== -1) {
        select.value = selected;
      } else {
        select.value = "all";
      }
    },
  };

  window.Views = Views;
})();
