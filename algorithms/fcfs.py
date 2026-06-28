from utils.metrics import calculate_metrics
from utils.gantt import add_segment, add_idle
def calculate_fcfs(processes):

    processes = sorted(
        processes,
        key=lambda process: process["at"]
    )

    current_time = 0

    gantt = []

    for process in processes:

        if current_time < process["at"]:

            add_idle(
                gantt,
                current_time,
                process["at"]
            )

            current_time = process["at"]

        start_time = current_time

        end_time = start_time + process["bt"]

        add_segment(
            gantt,
            process["pid"],
            start_time,
            end_time
        )

        process["ct"] = end_time

        current_time = end_time

    metric_result = calculate_metrics(processes)

    return {
        "algorithm": "FCFS",
        "gantt": gantt,
        "results": metric_result["results"],
        "total_bt": metric_result["total_bt"],
        "total_tat": metric_result["total_tat"],
        "total_wt": metric_result["total_wt"],
        "avg_tat": metric_result["avg_tat"],
        "avg_wt": metric_result["avg_wt"]
    }