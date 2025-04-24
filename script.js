// 🌟 디버깅용 script.js (월주 문제 수정 후 - saju_data_corrected.json 사용)

const elements = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화',
  '戊': '토', '己': '토', '庚': '금', '辛': '금',
  '壬': '수', '癸': '수', '子': '수', '丑': '토', '寅': '목', '卯': '목',
  '辰': '토', '巳': '화', '午': '화', '未': '토',
  '申': '금', '酉': '금', '戌': '토', '亥': '수'
};

const hourBranches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
function getTimeBranch(hour) {
  const index = Math.floor((hour + 1) % 24 / 2);
  return hourBranches[index];
}

function getMonthBranch(terms) {
  const monthTable = {
    '입춘': '寅', '경칩': '卯', '청명': '辰',
    '입하': '巳', '망종': '午', '소서': '未',
    '입추': '申', '백로': '酉', '한로': '戌',
    '입동': '亥', '대설': '子', '소한': '丑'
  };
  for (const key in monthTable) {
    if (terms.includes(key)) {
      return monthTable[key];
    }
  }
  return '??';
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
function getTimeStem(dayStem, hourIndex) {
  if (!hourStemMap[dayStem]) return '?';
  return hourStemMap[dayStem][hourIndex];
}

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
function getMonthStem(yearStem, monthBranch) {
  const index = monthBranches.indexOf(monthBranch);
  if (!monthStemMap[yearStem] || index === -1) return '?';
  return monthStemMap[yearStem][index];
}

async function analyzeSaju(birthDate, birthHour) {
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
  const timeBranch = getTimeBranch(birthHour);
  const dayStem = dayGanji[0];
  const hourIndex = hourBranches.indexOf(timeBranch);
  const timeStem = getTimeStem(dayStem, hourIndex);
  const timeGanji = timeStem + timeBranch;

  const rawTerms = result.cd_hterms || "";
  const monthBranch = getMonthBranch(rawTerms);
  const yearStem = yearGanji[0];
  let monthStem = '?';
  if (monthBranch !== '??') {
    monthStem = getMonthStem(yearStem, monthBranch);
  }
  const monthGanji = monthStem + monthBranch;

  // 디버깅 로그
  console.log("📌 절기:", rawTerms);
  console.log("📌 월지:", monthBranch);
  console.log("📌 연간:", yearStem);
  console.log("📌 월간:", monthStem);
  console.log("📌 최종 월주:", monthGanji);

  const elementsCount = countElements([yearGanji, monthGanji, dayGanji, timeGanji]);

  document.getElementById("fortuneText").innerHTML = `
    <h3>당신의 사주</h3>
    <p>연주: ${yearGanji}, 월주: ${monthGanji}, 일주: ${dayGanji}, 시주: ${timeGanji}</p>
    <h3>오행 구성</h3>
    <ul>
      ${Object.entries(elementsCount).map(([k, v]) => `<li>${k}: ${v}</li>`).join("\n")}
    </ul>
  `;
} 
