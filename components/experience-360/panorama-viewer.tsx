"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  PANORAMA_SCENES,
  type PanoramaScene,
  type PanoramaHotspot,
  type HotspotInfoContent,
  type HotspotTourContent,
  type HotspotSecretContent,
  type RegionalSecretCatalogItem
} from "@/data/experience-360";
import { ambienceAudio } from "@/lib/audio-ambience";
import { MiniRadarMap } from "./mini-radar-map";
import { HotspotItem } from "./hotspot-item";
import { InfoModal } from "./info-modal";
import { TourModal } from "./tour-modal";
import { SecretsModal } from "./secrets-modal";
import { PhotoModeModal } from "./photo-mode-modal";

interface ProjectedHotspot {
  hotspot: PanoramaHotspot;
  screenX: number;
  screenY: number;
  isVisible: boolean;
}

interface PanoramaViewerProps {
  initialSceneId?: string;
  isStandalone?: boolean; // se for na página dedicada ou na seção da home
  onCloseStandalone?: () => void;
  scenes?: PanoramaScene[];
  secretsCatalog?: RegionalSecretCatalogItem[];
  totalSecretsCount?: number;
}

export function PanoramaViewer({
  initialSceneId,
  isStandalone = false,
  onCloseStandalone,
  scenes: propScenes,
  secretsCatalog,
  totalSecretsCount
}: PanoramaViewerProps) {
  const scenes = propScenes && propScenes.length > 0 ? propScenes : PANORAMA_SCENES;
  const defaultSceneId = initialSceneId || scenes[0]?.id || "ilha-dos-frades";

  // Estado da Cena Atual
  const [currentSceneId, setCurrentSceneId] = useState(defaultSceneId);
  const currentScene =
    scenes.find((s) => s.id === currentSceneId) || scenes[0];


  // Referências DOM
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Referências Three.js
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Estados de Controle de Câmera (Pitch / Yaw / FOV com amortecimento suave)
  const cameraStateRef = useRef({
    lat: currentScene.initialView.pitch,
    lon: currentScene.initialView.yaw,
    targetLat: currentScene.initialView.pitch,
    targetLon: currentScene.initialView.yaw,
    fov: currentScene.initialView.fov,
    targetFov: currentScene.initialView.fov,
    isUserInteracting: false,
    pointerStartX: 0,
    pointerStartY: 0,
    startLon: 0,
    startLat: 0
  });

  // Estados de UI reativos
  const isAutoRotateRef = useRef(true);
  const isGyroActiveRef = useRef(false);

  const [currentYawDisplay, setCurrentYawDisplay] = useState(
    currentScene.initialView.yaw
  );
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isLoadingScene, setIsLoadingScene] = useState(false);
  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);

  // Modais de Interação
  const [selectedInfo, setSelectedInfo] = useState<HotspotInfoContent | null>(null);
  const [selectedTour, setSelectedTour] = useState<HotspotTourContent | null>(null);
  const [discoveredSecret, setDiscoveredSecret] = useState<HotspotSecretContent | null>(null);
  const [foundSecrets, setFoundSecrets] = useState<string[]>([]);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Trava de scroll da página de fundo e tecla Escape quando qualquer modal estiver aberto
  const isAnyModalOpen = Boolean(selectedInfo || selectedTour || discoveredSecret || capturedPhotoUrl);
  const isAnyModalOpenRef = useRef(isAnyModalOpen);

  useEffect(() => {
    isAnyModalOpenRef.current = isAnyModalOpen;
  }, [isAnyModalOpen]);

  useEffect(() => {
    if (!isAnyModalOpen) return;

    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedInfo(null);
        setSelectedTour(null);
        setDiscoveredSecret(null);
        setCapturedPhotoUrl(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyModalOpen]);

  // Esconder a dica de interação inicial após 5s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  // Carregador de Textura com transição suave e liberação de memória GPU
  const loadTexture = useCallback((imageUrl: string) => {
    setIsLoadingScene(true);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        if (sphereMaterialRef.current) {
          if (sphereMaterialRef.current.map) {
            sphereMaterialRef.current.map.dispose();
          }
          sphereMaterialRef.current.map = texture;
          sphereMaterialRef.current.needsUpdate = true;
        }
        setIsLoadingScene(false);
      },
      undefined,
      (err) => {
        console.error("Erro ao carregar textura equirretangular:", err);
        setIsLoadingScene(false);
      }
    );
  }, []);

  // Projeção dos hotspots do espaço esférico 3D para coordenadas de tela 2D
  const updateProjectedHotspots = useCallback(
    (container: HTMLDivElement, camera: THREE.PerspectiveCamera) => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const currentHotspots = currentScene.hotspots;
      const projected: ProjectedHotspot[] = currentHotspots.map((h) => {
        const phi = THREE.MathUtils.degToRad(90 - h.pitch);
        const theta = THREE.MathUtils.degToRad(h.yaw);

        // Ponto na superfície da esfera
        const pos = new THREE.Vector3(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta)
        );

        // Projeta com a câmera
        const screenVector = pos.clone().project(camera);

        // Se z > 1, está atrás do plano da câmera
        const isVisible = screenVector.z < 1;
        const screenX = (screenVector.x * 0.5 + 0.5) * width;
        const screenY = (-(screenVector.y * 0.5) + 0.5) * height;

        return {
          hotspot: h,
          screenX,
          screenY,
          isVisible
        };
      });

      setProjectedHotspots(projected);
    },
    [currentScene.hotspots]
  );

  // Inicialização do Three.js
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Criar Three Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Criar Câmera
    const camera = new THREE.PerspectiveCamera(
      currentScene.initialView.fov,
      width / height,
      1,
      1100
    );
    cameraRef.current = camera;

    // 3. Criar Esfera invertida para o Panorama 360
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Inverte os vértices para visualização interna

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    sphereMaterialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sphereMeshRef.current = mesh;

    // 4. Criar WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true // Necessário para capturar screenshots do Modo Fotógrafo
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. Carregar primeira textura
    loadTexture(currentScene.image);

    // 6. Loop de Renderização e Animação com throttling de re-renders para mobile/iOS
    let lastTime = performance.now();
    let lastUiUpdateTime = 0;
    let lastUpdatedYaw = -999;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const state = cameraStateRef.current;

      // Autorrotação suave se o usuário não estiver arrastando
      if (isAutoRotateRef.current && !state.isUserInteracting && !isGyroActiveRef.current) {
        state.targetLon += 3.2 * delta;
      }

      // Interpolação suave (damping)
      const damping = 0.085;
      const prevLon = state.lon;
      const prevLat = state.lat;
      const prevFov = state.fov;

      state.lon += (state.targetLon - state.lon) * damping;
      state.lat += (state.targetLat - state.lat) * damping;
      state.fov += (state.targetFov - state.fov) * damping;

      // Atualiza FOV da câmera para zoom
      if (camera.fov !== state.fov) {
        camera.fov = state.fov;
        camera.updateProjectionMatrix();
      }

      // Converte coordenadas esféricas em vetor de mira 3D
      const phi = THREE.MathUtils.degToRad(90 - state.lat);
      const theta = THREE.MathUtils.degToRad(state.lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      // Limita atualizações de UI do React (Radar e Hotspots) a no máximo 25 FPS para não travar o iOS Safari
      const hasMoved =
        Math.abs(state.lon - prevLon) > 0.04 ||
        Math.abs(state.lat - prevLat) > 0.04 ||
        Math.abs(state.fov - prevFov) > 0.04;

      if ((now - lastUiUpdateTime > 40 && hasMoved) || lastUiUpdateTime === 0) {
        lastUiUpdateTime = now;

        if (Math.abs(state.lon - lastUpdatedYaw) > 1.0) {
          lastUpdatedYaw = state.lon;
          setCurrentYawDisplay(state.lon);
        }

        updateProjectedHotspots(container, camera);
      }
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container) container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Troca de Cena
  const handleSelectScene = useCallback(
    (sceneId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene || scene.id === currentSceneId) return;

      setCurrentSceneId(scene.id);
      loadTexture(scene.image);

      // Posiciona a câmera nas coordenadas ideais da nova cena
      const state = cameraStateRef.current;
      state.targetLat = scene.initialView.pitch;
      state.targetLon = scene.initialView.yaw;
      state.targetFov = scene.initialView.fov;
    },
    [currentSceneId, loadTexture, scenes]
  );

  // Cliques em Hotspots
  const handleHotspotClick = (hotspot: PanoramaHotspot) => {
    if (hotspot.type === "navigation" && hotspot.targetSceneId) {
      handleSelectScene(hotspot.targetSceneId);
    } else if (hotspot.type === "info" && hotspot.infoContent) {
      setSelectedInfo(hotspot.infoContent);
    } else if (hotspot.type === "tour" && hotspot.tourContent) {
      setSelectedTour(hotspot.tourContent);
    } else if (hotspot.type === "secret" && hotspot.secretContent) {
      // Registra segredo na lista de encontrados e toca chime
      if (!foundSecrets.includes(hotspot.secretContent.secretId)) {
        setFoundSecrets((prev) => [...prev, hotspot.secretContent!.secretId]);
      }
      ambienceAudio.playDiscoveryChime();
      setDiscoveredSecret(hotspot.secretContent);
    }
  };

  const touchDirectionDeterminedRef = useRef(false);
  const isHorizontalDragRef = useRef(false);

  // Controles de Ponteiro / Drag com Mouse & Touch
  const handlePointerDown = (e: React.PointerEvent) => {
    setShowHint(false);
    const state = cameraStateRef.current;
    state.isUserInteracting = true;
    state.pointerStartX = e.clientX;
    state.pointerStartY = e.clientY;
    state.startLon = state.targetLon;
    state.startLat = state.targetLat;
    touchDirectionDeterminedRef.current = false;
    isHorizontalDragRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = cameraStateRef.current;
    if (!state.isUserInteracting) return;

    const diffX = e.clientX - state.pointerStartX;
    const diffY = e.clientY - state.pointerStartY;

    if (e.pointerType === "touch" && !touchDirectionDeterminedRef.current) {
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        touchDirectionDeterminedRef.current = true;
        isHorizontalDragRef.current = Math.abs(diffX) >= Math.abs(diffY);
      }
    }

    // Se no celular o movimento for predominantemente vertical, não bloqueia o scroll da página
    if (e.pointerType === "touch" && touchDirectionDeterminedRef.current && !isHorizontalDragRef.current) {
      state.isUserInteracting = false;
      return;
    }

    // Sensibilidade de rotação
    const sensitivity = 0.16;
    state.targetLon = state.startLon - diffX * sensitivity;
    // Limita o pitch vertical entre -85 e +85 graus
    state.targetLat = Math.max(-85, Math.min(85, state.startLat + diffY * sensitivity));
  };

  const handlePointerUp = () => {
    cameraStateRef.current.isUserInteracting = false;
    touchDirectionDeterminedRef.current = false;
    isHorizontalDragRef.current = false;
  };

  // Zoom via Roda do Mouse (exclusivo para a imagem 360, impedindo o scroll da página enquanto o cursor estiver na área 360)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Se qualquer modal estiver aberto, não altera zoom e não interfere no scroll do modal
      if (isAnyModalOpenRef.current) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-modal-container='true'], [data-modal-card='true']")) {
        return;
      }

      // Impede o scroll nativo da página e SmoothScroll
      e.preventDefault();
      e.stopPropagation();

      setShowHint(false);
      const state = cameraStateRef.current;
      const zoomDelta = e.deltaY * 0.04;
      // FOV entre 35° (zoom in) e 95° (zoom out)
      state.targetFov = Math.max(35, Math.min(95, state.targetFov + zoomDelta));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Botões de Zoom
  const handleZoom = (direction: "in" | "out") => {
    const state = cameraStateRef.current;
    const step = 15;
    if (direction === "in") {
      state.targetFov = Math.max(35, state.targetFov - step);
    } else {
      state.targetFov = Math.min(95, state.targetFov + step);
    }
  };

  // Resetar Visão Inicial da Cena
  const handleResetView = () => {
    const state = cameraStateRef.current;
    state.targetLat = currentScene.initialView.pitch;
    state.targetLon = currentScene.initialView.yaw;
    state.targetFov = currentScene.initialView.fov;
  };

  // Toggle Áudio Ambiente
  const handleToggleAudio = () => {
    const isPlaying = ambienceAudio.toggleMute();
    setIsAudioPlaying(isPlaying);
  };

  // Toggle Tela Cheia
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Erro ao ativar fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Listener para mudança de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Controle de Autorrotação (sincronizado imediatamente com a ref)
  const handleToggleAutoRotate = () => {
    setIsAutoRotate((prev) => {
      const next = !prev;
      isAutoRotateRef.current = next;
      return next;
    });
  };

  // Sensor de Orientação de Dispositivo / Giroscópio
  const handleToggleGyro = async () => {
    if (isGyroActiveRef.current) {
      setIsGyroActive(false);
      isGyroActiveRef.current = false;
      return;
    }

    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === "function"
    ) {
      try {
        const response = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (response === "granted") {
          setIsGyroActive(true);
          isGyroActiveRef.current = true;
        } else {
          alert("Permissão para sensor de orientação não concedida.");
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsGyroActive(true);
      isGyroActiveRef.current = true;
    }
  };

  useEffect(() => {
    if (!isGyroActive) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null) return;
      const state = cameraStateRef.current;
      // Alpha: rotação ao redor do eixo Z (0-360)
      // Beta: rotação ao redor do eixo X (-180 a 180)
      state.targetLon = -event.alpha;
      state.targetLat = Math.max(-85, Math.min(85, event.beta - 45));
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [isGyroActive]);

  // Modo Fotógrafo: Captura snapshot do WebGL canvas
  const handleCapturePhoto = () => {
    if (!rendererRef.current) return;
    // Garante que o renderer renderize o frame fresco antes do toDataURL
    if (sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    const canvas = rendererRef.current.domElement;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedPhotoUrl(dataUrl);
  };

  return (
    <div
      ref={containerRef}
      data-native-scroll="true"
      data-360-viewer="true"
      className={[
        "relative w-full overflow-hidden select-none bg-slate-950 font-sans",
        isStandalone
          ? "h-screen h-[100dvh] min-h-[500px]"
          : "h-[calc(100vh-6.5rem)] h-[calc(100dvh-6.5rem)] min-h-[380px] sm:min-h-[420px] max-h-[520px] sm:max-h-[560px] lg:max-h-[580px] rounded-2xl sm:rounded-[2.5rem] shadow-surf border border-white/20"
      ].join(" ")}
    >
      {/* 1. Canvas 3D do Three.js com suporte a touch e mouse */}
      <div
        ref={canvasContainerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ touchAction: "pan-y" }}
      />

      {/* 2. Camada de Hotspots Interativos (Overlays HTML) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedHotspots.map(({ hotspot, screenX, screenY, isVisible }) => (
          <HotspotItem
            key={hotspot.id}
            hotspot={hotspot}
            screenX={screenX}
            screenY={screenY}
            isVisible={isVisible}
            isSecretFound={
              hotspot.secretContent
                ? foundSecrets.includes(hotspot.secretContent.secretId)
                : false
            }
            onClick={handleHotspotClick}
          />
        ))}
      </div>

      {/* 3. Indicador de Carregamento de Cena */}
      {isLoadingScene && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-30 pointer-events-none transition-opacity">
          <div className="flex flex-col items-center gap-3 text-cyan-300">
            <span className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold tracking-wider uppercase text-white">
              Navegando para {currentScene.title}...
            </span>
          </div>
        </div>
      )}

      {/* 4. Dica de Interação Inicial (Desvanece após 5s) */}
      {showHint && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 animate-pulse px-4 max-w-sm">
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-center shadow-2xl">
            <span className="text-xl sm:text-2xl">↔️</span>
            <p className="font-semibold text-xs sm:text-sm">
              Arraste para olhar em todas as direções (360°)
            </p>
            <p className="text-[10px] text-slate-300">
              Use pinça ou scroll para zoom • Toque nos ícones para interagir
            </p>
          </div>
        </div>
      )}

      {/* 5. Header Superior Flutuante (Título do Local + Badges + Botão Fechar se Standalone) */}
      <div
        className={[
          "absolute left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-start justify-between gap-2 sm:gap-4 pointer-events-none z-20 transition-all duration-300",
          isStandalone ? "top-20 sm:top-28 lg:top-32" : "top-2.5 sm:top-4"
        ].join(" ")}
      >
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-white shadow-xl max-w-[55%] sm:max-w-md">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
              360º
            </span>
            <span className="text-[10px] sm:text-xs text-slate-300 truncate">
              {currentScene.locationName}
            </span>
          </div>
          <h2 className="text-xs sm:text-lg md:text-xl font-bold tracking-tight text-white mt-0.5 truncate sm:text-clip">
            {currentScene.title}
          </h2>
          <p className="text-xs text-slate-300 hidden md:block mt-0.5">
            {currentScene.subtitle}
          </p>
        </div>

        {/* Canto Superior Direito: Radar Map & Fechar Standalone */}
        <div className="flex flex-col items-end gap-2 sm:gap-3 pointer-events-none">
          {isStandalone && onCloseStandalone && (
            <button
              type="button"
              onClick={onCloseStandalone}
              className="pointer-events-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition shadow-lg flex items-center gap-1.5"
            >
              <span>✕ Sair</span>
            </button>
          )}

          {/* Mini Radar Map */}
          <MiniRadarMap
            currentScene={currentScene}
            currentYaw={currentYawDisplay}
            onSelectScene={handleSelectScene}
          />
        </div>
      </div>

      {/* 6. Barra de Controles e Seletor de Cenas na Parte Inferior */}
      <div className="absolute bottom-2.5 sm:bottom-4 inset-x-2 sm:inset-x-4 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none z-20">
        {/* Barra de Miniaturas das Cenas (Carrossel Rápido de Destinos) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-2xl max-w-full overflow-x-auto scrollbar-none">
          {scenes.map((scene) => {
            const isSelected = scene.id === currentScene.id;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(scene.id)}
                className={[
                  "relative group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-200 shrink-0 focus:outline-none",
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-lg"
                    : "hover:bg-white/10 text-white/90 hover:text-white"
                ].join(" ")}
              >
                <div
                  className={[
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden border transition shrink-0",
                    isSelected ? "border-slate-950" : "border-white/30"
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scene.previewThumb}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] sm:text-xs whitespace-nowrap">{scene.title}</span>
              </button>
            );
          })}
        </div>

        {/* HUD de Controles: Zoom, Autorrotação, Áudio, Foto, Tela Cheia, Giroscópio */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-2xl text-white max-w-full overflow-x-auto scrollbar-none">
          {/* Autorrotação */}
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            className={[
              "p-2 rounded-xl transition flex items-center justify-center text-sm",
              isAutoRotate
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/40"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            ].join(" ")}
            title={isAutoRotate ? "Pausar autorrotação" : "Iniciar autorrotação"}
            aria-label="Autorrotação"
          >
            <span className={isAutoRotate ? "animate-spin" : ""}>🔄</span>
          </button>

          {/* Zoom In (Desktop) */}
          <button
            type="button"
            onClick={() => handleZoom("in")}
            className="hidden sm:flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Aproximar (Zoom In)"
            aria-label="Zoom In"
          >
            🔍+
          </button>

          {/* Zoom Out (Desktop) */}
          <button
            type="button"
            onClick={() => handleZoom("out")}
            className="hidden sm:flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Afastar (Zoom Out)"
            aria-label="Zoom Out"
          >
            🔍-
          </button>

          {/* Resetar Vista */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition text-xs font-semibold"
            title="Resetar ângulo inicial"
            aria-label="Resetar ângulo"
          >
            🧭
          </button>

          <span className="w-px h-5 bg-white/20 mx-0.5" />

          {/* Áudio Ambiente */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={[
              "px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 text-xs font-medium",
              isAudioPlaying
                ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            ].join(" ")}
            title={isAudioPlaying ? "Mutar som ambiente" : "Ligar som ambiente de ondas"}
            aria-label="Som ambiente"
          >
            <span>{isAudioPlaying ? "🔊" : "🔇"}</span>
            <span className="hidden sm:inline">
              {isAudioPlaying ? "Som Ligado" : "Som"}
            </span>
          </button>

          {/* Giroscópio (Mobile) */}
          <button
            type="button"
            onClick={handleToggleGyro}
            className={[
              "p-2 rounded-xl transition flex items-center justify-center text-xs",
              isGyroActive
                ? "bg-purple-500/30 text-purple-300 border border-purple-400/40"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            ].join(" ")}
            title="Giroscópio / Sensor de Movimento"
            aria-label="Giroscópio"
          >
            📱
          </button>

          {/* Modo Fotógrafo */}
          <button
            type="button"
            onClick={handleCapturePhoto}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow"
            title="Tirar foto 360° e gerar cartão postal"
            aria-label="Modo Fotógrafo"
          >
            <span>📸</span>
            <span className="hidden sm:inline">Foto Postal</span>
          </button>

          {/* Tela Cheia */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            aria-label="Tela cheia"
          >
            {isFullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      </div>

      {/* 7. Modais Interativos */}
      {selectedInfo && (
        <InfoModal
          content={selectedInfo}
          onClose={() => setSelectedInfo(null)}
        />
      )}

      {selectedTour && (
        <TourModal
          content={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {discoveredSecret && (
        <SecretsModal
          discoveredContent={discoveredSecret}
          foundSecrets={foundSecrets}
          onClose={() => setDiscoveredSecret(null)}
          secretsCatalog={secretsCatalog}
          totalSecretsCount={totalSecretsCount}
        />
      )}

      {capturedPhotoUrl && (
        <PhotoModeModal
          imageDataUrl={capturedPhotoUrl}
          currentScene={currentScene}
          onClose={() => setCapturedPhotoUrl(null)}
        />
      )}
    </div>
  );
}
