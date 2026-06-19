"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as THREE from "three"

// Model component that loads and displays a 3D model
function Model({ modelPath, position, rotation, scale }: any) {
  const { scene } = useGLTF(modelPath) as any

  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />
}

// Camera controller for smooth animations
function CameraController({ targetPosition, isActive }: { targetPosition: number[]; isActive: boolean }) {
  const { camera } = useThree()
  const initialPos = useRef([0, 5, 10])

  useFrame(() => {
    if (isActive) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition[0], 0.05)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosition[1], 0.05)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition[2], 0.05)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

// Main component
export default function PropertyShowcase() {
  const [activeView, setActiveView] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const cameraPositions = [
    [0, 5, 10], // Front view
    [10, 5, 0], // Side view
    [0, 10, 5], // Top view
  ]

  const viewLabels = ["Front View", "Side View", "Top View"]

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const nextView = () => {
    setActiveView((prev) => (prev + 1) % cameraPositions.length)
  }

  const prevView = () => {
    setActiveView((prev) => (prev - 1 + cameraPositions.length) % cameraPositions.length)
  }

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-900">
          <div className="text-white text-xl">Loading 3D Experience...</div>
        </div>
      )}

      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Replace with actual model path when available */}
        <Model modelPath="/assets/3d/duck.glb" position={[0, 0, 0]} rotation={[0, 0, 0]} scale={2} />

        <CameraController targetPosition={cameraPositions[activeView]} isActive={isLoaded} />
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate={false} />
      </Canvas>

      {isLoaded && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/30"
            onClick={prevView}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md text-white">{viewLabels[activeView]}</div>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/30"
            onClick={nextView}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
