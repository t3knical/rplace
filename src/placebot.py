import random
import time

from PIL import UnidentifiedImageError

from placer import Placer
from local_configuration import local_configuration
from target_configuration import target_configuration
from color import get_color_from_index, Color

#### TESTING ####
# def testing():
#     placer = Placer()
#     placer.login(local_configuration["accounts"][0]["username"], local_configuration["accounts"][0]["password"])
#     placer.update_board()
#     
#     # placer.place_tile(1955, 3, Color.LIGHT_GREEN)
#     
#     pixels = placer.board.get_mismatched_pixels(target_configuration.get_config()["pixels"])
#     
#     for pixel in pixels:
#         print(pixel, " , ", placer.board.get_pixel_color(pixel["x"], pixel["y"]))
#     
#     exit(0)
# testing()
#### END TESTING ####



PLACE_INTERVAL = 5 * 60 + 10 #  The interval that pixels can be placed at
SLEEP_MISMATCH_THRESHOLD = 0.0001  # The percentage of pixels mismatching that cause the bot to slow down (not stop) its refresh rate


"""
Logs into all accounts in the local configuration file
"""
def login_all():
    placers = []
    for account in local_configuration["accounts"]:
        placer = Placer()
        placer.login(account["username"], account["password"])

        if not placer.logged_in:
            print("Failed to login to account: " + account["username"])
            continue

        placers.append(placer)

    print("\n" + str(len(placers)) + " accounts logged in\n")
    return placers

"""
Periodically pulls the board and places a tile when required
"""
def run_board_watcher_placer(placers):
    # Tracks if the template was completed and how many mismatches there were, if yes and below threshold, goes to sleep
    total_pixel_count = 1000 * 1000
    last_mismatch_count = 1000 * 1000
    was_completed = False

    while True:
        for placer in placers:
            if placer.last_placed + PLACE_INTERVAL + random.randrange(2, 15) > time.time():  # Triggered every PLACE_INTERVAL seconds, + random offset (5-25 seconds)
                continue

            print("Attempting to place for: " + placer.username)

            # Fetch the required canvases
            try:
                placer.update_board()
            except UnidentifiedImageError:
                print("Unidentified image for: " + placer.username) # Download error
                print("ABORTING!!!!!!!!!!!!")
                continue

            # Compare to template and obtain mismatched_pixels
            mismatched_pixels = placer.board.get_mismatched_pixels(target_configuration.get_config()["pixels"])
            last_mismatch_count = len(mismatched_pixels)
            total_pixel_count = len(target_configuration.get_config()["pixels"])

            # Get random mismatched target pixel
            target_pixel = placer.board.get_mismatched_pixel(target_configuration.get_config()["pixels"])

            if target_pixel is None:
                print("No mismatched pixels found")
                was_completed = True
                continue

            print("Mismatched pixel found (" + (str(last_mismatch_count)) + "/" + (str(len(target_configuration.get_config()["pixels"]))) + "): " + str(target_pixel))

            # Place mismatched target pixel with correct color
            placer.place_tile(target_pixel["x"], target_pixel["y"], get_color_from_index(target_pixel["color_index"]))
            print("%d out of %d pixels under control, %d mismatches" % (total_pixel_count - last_mismatch_count, total_pixel_count, last_mismatch_count))

            time.sleep(5)

        # Be nice and verbose so users don't look at nothing for 5 minutes
        print("ETA:   ", ",  ".join([p.username + " - " + str(round(p.last_placed + PLACE_INTERVAL + 15 - time.time())) + " s" for p in placers]))

        # If we already completed the template and the mismatch is below threshold, it's time to go to sleep
        if was_completed and last_mismatch_count < (SLEEP_MISMATCH_THRESHOLD * total_pixel_count):
            print("\nLess than " + str(SLEEP_MISMATCH_THRESHOLD * total_pixel_count) + " mismatched pixels found, going to sleep, good night")
            time.sleep(90)

        time.sleep(30)

# Run the entire thing
def run_bot():
    try:
        placers = login_all()
        run_board_watcher_placer(placers)
    except Exception as e:
        print("\n\nError encountered while running bot: " + str(e))

# run the bot in a loop in case it crashes due to any unforeseen reason, e.g. a websocket being closed by the server
# (which happens exactly 1h after login probably due to some token being invalid)
# I could just refresh that token, but I have a life, feel free to create a PR
while True:
    try:
        run_bot()
    except Exception as e:
        print("\n\nError encountered while running bot: " + str(e))
        print("\nRestarting...\n")
        #raise e
        time.sleep(5)  # wait a bit in case the server lost connection

