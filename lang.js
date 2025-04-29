const translations = {
    en: {
      title: "Discover Your Zodiac and Elements",
      label_birth: "Date of Birth:",
      label_hour: "Birth Hour (0–23h):",
      label_timezone: "Birth Timezone (Local):",
      label_branch: "Birth Time (Traditional Zodiac):",
      button_submit: "Analyze My Fortune",
      back: "🔙 Re-enter Information"
    },
    ko: {
      title: "나의 사주와 오행 알아보기",
      label_birth: "생년월일:",
      label_hour: "태어난 시각 (0~23시):",
      label_timezone: "출생 시간대 (현지 기준):",
      label_branch: "태어난 시각 (한국 전통):",
      button_submit: "사주 분석하기",
      back: "🔙 다시 입력"
    }
  };
  
  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.innerText = translations[lang][key];
      }
    });
  }
  
  function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyTranslations(lang);
  }
  
  // 페이지 로딩 시 저장된 언어 자동 적용
  window.onload = function () {
    const savedLang = localStorage.getItem("lang") || "ko";
    applyTranslations(savedLang);
  };
  