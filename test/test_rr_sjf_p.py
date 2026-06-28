from algorithms.rr_sjf_p import calculate_rr_sjf_p

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
    }
]

result = calculate_rr_sjf_p(
    processes,
    quantum=3
)

print(result)