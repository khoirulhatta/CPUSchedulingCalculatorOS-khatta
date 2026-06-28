from algorithms.rr_fcfs import calculate_rr_fcfs

processes = [
    {
        "pid": "P1",
        "at": 0,
        "bt": 6
    },
    {
        "pid": "P2",
        "at": 1,
        "bt": 4
    },
    {
        "pid": "P3",
        "at": 2,
        "bt": 3
    }
]

result = calculate_rr_fcfs(
    processes,
    quantum=2
)

print(result)