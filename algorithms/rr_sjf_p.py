from utils.metrics import calculate_metrics
from utils.gantt import add_segment, add_idle

def calculate_rr_sjf_p(processes, quantum):
    for process in processes:
        process["remaining_bt"] = process["bt"]
        process["qt_used"] = 0

    current_time = 0
    gantt = []
    completed_count = 0
    total_processes = len(processes)
    current_process = None

    while completed_count < total_processes:
            ready_queue = [
                p for p in processes
                if p["at"] <= current_time and p["remaining_bt"] > 0
             ]

            if not ready_queue:
                add_idle(gantt, current_time, current_time + 1)
                current_time += 1
                current_process = None
                continue

            selected_process = min(
                ready_queue,
                key=lambda p: (p["remaining_bt"], p["at"])
            )

            if current_process is None or selected_process["pid"] != current_process["pid"]:

                if current_process is not None:
                    current_process["qt_used"] = 0

                current_process = selected_process
                current_process["qt_used"] = 0

    
            if current_process["qt_used"] >= quantum:
                current_process["qt_used"] = 0

                other_queue = [
                    p for p in ready_queue
                    if p["pid"] != current_process["pid"]
                ]

                if other_queue:
                    current_process = min(
                        other_queue,
                        key=lambda p: (p["remaining_bt"], p["at"])
                    )
                    current_process["qt_used"] = 0

            add_segment(gantt, current_process["pid"], current_time, current_time + 1)
            current_process["remaining_bt"] -= 1
            current_process["qt_used"] += 1
            current_time += 1

            if current_process["remaining_bt"] == 0:
                current_process["ct"] = current_time
                current_process["qt_used"] = 0
                completed_count += 1
                current_process = None
                
    for process in processes:
        process.pop("remaining_bt", None)
        process.pop("qt_used", None)

    metric_result = calculate_metrics(processes)

    return {
        "algorithm": "RR SJF P",
        "gantt": gantt,
        "results": metric_result["results"],
        "total_bt": metric_result["total_bt"],
        "total_tat": metric_result["total_tat"],
        "total_wt": metric_result["total_wt"],
        "avg_tat": metric_result["avg_tat"],
        "avg_wt": metric_result["avg_wt"]
    }