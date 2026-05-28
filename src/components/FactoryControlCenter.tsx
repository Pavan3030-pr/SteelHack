import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Monitor,
  Video,
  Activity,
  Cpu,
  Tv,
  Wifi,
  WifiOff,
  Bell,
  AlertTriangle,
  CheckCircle,
  Network,
  Settings,
  RefreshCw,
  Sliders,
  Database,
  BarChart2,
  TrendingUp,
  Flame,
  Radio,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Lock,
  Volume2,
  VolumeX,
  Gauge
} from "lucide-react";

// Types for Camera Feeds
interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  fps: number;
  latency: number; // in ms
  edgeNode: string;
  resolution: string;
  exposure: number;
  filterMode: "normal" | "thermal" | "edge" | "grayscale";
  detectedCount: number;
}

// Types for Edge AI Nodes
interface EdgeNode {
  id: string;
  name: string;
  device: string;
  status: "ACTIVE" | "MAINTENANCE" | "STALLED";
  gpuLoad: number;
  temp: number;
  uptime: string;
  inferenceTime: number; // in ms
  throughput: number; // frames/sec
}

// Types for Live Alerts
interface IntelligentAlert {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  severity: "CRITICAL" | "HIGH" | "WARNING" | "INFO";
  type: string;
  description: string;
  operatorAction: string;
  isAcknowledged: boolean;
}

export default function FactoryControlCenter() {
  // 1. STATE DEEPLY LINKED TO LIVE CYBER-PHYSICAL SIMULATIONS
  const [cameras, setCameras] = useState<CameraFeed[]>([
    {
      id: "CAM-01",
      name: "Billet Hot Entrance Pass",
      location: "Stand 1 - Reduction Mill Upper",
      status: "ONLINE",
      fps: 30,
      latency: 4,
      edgeNode: "ORIN-NID-A1",
      resolution: "1920x1080",
      exposure: 72,
      filterMode: "thermal",
      detectedCount: 142
    },
    {
      id: "CAM-02",
      name: "Upper Shearing Inspection Deck",
      location: "Stand 3 - Laser High-Res Core",
      status: "ONLINE",
      fps: 60,
      latency: 2,
      edgeNode: "ORIN-NID-A2",
      resolution: "2560x1440",
      exposure: 54,
      filterMode: "normal",
      detectedCount: 89
    },
    {
      id: "CAM-03",
      name: "Cooling Spool Exit Reel",
      location: "Stand 5 - Air Cooldown Loop",
      status: "ONLINE",
      fps: 30,
      latency: 6,
      edgeNode: "ORIN-NID-B1",
      resolution: "1920x1080",
      exposure: 45,
      filterMode: "grayscale",
      detectedCount: 31
    },
    {
      id: "CAM-04",
      name: "Gate Diverter Sorting Junction",
      location: "Stand 6 - Mechanical Pivot Bed",
      status: "ONLINE",
      fps: 24,
      latency: 8,
      edgeNode: "ORIN-NID-B2",
      resolution: "1280x720",
      exposure: 60,
      filterMode: "edge",
      detectedCount: 12
    }
  ]);

  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>([
    {
      id: "ORIN-NID-A1",
      name: "Node-A1: Hot Entry",
      device: "NVIDIA Jetson AGX Orin 64GB",
      status: "ACTIVE",
      gpuLoad: 78,
      temp: 54,
      uptime: "142 hrs",
      inferenceTime: 6.8,
      throughput: 120
    },
    {
      id: "ORIN-NID-A2",
      name: "Node-A2: Optical Laser",
      device: "NVIDIA IGX Orin Industrial",
      status: "ACTIVE",
      gpuLoad: 89,
      temp: 61,
      uptime: "96 hrs",
      inferenceTime: 2.1,
      throughput: 520
    },
    {
      id: "ORIN-NID-B1",
      name: "Node-B1: Exit Reel",
      device: "NVIDIA Jetson AGX Orin 64GB",
      status: "ACTIVE",
      gpuLoad: 41,
      temp: 48,
      uptime: "8 hrs",
      inferenceTime: 12.4,
      throughput: 90
    },
    {
      id: "ORIN-NID-B2",
      name: "Node-B2: Sort Gate",
      device: "NVIDIA Jetson Orin Nano 8GB",
      status: "ACTIVE",
      gpuLoad: 68,
      temp: 52,
      uptime: "210 hrs",
      inferenceTime: 18.2,
      throughput: 45
    }
  ]);

  const [alerts, setAlerts] = useState<IntelligentAlert[]>([
    {
      id: "ALT-904",
      timestamp: "14:15:32",
      cameraId: "CAM-02",
      cameraName: "Upper Shearing Inspection Deck",
      severity: "CRITICAL",
      type: "Severe Roll Scratches",
      description: "Continuously repeating longitudinal line scoring exceeding 4.2mm structural threshold width.",
      operatorAction: "Intervene on Stand 3 tension screws & inspect scrap reduction index on ROI view.",
      isAcknowledged: false
    },
    {
      id: "ALT-903",
      timestamp: "14:12:11",
      cameraId: "CAM-01",
      cameraName: "Billet Hot Entrance Pass",
      severity: "HIGH",
      type: "Billet Slag Inclusion",
      description: "Elevated thermal cluster indicative of foreign slag deposits bound inside grain structure.",
      operatorAction: "Engage Stand 1 high-power descaling sprays to flush oxides.",
      isAcknowledged: false
    },
    {
      id: "ALT-902",
      timestamp: "14:04:45",
      cameraId: "CAM-04",
      cameraName: "Gate Diverter Sorting Junction",
      severity: "WARNING",
      type: "Gate Actuator Lag",
      description: "Solenoid coil current spikes detected. Pneumatic valve response latency flagged at +120ms.",
      operatorAction: "Schedule maintenance sweep on magnetic recoil spring block.",
      isAcknowledged: true
    }
  ]);

  // UI Interactive Controls
  const [selectedCamId, setSelectedCamId] = useState<string>("CAM-02");
  const [wsConnected, setWsConnected] = useState(true);
  const [wsLatencyMsg, setWsLatencyMsg] = useState("Connected to Factory Core WebSocket Hub");
  const [wsPingTime, setWsPingTime] = useState(4.2);
  const [enableSound, setEnableSound] = useState(false);
  const [showNodeSystemConfig, setShowNodeSystemConfig] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Simulated live counters
  const [frameTick, setFrameTick] = useState(0);

  // 2. LIVE SIMULATION LOOP (MOCK REAL-TIME WEBSOCKET FLUX)
  useEffect(() => {
    let wsInterval: NodeJS.Timeout;
    if (wsConnected) {
      wsInterval = setInterval(() => {
        // A. Update live parameters of Edge Nodes and Cameras
        setEdgeNodes((prev) =>
          prev.map((node) => {
            const loadFluctuation = (Math.random() - 0.5) * 6;
            const tempFluctuation = (Math.random() - 0.5) * 2;
            const gpuTarget = Math.max(20, Math.min(98, node.gpuLoad + loadFluctuation));
            const tempTarget = Math.max(35, Math.min(90, node.temp + tempFluctuation));
            return {
              ...node,
              gpuLoad: parseFloat(gpuTarget.toFixed(1)),
              temp: Math.round(tempTarget)
            };
          })
        );

        setCameras((prev) =>
          prev.map((cam) => {
            const cameraTick = Math.random();
            const countInc = cameraTick > 0.85 ? 1 : 0;
            // Introduce temporary random latency spike inside camera
            const randomLatency = cam.id === "CAM-02" ? 2 + (Math.random() * 0.5) : cam.latency + (Math.random() - 0.5) * 1.5;
            return {
              ...cam,
              detectedCount: cam.detectedCount + countInc,
              latency: parseFloat(Math.max(1, Math.min(40, randomLatency)).toFixed(1))
            };
          })
        );

        // B. Generate simulated real-time defect alerts (via fake WebSocket pipe)
        if (Math.random() > 0.94) {
          const randomCams = ["CAM-01", "CAM-02", "CAM-03", "CAM-04"];
          const camId = randomCams[Math.floor(Math.random() * randomCams.length)];
          const targetCam = cameras.find((c) => c.id === camId) || cameras[1];

          const defectTypes = [
            { type: "Surface Pit Cavity", severity: "HIGH" as const, desc: "Scale depression detected on carbon grain borders.", act: "Increase cooling descaler flow psi." },
            { type: "Roll Scratch Line", severity: "CRITICAL" as const, desc: "Squeeze pass abrasion marks repeating across the strip surface.", act: "Check rolling stand vertical strain load alignment." },
            { type: "Crease Inlay Fold", severity: "HIGH" as const, desc: "Tension looper buckle resulting in slight vertical fold overlap.", act: "Regulate looper motor synchronization immediately." },
            { type: "Edge Splay Tear", severity: "WARNING" as const, desc: "Irregular billet edge cracks indicating cooling temperature gradients.", act: "Engage sidebar edge induction heating elements." }
          ];

          const randomDefect = defectTypes[Math.floor(Math.random() * defectTypes.length)];
          const newAlert: IntelligentAlert = {
            id: `ALT-${Math.floor(905 + Math.random() * 900)}`,
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
            cameraId: camId,
            cameraName: targetCam.name,
            severity: randomDefect.severity,
            type: randomDefect.type,
            description: randomDefect.desc,
            operatorAction: randomDefect.act,
            isAcknowledged: false
          };

          setAlerts((prev) => [newAlert, ...prev.slice(0, 15)]);

          // Simulated console message to notify operator
          setWsLatencyMsg(`WebSocket Event: Detected ${randomDefect.type} on stream ${camId}`);
          setWsPingTime(1.5 + Math.random() * 5);

          // Audio notification if system alarm enabled
          if (enableSound) {
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.type = "sine";
              osc.frequency.setValueAtTime(newAlert.severity === "CRITICAL" ? 880 : 440, audioCtx.currentTime);
              gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            } catch (e) {
              // block browser sandbox limits
            }
          }
        }

        setFrameTick((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(wsInterval);
  }, [wsConnected, enableSound, cameras]);

  // 3. SELECTION SPECIFICS
  const activeCamera = useMemo(() => {
    return cameras.find((c) => c.id === selectedCamId) || cameras[1];
  }, [cameras, selectedCamId]);

  const totalInspectedFaults = useMemo(() => {
    return cameras.reduce((acc, c) => acc + c.detectedCount, 0);
  }, [cameras]);

  const averageLatency = useMemo(() => {
    return parseFloat((cameras.reduce((acc, c) => acc + c.latency, 0) / cameras.length).toFixed(1));
  }, [cameras]);

  // Clean-up clear alerts
  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isAcknowledged: true } : a))
    );
  };

  return (
    <div id="factory_control_center_hud" className="space-y-6">
      
      {/* HUD HEADER AND PLATFORM STATUS STRIP */}
      <div className="bg-[#050814] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 w-full h-[3px]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-950/45 rounded text-cyan-400 border border-cyan-800/20">
                <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
              </div>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-100 font-mono">
                Smart-Factory Edge Control Center & Core Node Hub
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed font-sans">
              Consolidated command-and-control platform aggregating 4x active optical camera feeds, telemetry from Jetson Orin localized nodes, and direct real-time WebSocket messaging alerts.
            </p>
          </div>

          {/* Web Socket Latency / Ping Indicator */}
          <div className="flex items-center gap-4 bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl self-start lg:self-auto shrink-0 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? "bg-emerald-400 animate-ping" : "bg-red-400"}`} />
              <button
                onClick={() => setWsConnected(!wsConnected)}
                className={`font-mono text-[9px] font-bold uppercase transition hover:underline ${
                  wsConnected ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {wsConnected ? "WS: LINKED" : "WS: STALLED"}
              </button>
            </div>
            <div className="hidden sm:block text-slate-500 border-l border-slate-900 pl-3">
              <span>Ping: <strong className="text-cyan-455 text-cyan-400">{wsPingTime.toFixed(1)}ms</strong></span>
            </div>
            <div className="hidden md:block max-w-[200px] truncate text-slate-400 border-l border-slate-900 pl-3" title={wsLatencyMsg}>
              {wsLatencyMsg}
            </div>
          </div>
        </div>
      </div>

      {/* FACTORY LEVEL SYSTEM STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono text-slate-505 text-slate-500 block">TOTAL INSPECTED VOLUME</span>
            <h3 className="text-xl font-bold font-mono text-slate-100">
              {(14280 + totalInspectedFaults).toLocaleString()} Strips
            </h3>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono text-slate-505 text-slate-500 block">MEDIAN EDGE LATENCY</span>
            <h3 className="text-xl font-bold font-mono text-cyan-400">
              {averageLatency} ms
            </h3>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono text-slate-505 text-slate-500 block">EDGE SYSTEM UP TIME</span>
            <h3 className="text-xl font-bold font-mono text-emerald-400">
              100% Operational
            </h3>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-405 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono text-slate-505 text-slate-500 block">SOUND ALARM PANEL</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className={`text-xs font-mono font-bold ${enableSound ? "text-amber-400" : "text-slate-500"}`}>
                {enableSound ? "POLLED AUDIBLE" : "MUTED"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEnableSound(!enableSound)}
            className={`p-2 rounded-lg border transition ${
              enableSound ? "bg-amber-950/20 border-amber-900/40 text-amber-400" : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            {enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* CENTRAL 4-CAMERA MULTI-FEED MONITOR & SELECTED FEED CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MULTI-CAMERA STREAM CHANNELS (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-white font-mono font-mono">
                  Continuous Video Inspection Matrices
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase mr-1">ACTIVE:</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-800/20 px-2 py-0.5 rounded">
                  {cameras.filter(c => c.status === "ONLINE").length} Online
                </span>
              </div>
            </div>

            {/* CAMERA STREAMS GRID (2 x 2 LAYOUT) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cameras.map((cam) => {
                const isSelected = selectedCamId === cam.id;
                
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamId(cam.id)}
                    className={`bg-slate-950 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative group flex flex-col justify-between p-3 h-[200px] ${
                      isSelected
                        ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500"
                        : "border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/[0.1]"
                    }`}
                  >
                    {/* Top strip banner overlay over feed */}
                    <div className="flex justify-between items-center bg-slate-950/90 border border-slate-900 px-2.5 py-1.5 rounded-lg z-10">
                      <div className="flex items-center gap-1.5 max-w-[140px]">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-slate-300 font-bold truncate" title={cam.name}>
                          {cam.id} · {cam.name}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 font-bold bg-slate-900 px-1.5 py-0.5 rounded">
                        {cam.fps} FPS
                      </span>
                    </div>

                    {/* VIRTUALIZED CAMERA STREAM CANVAS OR SCI-FI VECTOR INTERFACE */}
                    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4">
                      
                      {/* Thermal/Edge filter styles based on filter selection */}
                      {cam.filterMode === "thermal" && (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-600/10 via-purple-950/15 to-red-500/10 opacity-70 absolute top-0 left-0 pointer-events-none" />
                      )}
                      {cam.filterMode === "edge" && (
                        <div className="w-full h-full bg-slate-950 absolute top-0 left-0 border border-slate-900/80 pointer-events-none" />
                      )}
                      
                      {/* Interactive Bounding box representation for CAM-02 Upper inspector shearing */}
                      {cam.id === "CAM-02" && (
                        <div className="border border-red-500/60 bg-red-950/10 rounded px-2.5 py-1.5 pointer-events-none absolute text-[8.5px] font-mono text-red-400 space-y-1 z-10 animate-pulse" style={{ top: "45%", left: "28%" }}>
                          <div className="flex justify-between gap-2.5 items-center">
                            <strong>[SURFACE_SCRATCH_SURGE]</strong>
                            <span>98.6%</span>
                          </div>
                          <div className="w-16 h-1 border-t border-dashed border-red-500" />
                          <span>Length: 14.5mm</span>
                        </div>
                      )}

                      {/* Stand 1 inclusion thermal hotspots */}
                      {cam.id === "CAM-01" && (
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 animate-ping absolute pointer-events-none" style={{ top: "25%", right: "32%" }} />
                      )}

                      {/* Moving conveyor visualization helper (grid waves) */}
                      <div className="w-full h-[60px] relative overflow-hidden flex flex-col justify-center select-none font-mono text-[8px] text-slate-800">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[1px] bg-slate-900 w-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>

                      {/* Camera Overlay Status Label */}
                      <span className="text-[10px] font-mono text-slate-650 tracking-wider text-slate-600 block mt-1 uppercase z-10">
                        {cam.filterMode.toUpperCase()} STREAM FEED
                      </span>

                    </div>

                    {/* Bottom Status metadata overlay wrapper */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 bg-slate-950/85 px-2 py-1 rounded-md z-10">
                      <span className="text-[8.5px] font-mono text-slate-500">
                        LATENCY: <strong>{cam.latency}ms</strong>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        Captured: <strong className="text-cyan-400 font-extrabold">{cam.detectedCount}</strong>
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Simulated Frame Stream Control parameters */}
            <div className="bg-[#050811] p-3 rounded-xl flex items-center justify-between text-[10px] font-mono border border-slate-900 flex-wrap gap-4">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Track:</span>
                <strong className="text-slate-350 text-slate-300 ml-1">{activeCamera.id} ({activeCamera.name})</strong>
              </div>

              {/* Adjust exposure / settings of this camera dynamically */}
              <div className="flex items-center gap-4 text-slate-400">
                <span>Exposure: <strong>{activeCamera.exposure}%</strong></span>
                <span>Active Core Node: <strong className="text-cyan-400 font-mono">{activeCamera.edgeNode}</strong></span>
              </div>
            </div>

          </div>

          {/* ACTIVE SELECTED CAMERA FINE-CONTRAL INSPECTOR COMPONENT */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-cyan-500/80 w-[4px] h-full" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-950 pb-4">
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-mono uppercase text-slate-505 text-slate-500 select-none block tracking-widest font-extrabold">Active Channel Focus</span>
                <h4 className="text-xs font-bold text-slate-100 font-mono">
                  {activeCamera.id} — {activeCamera.name} ({activeCamera.location})
                </h4>
              </div>

              {/* Exposure presets and configuration togglers */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto font-mono text-[9px]">
                <span className="text-slate-500 uppercase font-bold mr-1">Filter Modifiers:</span>
                {["normal", "thermal", "edge", "grayscale"].map((filter) => {
                  return (
                    <button
                      key={filter}
                      onClick={() => {
                        setCameras(prev => prev.map(c => c.id === activeCamera.id ? { ...c, filterMode: filter as any } : c));
                      }}
                      className={`px-2.5 py-1 rounded capitalize font-bold transition ${
                        activeCamera.filterMode === filter 
                          ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800"
                          : "bg-slate-900 text-slate-400 border border-transparent hover:text-slate-200"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dual column: Selected stream analytics chart mockup + slider calibration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              
              <div className="space-y-4 text-left font-mono text-[11px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>✨ Virtualized Sensor Aperture Exposer</span>
                    <strong className="text-cyan-403 text-cyan-400">{activeCamera.exposure}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={activeCamera.exposure}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCameras(prev => prev.map(c => c.id === activeCamera.id ? { ...c, exposure: val } : c));
                    }}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="p-3.5 bg-[#050812] border border-slate-900 rounded-xl space-y-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] text-slate-500">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Optical Resolution & Edge Performance</span>
                  </div>
                  <span>Theoretical Input Grid: <strong>{activeCamera.resolution} pixels</strong></span>
                  <p className="text-[9px] text-slate-500">
                    Processing feed utilizes customized industrial RGB/Mono CMOS arrays. Neural networks map bounding box matrices to downstream PLC diverters.
                  </p>
                </div>
              </div>

              {/* Edge AI Node Link Status overview */}
              {(() => {
                const node = edgeNodes.find(n => n.id === activeCamera.edgeNode) || edgeNodes[0];
                return (
                  <div className="bg-[#040810] border border-slate-900 rounded-xl p-4 space-y-3 font-mono text-[10.5px]">
                    <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                      <span className="text-slate-500 text-[9px] font-bold uppercase">Linked Processing Edge Core</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded text-[8.5px]">ACTIVE</span>
                    </div>

                    <div className="space-y-1 text-left text-slate-400">
                      <div className="flex justify-between">
                        <span>Physical Host Device:</span>
                        <strong className="text-slate-200">{node.device}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>GPU Load Utilization:</span>
                        <strong className="text-cyan-400">{node.gpuLoad}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Module Silicon Temp:</span>
                        <strong className={`${node.temp > 60 ? "text-amber-500" : "text-slate-200"}`}>{node.temp}°C</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Core Latency Sweep:</span>
                        <strong className="text-emerald-450 text-emerald-400">{node.inferenceTime} ms</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: RECENT LIVE CRITICAL ALERTS BOARD & WS DEEP MONITORING (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* CRITICAL WEBSOCKET ALERT PANEL */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl flex flex-col justify-between">
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-100 font-mono">
                    Live Industrial Intelligent Alerts
                  </h3>
                </div>

                <button
                  onClick={() => setAlerts([])}
                  className="text-[9px] font-mono text-slate-500 hover:text-slate-350 cursor-pointer transition uppercase"
                  title="Wipe logged alarms from localized operators memory"
                >
                  CLEAR ALL
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3.5 border border-dashed border-slate-900 rounded-xl select-none">
                  <div className="p-2.5 bg-slate-900 rounded-full text-emerald-400 shadow-sm border border-emerald-950">
                    <CheckCircle className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400">NOMINAL STATE COMPLETED</span>
                  <p className="text-[9px] leading-relaxed max-w-sm">
                    No active fault inclusions or looper scratches detected across the 4x camera matrix systems currently.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin">
                  {alerts.map((alert) => {
                    const isCrit = alert.severity === "CRITICAL";
                    const isHigh = alert.severity === "HIGH";
                    const isWarn = alert.severity === "WARNING";
                    
                    const borderCol = isCrit 
                      ? "border-red-900/60 bg-red-950/10" 
                      : isHigh 
                      ? "border-amber-905/50 border-amber-800/40 bg-amber-950/10" 
                      : "border-slate-900 bg-slate-950";

                    const badgeCol = isCrit 
                      ? "bg-red-950 text-red-400 border-red-900/50 animate-pulse" 
                      : isHigh
                      ? "bg-amber-950 text-amber-400 border-amber-900/30"
                      : "bg-slate-900 text-slate-400 border-slate-800";

                    return (
                      <div
                        key={alert.id}
                        className={`border rounded-xl p-3.5 text-left font-mono text-[10px] space-y-2.5 relative transition-all duration-200 ${
                          alert.isAcknowledged ? "opacity-50 border-slate-900 bg-slate-950" : borderCol
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400">{alert.timestamp} · {alert.id}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${badgeCol}`}>
                            {alert.severity}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <strong className="block text-slate-100 text-xs tracking-tight">{alert.type}</strong>
                          <span className="text-[8.5px] text-cyan-400 block uppercase">Feed: {alert.cameraId} · {alert.cameraName}</span>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{alert.description}</p>
                        </div>

                        {/* Direct actionable steps for operator */}
                        <div className="bg-[#050810]/70 border border-slate-900 p-2.5 rounded-lg text-[9px] text-slate-400 leading-normal">
                          <strong className="text-slate-350 block text-slate-300">💡 EXPECTED ACTIONS:</strong>
                          <span>{alert.operatorAction}</span>
                        </div>

                        {/* Interactive ack button */}
                        <div className="pt-2 border-t border-slate-900/50 flex justify-end gap-2 text-[9px]">
                          {!alert.isAcknowledged && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="text-cyan-400 font-bold hover:underline"
                            >
                              ACKNOWLEDGE ALARM
                            </button>
                          )}
                          <button
                            onClick={() => clearAlert(alert.id)}
                            className="text-slate-500 hover:text-slate-300 transition"
                          >
                            DISMISS
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* EDGE AI SENSING INTENSITY CALIBRATION BOX */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <Network className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-100 font-mono">
                Active Edge Node System Matrix
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-[10px]">
              {edgeNodes.map((node) => {
                return (
                  <div key={node.id} className="p-3 bg-[#050811] border border-slate-900 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <strong className="text-slate-200">{node.name}</strong>
                      <span className="text-emerald-405 text-emerald-400 font-bold uppercase text-[8.5px]">
                        ● {node.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 border-t border-slate-950 pt-2 text-left leading-tight">
                      <span>Throughput: <strong className="text-slate-300">{node.throughput} FPS</strong></span>
                      <span>Latency: <strong className="text-cyan-400">{node.inferenceTime}ms</strong></span>
                      <span>Temp: <strong className={node.temp > 60 ? "text-amber-500" : "text-slate-300"}>{node.temp}°C</strong></span>
                      <span>Uptime: <strong className="text-slate-300">{node.uptime}</strong></span>
                    </div>

                    {/* GPU usage indicator bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-500">
                        <span>GPU COMPUTE CORES</span>
                        <span>{node.gpuLoad}% Load</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-900">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                          style={{ width: `${node.gpuLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER METADATA SYSTEM ARCHITECTURE BANNER */}
      <div className="bg-[#050812] border border-slate-900 p-4.5 rounded-2xl font-mono text-[10px] text-slate-500 text-left leading-relaxed">
        ⛓️ <strong>Edge AI & WebSocket Pipeline Note:</strong> Automated OpenCV frame grabbers serialize visual inputs from cameras and route them directly to ONNX models compiled with NVIDIA TensorRT. Alarm thresholds are piped backwards into continuous looping PLC actuators to align scrap reduction and prevent metal sheet fractures seamlessly.
      </div>

    </div>
  );
}
