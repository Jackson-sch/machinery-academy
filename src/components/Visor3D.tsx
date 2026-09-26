import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Info, Layers, Maximize2, AlertCircle, Eye, Wrench } from 'lucide-react';

interface Hotspot {
  id: string;
  title: string;
  part: string;
  description: string;
  critico: boolean;
  frecuencia: string;
  coords?: { x: number; y: number; z: number };
}

interface Props {
  machineType: 'excavadora' | 'cargador' | 'retroexcavadora';
  machineTitle: string;
  hotspots: Hotspot[];
}

export default function Visor3D({ machineType, machineTitle, hotspots }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0] || null);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'specs'>('3d');

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 3.5, 6);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go underground
    controls.minDistance = 2.5;
    controls.maxDistance = 14;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    dirLight.position.set(8, 12, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-6, 4, -6);
    scene.add(fillLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0xf59e0b, 0x1f293d);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Materials
    materialsRef.current = [];
    const matYellow = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.25,
    });
    const matDark = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.6,
    });
    const matMetal = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.85,
    });
    const matHydraulic = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.95,
    });
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.45,
    });
    materialsRef.current.push(matYellow, matDark, matMetal, matHydraulic);

    // Machine Group
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // Build procedural machine representations
    if (machineType === 'excavadora') {
      // TRACKS
      const trackLeftGeo = new THREE.BoxGeometry(0.5, 0.6, 3.4);
      const trackRightGeo = new THREE.BoxGeometry(0.5, 0.6, 3.4);
      const trackLeft = new THREE.Mesh(trackLeftGeo, matDark);
      trackLeft.position.set(-1.1, 0.3, 0);
      const trackRight = new THREE.Mesh(trackRightGeo, matDark);
      trackRight.position.set(1.1, 0.3, 0);
      machineGroup.add(trackLeft, trackRight);

      // SPROCKETS & ROLLERS
      const trackBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 2.8), matDark);
      trackBase.position.set(0, 0.35, 0);
      machineGroup.add(trackBase);

      // CABIN & ENGINE HOUSING (UPPERSTRUCTURE)
      const bodyGeo = new THREE.BoxGeometry(2.2, 1.2, 2.6);
      const body = new THREE.Mesh(bodyGeo, matYellow);
      body.position.set(0, 1.15, -0.2);
      machineGroup.add(body);

      // CABIN
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 1.1), matGlass);
      cabin.position.set(-0.6, 1.6, 0.5);
      machineGroup.add(cabin);

      // COUNTERWEIGHT
      const cweight = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.7), matDark);
      cweight.position.set(0, 1.15, -1.6);
      machineGroup.add(cweight);

      // BOOM (PLUMA)
      const boom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.8, 0.4), matYellow);
      boom.position.set(0.3, 2.2, 0.9);
      boom.rotation.x = -Math.PI / 4;
      machineGroup.add(boom);

      // HYDRAULIC CYLINDER
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6), matHydraulic);
      cylinder.position.set(0.3, 1.7, 0.6);
      cylinder.rotation.x = -Math.PI / 3.5;
      machineGroup.add(cylinder);

      // ARM (BALANCÍN)
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.3), matYellow);
      arm.position.set(0.3, 2.6, 2.3);
      arm.rotation.x = Math.PI / 6;
      machineGroup.add(arm);

      // BUCKET (CUCHARÓN)
      const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.7), matDark);
      bucket.position.set(0.3, 1.3, 2.9);
      bucket.rotation.x = -Math.PI / 5;
      machineGroup.add(bucket);
    } else if (machineType === 'cargador') {
      // WHEELS
      const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelPositions = [
        [-1.3, 0.65, 1.4],
        [1.3, 0.65, 1.4],
        [-1.3, 0.65, -1.4],
        [1.3, 0.65, -1.4],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, matDark);
        wheel.position.set(x, y, z);
        machineGroup.add(wheel);
      });

      // CHASSIS
      const rearChassis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 2.0), matYellow);
      rearChassis.position.set(0, 1.1, -1.0);
      machineGroup.add(rearChassis);

      const frontChassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.8), matYellow);
      frontChassis.position.set(0, 0.95, 1.0);
      machineGroup.add(frontChassis);

      // CABIN
      const loaderCabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.3, 1.2), matGlass);
      loaderCabin.position.set(0, 1.9, -0.2);
      machineGroup.add(loaderCabin);

      // LIFT ARMS
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 2.4), matYellow);
      armL.position.set(-0.7, 1.2, 1.8);
      armL.rotation.x = -Math.PI / 8;
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 2.4), matYellow);
      armR.position.set(0.7, 1.2, 1.8);
      armR.rotation.x = -Math.PI / 8;
      machineGroup.add(armL, armR);

      // BUCKET
      const loaderBucket = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.0), matDark);
      loaderBucket.position.set(0, 0.6, 2.8);
      machineGroup.add(loaderBucket);
    } else {
      // RETROEXCAVADORA
      // WHEELS (small front, huge rear)
      const frontWheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 20);
      frontWheelGeo.rotateZ(Math.PI / 2);
      const rearWheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.55, 24);
      rearWheelGeo.rotateZ(Math.PI / 2);

      const fw1 = new THREE.Mesh(frontWheelGeo, matDark);
      fw1.position.set(-1.0, 0.45, 1.5);
      const fw2 = new THREE.Mesh(frontWheelGeo, matDark);
      fw2.position.set(1.0, 0.45, 1.5);

      const rw1 = new THREE.Mesh(rearWheelGeo, matDark);
      rw1.position.set(-1.1, 0.75, -1.0);
      const rw2 = new THREE.Mesh(rearWheelGeo, matDark);
      rw2.position.set(1.1, 0.75, -1.0);
      machineGroup.add(fw1, fw2, rw1, rw2);

      // TRACTOR BODY
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 2.6), matYellow);
      body.position.set(0, 1.0, 0.2);
      machineGroup.add(body);

      // CABIN
      const retroCabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.3, 1.2), matGlass);
      retroCabin.position.set(0, 1.8, -0.4);
      machineGroup.add(retroCabin);

      // FRONT BUCKET
      const frontBucket = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.8), matDark);
      frontBucket.position.set(0, 0.45, 2.6);
      machineGroup.add(frontBucket);

      // BACKHOE BOOM (REAR)
      const rearBoom = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 0.3), matYellow);
      rearBoom.position.set(0, 1.8, -2.0);
      rearBoom.rotation.x = Math.PI / 5;
      machineGroup.add(rearBoom);

      // STABILIZERS
      const stabL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2), matDark);
      stabL.position.set(-1.3, 0.6, -1.1);
      stabL.rotation.z = Math.PI / 7;
      const stabR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2), matDark);
      stabR.position.set(1.3, 0.6, -1.1);
      stabR.rotation.z = -Math.PI / 7;
      machineGroup.add(stabL, stabR);
    }

    // HOTSPOT 3D MARKERS (PULSATING SPHERES IN SCENE)
    const hotspotMarkers: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);

    hotspots.forEach((hs, idx) => {
      const coords = hs.coords || { x: (idx - 1) * 0.9, y: 1.5, z: (idx % 2 === 0 ? 1 : -1) * 1.2 };
      const hsMat = new THREE.MeshBasicMaterial({
        color: hs.critico ? 0xef4444 : 0xf59e0b,
      });
      const marker = new THREE.Mesh(sphereGeo, hsMat);
      marker.position.set(coords.x, coords.y, coords.z);
      marker.userData = { hotspot: hs };
      scene.add(marker);
      hotspotMarkers.push(marker);
    });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle pulse on hotspots
      hotspotMarkers.forEach((m, i) => {
        const scale = 1 + Math.sin(elapsedTime * 4 + i) * 0.25;
        m.scale.set(scale, scale, scale);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [machineType, hotspots]);

  // Toggle wireframe
  const handleToggleWireframe = () => {
    setIsWireframe(!isWireframe);
    materialsRef.current.forEach((m) => {
      m.wireframe = !isWireframe;
    });
  };

  // Focus on specific hotspot camera
  const focusHotspot = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    if (!controlsRef.current || !cameraRef.current) return;
    const coords = hs.coords || { x: 0, y: 1.5, z: 0 };
    // Move controls target to component coords
    controlsRef.current.target.set(coords.x, coords.y, coords.z);
    cameraRef.current.position.set(coords.x + 2.5, coords.y + 1.5, coords.z + 2.5);
    controlsRef.current.update();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Viewer Header */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
          <h3 className="font-bold text-white text-base tracking-wide">
            Visor Técnico 3D: {machineTitle}
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            WebGL 360°
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleToggleWireframe}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isWireframe
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Alternar vista de estructura alámbrica"
          >
            <Layers className="w-3.5 h-3.5" />
            {isWireframe ? 'Sólido' : 'Wireframe'}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[460px]">
        {/* WebGL Canvas Container */}
        <div className="lg:col-span-8 relative min-h-[440px] bg-slate-950">
          <div ref={containerRef} className="w-full h-full min-h-[440px] cursor-grab active:cursor-grabbing" />

          {/* Overlay Navigation Help */}
          <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] text-slate-500 bg-slate-950/80 px-2.5 py-1.5 rounded-md border border-slate-800 flex items-center gap-2">
            <span>🖱️ Arrastrar: Rotar 360°</span>
            <span>•</span>
            <span>Rueda: Zoom</span>
            <span>•</span>
            <span>Click Derecho: Desplazar</span>
          </div>

          {/* Hotspot Pills on Top of Canvas */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-auto">
            {hotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => focusHotspot(hs)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md ${
                  selectedHotspot?.id === hs.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-105'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${hs.critico ? 'bg-red-400' : 'bg-amber-400'}`}
                />
                {hs.title}
              </button>
            ))}
          </div>
        </div>

        {/* Hotspot Detail Sidebar */}
        <div className="lg:col-span-4 p-5 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
          {selectedHotspot ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono text-slate-400">
                  {selectedHotspot.part}
                </span>
                {selectedHotspot.critico ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/80">
                    PUNTO CRÍTICO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/50 text-amber-300 border border-amber-800/40">
                    PREVENTIVO
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-white mb-2">
                {selectedHotspot.title}
              </h4>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 mb-4">
                <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Frecuencia de Verificación
                </div>
                <div className="text-xs text-slate-300">{selectedHotspot.frecuencia}</div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Procedimiento de Inspección:
                </div>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-slate-800/60">
                  {selectedHotspot.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Si detectas anomalías en esta zona durante la inspección visual, no enciendas el equipo y reporta la orden de trabajo a mantenimiento.
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              Selecciona un punto interactivo para ver la ficha técnica detallada.
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Módulo de Entrenamiento Técnico para Operadores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
