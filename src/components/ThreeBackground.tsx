import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme, alpha } from '@mui/material';

// Helper function to check WebGL support
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const ThreeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Add background color to body
  useEffect(() => {
    document.body.style.backgroundColor = '#030712'; // Dark background color
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if WebGL is available
    if (!isWebGLAvailable()) {
      console.warn('WebGL is not available. Using fallback background.');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Create renderer only if it doesn't exist
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
    }

    const renderer = rendererRef.current;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Only append if not already appended
    if (!containerRef.current.contains(renderer.domElement)) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create multiple particle systems
    const createParticleSystem = (count: number, size: number, color: string, spread: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const phases = new Float32Array(count);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * spread;

        velocities[i] = (Math.random() - 0.5) * 0.02;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i + 2] = (Math.random() - 0.5) * 0.02;

        phases[i / 3] = Math.random() * Math.PI * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

      const material = new THREE.PointsMaterial({
        size,
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      return {
        mesh: new THREE.Points(geometry, material),
        update: (time: number) => {
          const positions = geometry.attributes.position.array as Float32Array;
          const velocities = geometry.attributes.velocity.array as Float32Array;
          const phases = geometry.attributes.phase.array as Float32Array;

          for (let i = 0; i < positions.length; i += 3) {
            const phase = phases[i / 3];
            
            // Update positions with velocities and sine wave motion
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1] + Math.sin(time + phase) * 0.002;
            positions[i + 2] += velocities[i + 2];

            // Boundary check and wrap around
            for (let j = 0; j < 3; j++) {
              if (Math.abs(positions[i + j]) > spread / 2) {
                positions[i + j] *= -0.9;
                velocities[i + j] *= -0.9;
              }
            }
          }

          geometry.attributes.position.needsUpdate = true;
        }
      };
    };

    // Create multiple particle systems with different properties
    const particleSystems = [
      createParticleSystem(2000, 0.05, theme.palette.primary.main, 40),
      createParticleSystem(1500, 0.03, theme.palette.secondary.main, 30),
      createParticleSystem(1000, 0.02, '#ffffff', 20),
    ];

    particleSystems.forEach(system => scene.add(system.mesh));

    // Camera position and initial rotation
    camera.position.z = 20;
    camera.rotation.x = -0.2;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      // Smooth camera rotation
      targetRotationX += (mouseY * 0.2 - targetRotationX) * 0.02;
      targetRotationY += (mouseX * 0.2 - targetRotationY) * 0.02;

      camera.rotation.x = -0.2 + targetRotationX * 0.3;
      camera.rotation.y = targetRotationY * 0.3;

      // Update particle systems
      particleSystems.forEach((system, index) => {
        system.mesh.rotation.y = time * (0.1 + index * 0.05);
        system.mesh.rotation.z = time * (0.05 + index * 0.03);
        system.update(time);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      particleSystems.forEach(system => {
        system.mesh.geometry.dispose();
        (system.mesh.material as THREE.PointsMaterial).dispose();
        scene.remove(system.mesh);
      });

      // Clear all remaining objects from the scene
      while(scene.children.length > 0) {
        const object = scene.children[0];
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
        scene.remove(object);
      }

      // Dispose of the renderer if we're completely unmounting
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [theme.palette.primary.main, theme.palette.secondary.main]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundColor: '#030712', // Dark background color
        background: `linear-gradient(135deg, 
          ${alpha('#030712', 0.95)} 0%, 
          ${alpha('#030712', 1)} 100%)`,
        pointerEvents: 'none',
      }}
    >
      {/* Fallback gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 50%, 
            ${alpha(theme.palette.primary.main, 0.15)} 0%,
            ${alpha(theme.palette.secondary.main, 0.1)} 30%,
            ${alpha('#030712', 1)} 100%)`,
          opacity: 0.9,
          pointerEvents: 'none',
        }}
      />
      {/* Additional overlay for smoother transition */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 50%, 
            transparent 0%,
            ${alpha('#030712', 0.2)} 60%,
            ${alpha('#030712', 0.4)} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default ThreeBackground; 