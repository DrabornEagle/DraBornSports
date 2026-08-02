# DraBornSports v0.1 Demo

DraBornSports; futbol, basketbol, voleybol, tenis ve Formula 1 içeriklerini tek modern mobil deneyimde toplayan spor uygulaması demosudur.

## v0.1 kapsamı

- Animasyonlu açılış ve modern koyu spor teması
- Çoklu spor filtreleri
- Canlı skor ve maç kartları
- Fikstür, sonuç, canlı, yaklaşan ve favori filtreleri
- Maç merkezi: özet, momentum, istatistik ve olay akışı
- Lig ve puan durumu ekranları
- Spor haberleri ve haber detay ekranı
- Uygulama içi arama
- Bildirim merkezi demosu
- Favori maç/takım deneyimi
- Profil ve bildirim tercihleri
- Tamamen yerel demo verileri; Supabase veya başka veritabanı yok

## Teknoloji

- Expo SDK 54
- React Native 0.81.5
- React 19.1
- Expo Go uyumlu paketler
- `Animated`, `expo-linear-gradient`, `expo-haptics`, `@expo/vector-icons`

## Android / Termux kurulumu

```bash
pkg update -y
pkg install -y git nodejs-lts
mkdir -p "$HOME/projects"
cd "$HOME/projects"
rm -rf DraBornSports
git clone https://github.com/DrabornEagle/DraBornSports.git
cd DraBornSports
npm install
npx expo start --tunnel
```

Expo Go uygulamasında terminalde oluşan QR kodunu okutun.

Aynı Wi-Fi ağı kullanılıyorsa daha hızlı başlatmak için:

```bash
npx expo start --lan
```

Önbellek sorunu yaşanırsa:

```bash
npx expo start --clear --tunnel
```

## Demo notu

Bu sürümde skorlar, fikstürler, lig tabloları, haberler ve bildirimler `src/data/demoData.js` dosyasından gelir. Gerçek veri ve kullanıcı sistemi, tasarım onayından sonra Supabase ve uygun spor veri sağlayıcısıyla entegre edilecektir.
