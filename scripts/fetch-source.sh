#!/usr/bin/env bash
# Download a YouTube video to public/source.mp4 (requires yt-dlp: pip install yt-dlp).
# Usage: scripts/fetch-source.sh <youtube-url>
set -euo pipefail
url="${1:?Usage: scripts/fetch-source.sh <youtube-url>}"
cd "$(dirname "$0")/.."
mkdir -p public
yt-dlp -f "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" \
  --merge-output-format mp4 -o public/source.mp4 --force-overwrites "$url"
echo "Saved public/source.mp4"
