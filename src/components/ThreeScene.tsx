'use client';
import type { FC } from 'react';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ModelType, MaterialType } from '@/app/page';

interface ThreeSceneProps {
  model: ModelType;
  modelUrl: string | null;
  material: MaterialType;
  lightIntensity: number;
  generatedTexture: string | null;
  backgroundColor: string;
  showGrid: boolean;
}

const ThreeScene: FC<ThreeSceneProps> = ({ model, modelUrl, material, lightIntensity, generatedTexture, backgroundColor, showGrid }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | THREE.Object3D | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const requestRef = useRef<number>();

  const animate = () => {
    requestRef.current = requestAnimationFrame(animate);
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F0F1C');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    lightRef.current = directionalLight;

    // Grid Helper
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.visible = false;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // Initial Object
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const initialMaterial = new THREE.MeshStandardMaterial({ color: 0x00F5D4 });
    const cube = new THREE.Mesh(geometry, initialMaterial);
    scene.add(cube);
    meshRef.current = cube;
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
        if (currentMount && cameraRef.current && rendererRef.current) {
            cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    const takeSnapshot = () => {
        if(rendererRef.current && sceneRef.current && cameraRef.current){
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const dataURL = rendererRef.current.domElement.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'snapshot.png';
            link.href = dataURL;
            link.click();
        }
    }
    window.addEventListener('snapshot', takeSnapshot);


    // Cleanup
    return () => {
      if(requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('snapshot', takeSnapshot);
      if(controlsRef.current) controlsRef.current.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update light intensity
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = lightIntensity;
    }
  }, [lightIntensity]);

  // Update background color
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(backgroundColor);
    }
  }, [backgroundColor]);
  
  // Update grid visibility
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = showGrid;
    }
  }, [showGrid]);

  const applyMaterial = (object: THREE.Object3D, newMaterial: THREE.Material) => {
    if (object instanceof THREE.Mesh) {
      object.material = newMaterial;
    }
    object.children.forEach(child => applyMaterial(child, newMaterial));
  };
  
  // Update material and texture
  useEffect(() => {
    if (meshRef.current) {
        let newMaterial;
        const textureLoader = new THREE.TextureLoader();
        const texture = generatedTexture ? textureLoader.load(generatedTexture) : null;
        if(texture) texture.colorSpace = THREE.SRGBColorSpace;

        const materialProps: THREE.MeshStandardMaterialParameters = {
            map: texture,
            color: texture ? 0xffffff : 0x00F5D4
        };

        switch (material) {
            case 'metallic':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.9, roughness: 0.1 });
                break;
            case 'wireframe':
                newMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4D6D, wireframe: true });
                break;
            case 'cotton':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.0, roughness: 0.8 });
                break;
            case 'silk':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.1, roughness: 0.1, clearcoat: 0.9 });
                break;
            case 'denim':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.2, roughness: 0.7 });
                break;
            case 'matte':
            default:
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.1, roughness: 0.9 });
                break;
        }
        applyMaterial(meshRef.current, newMaterial);
    }
  }, [material, generatedTexture]);


  const loadModel = (url: string) => {
    const scene = sceneRef.current;
    if (!scene) return;
  
    if (meshRef.current) {
      scene.remove(meshRef.current);
    }
  
    const onModelLoaded = (object: THREE.Group | THREE.Object3D) => {
        const model = object.type === 'Group' ? object : object;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        
        model.position.sub(center.multiplyScalar(scale));
        model.scale.set(scale, scale, scale);
  
        scene.add(model);
        meshRef.current = model;
        
        // Re-apply the material/texture after loading the new model
        const currentMaterialType = material;
        let newMaterial;
        const textureLoader = new THREE.TextureLoader();
        const texture = generatedTexture ? textureLoader.load(generatedTexture) : null;
        if(texture) texture.colorSpace = THREE.SRGBColorSpace;

        const materialProps: THREE.MeshStandardMaterialParameters = {
            map: texture,
            color: texture ? 0xffffff : 0x00F5D4
        };

        switch (currentMaterialType) {
            case 'metallic':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.9, roughness: 0.1 });
                break;
            case 'wireframe':
                newMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4D6D, wireframe: true });
                break;
            case 'cotton':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.0, roughness: 0.8 });
                break;
            case 'silk':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.1, roughness: 0.1, clearcoat: 0.9 });
                break;
            case 'denim':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.2, roughness: 0.7 });
                break;
            case 'matte':
            default:
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.1, roughness: 0.9 });
                break;
        }
        applyMaterial(meshRef.current, newMaterial);
    };

    const loader = new GLTFLoader();
    loader.load(url, (gltf) => onModelLoaded(gltf.scene), undefined, (error) => {
      console.error('An error happened while loading the GLB model:', error);
    });
  };

  useEffect(() => {
    if (modelUrl) {
      loadModel(modelUrl);
    } else {
      const scene = sceneRef.current;
      if (scene && meshRef.current) {
        scene.remove(meshRef.current);
      }
  
      let newGeometry: THREE.BufferGeometry;
      switch (model) {
        case 'sphere':
          newGeometry = new THREE.SphereGeometry(1.5, 32, 16);
          break;
        case 'knot':
          newGeometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
          break;
        case 'cube':
        default:
          newGeometry = new THREE.BoxGeometry(2, 2, 2);
          break;
      }

      if (model !== 'jacket') {
        const currentMaterial = (meshRef.current as any)?.material || new THREE.MeshStandardMaterial({ color: 0x00F5D4 });
        const newMesh = new THREE.Mesh(newGeometry, currentMaterial);
        if (scene) {
          scene.add(newMesh);
        }
        meshRef.current = newMesh;
      } else {
        meshRef.current = null;
      }
    }
  }, [model, modelUrl]);


  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
