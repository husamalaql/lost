(function () {
  "use strict";

  var DICT = {
    ar: {
      appName: "نظام المفقودات والموجودات",
      tagline: "اختر بطاقة لتصفح العناصر المفقودة أو الموجودة",
      lostItems: "المفقودات",
      foundItems: "الموجودات",
      aboutTitle: "عن البرنامج",
      aboutText:
        "برنامج بسيط يساعد الناس على استرجاع أغراضهم المفقودة والموجودة. تصفح العناصر، فلتر النتائج حسب النوع، وأضف عناصر جديدة عند العثور عليها.",
      back: "رجوع",
      allTypes: "كل الأنواع",
      addLost: "إضافة مفقود",
      addFound: "إضافة موجود",
      emptyList: "لا توجد عناصر مطابقة",
      addTitle: "إضافة عنصر",
      labelName: "اسم العنصر",
      labelNameLost: "اسم المفقود",
      labelNameFound: "اسم الموجود",
      labelType: "النوع",
      labelPhone: "رقم الهاتف",
      labelPerson: "اسم الشخص",
      labelPersonLost: "اسم صاحب المفقود",
      labelPersonFound: "اسم المتحصل",
      placeholderName: "مثال: حقيبة ظهر",
      placeholderType: "مثال: حقائب",
      placeholderPhone: "05xxxxxxxx",
      placeholderPerson: "اسم الشخص المعني",
      labelImage: "صورة العنصر",
      cancel: "إلغاء",
      save: "حفظ",
      saving: "جارِ الحفظ...",
      loading: "جارِ تحميل البيانات...",
      delete: "حذف",
      confirmDelete: "هل تريد حذف هذا العنصر؟",
      whatsapp: "طلب عبر واتساب",
      lostTime: "وقت الفقدان",
      foundTime: "وقت التحصل",
      lostPlace: "مكان الفقد",
      foundPlace: "مكان التحصل",
      contact: "رقم التواصل",
      ownerName: "اسم صاحب المفقود",
      finderName: "اسم المتحصل",
      unspecified: "غير محدد",
      waLost:
        "مرحباً، تحية طيبة،\nنفيدكم بأنه تم العثور على العنصر المفقود «{name}» ({type}) المُسجَّل في نظام المفقودات والموجودات.\nيُرجى التواصل معنا لاستلامه في أقرب وقت.\nمع جزيل الشكر والتقدير.",
      waFound:
        "مرحباً، تحية طيبة،\nأعتقد أن العنصر «{name}» ({type}) المُعلَن عنه في نظام المفقودات والموجودات يخصني.\nأرجو التواصل معي لاستلامه.\nمع جزيل الشكر والتقدير.",
      errServer: "تعذر الاتصال بالخادم",
      errLoad: "تعذر تحميل البيانات من الخادم. اعرض البيانات المحلية مؤقتاً.",
      errSave: "تعذر حفظ العنصر في الخادم",
      errDelete: "تعذر حذف العنصر من الخادم",
    },
    en: {
      appName: "Lost & Found System",
      tagline: "Pick a card to browse lost or found items",
      lostItems: "Lost Items",
      foundItems: "Found Items",
      aboutTitle: "About",
      aboutText:
        "A simple app that helps people recover their lost and found belongings. Browse items, filter by type, and add new items whenever you find them.",
      back: "Back",
      allTypes: "All types",
      addLost: "Add Lost",
      addFound: "Add Found",
      emptyList: "No matching items",
      addTitle: "Add Item",
      labelName: "Item name",
      labelNameLost: "Lost item name",
      labelNameFound: "Found item name",
      labelType: "Type",
      labelPhone: "Phone number",
      labelPerson: "Person name",
      labelPersonLost: "Owner name",
      labelPersonFound: "Finder name",
      placeholderName: "e.g. Backpack",
      placeholderType: "e.g. Bags",
      placeholderPhone: "05xxxxxxxx",
      placeholderPerson: "Contact person name",
      labelImage: "Item image",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      loading: "Loading data...",
      delete: "Delete",
      confirmDelete: "Do you want to delete this item?",
      whatsapp: "Contact on WhatsApp",
      lostTime: "Time lost",
      foundTime: "Time found",
      lostPlace: "Place lost",
      foundPlace: "Place found",
      contact: "Contact number",
      ownerName: "Owner name",
      finderName: "Finder name",
      unspecified: "Not specified",
      waLost:
        "Hello, greetings,\nWe would like to inform you that your lost item «{name}» ({type}) has been found.\nIt is listed in the Lost & Found System.\nPlease contact us to collect it as soon as possible.\nThank you.",
      waFound:
        "Hello, greetings,\nI believe that the item «{name}» ({type}) listed in the Lost & Found System belongs to me.\nPlease contact me to collect it.\nThank you.",
      errServer: "Cannot reach the server",
      errLoad: "Failed to load data from the server. Showing local data temporarily.",
      errSave: "Failed to save item on the server",
      errDelete: "Failed to delete item on the server",
    },
  };

  var I18n = {
    lang: "ar",
    onChange: null,

    t: function (key) {
      var d = DICT[this.lang] || DICT.ar;
      return d[key] != null ? d[key] : key;
    },

    f: function (key, vars) {
      var s = this.t(key);
      Object.keys(vars || {}).forEach(function (k) {
        s = s.split("{" + k + "}").join(vars[k]);
      });
      return s;
    },

    apply: function () {
      document.title = this.t("appName");
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = I18n.t(el.getAttribute("data-i18n"));
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        el.setAttribute("placeholder", I18n.t(el.getAttribute("data-i18n-placeholder")));
      });
      if (typeof this.onChange === "function") this.onChange();
    },

    setLang: function (lang) {
      this.lang = lang === "en" ? "en" : "ar";
      try {
        localStorage.setItem("lostFound_lang", this.lang);
      } catch (e) {}
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.lang === "ar" ? "rtl" : "ltr";
      this.apply();
    },

    toggle: function () {
      this.setLang(this.lang === "ar" ? "en" : "ar");
    },

    init: function () {
      var saved = null;
      try {
        saved = localStorage.getItem("lostFound_lang");
      } catch (e) {}
      this.lang = saved === "en" ? "en" : "ar";
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.lang === "ar" ? "rtl" : "ltr";
      this.apply();
    },
  };

  window.I18n = I18n;
})();
