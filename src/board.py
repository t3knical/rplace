import random
import time

from PIL import Image

from color import get_matching_color, Color

BOARD_SIZE_X = 2000
BOARD_SIZE_Y = 2000


class Board:

    def __init__(self):
        self.last_update = 0
        # 2D array of the entire board (BOARD_SIZE_X x BOARD_SIZE_Y), Color objects
        self.colors = []

        # Fill with white preset
        for x in range(BOARD_SIZE_X):
            column = []
            for y in range(BOARD_SIZE_Y):
                column.append(Color.WHITE)
            self.colors.append(column)

    def update_image(self, raw_image, offset_x, offset_y):
        self.last_update = time.time()

        image = Image.open(raw_image)
        image_data = image.convert("RGB").load()

        # convert to color indices
        for x in range(image.width):
            for y in range(image.height):
                self.colors[x + offset_x][y +
                                          offset_y] = get_matching_color(image_data[x, y])

        print("Board updated.")

    def get_pixel_color(self, x: int, y: int) -> Color:
        return self.colors[x][y]

    def get_mismatched_pixel(self, target_pixels):
        mismatched_pixels = self.get_mismatched_pixels(target_pixels)

        if len(mismatched_pixels) == 0:
            return None

        # return random.choice(mismatched_pixels) # TODO: does this work?
        return mismatched_pixels[min(random.randrange(0, 8), len(mismatched_pixels) - 1)]

    def get_mismatched_pixels(self, target_pixels):
        mismatched_pixels = []
        for target_pixel in target_pixels:
            currentColor = self.get_pixel_color(
                target_pixel["x"], target_pixel["y"])

            if currentColor is None:
                print("Couldn't determine color for pixel at " +
                      str(target_pixel["x"]) + ", " + str(target_pixel["y"]))
                continue

            if currentColor is None or currentColor.value["id"] != target_pixel["color_index"]:
                mismatched_pixels.append(target_pixel)
        return mismatched_pixels

    def get_canvas_id_from_coords(self, x, y):
        if x < BOARD_SIZE_X and y < BOARD_SIZE_Y:
            canvas_id = 0
        if x >= BOARD_SIZE_X and y < BOARD_SIZE_Y:
            canvas_id = 1
        if x < BOARD_SIZE_X and y >= BOARD_SIZE_Y:
            canvas_id = 2
        if x >= BOARD_SIZE_X and y >= BOARD_SIZE_Y:
            canvas_id = 3
        return canvas_id
