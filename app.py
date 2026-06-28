from flask import Flask, request, jsonify, render_template

from copy import deepcopy

from algorithms.fcfs import calculate_fcfs
from algorithms.sjf_np import calculate_sjf_np
from algorithms.sjf_p import calculate_sjf_p
from algorithms.rr_fcfs import calculate_rr_fcfs
from algorithms.rr_sjf_np import calculate_rr_sjf_np
from algorithms.rr_sjf_p import calculate_rr_sjf_p

app = Flask(__name__)

ALGORITHMS = {
    "fcfs": calculate_fcfs,
    "sjf_np": calculate_sjf_np,
    "sjf_p": calculate_sjf_p,
    "rr_fcfs": calculate_rr_fcfs,
    "rr_sjf_np": calculate_rr_sjf_np,
    "rr_sjf_p": calculate_rr_sjf_p,
}

def validate_input(
    algorithm,
    processes,
    quantum,
    compare_all
):

    if algorithm not in ALGORITHMS:
        return "Algoritma tidak valid."
    if not processes:
        return "Minimal terdapat satu proses."
    if compare_all or algorithm.startswith("rr_"):
        if quantum is None:
            return "Quantum Time harus diisi."
        if quantum <= 0:
            return (
                "Quantum Time harus lebih besar dari 0."
            )
    for process in processes:
        if process["at"] < 0:
            return (
                f'Arrival Time {process["pid"]} '
                'tidak boleh negatif.'
            )
        if process["bt"] <= 0:
            return (
                f'Burst Time {process["pid"]} '
                'harus lebih besar dari 0.'
            )
    return None

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    if not data:
        return jsonify({
            "error": "Request tidak valid."
        }), 400
    algorithm = data.get("algorithm")
    processes = data.get("processes")
    quantum = data.get("quantum")
    compare_all = data.get("compare_all", False)

    error = validate_input(
        algorithm,
        processes,
        quantum,
        compare_all
    )

    if error:
        return jsonify({
            "error": error
        }), 400

    if compare_all:
        results = []
        for name, function in ALGORITHMS.items():
            if name.startswith("rr_"):
                result = function(
                    deepcopy(processes),
                    quantum
                )
            else:
                result = function(
                    deepcopy(processes)
                )
            results.append(result)

        ranking = deepcopy(sorted(
            results,
            key=lambda result: (
            result["avg_wt"],
            result["avg_tat"]
            )
        ))

        for index, algorithm_result in enumerate(ranking, start=1):
            algorithm_result["rank"] = index

        return jsonify({
            "compare": True,
            "results": results,
            "ranking": ranking
        })
    
    function = ALGORITHMS[algorithm]
    if algorithm.startswith("rr_"):
        result = function(
            deepcopy(processes),
            quantum
        )
    else:
        result = function(
            deepcopy(processes)
        )
    return jsonify(result)

if __name__ == "__main__":
    app.run(
        debug=True
    )