from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
from backend.models import SLOT_OUTCOMES
from backend.config import HOST, PORT, RELOAD

app = FastAPI(title="Plinko Game", version="1.0.0")

frontend_path = Path(__file__).parent.parent / "frontend"

app.mount("/assets", StaticFiles(directory=frontend_path / "assets"), name="assets")
app.mount("/css", StaticFiles(directory=frontend_path / "css"), name="css")
app.mount("/js", StaticFiles(directory=frontend_path / "js"), name="js")
app.mount("/lib", StaticFiles(directory=frontend_path / "lib"), name="lib")

@app.get("/")
def read_root():
    return FileResponse(frontend_path / "index.html")

@app.get("/api/slots")
def get_slots():
    return JSONResponse(content=[outcome.to_dict() for outcome in SLOT_OUTCOMES])

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "game": "plinko"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=RELOAD)
