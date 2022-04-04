import json

# Do I look like I know python? :)
local_configuration = {}

with open('config.json', 'r') as f:
    local_configuration = json.load(f)