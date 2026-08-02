#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/DraBornSports"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="local-backup-before-v0.2-$TIMESTAMP"
BACKUP_TAG="local-before-v0.2-$TIMESTAMP"
BACKUP_ARCHIVE="$HOME/DraBornSports_local_backup_$TIMESTAMP.tar.gz"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "DraBornSports lokal reposu bulunamadı: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

echo "1/6 Lokal proje arşivleniyor..."
tar \
  --exclude='DraBornSports/node_modules' \
  --exclude='DraBornSports/.expo' \
  --exclude='DraBornSports/.git/objects' \
  -czf "$BACKUP_ARCHIVE" \
  -C "$HOME/projects" DraBornSports

echo "2/6 Git yedek dalı ve etiketi oluşturuluyor..."
git branch "$BACKUP_BRANCH" HEAD
git tag "$BACKUP_TAG" HEAD

echo "3/6 GitHub güncel main dalı alınıyor..."
git fetch --all --prune
git checkout main
git reset --hard origin/main
git clean -fd

echo "4/6 Eski Expo paketleri temizleniyor..."
rm -rf node_modules package-lock.json .expo

echo "5/6 Expo SDK 57 bağımlılıkları kuruluyor..."
npm install
npx expo install --check
npx expo-doctor

echo "6/6 Eşitleme tamamlandı."
echo "Lokal repo: $(git rev-parse HEAD)"
echo "GitHub main: $(git rev-parse origin/main)"
echo "Arşiv yedeği: $BACKUP_ARCHIVE"
echo "Git yedek dalı: $BACKUP_BRANCH"
echo "Git yedek etiketi: $BACKUP_TAG"
echo "Başlatmak için: npx expo start --clear --tunnel"
