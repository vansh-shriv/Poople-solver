import os
import pickle
from contextlib import asynccontextmanager
from typing import List, Optional
import networkx as nx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Global graph variable held in memory for sub-millisecond lookups
graph: Optional[nx.Graph] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load graph.pkl into memory once
    global graph
    script_dir = os.path.dirname(os.path.abspath(__file__))
    graph_path = os.path.join(script_dir, "graph.pkl")
    
    if os.path.exists(graph_path):
        try:
            with open(graph_path, "rb") as f:
                graph = pickle.load(f)
            print(f"[INFO] Loaded graph.pkl successfully with {len(graph.nodes())} nodes.")
        except Exception as e:
            print(f"[ERROR] Error loading graph.pkl: {e}")
            graph = nx.Graph()
    else:
        print(f"[WARN] graph.pkl not found at {graph_path}")
        graph = nx.Graph()

    yield
    # Shutdown logic if needed
    graph = None

app = FastAPI(
    title="Poople Solver API",
    description="FastAPI web service for 4-letter word transformation ladders using Dijkstra's algorithm.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Next.js dev server and production deployments (e.g., Vercel/Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    start: str = Field(..., min_length=4, max_length=4, description="4-letter start word")
    target: str = Field(..., min_length=4, max_length=4, description="4-letter target word")

class SolveResponse(BaseModel):
    success: bool
    path: Optional[List[str]] = None
    error: Optional[str] = None

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Poople Solver API",
        "graph_loaded": graph is not None and len(graph.nodes()) > 0 if graph else False,
        "nodes_count": len(graph.nodes()) if graph else 0
    }

@app.post("/solve", response_model=SolveResponse)
def solve_ladder(request: SolveRequest):
    if graph is None or len(graph.nodes()) == 0:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Graph database is not loaded yet."
        )

    start_word = request.start.strip().lower()
    target_word = request.target.strip().lower()

    if start_word not in graph:
        return SolveResponse(
            success=False,
            error=f"Start word '{start_word}' is not in valid dictionary."
        )

    if target_word not in graph:
        return SolveResponse(
            success=False,
            error=f"Target word '{target_word}' is not in valid dictionary."
        )

    try:
        path = nx.dijkstra_path(graph, source=start_word, target=target_word)
        return SolveResponse(success=True, path=path)
    except nx.NetworkXNoPath:
        return SolveResponse(
            success=False,
            error=f"No transformation path found between '{start_word}' and '{target_word}'."
        )
    except Exception as e:
        return SolveResponse(success=False, error=str(e))
