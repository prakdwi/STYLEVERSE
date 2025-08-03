'use client';
import type { FC } from 'react';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ModelType, MaterialType } from '@/app/page';

interface ThreeSceneProps {
  model: ModelType;
  material: MaterialType;
  lightIntensity: number;
  styleImageUrl: string | null;
}

const ThreeScene: FC<ThreeSceneProps> = ({ model, material, lightIntensity, styleImageUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
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
        if(rendererRef.current){
            rendererRef.current.render(scene, camera);
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
  
  // Update material
  useEffect(() => {
    if (meshRef.current) {
        let newMaterial;
        const currentMaterial = meshRef.current.material as THREE.MeshStandardMaterial;
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
        meshRef.current.material = newMaterial;
    }
  }, [material, styleImageUrl]);


  // Update model
  useEffect(() => {
    if (meshRef.current && sceneRef.current) {
      sceneRef.current.remove(meshRef.current);
      let newGeometry: THREE.BufferGeometry;
      switch (model) {
        case 'jacket':
          newGeometry = new THREE.BoxGeometry(2.5, 3, 1);
          break;
        case 'shirt':
          newGeometry = new THREE.BoxGeometry(2, 2.5, 0.5);
          break;
        case 'person':
            newGeometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
            break;
        case 'cube':
        default:
          newGeometry = new THREE.BoxGeometry(2, 2, 2);
          break;
      }
      const newMesh = new THREE.Mesh(newGeometry, meshRef.current.material);
      sceneRef.current.add(newMesh);
      meshRef.current = newMesh;
    }
  }, [model]);


  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
