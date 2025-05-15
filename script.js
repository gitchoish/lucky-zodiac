// 🌟 Lucky Zodiac 사주 분석 스크립트 (최종 통합)

const elements = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화',
  '戊': '토', '己': '토', '庚': '금', '辛': '금',
  '壬': '수', '癸': '수', '子': '수', '丑': '토', '寅': '목', '卯': '목',
  '辰': '토', '巳': '화', '午': '화', '未': '토',
  '申': '금', '酉': '금', '戌': '토', '亥': '수'
};

const hourBranches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const hourStemMap = {
  '甲': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
  '乙': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '丙': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '丁': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '戊': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  '己': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
  '庚': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '辛': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '壬': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '癸': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
};

const monthStemMap = {
  '甲': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '乙': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '丙': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '丁': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  '戊': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
  '己': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '庚': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '辛': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '壬': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  '癸': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙']
};

const monthBranches = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

function getMonthBranch(terms) {
  const monthTable = {
    '입춘': '寅', '경칩': '卯', '청명': '辰',
    '입하': '巳', '망종': '午', '소서': '未',
    '입추': '申', '백로': '酉', '한로': '戌',
    '입동': '亥', '대설': '子', '소한': '丑'
  };
  for (const key in monthTable) {
    if (terms.includes(key)) return monthTable[key];
  }
  return '??';
}

function getMonthStem(yearStem, monthBranch) {
  const index = monthBranches.indexOf(monthBranch);
  if (!monthStemMap[yearStem] || index === -1) return '?';
  return monthStemMap[yearStem][index];
}

function getTimeStem(dayStem, hourBranch) {
  const index = hourBranches.indexOf(hourBranch);
  if (!hourStemMap[dayStem] || index === -1) return '?';
  return hourStemMap[dayStem][index];
}

function countElements(ganjis) {
  const count = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  ganjis.forEach(ganji => {
    for (const ch of ganji) {
      if (elements[ch]) count[elements[ch]]++;
    }
  });
  return count;
}

async function analyzeSaju(birthDate, hourBranch) {
  const res = await fetch("saju_data_corrected.json");
  const data = await res.json();

  const dateObj = new Date(birthDate);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const result = data.find(d => d.cd_sy === year && d.cd_sm === month && d.cd_sd === day);
  if (!result) {
    alert("해당 날짜의 사주 정보가 없습니다.");
    return;
  }

  const yearGanji = result.cd_hyganjee;
  const dayGanji = result.cd_hdganjee;
  const dayStem = dayGanji[0];
  const timeStem = getTimeStem(dayStem, hourBranch);
  const timeGanji = timeStem + hourBranch;

  const rawTerms = result.cd_hterms || "";
  const monthBranch = getMonthBranch(rawTerms);
  const yearStem = yearGanji[0];
  let monthStem = '?';
  if (monthBranch !== '??') {
    monthStem = getMonthStem(yearStem, monthBranch);
  }
  const monthGanji = monthStem + monthBranch;

  const elementsCount = countElements([yearGanji, monthGanji, dayGanji, timeGanji]);

  document.getElementById("fortuneText").innerHTML = `
    <h3>당신의 사주</h3>
    <p>연주: ${yearGanji}, 월주: ${monthGanji}, 일주: ${dayGanji}, 시주: ${timeGanji}</p>
    <h3>오행 구성</h3>
    <ul>
      ${Object.entries(elementsCount).map(([k, v]) => `<li>${k}: ${v}</li>`).join("\n")}
    </ul>
  `;

  // Gemini AI 운세 생성
  const isEnglish = localStorage.getItem("lang") === "en";
  const prompt = isEnglish
  ? `This is a person's Four Pillars:
  - Year Pillar: ${yearGanji}
  - Month Pillar: ${monthGanji}
  - Day Pillar: ${dayGanji}
  - Hour Pillar: ${timeGanji}

  Please give this person a warm fortune telling in 3–4 sentences in English.`
    : `다음은 한 사람의 사주입니다.
  - 연주: ${yearGanji}
  - 월주: ${monthGanji}
  - 일주: ${dayGanji}
  - 시주: ${timeGanji}

  이 사람을 위한 오늘의 운세를 따뜻한 말투로 3~4문장으로 알려주세요.`;


  try {
    const response = await fetch("https://lucky-zodiac-worker.csh9609.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    document.getElementById("fortuneAI").innerText = result.reply;
  } catch (err) {
    console.error("🚫 AI 호출 실패:", err);
    document.getElementById("fortuneAI").innerText = "AI 운세를 불러오지 못했어요.";
  }
}
