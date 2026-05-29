import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  Activity,
  Cpu,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Flame,
  Wrench,
  Gauge,
  TrendingUp,
  ShieldCheck,
  Server,
  Play,
  RotateCcw,
  Workflow
} from "lucide-react";

interface DigitalTwinProps {
  machineHealthScore: number;
  failureProbability: number;
  defectTrendGrowth: number;
  lineStrain: number;
  motorTemp: number;
  coolingForce: number;
  rollingSpeed: number; // dynamically linked to pdmRollingSpeed
  selectedClass: {
    id: string;
    name: string;
    baseSeverity: number;
    desc: string;
    detectionSpeed: string;
  };
  setLineStrain: (v: number) => void;
  setMotorTemp: (v: number) => void;
  setCoolingForce: (v: number) => void;
  setPdmRollingSpeed: (v: number) => void;
  setConsoleLogs?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DigitalTwin({
  machineHealthScore,
  failureProbability,
  defectTrendGrowth,
  lineStrain,
  motorTemp,
  coolingForce,
  rollingSpeed,
  selectedClass,
  setLineStrain,
  setMotorTemp,
  setCoolingForce,
  setPdmRollingSpeed,
  setConsoleLogs
}: DigitalTwinProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States for interactive simulations inside the Twin View
  const [simulationActive, setSimulationActive] = useState(true);
  const [cameraView, setCameraView] = useState<"isometric" | "top" | "side">("isometric");
  const [showLaserPlanes, setShowLaserPlanes] = useState(true);
  const [showParticleStreams, setShowParticleStreams] = useState(true);
  
  // HUD Readouts and events local to the digital twin
  const [routingLog, setRoutingLog] = useState<{ time: string; event: string; status: "prime" | "diverted" }[]>([
    { time: "14:02:15", event: "Coil segment TC-901 marked PRIMARY GRADE (100% PASS)", status: "prime" },
    { time: "14:02:02", event: "Coil segment TC-900 designated RECOUP (Crazing detected)", status: "diverted" },
    { time: "14:01:48", event: "Coil segment TC-899 marked PRIMARY GRADE (100% PASS)", status: "prime" }
  ]);

  // Keep a reference to mutable parameters for the Three.js continuous rendering loop to avoid frame re-init lag
  const paramsRef = useRef({
    rollingSpeed,
    lineStrain,
    motorTemp,
    coolingForce,
    isDefectActive: selectedClass.name !== "None (OK)" && !selectedClass.name.includes("None"),
    defectType: selectedClass.id
  });

  useEffect(() => {
    paramsRef.current = {
      rollingSpeed,
      lineStrain,
      motorTemp,
      coolingForce,
      isDefectActive: selectedClass.name !== "None (OK)" && !selectedClass.name.includes("None"),
      defectType: selectedClass.id
    };
  }, [rollingSpeed, lineStrain, motorTemp, coolingForce, selectedClass]);

  // Three.js Core WebGL setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // 1. Scene & Environment Space
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020612);
    scene.fog = new THREE.FogExp2(0x020612, 0.015);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 2. Camera Viewport Setting
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    const applyCameraAngle = (angle: "isometric" | "top" | "side") => {
      if (angle === "isometric") {
        camera.position.set(16, 12, 22);
        camera.lookAt(2, 0, 0);
      } else if (angle === "top") {
        camera.position.set(0, 24, 1);
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.set(0, 1, 25);
        camera.lookAt(0, 0, 0);
      }
    };
    applyCameraAngle(cameraView);

    // 3. Renderer Config
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // 4. Lights Setup
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    mainLight.position.set(15, 30, 15);
    scene.add(mainLight);

    // Blue/Cyan glowing scanner light
    const scannerLight = new THREE.PointLight(0x00ffff, 4, 15);
    scannerLight.position.set(0, 3, 0);
    scene.add(scannerLight);

    // Warning Red pulsing Light
    const warningLight = new THREE.PointLight(0xef4444, 0, 20);
    warningLight.position.set(4, 3, 0);
    scene.add(warningLight);

    // 5. Assets / Geometries Creation

    // Conveyor Rollers (Stand Supports)
    const rollerCount = 13;
    const rollers: THREE.Mesh[] = [];
    const rollerSpacing = 3.0; // Distance between cylinders

    const rollerGeom = new THREE.CylinderGeometry(0.8, 0.8, 11, 24);
    const rollerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
      bumpScale: 0.05
    });

    for (let i = 0; i < rollerCount; i++) {
      const roller = new THREE.Mesh(rollerGeom, rollerMat);
      // Span rollers along the conveyor path from x = -18 to x = 18
      const posX = -18 + i * rollerSpacing;
      // Cylinder is vertical by default, orient horizontally across z-axis
      roller.rotation.x = Math.PI / 2;
      roller.position.set(posX, -1.9, 0);
      scene.add(roller);
      rollers.push(roller);
    }

    // Roll Stands Housing (Heavy Cast Steel Frames)
    // Stand 1: Reduction Mill Pre-Rolling (around x = -12)
    // Stand 2: Main Finish Pass Mill (around x = -4)
    // Stand 3: Inspection Area Housing (around x = 0)
    // Stand 4: Diverter / Sorting Gate Unit (around x = 8)

    const createMillStand = (xPosition: string, name: string, isScaffolding = false) => {
      const standGroup = new THREE.Group();
      standGroup.position.x = parseFloat(xPosition);

      const frameMat = new THREE.MeshStandardMaterial({
        color: isScaffolding ? 0x0e172c : 0x1e293b,
        metalness: 0.8,
        roughness: 0.4
      });

      // Left column
      const colLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 9, 2), frameMat);
      colLeft.position.set(0, 2, -4.5);
      standGroup.add(colLeft);

      // Right column
      const colRight = colLeft.clone();
      colRight.position.set(0, 2, 4.5);
      standGroup.add(colRight);

      // Top Cap Bridge
      const topBridge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 11), frameMat);
      topBridge.position.set(0, 6.5, 0);
      standGroup.add(topBridge);

      // Add actual big rolling cylinders inside the reduction mills
      if (!isScaffolding) {
        const topRollGeom = new THREE.CylinderGeometry(1.6, 1.6, 8, 32);
        const topRollMat = new THREE.MeshStandardMaterial({
          color: 0x475569,
          metalness: 0.95,
          roughness: 0.1
        });
        const topRoll = new THREE.Mesh(topRollGeom, topRollMat);
        topRoll.rotation.x = Math.PI / 2;
        topRoll.position.set(0, 1.4, 0);
        standGroup.add(topRoll);

        const bottomRoll = topRoll.clone();
        bottomRoll.position.set(0, -1.0, 0);
        standGroup.add(bottomRoll);

        // Name Tag floating mesh inside scene
        const tagGeom = new THREE.BoxGeometry(0.8, 0.4, 3);
        const tagMat = new THREE.MeshBasicMaterial({ color: 0x0891b2 });
        const nameTag = new THREE.Mesh(tagGeom, tagMat);
        nameTag.position.set(0, 5.2, 0);
        standGroup.add(nameTag);
      }

      scene.add(standGroup);
      return standGroup;
    };

    const mill1 = createMillStand("-12", "REDUCTION_MILL_01");
    const mill2 = createMillStand("-5", "FINISHING_PASS_02");

    // Scanner Ring (Glowing laser circle unit at x = 1)
    const scannerGroup = new THREE.Group();
    scannerGroup.position.set(1.5, 0, 0);

    const ringGeom = new THREE.TorusGeometry(3.8, 0.25, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 2.0,
      metalness: 0.7,
      roughness: 0.1
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.y = Math.PI / 2; // Face along the path
    scannerGroup.add(ringMesh);

    // Laser vertical targeting line mesh
    const laserBeamGeom = new THREE.PlaneGeometry(0.1, 7.2);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const laserBeam = new THREE.Mesh(laserBeamGeom, laserBeamMat);
    laserBeam.rotation.x = Math.PI / 2; // lay flat horizontally above rollers
    laserBeam.position.set(0.01, 1.2, 0); // elevated slice
    scannerGroup.add(laserBeam);

    scene.add(scannerGroup);

    // Diverter Routing Gate Assembly (at x = 7)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(7.5, -0.6, 0);

    const pivotMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const gatePivot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.5, 16), pivotMat);
    gatePivot.position.set(0, 0, 4.2);
    gateGroup.add(gatePivot);

    const armGeom = new THREE.BoxGeometry(0.3, 1.2, 8);
    const armMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3
    });
    const gateArm = new THREE.Mesh(armGeom, armMat);
    gateArm.position.set(0, 0, 0);
    gateGroup.add(gateArm);

    // Yellow warning lines on active routing gate
    const stripeGeom = new THREE.BoxGeometry(0.32, 0.2, 7.8);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
    const gateStripe = new THREE.Mesh(stripeGeom, stripeMat);
    gateStripe.position.set(0.01, 0.3, 0);
    gateGroup.add(gateStripe);

    scene.add(gateGroup);


    // 6. METAL SEGMENTED COILS PLATFORM
    // Instead of one giant sheet, we create discrete segmented rolling blocks that travel down the line.
    // This allows accurate tracking, visual cooling transitions, laser detection triggers, & gate sorting.
    const segmentCount = 6;
    const sheetSegments: {
      mesh: THREE.Mesh;
      defectMarkerMesh: THREE.Mesh | null;
      width: number;
      startX: number;
      posX: number;
      hasDefect: boolean;
      defectType: string;
      scanned: boolean;
      sorted: boolean;
      createdAt: number;
    }[] = [];

    const sheetGeom = new THREE.BoxGeometry(3.5, 0.16, 7.8);

    const spawnSegment = (initialX: number) => {
      // Create a composite material that lets us adjust metallics vs heat emissives
      const sheetMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.28,
        metalness: 0.92,
        emissive: 0xff4400,
        emissiveIntensity: 1.2
      });

      const mesh = new THREE.Mesh(sheetGeom, sheetMat);
      mesh.position.set(initialX, -1.0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Decide if this segment should carry the simulated active defect when scanned
      const randomTrigger = Math.random() < 0.45;
      const willBeDefect = randomTrigger && paramsRef.current.isDefectActive;
      const type = willBeDefect ? paramsRef.current.defectType : "healthy";

      let defectMarkerMesh: THREE.Mesh | null = null;
      
      // If defect, create a glowing mesh indicator embedded inside the top surface
      if (willBeDefect) {
        const spotGeom = new THREE.BoxGeometry(1.2, 0.05, 1.8);
        const spotMat = new THREE.MeshBasicMaterial({
          color: 0xef4444, // glowing hot fissure
          transparent: true,
          opacity: 0.95
        });
        defectMarkerMesh = new THREE.Mesh(spotGeom, spotMat);
        // Elevate slightly above sheet surface
        defectMarkerMesh.position.set((Math.random() - 0.5) * 1.5, 0.09, (Math.random() - 0.5) * 3);
        mesh.add(defectMarkerMesh);
      }

      scene.add(mesh);

      sheetSegments.push({
        mesh,
        defectMarkerMesh,
        width: 3.5,
        startX: initialX,
        posX: initialX,
        hasDefect: willBeDefect,
        defectType: type,
        scanned: false,
        sorted: false,
        createdAt: Date.now()
      });
    };

    // Initialize segments across the active conveyor span
    for (let i = 0; i < segmentCount; i++) {
      const initX = -18 + i * 6.2;
      spawnSegment(initX);
    }


    // 7. PARTICLE SPARK SYSTEM
    // Emit cooling steam particles at Stand 2 (descaling pass)
    // Emit glowing sparks at Stand 3 (scanner pass) when a defect segment passes under

    const particleCount = 100;
    const particlesGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Initial spread
      positions[i * 3] = -5 + (Math.random() - 0.5) * 2; // Descaler center x = -5
      positions[i * 3 + 1] = 1.0;                        // Above metal plane
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;  // Width
      
      // Spray velocities downward + sideways
      velocities[i * 3] = (Math.random() - 0.5) * 1.0;
      velocities[i * 3 + 1] = -4.0 - Math.random() * 3;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2.5;

      // Color tints: Cyan steam
      particleColors[i * 3] = 0.2;
      particleColors[i * 3 + 1] = 0.8;
      particleColors[i * 3 + 2] = 1.0;
    }

    particlesGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeom.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const descalerParticles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(descalerParticles);

    // Spark particles for scan alarm triggers
    const sparkCount = 80;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = new Float32Array(sparkCount * 3);
    
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 1.5; // aligned to scanner ring at x = 1.5
      sparkPositions[i * 3 + 1] = -0.9;
      sparkPositions[i * 3 + 2] = 0;

      sparkVelocities[i * 3] = 3.0 + Math.random() * 8.0; // blast rightward
      sparkVelocities[i * 3 + 1] = 2.0 + Math.random() * 6.0; // arc upwards
      sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
    }

    sparkGeom.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xf59e0b, // Golden amber sparks
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const sparkParticles = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparkParticles);


    // 8. ANIMATED continuous Loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      if (!simulationActive) return;

      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1); // cap elapsed timestep
      lastTime = now;

      // Extract current live inputs bound from reactive states
      const speedCoeff = paramsRef.current.rollingSpeed / 12.0; // normalize normalized speed
      const activeLineSpeed = paramsRef.current.rollingSpeed;
      const forceStrain = paramsRef.current.lineStrain;
      const coreThermal = paramsRef.current.motorTemp;
      const descalerPSI = paramsRef.current.coolingForce;

      // A. Spin active rollers based on speed coeff
      rollers.forEach((r) => {
        r.rotation.y += speedCoeff * dt * 5.0; // spin speed
      });

      // Spin internal mill work rollers
      mill1.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
          child.rotation.y -= speedCoeff * dt * 3.5;
        }
      });
      mill2.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
          child.rotation.y -= speedCoeff * dt * 3.5;
        }
      });

      // Introduce micro-vibrate camera offset if stress line strain exceeds 65%
      if (forceStrain > 65) {
        camera.position.x += (Math.random() - 0.5) * 0.05 * (forceStrain / 100);
        camera.position.y += (Math.random() - 0.5) * 0.05 * (forceStrain / 100);
      }

      // Pulse Laser scanner opacity
      if (showLaserPlanes) {
        laserBeam.material.opacity = 0.4 + Math.sin(now * 0.012) * 0.25;
        // laser scan sweeps back and forth slightly
        laserBeam.position.x = Math.sin(now * 0.003) * 0.6;
      } else {
        laserBeam.material.opacity = 0.0;
      }

      // Dynamic Sorting Gate pivot targeting
      // If a defect segment is in proximity, divert gate arm angle by 35° (0.6 rad)
      let targetGateAngle = 0;
      const hasCloseDefect = sheetSegments.some(
        seg => seg.hasDefect && !seg.sorted && seg.posX > 2.0 && seg.posX < 9.5
      );
      if (hasCloseDefect) {
        targetGateAngle = Math.PI / 4.8; // pivot open
        // pulse red warning light
        warningLight.intensity = 5.0 + Math.sin(now * 0.035) * 3.0;
        warningLight.color.setHex(0xef4444);
      } else {
        targetGateAngle = 0; // remain closed straight to prime reel
        warningLight.intensity = THREE.MathUtils.lerp(warningLight.intensity, 0, 0.1);
      }
      gateGroup.rotation.y = THREE.MathUtils.lerp(gateGroup.rotation.y, targetGateAngle, 0.08);

      // B. Animate conveyor sheet segments sliding left (x = -18) to right (x = 18)
      for (let index = 0; index < sheetSegments.length; index++) {
        const seg = sheetSegments[index];
        
        // Move segment based on line speed
        seg.posX += activeLineSpeed * dt * 0.45;
        
        // Strain deflection: make plate warp slightly if strain is high
        const strainYOffset = forceStrain > 75 ? Math.sin(seg.posX * 1.5) * 0.06 : 0;
        seg.mesh.position.set(seg.posX, -1.0 + strainYOffset, 0);

        // Adjust material hot thermal color coordinates
        // Entry section from x = -18 to x = -5 cooling transition
        const material = seg.mesh.material as THREE.MeshStandardMaterial;

        if (seg.posX < -5.0) {
          // Billet is glowing hot inside entry stands
          const heatRatio = 1.0 - (seg.posX + 18) / 13; // 1 down to 0
          material.color.setHex(0xb45309); // dull bronze/orange
          material.emissive.setHex(0xff3c00);
          material.emissiveIntensity = heatRatio * 1.5 * (coreThermal / 80);
        } else {
          // Cooled down slate metallic plate post descaler pass
          material.color.setHex(0x475569); // Slate grey steel
          material.emissive.setHex(0x000000);
          material.emissiveIntensity = 0;
        }

        // C. Stand 3 Laser Ring Inspection Trigger
        // Scanner lies at x = 1.5
        if (!seg.scanned && seg.posX >= 1.3 && seg.posX <= 1.8) {
          seg.scanned = true;
          
          if (seg.hasDefect) {
            // Trigger Golden amber sparks in the scene!
            const sparkPositionsAttr = sparkParticles.geometry.attributes.position as THREE.BufferAttribute;
            for (let pIdx = 0; pIdx < sparkCount; pIdx++) {
              sparkPositionsAttr.setXYZ(pIdx, 1.5, -0.9, (Math.random() - 0.5) * 4);
            }
            sparkPositionsAttr.needsUpdate = true;

            // Push an operational alert into the routing log
            const eventCode = `TC-${Math.floor(100 + Math.random() * 899)}-DEF`;
            const alertMsg = `AUTONOMOUS VERDICT: Segment ${eventCode} failed scan. Detected structural '${seg.defectType.toUpperCase()}'! Redirecting to Sorting Bed Loop.`;
            
            setRoutingLog(prev => [
              { time: new Date().toLocaleTimeString('en-US', { hour12: false }), event: alertMsg, status: "diverted" },
              ...prev.slice(0, 8)
            ]);

            if (setConsoleLogs) {
              setConsoleLogs(prev => [
                `[${new Date().toISOString().substring(11,19)}] AI-TWIN-INTERLOCK: Laser scanner flag defect on active segment ${eventCode}. Conveyor gate alert triggered.`,
                ...prev
              ]);
            }
          } else {
            // Log successful healthy sequence scan
            const passCode = `TC-${Math.floor(100 + Math.random() * 899)}-OK`;
            const passMsg = `TELEMETRY PASS: Segment ${passCode} cleared scan with 99.4% confidence (0 faults). Routing to primary prime storage.`;
            setRoutingLog(prev => [
              { time: new Date().toLocaleTimeString('en-US', { hour12: false }), event: passMsg, status: "prime" },
              ...prev.slice(0, 8)
            ]);
          }
        }

        // Sparks decay animation
        if (seg.hasDefect && seg.scanned && seg.posX > 1.5 && seg.posX < 4.0) {
          const sparkPositionsAttr = sparkParticles.geometry.attributes.position as THREE.BufferAttribute;
          for (let pIdx = 0; pIdx < sparkCount; pIdx++) {
            const currentX = sparkPositionsAttr.getX(pIdx);
            const currentY = sparkPositionsAttr.getY(pIdx);
            const currentZ = sparkPositionsAttr.getZ(pIdx);
            
            // Apply speed to sparkles
            sparkPositionsAttr.setXYZ(
              pIdx,
              currentX + sparkVelocities[pIdx * 3] * dt * 0.5,
              currentY + sparkVelocities[pIdx * 3 + 1] * dt * 0.45 - 9.8 * dt * 0.1, // gravity decay
              currentZ + sparkVelocities[pIdx * 3 + 2] * dt * 0.5
            );
          }
          sparkPositionsAttr.needsUpdate = true;
          sparkMat.opacity = Math.max(0, sparkMat.opacity - dt * 0.25);
        } else if (seg.posX >= 4.0) {
          sparkMat.opacity = 1.0; // reset opacity for next possible defect trigger
        }

        // D. Sorting / Routing Junction trigger (at x = 7)
        if (!seg.sorted && seg.posX >= 7.0 && seg.posX <= 8.5) {
          seg.sorted = true;

          // Physically pivot or elevate the routed segment off the standard sequence line
          if (seg.hasDefect) {
            // Divert down towards recovery storage bin
            // Shift translation animation
            const segmentMeshRef = seg.mesh;
            const animateDivert = () => {
              if (segmentMeshRef.position.x < 18.0) {
                segmentMeshRef.position.z += 0.18; // slide sideways
                segmentMeshRef.rotation.z -= 0.015; // pitch downwards
                requestAnimationFrame(animateDivert);
              }
            };
            animateDivert();
          }
        }

        // Recycle segments that slide past bounds (x = 18.0)
        if (seg.posX > 18.0) {
          seg.posX = -18.0;
          seg.scanned = false;
          seg.sorted = false;
          
          // Re-evaluate defect state to keep line continuously dynamic
          const currentIsDefectActive = paramsRef.current.isDefectActive;
          const randomTrigger = Math.random() < 0.45;
          const willBeDefect = randomTrigger && currentIsDefectActive;
          
          seg.hasDefect = willBeDefect;
          seg.defectType = willBeDefect ? paramsRef.current.defectType : "healthy";

          // recreate or remove defect spot mesh children
          if (seg.defectMarkerMesh) {
            seg.mesh.remove(seg.defectMarkerMesh);
            seg.defectMarkerMesh = null;
          }

          if (willBeDefect) {
            const spotGeom = new THREE.BoxGeometry(1.2, 0.05, 1.8);
            const spotMat = new THREE.MeshBasicMaterial({
              color: 0xef4444, // glowing hot fissure
              transparent: true,
              opacity: 0.95
            });
            seg.defectMarkerMesh = new THREE.Mesh(spotGeom, spotMat);
            seg.defectMarkerMesh.position.set((Math.random() - 0.5) * 1.5, 0.09, (Math.random() - 0.5) * 3);
            seg.mesh.add(seg.defectMarkerMesh);
          }
        }
      }

      // E. Continuous Descaling water-jet particles animation (at x = -5)
      if (showParticleStreams && descalerPSI > 40) {
        const pPositions = descalerParticles.geometry.attributes.position as THREE.BufferAttribute;
        const speed = descalerPSI / 80.0;
        
        for (let idx = 0; idx < particleCount; idx++) {
          let y = pPositions.getY(idx);
          let x = pPositions.getX(idx);
          let z = pPositions.getZ(idx);

          y += velocities[idx * 3 + 1] * dt * speed;
          x += velocities[idx * 3] * dt * 0.4;
          z += velocities[idx * 3 + 2] * dt * 0.4;

          // Recycle particle if it hits rollers or sheet boundary (y < -0.9)
          if (y < -0.95) {
            y = 3.5 + Math.random() * 1.5; // push back up above nozzle bars
            x = -5 + (Math.random() - 0.5) * 1.2;
            z = (Math.random() - 0.5) * 7.5;
          }

          pPositions.setXYZ(idx, x, y, z);
        }
        pPositions.needsUpdate = true;
        descalerParticles.visible = true;
      } else {
        descalerParticles.visible = false;
      }

      // Render
      renderer.render(scene, camera);
    };

    // Begin Animation Loop
    animate();

    // 9. Resize handler wrapping
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      
      const targetW = Math.max(newW, 400);
      const targetH = Math.max(newH, 300);

      renderer.setSize(targetW, targetH);
      camera.aspect = targetW / targetH;
      camera.updateProjectionMatrix();
    });
    
    resizeObserver.observe(container);

    // Initial draw-flush
    renderer.render(scene, camera);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      ambientLight.dispose();
      mainLight.dispose();
      scannerLight.dispose();
      warningLight.dispose();
      rollerGeom.dispose();
      rollerMat.dispose();
      sheetGeom.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
    };
  }, [simulationActive, cameraView, showLaserPlanes, showParticleStreams]);

  return (
    <div id="cyber_digital_twin_container" className="space-y-6">
      
      {/* 3D RENDER INTERFACE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main 3D WebGL Canvas Frame (8 Columns) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl relative min-h-[480px]">
          
          {/* Header Overlay HUD Controls */}
          <div className="flex justify-between items-center bg-slate-900/[0.45] border border-slate-900 px-3.5 py-2.5 rounded-xl">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                <h4 className="text-[10px] font-mono tracking-widest text-cyan-400 font-extrabold uppercase">
                  CYBER-PHYSICAL TWIN SIMULATION
                </h4>
              </div>
              <h3 className="text-xs font-bold text-slate-100 mt-1 font-mono">
                Standalone Hot Strip Rolling Stand 3 Diagnostics
              </h3>
            </div>

            {/* Camera Perspective Angle Switcher HUD button row */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase mr-1 hidden sm:inline">Camera:</span>
              <button
                onClick={() => setCameraView("isometric")}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                  cameraView === "isometric" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800" : "bg-slate-950 border border-slate-900 text-slate-500"
                }`}
              >
                Isometric
              </button>
              <button
                onClick={() => setCameraView("top")}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                  cameraView === "top" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800" : "bg-slate-950 border border-slate-900 text-slate-500"
                }`}
              >
                Top Ortho
              </button>
              <button
                onClick={() => setCameraView("side")}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                  cameraView === "side" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800" : "bg-slate-950 border border-slate-900 text-slate-500"
                }`}
              >
                Side Cross
              </button>
            </div>
          </div>

          {/* Interactive Floating Telemetry Indicators Layer over WebGL Viewport */}
          <div ref={containerRef} className="relative w-full aspect-[22/11] bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-inner shrink-0 leading-normal">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Neon floating readout left margin label overlays */}
            <div className="absolute top-4 left-4 pointer-events-none space-y-2.5">
              <div className="bg-slate-950/80 border border-slate-900 px-3 py-2 rounded-lg font-mono text-[9px] text-slate-400 space-y-1 backdrop-blur-md">
                <span className="text-slate-500 uppercase font-extrabold text-[8px] block">ROLL FEED VELOCITY</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-cyan-400 text-lg font-bold">{rollingSpeed.toFixed(1)}</span>
                  <span>m/s</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 px-3 py-2 rounded-lg font-mono text-[9px] text-slate-400 space-y-1 backdrop-blur-md">
                <span className="text-slate-500 uppercase font-extrabold text-[8px] block">ROLLER TEMPERATURE</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${motorTemp > 80 ? "text-red-400" : "text-slate-200"}`}>{motorTemp}°C</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 px-3 py-2 rounded-lg font-mono text-[9px] text-slate-400 space-y-1 backdrop-blur-md">
                <span className="text-slate-500 uppercase font-extrabold text-[8px] block">SPRAY MANIFOLD</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-emerald-400 text-lg font-bold">{coolingForce}</span>
                  <span>PSI</span>
                </div>
              </div>
            </div>

            {/* Real-time scan alarm neon indicator right overlay */}
            <div className="absolute top-4 right-4 pointer-events-none space-y-2 text-right">
              <div className="bg-slate-950/85 border border-slate-900 p-3 rounded-xl backdrop-blur-md max-w-[180px] leading-normal shadow-lg">
                <span className="text-[8px] font-mono text-slate-500 uppercase block font-extrabold">Active Target Model</span>
                <span className="text-xs font-mono font-bold text-white block mt-0.5 mt-1">{selectedClass.name}</span>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      selectedClass.name === "None (OK)" ? "bg-emerald-400" : "bg-cyan-400 animate-pulse"
                    }`}
                    style={{ width: selectedClass.name === "None (OK)" ? "100%" : `${selectedClass.baseSeverity * 3.5}%` }}
                  />
                </div>
                <span className="text-[7.5px] font-mono text-slate-500 uppercase block mt-1.5">
                  {selectedClass.name === "None (OK)" ? "NO ACTIONS SPECIFIED" : `HAZARD CRITERIA ACTIVE`}
                </span>
              </div>

              {/* Routing Junction visual status override card */}
              <div className="bg-slate-950/80 border border-slate-900 px-3 py-2 rounded-lg font-mono text-[8.5px] text-slate-400 text-left space-y-1 backdrop-blur-md ml-auto max-w-[150px]">
                <div className="flex items-center gap-1 text-[8px] text-slate-500 uppercase font-bold">
                  <Workflow className="w-3 h-3 text-cyan-400" />
                  <span>Conveyor Sorting</span>
                </div>
                <span className="text-slate-200 block mt-0.5">
                  Type: <strong className="text-cyan-405 text-cyan-400 font-bold">Automatic Diversion</strong>
                </span>
                <span className="text-[7.5px] text-slate-500 uppercase block">Active Pivot angle: 45°</span>
              </div>
            </div>

            {/* Pause/Resume overlay if deactivated */}
            {!simulationActive && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center text-center p-6 space-y-3 backdrop-blur-sm">
                <AlertTriangle className="w-9 h-9 text-amber-500 animate-bounce" />
                <span className="text-sm font-mono font-bold text-white uppercase">THREE.JS DEV ENGINE STALLED</span>
                <p className="text-xs text-slate-400 max-w-sm">
                  Web-assembly rendering thread has been manually suspended to throttle local CPU and memory overhead allocations.
                </p>
                <button
                  onClick={() => setSimulationActive(true)}
                  className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Live Thread</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Diagnostics Toggle Button Strip overlay bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSimulationActive(!simulationActive)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold transition flex items-center gap-1.5 ${
                  simulationActive ? "bg-slate-900 border-slate-700 text-slate-350 hover:bg-slate-800" : "bg-amber-950/40 border-amber-900/60 text-amber-400"
                }`}
              >
                {simulationActive ? "Freeze WebGL" : "Unfreeze WebGL"}
              </button>

              <button
                onClick={() => setShowLaserPlanes(!showLaserPlanes)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold transition ${
                  showLaserPlanes ? "bg-cyan-950/40 border-cyan-900/50 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                Laser Guide Header
              </button>

              <button
                onClick={() => setShowParticleStreams(!showParticleStreams)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold transition ${
                  showParticleStreams ? "bg-cyan-950/40 border-cyan-900/50 text-cyan-405 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                Steam Jet Particles
              </button>
            </div>

            <span className="text-[9px] font-mono text-slate-600 uppercase">
              Shader rendering: <strong>Level-2 Shader (Anisotropic enabled)</strong>
            </span>
          </div>

        </div>

        {/* Live Stand Control Interface Overlay (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          
          <div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white font-mono">
                Interactive Line Controls
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
              Adjust mill parameters in real-time. Tweak rolls, thermal descalers, or line load factors dynamically within the virtual physical loop.
            </p>

            <div className="space-y-4 font-mono text-xs">
              
              {/* CONTROL SLIDER: STAND ROLL SPEED */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">⚡ Roll Feed Line Speed</span>
                  <strong className="text-cyan-400">{rollingSpeed.toFixed(1)} m/s</strong>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="20.0"
                  step="0.5"
                  value={rollingSpeed}
                  onChange={(e) => setPdmRollingSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[8px] text-slate-650 text-slate-500">
                  <span>Threading Speed (3 m/s)</span>
                  <span>Max Sequence (20 m/s)</span>
                </div>
              </div>

              {/* CONTROL SLIDER: ROLLER LINE STRAIN */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">📏 Vertical Roll Stand Strain</span>
                  <strong className={`${lineStrain > 65 ? "text-amber-400" : "text-cyan-400"}`}>{lineStrain}%</strong>
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
                <div className="flex justify-between text-[8px] text-slate-650 text-slate-500">
                  <span>Balanced (25%)</span>
                  <span>High Friction Overload (70%)</span>
                </div>
              </div>

              {/* CONTROL SLIDER: MOTOR CORE HEAT */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">🌡️ Mill Reducer Temp</span>
                  <strong className={`${motorTemp > 80 ? "text-red-400" : "text-cyan-400"}`}>{motorTemp}°C</strong>
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
                <div className="flex justify-between text-[8px] text-slate-650 text-slate-500">
                  <span>Nominal Ambient (45°C)</span>
                  <span>Safety Peak Threshold (95°C)</span>
                </div>
              </div>

              {/* CONTROL SLIDER: WATER DESCALING PSI */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">💧 Descaler Header Spray</span>
                  <strong className="text-emerald-400">{coolingForce} PSI</strong>
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
                <div className="flex justify-between text-[8px] text-slate-650 text-slate-500">
                  <span>Low Pressure Flow (40 PSI)</span>
                  <span>Turbulent Blast (120 PSI)</span>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-[#050812] border border-slate-900 p-3.5 rounded-xl space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-extrabold flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Quick Presets:</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-[9.5px]">
              <button
                onClick={() => {
                  setLineStrain(25);
                  setMotorTemp(45);
                  setCoolingForce(100);
                  setPdmRollingSpeed(11.5);
                }}
                className="bg-cyan-950/20 hover:bg-cyan-900/30 border border-cyan-900/40 text-cyan-400 px-2.5 py-1.5 rounded font-mono font-bold transition uppercase"
              >
                Stable Nominal Pass
              </button>
              <button
                onClick={() => {
                  setLineStrain(78);
                  setMotorTemp(92);
                  setCoolingForce(50);
                  setPdmRollingSpeed(18.0);
                }}
                className="bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 px-2.5 py-1.5 rounded font-mono font-bold transition uppercase"
              >
                Heavy Billet Stress
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* DETECTED ANOMALIES & SORTING GATE EVENT LEDGER (FULL SEGMENT LOGS) */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Industrial Fault Diagnostics & Auto-Trigger Scheduler</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Real-time feed monitoring system capturing defects scanned at Stand 3 and routing to physical sorting platforms.
            </p>
          </div>

          <span className="text-[9px] font-mono font-bold uppercase text-slate-450 text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
            JAMS-MILL STATION 3 INTEGRATED
          </span>
        </div>

        {/* Grid panel detailing live stats overlays */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-3.5 bg-[#050811] border border-slate-900 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-slate-550 text-slate-550 text-slate-500 block">Mechanical Integrity</span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <strong className={`text-xl ${machineHealthScore > 80 ? "text-emerald-400" : "text-amber-400"}`}>{machineHealthScore}%</strong>
            </div>
          </div>

          <div className="p-3.5 bg-[#050811] border border-slate-900 rounded-xl space-y-1 border-x border-slate-900">
            <span className="text-[8px] font-mono uppercase text-slate-550 text-slate-500 block">Failure Risk</span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <strong className={`text-xl ${failureProbability > 60 ? "text-red-400" : "text-cyan-400"}`}>{failureProbability}%</strong>
            </div>
          </div>

          <div className="p-3.5 bg-[#050811] border border-slate-900 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-slate-550 text-slate-500 block">Trend Gradient</span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <strong className="text-xl text-emerald-400">+{defectTrendGrowth}% MA</strong>
            </div>
          </div>

          <div className="p-3.5 bg-[#050811] border border-slate-900 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-slate-550 text-slate-500 block">Selected Defect Model</span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <strong className="text-xs uppercase text-slate-300 font-bold max-w-[130px] truncate block">{selectedClass.name}</strong>
            </div>
          </div>

        </div>

        {/* Animated event console ledger */}
        <div className="space-y-2">
          <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-widest font-bold">
            Real-time Conveyor Sorting & Signal Feed Ledger
          </span>

          <div className="bg-[#040810] border border-slate-900 rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-2 font-mono scrollbar-thin select-none">
            {routingLog.map((log, i) => (
              <div 
                key={i} 
                className={`text-[9.5px] p-2 rounded border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition-all ${
                  log.status === "prime" 
                    ? "bg-emerald-950/10 border-emerald-950/20 text-emerald-300/90" 
                    : "bg-red-950/15 border-red-950/20 text-red-300/95"
                }`}
              >
                <div className="flex items-center gap-2 text-left leading-normal">
                  <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                  <span className="flex-1">{log.event}</span>
                </div>

                <span className={`text-[8px] font-bold px-2 py-0.5 rounded shrink-0 uppercase border ${
                  log.status === "prime"
                    ? "bg-emerald-950 text-emerald-400 border-emerald-900/50"
                    : "bg-red-950 text-red-400 border-red-900/40"
                }`}>
                  {log.status === "prime" ? "Routed Prime" : "Diverted Bin"}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[9.5px] font-sans text-slate-400 leading-normal bg-slate-900/30 border border-slate-900 p-3 rounded-lg text-justify">
            🧠 <strong>Digital Twin Synchronization Note:</strong> Dynamic routing actions are verified directly within Level-1 PLC trigger channels in real-time. Signals are mapped to the automated hot sorting junction gate.
          </div>

        </div>

      </div>

    </div>
  );
}
