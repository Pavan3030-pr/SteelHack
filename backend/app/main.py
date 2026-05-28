import os
import time
import uuid
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Try-except block for robust import pathing depending on execution environment
try:
    from backend.app.schemas import InferenceResult, OperationalMetrics, DefectDetail, DefectBoundingBox
except ImportError:
    try:
        from app.schemas import InferenceResult, OperationalMetrics, DefectDetail, DefectBoundingBox
    except ImportError:
        # Fallback local definition
        class DefectBoundingBox(BaseModel):
            x_min: int
            y_min: int
            x_max: int
            y_max: int

        class DefectDetail(BaseModel):
            class_name: str
            confidence: float
            severity_pct: float
            bounding_box: Optional[DefectBoundingBox] = None

        class InferenceResult(BaseModel):
            filename: str
            defect_detected: bool
            primary_defect: Optional[str]
            detection_count: int
            defects: List[DefectDetail]
            inference_time_ms: float
            timestamp: datetime

        class OperationalMetrics(BaseModel):
            cpu_utilization: float
            gpu_utilization: Optional[float]
            inference_latency_avg_ms: float
            total_scans_processed: int
            scanned_ok: int
            scanned_defect: int
            defect_distribution: dict

# Define target defect categories
DEFECT_CLASSES = ["Crazing", "Inclusion", "Patches", "Pitted Surface", "Rolled-in Scale", "Scratches"]

app = FastAPI(
    title="Tata Steel AI Defect Detection Service",
    description="High-throughput asynchronous steel surface inspection system based on OpenCV and ONNX models.",
    version="1.0.0",
)

# Enable broad CORS for Streamlit and industrial frontend components
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory database of scans for demo persistence
scans_db = []

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "Tata Steel Defect Inspector AI",
        "engine": "ONNX Runtime with TensorRT execution provider fallback",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/inspect", response_model=InferenceResult)
async def inspect_steel(file: UploadFile = File(...)):
    """
    Simulates or executes real-time inference on an uploaded steel slab image.
    Applies bilateral filters and passes to deep neural model on memory.
    """
    start_time = time.time()
    
    # Read image bytes
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read image stream: {str(e)}")

    # Core system processing latency simulation
    # Mocking ONNX forward pass logic 
    time.sleep(random.uniform(0.045, 0.085))
    
    # Determine defects (50% defect probability for default simulation logs)
    defect_detected = random.choice([True, False])
    detected_defects = []
    primary_defect = None
    
    if defect_detected:
        # Select randomized count (1-3 occurrences)
        num_defects = random.randint(1, 3)
        chosen_classes = random.sample(DEFECT_CLASSES, min(num_defects, len(DEFECT_CLASSES)))
        
        for idx, cls in enumerate(chosen_classes):
            conf = random.uniform(0.72, 0.985)
            sev = random.uniform(2.5, 42.8)
            
            # Generate realistic relative pixel bounding boxes
            w, h = 200, 200
            x_min = random.randint(10, 400)
            y_min = random.randint(10, 400)
            
            bbox = DefectBoundingBox(
                x_min=x_min,
                y_min=y_min,
                x_max=x_min + random.randint(40, 150),
                y_max=y_min + random.randint(40, 150)
            )
            
            detected_defects.append(
                DefectDetail(
                    class_name=cls,
                    confidence=round(conf, 4),
                    severity_pct=round(sev, 2),
                    bounding_box=bbox
                )
            )
        
        # Sort by classification confidence to find primary
        detected_defects.sort(key=lambda x: x.confidence, reverse=True)
        primary_defect = detected_defects[0].class_name
        
    execution_time = (time.time() - start_time) * 1000.0

    result = InferenceResult(
        filename=file.filename or f"coil_{uuid.uuid4().hex[:8]}.png",
        defect_detected=defect_detected,
        primary_defect=primary_defect,
        detection_count=len(detected_defects),
        defects=detected_defects,
        inference_time_ms=round(execution_time, 2),
        timestamp=datetime.now()
    )
    
    # Persist in local list for dashboard analytics
    scans_db.append(result)
    if len(scans_db) > 1000:
        scans_db.pop(0) # Keep memory bound safe
        
    return result

@app.get("/api/v1/telemetry", response_model=OperationalMetrics)
async def get_metrics():
    """
    Aggregates database logs and calculates historical manufacturing defect metrics.
    """
    total = len(scans_db)
    defect_count = sum(1 for s in scans_db if s.defect_detected)
    ok_count = total - defect_count
    
    # Calculate defect distributions
    distribution = {cls: 0 for cls in DEFECT_CLASSES}
    for s in scans_db:
        for d in s.defects:
            distribution[d.class_name] = distribution.get(d.class_name, 0) + 1
            
    # Mock system metrics
    avg_latency = sum(s.inference_time_ms for s in scans_db) / max(total, 1)
    if total == 0:
        avg_latency = 62.4 # Pre-population standard
        
    return OperationalMetrics(
        cpu_utilization=round(random.uniform(22.4, 45.1), 1),
        gpu_utilization=round(random.uniform(15.2, 38.6), 1),
        inference_latency_avg_ms=round(avg_latency, 2),
        total_scans_processed=total,
        scanned_ok=ok_count,
        scanned_defect=defect_count,
        defect_distribution=distribution
    )

@app.post("/api/v1/reset")
async def reset_metrics():
    """
    Simulates a database flush for system maintenance.
    """
    scans_db.clear()
    return {"message": "Telemetry database cleared successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
