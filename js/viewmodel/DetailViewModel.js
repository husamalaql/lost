(function () {
  "use strict";

  var PLACEHOLDER_ICON =
    '<svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />' +
    "</svg>";

  class DetailViewModel {
    constructor() {
      this.modal = document.getElementById("modal-detail");
      this.item = null;
      this.section = null;
      this.onDelete = null;

      var vm = this;
      document.getElementById("detail-close").addEventListener("click", function () {
        vm.close();
      });
      document.getElementById("detail-cancel").addEventListener("click", function () {
        vm.close();
      });
      document.getElementById("detail-delete").addEventListener("click", function () {
        if (!vm.item) return;
        if (window.confirm("هل تريد حذف هذا العنصر؟")) {
          var item = vm.item;
          var section = vm.section;
          vm.close();
          if (typeof vm.onDelete === "function") vm.onDelete(item, section);
        }
      });
      this.modal.addEventListener("click", function (e) {
        if (e.target === vm.modal) vm.close();
      });
    }

    open(item, section) {
      this.item = item;
      this.section = section;
      var isLost = section === "lost";

      var deleteBtn = document.getElementById("detail-delete");
      var isOwn = item.browserId && item.browserId === Utils.getBrowserId();
      deleteBtn.classList.toggle("hidden", !isOwn);
      deleteBtn.classList.toggle("flex-1", isOwn);

      var imageEl = document.getElementById("detail-image");
      imageEl.innerHTML = item.image ? '<img src="' + item.image + '" alt="' + Utils.esc(item.name) + '" class="w-full h-full object-contain" />' : PLACEHOLDER_ICON;

      document.getElementById("detail-name").textContent = item.name;
      var typeEl = document.getElementById("detail-type");
      typeEl.textContent = item.type || "-";
      typeEl.className =
        "inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3 " +
        (isLost ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800");

      var rows = [
        { label: isLost ? "وقت الفقدان" : "وقت التحصل", value: isLost ? item.lostTime : item.foundTime },
        { label: isLost ? "مكان الفقد" : "مكان التحصل", value: isLost ? item.lostPlace : item.foundPlace },
        { label: "رقم التواصل", value: item.contact },
        { label: isLost ? "اسم صاحب المفقود" : "اسم المتحصل", value: isLost ? item.ownerName : item.finderName },
      ];

      document.getElementById("detail-fields").innerHTML = rows
        .map(function (r) {
          return (
            '<div class="flex justify-between gap-4 border-b border-slate-100 pb-1.5">' +
            '<span class="text-slate-400 shrink-0">' + r.label + "</span>" +
            '<span class="text-slate-800 font-medium text-left">' + Utils.esc(r.value || "-") + "</span>" +
            "</div>"
          );
        })
        .join("");

      var message =
        "مرحباً، أنا مهتم بعنصر «" + item.name + "» (" + (item.type || "-") +
        ") المُعلن عنه في نظام المفقودات والموجودات. هل ما زال متاحاً؟";
      document.getElementById("detail-whatsapp").setAttribute("href", Utils.waLink(item.contact, message));

      this.modal.classList.remove("hidden");
    }

    close() {
      this.modal.classList.add("hidden");
    }
  }

  window.DetailViewModel = DetailViewModel;
})();
