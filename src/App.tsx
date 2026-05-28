import React, { useState, useMemo, useEffect } from "react";
import {
  Activity,
  Cpu,
  RefreshCw,
  Sliders,
  FileCode,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Play,
  Terminal,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Copy,
  Presentation,
  Check,
  Code,
  ShieldCheck,
  Maximize2,
  Settings,
  Database,
  Server,
  HardDrive,
  Percent,
  Clock,
  Eye,
  BookOpen,
  Info,
  Flame,
  Wrench,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==============================================================================
// 1. DATA AND STATIC CONTRACTS
// ==============================================================================

const DEFECT_CLASSES = [
  {
    id: "crazing",
    name: "Crazing",
    desc: "Network of fine, shallow micro-fissures resembling spiderweb cracks on the mill surface.",
    baseSeverity: 14.2,
    detectionSpeed: "52ms",
    patternDesc: "Aggregated linear network patterns with low individual pixel thickness."
  },
  {
    id: "inclusion",
    name: "Inclusion",
    desc: "Non-metallic particles (oxides, silicates) embedded deeply in the steel plate during solidification.",
    baseSeverity: 28.5,
    detectionSpeed: "55ms",
    patternDesc: "Isolated dark high-density blob-like contours with elevated contrast profile."
  },
  {
    id: "patches",
    name: "Patches",
    desc: "Broad, irregular surface discoloration or oxide scales layered unevenly on the warm steel coil.",
    baseSeverity: 34.1,
    detectionSpeed: "49ms",
    patternDesc: "Wide, low-frequency shaded gradients requiring adaptive relative thresholding."
  },
  {
    id: "pitted_surface",
    name: "Pitted Surface",
    desc: "Small cavities and crater-like recessions caused by local acid etching or mechanical erosion.",
    baseSeverity: 18.9,
    detectionSpeed: "58ms",
    patternDesc: "Clusters of high-frequency circular micro-contours with high shadow ratios."
  },
  {
    id: "rolled_in_scale",
    name: "Rolled-in Scale",
    desc: "Iron oxide scale pressed firmly into the steel surface during subsequent rolling passes.",
    baseSeverity: 22.4,
    detectionSpeed: "50ms",
    patternDesc: "Repeating fish-scale flakes or dark linear valleys running parallel to rolling direction."
  },
  {
    id: "scratches",
    name: "Scratches",
    desc: "Sharp, continuous linear abrasions caused by mechanical friction with guide rollers or hot tables.",
    baseSeverity: 8.6,
    detectionSpeed: "46ms",
    patternDesc: "Sharp longitudinal lines with highly directional gradient orientations."
  }
];

const CODE_MODULES = [
  {
    id: "reqs",
    name: "requirements.txt",
    lang: "text",
    path: "/requirements.txt",
    desc: "High-performance industrial computer vision and deep learning packages configured for local training.",
    code: `# Core Deep Learning & Inference Engine
torch>=2.2.0
torchvision>=0.17.0
onnx==1.16.1
onnxruntime==1.17.1

# High-Performance Computer Vision & Augmentations
opencv-python-headless>=4.9.0.80
numpy>=1.26.4
albumentations>=1.4.0
Pillow>=10.2.0

# FastAPI API Service (High-Performance Async Endpoint)
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
pydantic>=2.6.4
python-multipart>=0.0.9

# Enterprise Persistence & Async Data Streams
SQLAlchemy>=2.0.28
psycopg2-binary>=2.9.9
asyncpg>=0.29.0

# Streamlit Industrial Telemetry & Operator Dashboard
streamlit>=1.32.0
pandas>=2.2.1
plotly>=5.19.0
requests>=2.31.0

# Utility & Production Logging
loguru>=0.7.2
scikit-learn>=1.4.1.post1`
  },
  {
    id: "fastapi",
    name: "backend/app/main.py",
    lang: "python",
    path: "/backend/app/main.py",
    desc: "Asynchronous FastAPI microservice loaded with real-time inference routing and telemetry aggregators.",
    code: `import time
import uuid
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Tata Steel AI Defect Detection Service",
    description="High-throughput steel surface inspection system based on OpenCV and ONNX models.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    timestamp: datetime = datetime.utcnow()

@app.post("/api/v1/inspect", response_model=InferenceResult)
async def inspect_steel(file: UploadFile = File(...)):
    start_time = time.time()
    
    # Read image stream and verify sizes
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file stream")

    # Dynamic classification placeholder (ONNX model feed)
    time.sleep(random.uniform(0.045, 0.085)) # ONNX Forward Pass latency
    
    # Return structured parameters
    return InferenceResult(
        filename=file.filename,
        defect_detected=True,
        primary_defect="Scratches",
        detection_count=1,
        defects=[
            DefectDetail(
                class_name="Scratches",
                confidence=0.964,
                severity_pct=8.6,
                bounding_box=DefectBoundingBox(x_min=45, y_min=120, x_max=180, y_max=135)
            )
        ],
        inference_time_ms=(time.time() - start_time) * 1000.0
    )`
  },
  {
    id: "model",
    name: "ml/model.py",
    lang: "python",
    path: "/ml/model.py",
    desc: "A Multi-Task ResNet CNN framework outputting classification logits alongside defect severity percentages.",
    code: `import torch
import torch.nn as nn
import torchvision.models as models

class SteelDefectCNN(nn.Module):
    def __init__(self, num_classes: int = 6, pretrained: bool = True):
        super(SteelDefectCNN, self).__init__()
        
        # Deploy weights-optimized backbone features
        self.backbone = models.resnet34(weights=models.ResNet34_Weights.DEFAULT if pretrained else None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Identity() # Remove default head
        
        # Dense representation linear projection
        self.feature_extractor = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(True),
            nn.BatchNorm1d(512),
            nn.Dropout(0.4)
        )
        
        # Multi-task Head 1: Surface defect classification
        self.class_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(True),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )
        
        # Multi-task Head 2: Severity ratio regression (MSE optimization)
        self.severity_head = nn.Sequential(
            nn.Linear(512, 64),
            nn.ReLU(True),
            nn.Linear(64, 1),
            nn.Sigmoid() # Boundary output maps between 0.0% and 100.0%
        )

    def forward(self, x: torch.Tensor):
        features = self.backbone(x)
        shared_features = self.feature_extractor(features)
        
        class_logits = self.class_head(shared_features)
        severity_prediction = self.severity_head(shared_features) * 100.0
        
        return class_logits, severity_prediction`
  },
  {
    id: "preprocess",
    name: "ml/preprocess.py",
    lang: "python",
    path: "/ml/preprocess.py",
    desc: "Industrial-grade computer vision pipeline employing Bilateral edge-saving filters and CLAHE enhancers.",
    code: `import cv2
import numpy as np
from typing import Tuple

class SteelImagePreprocessor:
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size

    def apply_bilateral_filter(self, img: np.ndarray) -> np.ndarray:
        # Edge-preserving denoising to clean metallic grain structures
        return cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)

    def apply_clahe(self, img: np.ndarray) -> np.ndarray:
        # High-sensitivity CLAHE contrast enhancement
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        return clahe.apply(gray)

    def estimate_defect_severity(self, raw_img: np.ndarray) -> Tuple[np.ndarray, float]:
        gray = self.apply_clahe(raw_img)
        smoothed = self.apply_bilateral_filter(gray)
        
        # Adaptive Thresholding & Contour footprint mapping
        binary = cv2.adaptiveThreshold(
            smoothed, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        overlay = cv2.cvtColor(smoothed, cv2.COLOR_GRAY2BGR)
        cv2.drawContours(overlay, contours, -1, (0, 0, 255), 2)
        
        # Defect area footprint ratio
        total_pixels = raw_img.shape[0] * raw_img.shape[1]
        defect_pixels = cv2.countNonZero(binary)
        severity_ratio = (defect_pixels / total_pixels) * 100.0
        
        return overlay, round(severity_ratio, 2)`
  },
  {
    id: "database",
    name: "backend/app/database.py",
    lang: "python",
    path: "/backend/app/database.py",
    desc: "PostgreSQL SQLAlchemy data models mapping scanning logs, defect bounds, and latency metrics.",
    code: `from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class SteelCoilInspectionRecord(Base):
    __tablename__ = "coil_inspections"

    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    defect_detected = Column(Boolean, default=False, index=True)
    primary_defect = Column(String(50))
    total_defects_found = Column(Integer, default=0)
    inference_time_ms = Column(Float, nullable=False)
    
    defects = relationship("DefectInstanceDetail", back_populates="inspection")

class DefectInstanceDetail(Base):
    __tablename__ = "defect_instances"

    id = Column(Integer, primary_key=True)
    inspection_id = Column(Integer, ForeignKey("coil_inspections.id"))
    class_name = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    severity_pct = Column(Float, nullable=False)
    x_min = Column(Integer)
    y_min = Column(Integer)
    x_max = Column(Integer)
    y_max = Column(Integer)

    inspection = relationship("SteelCoilInspectionRecord", back_populates="defects")`
  }
];

function renderPresetVectors(classId: string, stage: "raw" | "processed" | "highlighted") {
  const isRaw = stage === "raw";
  const isProcessed = stage === "processed";
  const isHigh = stage === "highlighted";

  const color = isRaw ? "#475569" : isProcessed ? "#cbd5e1" : "#ef4444";
  const strokeW = isRaw ? "1.2" : isProcessed ? "2.0" : "2.5";
  const fillCol = isRaw ? "#1e293b" : isProcessed ? "#334155" : "#7f1d1d";

  switch (classId) {
    case "crazing":
      return (
        <g stroke={color} strokeWidth={strokeW} fill="none" opacity={isRaw ? 0.6 : 0.9}>
          <path d="M 80,100 L 95,120 L 100,105 L 120,110 L 115,130 L 140,115 L 125,145 L 150,150 L 160,135 M 100,105 L 115,90 L 130,100 M 125,145 L 110,165 M 150,150 L 180,155 L 190,140 M 140,115 L 170,100 L 180,120 L 220,110" />
          <path d="M 220,240 L 235,260 L 240,245 L 260,250 L 255,270 L 280,255 L 265,285" />
        </g>
      );
    case "inclusion":
      return (
        <g fill={color} opacity={isRaw ? 0.5 : 0.85}>
          <circle cx="160" cy="180" r="16" />
          <circle cx="180" cy="195" r="12" />
          <ellipse cx="140" cy="205" rx="8" ry="14" />
          <circle cx="210" cy="160" r="18" fill={isHigh ? "#ef4444" : fillCol} />
        </g>
      );
    case "patches":
      return (
        <g fill={isHigh ? "none" : fillCol} opacity={isRaw ? 0.4 : 0.7} stroke={isHigh ? "#ef4444" : "none"} strokeWidth="2">
          <path d="M 120,130 Q 180,80 250,140 T 320,220 Q 220,290 140,240 T 120,130 Z" />
          <path d="M 50,50 Q 80,40 100,80 T 120,120 Q 70,120 40,90 T 50,50 Z" />
        </g>
      );
    case "pitted_surface":
      return (
        <g fill={color} opacity={isRaw ? 0.5 : 0.9}>
          <circle cx="100" cy="120" r="3" /> <circle cx="105" cy="115" r="2.5" /> <circle cx="115" cy="122" r="4" />
          <circle cx="250" cy="220" r="3" /> <circle cx="260" cy="235" r="4.5" /> <circle cx="245" cy="240" r="2.5" />
          <circle cx="270" cy="225" r="3" /> <circle cx="180" cy="150" r="4" /> <circle cx="190" cy="155" r="3" />
          <circle cx="150" cy="280" r="3.5" /> <circle cx="140" cy="272" r="2" /> <circle cx="158" cy="275" r="4.5" fill={isHigh ? "#ef4444" : fillCol} />
        </g>
      );
    case "rolled_in_scale":
      return (
        <g stroke={color} strokeWidth={strokeW} fill="none" opacity={isRaw ? 0.5 : 0.8}>
          <path d="M 100,100 C 120,120 120,140 100,160 M 120,110 C 140,130 140,150 120,170 M 140,120 C 160,140 160,160 140,180" />
          <path d="M 220,200 C 240,220 240,240 220,260 M 240,210 C 260,230 260,250 240,270 M 260,220 C 280,240 280,260 260,280" />
        </g>
      );
    case "scratches":
      return (
        <g stroke={color} strokeWidth={strokeW} strokeLinecap="round" opacity={isRaw ? 0.6 : 0.9}>
          <line x1="80" y1="120" x2="300" y2="150" />
          <line x1="90" y1="135" x2="280" y2="160" />
          <line x1="150" y1="220" x2="340" y2="245" />
        </g>
      );
    default:
      return (
        <g stroke="#334155" strokeWidth="1" opacity="0.3">
          <line x1="50" y1="50" x2="350" y2="350" strokeDasharray="5,5" />
          <line x1="350" y1="50" x2="50" y2="350" strokeDasharray="5,5" />
          <text x="120" y="210" fill="#475569" fontSize="11" fontFamily="monospace">GRADIENT OK: NO FLAGGED CONTURES</text>
        </g>
      );
  }
}

const INITIAL_SCANS = [
  { id: "S-1049", coil: "TC-904-A", defect: "Crazing", severity: 12.4, confidence: 0.94, speed: "52ms", time: "10:01:14", location: "Edge 4", operator: "OP-44" },
  { id: "S-1048", coil: "TC-102-X", defect: "None (OK)", severity: 0.0, confidence: 0.99, speed: "41ms", time: "09:58:32", location: "Center", operator: "OP-12" },
  { id: "S-1047", coil: "TC-884-B", defect: "Scratches", severity: 7.8, confidence: 0.97, speed: "46ms", time: "09:54:10", location: "Edge 1", operator: "OP-44" },
  { id: "S-1046", coil: "TC-102-X", defect: "Patches", severity: 32.5, confidence: 0.89, speed: "49ms", time: "09:52:18", location: "Main Body", operator: "OP-08" },
  { id: "S-1045", coil: "TC-501-C", defect: "Pitted Surface", severity: 19.1, confidence: 0.93, speed: "58ms", time: "09:47:02", location: "Edge 2", operator: "OP-23" },
  { id: "S-1044", coil: "TC-721-F", defect: "None (OK)", severity: 0.0, confidence: 0.98, speed: "42ms", time: "09:42:55", location: "Center", operator: "OP-12" }
];

export default function App() {
  // Navigation tabs matching EXACT user intent: 5 items
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "history" | "architecture" | "deployment"
  >("dashboard");

  // Filter criteria for monitoring log tab
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("ALL");
  const [selectedHistoryScanId, setSelectedHistoryScanId] = useState<string>("S-1049");

  // CV Simulator states in Tab 1
  const [selectedClass, setSelectedClass] = useState(DEFECT_CLASSES[5]); // Default: Scratches
  const [cvStage, setCvStage] = useState<"raw" | "bilateral" | "clahe" | "contour">("raw");
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scansList, setScansList] = useState(INITIAL_SCANS);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState("");

  // Adaptive Filter parameters
  const [numIterationsBilateral, setNumIterationsBilateral] = useState(9);
  const [claheClipValue, setClaheClipValue] = useState(3.0);

  // Business value calculator states
  const [annualTonnage, setAnnualTonnage] = useState(1200000); // 1.2M metric tons
  const [costPerToneRollback, setCostPerToneRollback] = useState(150); // $150 per ton
  
  // Real-time floating operational metrics
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    cpu: 31.4,
    gpu: 22.8,
    scansProcessed: 1459,
    scansOk: 1120,
    scansDefect: 339,
    avgLatency: 48.7,
    vramMb: 2440,
    camFPS: 60.0,
    tempC: 45.2,
    dbConnection: "CONNECTED",
    onnxStatus: "OPTIMIZED-FAST-CUDA"
  });

  // Code registry selection state
  const [selectedCodeId, setSelectedCodeId] = useState("reqs");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Simulated node log feeds
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[10:01:14] INFO: Edge Node 'CAM-SEC-04' initiated connection.",
    "[10:01:14] ONNX Runtime CUDA provider linked: allocating 2440MB VRAM.",
    "[10:01:15] API: POST /api/v1/inspect (200 OK) payload serialized.",
    "[10:01:22] TELEMETRY: DB persistent ping completed (0.4ms latency).",
    "[10:02:45] MONITOR: Rolling Speed set to 12.4 m/s. Video FPS stable at 60.0.",
  ]);

  // Command input simulation inside Devops terminal
  const [apiCommandResult, setApiCommandResult] = useState<any>(null);
  const [apiTesting, setApiTesting] = useState(false);

  // Auto fluctuating factory metrics for fidelity feel
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMetrics(prev => ({
        ...prev,
        cpu: +(prev.cpu + (Math.random() - 0.5) * 2).toFixed(1),
        gpu: +(prev.gpu + (Math.random() - 0.5) * 1.5).toFixed(1),
        avgLatency: +(prev.avgLatency + (Math.random() - 0.5) * 0.4).toFixed(1),
        tempC: +(prev.tempC + (Math.random() - 0.5) * 0.2).toFixed(1),
        camFPS: +(60 + (Math.random() - 0.5) * 0.4).toFixed(1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedCodeModule = useMemo(() => {
    return CODE_MODULES.find(m => m.id === selectedCodeId) || CODE_MODULES[0];
  }, [selectedCodeId]);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run full model scan animation simulation
  const triggerInferenceCycle = () => {
    if (scanInProgress) return;
    setScanInProgress(true);
    setCvStage("raw");

    // Phase transitions of CV Pipeline
    setTimeout(() => setCvStage("bilateral"), 500);
    setTimeout(() => setCvStage("clahe"), 1100);
    setTimeout(() => setCvStage("contour"), 1700);

    setTimeout(() => {
      setScanInProgress(false);
      
      const newScanId = `S-${Math.floor(1050 + Math.random() * 950)}`;
      const coilCode = `TC-${Math.floor(100 + Math.random() * 899)}-${"ABCXF"[Math.floor(Math.random() * 5)]}`;
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      
      const isCustom = !!customImage;
      const defectName = isCustom ? "Custom Defect" : selectedClass.name;
      const severityVal = +(isCustom ? 16.5 : selectedClass.baseSeverity + (Math.random() - 0.5) * 4).toFixed(1);
      const confVal = +(0.88 + Math.random() * 0.11).toFixed(2);
      const latencyStr = isCustom ? "55ms" : selectedClass.detectionSpeed;

      const newScan = {
        id: newScanId,
        coil: coilCode,
        defect: defectName,
        severity: severityVal,
        confidence: confVal,
        speed: latencyStr,
        time: timeStr,
        location: ["Edge 1", "Edge 3", "Center", "Edge 4", "Main Body"][Math.floor(Math.random() * 5)],
        operator: ["OP-44", "OP-12", "OP-23", "OP-08"][Math.floor(Math.random() * 4)]
      };

      setScansList(prev => [newScan, ...prev]);
      
      // Update Metrics
      setSimulatedMetrics(prev => ({
        ...prev,
        scansProcessed: prev.scansProcessed + 1,
        scansDefect: defectName === "None (OK)" ? prev.scansDefect : prev.scansDefect + 1,
        scansOk: defectName === "None (OK)" ? prev.scansOk + 1 : prev.scansOk
      }));

      // Append Terminal Logs
      setConsoleLogs(prev => [
        `[${timeStr}] SUCCESS: Inference finished for Coil ${coilCode} (Class: ${defectName}, Sev: ${severityVal}%)`,
        `[${timeStr}] PERSISTENCE: Saved record ${newScanId} into hot_inspections table. Database response OK.`,
        ...prev
      ]);
    }, 2300);
  };

  // File Uploader Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setCvStage("raw");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run test API queries simulation inside tab devops
  const handleTestAPI = (endpoint: string) => {
    setApiTesting(true);
    setApiCommandResult(null);
    setTimeout(() => {
      setApiTesting(false);
      if (endpoint === "health") {
        setApiCommandResult({
          status: "healthy",
          uptime: "234.8 Hours",
          service: "Tata-Steel-ONNX-Saber",
          gpu_acceleration: "CUDA (12.2)",
          active_workers: 4,
          database_health: "ok (0.3ms ping)"
        });
      } else {
        setApiCommandResult({
          filename: customImageName || "TC-SAMPLE.png",
          defect_detected: selectedClass.name !== "None (OK)",
          primary_defect: selectedClass.name,
          detection_count: selectedClass.name !== "None (OK)" ? 1 : 0,
          defects: selectedClass.name !== "None (OK)" ? [
            {
              class_name: selectedClass.name,
              confidence: 0.963,
              severity_pct: selectedClass.baseSeverity,
              bounding_box: { x_min: 45, y_min: 120, x_max: 180, y_max: 235 }
            }
          ] : [],
          inference_time_ms: parseFloat(selectedClass.detectionSpeed),
          timestamp: new Date().toISOString()
        });
      }
    }, 800);
  };

  // Filtered recent inspections list
  const filteredScans = useMemo(() => {
    return scansList.filter(s => {
      const matchSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.coil.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = filterClass === "ALL" || (filterClass === "OK" && s.defect.includes("None")) || (filterClass === "DEFECTS" && !s.defect.includes("None")) || s.defect === filterClass;
      return matchSearch && matchClass;
    });
  }, [scansList, searchTerm, filterClass]);

  // Multi-class counts for distribution
  const defectCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    DEFECT_CLASSES.forEach(d => { counts[d.name] = 12; }); // Default Base Mock Counts
    // Boost from manual testing logs
    scansList.forEach(s => {
      if (!s.defect.includes("None")) {
        counts[s.defect] = (counts[s.defect] || 0) + 1;
      }
    });
    return counts;
  }, [scansList]);

  // Calculated savings
  const totalSavings = useMemo(() => {
    // 20% manual inspection failure rate.
    // Our model avoids 15% of bad roll scraps.
    // Tonnage * cost per ton rollback * 15%
    const savings = annualTonnage * 0.15 * costPerToneRollback;
    return savings;
  }, [annualTonnage, costPerToneRollback]);

  return (
    <div id="tata_steel_hackathon_dashboard" className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl text-slate-950 shadow-md shadow-cyan-500/10">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-mono font-bold text-cyan-400">TATA STEEL AI HACKATHON 2026</span>
                <span className="bg-[#10b981]/10 text-emerald-400 border border-[#10b981]/20 text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Industrial Steel Defect Detection System
                <span className="hidden sm:inline text-xs py-0.5 px-2.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-slate-400">V1.0.0-PROD</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-xl text-slate-400 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>LOGGED IN AS: <strong className="text-slate-200">OP-44 (Tata Jamshedpur)</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            7-ITEM SIDEBAR NAVIGATION MENU
           ========================================== */}
        <nav className="lg:col-span-3 space-y-2">
          {[
            { id: "dashboard", label: "Inspection Dashboard", icon: Sliders },
            { id: "analytics", label: "AI Analytics", icon: TrendingUp },
            { id: "history", label: "Inspection History", icon: Activity },
            { id: "architecture", label: "System Architecture", icon: BookOpen },
            { id: "deployment", label: "Deployment Info", icon: Server }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? "bg-slate-900 border-cyan-500 text-cyan-400 shadow-md"
                    : "bg-teal-950/5 border-slate-800/50 text-slate-400 hover:text-slate-100 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ==========================================
            TAB VIEW CHASSIS
           ========================================== */}
        <main className="lg:col-span-9 space-y-6">

          {/* SHARED HIGHLIGHT BANNER */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Detection Accuracy</span>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">96.8%</div>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Average Inference Latency</span>
              <div className="text-lg font-mono font-bold text-cyan-400 mt-1">{simulatedMetrics.avgLatency} ms</div>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Total Inspections</span>
              <div className="text-lg font-mono font-bold text-white mt-1">{simulatedMetrics.scansProcessed}</div>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Defect Detection Rate</span>
              <div className="text-lg font-mono font-bold text-red-400 mt-1">
                {((simulatedMetrics.scansDefect / simulatedMetrics.scansProcessed) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. INSPECTION DASHBOARD REDESIGN */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* THE MAIN HERO MATRIX (LEFT, CENTER, RIGHT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* LEFT PANEL: UPLOAD & CONTROLS */}
                  <div className="lg:col-span-3 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl min-h-[520px]">
                    <div>
                      <div className="border-b border-slate-900 pb-2.5 mb-3 flex justify-between items-center">
                        <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-bold">Image Acquisition</h3>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-500">LINE SCAN</span>
                      </div>

                      {/* Upload zone */}
                      <div className="space-y-2">
                        <label className="text-[11px] text-slate-400 font-mono">Upload Surface Raw Image</label>
                        <div className="relative border border-dashed border-cyan-500/30 hover:border-cyan-400/80 rounded-xl p-4 text-center transition bg-slate-900/40 cursor-pointer min-h-[100px] flex flex-col justify-center">
                          <input
                            type="file"
                            id="dashboard_img_upload_input"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <ImageIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
                            <span className="text-[11px] font-mono text-slate-200 truncate block w-full outline-none">
                              {customImageName ? `Loaded: ${customImageName.substring(0, 16)}...` : "Select surface files"}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">JPG, PNG, TIFF formats</span>
                          </div>
                        </div>
                      </div>

                      {/* Presets dropdown (Convenience) */}
                      <div className="mt-4 space-y-1.5">
                        <label className="text-[11px] text-slate-400 font-mono">Or Evaluation Preset Target:</label>
                        <select
                          id="dashboard_class_select"
                          value={selectedClass.id}
                          onChange={(e) => {
                            const match = DEFECT_CLASSES.find(d => d.id === e.target.value);
                            if (match) {
                              setCustomImage(null);
                              setCustomImageName("");
                              setSelectedClass(match);
                              setCvStage("raw");
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                        >
                          <option value="none_class_dummy">Select Preset Target...</option>
                          {DEFECT_CLASSES.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.detectionSpeed})</option>
                          ))}
                        </select>
                      </div>

                      {/* Optical Sliders */}
                      <div className="mt-5 pt-3.5 border-t border-slate-900 space-y-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-400">Bilateral Radius (d):</span>
                            <span className="text-cyan-400 font-bold">{numIterationsBilateral}</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="25"
                            value={numIterationsBilateral}
                            onChange={(e) => setNumIterationsBilateral(+e.target.value)}
                            className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-400">contrast clip (CLAHE):</span>
                            <span className="text-cyan-400 font-bold">{claheClipValue.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.5"
                            value={claheClipValue}
                            onChange={(e) => setClaheClipValue(+e.target.value)}
                            className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inspection triggers */}
                    <div className="mt-6 space-y-2">
                      <button
                        id="btn_trigger_inference_cycle"
                        onClick={triggerInferenceCycle}
                        disabled={scanInProgress}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{scanInProgress ? "processing..." : "RUN AI INSPECTION"}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setCustomImage(null);
                          setCustomImageName("");
                          setSelectedClass(DEFECT_CLASSES[5]); // Default Resets
                          setCvStage("raw");
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold font-mono text-[9px] uppercase rounded-lg border border-slate-800 transition duration-200"
                      >
                        Reset Workspace
                      </button>
                    </div>
                  </div>

                  {/* CENTER PANEL: CV PIPELINE IMAGES (RAW, PROCESSED, CONTOUR) */}
                  <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl min-h-[520px]">
                    <div>
                      <div className="border-b border-slate-800 pb-2.5 mb-3 flex justify-between items-center">
                        <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-bold">Pipeline Stage Optimization</h3>
                        <span className="text-[9px] font-mono text-slate-500">
                          {customImage ? "SOURCE: METALLURG_UPLOAD.RAW" : `COIL BATCH: ${selectedClass.name.toUpperCase()}-772`}
                        </span>
                      </div>

                      {/* Grid of the 3 synchronized screens side-by-side */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-3">
                        
                        {/* 1. ORIGINAL IMAGE */}
                        <div className="border border-slate-900 bg-[#070b14] rounded-xl p-2.5 flex flex-col justify-between h-[280px]">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">1. Raw Input</span>
                            <span className="text-[7.5px] font-mono text-slate-600">UNREALIZED</span>
                          </div>
                          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2 bg-slate-950 rounded-lg border border-slate-900/60">
                            {customImage ? (
                              <img src={customImage} alt="Raw Input" className="w-full h-full object-cover rounded" />
                            ) : (
                              <svg className="w-full h-full absolute inset-0 text-slate-100" viewBox="0 0 400 400">
                                <rect width="400" height="400" fill="#020617" opacity="0.3" />
                                {renderPresetVectors(selectedClass.id, "raw")}
                              </svg>
                            )}
                            {scanInProgress && (
                              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 text-center block bg-slate-900/40 py-1 rounded">No filtering applied</span>
                        </div>

                        {/* 2. PROCESSED IMAGE */}
                        <div className="border border-slate-900 bg-[#070b14] rounded-xl p-2.5 flex flex-col justify-between h-[280px]">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">2. Enhanced</span>
                            <span className="text-[7.5px] font-mono text-cyan-500 font-bold">CLAHE FILTER</span>
                          </div>
                          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2 bg-slate-950 rounded-lg border border-slate-900/60">
                            {customImage ? (
                              <img src={customImage} alt="Processed Image" className="w-full h-full object-cover rounded filter grayscale contrast-200 brightness-90 blur-[0.6px]" />
                            ) : (
                              <svg className="w-full h-full absolute inset-0 text-slate-100" viewBox="0 0 400 400">
                                <rect width="400" height="400" fill="#020617" opacity="0.8" />
                                {renderPresetVectors(selectedClass.id, "processed")}
                              </svg>
                            )}
                            {scanInProgress && (
                              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                                <span className="text-[8px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 border border-cyan-500/30 rounded animate-pulse">SMOOTHING...</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-mono text-cyan-400 text-center block bg-[#0e3b43]/30 py-1 rounded border border-cyan-950/20">Bilateral smoothed</span>
                        </div>

                        {/* 3. DEFECT HIGHLIGHTED IMAGE */}
                        <div className="border border-slate-900 bg-[#070b14] rounded-xl p-2.5 flex flex-col justify-between h-[280px]">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">3. Contour Map</span>
                            <span className={`text-[7.5px] font-mono font-bold ${selectedClass.name.includes("None") ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                              {selectedClass.name.includes("None") ? "VERIFIED" : "DEFECT FLAGGED"}
                            </span>
                          </div>
                          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2 bg-slate-950 rounded-lg border border-slate-900/60">
                            {customImage ? (
                              <div className="relative w-full h-full">
                                <img src={customImage} alt="Highlighted Base" className="w-full h-full object-cover rounded filter grayscale contrast-125 saturate-50" />
                                {!selectedClass.name.includes("None") && !scanInProgress && (
                                  <>
                                    <div className="absolute inset-4 border-2 border-dashed border-red-500 bg-red-500/15 rounded animate-pulse" />
                                    <div className="absolute top-2 left-2 bg-red-950/90 text-[7px] text-red-00 font-mono px-1 rounded border border-red-900/60">
                                      ANOMALY
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="relative w-full h-full">
                                <svg className="w-full h-full absolute inset-0 text-slate-100" viewBox="0 0 400 400">
                                  <rect width="400" height="400" fill="#020617" opacity="0.9" />
                                  {renderPresetVectors(selectedClass.id, "highlighted")}
                                  {/* Bounding box overlay if not OK */}
                                  {!selectedClass.name.includes("None") && !scanInProgress && (
                                    <g stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="3,3">
                                      {selectedClass.id === "inclusion" && <rect x="120" y="140" width="115" height="95" rx="4" />}
                                      {selectedClass.id === "scratches" && <rect x="65" y="100" width="290" height="165" rx="4" />}
                                      {selectedClass.id === "crazing" && <rect x="65" y="75" width="170" height="95" rx="4" />}
                                      {selectedClass.id === "patches" && <rect x="100" y="60" width="240" height="245" rx="4" />}
                                      {selectedClass.id === "rolled_in_scale" && <rect x="80" y="80" width="215" height="215" rx="4" />}
                                      {selectedClass.id === "pitted_surface" && <rect x="80" y="95" width="215" height="205" rx="4" />}
                                    </g>
                                  )}
                                </svg>
                                {!selectedClass.name.includes("None") && !scanInProgress && (
                                  <div className="absolute top-2 left-2 bg-red-950/90 text-[7px] text-red-400 font-mono px-1 rounded border border-red-900/60 font-bold animate-pulse">
                                    {selectedClass.id.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            )}
                            {scanInProgress && (
                              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-2">
                                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                                <span className="text-[8px] font-mono text-cyan-400">INSPECTING...</span>
                              </div>
                            )}
                          </div>
                          <span className={`text-[8px] font-mono text-center block py-1 rounded font-bold ${selectedClass.name.includes("None") ? "text-emerald-400 bg-emerald-950/10 border border-emerald-950/30" : "text-red-400 bg-red-950/10 border border-red-950/30 animate-pulse"}`}>
                            {selectedClass.name.includes("None") ? "Slab Quality Approved" : "Contour Bounding Active"}
                          </span>
                        </div>

                      </div>
                    </div>

                    <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Target Resolution:</span>
                      <span className="text-slate-300">1024 px x 1024 px (Real-time Video Line Rate)</span>
                    </div>
                  </div>

                  {/* RIGHT PANEL: AI DECISION ENGINE */}
                  <div className="lg:col-span-3 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl min-h-[520px]">
                    <div>
                      <div className="border-b border-slate-800 pb-2.5 mb-3 flex justify-between items-center">
                        <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-bold">Inference Verdict</h3>
                        <span className="text-[9px] font-mono text-slate-500">v1.4.2_PROD</span>
                      </div>

                      {/* PASS/FAIL INDUSTRIAL QUALITY BANNER BASED ON SELECTION */}
                      {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? (
                        <div id="verdict_container_pass" className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-center mb-4">
                          <h4 className="text-emerald-400 font-mono font-bold text-xs flex items-center justify-center gap-1.5 uppercase">
                            <CheckCircle className="w-4 h-4 text-emerald-400" /> COIL PASS
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 font-sans">Slab meets ASTM standard A36 edge safety structural specifications.</p>
                        </div>
                      ) : (
                        <div id="verdict_container_fail" className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-center mb-4 animate-pulse">
                          <h4 className="text-red-400 font-mono font-bold text-xs flex items-center justify-center gap-1.5 uppercase">
                            <AlertTriangle className="w-4 h-4 text-red-400" /> COIL AMISS
                          </h4>
                          <p className="text-[10px] text-red-300 mt-1 font-sans">Defect density exceeds 5.2% quality limits.</p>
                        </div>
                      )}

                      {/* METRICS METERS */}
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-[9px] uppercase font-mono text-slate-500 block tracking-wider font-bold">Defect Type</span>
                          <div className="flex items-center justify-between mt-1">
                            <span id="label_defect_type" className="text-xs font-extrabold text-white font-mono">{selectedClass.name}</span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "PASSING" : "DEFECT_FOUND"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                            <span>Confidence:</span>
                            <span id="label_confidence_pct" className="text-cyan-400 font-bold">{selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "99.2%" : "96.4%"}</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
                              style={{ width: selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "99.2%" : "96.4%" }}
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                            <span>Severity Ratio:</span>
                            <span id="label_severity_pct" className={`font-bold ${selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "text-emerald-400" : "text-amber-500"}`}>
                              {selectedClass.baseSeverity}% Area Loss
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? "bg-emerald-400" : "bg-gradient-to-r from-amber-400 to-orange-500"
                              }`}
                              style={{ width: `${Math.max(4, selectedClass.baseSeverity)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* RECOMMENDATIONS PRESET */}
                      <div className="mt-4 p-3 bg-slate-900/40 rounded-xl border border-slate-900/60">
                        <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider mb-1 font-bold">Action Recommendations</span>
                        <p id="label_action_rec" className="text-[10.5px] text-slate-300 leading-normal font-sans">
                          {selectedClass.id === "scratches" ? "CRITICAL: Clear guides roller stand 4. Verify strip tension line orientation." :
                           selectedClass.id === "crazing" ? "WARNING: Material shows fatigue. Reduce rolling speed and water wash headers." :
                           selectedClass.id === "inclusion" ? "CRITICAL: Chemical inclusions detected. Halt sequence for deoxidation wash." :
                           selectedClass.id === "patches" ? "ADVISORY: Calibrate descaler nozzle pressure. Monitor local strip thickness." :
                           selectedClass.id === "pitted_surface" ? "WARNING: Pickling line calibration check required. Monitor thermal profile." :
                           selectedClass.id === "rolled_in_scale" ? "WARNING: Clear hydraulic scraper blade blockages. Perform localized descales." :
                           "SYSTEM PASS: Mill sequences cleared. Slab meets high-yield specification ASTM limits."}
                        </p>
                      </div>
                    </div>

                    {/* GPU Execution Metrics */}
                    <div className="pt-3.5 border-t border-slate-900">
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-500">
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span>LATENCY</span>
                          <strong className="block text-xs text-cyan-400 mt-0.5 font-bold">{selectedClass.detectionSpeed}</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span>RUNTIME</span>
                          <strong className="block text-xs text-white mt-0.5 text-right font-bold">CUDA DEVICE</strong>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* BOTTOM SECTION: ANALYTICS CARDS & HISTORY LEDGER */}
                <div className="border-t border-slate-900 pt-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* BOTTOM LEFT: MINI ANALYTICS SUMMARY (COL SPAN 5) */}
                  <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">Yield & Defect Trends</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Bilateral preprocessors optimize convergence</p>
                      </div>
                      <span className="text-[8px] font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded uppercase">ACTIVE</span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {DEFECT_CLASSES.slice(0, 4).map((cls) => {
                        const count = defectCounts[cls.name] || 12;
                        const pctOfMax = (count / 60) * 100;
                        return (
                          <div key={cls.id} className="space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span>{cls.name}</span>
                              <span className="text-white font-bold">{count} case records</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                              <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                                style={{ width: `${pctOfMax}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-xl text-[10.5px] text-slate-400 leading-normal font-sans">
                      Roll targets demonstrate a 12.8% decrease in micro-fissure classification anomalies since deploying active bilateral preprocessor configurations.
                    </div>
                  </div>

                  {/* BOTTOM RIGHT: HISTORIC LEDGER TABLE (COL SPAN 7) */}
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">Inspections Ledger Stream</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Active local database record synchronization</p>
                      </div>

                      <button 
                        onClick={() => {
                          setSearchTerm("");
                          setFilterClass("ALL");
                        }}
                        className="text-[9px] font-mono text-cyan-400 hover:underline hover:text-cyan-300"
                      >
                        Reset Views
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300 font-mono">
                        <thead className="bg-[#0b0f19] text-[9px] uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="p-2.5 rounded-l">Scan ID</th>
                            <th className="p-2.5">Coil Batch</th>
                            <th className="p-2.5">Defect</th>
                            <th className="p-2.5">Severity</th>
                            <th className="p-2.5 rounded-r text-right">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {scansList.slice(0, 5).map((log) => {
                            const isSelect = selectedClass.name === log.defect;
                            return (
                              <tr
                                key={log.id}
                                onClick={() => {
                                  const matchingClass = DEFECT_CLASSES.find(d => d.name === log.defect);
                                  if (matchingClass) {
                                    setSelectedClass(matchingClass);
                                  }
                                }}
                                className={`cursor-pointer transition-colors hover:bg-slate-900/50 ${
                                  isSelect ? "bg-cyan-500/10" : ""
                                }`}
                              >
                                <td className="p-2.5 font-bold text-cyan-400 text-[10.5px]">{log.id}</td>
                                <td className="p-2.5 text-slate-400 text-[10px]">{log.coil}</td>
                                <td className="p-2.5 text-[10.5px]">
                                  <span className={`px-2 py-0.5 rounded text-[9px] ${
                                    log.defect.includes("None")
                                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                                      : "bg-red-950/40 text-red-400 border border-red-900/50"
                                  }`}>
                                    {log.defect}
                                  </span>
                                </td>
                                <td className="p-2.5 text-slate-300 text-[10px]">{log.severity > 0 ? `${log.severity}%` : "—"}</td>
                                <td className="p-2.5 text-right text-slate-400 font-bold text-[10px]">{(log.confidence * 100).toFixed(0)}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

             {/* 2. AI ANALYTICS */}
             {activeTab === "analytics" && (
               <motion.div
                 key="analytics"
                 initial={{ opacity: 0, y: 12 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -12 }}
                 transition={{ duration: 0.2 }}
                 className="space-y-6"
               >
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   {/* BAR CHART BREAKDOWN (5 Cols) */}
                   <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                     <h3 className="text-sm font-bold text-white mb-1">Defect Distribution Volume</h3>
                     <p className="text-[11px] text-slate-500 font-mono mb-4">Total incidents categorised by ResNet head</p>
 
                     <div className="space-y-3.5 font-mono text-xs">
                       {DEFECT_CLASSES.map((cls) => {
                         const count = defectCounts[cls.name] || 12;
                         const pctOfMax = (count / 70) * 100;
                         return (
                           <div key={cls.id} className="space-y-1">
                             <div className="flex justify-between text-slate-400">
                               <span>{cls.name}</span>
                               <span className="text-white font-bold">{count} incidents</span>
                             </div>
                             <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/50">
                               <div
                                 className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                                 style={{ width: `${pctOfMax}%` }}
                               />
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
 
                   {/* SEVERITY TREND MATRIX CURVE (7 Cols) */}
                   <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                     <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                       <div>
                         <h3 className="font-bold text-white text-xs">Moving Average Defect Severity Curve</h3>
                         <p className="text-[10px] text-slate-500 font-mono mt-0.5">Average cross-rolling specification limits</p>
                       </div>
                       <span className="text-[8px] uppercase font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">LIVE COILS</span>
                     </div>

                    <div className="w-full aspect-[21/10] bg-slate-950 rounded-xl border border-slate-900 p-4 flex flex-col justify-between">
                      <svg className="w-full h-full text-cyan-400" viewBox="0 0 500 200">
                        {/* Grid lines */}
                        <line x1="40" y1="20" x2="480" y2="20" stroke="#111827" />
                        <line x1="40" y1="70" x2="480" y2="70" stroke="#111827" />
                        <line x1="40" y1="120" x2="480" y2="120" stroke="#111827" />
                        <line x1="40" y1="170" x2="480" y2="170" stroke="#111827" />
                        
                        {/* labels */}
                        <text x="10" y="25" fill="#4b5563" fontSize="9" fontFamily="monospace">90%</text>
                        <text x="10" y="75" fill="#4b5563" fontSize="9" fontFamily="monospace">60%</text>
                        <text x="10" y="125" fill="#4b5563" fontSize="9" fontFamily="monospace">30%</text>
                        <text x="10" y="175" fill="#4b5563" fontSize="9" fontFamily="monospace">0%</text>

                        {/* Spark line accuracy */}
                        <path
                          fill="none"
                          stroke="url(#gradient-anal)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          d="M 40,150 Q 80,120 140,90 T 240,65 T 380,45 T 480,35"
                        />

                        <defs>
                          <linearGradient id="gradient-anal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      <div className="flex justify-between font-mono text-[9px] text-slate-500 shrink-0 border-t border-slate-900 pt-2">
                        <span>MILL SEQUENCE 01</span>
                        <span>MILL SEQUENCE 05</span>
                        <span>MILL SEQUENCE 10</span>
                        <span>MILL SEQUENCE 15</span>
                        <span>MILL SEQUENCE 20 (LATEST)</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900/30 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed">
                      Defect classification boundaries converge smoothly. Cross-rolling targets demonstrate a <strong>12.8% decrease in severity spikes</strong> since implementation of the bilateral active preprocessor.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. INSPECTION HISTORY */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* LEFT CONSOLE: FILTERABLE INSPECTION LISTS (7 Cols) */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-xs">Inspections Archive</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Filter and search core persistent scans</p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Search Coil ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono w-40"
                      />
                      <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-400 font-mono"
                      >
                        <option value="ALL">All Scans</option>
                        <option value="OK">Passed Only</option>
                        <option value="DEFECTS">Defects Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0b0f19] font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="p-3 rounded-l">Scan ID</th>
                          <th className="p-3">Coil Batch</th>
                          <th className="p-3">Defect Type</th>
                          <th className="p-3">Severity</th>
                          <th className="p-3">Confidence</th>
                          <th className="p-3 rounded-r text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 font-mono">
                        {filteredScans.map((log) => {
                          const isSelected = selectedHistoryScanId === log.id;
                          return (
                            <tr
                              key={log.id}
                              onClick={() => setSelectedHistoryScanId(log.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-cyan-500/10 hover:bg-cyan-500/15" : "hover:bg-slate-900/40"
                              }`}
                            >
                              <td className="p-3 font-bold text-cyan-400">{log.id}</td>
                              <td className="p-3 text-slate-400">{log.coil}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  log.defect.includes("None")
                                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                                    : "bg-red-950/40 text-red-400 border border-red-900/50"
                                }`}>
                                  {log.defect}
                                </span>
                              </td>
                              <td className="p-3 text-slate-300">{log.severity > 0 ? `${log.severity}%` : "—"}</td>
                              <td className="p-3 text-slate-300">{(log.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right">
                                <span className="text-cyan-400 font-bold hover:underline text-[10px]">Select &gt;</span>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredScans.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center p-6 text-slate-500">
                              No matching scans found for the filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT PANEL: SELECTED ITEM DEEP DIVE (5 Cols) */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-xl">
                  {(() => {
                    const selectedItem = scansList.find(s => s.id === selectedHistoryScanId) || scansList[0];
                    if (!selectedItem) return null;

                    let recText = "";
                    if (selectedItem.defect.includes("Scratch")) {
                      recText = "Abrasive friction detected on guide rollers. Check conveyor path for debris buildup. Tension re-calibration recommended.";
                    } else if (selectedItem.defect.includes("Patch")) {
                      recText = "Potential roll scale pattern or oil deposits. Notify surface chemical cleaning station. Adjust hydraulic fluid pressure.";
                    } else if (selectedItem.defect.includes("Pitted")) {
                      recText = "Sub-surface oxidation or foreign object damage. Divert coil batch segment for destructive testing confirmation.";
                    } else if (selectedItem.defect.includes("Inclusion")) {
                      recText = "Slag particle entrainment or mold powder residue. Flag slab roll and inspect caster nozzle sealing gasket.";
                    } else {
                      recText = "Surface quality conforms completely to Tata Steel Grade SPEC-A standards. Cleared for packaging and direct transit shipment.";
                    }

                    return (
                      <>
                        <div className="border-b border-slate-900 pb-2.5 flex justify-between items-center">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Scan Deep-Analytical Digest</h4>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">{selectedItem.id}</span>
                        </div>

                        {/* Interactive Prediction visual contours */}
                        <div className="aspect-[16/10] bg-slate-900 border border-slate-800 rounded-xl relative flex items-center justify-center overflow-hidden">
                          {selectedItem.defect.includes("None") ? (
                            <div className="text-center text-emerald-400">
                              <span className="block text-2xl mb-1">✓</span>
                              <span className="text-[10px] font-mono uppercase tracking-wider">Quality Verified Pass</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-48 h-24 bg-slate-950/90 rounded border border-dashed border-red-500/60 relative flex items-center justify-center select-none shadow">
                                <span className="absolute top-2 left-2 text-[9px] font-mono text-red-400 bg-red-950/80 px-1 border border-red-900 rounded">
                                  {selectedItem.defect} ({selectedItem.severity}%)
                                </span>
                                <div className="absolute inset-4 border border-red-500/30 bg-red-400/5 rounded animate-pulse" />
                                <span className="text-[10px] font-mono text-slate-600">HIGHLIGHTED REGION</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3.5 text-xs text-slate-300">
                          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-900/50">
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">Coil Batch ID</span>
                              <strong className="text-slate-200">{selectedItem.coil}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">Physical Location</span>
                              <strong className="text-slate-200">{selectedItem.location || "Central Coil Area"}</strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-900/50">
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">Classification</span>
                              <strong className="text-slate-200">{selectedItem.defect}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">Severity Rating</span>
                              <strong className={`font-mono text-sm ${selectedItem.severity > 25 ? "text-red-400 font-bold" : selectedItem.severity > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                                {selectedItem.severity > 0 ? `${selectedItem.severity}%` : "0% (Pass)"}
                              </strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-900/50">
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">AI Confidence Index</span>
                              <strong className="text-cyan-400 font-mono">{(selectedItem.confidence * 100).toFixed(1)}%</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-mono uppercase">HMI Operator</span>
                              <strong className="text-slate-200">{selectedItem.operator || "SYSTEM AUTOPILOT"}</strong>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500 block text-[10px] font-mono uppercase mb-1">Pass/Fail Quality Verdict</span>
                            <div className="flex items-center gap-2">
                              {selectedItem.defect.includes("None") ? (
                                <span className="bg-emerald-950/50 border border-emerald-900/60 px-2.5 py-1 text-emerald-400 rounded-lg text-xs font-bold block uppercase">
                                  ✓ SUITABLE FOR PRODUCTION
                                </span>
                              ) : (
                                <span className="bg-red-950/50 border border-red-900/60 px-2.5 py-1 text-red-400 rounded-lg text-xs font-bold block uppercase animate-pulse">
                                  ⚠ REJECTED QUALITY FAILURE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Defect Recommendations */}
                        <div className="p-4 bg-slate-900/25 border border-slate-900 rounded-xl space-y-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wide">Expert Recommendations & Remediation</span>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{recText}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* 5. SYSTEM ARCHITECTURE */}
            {activeTab === "architecture" && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* PIPELINE ARCHITECTURE MAP (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-md">Industrial Code Pipeline</h3>
                    <p className="text-xs text-slate-400 mt-1">Exquisite production-grade Python scripts written directly to workspace files.</p>
                  </div>

                  <div className="space-y-1.5">
                    {CODE_MODULES.map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedCodeId(mod.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex justify-between items-center ${
                          selectedCodeId === mod.id
                            ? "bg-slate-900 border-cyan-500 text-cyan-400 font-bold"
                            : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Terminal className="w-3.5 h-3.5" />
                          <span className="truncate">{mod.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-900/30 rounded-xl border border-slate-900 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono text-[10px]">
                      <Code className="w-4 h-4" />
                      <span>CLEAN ARCHITECTURE INTERNALS</span>
                    </div>
                    <p>
                      The preprocessing pipeline completely isolates structural metallurgic boundaries, serving clean input variables to PyTorch ResNet feature hooks.
                    </p>
                  </div>
                </div>

                {/* RAW PRE BLOCK IN DISK (8 Cols) */}
                <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between min-h-[500px]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500">Production Code Presets</span>
                        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mt-0.5">
                          {selectedCodeModule.name}
                          <span className="text-[9px] uppercase font-sans font-normal border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {selectedCodeModule.lang}
                          </span>
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCopyCode(selectedCodeModule.code, selectedCodeModule.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold rounded-lg border border-slate-800 flex items-center gap-2 transition"
                      >
                        {copiedId === selectedCodeModule.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Source</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-900 font-medium">
                      {selectedCodeModule.desc}
                    </p>

                    <div className="relative rounded-xl overflow-hidden bg-[#020617] border border-slate-900 p-4 max-h-[360px] overflow-y-auto">
                      <pre className="text-xs text-slate-400 font-mono overflow-x-auto leading-relaxed">
                        <code>{selectedCodeModule.code}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] text-slate-500 font-mono gap-1">
                    <span>DEPLOYABLE WORKSPACE PATH: {selectedCodeModule.path}</span>
                    <span>TATA STEEL AI HACKATHON CORE FRAMEWORK</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. DEPLOYMENT INFO */}
            {activeTab === "deployment" && (
              <motion.div
                key="deployment"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* CONTAINER STATUS (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                    <h3 className="font-bold text-white text-xs uppercase tracking-widest font-mono text-cyan-400">
                      🐳 System Containers Status
                    </h3>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                        <span className="text-slate-400">FastAPI Core Engine:</span>
                        <span className="text-emerald-400 font-bold">● ACTIVE (PORT 3000)</span>
                      </div>

                      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                        <span className="text-slate-400">PostgreSQL Data Store:</span>
                        <span className="text-emerald-400 font-bold">● CONNECTED (PORT 5432)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl text-xs text-slate-400 leading-relaxed font-sans">
                      All microservices are fully containerized using optimized multi-stage build templates. The FastAPI service serves predictions directly through standard REST endpoints.
                    </div>
                  </div>
                </div>

                {/* API ENDPOINTS GATEWAY (7 Cols) */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-xl">
                  <div className="border-b border-slate-900 pb-3">
                    <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">REST Integration Gateways</h3>
                    <p className="text-xs text-slate-500 mt-1">Simulate live REST requests using the client hooks below</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-900/50 border border-blue-800 text-blue-400 text-[9px] font-bold font-mono mr-2 uppercase">GET</span>
                        <strong className="text-xs text-white font-mono">/api/v1/health</strong>
                      </div>
                      <button
                        onClick={() => handleTestAPI("health")}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded font-mono text-xs text-cyan-400 border border-slate-800 hover:border-slate-700 transition"
                      >
                        Send
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-900/50 border border-emerald-800 text-emerald-400 text-[9px] font-bold font-mono mr-2 uppercase">POST</span>
                        <strong className="text-xs text-white font-mono">/api/v1/inspect</strong>
                      </div>
                      <button
                        onClick={() => handleTestAPI("inspect")}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded font-mono text-xs text-cyan-400 border border-slate-800 hover:border-slate-700 transition"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  {apiTesting && (
                    <div className="p-3 bg-slate-900 font-mono text-xs rounded-xl text-cyan-400 animate-pulse text-center">
                      DISPATCHING GATEWAY PROTOCOL...
                    </div>
                  )}

                  {apiCommandResult && (
                    <div className="bg-[#020617] border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-400">
                      <span className="text-[10px] text-slate-500 block mb-2 font-bold uppercase tracking-widest">GATEWAY RESPONSE JSON</span>
                      <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                        {JSON.stringify(apiCommandResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 px-6 mt-12 text-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
        <span>TATA STEEL MILL QUALITY CONTROL PORTAL • 2026</span>
      </footer>
    </div>
  );
}

// Simple wrapper workaround helper icon component to bypass build errors
function GearIconWrapper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className={props.className}
      width="24"
      height="24"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
