from utils.metrics import calculate_metrics
from utils.gantt import add_segment, add_idle
def calculate_sjf_np(processes):

    current_time = 0

    gantt = []

    remaining_processes = processes.copy()

    while remaining_processes:

        ready_queue = [
            process
            for process in remaining_processes
            if process["at"] <= current_time
        ]

        if not ready_queue:

            next_process = min(
                remaining_processes,
                key=lambda process: process["at"]
            )

            add_idle(
                gantt,
                current_time,
                next_process["at"]
            )

            current_time = next_process["at"]

            continue

        selected_process = min(
            ready_queue,
            key=lambda process: (
                process["bt"],
                process["at"]
            )
        )

        start_time = current_time

        end_time = start_time + selected_process["bt"]

        add_segment(
            gantt,
            selected_process["pid"],
            start_time,
            end_time
        )

        selected_process["ct"] = end_time

        current_time = end_time

        remaining_processes.remove(selected_process)

    metric_result = calculate_metrics(processes)

    return {
        "algorithm": "SJF NP",
        "gantt": gantt,
        "results": metric_result["results"],
        "total_bt": metric_result["total_bt"],
        "total_tat": metric_result["total_tat"],
        "total_wt": metric_result["total_wt"],
        "avg_tat": metric_result["avg_tat"],
        "avg_wt": metric_result["avg_wt"]
    }