def calculate_metrics(processes):

    results = []

    total_tat = 0
    total_wt = 0
    total_bt = 0

    for process in processes:

        tat = process["ct"] - process["at"]

        wt = tat - process["bt"]

        total_tat += tat
        total_wt += wt
        total_bt += process["bt"]

        results.append({
            "pid": process["pid"],
            "at": process["at"],
            "bt": process["bt"],
            "ct": process["ct"],
            "tat": tat,
            "wt": wt,
            "color": process.get("color")
        })

    avg_tat = total_tat / len(processes)

    avg_wt = total_wt / len(processes)
    
    return {
        "results": results,
        "total_bt": total_bt,
        "total_tat": total_tat,
        "total_wt": total_wt,
        "avg_tat": round(avg_tat, 2),
        "avg_wt": round(avg_wt, 2)

    }