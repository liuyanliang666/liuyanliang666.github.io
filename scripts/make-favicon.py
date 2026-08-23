"""Generate the site favicon: a letter mark on a dark rounded tile.

Run after changing LETTER (or the colours) to regenerate the icons:

    python3 scripts/make-favicon.py
"""

from PIL import Image, ImageDraw, ImageFont

LETTER = "L"
TILE = (17, 18, 20)  # near-black, matches the page background
INK = (56, 189, 219)  # the template's cyan brand token
FONT_PATH = "/System/Library/Fonts/Supplemental/Futura.ttc"
FONT_INDEX = 2  # Futura Bold

# Drawn large, then downsampled — keeps the curves clean at 16px.
SIZE = 512
RADIUS = int(SIZE * 0.22)
BORDER = max(int(SIZE * 0.02), 1)

image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# A faint edge so the tile still reads against a dark browser theme.
draw.rounded_rectangle(
    [0, 0, SIZE - 1, SIZE - 1],
    radius=RADIUS,
    fill=TILE,
    outline=(*INK, 90),
    width=BORDER,
)

font = ImageFont.truetype(FONT_PATH, int(SIZE * 0.62), index=FONT_INDEX)
# Centre on the glyph's own ink, not the font's line box.
left, top, right, bottom = draw.textbbox((0, 0), LETTER, font=font)
draw.text(
    ((SIZE - (right - left)) / 2 - left, (SIZE - (bottom - top)) / 2 - top),
    LETTER,
    font=font,
    fill=INK,
)

image.save(
    "src/app/favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)
image.resize((180, 180), Image.LANCZOS).save("src/app/apple-icon.png")
print("wrote src/app/favicon.ico and src/app/apple-icon.png")
