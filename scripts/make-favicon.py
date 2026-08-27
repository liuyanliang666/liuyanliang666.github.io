"""Generate the site favicon: a tight, rounded crop of the signature logo.

Run after replacing public/images/brand/signature.png to regenerate the icons:

    python3 scripts/make-favicon.py
"""

from PIL import Image, ImageDraw

SOURCE = "public/images/brand/signature.png"
# Ink bounding box within the source image, found by thresholding pixel
# brightness — re-measure this if the source image changes.
BBOX = (198, 307, 1055, 918)
PADDING = 1.22  # how much room around the ink, as a multiple of its longest side

SIZE = 512
RADIUS = int(SIZE * 0.22)

image = Image.open(SOURCE).convert("RGBA")

left, top, right, bottom = BBOX
cx, cy = (left + right) / 2, (top + bottom) / 2
side = max(right - left, bottom - top) * PADDING

crop_box = (
    int(cx - side / 2),
    int(cy - side / 2),
    int(cx + side / 2),
    int(cy + side / 2),
)
cropped = image.crop(crop_box).resize((SIZE, SIZE), Image.LANCZOS)

mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=RADIUS, fill=255)

rounded = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
rounded.paste(cropped, (0, 0), mask)

rounded.save(
    "src/app/favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)
rounded.resize((180, 180), Image.LANCZOS).save("src/app/apple-icon.png")
print("wrote src/app/favicon.ico and src/app/apple-icon.png")
