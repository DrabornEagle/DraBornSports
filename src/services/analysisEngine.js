const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value, digits = 2) => Number((Number(value) || 0).toFixed(digits));
const safeNumber = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const safeArray = (value) => (Array.isArray(value) ? value : []);

const formScore = (form = []) => {
  const safeForm = safeArray(form);
  if (!safeForm.length) return 0.5;
  return safeForm.reduce((total, result) => (
    total + (result === 'W' ? 1 : result === 'D' ? 0.5 : 0)
  ), 0) / safeForm.length;
};

const normalizeFixture = (fixture = {}) => ({
  ...fixture,
  id: fixture.id || `demo-${Date.now()}`,
  home: fixture.home || 'Ev Sahibi',
  away: fixture.away || 'Deplasman',
  venue: fixture.venue || 'Stadyum bilgisi yok',
  city: fixture.city || 'Şehir bilgisi yok',
  day: fixture.day || 'Gün bilgisi yok',
  kickoff: fixture.kickoff || '--:--',
  quality: clamp(safeNumber(fixture.quality, 0.5), 0.25, 0.99),
  weather: {
    condition: fixture.weather?.condition || 'Bilinmiyor',
    temperature: safeNumber(fixture.weather?.temperature, 20),
    humidity: safeNumber(fixture.weather?.humidity, 50),
    wind: safeNumber(fixture.weather?.wind, 0),
  },
  odds: {
    home: Math.max(1.01, safeNumber(fixture.odds?.home, 2.1)),
    draw: Math.max(1.01, safeNumber(fixture.odds?.draw, 3.2)),
    away: Math.max(1.01, safeNumber(fixture.odds?.away, 2.9)),
    homeOrDraw: Math.max(1.01, safeNumber(fixture.odds?.homeOrDraw, 1.35)),
    awayOrDraw: Math.max(1.01, safeNumber(fixture.odds?.awayOrDraw, 1.45)),
    over15: Math.max(1.01, safeNumber(fixture.odds?.over15, 1.3)),
    over25: Math.max(1.01, safeNumber(fixture.odds?.over25, 1.8)),
    btts: Math.max(1.01, safeNumber(fixture.odds?.btts, 1.85)),
  },
  homeStats: {
    form: safeArray(fixture.homeStats?.form),
    rank: safeNumber(fixture.homeStats?.rank, 10),
    xgFor: safeNumber(fixture.homeStats?.xgFor, 1.3),
    xgAgainst: safeNumber(fixture.homeStats?.xgAgainst, 1.2),
    avgGoals: safeNumber(fixture.homeStats?.avgGoals, 2.4),
    homeWinRate: safeNumber(fixture.homeStats?.homeWinRate, 0.4),
    injuries: safeNumber(fixture.homeStats?.injuries, 0),
    restDays: safeNumber(fixture.homeStats?.restDays, 4),
  },
  awayStats: {
    form: safeArray(fixture.awayStats?.form),
    rank: safeNumber(fixture.awayStats?.rank, 10),
    xgFor: safeNumber(fixture.awayStats?.xgFor, 1.2),
    xgAgainst: safeNumber(fixture.awayStats?.xgAgainst, 1.3),
    avgGoals: safeNumber(fixture.awayStats?.avgGoals, 2.3),
    awayWinRate: safeNumber(fixture.awayStats?.awayWinRate, 0.3),
    injuries: safeNumber(fixture.awayStats?.injuries, 0),
    restDays: safeNumber(fixture.awayStats?.restDays, 4),
  },
  h2h: safeArray(fixture.h2h),
});

const countH2H = (rawFixture) => {
  const fixture = normalizeFixture(rawFixture);
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let validMatches = 0;

  fixture.h2h.forEach((entry) => {
    const score = typeof entry === 'string' ? entry : entry?.score;
    if (typeof score !== 'string') return;

    const numbers = score.match(/(\d+)\s*-\s*(\d+)/);
    if (!numbers) return;

    validMatches += 1;
    const first = Number(numbers[1]);
    const second = Number(numbers[2]);

    if (first === second) {
      draws += 1;
      return;
    }

    const startsWithHome = score.toLocaleLowerCase('tr-TR')
      .startsWith(fixture.home.toLocaleLowerCase('tr-TR'));
    const homeWon = startsWithHome ? first > second : second > first;

    if (homeWon) homeWins += 1;
    else awayWins += 1;
  });

  return {
    homeWins,
    awayWins,
    draws,
    total: Math.max(1, validMatches),
    validMatches,
  };
};

export const analyseFixture = (rawFixture = {}) => {
  const fixture = normalizeFixture(rawFixture);
  const homeForm = formScore(fixture.homeStats.form);
  const awayForm = formScore(fixture.awayStats.form);
  const h2h = countH2H(fixture);

  const formDelta = (homeForm - awayForm) * 0.22;
  const xgEdge = (
    fixture.homeStats.xgFor -
    fixture.awayStats.xgAgainst -
    (fixture.awayStats.xgFor - fixture.homeStats.xgAgainst)
  ) * 0.055;
  const rankEdge = clamp((fixture.awayStats.rank - fixture.homeStats.rank) * 0.012, -0.10, 0.10);
  const availabilityEdge = clamp(
    (fixture.awayStats.injuries - fixture.homeStats.injuries) * 0.012,
    -0.06,
    0.06,
  );
  const restEdge = clamp(
    (fixture.homeStats.restDays - fixture.awayStats.restDays) * 0.012,
    -0.04,
    0.04,
  );
  const h2hEdge = ((h2h.homeWins - h2h.awayWins) / h2h.total) * 0.07;

  let homeProbability = 0.485 + formDelta + xgEdge + rankEdge + availabilityEdge + restEdge + h2hEdge;
  let awayProbability = 0.285 - formDelta - xgEdge - rankEdge - availabilityEdge - restEdge - h2hEdge;
  let drawProbability = 0.23 - Math.abs(homeProbability - awayProbability) * 0.08;

  homeProbability = clamp(homeProbability, 0.16, 0.72);
  awayProbability = clamp(awayProbability, 0.13, 0.66);
  drawProbability = clamp(drawProbability, 0.17, 0.34);

  const total = homeProbability + drawProbability + awayProbability;
  homeProbability /= total;
  drawProbability /= total;
  awayProbability /= total;

  const expectedGoals = (
    fixture.homeStats.xgFor +
    fixture.awayStats.xgFor +
    fixture.homeStats.avgGoals +
    fixture.awayStats.avgGoals
  ) / 4;

  const over15Probability = clamp(0.54 + (expectedGoals - 2.1) * 0.16, 0.58, 0.88);
  const over25Probability = clamp(0.42 + (expectedGoals - 2.5) * 0.16, 0.38, 0.76);
  const bttsProbability = clamp(
    0.40 +
    Math.min(fixture.homeStats.xgFor, fixture.awayStats.xgFor) * 0.10 +
    Math.min(fixture.homeStats.avgGoals, fixture.awayStats.avgGoals) * 0.04,
    0.42,
    0.75,
  );
  const homeOrDrawProbability = clamp(homeProbability + drawProbability - 0.025, 0.55, 0.90);
  const awayOrDrawProbability = clamp(awayProbability + drawProbability - 0.025, 0.48, 0.86);

  const candidates = [
    { key: 'home', label: `${fixture.home} kazanır`, probability: homeProbability, odds: fixture.odds.home },
    { key: 'draw', label: 'Beraberlik', probability: drawProbability, odds: fixture.odds.draw },
    { key: 'away', label: `${fixture.away} kazanır`, probability: awayProbability, odds: fixture.odds.away },
    { key: 'homeOrDraw', label: `${fixture.home} kaybetmez (1X)`, probability: homeOrDrawProbability, odds: fixture.odds.homeOrDraw },
    { key: 'awayOrDraw', label: `${fixture.away} kaybetmez (X2)`, probability: awayOrDrawProbability, odds: fixture.odds.awayOrDraw },
    { key: 'over15', label: '1.5 Gol Üst', probability: over15Probability, odds: fixture.odds.over15 },
    { key: 'over25', label: '2.5 Gol Üst', probability: over25Probability, odds: fixture.odds.over25 },
    { key: 'btts', label: 'Karşılıklı Gol Var', probability: bttsProbability, odds: fixture.odds.btts },
  ];

  const scored = candidates.map((candidate) => {
    const impliedProbability = 1 / candidate.odds;
    const modelEdge = candidate.probability - impliedProbability;
    const safety = (
      candidate.probability * 0.72 +
      fixture.quality * 0.18 +
      clamp(modelEdge, -0.10, 0.20) * 0.10
    );
    return { ...candidate, impliedProbability, modelEdge, safety };
  });

  const recommended = [...scored]
    .filter((candidate) => candidate.probability >= 0.54)
    .sort((left, right) => right.safety - left.safety)[0]
    || [...scored].sort((left, right) => right.probability - left.probability)[0];

  const confidence = clamp(
    recommended.probability * 0.78 + fixture.quality * 0.22,
    0.42,
    0.88,
  );

  return {
    fixture,
    recommended,
    probabilities: {
      home: round(homeProbability * 100, 1),
      draw: round(drawProbability * 100, 1),
      away: round(awayProbability * 100, 1),
      over15: round(over15Probability * 100, 1),
      over25: round(over25Probability * 100, 1),
      btts: round(bttsProbability * 100, 1),
    },
    confidence: round(confidence * 100, 1),
    dataQuality: round(fixture.quality * 100, 0),
    factors: [
      {
        title: 'Form dengesi',
        detail: `${fixture.home} son 5 maç form puanı ${round(homeForm * 100, 0)}, ${fixture.away} ${round(awayForm * 100, 0)}.`,
        impact: formDelta >= 0 ? fixture.home : fixture.away,
      },
      {
        title: 'xG ve gol üretimi',
        detail: `Beklenen toplam gol ${round(expectedGoals)}; ev xG ${fixture.homeStats.xgFor}, deplasman xG ${fixture.awayStats.xgFor}.`,
        impact: expectedGoals >= 2.65 ? 'Gollü maç eğilimi' : 'Kontrollü maç eğilimi',
      },
      {
        title: 'Kadro ve dinlenme',
        detail: `Eksikler ${fixture.homeStats.injuries}-${fixture.awayStats.injuries}; dinlenme ${fixture.homeStats.restDays}-${fixture.awayStats.restDays} gün.`,
        impact: availabilityEdge + restEdge >= 0 ? fixture.home : fixture.away,
      },
      {
        title: 'Geçmiş eşleşmeler',
        detail: h2h.validMatches
          ? `Son ${h2h.validMatches} geçerli eşleşme: ${fixture.home} ${h2h.homeWins} galibiyet, ${h2h.draws} beraberlik, ${fixture.away} ${h2h.awayWins} galibiyet.`
          : 'Geçmiş eşleşme verisi bulunamadı; bu sinyal modele dahil edilmedi.',
        impact: h2h.homeWins === h2h.awayWins
          ? 'Dengeli'
          : h2h.homeWins > h2h.awayWins ? fixture.home : fixture.away,
      },
      {
        title: 'Hava ve saha',
        detail: `${fixture.venue}, ${fixture.weather.condition}, ${fixture.weather.temperature}°C, rüzgâr ${fixture.weather.wind} km/sa.`,
        impact: fixture.weather.wind > 24 || fixture.weather.condition.includes('Yağmur')
          ? 'Oyun hızını düşürebilir'
          : 'Normal koşullar',
      },
    ],
  };
};

export const buildCouponReport = (fixtures = [], stake = 100) => {
  const safeFixtures = safeArray(fixtures).filter(Boolean);
  const safeStake = clamp(safeNumber(stake, 0), 0, 1000000);
  const selections = safeFixtures.map(analyseFixture);
  const totalOdds = selections.reduce((value, item) => value * item.recommended.odds, 1);
  const combinedProbability = selections.reduce(
    (value, item) => value * item.recommended.probability,
    selections.length ? 1 : 0,
  );
  const averageQuality = selections.length
    ? selections.reduce((value, item) => value + item.fixture.quality, 0) / selections.length
    : 0;
  const theoreticalReturn = safeStake * totalOdds;
  const expectedValue = combinedProbability * theoreticalReturn - safeStake;
  const risk = combinedProbability >= 0.43
    ? 'Düşük-Orta'
    : combinedProbability >= 0.24 ? 'Orta' : 'Yüksek';

  return {
    createdAt: new Date().toISOString(),
    selections,
    totalOdds: round(totalOdds),
    combinedProbability: round(combinedProbability * 100, 1),
    averageQuality: round(averageQuality * 100, 0),
    stake: round(safeStake),
    theoreticalReturn: round(theoreticalReturn),
    expectedValue: round(expectedValue),
    risk,
    disclaimer: 'Bu değerler istatistiksel demo tahminidir; kesin sonuç veya kazanç garantisi değildir.',
  };
};

export const pickRandomFixtures = (fixtures = [], count = 1) => {
  const copy = [...safeArray(fixtures).filter(Boolean)];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, Math.min(Math.max(0, safeNumber(count, 1)), copy.length));
};

export const pickStrongestFixtures = (fixtures = [], count = 1) => (
  safeArray(fixtures)
    .filter(Boolean)
    .map((fixture) => ({ fixture, analysis: analyseFixture(fixture) }))
    .sort((left, right) => right.analysis.confidence - left.analysis.confidence)
    .slice(0, Math.min(Math.max(0, safeNumber(count, 1)), safeArray(fixtures).length))
    .map((item) => item.fixture)
);
