(function () {
  "use strict";

  var DEFAULT_DATA = {
    lost: [
      {
        id: 1,
        name: "محفظة جلدية",
        type: "أغراض شخصية",
        lostTime: "2026-08-05 14:30",
        lostPlace: "الحديقة المركزية",
        contact: "0555123456",
        ownerName: "أحمد علي",
        image: "",
      },
      {
        id: 2,
        name: "مفتاح سيارة",
        type: "مفاتيح",
        lostTime: "2026-08-04 18:00",
        lostPlace: "موقف السوق الكبير",
        contact: "0555667788",
        ownerName: "خالد سالم",
        image: "",
      },
      {
        id: 3,
        name: "نظارة طبية",
        type: "أغراض شخصية",
        lostTime: "2026-08-03 12:15",
        lostPlace: "المكتبة العامة",
        contact: "0566778899",
        ownerName: "منى عبدالله",
        image: "",
      },
      {
        id: 4,
        name: "ساعة يد ذهبية",
        type: "إلكترونيات",
        lostTime: "2026-08-02 20:45",
        lostPlace: "مطعم النخيل",
        contact: "0500112233",
        ownerName: "فهد العتيبي",
        image: "",
      },
      {
        id: 5,
        name: "جوال سامسونج",
        type: "إلكترونيات",
        lostTime: "2026-08-01 09:20",
        lostPlace: "مستشفى المدينة",
        contact: "0533221100",
        ownerName: "ريم محمد",
        image: "",
      },
      {
        id: 6,
        name: "حقيبة مدرسية خضراء",
        type: "حقائب",
        lostTime: "2026-07-30 15:10",
        lostPlace: "المدرسة الثانوية",
        contact: "0555443322",
        ownerName: "عمر حسن",
        image: "",
      },
      {
        id: 7,
        name: "بطاقة هوية وطنية",
        type: "مستندات",
        lostTime: "2026-07-29 11:00",
        lostPlace: "محطة النقل",
        contact: "0599988877",
        ownerName: "نورة سعد",
        image: "",
      },
      {
        id: 8,
        name: "دفتر ملاحظات",
        type: "كتب",
        lostTime: "2026-07-28 13:40",
        lostPlace: "جامعة الملك سعود",
        contact: "0544667788",
        ownerName: "تركي فهد",
        image: "",
      },
    ],
    found: [
      {
        id: 1,
        name: "حقيبة ظهر زرقاء",
        type: "حقائب",
        foundTime: "2026-08-05 16:00",
        foundPlace: "المكتبة الرئيسية",
        contact: "0555987654",
        finderName: "سارة خالد",
        image: "",
      },
      {
        id: 2,
        name: "مظلة سوداء",
        type: "أغراض شخصية",
        foundTime: "2026-08-04 17:30",
        foundPlace: "الموقف العام",
        contact: "0566998877",
        finderName: "ماجد سليمان",
        image: "",
      },
      {
        id: 3,
        name: "سماعات لاسلكية",
        type: "إلكترونيات",
        foundTime: "2026-08-03 10:05",
        foundPlace: "المقهى البلدي",
        contact: "0501122334",
        finderName: "هند يوسف",
        image: "",
      },
      {
        id: 4,
        name: "كتاب رواية",
        type: "كتب",
        foundTime: "2026-08-02 19:20",
        foundPlace: "حديقة النور",
        contact: "0533445566",
        finderName: "بدر عماد",
        image: "",
      },
      {
        id: 5,
        name: "شاحن جوال",
        type: "إلكترونيات",
        foundTime: "2026-08-01 12:50",
        foundPlace: "مقهى الانترنت",
        contact: "0555664433",
        finderName: "لمى طارق",
        image: "",
      },
      {
        id: 6,
        name: "مفتاح منزل",
        type: "مفاتيح",
        foundTime: "2026-07-31 14:10",
        foundPlace: "موقف الجامعة",
        contact: "0511223344",
        finderName: "سلطان ناصر",
        image: "",
      },
      {
        id: 7,
        name: "محفظة بنية",
        type: "أغراض شخصية",
        foundTime: "2026-07-30 08:45",
        foundPlace: "المحطة المركزية",
        contact: "0588997766",
        finderName: "غادة فوزي",
        image: "",
      },
      {
        id: 8,
        name: "نظارة شمسية",
        type: "أغراض شخصية",
        foundTime: "2026-07-29 15:35",
        foundPlace: "شاطئ العائلة",
        contact: "0577889900",
        finderName: "زياد هاشم",
        image: "",
      },
    ],
  };

  class Store {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        var raw = localStorage.getItem(Store.KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.lost) && Array.isArray(parsed.found)) {
            return parsed;
          }
        }
      } catch (e) {
        /* ignore */
      }
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    save() {
      localStorage.setItem(Store.KEY, JSON.stringify(this.data));
    }

    getAll(section) {
      return this.data[section] || [];
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

    add(section, item) {
      item.id = this.nextId(section);
      item.browserId = Utils.getBrowserId();
      this.data[section].push(item);
      this.save();
      return item;
    }

    remove(section, id) {
      this.data[section] = this.data[section].filter(function (item) {
        return item.id !== id;
      });
      this.save();
    }
  }

  Store.KEY = "lostFoundDB_v2";
  Store.DEFAULT = DEFAULT_DATA;

  window.Store = Store;
})();
