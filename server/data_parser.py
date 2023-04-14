import os
import pathlib
import yaml
import pickle
import json
from rich.console import Console

console = Console()

_ = os.path.dirname(__file__)
data_path = os.path.join(os.path.dirname(_), "data", "typeIDs.yaml")
pickle_path = os.path.join(os.path.dirname(_), "data", "typeIDs.pkl")
cn_json_path = os.path.join(os.path.dirname(_), "public", "cnMap.json")
en_json_path = os.path.join(os.path.dirname(_), "public", "enMap.json")

console.log(os.path.exists(pickle_path))
if not os.path.exists(pickle_path):
    with open(data_path) as f:
        data = yaml.load(f, Loader=yaml.Loader)
        console.log(len(data))

    with open(pickle_path, "wb") as f:
        pickle.dump(data, f)
else:
    with open(pickle_path, "rb") as f:
        data = pickle.load(f)

console.log(len(data))
cn_map = {}
en_map = {}
for type_id in data:
    cn_name = data[type_id]['name'].get('zh', False)
    en_name = data[type_id]['name']['en']
    if cn_name:
        cn_map[cn_name] = type_id
    en_map[en_name] = type_id

with open(cn_json_path, "w") as f:
    json.dump(cn_map,f, ensure_ascii=False)

with open(en_json_path, "w") as f:
    json.dump(en_map, f)