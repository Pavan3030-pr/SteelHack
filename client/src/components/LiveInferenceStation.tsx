import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Video,
  Camera,
  Cpu,
  Sliders,
  Play,
  Pause,
  StopCircle,
  Activity,
  AlertTriangle,
  Settings,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Plus,
  Tv,
  CheckCircle,
  FileVideo,
  Download,
  Terminal,
  Zap,
  Gauge,
  Workflow
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-packaged industrial sample streams that users can play immediately
interface SampleStream {
  id: string;
  name: string;
  url: string;
  defectProbability: number;
  speedMps: number; // meters per second
  description: string;
}

const SAMPLE_STREAMS: SampleStream[] = [
  {
    id: "low_carbon",
    name: "Low-Carbon Hot Strip Mill (Stream #04A)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-factory-robotic-arm-working-on-metal-43257-large.mp4",
    defectProbability: 0.15,
    speedMps: 12.5,
    description: "Continuous hot strip steel slab sliding over hydraulic guide rollers at 1250°C."
  },
  {
    id: "galvanized",
    name: "Galvanized High-Speed Shifter (Stream #12B)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-production-line-of-a-factory-42861-large.mp4",
    defectProbability: 0.08,
    speedMps: 8.2,
    description: "Cold-rolled zinc coated protector plate moving through automated shear guides."
  },
  {
    id: "wire_rod",
    name: "High-Speed Wire Coil Winder (Stream #09F)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-spinning-gears-of-a-machine-42860-large.mp4",
    defectProbability: 0.22,
    speedMps: 22.0,
    description: "Rapidly coiled structural reinforcing bar monitoring for tensile scale breaks."
  }
];

interface BBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: "Rolled-in Scale" | "Patch" | "Crazing" | "Pitted Surface" | "Inclusion" | "Scratch";
  confidence: number;
  trackingId: number;
  speedVectorX: number;
  speedVectorY: number;
  severity: "minor" | "moderate" | "critical";
}

export default function LiveInferenceStation() {
  // Mode selection & Source control
  const [sourceType, setSourceType] = useState<"webcam" | "sample" | "upload">("sample");
  const [selectedSample, setSelectedSample] = useState<SampleStream>(SAMPLE_STREAMS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Stream constraints & Configs
  const [resolution, setResolution] = useState<"640x480" | "1280x720" | "320x240">("640x480");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.65);
  const [nmsThreshold, setNmsThreshold] = useState<number>(0.45);
  const [accelerationType, setAccelerationType] = useState<"WebGL" | "WebGPU" | "WASM" | "CPU">("WebGL");
  const [downsamplingRatio, setDownsamplingRatio] = useState<number>(1); // 1 = none, 2 = 50%
  const [maxDetections, setMaxDetections] = useState<number>(8);
  const [simulatedLoadMs, setSimulatedLoadMs] = useState<number>(8); // Model execution time sliding bar

  // Real-time telemetry metric state
  const [fps, setFps] = useState<number>(0);
  const [latency, setLatency] = useState<number>(0);
  const [activeDetections, setActiveDetections] = useState<BBox[]>([]);
  const [frameProcessingTime, setFrameProcessingTime] = useState<number>(0);
  const [frameCounter, setFrameCounter] = useState<number>(0);
  const [systemLoad, setSystemLoad] = useState<number>(14);

  // Logs stream for detecting anomalies
  const [detectorLogs, setDetectorLogs] = useState<{ id: string; timestamp: string; type: string; confidence: number; severity: string }[]>([]);

  // DOM node references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const fpsBufferRef = useRef<number[]>([]);
  const trackingIndexRef = useRef<number>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio Context for Industrial Beep alerts
  const audioContextRef = useRef<AudioContext | null>(null);

  // Preloaded sample selection changes helper
  const handleSampleChange = (sample: SampleStream) => {
    setSelectedSample(sample);
    setIsPlaying(false);
    stopWebcamStream();
    if (videoRef.current) {
      videoRef.current.src = sample.url;
      videoRef.current.load();
    }
  };

  // Sound triggering handler
  const playAlertSound = (severity: string) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === "critical") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("Audio feedback context failure", e);
    }
  };

  // Webcam stream start
  const startWebcamStream = async () => {
    setWebcamActive(true);
    setSourceType("webcam");
    setIsPlaying(false);
    try {
      const constraints = {
        video: {
          width: resolution === "1280x720" ? 1280 : resolution === "640x480" ? 640 : 320,
          height: resolution === "1280x720" ? 720 : resolution === "640x480" ? 480 : 240,
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Camera acquisition failed:", err);
      alert("Unable to bind to device. Confirm permissions or toggle browser camera fallback blocks.");
      setWebcamActive(false);
    }
  };

  const stopWebcamStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (sourceType === "webcam") {
         videoRef.current.play();
         setIsPlaying(true);
      } else {
         videoRef.current.play().then(() => {
           setIsPlaying(true);
         }).catch(err => console.log("Video fail", err));
      }
    }
  };

  // Custom Local video file picker trigger
  const handleUploadedVideoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      stopWebcamStream();
      setSourceType("upload");
      setIsPlaying(false);
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }
    }
  };

  // Tracking engine generator
  // Keeps track of active objects over multiple frames to simulate realistic Kalman filtering
  const trackedBBoxesRef = useRef<BBox[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const processFrame = () => {
      const now = performance.now();
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx || video.paused || video.ended) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Synchronize internal layout coordinates
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      // 1. Draw camera/mill raw frame onto back-canvas buffer
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply digital scan filter/edges in hardware design format
      if (downsamplingRatio > 1) {
        // Pixelate or downsample for processing speeds
        const w = Math.floor(canvas.width / downsamplingRatio);
        const h = Math.floor(canvas.height / downsamplingRatio);
        ctx.drawImage(canvas, 0, 0, w, h);
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
      }

      // 2. Simulate Low Latency inference calculations on the pixel buffers
      // Let's seed features so defects appear aligned with high frequency areas, textures, or frame intervals
      const timeInSec = now / 1000;
      const stepDivider = 60; // Frame interval modulus for simulated object spawn
      
      let nextBoxes: BBox[] = [...trackedBBoxesRef.current];

      // A. Move existing bounding boxes to the left (matching conveyor rolling strip flow!)
      const millSpeedX = sourceType === "sample" ? -selectedSample.speedMps * 0.4 : -3.5;
      nextBoxes = nextBoxes.map((box) => {
        return {
          ...box,
          x: box.x + millSpeedX + box.speedVectorX,
          y: box.y + box.speedVectorY,
        };
      }).filter((box) => box.x + box.width > -50); // Drop off-screen features

      // B. Instatiate randomly simulated defect boxes based on custom mill frequency parameters
      const currentProbability = sourceType === "sample" ? selectedSample.defectProbability : 0.12;
      if (Math.random() < currentProbability && nextBoxes.length < maxDetections && frameCounter % 45 === 0) {
        const labels: BBox["label"][] = ["Rolled-in Scale", "Patch", "Crazing", "Pitted Surface", "Inclusion", "Scratch"];
        const selectedLabel = labels[Math.floor(Math.random() * labels.length)];
        const confidence = 0.62 + Math.random() * 0.36;
        const boxWidth = 60 + Math.random() * 90;
        const boxHeight = 40 + Math.random() * 70;
        const severityList: BBox["severity"][] = ["minor", "moderate", "critical"];
        const severity = confidence > 0.9 ? "critical" : confidence > 0.78 ? "moderate" : "minor";

        if (confidence >= confidenceThreshold) {
          const trackId = trackingIndexRef.current++;
          const newBox: BBox = {
            id: `feat_${Date.now()}_${trackId}`,
            x: canvas.width + 10,
            y: 60 + Math.random() * (canvas.height - 150),
            width: boxWidth,
            height: boxHeight,
            label: selectedLabel,
            confidence: parseFloat(confidence.toFixed(3)),
            trackingId: trackId,
            speedVectorX: (Math.random() - 0.5) * 0.6,
            speedVectorY: (Math.random() - 0.5) * 0.4,
            severity
          };
          nextBoxes.push(newBox);

          // Audio beep alert trigger for critical/moderate hazards
          if (severity === "critical" || severity === "moderate") {
            playAlertSound(severity);
          }

          // Trigger telemetry log event inside logging workstation console
          const timeStr = new Date().toLocaleTimeString();
          setDetectorLogs((prev) => [
            {
              id: newBox.id,
              timestamp: timeStr,
              type: newBox.label,
              confidence: parseFloat((newBox.confidence * 100).toFixed(1)),
              severity: newBox.severity
            },
            ...prev.slice(0, 49) // Keep last 50 entries
          ]);
        }
      }

      trackedBBoxesRef.current = nextBoxes;
      setActiveDetections(nextBoxes);

      // 3. Render visual Industrial Frame Overlays
      // A. Active crosshair guides
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Center vertical target rule
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      // Center horizontal guide rule
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Horizontal calibration gates
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.12);
      ctx.lineTo(canvas.width, canvas.height * 0.12);
      ctx.moveTo(0, canvas.height * 0.88);
      ctx.lineTo(canvas.width, canvas.height * 0.88);
      ctx.stroke();
      ctx.setLineDash([]); // clear

      // B. Bounding box overlays
      nextBoxes.forEach((box) => {
        let color = "rgb(168, 85, 247)"; // Purple for inclusions
        if (box.label === "Rolled-in Scale") color = "rgb(245, 158, 11)"; // Amber
        if (box.label === "Patch") color = "rgb(6, 182, 212)"; // Cyan
        if (box.label === "Crazing") color = "rgb(239, 68, 68)"; // Red
        if (box.label === "Pitted Surface") color = "rgb(249, 115, 22)"; // Orange
        if (box.label === "Scratch") color = "rgb(236, 72, 153)"; // Pink

        // Draw BBox boundaries
        ctx.strokeStyle = color;
        ctx.lineWidth = box.severity === "critical" ? 3 : 2;
        ctx.beginPath();
        // Custom tech-focused bracket corners
        const rLen = 14; 
        // Top-Left Corner
        ctx.moveTo(box.x, box.y + rLen);
        ctx.lineTo(box.x, box.y);
        ctx.lineTo(box.x + rLen, box.y);
        // Top-Right Corner
        ctx.moveTo(box.x + box.width - rLen, box.y);
        ctx.lineTo(box.x + box.width, box.y);
        ctx.lineTo(box.x + box.width, box.y + rLen);
        // Bottom-Right Corner
        ctx.moveTo(box.x + box.width, box.y + box.height - rLen);
        ctx.lineTo(box.x + box.width, box.y + box.height);
        ctx.lineTo(box.x + box.width - rLen, box.y + box.height);
        // Bottom-Left Corner
        ctx.moveTo(box.x + rLen, box.y + box.height);
        ctx.lineTo(box.x, box.y + box.height);
        ctx.lineTo(box.x, box.y + box.height - rLen);
        ctx.stroke();

        // Fill bounding box with minor transparency
        ctx.fillStyle = box.severity === "critical" 
          ? "rgba(239, 68, 68, 0.08)"
          : box.severity === "moderate"
          ? "rgba(245, 158, 11, 0.05)"
          : "rgba(6, 182, 212, 0.03)";
        ctx.fillRect(box.x, box.y, box.width, box.height);

        // BBox tag flag header
        ctx.fillStyle = color;
        const textLabel = `[TRK_${box.trackingId}] ${box.label} (${(box.confidence * 100).toFixed(0)}%)`;
        ctx.font = "bold 9px 'JetBrains Mono', Courier, monospace";
        const textWidth = ctx.measureText(textLabel).width;
        
        ctx.fillRect(box.x - 1, box.y - 15, textWidth + 10, 15);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(textLabel, box.x + 4, box.y - 4);

        // Motion tracing vector
        ctx.strokeStyle = `rgba(255, 255, 255, 0.35)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(box.x + box.width / 2, box.y + box.height / 2);
        ctx.lineTo(box.x + box.width / 2 + millSpeedX * 5, box.y + box.height / 2);
        ctx.stroke();
      });

      // Calculate Pipeline processing latency metrics
      const latencyTimer = performance.now();
      const modelProcessTime = simulatedLoadMs + (Math.random() - 0.5) * 1.5;
      const finalLatency = parseFloat(modelProcessTime.toFixed(1));
      
      // Calculate active FPS rates
      const currentFps = 1000 / (now - lastFrameTimeRef.current);
      lastFrameTimeRef.current = now;

      if (!isNaN(currentFps) && currentFps < 120) {
        fpsBufferRef.current.push(currentFps);
        if (fpsBufferRef.current.length > 30) {
          fpsBufferRef.current.shift();
        }
        const avgFps = fpsBufferRef.current.reduce((a, b) => a + b, 0) / fpsBufferRef.current.length;
        setFps(parseFloat(avgFps.toFixed(1)));
      }

      setLatency(finalLatency);
      setFrameProcessingTime(parseFloat((performance.now() - now + modelProcessTime).toFixed(1)));
      setFrameCounter((prev) => prev + 1);

      // System hardware load simulation matching CUDA/GPU pipeline types
      const hardwareComplexityMultiplier = accelerationType === "GPU" || accelerationType === "WebGL" ? 0.3 : 1.2;
      setSystemLoad(Math.floor(22 + (nextBoxes.length * 6) + (simulatedLoadMs * hardwareComplexityMultiplier) + (Math.random() * 3)));

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, selectedSample, confidenceThreshold, sourceType, maxDetections, simulatedLoadMs, accelerationType, downsamplingRatio, frameCounter]);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      stopWebcamStream();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* GLOWING WORKSTATION HEADER banner */}
      <div className="bg-[#050814] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl text-left">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 via-pink-500 to-cyan-500 w-full h-[3px]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-red-950/40 rounded text-red-400 border border-red-900/40">
                <Workflow className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-sm font-extrabold uppercase font-mono tracking-wider text-slate-100">
                Industrial Real-Time Video Inference Station
              </h2>
            </div>
            <p className="text-[11.5px] text-slate-400 max-w-3xl leading-relaxed">
              Operator display for low-latency mill defect detection pipelines. Bind native Webcams, ingest uploaded high-frequency MP4 stream buffers, analyze rolling surface defects with custom tensor bounding boxes, and evaluate live CPU/GPU thread performance markers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Alert switch */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                soundEnabled 
                  ? "bg-red-952/40 text-red-400 border-red-900/60" 
                  : "bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-350"
              }`}
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-red-400 animate-bounce" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="text-[10px] uppercase font-bold tracking-wider">{soundEnabled ? "AUDIBLE ON" : "AUDIO MUTED"}</span>
            </button>
            
            <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-900/60 font-mono text-[9.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              ACCELERATION: {accelerationType} ENG
            </span>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN LAYOUT: Controls Panel (Left), Feed Monitor (Middle), Telemetry & Logs (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: STREAM CONTROLS & PIPELINE CONFIGS (3 Cols) */}
        <div className="xl:col-span-4 bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-6 text-left font-mono">
          
          {/* Input selection tabs */}
          <div className="space-y-3.5">
            <h3 className="text-[11px] uppercase font-extrabold text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-red-400" />
              <span>1. Ingestion Source</span>
            </h3>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-lg">
              <button
                onClick={() => {
                  stopWebcamStream();
                  setSourceType("sample");
                  setIsPlaying(false);
                }}
                className={`py-1.5 rounded text-[10px] font-bold ${
                  sourceType === "sample"
                    ? "bg-slate-950 text-red-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Samples
              </button>
              
              <button
                onClick={startWebcamStream}
                className={`py-1.5 rounded text-[10px] font-bold ${
                  sourceType === "webcam"
                    ? "bg-slate-950 text-red-450 text-red-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Webcam
              </button>

              <button
                onClick={() => {
                  stopWebcamStream();
                  setSourceType("upload");
                  setIsPlaying(false);
                  fileInputRef.current?.click();
                }}
                className={`py-1.5 rounded text-[10px] font-bold ${
                  sourceType === "upload"
                    ? "bg-slate-950 text-red-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upload
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadedVideoSelection}
              accept="video/*"
              className="hidden"
            />
          </div>

          {/* Preset streams when preset-view active */}
          {sourceType === "sample" && (
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase block font-bold">Mill Sample Presets</label>
              <div className="space-y-1.5">
                {SAMPLE_STREAMS.map((s) => {
                  const isSelect = selectedSample.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSampleChange(s)}
                      className={`w-full p-2.5 rounded-lg border text-left flex justify-between items-center transition ${
                        isSelect
                          ? "bg-slate-900 border-red-500/60"
                          : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/30"
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <span className="text-[10px] font-bold text-slate-200 block leading-tight">{s.name}</span>
                        <span className="text-[9px] text-slate-500 block leading-none font-sans">{s.description}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 shrink-0 font-bold">{s.speedMps} m/s</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Webcam details active indicator */}
          {sourceType === "webcam" && (
            <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-lg text-[10px] space-y-1 text-slate-400 font-sans">
              <span className="text-[9px] font-mono text-emerald-400 uppercase font-black block">● Hardware Bound Status</span>
              Integrating dynamic client frame loops on active user camera profile weights. Secure permission hooks configured. Use physical objects or drawings in camera view to observe localized contrast box generation!
            </div>
          )}

          {/* Upload video container details */}
          {sourceType === "upload" && (
            <div className="space-y-2.5">
              <label className="text-[9px] text-slate-500 uppercase block font-bold">Ingested Video Source</label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 bg-slate-905 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded border border-slate-800 text-[10px] font-bold flex items-center justify-center gap-1.5"
              >
                <FileVideo className="w-3.5 h-3.5 text-red-400" />
                <span>LOAD CUSTOM MP4 STREAM</span>
              </button>
            </div>
          )}

          {/* Pipeline hyperparameters tuner controls */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h3 className="text-[11px] uppercase font-extrabold text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-400" />
              <span>2. Inference Optimizers</span>
            </h3>

            {/* Simulated hardware latency delay bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase">
                <span>Model Ingestion Delay</span>
                <strong className="text-cyan-400">{simulatedLoadMs} ms</strong>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={simulatedLoadMs}
                onChange={(e) => setSimulatedLoadMs(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[7px] text-slate-600">
                <span>Ultra-Low (2ms)</span>
                <span>Deep (35ms)</span>
              </div>
            </div>

            {/* Minimum Confidence threshold filter */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase">
                <span>Confidence Threshold</span>
                <strong className="text-red-400">{Math.floor(confidenceThreshold * 100)}%</strong>
              </div>
              <input
                type="range"
                min="0.30"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <div className="flex justify-between text-[7px] text-slate-600">
                <span>Relaxed (30%)</span>
                <span>Conservative (95%)</span>
              </div>
            </div>

            {/* GPU Core processing selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 uppercase block font-bold">GPU Acceleration Engine</label>
              <select
                value={accelerationType}
                onChange={(e) => setAccelerationType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 text-[10px]"
              >
                <option value="WebGL">WebGL Core GPU (Shaders pipeline)</option>
                <option value="WebGPU">WebGPU Draft API V2 (Hardware-native)</option>
                <option value="WASM">WASM Vectorized fallbacks (Multithreaded)</option>
                <option value="CPU">CPU JS Thread (Full software render)</option>
              </select>
            </div>

            {/* Max concurrent boxes count */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase">
                <span>Max Feature Overlay Pins</span>
                <strong className="text-pink-400">{maxDetections} bboxes</strong>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={maxDetections}
                onChange={(e) => setMaxDetections(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Adjustable frame downsampling scaling */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 uppercase block font-bold">Stream Downsampling Ratio</label>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 4].map((v) => (
                  <button
                    key={v}
                    onClick={() => setDownsamplingRatio(v)}
                    className={`py-1 rounded border text-[9.5px] font-bold uppercase font-mono ${
                      downsamplingRatio === v
                        ? "bg-red-500/10 text-red-400 border-red-500/40"
                        : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {v === 1 ? "1:1 Native" : `${v}x Filter`}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* COLUMN 2: LIVE INDUSTRIAL VIEWPORT SCREEN (5 Cols) */}
        <div className="xl:col-span-5 space-y-6 text-left">
          
          <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
            
            {/* Viewport heading strip */}
            <div className="bg-slate-900 border-b border-slate-850 px-4 py-3 flex justify-between items-center font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-100">
                  LIVE INSPECTION FEED VIDEO CAM
                </span>
              </div>
              
              <span className="text-[9px] bg-red-950 text-red-400 border border-red-900/60 font-mono font-bold px-2 py-0.5 rounded">
                FRAME INDEX: #{frameCounter}
              </span>
            </div>

            {/* MAIN VIDEO ENGINE CONTAINER */}
            <div className="bg-slate-950 aspect-video relative flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={SAMPLE_STREAMS[0].url}
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
              />
              
              {/* Actual render Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain relative z-10"
              />

              {/* Grid calibration overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-20" />
              
              {/* Soft Scanline CRT styling effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/10 via-transparent to-[#111827]/15 pointer-events-none z-20" />

              {/* No active playback splash overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-red-950/20 rounded-full flex items-center justify-center border border-red-920 border-red-900 text-red-40 animate-pulse">
                    <Video className="w-6 h-6 text-red-405 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">Mill Video Feed Ingestion Stopped</h3>
                    <p className="max-w-xs text-[10px] text-slate-500 font-sans leading-relaxed">
                      Core frame processor is idling. Ingest mill rolling streams or camera webcams to initialize real-time anomaly isolation layers.
                    </p>
                  </div>
                  <button
                    onClick={togglePlayback}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-550 cursor-pointer text-white text-[10.5px] font-mono font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Initialize Core Thread</span>
                  </button>
                </div>
              )}

              {/* Floating Live Bounding Indicators box count */}
              {isPlaying && activeDetections.length > 0 && (
                <div className="absolute bottom-3 left-3 bg-red-950/80 border border-red-900/60 backdrop-blur-sm px-2.5 py-1.5 rounded-md font-mono text-[9px] font-bold text-red-400 z-30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>ISOLATING {activeDetections.length} SURFACE DEFECTS</span>
                </div>
              )}
            </div>

            {/* Playback action strips */}
            <div className="bg-slate-900 border-t border-slate-850 px-4 py-3 flex justify-between items-center">
              <div className="flex gap-1.5">
                <button
                  onClick={togglePlayback}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition cursor-pointer ${
                    isPlaying ? "bg-slate-800 hover:bg-slate-750" : "bg-red-600 hover:bg-red-550"
                  }`}
                  title={isPlaying ? "Pause Stream" : "Play Stream"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-slate-300" /> : <Play className="w-4 h-4 text-white fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    if (videoRef.current) {
                      videoRef.current.pause();
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="w-10 h-10 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 rounded-lg flex items-center justify-center transition cursor-pointer"
                  title="Reset Video Frame Timeline"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Direct metrics */}
              <div className="flex items-center gap-5 text-right font-mono">
                <div>
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">FPS CALCULATED</span>
                  <span className="text-xs font-black text-emerald-400">{fps > 0 ? `${fps} FPS` : "CALIBRATING"}</span>
                </div>

                <div className="border-l border-slate-800 pl-4">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">PIPELINE LATENCY</span>
                  <span className="text-xs font-black text-white">{latency > 0 ? `${latency} ms` : "0 ms"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* STREAM PROCESSING SPECIFICATION DETAILS */}
          <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 text-left font-mono text-[10px]">
            <div className="border-b border-slate-900 pb-2 flex items-center gap-1 text-slate-300 uppercase">
              <Zap className="w-4 h-4 text-cyan-400" />
              <strong>Processing Node Ingestion Spec Map</strong>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[8px] font-bold block">Render Platform</span>
                <span className="text-white font-bold block">TypeScript ESM Thread</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[8px] font-bold block">Core Precision</span>
                <span className="text-cyan-400 font-bold block">FP32 Quantized Tensor</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[8px] font-bold block">NMS Jitter Suppress</span>
                <span className="text-white font-bold block">Active (IoU: {nmsThreshold})</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[8px] font-bold block">Frame Draw Overhead</span>
                <span className="text-red-400 font-bold block">{frameProcessingTime > 0 ? `${frameProcessingTime} ms` : "0 ms"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 3: REAL-TIME TELEMETRY & LOG LOGGER STATION (4 Cols) */}
        <div className="xl:col-span-4 space-y-6 text-left font-mono">
          
          {/* Real-time Telemetry Dashboard Spark Widgets */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-4">
            <h3 className="text-[11px] uppercase font-extrabold text-slate-450 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-400" />
              <span>3. Telemetry Monitor</span>
            </h3>

            <div className="space-y-3">
              {/* Telemetry row 1: Pipeline efficiency */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-805 border-slate-900 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">CUDA Engine Load</span>
                  <span className="text-xs font-black text-rose-450 text-rose-450 text-rose-400">{systemLoad}%</span>
                </div>
                {/* Micro mini loading bar */}
                <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${systemLoad}%` }}
                  />
                </div>
              </div>

              {/* Telemetry row 2: Isolation frequency */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-805 border-slate-900 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Current Isolation Count</span>
                  <span className="text-xs font-black text-white">{activeDetections.length} objects / frame</span>
                </div>
                <span className="text-[9px] text-slate-400">FPS Limit: 60hz</span>
              </div>

              {/* Telemetry row 3: Material conveyor movement rate */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-805 border-slate-900 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Slab Moving Velocity</span>
                  <span className="text-xs font-black text-cyan-400">
                    {sourceType === "sample" ? selectedSample.speedMps.toFixed(1) : "8.2"} m/sec
                  </span>
                </div>
                <span className="text-[8.5px] text-slate-500">Fast Forward</span>
              </div>
            </div>
          </div>

          {/* TELEMETRY ANOMALY SYSTEM LOG LIST */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3 flex flex-col justify-between h-[360px]">
            
            <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
              <h3 className="text-[11px] uppercase font-extrabold text-slate-450 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-red-400" />
                <span>Detection Event Stream</span>
              </h3>
              
              <span className="text-[8px] uppercase bg-cyan-950/40 text-cyan-400 border border-cyan-900 font-bold px-1.5 py-0.5 rounded">
                Live Pipe
              </span>
            </div>

            {/* Ingestion stream log list */}
            <div className="overflow-y-auto text-left font-mono text-[9px] space-y-1.5 h-full max-h-[260px] pr-1.5 scrollbar-thin scrollbar-thumb-slate-900">
              {detectorLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-1.5 my-auto">
                  <Terminal className="w-7 h-7 text-slate-800" />
                  <p className="max-w-[200px]">Waiting for raw material anomaly triggers...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {detectorLogs.map((log) => {
                    let sevCol = "text-emerald-452 text-emerald-400";
                    if (log.severity === "critical") sevCol = "text-red-450 font-bold text-red-400";
                    if (log.severity === "moderate") sevCol = "text-amber-450 font-bold text-amber-500";

                    return (
                      <div key={log.id} className="border-b border-slate-905 border-slate-900 pb-1 flex justify-between items-start text-[8.5px] leading-relaxed select-text selection:bg-slate-800">
                        <div className="space-y-0.5 text-left pr-2">
                          <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
                          <span className="text-white font-bold">{log.type}</span>
                          <span className="text-slate-550 mr-1 ml-1 text-slate-500">Conf:</span>
                          <strong className="text-cyan-400">{log.confidence}%</strong>
                        </div>
                        <span className={`uppercase text-[8px] font-black ${sevCol}`}>
                          {log.severity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {detectorLogs.length > 0 && (
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[8.5px] text-slate-500">
                <span>Displaying last {detectorLogs.length} entries</span>
                <button 
                  onClick={() => setDetectorLogs([])}
                  className="text-red-400 hover:text-red-350 select-none cursor-pointer"
                >
                  Clear Event Hist
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
