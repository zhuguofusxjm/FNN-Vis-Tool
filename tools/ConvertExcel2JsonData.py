import pandas as pd
import json

excel_file = "demo_2.xlsx"
output_file = "demo_2.json"

df = pd.read_excel(excel_file)

init_x = 400
init_y = 100
interval_x = 500
interval_y = 60
#圆形连接点半径
circle_radius = 15
# 生成神经网络节点数据
neural_network_data = []
# 所有节点的全局index
_node_index = 0
_column_index = 0
_node_index_map = {}
# 按列遍历 DataFrame
for _column_name, _column_data in df.items():
    print(f"当前处理第{_column_index}列，列名：{_column_name}")

    _asic_data = []
    for _row_data in _column_data:
        if _row_data not in _asic_data:
            _asic_data.append(_row_data)

    for _row_index, _row_data in enumerate(_asic_data):
        print(f"当前处理第{_row_index}行，单元格数据{_row_data}")
        if pd.isna(_row_data):
            print("数据为nan，跳过该单元格")
            continue
        _node = {
            "index": _node_index,
            "layer": _column_index,
            "x": init_x + (_column_index * interval_x) + circle_radius,
            "y": init_y + (_row_index * interval_y) + circle_radius,
            "name": _row_data
        }
        _node_index_map[_row_data] = len(neural_network_data)
        neural_network_data.append(_node)
        _node_index += 1
    _column_index += 1

# 生成连接数据
connections_data = []
for _row_index, _row_data in df.iterrows():
    for _index in range(0, len(_row_data) - 1):
        print(f"当前处理第{_row_index}行, {_row_data[_index]} ==> {_row_data[_index + 1]}")
        if pd.isna(_row_data[_index]) or pd.isna(_row_data[_index + 1]):
            print("某一数据为nan，跳过该关系")
            continue
        connection = {
            "source": _node_index_map.get(_row_data[_index]),
            "target": _node_index_map.get(_row_data[_index + 1])
        }
        print(connection)
        connections_data.append(connection)

grouped_data = {}
# 获取全局最大值
global_max_x = 0
global_max_y = 0
for item in neural_network_data:
    layer = item["layer"]
    x = item["x"]
    y = item["y"]

    if layer in grouped_data:
        grouped_data[layer]["x"] = max(grouped_data[layer]["x"], x)
        grouped_data[layer]["y"] = max(grouped_data[layer]["y"], y)
    else:
        grouped_data[layer] = {"x": x, "y": y}
    global_max_x = max(global_max_x, x)
    global_max_y = max(global_max_y, y)


# 将Y列的差值除2，就可以算出居中排布的偏移量，直接写道原字典中
for key in grouped_data:
    y = grouped_data[key]["y"]
    grouped_data[key]["y"] = (global_max_y - y) / 2

for item in neural_network_data:
    layer = item["layer"]
    item["y"] = item["y"] + grouped_data[layer]["y"]

# 生成最终的 JSON 数据
final_json = {
    "neuralNetwork": neural_network_data,
    "connections": connections_data
}

with open(output_file, "w") as json_file:
    json.dump(final_json, json_file, indent=4)
