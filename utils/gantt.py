def add_segment(gantt, process, start, end):
    if (
        gantt
        and gantt[-1]["process"] == process
        and gantt[-1]["end"] == start
    ):
        gantt[-1]["end"] = end
    else:
        gantt.append({
            "process": process,
            "start": start,
            "end": end
        })


def add_idle(gantt, start, end):
    if (
        gantt
        and gantt[-1]["process"] == "Idle"
        and gantt[-1]["end"] == start
    ):
        gantt[-1]["end"] = end
    else:
        gantt.append({
            "process": "Idle",
            "start": start,
            "end": end
        })