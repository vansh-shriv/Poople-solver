import pickle
import networkx as nx

def shortest_path(G,start,end):   
    try:
        path = nx.dijkstra_path(G,source=start,target=end)
    except nx.NetworkXNoPath:
        print("No path found between {} and {}".format(start,end))
    except nx.NodeNotFound:
        print("Node not found")
    return path

def main():
    with open("graph.pkl","rb") as f:
        G = pickle.load(f)

    start = input("Enter start word : ").strip().lower()
    end = input("Enter the target word : ").strip().lower()

    path = shortest_path(G,start,end)
    print(" -> ".join(path))


if __name__ == "__main__":
    main()



