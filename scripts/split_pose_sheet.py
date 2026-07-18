"""Split a transparent three-panel pose sheet into game-ready character frames."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


FRAME_SIZE = (640, 768)
SAFE_SIZE = (608, 736)
SUFFIXES = ("battle", "ultimate", "ko")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--artist", required=True)
    parser.add_argument("--out-dir", required=True, type=Path)
    parser.add_argument("--gutter", type=int, default=0, help="Trim this many pixels from internal panel edges")
    args = parser.parse_args()

    sheet = Image.open(args.input).convert("RGBA")
    boundaries = [round(sheet.width * index / 3) for index in range(4)]
    args.out_dir.mkdir(parents=True, exist_ok=True)

    for index, suffix in enumerate(SUFFIXES):
        left = boundaries[index] + (args.gutter if index > 0 else 0)
        right = boundaries[index + 1] - (args.gutter if index < len(SUFFIXES) - 1 else 0)
        panel = sheet.crop((left, 0, right, sheet.height))
        alpha = panel.getchannel("A")
        bounds = alpha.getbbox()
        if bounds is None:
            raise SystemExit(f"Panel {index + 1} has no visible pixels")
        subject = panel.crop(bounds)
        subject.thumbnail(SAFE_SIZE, Image.Resampling.LANCZOS)

        frame = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
        x = (FRAME_SIZE[0] - subject.width) // 2
        y = (FRAME_SIZE[1] - subject.height) // 2
        frame.alpha_composite(subject, (x, y))

        output = args.out_dir / f"{args.artist}-{suffix}.webp"
        frame.save(output, "WEBP", quality=96, method=6)
        print(f"Wrote {output}")


if __name__ == "__main__":
    main()
