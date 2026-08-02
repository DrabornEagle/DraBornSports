#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/DraBornSports"
ROLLBACK_BRANCH="rollback-v0.2.2"
REMOTE_BACKUP="origin/backup/v0.2.2-before-ui-refresh"
BUNDLE_CHECK_DIR="$PROJECT_DIR/.expo-bundle-check"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "DraBornSports lokal reposu bulunamadı: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"
git fetch --all --prune

if ! git rev-parse --verify "$REMOTE_BACKUP" >/dev/null 2>&1; then
  echo "GitHub yedeği bulunamadı: $REMOTE_BACKUP"
  exit 1
fi

git checkout -B "$ROLLBACK_BRANCH" "$REMOTE_BACKUP"
rm -rf node_modules package-lock.json .expo "$BUNDLE_CHECK_DIR"
npm install
npx expo install --check
npx expo-doctor
npx expo export --platform android --output-dir "$BUNDLE_CHECK_DIR"
rm -rf "$BUNDLE_CHECK_DIR"

echo "DraBornSports v0.2.2 geri dönüş dalı hazır: $ROLLBACK_BRANCH"
echo "Başlat: npx expo start --clear --tunnel"
echo "v0.2.3'e dönmek için: git checkout main && git reset --hard origin/main"
