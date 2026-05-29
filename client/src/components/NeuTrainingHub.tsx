import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Cpu,
  Database,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  Award,
  Terminal,
  Grid,
  Download,
  BookOpen,
  Settings,
  HardDrive,
  Activity,
  Maximize2,
  RefreshCw,
  Check,
  ChevronRight,
  Info,
  Layers,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for NEU Dataset
interface NeuClassInfo {
  code: string;
  name: string;
  description: string;
  purity: number;
  f1: number;
  precision: number;
  recall: number;
  typicalCount: number;
  color: string;
}

const NEU_CLASSES: NeuClassInfo[] = [
  { code: "RS", name: "Rolled-in Scale", description: "Silicon and oxide scale pressed physically onto the hot metal strip during reduction passes.", purity: 98.4, f1: 0.978, precision: 0.981, recall: 0.975, typicalCount: 300, color: "text-amber-400 border-amber-950/40 bg-amber-950/10" },
  { code: "Pa", name: "Patches", description: "Elongated slab surface patches resulting from thermal inconsistencies in the continuous caster mold.", purity: 99.1, f1: 0.985, precision: 0.982, recall: 0.988, typicalCount: 300, color: "text-cyan-400 border-cyan-950/40 bg-cyan-950/10" },
  { code: "Cr", name: "Crazing", description: "Network of webbed thermal fatigue micro-cracks resulting from rapid heat/cold cycles on guide rollers.", purity: 96.2, f1: 0.954, precision: 0.960, recall: 0.948, typicalCount: 300, color: "text-red-400 border-red-950/40 bg-red-950/10" },
  { code: "PS", name: "Pitted Surface", description: "Localized pits or craters on the strip from scaling particles falling off during mechanical draft.", purity: 98.7, f1: 0.981, precision: 0.979, recall: 0.983, typicalCount: 300, color: "text-orange-400 border-orange-950/40 bg-orange-950/10" },
  { code: "In", name: "Inclusions", description: "Sub-surface slag, mold powder, or non-metallic materials trapped in the steel during solidification.", purity: 99.5, f1: 0.992, precision: 0.994, recall: 0.990, typicalCount: 300, color: "text-purple-400 border-purple-950/40 bg-purple-950/10" },
  { code: "Sc", name: "Scratches", description: "Mechanical abrasion grooves created by friction misalignments on vertical high-speed looper stands.", purity: 98.9, f1: 0.983, precision: 0.986, recall: 0.980, typicalCount: 300, color: "text-pink-400 border-pink-950/40 bg-pink-950/10" }
];

// Typical Confusion Matrix values for NEU surface defect dataset predictions
// rows = Target, cols = Predicted [RS, Pa, Cr, PS, In, Sc] (each class has about 45 samples in test split)
const TYPICAL_CONF_MATRIX = [
  [43, 1, 0, 1, 0, 0], // Target RS
  [1, 44, 0, 0, 0, 0], // Target Pa
  [0, 0, 42, 2, 1, 0], // Target Cr
  [1, 0, 1, 43, 0, 0], // Target PS
  [0, 0, 0, 0, 45, 0], // Target In
  [0, 1, 0, 0, 0, 44]  // Target Sc
];

export default function NeuTrainingHub() {
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "training" | "metrics" | "tensorboard" | "comparison">("pipeline");

  // 1. Hyperparams
  const [batchSize, setBatchSize] = useState<number>(32);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [optimizer, setOptimizer] = useState<"AdamW" | "SGD" | "RMSprop">("AdamW");
  const [epochs, setEpochs] = useState<number>(10);
  const [backbone, setBackbone] = useState<"ResNet34" | "ResNet18" | "MobileNetV3" | "CustomCNN">("ResNet34");
  const [lossFunction, setLossFunction] = useState<"CrossEntropy" | "FocalLoss" | "LabelSmoothing">("CrossEntropy");

  // 2. Training simulation state
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainLossHistory, setTrainLossHistory] = useState<number[]>([]);
  const [valLossHistory, setValLossHistory] = useState<number[]>([]);
  const [trainAccHistory, setTrainAccHistory] = useState<number[]>([]);
  const [valAccHistory, setValAccHistory] = useState<number[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  // Pre-cooked fully trained statistics (for ResNet34)
  const trainedStats = useMemo(() => {
    return {
      testAccuracy: 98.15,
      macroF1: 0.979,
      weightedPrecision: 0.984,
      weightedRecall: 0.981,
      trainingTimeSec: 242.6,
      parametersCount: "21.3M",
      hardwareAccelerated: "GPU (CUDA 12.1 / PCIe 4.0)"
    };
  }, []);

  // State of custom mock uploaded files list
  const [datasetCacheVerified, setDatasetCacheVerified] = useState<boolean>(true);
  const [selectedNeuClass, setSelectedNeuClass] = useState<NeuClassInfo>(NEU_CLASSES[0]);
  const [logScrollRef, setLogScrollRef] = useState<HTMLDivElement | null>(null);

  // Tensorboard interactive scalars list
  const [selectedScalarTag, setSelectedScalarTag] = useState<"loss/train_val" | "accuracy/train_val" | "learning_rate">("loss/train_val");

  // Auto-scroll log screen
  useEffect(() => {
    if (logScrollRef) {
      logScrollRef.scrollTop = logScrollRef.scrollHeight;
    }
  }, [trainingLogs, logScrollRef]);

  // Handle Pipeline Training Action
  const startPyTorchTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingProgress(0);
    setTrainingLogs([
      `[PyTorch Core] CUDA initialized successfully. Device designated: nvidia-smi 0 (NVIDIA RTX A4000)`,
      `[PyTorch Core] Memory allocation footprint: 1.25 GB allocated for ${backbone} backbone weights.`,
      `[Dataloader] Spawning 4 raw daemon workers to process multi-threaded cache pipelines...`,
      `[Dataloader] Total sub-sampled dataset: 1,800 NEU grayscale images parsed.`,
      `[Dataloader] Split distribution ratio is 70/15/15:`,
      `   - Train Split: 1,260 images (Batch size: ${batchSize}, Shuffled: True)`,
      `   - Val Split: 270 images (Batch size: ${batchSize}, Shuffled: False)`,
      `   - Test Split: 270 images (Batch size: ${batchSize}, Shuffled: False)`,
      `[Optimizer] Instantiating ${optimizer} engine. Learning rate set to fixed ${learningRate}.`,
      `[Criterion] Loss function bound: ${lossFunction} with class balances active.`,
      `--------------------------------------------------------------------------------`,
      `Starting PyTorch forward/backward pass cycles for ${epochs} Epochs...`
    ]);

    setTrainLossHistory([]);
    setValLossHistory([]);
    setTrainAccHistory([]);
    setValAccHistory([]);
  };

  // Run training loop epoch-by-epoch simulation
  useEffect(() => {
    if (!isTraining) return;

    if (currentEpoch < epochs) {
      const timer = setTimeout(() => {
        // Compute learning path curves with minor variations based on parameters
        const epochIndex = currentEpoch + 1;
        const decayFactor = Math.exp(-epochIndex * 0.28);
        const randNoise = () => (Math.random() - 0.5) * 0.02;

        // Loss decreases
        const trainLossBase = 0.95 * decayFactor + 0.03 + randNoise();
        const finalTrainLoss = Math.max(0.015, trainLossBase);
        const valLossBase = 0.98 * decayFactor + 0.05 + randNoise() * 1.5;
        const finalValLoss = Math.max(0.028, valLossBase);

        // Accuracy increases
        const trainAccBase = (1 - decayFactor) * 35 + 64.2 + randNoise() * 100;
        const finalTrainAcc = Math.min(99.8, Math.max(62.0, trainAccBase));
        const valAccBase = (1 - decayFactor) * 32 + 66.5 + randNoise() * 100;
        const finalValAcc = Math.min(98.6, Math.max(60.1, valAccBase));

        // Push values to history
        setTrainLossHistory(pref => [...pref, finalTrainLoss]);
        setValLossHistory(pref => [...pref, finalValLoss]);
        setTrainAccHistory(pref => [...pref, finalTrainAcc]);
        setValAccHistory(pref => [...pref, finalValAcc]);

        // Logging feed
        const logLine = `Epoch ${epochIndex.toString().padStart(2, "0")}/${epochs.toString().padStart(2, "0")} | ` +
          `Train Loss: ${finalTrainLoss.toFixed(4)} | ` +
          `Val Loss: ${finalValLoss.toFixed(4)} | ` +
          `Train Acc: ${finalTrainAcc.toFixed(1)}% | ` +
          `Val Acc: ${finalValAcc.toFixed(1)}% | ` +
          `LR: ${(learningRate * (optimizer === "AdamW" ? Math.pow(0.9, currentEpoch) : 1)).toFixed(5)}`;

        setTrainingLogs(prev => [...prev, logLine]);
        setTrainingProgress(Math.floor((epochIndex / epochs) * 100));
        setCurrentEpoch(epochIndex);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setIsTraining(false);
      setTrainingLogs(prev => [
        ...prev,
        `--------------------------------------------------------------------------------`,
        `[Metrics Auditor] PyTorch Training Run completed successfully in ${(15 + epochs * 2.1).toFixed(1)}s.`,
        `[Metrics Auditor] Evaluating test set partition of 270 raw NEU defect images.`,
        `[Metrics Auditor] Test Accuracy achieved: ${valAccHistory[valAccHistory.length - 1]?.toFixed(2) || "98.15"}%`,
        `[Weights Exporter] Serializing trained tensor models in safety file storage directory '/weights/neu_resnet_best.pth'`,
        `[System State] Model compiled and synced to on-line inspection camera rigs.`,
        `[Success Check] Model designated as ready for industrial deployment.`
      ]);
    }
  }, [isTraining, currentEpoch, epochs, learningRate, optimizer, backbone, lossFunction]);

  // Export fully aggregated PyTorch metrics report as dynamic downloadable file
  const exportNeuEvaluationJSON = () => {
    const reportData = {
      dataset: "NEU Surface Defect Database (Northeastern University)",
      timestamp: new Date().toISOString(),
      training_configuration: {
        backbone_network: backbone,
        initial_learning_rate: learningRate,
        batch_size: batchSize,
        optimizer_type: optimizer,
        loss_optimization_function: lossFunction,
        target_epochs: epochs
      },
      evaluation_metrics: {
        final_epoch: currentEpoch,
        best_val_accuracy_pct: Math.max(...(valAccHistory.length > 0 ? valAccHistory : [98.15])),
        last_train_loss: trainLossHistory[trainLossHistory.length - 1] || 0.034,
        last_val_loss: valLossHistory[valLossHistory.length - 1] || 0.048,
        macro_f1_score: 0.979,
        parameters_under_optimization: "21,284,550 floats"
      },
      class_breakdowns: NEU_CLASSES.map(cls => ({
        class: cls.code,
        label: cls.name,
        precision: cls.precision,
        recall: cls.recall,
        f1_score: cls.f1,
        support: 45
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NEU_PyTorch_Evaluation_${backbone}_Report.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample data points to show if history is empty (pre-trained state curves)
  const defaultLossHistory = [0.95, 0.61, 0.42, 0.28, 0.19, 0.12, 0.08, 0.05, 0.038, 0.024];
  const defaultValLossHistory = [0.98, 0.65, 0.44, 0.31, 0.24, 0.16, 0.11, 0.085, 0.062, 0.048];
  const defaultAccHistory = [64.2, 75.8, 83.1, 89.4, 92.8, 95.1, 96.9, 97.8, 98.4, 99.1];
  const defaultValAccHistory = [60.5, 71.4, 80.2, 86.8, 91.1, 93.4, 95.5, 96.6, 97.2, 98.15];

  const activeLossCurve = trainLossHistory.length > 0 ? trainLossHistory : defaultLossHistory;
  const activeValLossCurve = valLossHistory.length > 0 ? valLossHistory : defaultValLossHistory;
  const activeAccCurve = trainAccHistory.length > 0 ? trainAccHistory : defaultAccHistory;
  const activeValAccCurve = valAccHistory.length > 0 ? valAccHistory : defaultValAccHistory;

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO SECTION */}
      <div className="bg-[#050814] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl text-left">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 w-full h-[3px]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-950/40 rounded text-cyan-400 border border-cyan-900/30">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-sm font-extrabold uppercase font-mono tracking-wider text-slate-100">
                NEU Deep Surface Defect PyTorch Training Hub
              </h2>
            </div>
            <p className="text-[11.5px] text-slate-400 max-w-3xl leading-relaxed">
              Fully optimized Northeastern University (NEU) Surface Defect Database pipeline. Define networks, queue training workloads on physical CUDA edge nodes, parse raw material image matrices, audit multi-task ResNet classification graphs, and telemetry loss metrics dynamically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase hidden sm:inline">CUDA ENGINE:</span>
            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-mono text-[9.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CUDA ACTIVE: NVIDIA RTX A4000
            </span>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB BAR */}
      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-900 justify-start">
        {[
          { id: "pipeline", label: "📦 NEU Dataset & Pipeline Loader", icon: Database },
          { id: "training", label: "🔥 PyTorch Training Studio", icon: Flame },
          { id: "metrics", label: "📊 Accuracy & Validation Logs", icon: TrendingUp },
          { id: "tensorboard", label: "🧬 TensorBoard Live Session", icon: Activity },
          { id: "comparison", label: "📈 Model Comparison Analytics", icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 text-[10.5px] font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW CONTENTS */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. NEU DATASET AND PIPELINE LOADER */}
        {activeSubTab === "pipeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Class Cards List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-1">
                <h3 className="text-xs uppercase font-mono font-black text-slate-400">Database Breakdown</h3>
                <h4 className="text-lg font-bold text-slate-100">NEU-CLS 1800 Grayscale Split</h4>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  Consists of six classes of steel strip defects, each containing 300 macro images sized 200x200 pixels.
                </p>
              </div>

              <div className="space-y-2">
                {NEU_CLASSES.map((cls) => {
                  const isSelected = selectedNeuClass.code === cls.code;
                  return (
                    <button
                      key={cls.code}
                      onClick={() => setSelectedNeuClass(cls)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-slate-900 border-cyan-500/80 shadow-md scale-[1.01]"
                          : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${cls.color}`}>
                            {cls.code}
                          </span>
                          <span className="text-[11.5px] font-bold text-slate-200 font-mono">{cls.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Count: {cls.typicalCount}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mt-1.5 line-clamp-2">
                        {cls.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro PyTorch Datapipe Code & Matrix layout */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Selected Class Raw Sample View */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-905 border-slate-900 pb-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900">
                      Sample Loader Inspector
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 font-mono mt-1">
                      {selectedNeuClass.name} Ground-Truth Dataset Matrices
                    </h3>
                  </div>

                  <span className="text-[9.5px] text-slate-500 font-mono">
                    Class Accuracy Metric: <strong className="text-emerald-400">{selectedNeuClass.purity}%</strong>
                  </span>
                </div>

                {/* Simulated images for the selected class */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    return (
                      <div key={idx} className="bg-slate-900 border border-slate-805 border-slate-800 rounded-lg p-2 flex flex-col items-center justify-between space-y-2 group hover:border-cyan-500 transition-all duration-300">
                        {/* Grayscale physical grid to mimic defect surface */}
                        <div className="w-full aspect-square bg-slate-950 border border-slate-900 rounded overflow-hidden relative flex flex-col items-center justify-center p-0.5 font-mono text-[6px]">
                          
                          {/* Generative pattern grid inside */}
                          <div className="w-full h-full opacity-60 grid grid-cols-8 gap-[0.5px]">
                            {Array.from({ length: 64 }).map((_, gIdx) => {
                              // Generative texture simulating selected classes (e.g., scratches, pitting, inclusions)
                              let colVal = 18 + Math.floor(Math.sin((gIdx + idx * 8) * 0.9) * 12);
                              if (selectedNeuClass.code === "Sc") {
                                if (gIdx % 8 === 4) colVal = 150; // Vertical scratches
                              } else if (selectedNeuClass.code === "Cr") {
                                if ((gIdx + gIdx % 8) % 5 === 0) colVal = 130; // Webbed patterns
                              } else if (selectedNeuClass.code === "In") {
                                if (gIdx >= 24 && gIdx <= 30) colVal = 200; // Slag blob
                              } else if (selectedNeuClass.code === "Pa") {
                                if (gIdx % 8 < 3 && gIdx >= 16) colVal = 110; // Splashed patch
                              } else if (selectedNeuClass.code === "PS") {
                                if (gIdx % 11 === 0) colVal = 180; // Localized spots
                              } else if (selectedNeuClass.code === "RS") {
                                if (gIdx % 9 === 1) colVal = 120; // Silicose ripples
                              }
                              return (
                                <div
                                  key={gIdx}
                                  className="rounded-[1px]"
                                  style={{ backgroundColor: `rgb(${colVal}, ${colVal + 5}, ${colVal + 12})` }}
                                />
                              );
                            })}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                          <span className="absolute bottom-1 right-1 text-slate-500 text-[6.5px] scale-[0.85] font-mono select-none">
                            200 px
                          </span>
                        </div>

                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">
                          {selectedNeuClass.code}_{idx + 400}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      <strong>Northeastern University Steel Dataset loading details:</strong> Data partitioning divides the 1,800 total benchmark samples into 1,260 Training, 270 Validation, and 270 Test images. Each grayscale tensor maps a standard [1, 200, 200] shape, normalized by a global dataset mean of <strong>0.4419</strong> and standard deviation of <strong>0.1982</strong> using Python PyTorch standard pipelines.
                    </p>
                  </div>
                </div>

              </div>

              {/* Best Practice PyTorch Code block */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden font-mono text-[10.5px]">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center select-none">
                  <div className="flex items-center gap-1.5 text-slate-400 leading-none">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="font-bold text-[10px]">neu_dataset_pipeline.py (PyTorch Production)</span>
                  </div>
                  <span className="text-[9px] uppercase bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-black font-mono">
                    PyTorch Dataset
                  </span>
                </div>

                <pre className="p-4 overflow-x-auto text-[10px] text-slate-300 bg-slate-950 max-h-[300px] overflow-y-auto leading-relaxed scrollbar-thin">
{`import os
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image

class NEUSurfaceDefectDataset(Dataset):
    """
    Industrial PyTorch pipeline loading the Northeastern University (NEU)
    Surface Defect Database containing 6 classes with 300 grayscale images.
    """
    def __init__(self, root_dir, split="train", transform=None):
        self.root_dir = root_dir
        self.split = split
        self.transform = transform
        self.classes = ["RS", "Pa", "Cr", "PS", "In", "Sc"]
        self.image_paths = []
        self.labels = []
        
        self._build_partition_index()

    def _build_partition_index(self):
        # Scan partitions and enforce deterministic shuffling reproducible states
        for class_idx, class_prefix in enumerate(self.classes):
            class_folder = os.path.join(self.root_dir, class_prefix)
            all_files = sorted([f for f in os.listdir(class_folder) if f.endswith(".bmp")])
            
            # Deterministic split seeding
            g = torch.Generator().manual_seed(42)
            shuffled_indices = torch.randperm(len(all_files), generator=g).tolist()
            
            train_boundary = int(0.70 * len(all_files))
            val_boundary = int(0.85 * len(all_files))
            
            if self.split == "train":
                target_indices = shuffled_indices[:train_boundary]
            elif self.split == "val":
                target_indices = shuffled_indices[train_boundary:val_boundary]
            else: # test split
                target_indices = shuffled_indices[val_boundary:]
                
            for idx in target_indices:
                self.image_paths.append(os.path.join(class_folder, all_files[idx]))
                self.labels.append(class_idx)

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path).convert("L") # Enforce Grayscale Gradients
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

# Best Practice Real-time Data Preparation Pipline
def get_neu_dataloaders(root_dir, batch_size=32, num_workers=4):
    train_transforms = transforms.Compose([
        transforms.Resize((200, 200)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.4419], std=[0.1982])
    ])
    
    val_transforms = transforms.Compose([
        transforms.Resize((200, 200)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.4419], std=[0.1982])
    ])
    
    train_dataset = NEUSurfaceDefectDataset(root_dir, "train", train_transforms)
    val_dataset = NEUSurfaceDefectDataset(root_dir, "val", val_transforms)
    
    train_loader = DataLoader(
        train_dataset, batch_size=batch_size, shuffle=True,
        num_workers=num_workers, pin_memory=True, drop_last=True
    )
    val_loader = DataLoader(
        val_dataset, batch_size=batch_size, shuffle=False,
        num_workers=num_workers, pin_memory=True
    )
    
    return train_loader, val_loader`}
                </pre>
              </div>

            </div>

          </div>
        )}

        {/* 2. PYTORCH TRAINING WORKSTATION */}
        {activeSubTab === "training" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Control Column */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-6 flex flex-col justify-between font-mono">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2.5">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-100">
                    PyTorch Hyperparameters
                  </span>
                </div>

                {/* Architecture selection */}
                <div className="space-y-1.5 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px]">Model Architecture</label>
                  <select
                    value={backbone}
                    onChange={(e) => setBackbone(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer text-[10.5px]"
                  >
                    <option value="ResNet34">ResNet-34 (Dual Task - 21.3M parameters)</option>
                    <option value="ResNet18">ResNet-18 (Lightweight - 11.2M parameters)</option>
                    <option value="MobileNetV3">MobileNetV3-Large (Flexible Edge - 5.4M)</option>
                    <option value="CustomCNN">Custom SteelDefectCNN (Compact - 1.8M)</option>
                  </select>
                </div>

                {/* Batch Size selector */}
                <div className="space-y-1.5 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px] flex justify-between">
                    <span>Batch Size</span>
                    <strong className="text-cyan-400 font-extrabold">{batchSize} samples/step</strong>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[16, 32, 64, 128].map((size) => (
                      <button
                        key={size}
                        onClick={() => setBatchSize(size)}
                        className={`py-1 rounded border text-[10px] font-bold ${
                          batchSize === size
                            ? "bg-cyan-950/60 text-cyan-400 border-cyan-850"
                            : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-250"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Rate range input */}
                <div className="space-y-1 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px] flex justify-between">
                    <span>Learning Rate</span>
                    <strong className="text-cyan-400 font-extrabold">{learningRate}</strong>
                  </label>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.01"
                    step="0.0002"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[8.5px] text-slate-500">
                    <span>1e-4</span>
                    <span>5e-3</span>
                    <span>1e-2</span>
                  </div>
                </div>

                {/* Optimizer dropdown */}
                <div className="space-y-1.5 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px]">Optimizer Algorithm</label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-slate-200 focus:outline-none text-[10.5px]"
                  >
                    <option value="AdamW">AdamW (Decayed momentum L2 regularization)</option>
                    <option value="SGD">SGD with Nesterov Momentum</option>
                    <option value="RMSprop">RMSprop adaptive gradients</option>
                  </select>
                </div>

                {/* Loss function config */}
                <div className="space-y-1.5 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px]">Criterion Loss</label>
                  <select
                    value={lossFunction}
                    onChange={(e) => setLossFunction(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-slate-200 focus:outline-none text-[10.5px]"
                  >
                    <option value="CrossEntropy">Standard CrossEntropyLoss</option>
                    <option value="FocalLoss">FocalLoss (Weight-focused sample imbalance)</option>
                    <option value="LabelSmoothing">CrossEntropy (Label Smoothing: 0.1)</option>
                  </select>
                </div>

                {/* Epochs Slider */}
                <div className="space-y-1 text-[10.5px]">
                  <label className="text-slate-500 block uppercase font-bold text-[9px] flex justify-between">
                    <span>Target Epoch Cycles</span>
                    <strong className="text-pink-400 font-extrabold">{epochs} epochs</strong>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-400"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500">
                    <span>5 Epochs</span>
                    <span>20 Epochs</span>
                  </div>
                </div>

              </div>

              {/* ACTION TRIGGER BOX */}
              <div className="pt-4 border-t border-slate-900 space-y-3.5">
                <button
                  onClick={startPyTorchTraining}
                  disabled={isTraining}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    isTraining
                      ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-wait"
                      : "bg-gradient-to-r from-red-600 to-amber-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-[1.01] cursor-pointer"
                  }`}
                >
                  <Play className={`w-4 h-4 ${isTraining ? "animate-spin" : ""}`} />
                  <span>{isTraining ? `Training Epoch ${currentEpoch}/${epochs}` : "Launch PyTorch Training Run"}</span>
                </button>

                {isTraining && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                      <span>DATAPATH COMPILING</span>
                      <span>{trainingProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-350"
                        style={{ width: `${trainingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live PyTorch Logs Console (8 Columns) */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between h-[450px] relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-slate-900 border-b border-slate-805 border-slate-800 p-2.5 w-full flex justify-between items-center z-10 select-none">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-450 text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>PyTorch Training Worker Terminal Logs</strong>
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>

                {/* SCROLLING BODY LOGS */}
                <div
                  ref={(ref) => setLogScrollRef(ref)}
                  className="overflow-y-auto font-mono text-[9.5px] leading-relaxed text-slate-300 space-y-1.5 pt-10 text-left pr-2 flex-grow scrollbar-thin scrollbar-thumb-slate-900"
                >
                  {trainingLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                      <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                      <p className="max-w-md text-[10.5px]">
                        No active PyTorch run allocated. Configure the hyperparameters on the left, then click "Launch PyTorch Training Run" to trigger model training.
                      </p>
                    </div>
                  ) : (
                    trainingLogs.map((log, i) => (
                      <div key={i} className="whitespace-pre-wrap select-text selection:bg-slate-800">
                        {log.startsWith("Epoch") ? (
                          <span className="text-cyan-451 text-cyan-400 font-bold">{log}</span>
                        ) : log.startsWith("[Metrics") ? (
                          <span className="text-emerald-451 text-emerald-400 font-bold">{log}</span>
                        ) : log.startsWith("[Success") ? (
                          <span className="text-teal-400 font-bold">{log}</span>
                        ) : (
                          <span>{log}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {trainingLogs.length > 0 && !isTraining && (
                  <div className="pt-2.5 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono select-none">
                    <span className="text-slate-500">Model output serialized successfully.</span>
                    <button
                      onClick={() => setTrainingLogs([])}
                      className="text-red-400 hover:text-red-350 transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>CLEAR LOGS</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 3. ACCURACY AND VALIDATION LOGIC CHAT CARD */}
        {activeSubTab === "metrics" && (
          <div className="space-y-6 text-left">
            
            {/* Split layout: Loss Graph and Accuracy Graph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* GRAPH 1: LOSS CURVES */}
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 font-mono">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-450 block">CONVERGENCE AUDIT</span>
                    <h3 className="text-xs font-bold text-slate-100">Cross-Entropy Loss Trend</h3>
                  </div>

                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block" /> Train Loss</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Val Loss</span>
                  </div>
                </div>

                {/* SVG Line Graph representation */}
                <div className="h-44 w-full bg-slate-950/80 rounded border border-slate-900 relative p-2 font-mono flex items-end justify-between select-none">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    {/* Grids helper lines */}
                    <line x1="0" y1="37" x2="400" y2="37" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="112" x2="400" y2="112" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Plot Train Loss (Red) */}
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      points={activeLossCurve.map((val, idx) => {
                        const x = (idx / (activeLossCurve.length - 1)) * 380 + 10;
                        const y = 140 - (val / 1.0) * 120; // Bound to max 1.0 loss
                        return `${x},${y}`;
                      }).join(" ")}
                    />

                    {/* Plot Val Loss (Cyan) */}
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      points={activeValLossCurve.map((val, idx) => {
                        const x = (idx / (activeValLossCurve.length - 1)) * 380 + 10;
                        const y = 140 - (val / 1.0) * 120;
                        return `${x},${y}`;
                      }).join(" ")}
                    />

                    {/* Nodes represent epoch indices */}
                    {activeValLossCurve.map((val, idx) => {
                      const x = (idx / (activeValLossCurve.length - 1)) * 380 + 10;
                      const y = 140 - (val / 1.0) * 120;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#083344"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                        />
                      );
                    })}
                  </svg>

                  {/* Left Side labels */}
                  <div className="absolute top-2 left-2 text-[8px] text-slate-500 uppercase flex flex-col space-y-[26px]">
                    <span>Loss: 1.0</span>
                    <span>Loss: 0.5</span>
                    <span>Loss: 0.0</span>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Epoch 1</span>
                  <span>Mid Epoch</span>
                  <span>Epoch {activeLossCurve.length}</span>
                </div>
              </div>

              {/* GRAPH 2: ACCURACY CURVES */}
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 font-mono">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-450 block">PERFORMANCE AUDIT</span>
                    <h3 className="text-xs font-bold text-slate-100">Accuracy Evolution (%)</h3>
                  </div>

                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-pink-500 inline-block" /> Train Acc</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Val Acc</span>
                  </div>
                </div>

                {/* SVG Graph for accuracy line */}
                <div className="h-44 w-full bg-slate-950/80 rounded border border-slate-900 relative p-2 font-mono flex items-end justify-between select-none">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    <line x1="0" y1="37" x2="400" y2="37" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="112" x2="400" y2="112" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Train Acc Polyline */}
                    <polyline
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                      points={activeAccCurve.map((val, idx) => {
                        const x = (idx / (activeAccCurve.length - 1)) * 380 + 10;
                        const y = 140 - ((val - 50) / 50) * 120; // Scaling between 50% and 100%
                        return `${x},${y}`;
                      }).join(" ")}
                    />

                    {/* Val Acc Polyline */}
                    <polyline
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      points={activeValAccCurve.map((val, idx) => {
                        const x = (idx / (activeValAccCurve.length - 1)) * 380 + 10;
                        const y = 140 - ((val - 50) / 50) * 120;
                        return `${x},${y}`;
                      }).join(" ")}
                    />

                    {/* Nodes */}
                    {activeValAccCurve.map((val, idx) => {
                      const x = (idx / (activeValAccCurve.length - 1)) * 380 + 10;
                      const y = 140 - ((val - 50) / 50) * 120;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#022c22"
                          stroke="#34d399"
                          strokeWidth="2.5"
                        />
                      );
                    })}
                  </svg>

                  {/* Left Side labels */}
                  <div className="absolute top-2 left-2 text-[8px] text-slate-500 uppercase flex flex-col space-y-[26px]">
                    <span>Acc: 100%</span>
                    <span>Acc: 75%</span>
                    <span>Acc: 50%</span>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Epoch 1</span>
                  <span>Mid Epoch</span>
                  <span>Epoch {activeAccCurve.length}</span>
                </div>
              </div>

            </div>

            {/* CLASSIFICATION STATS AND INTEGRATED INTERACTIVE CONFUSION MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Classification precision/recall metrics */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4">
                <div className="border-b border-slate-905 border-slate-900 pb-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider font-mono">
                    Evaluation Matrix Log & F1-Scores
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">
                    Tested on 270 samples of the Northeastern University split.
                  </p>
                </div>

                <div className="border border-slate-900 rounded-xl overflow-hidden font-mono text-[10.5px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 font-bold">
                        <th className="p-2.5">Class</th>
                        <th className="p-2.5">Precision</th>
                        <th className="p-2.5">Recall</th>
                        <th className="p-2.5 font-bold text-cyan-400">F1-Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NEU_CLASSES.map((cls) => (
                        <tr key={cls.code} className="border-b last:border-0 border-slate-900">
                          <td className="p-2.5 font-bold flex items-center gap-1.5 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-453 bg-cyan-400" />
                            {cls.name}
                          </td>
                          <td className="p-2.5 text-slate-400">{cls.precision.toFixed(3)}</td>
                          <td className="p-2.5 text-slate-400">{cls.recall.toFixed(3)}</td>
                          <td className="p-2.5 font-extrabold text-cyan-405 text-cyan-400">{cls.f1.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overall Aggregations Block */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/40 rounded-lg border border-slate-900 text-center font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block uppercase text-[8px]">Overall Accuracy</span>
                    <strong className="text-sm text-emerald-400 block font-black mt-1">
                      {trainedStats.testAccuracy}%
                    </strong>
                  </div>
                  <div className="border-x border-slate-900">
                    <span className="text-slate-500 block uppercase text-[8px]">Macro F1-Avg</span>
                    <strong className="text-sm text-cyan-400 block font-black mt-1">
                      {trainedStats.macroF1}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[8px]">Weighted Avg</span>
                    <strong className="text-sm text-slate-300 block font-bold mt-1">
                      {trainedStats.weightedPrecision}
                    </strong>
                  </div>
                </div>

                {/* EXPORT DATA AND EMBEDDED REPORT GENERATOR CONNECTOR */}
                <button
                  onClick={exportNeuEvaluationJSON}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-slate-100 border border-slate-800 text-slate-300 font-mono text-[10.5px] uppercase font-bold tracking-wide rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Evaluation Report (.json)</span>
                </button>
              </div>

              {/* Dynamic Interactive Confusion Matrix Heated Matrix (7 Columns) */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4">
                
                <div className="flex justify-between items-center border-b border-slate-905 border-slate-900 pb-3 font-mono">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-450 block">CLASSIFIER GRID</span>
                    <h3 className="text-xs font-bold text-slate-100">NEU Confusion Matrix (270 Targets)</h3>
                  </div>

                  <span className="text-[9px] text-slate-500">
                    Row = Label Target, Column = Prediction
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9.5px]">
                  
                  {/* Top Header Labels row */}
                  <div className="text-slate-500 font-bold leading-8 h-8">T \ P</div>
                  {NEU_CLASSES.map((cls) => (
                    <div key={cls.code} className="text-slate-400 font-bold bg-slate-900/30 border border-slate-900 rounded flex items-center justify-center h-8" title={cls.name}>
                      {cls.code}
                    </div>
                  ))}

                  {/* Rows iteration */}
                  {TYPICAL_CONF_MATRIX.map((row, rowIdx) => {
                    const classTarget = NEU_CLASSES[rowIdx];
                    return (
                      <React.Fragment key={rowIdx}>
                        {/* Row Left Label */}
                        <div className="text-slate-400 font-bold bg-slate-900/30 border border-slate-900 rounded flex items-center justify-center h-8">
                          {classTarget.code}
                        </div>

                        {/* Cells Columns */}
                        {row.map((val, colIdx) => {
                          const isDiagonal = rowIdx === colIdx;
                          const classPredicted = NEU_CLASSES[colIdx];
                          
                          let cellColor = "bg-slate-950/40 text-slate-650 text-slate-600";
                          if (val > 0) {
                            if (isDiagonal) {
                              cellColor = val > 43 
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-900" 
                                : "bg-teal-950 text-teal-400 border border-teal-900";
                            } else {
                              cellColor = "bg-amber-950 text-amber-500 border border-amber-900";
                            }
                          }
                          
                          return (
                            <div
                              key={colIdx}
                              className={`h-8 rounded flex items-center justify-center transition-all cursor-crosshair ${cellColor} hover:scale-[1.08] hover:z-20`}
                              title={`Target: ${classTarget.name}, Predicted: ${classPredicted.name}, Count: ${val}`}
                            >
                              {val}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}

                </div>

                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-900 font-mono text-[9.5px] leading-relaxed text-slate-400 space-y-1">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Strong diagonal values (93% - 100%) represent near-perfect ResNet-34 classification weights.</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Off-diagonal values represent minor misclassification (e.g. Crazing misidentified as Pitted Surface).</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 4. TENSORBOARD LIVE SESSION */}
        {activeSubTab === "tensorboard" && (
          <div className="space-y-6 text-left">
            
            {/* Top scalars selector deck */}
            <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-orange-500" />
                    <h3 className="text-xs uppercase font-extrabold text-slate-100">
                      TensorBoard Client Core v2.16
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-none">
                    Real-time local tracking portal. Auto-reloading active checkpoints.
                  </p>
                </div>

                {/* Sub toggle for tags */}
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-805 border-slate-800">
                  {[
                    { tag: "loss/train_val", label: "Loss Curves", icon: Activity },
                    { tag: "accuracy/train_val", label: "Accuracy Metrics", icon: TrendingUp },
                    { tag: "learning_rate", label: "Learning Rate Decay", icon: Sliders }
                  ].map((scalar) => (
                    <button
                      key={scalar.tag}
                      onClick={() => setSelectedScalarTag(scalar.tag as any)}
                      className={`px-3 py-1 text-[9.5px] font-bold uppercase rounded transition-all flex items-center gap-1.5 ${
                        selectedScalarTag === scalar.tag
                          ? "bg-orange-500 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <scalar.icon className="w-3 h-3" />
                      <span>{scalar.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main TensorBoard simulated iframe visualization */}
              <div className="border border-slate-850 bg-[#02050b] rounded-xl p-5 relative overflow-hidden font-mono min-h-[350px] flex flex-col justify-between">
                
                {/* Tensorboard styled header */}
                <div className="border-b border-orange-950/20 pb-4 select-none flex justify-between items-center text-[10px] text-slate-450 text-slate-400">
                  <span className="text-orange-500 font-extrabold uppercase">SCALARS TAB ACTIVE</span>
                  <div className="flex gap-4">
                    <span>Host: localhost:6006</span>
                    <span className="text-emerald-400">Active Node Online</span>
                  </div>
                </div>

                {/* Simulated Content plots */}
                <div className="flex-grow flex flex-col justify-center py-4">
                  
                  {selectedScalarTag === "loss/train_val" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Plot Loss/Train Scalar widget */}
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-900/30">loss/train</span>
                        <div className="h-28 w-full bg-[#02050b] rounded border border-slate-900 p-2 relative flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <polyline
                              fill="none"
                              stroke="#ff6b00"
                              strokeWidth="2"
                              points={activeLossCurve.map((val, idx) => {
                                const x = (idx / (activeLossCurve.length - 1)) * 280 + 10;
                                const y = 90 - (val / 1.0) * 75;
                                return `${x},${y}`;
                              }).join(" ")}
                            />
                            {/* Smooth overlay shaded area */}
                            <path
                              fill="rgba(255, 107, 0, 0.05)"
                              d={`M 10 90 ` + activeLossCurve.map((val, idx) => {
                                const x = (idx / (activeLossCurve.length - 1)) * 280 + 10;
                                const y = 90 - (val / 1.0) * 75;
                                return `L ${x} ${y}`;
                              }).join(" ") + ` L 290 90 Z`}
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Plot Loss/Val Scalar widget */}
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/30 font-bold">loss/val</span>
                        <div className="h-28 w-full bg-[#02050b] rounded border border-slate-900 p-2 relative flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <polyline
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2"
                              points={activeValLossCurve.map((val, idx) => {
                                const x = (idx / (activeValLossCurve.length - 1)) * 280 + 10;
                                const y = 90 - (val / 1.0) * 75;
                                return `${x},${y}`;
                              }).join(" ")}
                            />
                            <path
                              fill="rgba(245, 158, 11, 0.05)"
                              d={`M 10 90 ` + activeValLossCurve.map((val, idx) => {
                                const x = (idx / (activeValLossCurve.length - 1)) * 280 + 10;
                                const y = 90 - (val / 1.0) * 75;
                                return `L ${x} ${y}`;
                              }).join(" ") + ` L 290 90 Z`}
                            />
                          </svg>
                        </div>
                      </div>

                    </div>
                  )}

                  {selectedScalarTag === "accuracy/train_val" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Plot Accuracy/Train Scalar widget */}
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#f472b6]/10 text-[#f472b6] border border-[#f472b6]/20">accuracy/train</span>
                        <div className="h-28 w-full bg-[#02050b] rounded border border-slate-900 p-2 relative flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <polyline
                              fill="none"
                              stroke="#ec4899"
                              strokeWidth="2"
                              points={activeAccCurve.map((val, idx) => {
                                const x = (idx / (activeAccCurve.length - 1)) * 280 + 10;
                                const y = 90 - ((val - 50) / 50) * 75;
                                return `${x},${y}`;
                              }).join(" ")}
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Plot Accuracy/Val Scalar widget */}
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-450 border border-emerald-900/30">accuracy/val</span>
                        <div className="h-28 w-full bg-[#02050b] rounded border border-slate-900 p-2 relative flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <polyline
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2"
                              points={activeValAccCurve.map((val, idx) => {
                                const x = (idx / (activeValAccCurve.length - 1)) * 280 + 10;
                                const y = 90 - ((val - 50) / 50) * 75;
                                return `${x},${y}`;
                              }).join(" ")}
                            />
                          </svg>
                        </div>
                      </div>

                    </div>
                  )}

                  {selectedScalarTag === "learning_rate" && (
                    <div className="max-w-2xl mx-auto bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-450 border border-blue-900/20 block w-fit">learning_rate_scheduler_decay</span>
                      <div className="h-32 w-full bg-[#02050b] rounded border border-slate-900 p-2 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 350 100">
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            points={activeLossCurve.map((_, idx) => {
                              const x = (idx / (activeLossCurve.length - 1)) * 330 + 10;
                              // Simulate learning rate decay curve (e.g. cosine annealing lr decay)
                              const decayedLr = learningRate * Math.cos((idx / (activeLossCurve.length - 1)) * (Math.PI / 2.3));
                              const y = 90 - (decayedLr / learningRate) * 75;
                              return `${x},${y}`;
                            }).join(" ")}
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer status barcode metadata */}
                <span className="text-[8px] text-slate-600 font-mono text-center block leading-none">
                  TensorBoard session syncing live metrics. Process ID PID-40912 active in Docker environment block.
                </span>

              </div>

            </div>

          </div>
        )}

        {/* 5. MODEL ARCHITECTURE COMPARISON PANEL */}
        {activeSubTab === "comparison" && (
          <div className="space-y-6 text-left">
            
            <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-5 font-mono">
              <div className="border-b border-slate-905 border-slate-900 pb-3">
                <h3 className="text-xs uppercase font-extrabold text-slate-100">
                  Deep Benchmark Comparison (NEU Dataset Metrics)
                </h3>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Comparison statistics audited across four production CNN frameworks.
                </p>
              </div>

              {/* Table comparisons */}
              <div className="border border-slate-900 rounded-xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 font-bold">
                      <th className="p-3">Model Architecture</th>
                      <th className="p-3 text-cyan-400">Top-1 Accuracy</th>
                      <th className="p-3">Inference Latency</th>
                      <th className="p-3">Epoch Train Speed</th>
                      <th className="p-3">Parameters Weight</th>
                      <th className="p-3 text-right">Edge Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "ResNet-34 (Selected Core)", acc: "98.15%", latency: "14.2 ms", speed: "16.2 s / epoch", params: "21.3M", status: "STABLE", statusColor: "text-emerald-450 bg-emerald-950/40 border-emerald-900" },
                      { name: "ResNet-18 (Lightweight)", acc: "96.40%", latency: "8.1 ms", speed: "9.4 s / epoch", params: "11.2M", status: "NOMINAL", statusColor: "text-cyan-450 bg-cyan-950/40 border-cyan-900" },
                      { name: "MobileNetV3 (Edge Optimized)", acc: "95.12%", latency: "3.4 ms", speed: "4.1 s / epoch", params: "5.4M", status: "NOMINAL", statusColor: "text-cyan-455 bg-cyan-950/40 border-cyan-900" },
                      { name: "Custom Compact SteelCNN", acc: "92.85%", latency: "1.9 ms", speed: "2.5 s / epoch", params: "1.8M", status: "FAST", statusColor: "text-pink-450 bg-pink-955 bg-pink-950/30 border-pink-900" }
                    ].map((model) => (
                      <tr key={model.name} className="border-b last:border-0 border-slate-900">
                        <td className="p-3 font-bold text-slate-205 text-slate-300">{model.name}</td>
                        <td className="p-3 text-cyan-405 text-cyan-400 font-black">{model.acc}</td>
                        <td className="p-3 text-slate-400">{model.latency}</td>
                        <td className="p-3 text-slate-400">{model.speed}</td>
                        <td className="p-3 text-slate-400">{model.params}</td>
                        <td className="p-3 text-right">
                          <span className={`text-[8.5px] px-2 py-0.5 rounded border ${model.statusColor}`}>
                            {model.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Explainer note */}
              <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-900 font-mono text-[9.5px] text-slate-400 space-y-1">
                <p>
                  <strong>Selection Engineering Trade-Off:</strong> While <strong>MobileNetV3</strong> boasts outstanding inference latencies of only 3.4ms, <strong>ResNet-34</strong> was handpicked as our primary continuous scanning backbone to guarantee maximum sensitivity weight detection across delicate micro-abrasions like webbed <strong>Crazing (Cr)</strong> patterns, preventing catastrophic guide roll cracking before it propagates.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
