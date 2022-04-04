import json
import math
import time
from io import BytesIO

import requests
from bs4 import BeautifulSoup
from websocket import create_connection

from board import Board
from color import Color
from target_configuration import target_configuration

# based on https://github.com/goatgoose/PlaceBot and https://github.com/rdeepak2002/reddit-place-script-2022/blob/073c13f6b303f89b4f961cdbcbd008d0b4437b39/main.py#L316

SET_PIXEL_QUERY = \
    """mutation setPixel($input: ActInput!) {
      act(input: $input) {
        data {
          ... on BasicMessage {
            id
            data {
              ... on GetUserCooldownResponseMessageData {
                nextAvailablePixelTimestamp
                __typename
              }
              ... on SetPixelResponseMessageData {
                timestamp
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }
    """


class Placer:
    REDDIT_URL = "https://www.reddit.com"
    LOGIN_URL = REDDIT_URL + "/login"
    INITIAL_HEADERS = {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "origin": REDDIT_URL,
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"
    }

    def __init__(self):
        self.client = requests.session()
        self.client.headers.update(self.INITIAL_HEADERS)

        self.token = None
        self.logged_in = False
        self.board = Board()
        self.last_placed = 0

        self.username = "Unknown"

    def login(self, username: str, password: str):
        self.username = username

        # get the csrf token
        print("Obtaining CSRF token...")
        r = self.client.get(self.LOGIN_URL)
        time.sleep(1)

        login_get_soup = BeautifulSoup(r.content, "html.parser")
        csrf_token = login_get_soup.find("input", {"name": "csrf_token"})["value"]

        # authenticate
        print("Logging in...")
        r = self.client.post(
            self.LOGIN_URL,
            data={
                "username": username,
                "password": password,
                "dest": self.REDDIT_URL,
                "csrf_token": csrf_token
            }
        )
        time.sleep(1)

        if r.status_code != 200:
            print("Authorization failed!")  # password is probably invalid
            return
        else:
            print("Authorization successful!")

        # get the new access token
        print("Obtaining access token...")
        r = self.client.get(self.REDDIT_URL)
        data_str = BeautifulSoup(r.content, features="html.parser").find("script", {"id": "data"}).contents[0][len("window.__r = "):-1]
        data = json.loads(data_str)
        self.token = data["user"]["session"]["accessToken"]

        print("Logged in as " + username + "\n")
        self.logged_in = True

    def place_tile(self, x: int, y: int, color: Color):

        # canvas_id = math.floor(x / 1000)  # obtain the canvas id, each canvas is 1000x1000, there are currently 2 stacked next to each other
        canvas_id = self.board.get_canvas_id_from_coords(x, y)

        x = x % 1000  # we need to send relative to the canvas
        y = y % 1000  # we need to send relative to the canvas
        print("Target canvas: " + str(canvas_id) + " (" + str(x) + ", " + str(y) + ")")


        self.last_placed = time.time()

        headers = self.INITIAL_HEADERS.copy()
        headers.update({
            "apollographql-client-name": "mona-lisa",
            "apollographql-client-version": "0.0.1",
            "content-type": "application/json",
            "origin": "https://hot-potato.reddit.com",
            "referer": "https://hot-potato.reddit.com/",
            "sec-fetch-site": "same-site",
            "authorization": "Bearer " + self.token
        })

        print("Placing tile at " + str(x) + ", " + str(y) + " with color " + str(color) + " on canvas " + str(canvas_id))
        r = requests.post(
            "https://gql-realtime-2.reddit.com/query",
            json={
                "operationName": "setPixel",
                "query": SET_PIXEL_QUERY,
                "variables": {
                    "input": {
                        "PixelMessageData": {
                            "canvasIndex": canvas_id,
                            "colorIndex": color.value["id"],
                            "coordinate": {
                                "x": x,
                                "y": y
                            }
                        },
                        "actionName": "r/replace:set_pixel"
                    }
                }
            },
            headers=headers
        )

        if r.status_code != 200:
            print("Error placing tile")
            print(r.content)
            # TODO: handle error
        else:
            print("Placed tile")


    """
    Fetch the current state of the board/canvas for the requed areas
    """
    def update_board(self):
        if "canvases_enabled" in target_configuration.get_config():  # the configuration can disable some canvases to reduce load
            for canvas_id in target_configuration.get_config()["canvases_enabled"]:
                self.update_canvas(canvas_id)
        else:  # by default, use all (2 at the moment)
            for canvas_id in [0, 1]:
                self.update_canvas(canvas_id)

    """
    Connects a websocket and sends a request to the server for the current state of the board
    Uses the returned URL to request the actual image using HTTP
    :param canvas_id: the canvas to fetch
    """
    def update_canvas(self, canvas_id):
        print("Getting board")
        ws = create_connection("wss://gql-realtime-2.reddit.com/query")
        ws.send(
            json.dumps(
                {
                    "type": "connection_init",
                    "payload": {"Authorization": "Bearer " + self.token},
                }
            )
        )
        ws.recv()
        ws.send(
            json.dumps(
                {
                    "id": "1",
                    "type": "start",
                    "payload": {
                        "variables": {
                            "input": {
                                "channel": {
                                    "teamOwner": "AFD2022",
                                    "category": "CONFIG",
                                }
                            }
                        },
                        "extensions": {},
                        "operationName": "configuration",
                        "query": "subscription configuration($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on ConfigurationMessageData {\n          colorPalette {\n            colors {\n              hex\n              index\n              __typename\n            }\n            __typename\n          }\n          canvasConfigurations {\n            index\n            dx\n            dy\n            __typename\n          }\n          canvasWidth\n          canvasHeight\n          __typename\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
                    },
                }
            )
        )
        ws.recv()
        ws.send(
            json.dumps(
                {
                    "id": "2",
                    "type": "start",
                    "payload": {
                        "variables": {
                            "input": {
                                "channel": {
                                    "teamOwner": "AFD2022",
                                    "category": "CANVAS",
                                    "tag": str(canvas_id),
                                }
                            }
                        },
                        "extensions": {},
                        "operationName": "replace",
                        "query": "subscription replace($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n        ... on DiffFrameMessageData {\n          __typename\n          name\n          currentTimestamp\n          previousTimestamp\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
                    },
                }
            )
        )

        filename = ""
        while True:
            temp = json.loads(ws.recv())
            if temp["type"] == "data":
                msg = temp["payload"]["data"]["subscribe"]
                if msg["data"]["__typename"] == "FullFrameMessageData":
                    filename = msg["data"]["name"]

                    print("Got image for canvas " + str(canvas_id) + ": " + filename)
                    img = BytesIO(requests.get(filename, stream=True).content)

                    # Tell the board to update with the offset of the current canvas
                    if canvas_id == 0:
                        self.board.update_image(img, 0, 0)
                    if canvas_id == 1:
                        self.board.update_image(img, 1000, 0)
                    if canvas_id == 2:
                        self.board.update_image(img, 0, 1000)
                    if canvas_id == 3:
                        self.board.update_image(img, 1000, 1000)

                    break

        ws.close()