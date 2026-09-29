"""Transcribe public/source.mp4 into word-level captions for the TikTok clips.

Writes src/TikTok/captions.json in Remotion's Caption format.
Needs: pip install faster-whisper  (the model is downloaded from huggingface.co on first run)
Usage: python3 scripts/transcribe.py [model=small] [language, e.g. en]
"""

import json
import sys
from pathlib import Path

from faster_whisper import WhisperModel

root = Path(__file__).resolve().parent.parent
model_name = sys.argv[1] if len(sys.argv) > 1 else "small"
language = sys.argv[2] if len(sys.argv) > 2 else None

model = WhisperModel(model_name, device="cpu", compute_type="int8")
segments, info = model.transcribe(
    str(root / "public" / "source.mp4"),
    language=language,
    word_timestamps=True,
    vad_filter=True,
)
print(f"Detected language: {info.language}, duration {info.duration:.1f}s")

captions = []
for segment in segments:
    print(f"[{segment.start:7.1f}s] {segment.text.strip()}")
    for word in segment.words or []:
        captions.append(
            {
                "text": word.word,
                "startMs": round(word.start * 1000),
                "endMs": round(word.end * 1000),
                "timestampMs": round((word.start + word.end) * 500),
                "confidence": round(word.probability, 3),
            }
        )

out = root / "src" / "TikTok" / "captions.json"
out.write_text(json.dumps(captions, indent=1) + "\n")
print(f"Wrote {len(captions)} words to {out.relative_to(root)}")
