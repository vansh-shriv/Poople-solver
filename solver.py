import sys
import pickle
import json
import os
import networkx as nx

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "error": "Missing start or target word arguments"}))
        return

    start = sys.argv[1].strip().lower()
    end = sys.argv[2].strip().lower()

    # Determine graph.pkl location relative to solver.py
    script_dir = os.path.dirname(os.path.abspath(__file__))
    graph_path = os.path.join(script_dir, "graph.pkl")

    if not os.path.exists(graph_path):
        print(json.dumps({"success": False, "error": "graph.pkl file not found"}))
        return

    try:
        with open(graph_path, "rb") as f:
            G = pickle.load(f)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Failed to load graph: {str(e)}"}))
        return

    if start not in G:
        print(json.dumps({"success": False, "error": f"Start word '{start}' is not in valid word list"}))
        return
    
    if end not in G:
        print(json.dumps({"success": False, "error": f"Target word '{end}' is not in valid word list"}))
        return

    try:
        path = nx.dijkstra_path(G, source=start, target=end)
        print(json.dumps({"success": True, "path": path}))
    except nx.NetworkXNoPath:
        print(json.dumps({"success": False, "error": f"No valid word transformation path found between '{start}' and '{end}'"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
