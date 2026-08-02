#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/DraBornSports"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="local-backup-before-v0.2.1-$TIMESTAMP"
BACKUP_TAG="local-before-v0.2.1-$TIMESTAMP"
BACKUP_ARCHIVE="$HOME/DraBornSports_local_backup_$TIMESTAMP.tar.gz"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "DraBornSports lokal reposu bulunamadı: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

echo "1/7 Lokal kaynak kod arşivleniyor..."
tar \
  --exclude='DraBornSports/node_modules' \
  --exclude='DraBornSports/.expo' \
  --exclude='DraBornSports/.git/objects' \
  -czf "$BACKUP_ARCHIVE" \
  -C "$HOME/projects" DraBornSports

echo "2/7 Git yedek dalı ve etiketi oluşturuluyor..."
git branch "$BACKUP_BRANCH" HEAD
git tag "$BACKUP_TAG" HEAD

echo "3/7 GitHub main dalı alınıyor..."
git fetch --all --prune
git checkout main
git reset --hard origin/main
git clean -fd

echo "4/7 Eski paket ve Metro önbelleği temizleniyor..."
rm -rf node_modules package-lock.json .expo

echo "5/7 Expo SDK 57 paketleri kuruluyor..."
npm install

echo "6/7 Paket ve proje kontrolleri çalıştırılıyor..."
npx expo install --check
npx expo-doctor

echo "7/7 Lokal ve GitHub SHA karşılaştırılıyor..."
LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse origin/main)"

if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  echo "HATA: Lokal ve GitHub commitleri eşit değil."
  echo "Lokal:  $LOCAL_SHA"
  echo "GitHub: $REMOTE_SHA"
  exit 1
fi

echo "DraBornSports v0.2.1 hazır."
echo "Lokal/GitHub: $LOCAL_SHA"
echo "Arşiv yedeği: $BACKUP_ARCHIVE"
echo "Yedek dalı: $BACKUP_BRANCH"
echo "Yedek etiketi: $BACKUP_TAG"
echo "Başlat: npx expo start --clear --tunnel"
