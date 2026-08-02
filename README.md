# DraBornSports v0.2 Demo

DraBornSports; spor karşılaşmalarını, ligleri ve haberleri modern mobil arayüzde sunan; v0.2 ile birlikte yerel demo verilerinden olasılık raporu üreten Expo uygulamasıdır.

## v0.2 yenilikleri

- Expo SDK 57 ve Expo Go 57.0.2 uyumluluğu
- Android uygulama sürümü `0.2.0`
- Android `versionCode: 1`
- 18+ yaş ve sorumlu analiz bilgilendirmesi
- Kupon Analiz ekranı
- Tarih ve maç sayısı seçimi
- Teorik tutar ve teorik getiri hesabı
- Rastgele kupon ve en güçlü seçim modu
- Form, xG, saha, hava, eksikler, dinlenme ve geçmiş eşleşme analizi
- Model olasılığı, veri kalitesi ve risk seviyesi
- Yalnızca manuel çalıştırılan Release APK ve Release AAB workflowları
- Yerel demo verileri; gerçek bahis işlemi, ödeme veya bahis sitesi yönlendirmesi yok

## Önemli açıklama

DraBornSports bahis oynatmaz, para yatırma/çekme işlemi yapmaz ve üçüncü taraf bahis sitesine yönlendirme içermez. Olasılık, oran ve teorik getiri değerleri eğitim amaçlı demo simülasyonudur. Hiçbir sonuç veya kazanç garanti edilmez.

## Termux — v0.1’i yedekle, v0.2’ye geç ve GitHub ile eşitle

Repo içindeki otomatik yedekleme/eşitleme betiğini çalıştırın:

```bash
cd "$HOME/projects/DraBornSports"
git fetch --all --prune
git checkout main
git reset --hard origin/main
chmod +x scripts/termux_sync_v0.2.sh
bash scripts/termux_sync_v0.2.sh
npx expo start --clear --tunnel
```

Betik, güncellemeden önce lokal projenin `.tar.gz` arşivini ve ayrıca Git dalı/etiketi yedeğini oluşturur; ardından lokali `origin/main` ile birebir eşitler.

## İlk kurulum

```bash
pkg update -y
pkg install -y git nodejs-lts

mkdir -p "$HOME/projects"
cd "$HOME/projects"
rm -rf DraBornSports

git clone https://github.com/DrabornEagle/DraBornSports.git
cd DraBornSports

npm install
npx expo install --check
npx expo-doctor
npx expo start --clear --tunnel
```

## v0.1’e geri dönme

```bash
cd "$HOME/projects/DraBornSports"
git fetch --all --prune
git checkout main
git reset --hard origin/main
chmod +x scripts/termux_rollback_v0.1.sh
bash scripts/termux_rollback_v0.1.sh
```

Geri alma betiği `rollback-v0.1` adlı ayrı bir dal açar; `main` dalını bozmaz. v0.1, Expo SDK 54 tabanlı olduğu için SDK 54 uyumlu Expo Go gerektirir.

Tekrar v0.2’ye dönmek için:

```bash
cd "$HOME/projects/DraBornSports"
git fetch --all --prune
git checkout main
git reset --hard origin/main
git clean -fd
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear --tunnel
```

## Release workflowları

Workflowlar yalnızca GitHub Actions ekranından manuel çalıştırılır:

- `DraBornSports Release APK`
- `DraBornSports Release AAB`

Build almadan önce repository secrets alanına şunlar eklenmelidir:

- `EXPO_TOKEN`
- `DRA_BORN_SPORTS_KEYSTORE_BASE64`
- `DRA_BORN_SPORTS_KEYSTORE_PASSWORD`
- `DRA_BORN_SPORTS_KEY_ALIAS`
- `DRA_BORN_SPORTS_KEY_PASSWORD`

Şimdilik hiçbir APK veya AAB otomatik oluşturulmaz.

## Supabase durumu

v0.2 Expo testi yerel demo verileriyle çalışır. DraBornSports adına başlı bir Supabase projesi bulunmadığı için canlı veritabanına geçiş yapılmamıştır. Hazırlanan güvenli şema taslağı `supabase/migrations` klasöründedir.
