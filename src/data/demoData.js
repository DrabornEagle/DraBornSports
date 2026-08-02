export const sports = [
  { id: 'all', label: 'Tümü', icon: 'apps' },
  { id: 'football', label: 'Futbol', icon: 'football' },
  { id: 'basketball', label: 'Basketbol', icon: 'basketball' },
  { id: 'volleyball', label: 'Voleybol', icon: 'fitness' },
  { id: 'tennis', label: 'Tenis', icon: 'tennisball' },
  { id: 'formula1', label: 'F1', icon: 'car-sport' },
];

export const teams = {
  fenerbahce: { id: 'fenerbahce', name: 'Fenerbahçe', short: 'FB', colors: ['#FFE500', '#163E88'] },
  galatasaray: { id: 'galatasaray', name: 'Galatasaray', short: 'GS', colors: ['#F6B900', '#C8102E'] },
  besiktas: { id: 'besiktas', name: 'Beşiktaş', short: 'BJK', colors: ['#FFFFFF', '#161616'] },
  trabzonspor: { id: 'trabzonspor', name: 'Trabzonspor', short: 'TS', colors: ['#7BC6E8', '#8A1432'] },
  arsenal: { id: 'arsenal', name: 'Arsenal', short: 'ARS', colors: ['#EF0107', '#FFFFFF'] },
  city: { id: 'city', name: 'Manchester City', short: 'MCI', colors: ['#6CABDD', '#FFFFFF'] },
  lakers: { id: 'lakers', name: 'LA Lakers', short: 'LAL', colors: ['#FDB927', '#552583'] },
  warriors: { id: 'warriors', name: 'Golden State', short: 'GSW', colors: ['#FFC72C', '#1D428A'] },
  efes: { id: 'efes', name: 'Anadolu Efes', short: 'AE', colors: ['#0057A6', '#FFFFFF'] },
  olympiacos: { id: 'olympiacos', name: 'Olympiacos', short: 'OLY', colors: ['#D71920', '#FFFFFF'] },
  vakifbank: { id: 'vakifbank', name: 'VakıfBank', short: 'VB', colors: ['#F4C400', '#191919'] },
  eczacibasi: { id: 'eczacibasi', name: 'Eczacıbaşı', short: 'ECZ', colors: ['#F47721', '#FFFFFF'] },
};

export const matches = [
  {
    id: 'm1', sport: 'football', competition: 'Trendyol Süper Lig', status: 'live', minute: "67'", startTime: '20:00',
    home: teams.fenerbahce, away: teams.galatasaray, homeScore: 2, awayScore: 1,
    venue: 'Chobani Stadyumu', viewers: '842B', favorite: true,
    events: ['12’ Talisca', '38’ Icardi', '59’ En-Nesyri'],
    stats: [
      { label: 'Topla Oynama', home: 54, away: 46, suffix: '%' },
      { label: 'Şut', home: 13, away: 9 },
      { label: 'İsabetli Şut', home: 6, away: 4 },
      { label: 'Korner', home: 5, away: 3 },
    ],
  },
  {
    id: 'm2', sport: 'basketball', competition: 'NBA', status: 'live', minute: '4. Çeyrek · 03:42', startTime: '22:30',
    home: teams.lakers, away: teams.warriors, homeScore: 96, awayScore: 93,
    venue: 'Crypto.com Arena', viewers: '315B', favorite: false,
    events: ['James 28 sayı', 'Curry 31 sayı', 'Davis 11 ribaund'],
    stats: [
      { label: 'Saha İçi', home: 51, away: 48, suffix: '%' },
      { label: 'Üçlük', home: 12, away: 15 },
      { label: 'Ribaund', home: 42, away: 36 },
      { label: 'Asist', home: 25, away: 23 },
    ],
  },
  {
    id: 'm3', sport: 'volleyball', competition: 'Sultanlar Ligi', status: 'live', minute: '4. Set', startTime: '19:00',
    home: teams.vakifbank, away: teams.eczacibasi, homeScore: 2, awayScore: 1,
    setScores: '25-21 · 22-25 · 25-19 · 14-12', venue: 'VakıfBank Spor Sarayı', viewers: '72B', favorite: false,
    events: ['Gabi 18 sayı', 'Boskovic 21 sayı'],
    stats: [
      { label: 'Hücum Sayısı', home: 48, away: 45 },
      { label: 'Blok', home: 9, away: 7 },
      { label: 'Ace', home: 6, away: 4 },
      { label: 'Hata', home: 14, away: 16 },
    ],
  },
  {
    id: 'm4', sport: 'football', competition: 'Premier League', status: 'upcoming', minute: null, startTime: '22:00',
    home: teams.arsenal, away: teams.city, homeScore: null, awayScore: null,
    venue: 'Emirates Stadium', viewers: null, favorite: true,
    events: [], stats: [],
  },
  {
    id: 'm5', sport: 'basketball', competition: 'EuroLeague', status: 'upcoming', minute: null, startTime: '21:30',
    home: teams.efes, away: teams.olympiacos, homeScore: null, awayScore: null,
    venue: 'Basketbol Gelişim Merkezi', viewers: null, favorite: false,
    events: [], stats: [],
  },
  {
    id: 'm6', sport: 'football', competition: 'Trendyol Süper Lig', status: 'finished', minute: 'MS', startTime: '17:00',
    home: teams.besiktas, away: teams.trabzonspor, homeScore: 3, awayScore: 2,
    venue: 'Tüpraş Stadyumu', viewers: null, favorite: false,
    events: ['18’ Rafa Silva', '31’ Onuachu', '48’ Rashica', '70’ Visca', '88’ Abraham'],
    stats: [
      { label: 'Topla Oynama', home: 58, away: 42, suffix: '%' },
      { label: 'Şut', home: 15, away: 10 },
      { label: 'İsabetli Şut', home: 7, away: 5 },
      { label: 'Korner', home: 6, away: 4 },
    ],
  },
];

export const dateFilters = [
  { id: 'yesterday', day: 'Cmt', date: '1 Ağu' },
  { id: 'today', day: 'Bugün', date: '2 Ağu' },
  { id: 'tomorrow', day: 'Pzt', date: '3 Ağu' },
  { id: 'day3', day: 'Sal', date: '4 Ağu' },
  { id: 'day4', day: 'Çar', date: '5 Ağu' },
];

export const leagues = [
  {
    id: 'superlig', name: 'Trendyol Süper Lig', country: 'Türkiye', sport: 'football', icon: 'TR', color: '#E31B23',
    played: 24,
    table: [
      { rank: 1, team: teams.galatasaray, played: 24, won: 19, draw: 4, lost: 1, gd: 36, points: 61, form: ['W','W','D','W','W'] },
      { rank: 2, team: teams.fenerbahce, played: 24, won: 18, draw: 4, lost: 2, gd: 32, points: 58, form: ['W','W','W','D','W'] },
      { rank: 3, team: teams.besiktas, played: 24, won: 13, draw: 6, lost: 5, gd: 18, points: 45, form: ['W','L','W','W','D'] },
      { rank: 4, team: teams.trabzonspor, played: 24, won: 11, draw: 6, lost: 7, gd: 10, points: 39, form: ['D','W','L','W','L'] },
    ],
  },
  {
    id: 'premier', name: 'Premier League', country: 'İngiltere', sport: 'football', icon: 'EN', color: '#7A2EFF',
    played: 26,
    table: [
      { rank: 1, team: teams.arsenal, played: 26, won: 19, draw: 5, lost: 2, gd: 41, points: 62, form: ['W','W','W','D','W'] },
      { rank: 2, team: teams.city, played: 26, won: 18, draw: 5, lost: 3, gd: 37, points: 59, form: ['W','D','W','W','W'] },
    ],
  },
  {
    id: 'nba', name: 'NBA', country: 'ABD', sport: 'basketball', icon: 'US', color: '#F04C3C',
    played: 58,
    table: [
      { rank: 1, team: teams.warriors, played: 58, won: 40, draw: 0, lost: 18, gd: 6.8, points: 40, form: ['W','W','L','W','W'] },
      { rank: 2, team: teams.lakers, played: 58, won: 38, draw: 0, lost: 20, gd: 4.9, points: 38, form: ['W','L','W','W','L'] },
    ],
  },
];

export const news = [
  {
    id: 'n1', category: 'DERBİ', sport: 'football', time: '12 dk önce',
    title: 'Dev derbide tempo hiç düşmedi: ikinci yarı nefesleri kesti',
    summary: 'İki ezeli rakibin yüksek tempolu mücadelesinde taktik savaş, bireysel yetenek ve tribün atmosferi öne çıktı.',
    gradient: ['#C71F37', '#5D0B19'], icon: 'football-outline', readTime: '3 dk',
  },
  {
    id: 'n2', category: 'NBA', sport: 'basketball', time: '28 dk önce',
    title: 'Son çeyrekte yıldızlar sahne aldı, fark tek topa indi',
    summary: 'Batı Konferansı’nın iki güçlü ekibi arasında oynanan karşılaşmada son bölüm büyük heyecana sahne oldu.',
    gradient: ['#5B2D91', '#26153E'], icon: 'basketball-outline', readTime: '4 dk',
  },
  {
    id: 'n3', category: 'TRANSFER', sport: 'football', time: '1 sa önce',
    title: 'Avrupa kulüpleri genç yıldız için sıraya girdi',
    summary: 'Sezonun çıkış yapan oyuncusu için farklı liglerden kulüplerin nabız yokladığı belirtiliyor.',
    gradient: ['#116B5F', '#07352F'], icon: 'swap-horizontal-outline', readTime: '2 dk',
  },
  {
    id: 'n4', category: 'F1', sport: 'formula1', time: '2 sa önce',
    title: 'Yeni aero paketi pist üstünde ilk sınavını verdi',
    summary: 'Takımlar yaz arasından önce getirdikleri güncellemeleri uzun sürüş temposunda test etti.',
    gradient: ['#D94427', '#682014'], icon: 'car-sport-outline', readTime: '5 dk',
  },
  {
    id: 'n5', category: 'VOLEYBOL', sport: 'volleyball', time: '3 sa önce',
    title: 'Final serisinde blok savunması maçın kaderini değiştirdi',
    summary: 'Kritik anlarda gelen servis serisi ve blok sayıları, dengeli geçen mücadelede belirleyici oldu.',
    gradient: ['#B36B00', '#533100'], icon: 'fitness-outline', readTime: '3 dk',
  },
];

export const notifications = [
  { id: 'nt1', icon: 'flash', color: '#FF5470', title: 'GOL!', text: 'Fenerbahçe 2-1 Galatasaray · 59’ En-Nesyri', time: '8 dk' },
  { id: 'nt2', icon: 'alarm', color: '#39B8FF', title: 'Maç başlamak üzere', text: 'Arsenal - Manchester City karşılaşmasına 30 dakika kaldı.', time: '14 dk' },
  { id: 'nt3', icon: 'newspaper', color: '#B46CFF', title: 'Yeni haber', text: 'Avrupa kulüpleri genç yıldız için sıraya girdi.', time: '1 sa' },
];
