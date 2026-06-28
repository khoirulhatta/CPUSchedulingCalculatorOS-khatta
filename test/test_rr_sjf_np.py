from algorithms.rr_sjf_np import calculate_rr_sjf_np

processes = [
    {
        "pid": "P1",
        "at": 3,
        "bt": 5
    },
    {
        "pid": "P2",
        "at": 4,
        "bt": 3
    },
    {
        "pid": "P3",
        "at": 5,
        "bt": 4
    }
]

result = calculate_rr_sjf_np(
    processes,
    quantum=2
)

print(result)