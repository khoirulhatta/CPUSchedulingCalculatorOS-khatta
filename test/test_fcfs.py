from algorithms.fcfs import calculate_fcfs

processes = [
    {
        "pid": "P1",
        "at": 0,
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

result = calculate_fcfs(processes)

print(result)