from utils.metrics import calculate_metrics
from utils.gantt import add_segment, add_idle

def calculate_rr_sjf_np(processes, quantum):

    for process in processes:

        process["remaining_bt"] = process["bt"]

    current_time = 0

    gantt = []

    completed_count = 0

    total_processes = len(processes)

    while completed_count < total_processes:

        ready_queue = [
            process
            for process in processes
            if process["at"] <= current_time
            and process["remaining_bt"] > 0
        ]

        if not ready_queue:

            add_idle(
                gantt,
                current_time,
                current_time + 1
            )

            current_time += 1

            continue

        selected_process = min(
            ready_queue,
            key=lambda process: (
                process["remaining_bt"],
                process["at"]
            )
        )

        execution_time = min(
            quantum,
            selected_process["remaining_bt"]
        )

        add_segment(
            gantt,
            selected_process["pid"],
            current_time,
            current_time + execution_time
        )

        selected_process["remaining_bt"] -= execution_time

        current_time += execution_time

        if selected_process["remaining_bt"] == 0:

            selected_process["ct"] = current_time

            completed_count += 1

    for process in processes:

        process.pop("remaining_bt", None)

    metric_result = calculate_metrics(processes)

    return {
        "algorithm": "RR SJF NP",
        "gantt": gantt,
        "results": metric_result["results"],
        "total_bt": metric_result["total_bt"],
        "total_tat": metric_result["total_tat"],
        "total_wt": metric_result["total_wt"],
        "avg_tat": metric_result["avg_tat"],
        "avg_wt": metric_result["avg_wt"]
    }