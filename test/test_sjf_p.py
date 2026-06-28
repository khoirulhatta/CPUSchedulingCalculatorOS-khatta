from algorithms.sjf_p import calculate_sjf_p

processes = [
    {
        "pid": "P1",
        "at": 0,
        "bt": 8
    },
    {
        "pid": "P2",
        "at": 1,
        "bt": 4
    },
    {
        "pid": "P3",
        "at": 2,
        "bt": 2
    }
]

result = calculate_sjf_p(processes)

print(result)