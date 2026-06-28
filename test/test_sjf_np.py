from algorithms.sjf_np import calculate_sjf_np

processes = [
    {
        "pid": "P1",
        "at": 3,
        "bt": 6
    },
    {
        "pid": "P2",
        "at": 2,
        "bt": 8
    },
    {
        "pid": "P3",
        "at": 4,
        "bt": 3
    }
]

result = calculate_sjf_np(processes)

print(result)