'use client';
import type { FC } from 'react';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ModelType, MaterialType } from '@/app/page';

interface ThreeSceneProps {
  model: ModelType;
  modelUrl: string | null;
  material: MaterialType;
  lightIntensity: number;
  styleImageUrl: string | null;
}

const ThreeScene: FC<ThreeSceneProps> = ({ model, modelUrl, material, lightIntensity, styleImageUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | THREE.Object3D | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    lightRef.current = directionalLight;

    // Initial Object
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const initialMaterial = new THREE.MeshStandardMaterial({ color: 0x9B5DE5 });
    const cube = new THREE.Mesh(geometry, initialMaterial);
    scene.add(cube);
    meshRef.current = cube;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('snapshot', takeSnapshot);
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
  
  const applyMaterial = (object: THREE.Object3D, newMaterial: THREE.Material) => {
    if (object instanceof THREE.Mesh) {
      object.material = newMaterial;
    }
    object.children.forEach(child => applyMaterial(child, newMaterial));
  };
  
  // Update material
  useEffect(() => {
    if (meshRef.current) {
        let newMaterial;
        const textureLoader = new THREE.TextureLoader();
        const texture = styleImageUrl ? textureLoader.load(styleImageUrl) : null;
        if(texture) texture.colorSpace = THREE.SRGBColorSpace;

        const materialProps: THREE.MeshStandardMaterialParameters = {
            map: texture,
            color: texture ? 0xffffff : 0x9B5DE5
        };

        switch (material) {
            case 'metallic':
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.9, roughness: 0.1 });
                break;
            case 'wireframe':
                newMaterial = new THREE.MeshBasicMaterial({ color: 0x00F5D4, wireframe: true });
                break;
            case 'matte':
            default:
                newMaterial = new THREE.MeshStandardMaterial({ ...materialProps, metalness: 0.1, roughness: 0.8 });
                break;
        }
        applyMaterial(meshRef.current, newMaterial);
    }
  }, [material, styleImageUrl]);


  const loadModel = (url: string) => {
    const scene = sceneRef.current;
    if (!scene) return;
  
    if (meshRef.current) {
      scene.remove(meshRef.current);
    }
  
    const loader = url.endsWith('.glb') || url.endsWith('.gltf') ? new GLTFLoader() : new OBJLoader();
    
    loader.load(url, (object) => {
      // For GLTF, the model is in object.scene
      const model = object.scene || object;
      
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      
      model.position.sub(center.multiplyScalar(scale));
      model.scale.set(scale, scale, scale);

      scene.add(model);
      meshRef.current = model;
      // Re-apply current material to new model
      if (meshRef.current) {
        // This is a bit of a hack, we should re-create the material
        // but this will trigger the material useEffect again.
        const currentMaterial = (meshRef.current as any).material;
        applyMaterial(meshRef.current, currentMaterial);
      }
    }, undefined, (error) => {
      console.error('An error happened while loading the model:', error);
    });
  };

  useEffect(() => {
    if (modelUrl) {
      loadModel(modelUrl);
    } else {
      if (meshRef.current && sceneRef.current) {
        const currentMaterial = (meshRef.current as any).material;
        sceneRef.current.remove(meshRef.current);
        let newGeometry: THREE.BufferGeometry;
        switch (model) {
          case 'sphere':
            newGeometry = new THREE.SphereGeometry(1.5, 32, 16);
            break;
          case 'torus':
            newGeometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
            break;
          case 'cube':
          default:
            newGeometry = new THREE.BoxGeometry(2, 2, 2);
            break;
        }
        const newMesh = new THREE.Mesh(newGeometry, currentMaterial);
        sceneRef.current.add(newMesh);
        meshRef.current = newMesh;
      }
    }
  }, [model, modelUrl]);


  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
