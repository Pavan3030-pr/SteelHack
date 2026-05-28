import React, { useState, useMemo, useEffect } from "react";
import {
  Activity,
  Cpu,
  RefreshCw,
  Sliders,
  FileCode,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Coins,
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
  Gauge,
  Tv,
  Video,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import DigitalTwin from "./components/DigitalTwin";
import RoiAnalytics from "./components/RoiAnalytics";
import FactoryControlCenter from "./components/FactoryControlCenter";
import IndustrialReportGenerator from "./components/IndustrialReportGenerator";
import NeuTrainingHub from "./components/NeuTrainingHub";
import LiveInferenceStation from "./components/LiveInferenceStation";
import SustainAnalytics from "./components/SustainAnalytics";

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

const DEFECT_DIAGNOSTICS: Record<string, {
  scienceExplanation: string;
  causes: { factor: string; probability: number }[];
  recommendations: string[];
  correctiveActions: string[];
}> = {
  scratches: {
    scienceExplanation: "Scratches are mechanical scores caused by solid surface sliding contact. In hot rolling, high shearing forces tear material away locally if guide plates or looper bearings seize. This creates longitudinal lines aligned with the roll path. Mechanical metal-on-metal sliding exceeds the material's shear yield limit.",
    causes: [
      { factor: "Seized Spherical Roller Bearings at Stand 4 Guide Desk", probability: 88 },
      { factor: "Weld-buildup/debris accumulation on shearing runout slide plate", probability: 74 },
      { factor: "Uncompensated tension spike causing excessive strip-looper friction", probability: 55 }
    ],
    recommendations: [
      "Verify radial bearing clearance on guide Stand 4 looper assemblies.",
      "Initiate manual physical cleanout of debris on shear slide paths.",
      "Re-calibrate speed differential tension control modules to limit friction drag."
    ],
    correctiveActions: [
      "Halt manual guide tension feedback sequence",
      "Inject lubrication grease to Stand 4 ball bearings",
      "Reset looper Level-2 gain parameters to safe margins",
      "Examine guide plate alignment using laser distance calibration"
    ]
  },
  crazing: {
    scienceExplanation: "Crazing represents a dense pattern of micro-fissures resembling spiderweb cracks. It stems from roll-surface thermal fatigue or 'heat crazing'. As rolls repeatedly alternate from hot slab contact (~1000°C) to direct water sprays (~40°C), severe thermal shock gradients exceed the elastic strain limit of high-alloy mill surfaces, causing microscopic tension fractures that imprint on the strip.",
    causes: [
      { factor: "High work-roll thermal fatigue from uneven water descaling", probability: 84 },
      { factor: "Heavy roll mechanical friction under high compression sequences", probability: 61 },
      { factor: "Insufficient coolant pressure on roll-surface thermal boundary", probability: 49 }
    ],
    recommendations: [
      "Perform high-resolution ultrasonic validation of active work rolls.",
      "Calibrate water header spraying angles to prevent thermal shadowzones.",
      "Schedule immediate roll surface grinding down to a 0.20mm recovery depth."
    ],
    correctiveActions: [
      "Trigger water cooling nozzle high-pressure flush sequence",
      "Deploy secondary descaler manifold to suppress delta-temperatures",
      "Reduce rolling mill speed by 15% to buffer shock sequences",
      "Record active roll temperature profile using thermo-scanner"
    ]
  },
  inclusion: {
    scienceExplanation: "Inclusions are trapped non-metallic particulate clusters (mostly alumina, slag, or silicates) that become embedded during continuous solidification. During subsequent high-pressure reduction passes, these pockets fail to deform cohesively with the steel matrix, opening micro-voids along grain boundaries and posing severe catastrophic structural failure risks.",
    causes: [
      { factor: "Ladle shroud sand/refractory lining disintegration during casting", probability: 91 },
      { factor: "Incomplete liquid steel slag separation in the tundish weir", probability: 76 },
      { factor: "Excessive aluminum deoxidation depletions creating float aggregates", probability: 58 }
    ],
    recommendations: [
      "Calibrate mold slag sensing level meters in continuous casting bay.",
      "Replace physical argon bubbling purge plugs on the shroud manifold.",
      "Schedule immediate chemical titration of feed ladle samples."
    ],
    correctiveActions: [
      "Toggle continuous casting tundish auto-shroud shutoff block",
      "Execute argon gas purging sequence in active transfer tube",
      "Divert current slab segment to scrap salvage bay",
      "Elevate ladle reheat furnace profile to 1545°C to liquefy slag"
    ]
  },
  patches: {
    scienceExplanation: "Patches represent irregular broad discolorations or scale layers on the warm coil surface. These appear when the rolling strip undergoes uneven oxidation, combined with coolant mist evaporation, producing patches of magnetite/hematite of unequal thickness, creating friction resistance variances and low aesthetic values.",
    causes: [
      { factor: "Water descaler header pressure drops under high mill speeds", probability: 78 },
      { factor: "Localized rolling lubricant breakdown causing micro-welding", probability: 64 },
      { factor: "Uneven cooling across width from misaligned spray-header nozzles", probability: 51 }
    ],
    recommendations: [
      "Measure pressure gradients on all high-yield descaler manifolds.",
      "Clean out water-jet filtration screens to clear physical corrosion scale.",
      "Adjust spray block overlap coordinates to ensure flat water distribution."
    ],
    correctiveActions: [
      "Deploy descaling pump high-pressure flush sequence",
      "Replace worn carbide nozzle components on spray block 3",
      "Apply dry-film roll lubricant to strip-entry tables",
      "Initiate localized pyrometer scan across strip width"
    ]
  },
  pitted_surface: {
    scienceExplanation: "Pitting occurs when tiny particulate iron scale becomes trapped under the work rolls and is forcibly pulled out during cold reduction, leaving cavities. Alternatively, chemical pitted craters occur when pickling line acid solutions exceed specified acid concentration limits or fail to rinse evenly, resulting in localized electrochemical corrosion.",
    causes: [
      { factor: "Pickle acid HCl concentrations exceeding standard limits", probability: 82 },
      { factor: "Debris feedback transfer from secondary rollers", probability: 69 },
      { factor: "Neutralizing bath PH drift leading to electrochemical pitting", probability: 45 }
    ],
    recommendations: [
      "Perform a double-titration diagnostic of hydrochloric acid baths.",
      "Wipe clean dry rollers using magnetic scraper scrap plates.",
      "Recirculate neutralizing rinse water to clear chemical salt carryovers."
    ],
    correctiveActions: [
      "Increase neutralization water pump speed by 20%",
      "Wipe guide Roller Stand 3 with magnetic separator bars",
      "Acquire pickle bath acid titration flask samples",
      "Calibrate rinse bath pH meter to exactly 7.2"
    ]
  },
  rolled_in_scale: {
    scienceExplanation: "Rolled-in scale is a surface defect formed when the primary scale layer generated on hot slabs is not fully fractured or swept away prior to reduction. The mill rolls turn this solid scale oxide into a hard shell and press it directly into the steel matrix, producing dark, flaky depressions that weaken corrosion resistance.",
    causes: [
      { factor: "Scale scraper blade mechanical friction and spring-slack fatigue", probability: 85 },
      { factor: "Combustion gas imbalance creating excessive oxygen atmosphere in furnace", probability: 71 },
      { factor: "Low impact kinetic energy of descaling spray jets", probability: 60 }
    ],
    recommendations: [
      "Replace mechanical steel brush assemblies on furnace exit sliders.",
      "Re-tune furnace gas-to-air burners to establish a protective reducing gas atmosphere.",
      "Test descaling high pressure pump velocity outputs against ASTM spec standards."
    ],
    correctiveActions: [
      "Boost active descaling header bar pressure to 180 Bar",
      "Calibrate furnace burner stoichiometry to under 1.2% O2 boundary",
      "Adjust backing spring pressure on scrapers to 240 Newtons",
      "Sweep loose scale flakes from slab edges via auxiliary air-knives"
    ]
  }
};

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
    "control" | "dashboard" | "analytics" | "history" | "architecture" | "deployment" | "twin" | "roi" | "reports" | "training" | "inference" | "sustainability"
  >("control");

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

  // Explainable AI (XAI) State variables
  const [showOriginal, setShowOriginal] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapAlpha, setHeatmapAlpha] = useState(0.55);
  const [resnetLayer, setResnetLayer] = useState<"Conv5_x" | "Conv4_x" | "Conv3_x">("Conv5_x");
  const [attentionCenter, setAttentionCenter] = useState({ x: 200, y: 180 });

  // Predictive Industrial Analytics & Maintenance Engine States
  const [lineStrain, setLineStrain] = useState(42); 
  const [motorTemp, setMotorTemp] = useState(72);
  const [coolingForce, setCoolingForce] = useState(85);
  const [pdmRollingSpeed, setPdmRollingSpeed] = useState(12.4);
  const [historicalDefects, setHistoricalDefects] = useState([
    { day: "Mon", crazing: 12, scratches: 18, inclusion: 5, pitted: 8, scale: 9, total: 52 },
    { day: "Tue", crazing: 15, scratches: 16, inclusion: 7, pitted: 12, scale: 11, total: 61 },
    { day: "Wed", crazing: 11, scratches: 22, inclusion: 4, pitted: 10, scale: 8, total: 55 },
    { day: "Thu", crazing: 9, scratches: 14, inclusion: 8, pitted: 15, scale: 13, total: 59 },
    { day: "Fri", crazing: 16, scratches: 25, inclusion: 6, pitted: 9, scale: 15, total: 71 },
    { day: "Sat", crazing: 14, scratches: 19, inclusion: 3, pitted: 7, scale: 8, total: 51 },
    { day: "Sun", crazing: 10, scratches: 12, inclusion: 2, pitted: 6, scale: 5, total: 35 },
  ]);

  const [activeAnomalies, setActiveAnomalies] = useState([
    { id: "PANOM-09", component: "Roller Bearing Stand 4", severity: "HIGH", probability: 88, details: "Micro-vibration frequency shift detected in lower roller casing.", status: "Active", time: "2 hours ago" },
    { id: "PANOM-10", component: "Water Descaling Spray Nozzle A4", severity: "MED", probability: 64, details: "Partial fluid flow reduction sensed, leading to scale hazard.", status: "Active", time: "5 hours ago" },
    { id: "PANOM-11", component: "Hydraulic Tensioning Cylinder 2", severity: "LOW", probability: 35, details: "Minor pressure oscillation under heavy load sequences.", status: "Resolved", time: "Yesterday" }
  ]);

  // Derived predictive maintenance metrics
  const machineHealthScore = useMemo(() => {
    let health = 100;
    if (lineStrain > 40) {
      health -= (lineStrain - 40) * 0.6;
    }
    if (motorTemp > 65) {
      health -= (motorTemp - 65) * 0.7;
    }
    if (coolingForce < 80) {
      health -= (80 - coolingForce) * 0.8;
    } else if (coolingForce > 95) {
      health -= (coolingForce - 95) * 0.4;
    }
    if (pdmRollingSpeed > 12) {
      health -= (pdmRollingSpeed - 12) * 2.5;
    }
    return Math.max(5, Math.min(100, Math.round(health)));
  }, [lineStrain, motorTemp, coolingForce, pdmRollingSpeed]);

  const failureProbability = useMemo(() => {
    const p = Math.round((100 - machineHealthScore) * 1.05);
    return Math.max(2, Math.min(98, p));
  }, [machineHealthScore]);

  const defectTrendGrowth = useMemo(() => {
    const base = ((100 - machineHealthScore) / 4.2) - 5;
    return parseFloat(base.toFixed(1));
  }, [machineHealthScore]);

  const machineAlertStatus = useMemo(() => {
    if (machineHealthScore >= 82) return "GREEN";
    if (machineHealthScore >= 62) return "YELLOW";
    return "RED";
  }, [machineHealthScore]);

  const forecastMultiplier = useMemo(() => {
    return 1 + (100 - machineHealthScore) / 38;
  }, [machineHealthScore]);

  // AI-powered Root Cause Decision Support system states & memos
  const [checkedInterventions, setCheckedInterventions] = useState<Record<string, boolean>>({});

  const calculatedSeverityClass = useMemo(() => {
    const score = selectedClass.baseSeverity;
    if (selectedClass.name === "None (OK)" || selectedClass.name.includes("None")) {
      return { 
        label: "NOMINAL", 
        color: "text-emerald-400 bg-emerald-950/40 border-emerald-950/50", 
        badgeBg: "bg-emerald-500/10",
        percentage: 0 
      };
    }
    if (score < 15) {
      return { 
        label: "LOW SEVERITY", 
        color: "text-cyan-400 bg-cyan-950/20 border-cyan-800/30", 
        badgeBg: "bg-cyan-500/10",
        percentage: score 
      };
    }
    if (score < 25) {
      return { 
        label: "MODERATE SEVERITY", 
        color: "text-amber-500 bg-amber-950/20 border-amber-800/30", 
        badgeBg: "bg-amber-500/10",
        percentage: score 
      };
    }
    return { 
      label: "CRITICAL SEVERITY", 
      color: "text-red-400 bg-red-950/45 border-red-900/40", 
      badgeBg: "bg-red-500/10 animate-pulse",
      percentage: score 
    };
  }, [selectedClass]);

  const automaticOperatorRecommendation = useMemo(() => {
    if (selectedClass.name === "None (OK)" || selectedClass.name.includes("None")) {
      return `[AUTOPILOT COGNITIVE REPORT]: Current rolling-stand sequences are operating under optimal mechanical configurations. Calculated line load at speed ${pdmRollingSpeed} m/s and cooling jet pressure at ${coolingForce} PSI are aligned with ASTM-A36 compliance curves. Continue scheduled casting line telemetry sweep.`;
    }

    let text = `[DECISION-SUPPORT INSIGHT]: Dynamic classification model confirmed a ${calculatedSeverityClass.label} hazard state for defect '${selectedClass.name}'. `;
    
    // Custom recommendation based on live simulator gauges
    if (lineStrain > 60) {
      text += `The active Line Strain coeff is extremely high at ${lineStrain}%, causing continuous heavy strip deflection. This elevates mechanical sliding friction with guide Stand 4 rollers, multiplying scratch occurrences. Damping line strain below 30% is highly recommended. `;
    } else {
      text += `Line strain coefficient is within normal bounds (${lineStrain}%), indicating the physical defect triggers stem from localized roller scaling or chemical pickling drifts. `;
    }

    if (motorTemp > 75) {
      text += `Severe Motor Core overheating detected (${motorTemp}°C). This triggers thermal dimensional growth on hot reducers, accelerating surface micro-crazing and flaking along material boundaries. Initiate an immediate high-pressure scale descaling jet flush. `;
    } else if (coolingForce < 75) {
      text += `Insufficient cooling manifold spray pressure registered at ${coolingForce} PSI. The oxide protective barrier is failing to scale-off cleanly. Inclusions and scale pits will continue to propagate. Trigger cooling jet descaler immediately. `;
    } else {
      text += `Sub-system temperatures (${motorTemp}°C) and water spray pressure parameters (${coolingForce} PSI) are within designated margins. `;
    }

    if (pdmRollingSpeed > 15) {
      text += `The hot strip line is operating at high load speed (${pdmRollingSpeed} m/s), setting off micro-vibrations across structural bearings. Retarding linespeed to under 12 m/s will preserve roll roll-alignment geometry. `;
    }

    text += `\n\n[RECOMMENDED OPERATOR STEPS]: Engage the targeted fault control interventions listed in the Decision-Support checklist below immediately.`;
    return text;
  }, [selectedClass, lineStrain, motorTemp, coolingForce, pdmRollingSpeed, calculatedSeverityClass]);

  // DRAW PRESET VECTORS TO CANVAS
  const drawPresetVectorsToCanvas = (ctx: CanvasRenderingContext2D, classId: string, stage: "raw" | "processed" | "highlighted") => {
    const isRaw = stage === "raw";
    const isProcessed = stage === "processed";
    const isHigh = stage === "highlighted";

    const color = isHigh ? "#ef4444" : "#475569";
    const lineWidth = isRaw ? 1.5 : 2.5;

    ctx.strokeStyle = color;
    ctx.fillStyle = isHigh ? "rgba(239, 68, 68, 0.15)" : "rgba(71, 85, 105, 0.2)";
    ctx.lineWidth = lineWidth;

    switch (classId) {
      case "crazing": {
        ctx.beginPath();
        ctx.moveTo(80, 100); ctx.lineTo(95, 120); ctx.lineTo(100, 105); ctx.lineTo(120, 110);
        ctx.lineTo(115, 130); ctx.lineTo(140, 115); ctx.lineTo(125, 145); ctx.lineTo(150, 150);
        ctx.lineTo(160, 135);
        ctx.moveTo(100, 105); ctx.lineTo(115, 90); ctx.lineTo(130, 100);
        ctx.moveTo(125, 145); ctx.lineTo(110, 165);
        ctx.moveTo(150, 150); ctx.lineTo(180, 155); ctx.lineTo(190, 140);
        ctx.moveTo(140, 115); ctx.lineTo(170, 100); ctx.lineTo(180, 120); ctx.lineTo(220, 110);
        ctx.moveTo(220, 240); ctx.lineTo(235, 260); ctx.lineTo(240, 245); ctx.lineTo(260, 250);
        ctx.lineTo(255, 270); ctx.lineTo(280, 255); ctx.lineTo(265, 285);
        ctx.stroke();
        break;
      }
      case "inclusion": {
        ctx.beginPath(); ctx.arc(160, 180, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(180, 195, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse?.(140, 205, 8, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = isHigh ? "rgba(239, 68, 68, 0.35)" : "rgba(30, 41, 59, 0.5)";
        ctx.strokeStyle = isHigh ? "#ef4444" : "#475569";
        ctx.beginPath(); ctx.arc(210, 160, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break;
      }
      case "patches": {
        ctx.beginPath();
        ctx.moveTo(120, 130);
        ctx.quadraticCurveTo(180, 80, 250, 140);
        ctx.quadraticCurveTo(285, 180, 320, 220);
        ctx.quadraticCurveTo(220, 290, 140, 240);
        ctx.quadraticCurveTo(130, 185, 120, 130);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.quadraticCurveTo(80, 40, 100, 80);
        ctx.quadraticCurveTo(110, 100, 120, 120);
        ctx.quadraticCurveTo(70, 120, 40, 90);
        ctx.quadraticCurveTo(45, 70, 50, 50);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      case "pitted_surface": {
        const pits = [
          { cx: 100, cy: 120, r: 3 }, { cx: 105, cy: 115, r: 2.5 }, { cx: 115, cy: 122, r: 4 },
          { cx: 250, cy: 220, r: 3 }, { cx: 260, cy: 235, r: 4.5 }, { cx: 245, cy: 240, r: 2.5 },
          { cx: 270, cy: 225, r: 3 }, { cx: 180, cy: 150, r: 4 }, { cx: 190, cy: 155, r: 3 },
          { cx: 150, cy: 280, r: 3.5 }, { cx: 140, cy: 272, r: 2 }, { cx: 158, cy: 275, r: 4.5 }
        ];
        pits.forEach(p => {
          ctx.beginPath();
          if (isHigh && p.cx === 158) {
            ctx.fillStyle = "#ef4444";
            ctx.arc(p.cx, p.cy, p.r + 1, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = color;
            ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2);
          }
          ctx.fill();
        });
        break;
      }
      case "rolled_in_scale": {
        ctx.beginPath();
        ctx.moveTo(100, 100); ctx.bezierCurveTo(120, 120, 120, 140, 100, 160);
        ctx.moveTo(120, 110); ctx.bezierCurveTo(140, 130, 140, 150, 120, 170);
        ctx.moveTo(140, 120); ctx.bezierCurveTo(160, 140, 160, 160, 140, 180);
        ctx.moveTo(220, 200); ctx.bezierCurveTo(240, 220, 240, 240, 220, 260);
        ctx.moveTo(240, 210); ctx.bezierCurveTo(260, 230, 260, 250, 240, 270);
        ctx.moveTo(260, 220); ctx.bezierCurveTo(280, 240, 280, 260, 260, 280);
        ctx.stroke();
        break;
      }
      case "scratches": {
        ctx.beginPath();
        ctx.moveTo(80, 120); ctx.lineTo(300, 150);
        ctx.moveTo(90, 135); ctx.lineTo(280, 160);
        ctx.moveTo(150, 220); ctx.lineTo(340, 245);
        ctx.stroke();
        break;
      }
    }
  };

  // GRAD-CAM CORE HOTSPOT generator
  const drawHeatmapHotspot = (ctx: CanvasRenderingContext2D, cx: number, cy: number, layer: string, intensityMultiplier = 1.0) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = heatmapAlpha * intensityMultiplier;

    let rInner = 15;
    let rOuter = 70;
    if (layer === "Conv4_x") {
      rInner = 35;
      rOuter = 130;
    } else if (layer === "Conv3_x") {
      rInner = 70;
      rOuter = 220;
    }

    const radGrad = ctx.createRadialGradient(cx, cy, rInner * 0.1, cx, cy, rOuter);
    radGrad.addColorStop(0.0, "rgba(239, 68, 68, 0.95)");
    radGrad.addColorStop(0.15, "rgba(249, 115, 22, 0.85)");
    radGrad.addColorStop(0.35, "rgba(234, 179, 8, 0.6)");
    radGrad.addColorStop(0.55, "rgba(34, 197, 94, 0.35)");
    radGrad.addColorStop(0.75, "rgba(59, 130, 246, 0.15)");
    radGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // DRAW SELECTED HEATMAPS
  const drawHeatmapsForClass = (ctx: CanvasRenderingContext2D, classId: string, layer: string) => {
    if (customImage) {
      drawHeatmapHotspot(ctx, attentionCenter.x, attentionCenter.y, layer, 1.0);
      drawHeatmapHotspot(ctx, attentionCenter.x + 35, attentionCenter.y - 25, layer, 0.4);
      return;
    }

    switch (classId) {
      case "crazing":
        drawHeatmapHotspot(ctx, 120, 110, layer, 0.9);
        drawHeatmapHotspot(ctx, 250, 260, layer, 0.7);
        break;
      case "inclusion":
        drawHeatmapHotspot(ctx, 210, 160, layer, 1.0);
        drawHeatmapHotspot(ctx, 160, 180, layer, 0.5);
        break;
      case "patches":
        drawHeatmapHotspot(ctx, 220, 180, layer, 1.0);
        break;
      case "pitted_surface":
        drawHeatmapHotspot(ctx, 158, 275, layer, 1.0);
        drawHeatmapHotspot(ctx, 110, 120, layer, 0.55);
        drawHeatmapHotspot(ctx, 250, 220, layer, 0.45);
        break;
      case "rolled_in_scale":
        drawHeatmapHotspot(ctx, 120, 140, layer, 0.85);
        drawHeatmapHotspot(ctx, 250, 240, layer, 0.82);
        break;
      case "scratches":
        drawHeatmapHotspot(ctx, 190, 135, layer, 1.0);
        drawHeatmapHotspot(ctx, 240, 230, layer, 0.6);
        break;
    }
  };

  // MAIN OVERLAY DRAWER
  const drawOverlays = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const isOk = selectedClass.name === "None (OK)" || selectedClass.name.includes("None");

    // A. HEATMAPS
    if (showHeatmap && !isOk && !scanInProgress) {
      drawHeatmapsForClass(ctx, selectedClass.id, resnetLayer);
    }

    // B. ORIGINAL DEFECT VECTORS HIGHLIGHT (GLOWING RED)
    if (!isOk && !scanInProgress) {
      ctx.save();
      drawPresetVectorsToCanvas(ctx, selectedClass.id, "highlighted");
      ctx.restore();
    }

    // C. BOUNDING BOXES
    if (showBoundingBoxes && !isOk && !scanInProgress) {
      ctx.save();

      let bx = 80, by = 80, bw = 200, bh = 200;
      if (customImage) {
        bx = Math.max(10, attentionCenter.x - 70);
        by = Math.max(10, attentionCenter.y - 60);
        bw = 140;
        bh = 120;
        if (bx + bw > w) bx = w - bw - 10;
        if (by + bh > h) by = h - bh - 10;
      } else {
        switch (selectedClass.id) {
          case "crazing": bx = 65; by = 75; bw = 170; bh = 95; break;
          case "inclusion": bx = 120; by = 140; bw = 115; bh = 95; break;
          case "patches": bx = 100; by = 60; bw = 240; bh = 245; break;
          case "pitted_surface": bx = 80; by = 95; bw = 215; bh = 205; break;
          case "rolled_in_scale": bx = 80; by = 80; bw = 215; bh = 215; break;
          case "scratches": bx = 65; by = 100; bw = 290; bh = 165; break;
        }
      }

      ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
      ctx.fillRect(bx, by, bw, bh);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      ctx.lineWidth = 3.5;
      const bracketLen = 12;
      ctx.beginPath(); ctx.moveTo(bx + bracketLen, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + bracketLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw - bracketLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bracketLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx, by + bh - bracketLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bracketLen, by + bh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw - bracketLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bracketLen); ctx.stroke();

      const tagText = `${selectedClass.name.toUpperCase()} (CONF: ${selectedClass.name === "None (OK)" ? "99" : "96.4"}%)`;
      ctx.font = "bold 8.5px monospace";
      const textWidth = ctx.measureText(tagText).width;

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(bx, by - 14, textWidth + 10, 14);

      ctx.fillStyle = "#0c0a0f";
      ctx.fillText(tagText, bx + 5, by - 4);

      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
      ctx.stroke();

      ctx.restore();
    } else if (showBoundingBoxes && isOk && !scanInProgress) {
      ctx.save();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(15, 15, w - 30, h - 30);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 9px monospace";
      ctx.fillText("[SENSE: STRIP COMPLIANT]", 25, 30);
      ctx.restore();
    }

    if (!scanInProgress) {
      ctx.save();
      ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
      ctx.font = "7.5px monospace";
      ctx.fillText(`LAYER: ${resnetLayer}  |  STATUS: EXPLAINABLE_CORE_OK  |  PROBE: ${customImage ? "MANUAL" : "AUTO"}`, 12, h - 12);

      if (customImage && showHeatmap) {
        ctx.fillStyle = "rgba(34, 211, 238, 0.85)";
        ctx.font = "bold 8px monospace";
        ctx.fillText("⌖ RE-FOCUS TARGET: CLICK STEEL VIEWPORT SURFACE", 12, 22);

        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(attentionCenter.x, attentionCenter.y, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(attentionCenter.x - 10, attentionCenter.y); ctx.lineTo(attentionCenter.x + 10, attentionCenter.y);
        ctx.moveTo(attentionCenter.x, attentionCenter.y - 10); ctx.lineTo(attentionCenter.x, attentionCenter.y + 10);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  // EXPLAINABLE ENGINE RENDERING DIRECT DRAW
  const drawExplainableCanvas = () => {
    const canvas = document.getElementById("explainable_ai_canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (showOriginal) {
      if (customImage) {
        const img = new Image();
        img.src = customImage;
        img.onload = () => {
          ctx.save();
          const blurVal = (numIterationsBilateral - 5) / 10;
          const contrastVal = claheClipValue * 30 + 70;
          ctx.filter = `contrast(${contrastVal}%) blur(${blurVal}px) grayscale(${cvStage === "clahe" || cvStage === "contour" ? "100%" : "0%"})`;
          ctx.drawImage(img, 0, 0, w, h);
          ctx.restore();

          drawOverlays(ctx, w, h);
        };
        img.onerror = () => {
          drawProceduralSteel(ctx, w, h);
          drawOverlays(ctx, w, h);
        };
        return;
      } else {
        drawProceduralSteel(ctx, w, h);
        drawOverlays(ctx, w, h);
      }
    } else {
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);
      drawOverlays(ctx, w, h);
    }
  };

  const drawProceduralSteel = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#1e293b");
    grad.addColorStop(0.5, "#0f172a");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let i = 0; i < h; i += 3) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.006)";
    ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2.5, 0, Math.PI * 2); ctx.fill();

    const blurVal = (numIterationsBilateral - 5) / 15;
    const contrastVal = claheClipValue * 25 + 75;
    ctx.filter = `contrast(${contrastVal}%) blur(${blurVal}px)`;

    drawPresetVectorsToCanvas(ctx, selectedClass.id, "raw");
    ctx.restore();
  };

  // HANDLE CANVAS VIEWPORT CLICK
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!customImage) return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setAttentionCenter({ x: Math.round(x), y: Math.round(y) });
  };

  // DOWNLOAD CERTIFIED REPORT
  const downloadInspectionReport = () => {
    const reportCanvas = document.createElement("canvas");
    reportCanvas.width = 1100;
    reportCanvas.height = 800;
    const ctx = reportCanvas.getContext("2d");
    if (!ctx) return;

    // Outer dark frame
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, 1100, 800);

    // Matrix grid background
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1100; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 800); ctx.stroke();
    }
    for (let y = 0; y < 800; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1100, y); ctx.stroke();
    }

    // Glowing cyan outline
    ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, 1076, 776);

    // Header label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px monospace";
    ctx.fillText("TATA STEEL AUTOMATED COIL SPECTRUM REPORT", 40, 50);

    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 11px monospace";
    ctx.fillText("EXPLAINABLE AI DEEP-LEARNING RE-Rolling DIAGNOSTICS", 40, 72);

    ctx.fillStyle = "#475569";
    ctx.font = "10.5px monospace";
    const recordTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    ctx.fillText(`SERIAL_ID: TS-RE-ONNX-${Math.floor(10000 + Math.random() * 90000)} | RECORDED: ${recordTime} UTC | WORKSPACE_PROD: TATASECURE`, 40, 94);

    // Header Separator line
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, 108); ctx.lineTo(1060, 108); ctx.stroke();

    // Draw main visual capture
    const mainCanvas = document.getElementById("explainable_ai_canvas") as HTMLCanvasElement;
    if (mainCanvas) {
      // visual plate box background
      ctx.fillStyle = "#0c0f1d";
      ctx.fillRect(45, 140, 480, 480);
      ctx.drawImage(mainCanvas, 45, 140, 480, 480);
      
      ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(45, 140, 480, 480);

      // Plate Label
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 10px monospace";
      ctx.fillText("CAPTURE FIG 1.0: LIVE Conv5_x Grad-CAM ATTENTION MAP", 45, 642);
    }

    // Inference results details right column
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.fillRect(570, 140, 485, 480);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.strokeRect(570, 140, 485, 480);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px monospace";
    ctx.fillText("ANALYSIS DECISION MODULE", 600, 185);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText("DETECTION PARADIGM:", 600, 225);
    
    const isOkVal = selectedClass.name.includes("None") || selectedClass.name === "None (OK)";
    ctx.fillStyle = isOkVal ? "#34d399" : "#f87171";
    ctx.font = "bold 18px monospace";
    ctx.fillText(selectedClass.name.toUpperCase(), 600, 250);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText("PREDICTION ACCURACY INDEX:", 600, 300);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(isOkVal ? "99.2%" : "96.4%", 600, 325);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText("SPECIFICATION SEVERITY AREA COEFF:", 600, 375);
    ctx.fillStyle = isOkVal ? "#34d399" : "#f59e0b";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${selectedClass.baseSeverity}% Area Damage Coefficient`, 600, 400);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 11px monospace";
    ctx.fillText("PRESCRIBED PROTOCOL CORRECTIONS:", 600, 455);
    
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "11.5px sans-serif";
    const actionText = selectedClass.id === "scratches" ? "CRITICAL: Clear guides roller stand 4. Verify strip tension line orientation." :
                       selectedClass.id === "crazing" ? "WARNING: Material shows fatigue. Reduce rolling speed and water wash headers." :
                       selectedClass.id === "inclusion" ? "CRITICAL: Chemical inclusions detected. Halt sequence for deoxidation wash." :
                       selectedClass.id === "patches" ? "ADVISORY: Calibrate descaler nozzle pressure. Monitor local strip thickness." :
                       selectedClass.id === "pitted_surface" ? "WARNING: Pickling line calibration check required. Monitor thermal profile." :
                       selectedClass.id === "rolled_in_scale" ? "WARNING: Clear hydraulic scraper blade blockages. Perform localized descales." :
                       "SYSTEM PASS: Mill sequences cleared. Slab meets high-yield specification ASTM limits.";
    
    let lineText = "";
    let startY = 482;
    const words = actionText.split(" ");
    for (let u = 0; u < words.length; u++) {
      const checkLine = lineText + words[u] + " ";
      const testW = ctx.measureText(checkLine).width;
      if (testW > 420 && u > 0) {
        ctx.fillText(lineText, 600, startY);
        lineText = words[u] + " ";
        startY += 18;
      } else {
        lineText = checkLine;
      }
    }
    ctx.fillText(lineText, 600, startY);

    ctx.fillStyle = "#475569";
    ctx.font = "9.5px monospace";
    ctx.fillText("INTEGRATION_STACK: ONNX, BILATERAL PREPROCESSOR v1.4", 600, 565);
    ctx.fillText("OFFICIAL SEAL: CERTIFIED STRUCTURAL STEEL RE-ROLL RELEASE", 600, 582);

    ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
    ctx.strokeRect(880, 500, 140, 90);
    ctx.fillStyle = "rgba(34, 211, 238, 0.02)";
    ctx.fillRect(880, 500, 140, 90);
    ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
    ctx.font = "8px monospace";
    ctx.fillText("TATA JUPITER LABS", 890, 522);
    ctx.fillText("METALLURG STAMP", 890, 542);
    ctx.fillStyle = isOkVal ? "#34d399" : "#fb7185";
    ctx.font = "bold 9px monospace";
    ctx.fillText(isOkVal ? "STATUS: PASS" : "STATUS: REJECT", 890, 565);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.font = "bold 9.5px monospace";
    ctx.fillText("COIL VALIDITY SEAL DOCUMENT. REPORT HAS BEEN ELECTRONICALLY SIGNED BY ONNX CONVNET CONTROLLERS.", 40, 750);

    const downLink = document.createElement("a");
    downLink.download = `TATA_AI_QC_REPORT_${selectedClass.id.toUpperCase()}_${Math.floor(100+Math.random()*900)}.png`;
    downLink.href = reportCanvas.toDataURL("image/png");
    downLink.click();
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      const t = setTimeout(() => {
        drawExplainableCanvas();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [
    activeTab,
    selectedClass,
    customImage,
    showOriginal,
    showBoundingBoxes,
    showHeatmap,
    heatmapAlpha,
    resnetLayer,
    attentionCenter,
    cvStage,
    scanInProgress,
    numIterationsBilateral,
    claheClipValue
  ]);

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
            { id: "control", label: "Smart Factory HUD", icon: Tv },
            { id: "inference", label: "Live Vision Inference", icon: Video },
            { id: "dashboard", label: "Inspection Dashboard", icon: Sliders },
            { id: "twin", label: "Digital Twin 3D", icon: Cpu },
            { id: "roi", label: "Executive ROI Center", icon: Coins },
            { id: "sustainability", label: "Sustainability & ESG", icon: Leaf },
            { id: "reports", label: "QA Report Center", icon: FileText },
            { id: "training", label: "NEU Model Training", icon: Cpu },
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

                  {/* CENTER PANEL: EXPLAINABLE AI CORE SENSING UNIT */}
                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl min-h-[520px]">
                    <div>
                      {/* Header with Certified Download Trigger */}
                      <div className="border-b border-slate-800 pb-2.5 mb-4 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-bold">
                            Explainable AI Core (Grad-CAM)
                          </h3>
                        </div>
                        <button
                          onClick={downloadInspectionReport}
                          className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 hover:text-cyan-300 font-bold font-mono text-[9px] tracking-wide uppercase rounded border border-cyan-800/50 transition duration-200"
                          title="Generate high resolution official PDF/PNG diagnostic report of this automated quality inspection state."
                        >
                          <Download className="w-3 h-3" />
                          <span>CERTIFIED REPORT</span>
                        </button>
                      </div>

                      {/* Diagnostic Dashboard Controls & Sliders inside Viewport */}
                      <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl mb-4 space-y-3 font-mono">
                        
                        {/* Interactive Toggles & Activation */}
                        <div className="grid grid-cols-3 gap-2 text-[9px]">
                          <button
                            onClick={() => {
                              setShowOriginal(!showOriginal);
                              setTimeout(() => drawExplainableCanvas(), 10);
                            }}
                            className={`py-1.5 px-2 rounded font-bold uppercase transition flex items-center justify-center gap-1 border ${
                              showOriginal 
                                ? "bg-cyan-950/20 text-cyan-400 border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                                : "bg-slate-950 text-slate-500 border-slate-800"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${showOriginal ? "bg-cyan-400" : "bg-slate-700"}`} />
                            <span>1. Raw Texture</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowBoundingBoxes(!showBoundingBoxes);
                              setTimeout(() => drawExplainableCanvas(), 10);
                            }}
                            className={`py-1.5 px-2 rounded font-bold uppercase transition flex items-center justify-center gap-1 border ${
                              showBoundingBoxes 
                                ? "bg-cyan-950/20 text-cyan-400 border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                                : "bg-slate-950 text-slate-500 border-slate-800"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${showBoundingBoxes ? "bg-cyan-400" : "bg-slate-700"}`} />
                            <span>2. Bounding Box</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowHeatmap(!showHeatmap);
                              setTimeout(() => drawExplainableCanvas(), 10);
                            }}
                            className={`py-1.5 px-2 rounded font-bold uppercase transition flex items-center justify-center gap-1 border ${
                              showHeatmap 
                                ? "bg-cyan-950/20 text-cyan-400 border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                                : "bg-slate-950 text-slate-500 border-slate-800"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${showHeatmap ? "bg-cyan-400" : "bg-slate-700"}`} />
                            <span>3. Attention Map</span>
                          </button>
                        </div>

                        {/* Dropdown ResNet Backprop Layers + Alpha Blending Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/40">
                          
                          {/* Backprop Layer Selectors */}
                          <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded border border-slate-800/80">
                            <span className="text-[9px] text-slate-400 uppercase font-bold">ResNet Layer:</span>
                            <div className="flex gap-1.5">
                              {(["Conv5_x", "Conv4_x", "Conv3_x"] as const).map((layer) => (
                                <button
                                  key={layer}
                                  onClick={() => {
                                    setResnetLayer(layer);
                                    setTimeout(() => drawExplainableCanvas(), 10);
                                  }}
                                  className={`px-1.5 py-0.5 text-[8.5px] font-bold rounded ${
                                    resnetLayer === layer 
                                      ? "bg-cyan-500 text-slate-950" 
                                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                                  }`}
                                  title={
                                    layer === "Conv5_x" ? "Deep abstract ResNet features (High-level)" :
                                    layer === "Conv4_x" ? "Intermediate texture groupings (Mid-level)" :
                                    "Edge alignments and surface limits (Low-level)"
                                  }
                                >
                                  {layer}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Opacity Blend Range */}
                          <div className="flex items-center justify-between gap-3 bg-slate-950 p-2 rounded border border-slate-800/80">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[9px] text-slate-400 uppercase font-bold">Blend Alpha:</span>
                              <div className="flex items-center gap-1.5 flex-1 max-w-[100px] ml-2 font-bold font-mono">
                                <input
                                  type="range"
                                  min="0.10"
                                  max="0.90"
                                  step="0.05"
                                  value={heatmapAlpha}
                                  onChange={(e) => {
                                    setHeatmapAlpha(+e.target.value);
                                    setTimeout(() => drawExplainableCanvas(), 10);
                                  }}
                                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                />
                                <span className="text-[8.5px] font-bold text-cyan-400 font-mono w-6 text-right">
                                  {Math.round(heatmapAlpha * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Main Dynamic High Tech Render Viewport */}
                      <div className="relative group w-full bg-[#050811] rounded-2xl border border-slate-900 flex flex-col items-center justify-center p-3.5 shadow-inner">
                        <div className="absolute top-2 left-2 bg-slate-950/70 border border-slate-800 text-[8px] font-mono py-0.5 px-2 rounded-full text-slate-400 select-none pointer-events-none uppercase">
                          {customImage ? "PROBED MANUALLY (COORDINATE SYSTEM)" : "AUTOPILOT SURFACE SCAN"}
                        </div>
                        <canvas
                          id="explainable_ai_canvas"
                          width={400}
                          height={330}
                          onClick={handleCanvasClick}
                          className="max-w-full rounded-lg cursor-crosshair border border-slate-900 transition-all duration-300 shadow-2xl group-hover:border-cyan-500/20 bg-slate-950"
                        />

                        {scanInProgress && (
                          <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-2 rounded-2xl">
                            <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase animate-pulse">Running Backprop Saliency...</span>
                            <span className="text-[8px] font-mono text-slate-500">Calculating layer gradient correlations for ResNet {resnetLayer}</span>
                          </div>
                        )}
                      </div>

                      {/* Foot message showing instructions for interactive touch targets */}
                      {customImage && (
                        <div className="mt-2.5 bg-cyan-950/15 border border-cyan-900/30 text-[#22d3ee] p-2 rounded-lg text-center select-none animate-pulse">
                          <p className="text-[8.5px] font-mono font-bold tracking-wide">
                            💡 INTERACTIVE HEATMAP RE-FOCUS ACTIVE: CLICK ANYWHERE ON CANVAS TO RELOCATE THE GRAD-CAM ATTENTION CENTER
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-900 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="text-[9.5px]">XAI Framework Mode:</span>
                      <span className="text-cyan-400 font-bold text-[9.5px]">Grad-CAM Backpropagation Enabled (ResNet50)</span>
                    </div>
                  </div>

                  {/* RIGHT PANEL: AI DECISION ENGINE */}
                  <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl min-h-[520px]">
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

                {/* ==============================================================================
                    🧠 DIGITAL TWIN ROOT CAUSE DIAGNOSIS & JOINT COGNITIVE ENGINEERING DESK
                   ============================================================================== */}
                <div className="bg-[#050814] border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 w-full h-[3px]" />
                  
                  {/* Top-Level Header Information Block */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-cyan-950/40 rounded text-cyan-400 border border-cyan-800/30">
                          <Cpu className="w-4 h-4 animate-spin animate-duration-3000" />
                        </div>
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-white font-mono">
                          AI Cognitive Root Cause Diagnostic & Decision-Support Desk
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-2xl font-sans leading-relaxed">
                        Automatic micro-structure analysis evaluating mechanical, thermal, & metallurgical failure modes. Integrates live physical parameters from the billet casting lines.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <div className="text-right hidden sm:block">
                        <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider font-bold">Dynamic Classification</span>
                        <span className="text-[10px] font-mono text-slate-300 font-bold">ASTM-A36 Material Spec</span>
                      </div>
                      <div className={`px-3.5 py-1.5 rounded-xl border font-bold font-mono text-[9.5px] uppercase tracking-wider shadow-sm flex items-center gap-2 ${calculatedSeverityClass.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedClass.name === "None (OK)" ? "bg-emerald-400" : "bg-red-400 animate-ping"}`} />
                        {calculatedSeverityClass.label}
                      </div>
                    </div>
                  </div>

                  {/* Core Diagnostic Desk Grid Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT PANEL: AUTOMATED OPERATOR COMMANDS & STRIP GAUGERS */}
                    <div className="lg:col-span-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-extrabold">Autonomous Recommendations</h4>
                        </div>
                        
                        <div className="relative rounded-lg p-3 bg-slate-900/[0.3] border border-slate-800/45 font-mono text-[10.5px] text-slate-300 leading-relaxed overflow-hidden">
                          <div className="absolute top-0 right-0 p-1 font-bold text-[8px] tracking-wider text-cyan-400/60 uppercase">
                            AI SYNTHESIS
                          </div>
                          
                          <div className="whitespace-pre-line text-slate-305 text-left border-l-2 border-cyan-500/40 pl-2.5">
                            {automaticOperatorRecommendation}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/20 border border-slate-900 p-3 rounded-lg flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 uppercase">Process Interlock State:</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded uppercase font-mono">ACTIVE MONITORING</span>
                      </div>
                    </div>

                    {/* CENTER PANEL: PHYSICS-BALANCED CAUSES & KNOWLEDGE SYSTEM */}
                    <div className="lg:col-span-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4.5 space-y-5">
                      {/* Causes Probability Header */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                          <Sliders className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-extrabold">Predicted Industrial Root Causes</h4>
                        </div>

                        <div className="space-y-3">
                          {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? (
                            <div className="space-y-2 font-mono text-[10.5px]">
                              <div className="space-y-1">
                                <div className="flex justify-between text-slate-400">
                                  <span>Chemical Consistencies Bounds</span>
                                  <span className="text-emerald-400 font-bold">100.0% Nominal</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[100%]" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-slate-400">
                                  <span>Casting Friction Factor</span>
                                  <span className="text-emerald-400 font-bold">99.4% Stable</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[99.4%]" />
                                </div>
                              </div>
                              <p className="text-[9px] text-slate-500 leading-normal mt-2 italic">
                                Slices through casting parameters reveal no current structural thermal fatigue, surface slips, or pickling acid drifts.
                              </p>
                            </div>
                          ) : (
                            ((DEFECT_DIAGNOSTICS[selectedClass.id] || DEFECT_DIAGNOSTICS["scratches"]).causes.map((cause, index) => (
                              <div key={index} className="space-y-1 font-mono text-[10.5px]">
                                <div className="flex justify-between text-slate-305 gap-2">
                                  <span className="truncate max-w-[210px] text-slate-300" title={cause.factor}>{cause.factor}</span>
                                  <span className="text-cyan-400 font-bold shrink-0">{cause.probability}% Prob</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                                  <div 
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${cause.probability}%` }}
                                  />
                                </div>
                              </div>
                            )))
                          )}
                        </div>
                      </div>

                      {/* Metallurgy Knowledge Engine explanation card */}
                      <div className="pt-3 border-t border-slate-900/60 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                          <h5 className="text-[9.5px] uppercase font-mono tracking-wider text-slate-300 font-bold">
                            Metallurgical Fracture Physics
                          </h5>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans text-justify">
                          {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? (
                            "Continuous mechanical-physical reduction sequences occur uniform across the complete coil width. High homogeneity of the carbon grain bounds guarantees structural integrity under high fatigue criteria."
                          ) : (
                            (DEFECT_DIAGNOSTICS[selectedClass.id] || DEFECT_DIAGNOSTICS["scratches"]).scienceExplanation
                          )}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT PANEL: CORRECTIVE ACTIONS TASK BOARD & PREDICTIVE CHECKS */}
                    <div className="lg:col-span-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4.5 space-y-4 flex flex-col justify-between">
                      
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-cyan-400" />
                            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-extrabold font-mono">Smart Corrective Interventions</h4>
                          </div>
                          
                          {selectedClass.name !== "None (OK)" && !selectedClass.name.includes("None") && (
                            <button
                              onClick={() => {
                                const currentDefId = selectedClass.id;
                                const diagnostics = DEFECT_DIAGNOSTICS[currentDefId];
                                if (diagnostics) {
                                  const updated: Record<string, boolean> = { ...checkedInterventions };
                                  const logMessages: string[] = [];
                                  const timeNow = new Date().toISOString().substring(11, 19);
                                  
                                  diagnostics.correctiveActions.forEach((action, i) => {
                                    const key = `${currentDefId}_${i}`;
                                    if (!updated[key]) {
                                      updated[key] = true;
                                      logMessages.push(`[${timeNow}] CRITICAL DISPATCH: Transmitted PLC command: '${action}' for ${selectedClass.name} control. Status 200 OK.`);
                                    }
                                  });
                                  
                                  setCheckedInterventions(updated);
                                  if (logMessages.length > 0) {
                                    setConsoleLogs(prev => [...logMessages, ...prev]);
                                  }
                                }
                              }}
                              className="text-[8px] font-mono text-cyan-405 hover:text-cyan-300 border border-cyan-800 bg-cyan-950/20 px-2 py-0.5 rounded cursor-pointer transition uppercase"
                              title="Engage all preventative actions and push commands directly to PLC hot manifolds."
                            >
                              DISPATCH ALL
                            </button>
                          )}
                        </div>

                        {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? (
                          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2 border border-dashed border-slate-900 rounded-xl">
                            <div className="p-2 bg-slate-900 rounded-full">
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-[10.5px] font-mono">No active interlocks needed.</span>
                            <span className="text-[8.5px] leading-normal font-sans">Mechanical parameters are healthy. Standard loopers operating under closed-loop telemetry.</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {((DEFECT_DIAGNOSTICS[selectedClass.id] || DEFECT_DIAGNOSTICS["scratches"]).correctiveActions.map((action, i) => {
                              const key = `${selectedClass.id}_${i}`;
                              const isChecked = !!checkedInterventions[key];
                              return (
                                <div 
                                  key={i} 
                                  onClick={() => {
                                    const nextState = !isChecked;
                                    setCheckedInterventions(prev => ({
                                      ...prev,
                                      [key]: nextState
                                    }));
                                    const msgTime = new Date().toISOString().substring(11, 19);
                                    setConsoleLogs(prev => [
                                      `[${msgTime}] COMMAND: Corrective action '${action}' set to ${nextState ? "DISPATCHED" : "RESCINDED"} by operator OP-44.`,
                                      ...prev
                                    ]);
                                  }}
                                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-[10px] font-mono cursor-pointer transition-all duration-150 text-left ${
                                    isChecked 
                                      ? "bg-cyan-950/30 border-cyan-500/30 text-slate-100" 
                                      : "bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 hover:border-slate-800"
                                  }`}
                                >
                                  <div className="shrink-0 mt-0.5">
                                    {isChecked ? (
                                      <div className="w-3 h-3 rounded bg-cyan-400 text-slate-900 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 stroke-[4.5px]" />
                                      </div>
                                    ) : (
                                      <div className="w-3 h-3 rounded border border-slate-700 bg-slate-950" />
                                    )}
                                  </div>
                                  <span className="leading-tight text-[10px]">{action}</span>
                                </div>
                              );
                            }))}
                          </div>
                        )}
                      </div>

                      {/* Predictive Maintenance list inside current defect framework */}
                      <div className="pt-3 border-t border-slate-900/60 space-y-2">
                        <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-mono tracking-wider text-slate-300 font-bold">
                          <Settings className="w-3 h-3 text-cyan-400 font-mono" />
                          <span>Predictive Maintenance Targets</span>
                        </div>
                        
                        <div className="space-y-1.5 font-mono text-[9px] text-slate-500 text-left">
                          {selectedClass.name === "None (OK)" || selectedClass.name.includes("None") ? (
                            <div className="flex justify-between items-center bg-slate-900/30 px-2 py-1 rounded border border-slate-900 w-full text-[9px]">
                              <span>Next Scheduled Inspection Check:</span>
                              <span className="text-cyan-400 font-bold font-mono">48 Operating Hrs</span>
                            </div>
                          ) : (
                            ((DEFECT_DIAGNOSTICS[selectedClass.id] || DEFECT_DIAGNOSTICS["scratches"]).recommendations.map((rec, i) => (
                              <div key={i} className="flex gap-2 items-start text-left bg-slate-900/35 p-1.5 rounded border border-slate-900 text-slate-400 leading-tight w-full text-[9px]">
                                <span className="text-cyan-500 font-bold shrink-0 font-mono">·</span>
                                <span>{rec}</span>
                              </div>
                            )))
                          )}
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

             {/* 2. AI ANALYTICS (PREDICTIVE INDUSTRIAL ANALYTICS & MAINTENANCE ENGINE) */}
             {activeTab === "analytics" && (
               <motion.div
                 key="analytics"
                 initial={{ opacity: 0, y: 12 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -12 }}
                 transition={{ duration: 0.2 }}
                 className="space-y-6"
               >
                 {/* TOP ALERTS PANEL & DIAGNOSTIC SLIDERS CONTROL */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   
                   {/* STATUS ENGINE BAR (7 Columns) */}
                   <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                     <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                       <div>
                         <div className="flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                           <h3 className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                             AI PREDICTIVE MAINTENANCE TELEMETRY
                           </h3>
                         </div>
                         <h4 className="text-sm font-bold text-slate-100 mt-1">Real-time Roller Line Risk Analyst</h4>
                       </div>

                       <div className="flex items-center gap-2">
                         {machineAlertStatus === "GREEN" && (
                           <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-mono text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 animate-[pulse_2s_infinite]">
                             <span className="w-2 h-2 rounded-full bg-emerald-400" />
                             OPERATION STATUS: GREEN (NORMAL)
                           </span>
                         )}
                         {machineAlertStatus === "YELLOW" && (
                           <span className="bg-amber-950/40 text-amber-400 border border-amber-900/60 font-mono text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                             <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                             OPERATION STATUS: YELLOW (WARNING)
                           </span>
                         )}
                         {machineAlertStatus === "RED" && (
                           <span className="bg-red-950/50 text-red-400 border border-red-900/60 font-mono text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                             <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute" />
                             <span className="w-2 h-2 rounded-full bg-red-500 relative" />
                             OPERATION STATUS: RED (MAINTENANCE REQUIRED)
                           </span>
                         )}
                       </div>
                     </div>

                     {/* BIG STATISTIC GRID */}
                     <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-900/60 text-center">
                       
                       {/* STAT 1: HEALTH SCORE */}
                       <div className="space-y-1.5 relative">
                         <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Machine Health</span>
                         <div className="flex items-center justify-center gap-2">
                           <Gauge className={`w-4 h-4 ${machineHealthScore > 80 ? "text-emerald-400" : machineHealthScore > 60 ? "text-amber-400" : "text-red-400"}`} />
                           <span className="text-2xl font-mono font-bold text-white">
                             {machineHealthScore}%
                           </span>
                         </div>
                         <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                           <div 
                             className={`h-full rounded-full transition-all duration-300 ${
                               machineHealthScore > 80 ? "bg-emerald-500" : machineHealthScore > 60 ? "bg-amber-500" : "bg-red-500"
                             }`}
                             style={{ width: `${machineHealthScore}%` }}
                           />
                         </div>
                       </div>

                       {/* STAT 2: FAILURE PROBABILITY */}
                       <div className="space-y-1.5 relative border-x border-slate-900 px-3">
                         <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Failure Probability</span>
                         <div className="flex items-center justify-center gap-2">
                           <AlertTriangle className={`w-4 h-4 ${failureProbability > 40 ? (failureProbability > 70 ? "text-red-400" : "text-amber-400") : "text-emerald-400"}`} />
                           <span className={`text-2xl font-mono font-bold ${failureProbability > 40 ? (failureProbability > 70 ? "text-red-400" : "text-amber-400") : "text-emerald-400"}`}>
                             {failureProbability}%
                           </span>
                         </div>
                         <span className="text-[8px] font-mono text-slate-500 block uppercase">Expected in 12h horizon</span>
                       </div>

                       {/* STAT 3: DEFECT REND TREND GROWTH */}
                       <div className="space-y-1.5">
                         <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Defect Rate Growth</span>
                         <div className="flex items-center justify-center gap-1.5">
                           <TrendingUp className={`w-4 h-4 ${defectTrendGrowth > 0 ? "text-red-400 rotate-180" : "text-emerald-400"}`} />
                           <span className={`text-2xl font-mono font-bold ${defectTrendGrowth > 0 ? "text-red-400" : "text-emerald-400"}`}>
                             {defectTrendGrowth > 0 ? `+${defectTrendGrowth}` : `${defectTrendGrowth}`}%
                           </span>
                         </div>
                         <span className="text-[8px] font-mono text-slate-500 block uppercase">MA vs Historic sequence</span>
                       </div>

                     </div>

                     {/* SIMULATIVE MAINTENANCE RECOMMENDATION DESK */}
                     <div className="p-3.5 bg-slate-900/60 border border-slate-900/80 rounded-xl">
                       <span className="text-[9px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                         <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                         <span>AI Predictive Prognostic Insight:</span>
                       </span>
                       <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                         {machineAlertStatus === "GREEN" ? (
                           <span>Continuous casting and roller tension parameters are aligned. Mechanical structures are operating under <strong>safe equilibrium parameters</strong>. Next scheduled inspection log in 124 operating hours.</span>
                         ) : machineAlertStatus === "YELLOW" ? (
                           <span className="text-amber-300">
                             ⚠️ <strong>Medium Fatigue Profile!</strong> Micro-vibrations and thermal gradients exceed optimal margins. Reduce speed by 15% or click <strong>Dampen Line Strain</strong> to preserve structural roller bearings.
                           </span>
                         ) : (
                           <span className="text-red-400 font-bold animate-[pulse_2s_infinite]">
                             🚨 CRITICAL ALARM STATUS! Thermal overload paired with structural stress is highly correlated with imminent roller scratch surges (+{failureProbability}% error margin). Initiate emergency cooling descaling system flush immediately.
                           </span>
                         )}
                       </p>
                     </div>

                     {/* ACTIVE ACTION TRIGGERS */}
                     <div className="flex flex-wrap gap-2 pt-1">
                       <button
                         onClick={() => {
                           setLineStrain(25);
                           setPdmRollingSpeed(9.2);
                           setConsoleLogs(prev => [
                             `[${new Date().toISOString().substring(11,19)}] AI-HMI: Dynamic Roller Strain damping initiated. Speed reduced to 9.2 m/s.`,
                             ...prev
                           ]);
                         }}
                         className="flex-1 bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-800/40 text-cyan-400 px-3 py-2 rounded-lg font-mono text-[10px] uppercase font-bold transition flex items-center justify-center gap-1.5"
                         title="Safely relax physical roller tensions to normal levels"
                       >
                         <Sliders className="w-3.5 h-3.5" />
                         <span>Dampen Line Strain</span>
                       </button>

                       <button
                         onClick={() => {
                           setMotorTemp(48);
                           setCoolingForce(105);
                           setConsoleLogs(prev => [
                             `[${new Date().toISOString().substring(11,19)}] AI-HMI: Descaling valve high-pressure flush successfully deployed. Motor core temp lowered.`,
                             ...prev
                           ]);
                         }}
                         className="flex-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/40 text-emerald-400 px-3 py-2 rounded-lg font-mono text-[10px] uppercase font-bold transition flex items-center justify-center gap-1.5"
                         title="Deploy hyper-baric scale flushing water"
                       >
                         <RefreshCw className="w-3.5 h-3.5" />
                         <span>Flush Cooling Jet</span>
                       </button>

                       <button
                         onClick={() => {
                           setLineStrain(42);
                           setMotorTemp(72);
                           setCoolingForce(85);
                           setPdmRollingSpeed(12.4);
                         }}
                         className="bg-slate-900 hover:bg-slate-800 text-slate-400 px-3 py-2 rounded-lg font-mono text-[10px] uppercase font-bold transition border border-slate-800 flex items-center justify-center"
                         title="Reset parameters to factory standard specifications"
                       >
                         <span>Factory Standard</span>
                       </button>
                     </div>

                   </div>

                   {/* CONTROLS SLIDERS PLATFORM (5 Columns) */}
                   <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                     <div>
                       <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold border-b border-slate-900 pb-2 mb-3.5">
                         STRESS MULTIPLIER (SIMULATION ENGINE)
                       </h3>
                       <p className="text-[11px] text-slate-400 font-sans mb-4">
                         Adjust live operational factors to test how the AI model predicts thermal fatigue, roller line failures, and future defect counts.
                       </p>

                       <div className="space-y-4 font-mono text-xs">
                         
                         {/* SLIDER A: LINE STRAIN */}
                         <div className="space-y-1">
                           <div className="flex justify-between">
                             <span className="text-slate-400 flex items-center gap-1">
                               <span>🎚️ Line Strain Coeff.</span>
                             </span>
                             <strong className={`${lineStrain > 60 ? "text-amber-400" : "text-cyan-400"}`}>
                               {lineStrain}%
                             </strong>
                           </div>
                           <input
                             type="range"
                             min="15"
                             max="100"
                             step="1"
                             value={lineStrain}
                             onChange={(e) => setLineStrain(parseInt(e.target.value))}
                             className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                           />
                           <div className="flex justify-between text-[8px] text-slate-600">
                             <span>Optimal (20%)</span>
                             <span>Fatigue Threshold (60%)</span>
                           </div>
                         </div>

                         {/* SLIDER B: MOTOR TEMP */}
                         <div className="space-y-1">
                           <div className="flex justify-between">
                             <span className="text-slate-400">🌡️ Motor Core Temperature</span>
                             <strong className={`${motorTemp > 80 ? "text-red-400" : motorTemp > 65 ? "text-amber-400" : "text-cyan-400"}`}>
                               {motorTemp}°C
                             </strong>
                           </div>
                           <input
                             type="range"
                             min="35"
                             max="115"
                             step="1"
                             value={motorTemp}
                             onChange={(e) => setMotorTemp(parseInt(e.target.value))}
                             className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                           />
                           <div className="flex justify-between text-[8px] text-slate-600">
                             <span>Low (35°C)</span>
                             <span>Redline limit (90°C)</span>
                           </div>
                         </div>

                         {/* SLIDER C: COOLING PSI */}
                         <div className="space-y-1">
                           <div className="flex justify-between">
                             <span className="text-slate-400">💧 Cooling Spray Pressure</span>
                             <strong className={`${coolingForce < 70 ? "text-red-500" : "text-emerald-400"}`}>
                               {coolingForce} PSI
                             </strong>
                           </div>
                           <input
                             type="range"
                             min="30"
                             max="130"
                             step="1"
                             value={coolingForce}
                             onChange={(e) => setCoolingForce(parseInt(e.target.value))}
                             className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                           />
                           <div className="flex justify-between text-[8px] text-slate-600">
                             <span>Nozzle Clog (45 PSI)</span>
                             <span>High Yield (110 PSI)</span>
                           </div>
                         </div>

                         {/* SLIDER D: ROLLING SPEED */}
                         <div className="space-y-1">
                           <div className="flex justify-between">
                             <span className="text-slate-400">⚡ Roll Sequence Load Speed</span>
                             <strong className={`${pdmRollingSpeed > 15 ? "text-red-500" : "text-cyan-400"}`}>
                               {pdmRollingSpeed} m/s
                             </strong>
                           </div>
                           <input
                             type="range"
                             min="3"
                             max="23"
                             step="0.5"
                             value={pdmRollingSpeed}
                             onChange={(e) => setPdmRollingSpeed(parseFloat(e.target.value))}
                             className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                           />
                           <div className="flex justify-between text-[8px] text-slate-600">
                             <span>Idling (3 m/s)</span>
                             <span>Severe Vibration (15 m/s)</span>
                           </div>
                         </div>

                       </div>
                     </div>

                     <div className="bg-slate-900/30 p-2.5 rounded border border-slate-900 text-[10px] text-slate-500 font-mono text-center">
                       🧠 Failure Neural Model update frequency: <strong>100ms</strong>
                     </div>

                   </div>
                 </div>

                 {/* DEFECT TREND FORECAST CURVE (PAST 7 DAYS + NEXT 3 DAYS PREDICTION) */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                   {/* CHART PLOT (8 Columns) */}
                   <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="text-sm font-bold text-white">7-Day Defect History & Predictive Peak Forecast</h3>
                         <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                           Time-series prediction utilizing past data sequences combined with real-time strain coefficients.
                         </p>
                       </div>
                       <span className="text-[8px] uppercase font-mono text-cyan-400 bg-cyan-950/20 px-2.5 py-1 rounded border border-cyan-800/30 animate-pulse">
                         ARMA+Neural Forecast Active
                       </span>
                     </div>

                     {/* SVG GRAPH IMPLEMENTATION */}
                     {(() => {
                       const pDays = [
                         { name: "Mon", count: 52, isForecast: false },
                         { name: "Tue", count: 61, isForecast: false },
                         { name: "Wed", count: 55, isForecast: false },
                         { name: "Thu", count: 59, isForecast: false },
                         { name: "Fri", count: 71, isForecast: false },
                         { name: "Sat", count: 51, isForecast: false },
                         { name: "Sun", count: 35, isForecast: false },
                         { name: "Mon+", count: Math.round(38 * forecastMultiplier), isForecast: true },
                         { name: "Tue+", count: Math.round(58 * forecastMultiplier), isForecast: true },
                         { name: "Wed+", count: Math.round(44 * forecastMultiplier), isForecast: true },
                       ];

                       const maxLimit = 150;
                       const graphW = 600;
                       const graphH = 180;
                       const padL = 40;
                       const padR = 20;
                       const padT = 15;
                       const padB = 25;
                       
                       const plotW = graphW - padL - padR;
                       const plotH = graphH - padT - padB;

                       const points = pDays.map((d, i) => {
                         const x = padL + (i / (pDays.length - 1)) * plotW;
                         const y = padT + plotH - (d.count / maxLimit) * plotH;
                         return { x, y, ...d };
                       });

                       const histPoints = points.filter(p => !p.isForecast);
                       const forecastPoints = points.filter(p => p.isForecast || p.name === "Sun");

                       let histPath = "";
                       if (histPoints.length > 0) {
                         histPath = `M ${histPoints[0].x},${histPoints[0].y} ` + 
                           histPoints.slice(1).map(p => `L ${p.x},${p.y}`).join(" ");
                       }

                       let forePath = "";
                       if (forecastPoints.length > 0) {
                         forePath = `M ${forecastPoints[0].x},${forecastPoints[0].y} ` + 
                           forecastPoints.slice(1).map(p => `L ${p.x},${p.y}`).join(" ");
                       }

                       return (
                         <div className="w-full bg-[#050811] rounded-xl border border-slate-900 p-4">
                           <div className="relative aspect-[21/8]">
                             <svg className="w-full h-full" viewBox={`0 0 ${graphW} ${graphH}`}>
                               <defs>
                                 <linearGradient id="glow-hist" x1="0%" y1="0%" x2="100%" y2="100%">
                                   <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                                   <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                                 </linearGradient>
                                 <linearGradient id="glow-fore" x1="0%" y1="0%" x2="100%" y2="0%">
                                   <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                                   <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                                 </linearGradient>
                                 <linearGradient id="area-hist" x1="0%" y1="0%" x2="0%" y2="100%">
                                   <stop offset="0%" stopColor="#0891b2" stopOpacity="0.18" />
                                   <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
                                 </linearGradient>
                                 <linearGradient id="area-fore" x1="0%" y1="0%" x2="0%" y2="100%">
                                   <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                                   <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
                                 </linearGradient>
                               </defs>

                               {/* Grid lines */}
                               {[0, 30, 60, 90, 120, 150].map((val) => {
                                 const y = padT + plotH - (val / maxLimit) * plotH;
                                 return (
                                   <g key={val} className="opacity-40">
                                     <line x1={padL} y1={y} x2={graphW - padR} y2={y} stroke="#111827" strokeWidth="1" />
                                     <text x={10} y={y + 3} fill="#4b5563" fontSize="8" fontFamily="monospace">
                                       {val}
                                     </text>
                                   </g>
                                 );
                               })}

                               {/* Split Line forecasting barrier divider */}
                               {(() => {
                                 const dividerX = padL + (6 / (pDays.length - 1)) * plotW;
                                 return (
                                   <g>
                                     <line x1={dividerX} y1={padT} x2={dividerX} y2={padT + plotH} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.7" />
                                     <rect x={dividerX - 55} y={padT + 4} width="110" height="15" rx="3" fill="#1e1b4b" stroke="#ef4444" strokeWidth="0.5" opacity="0.8" />
                                     <text x={dividerX} y={padT + 14} fill="#f87171" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                                       AI FORECAST HORIZON
                                     </text>
                                   </g>
                                 );
                               })()}

                               {/* Filled Area below curves */}
                               {histPoints.length > 0 && (
                                 <path
                                   d={`M ${histPoints[0].x},${padT + plotH} ` + 
                                      histPoints.map(p => `L ${p.x},${p.y}`).join(" ") + 
                                      ` L ${histPoints[histPoints.length - 1].x},${padT + plotH} Z`}
                                   fill="url(#area-hist)"
                                 />
                               )}

                               {forecastPoints.length > 0 && (
                                 <path
                                   d={`M ${forecastPoints[0].x},${padT + plotH} ` + 
                                      forecastPoints.map(p => `L ${p.x},${p.y}`).join(" ") + 
                                      ` L ${forecastPoints[forecastPoints.length - 1].x},${padT + plotH} Z`}
                                   fill="url(#area-fore)"
                                 />
                               )}

                               {/* Historical Line */}
                               <path
                                 d={histPath}
                                 fill="none"
                                 stroke="url(#glow-hist)"
                                 strokeWidth="2.5"
                                 strokeLinecap="round"
                               />

                               {/* Forecast Line */}
                               <path
                                 d={forePath}
                                 fill="none"
                                 stroke="url(#glow-fore)"
                                 strokeWidth="3.5"
                                 strokeDasharray="4,3"
                                 strokeLinecap="round"
                               />

                               {/* Dot nodes for past */}
                               {histPoints.map((p, i) => (
                                 <g key={i} className="group cursor-help">
                                   <circle cx={p.x} cy={p.y} r="4" fill="#030712" stroke="#22d3ee" strokeWidth="2" />
                                   <circle cx={p.x} cy={p.y} r="1.5" fill="#ffffff" />
                                   <text x={p.x} y={p.y - 8} fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded">
                                     {p.count}
                                   </text>
                                 </g>
                               ))}

                               {/* Dot nodes for forecast */}
                               {forecastPoints.slice(1).map((p, i) => (
                                 <g key={i} className="group cursor-help">
                                   <circle cx={p.x} cy={p.y} r="5" fill="#030712" stroke="#f59e0b" strokeWidth="2.5" />
                                   <circle cx={p.x} cy={p.y} r="2" fill="#ef4444" />
                                   <text x={p.x} y={p.y - 9} fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" className="animate-bounce">
                                     {p.count}
                                   </text>
                                 </g>
                               ))}

                               {/* Axis Labels */}
                               {points.map((p, i) => (
                                 <text key={i} x={p.x} y={graphH - 6} fill={p.isForecast ? "#f87171" : "#8b9bb4"} fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="normal">
                                   {p.name}
                                 </text>
                               ))}
                             </svg>
                           </div>

                           {/* Timeline legends */}
                           <div className="flex justify-between items-center text-[9px] font-mono border-t border-slate-900 pt-3 text-slate-500">
                             <div className="flex gap-4">
                               <span className="flex items-center gap-1.5">
                                 <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                                 <span>Past Days Volume</span>
                               </span>
                               <span className="flex items-center gap-1.5">
                                 <span className="w-2.5 h-0.5 bg-red-400 border-dashed border inline-block" />
                                 <span className="text-red-400 font-bold">Rolling Forecast Spike Index (3 Days)</span>
                               </span>
                             </div>

                             <span className="text-[8.5px] text-slate-400">
                               Predicted defects over next 72 hrs: <strong className="text-red-400">{Math.round((38 + 58 + 44) * forecastMultiplier)} total</strong>
                             </span>
                           </div>
                         </div>
                       );
                     })()}

                     <div className="p-3.5 bg-slate-900/30 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
                       Note: Predictive calculations are automatically optimized utilizing gradient backpropagation correlations mapping physical machine stress to product output defect records.
                     </div>

                   </div>

                   {/* SHIFT OPERATION DISPOSITION (4 Columns) */}
                   <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                     <div>
                       <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3.5">
                         <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#22d3ee] font-bold">
                           Shift-wise Defect Volume
                         </h3>
                         <span className="text-[8px] font-mono bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">
                           SEQUENCE COMPARISON
                         </span>
                       </div>

                       <p className="text-[11px] text-slate-400 font-sans mb-4">
                         Analysis of defect occurrence distribution by production shift indexes to pinpoint operational drift anomalies.
                       </p>

                       {/* SVG comparative Shift bars */}
                       <div className="bg-[#050811] rounded-xl border border-slate-900/60 p-4 h-[120px] flex items-end justify-around">
                         
                         {/* Shift A */}
                         <div className="flex flex-col items-center gap-1 group w-12">
                           <span className="text-[9px] font-mono text-slate-400 font-bold">42</span>
                           <div className="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 h-10 rounded-t border border-emerald-900 relative">
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[8px] font-mono text-slate-500 uppercase">A-Morning</span>
                         </div>

                         {/* Shift B */}
                         <div className="flex flex-col items-center gap-1 group w-12">
                           <span className="text-[9px] font-mono text-slate-400 font-bold">78</span>
                           <div className="w-5 bg-gradient-to-t from-amber-500 to-yellow-400 h-[72px] rounded-t border border-amber-900 relative">
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[8px] font-mono text-slate-500 uppercase font-bold text-amber-400">B-Evening</span>
                         </div>

                         {/* Shift C */}
                         <div className="flex flex-col items-center gap-1 group w-12">
                           <span className="text-[9px] font-mono text-slate-400 font-bold">112</span>
                           <div className="w-5 bg-gradient-to-t from-red-600 to-red-400 h-[100px] rounded-t border border-red-900 relative">
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[8px] font-mono text-slate-500 uppercase font-bold text-red-400">C-Night</span>
                         </div>

                       </div>

                       <div className="pt-3.5 space-y-1.5 text-[10px] font-mono">
                         <div className="flex justify-between text-slate-400">
                           <span>Shift A (06:00 - 14:00)</span>
                           <span className="text-emerald-450 text-emerald-400 font-bold">42 def. (Compliant)</span>
                         </div>
                         <div className="flex justify-between text-slate-400">
                           <span>Shift B (14:00 - 22:00)</span>
                           <span className="text-yellow-450 text-yellow-400 font-bold">78 def. (Warning)</span>
                         </div>
                         <div className="flex justify-between text-slate-400">
                           <span>Shift C (22:00 - 06:00)</span>
                           <span className="text-red-400 font-bold">112 def. (Critical stress)</span>
                         </div>
                       </div>

                     </div>

                     <div className="bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-lg text-[9px] text-amber-400 leading-relaxed font-mono">
                       <strong>💡 SHIFT ANALYTICS DISCOVERY:</strong> Thermal logs demonstrate significant descaler spray blockages during Night hours (Shift C) matching fatigue Redline levels. Lubricant cycles have been re-scheduled.
                     </div>

                   </div>

                 </div>

                 {/* PREDICTED ANOMALIES & PREVENTIVE SHIELD ACTIVE MODULE */}
                 <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                   <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                     <div>
                       <h3 className="font-bold text-slate-100 text-sm">Industrial Fault Diagnostics & Auto-Trigger Scheduler</h3>
                       <p className="text-xs text-slate-500 mt-0.5 font-mono">
                         Predictive failure engine monitoring sensor anomalies across downstream rolling mills (Jamshedpur Facility-4)
                       </p>
                     </div>
                     <span className="text-[9px] font-mono text-slate-500 uppercase font-bold bg-slate-900 px-3 py-1 border border-slate-800 rounded">
                       STATION LINE 04 OK
                     </span>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {activeAnomalies.map((anom) => {
                       return (
                         <div
                           key={anom.id}
                           className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                             anom.status === "Resolved" 
                               ? "bg-slate-900/30 border-slate-900/80 grayscale opacity-60" 
                               : anom.severity === "HIGH"
                               ? "bg-[#651c22]/15 border-red-900/60 shadow-[0_0_15px_rgba(239,68,68,0.06)]"
                               : "bg-amber-950/10 border-amber-900/40"
                           }`}
                         >
                           <div>
                             <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold font-mono text-cyan-400">{anom.id}</span>
                               <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                 anom.status === "Resolved"
                                   ? "bg-slate-850 text-slate-400 border border-slate-850"
                                   : anom.severity === "HIGH"
                                   ? "bg-red-950 text-red-405 text-red-400 border border-red-900/40"
                                   : "bg-amber-950 text-amber-500 border border-amber-900/30"
                               }`}>
                                 {anom.status === "Resolved" ? "RESOLVED" : `${anom.severity} RISK (${anom.probability}%)`}
                               </span>
                             </div>

                             <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">{anom.component}</h4>
                             <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">{anom.details}</p>
                           </div>

                           <div className="pt-2 border-t border-slate-900/40 flex justify-between items-center text-[10px] font-mono">
                             <span className="text-slate-500">{anom.time}</span>
                             {anom.status !== "Resolved" ? (
                               <button
                                 onClick={() => {
                                   setActiveAnomalies(prev => prev.map(a => a.id === anom.id ? { ...a, status: "Resolved" } : a));
                                   setConsoleLogs(prev => [
                                     `[${new Date().toISOString().substring(11,19)}] AI-HMI: Maintenance trigger dispatched for ${anom.component}. Status resolved.`,
                                     ...prev
                                   ]);
                                 }}
                                 className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition ${
                                   anom.severity === "HIGH" 
                                     ? "bg-red-900/40 text-red-200 hover:bg-red-850/60" 
                                     : "bg-amber-950 text-amber-400 hover:bg-amber-900"
                                 }`}
                               >
                                 Resolve Anomaly
                               </button>
                             ) : (
                               <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                 ✓ Micro-wear Stabilised
                               </span>
                             )}
                           </div>
                         </div>
                       );
                     })}
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

            {/* 5. DIGITAL TWIN 3D VISUALIZATION */}
            {activeTab === "twin" && (
              <motion.div
                key="twin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <DigitalTwin
                  machineHealthScore={machineHealthScore}
                  failureProbability={failureProbability}
                  defectTrendGrowth={defectTrendGrowth}
                  lineStrain={lineStrain}
                  motorTemp={motorTemp}
                  coolingForce={coolingForce}
                  rollingSpeed={pdmRollingSpeed}
                  selectedClass={selectedClass}
                  setLineStrain={setLineStrain}
                  setMotorTemp={setMotorTemp}
                  setCoolingForce={setCoolingForce}
                  setPdmRollingSpeed={setPdmRollingSpeed}
                  setConsoleLogs={setConsoleLogs}
                />
              </motion.div>
            )}

            {/* 6. INDUSTRIAL ROI EXECUTIVE PORTAL */}
            {activeTab === "control" && (
              <motion.div
                key="control"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <FactoryControlCenter />
              </motion.div>
            )}

            {activeTab === "roi" && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <RoiAnalytics />
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <IndustrialReportGenerator />
              </motion.div>
            )}

            {activeTab === "training" && (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <NeuTrainingHub />
              </motion.div>
            )}

            {activeTab === "inference" && (
              <motion.div
                key="inference"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <LiveInferenceStation />
              </motion.div>
            )}

            {activeTab === "sustainability" && (
              <motion.div
                key="sustainability"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <SustainAnalytics />
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
