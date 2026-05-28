from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DefectBoundingBox(BaseModel):
    x_min: int = Field(..., description="Top-left x coordinate of bounding box")
    y_min: int = Field(..., description="Top-left y coordinate of bounding box")
    x_max: int = Field(..., description="Bottom-right x coordinate of bounding box")
    y_max: int = Field(..., description="Bottom-right y coordinate of bounding box")

class DefectDetail(BaseModel):
    class_name: str = Field(..., description="One of: Crazing, Inclusion, Patches, Pitted Surface, Rolled-in Scale, Scratches")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model prediction confidence score")
    severity_pct: float = Field(..., ge=0.0, le=100.0, description="Defect surface area coverage ratio")
    bounding_box: Optional[DefectBoundingBox] = None

class InferenceResult(BaseModel):
    filename: str = Field(..., description="Analyzed steel coil file name")
    defect_detected: bool = Field(..., description="Boolean flag if any defect has been identified")
    primary_defect: Optional[str] = Field(None, description="Dominant defect class")
    detection_count: int = Field(0, description="Total defect instances found")
    defects: List[DefectDetail] = Field(default=[], description="List of all detected defect properties")
    inference_time_ms: float = Field(..., description="Inference engine latency")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class OperationalMetrics(BaseModel):
    cpu_utilization: float = Field(..., description="Current server CPU percentage")
    gpu_utilization: Optional[float] = Field(None, description="CUDA deployment frame utilization")
    inference_latency_avg_ms: float = Field(..., description="Moving average of model inference latency")
    total_scans_processed: int = Field(0, description="Total count of processed steel rolls")
    scanned_ok: int = Field(0, description="Defect-free steel roll counts")
    scanned_defect: int = Field(0, description="Defect count total")
    defect_distribution: dict = Field(default_factory=dict, description="Class-wise aggregate volumes")
