from utils.metrics import calculate_metrics
from utils.gantt import add_segment, add_idle

def calculate_rr_fcfs(processes, quantum):

    for process in processes:

        process["remaining_bt"] = process["bt"]

    current_time = 0

    gantt = []

    ready_queue = []

    arrived_processes = set()

    completed_count = 0

    total_processes = len(processes)

    while completed_count < total_processes:

        newly_arrived = [
            process for process in processes
            if process["at"] <= current_time
            and process["pid"] not in arrived_processes
        ]

        newly_arrived.sort(key=lambda process: process["at"])

        for process in newly_arrived:

            ready_queue.append(process)

            arrived_processes.add(process["pid"])

        if not ready_queue:

            add_idle(
                gantt,
                current_time,
                current_time + 1
            )

            current_time += 1

            continue

        current_process = ready_queue.pop(0)

        execution_time = min(
            quantum,
            current_process["remaining_bt"]
        )

        add_segment(
            gantt,
            current_process["pid"],
            current_time,
            current_time + execution_time
        )

        current_process["remaining_bt"] -= execution_time

        old_time = current_time

        current_time += execution_time

        newly_arrived = [
            process for process in processes
            if old_time < process["at"] <= current_time
            and process["pid"] not in arrived_processes
        ]

        newly_arrived.sort(key=lambda process: process["at"])

        for process in newly_arrived:

            ready_queue.append(process)

            arrived_processes.add(process["pid"])

        if current_process["remaining_bt"] == 0:

            current_process["ct"] = current_time

            completed_count += 1

        else:

            ready_queue.append(current_process)

    for process in processes:

        process.pop("remaining_bt", None)

    metric_result = calculate_metrics(processes)

    return {
        "algorithm": "RR FCFS",
        "gantt": gantt,
        "results": metric_result["results"],
        "total_bt": metric_result["total_bt"],
        "total_tat": metric_result["total_tat"],
        "total_wt": metric_result["total_wt"],
        "avg_tat": metric_result["avg_tat"],
        "avg_wt": metric_result["avg_wt"]
    }