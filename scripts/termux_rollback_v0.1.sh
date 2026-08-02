#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/DraBornSports"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ARCHIVE="$HOME/DraBornSports_before_rollback_$TIMESTAMP.tar.gz"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "DraBornSports lokal reposu bulunamadı: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

tar \
  --exclude='DraBornSports/node_modules' \
  --exclude='DraBornSports/.expo' \
  --exclude='DraBornSports/.git/objects' \
  -czf "$BACKUP_ARCHIVE" \
  -C "$HOME/projects" DraBornSports

git fetch --all --prune
git checkout -B rollback-v0.1 origin/backup/v0.1.0
git clean -fd

rm -rf node_modules package-lock.json .expo
npm install

echo "v0.1 geri alma dalı hazır: rollback-v0.1"
echo "Geri alma öncesi arşiv: $BACKUP_ARCHIVE"
echo "v0.1'i başlatmak için SDK 54 uyumlu Expo Go gerekir."
echo "v0.2'ye dönmek için: git checkout main && git reset --hard origin/main"
