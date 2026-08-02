#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/DraBornSports"
ROLLBACK_BRANCH="rollback-v0.2.0-$(date +%Y%m%d-%H%M%S)"

cd "$PROJECT_DIR"
git fetch --all --prune
git checkout -b "$ROLLBACK_BRANCH" origin/backup/v0.2.0
rm -rf node_modules package-lock.json .expo
npm install

echo "v0.2.0 geri alma dalı hazır: $ROLLBACK_BRANCH"
echo "Başlat: npx expo start --clear --tunnel"
