import json
import math

from PIL import Image
import sys

from color import get_closest_color
from board import Board

if len(sys.argv) < 4:
    print("Usage: python3 image_converter.py <input_image> <offset_x> <offset_y>")
    exit(1)

offset_x = int(sys.argv[2])
offset_y = int(sys.argv[3])

image_filename = sys.argv[1]
print("Reading image: " + image_filename)
image = Image.open(image_filename)
image_data = image.load()

board = Board() # for util functionality

print("Converting image...")
target_pixels = []
canvases_enabled = []
transparent_pixels = 0

print("Image size: " + str(image.size))

# Prioritization of pixels is determined by order added
for y in range(image.height):
    for x in range(image.width):
        rgba = image_data[x, y]

        print(x, y, rgba)
        if(rgba[3] == 0):  # skip transparent pixels
            transparent_pixels += 1
            continue

        closest_color = get_closest_color(rgba[0], rgba[1], rgba[2])

        target_pixels.append({
            "x": x + offset_x,
            "y": y + offset_y,
            "color_index": closest_color.value["id"]
        })

        # target_canvas = math.floor((x + offset_x) / 1000)
        target_canvas = board.get_canvas_id_from_coords(x + offset_x, y + offset_y)
        if target_canvas not in canvases_enabled:
            canvases_enabled.append(target_canvas)

print("Discarded " + str(transparent_pixels) + " transparent pixels")

print("Writing out.cfg ...")
with open("out.cfg", "w") as target_file:
    json.dump({
        "canvases_enabled": canvases_enabled,  # reduces processing time by not pulling unrelated canvases
        "pixels": target_pixels
    }, target_file)

print("Done!")