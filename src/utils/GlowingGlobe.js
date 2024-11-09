import * as THREE from 'three'

export function initGlowingGlobe(container) {
  if (!container) return

  // Create scene
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  // Create main globe geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0x6c63ff, // Purple color
    transparent: true,
    opacity: 0.5,
    wireframe: true,
  })
  const globe = new THREE.Mesh(geometry, material)
  scene.add(globe)

  // Create a large glowing halo effect using a shader material for outer glow
  const haloGeometry = new THREE.SphereGeometry(1.3, 32, 32) // Adjust from 1.6 to 1.3
  const haloMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { type: 'c', value: new THREE.Color(0x6c63ff) },
      viewVector: { type: 'v3', value: camera.position },
    },
    vertexShader: `
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, -1.0)), 2.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        gl_FragColor = vec4(glowColor * intensity, intensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5, // Higher opacity for a brighter effect
  })
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  scene.add(halo)

  // Add another, larger diffuse glow layer
  const diffuseGeometry = new THREE.SphereGeometry(1.8, 32, 32) // Adjust from 2.5 to 1.8
  const diffuseMaterial = new THREE.MeshBasicMaterial({
    color: 0x6c63ff,
    transparent: true,
    opacity: 0.15, // Soft diffuse glow
  })
  const diffuseGlow = new THREE.Mesh(diffuseGeometry, diffuseMaterial)
  scene.add(diffuseGlow)

  // Animation function
  function animate() {
    requestAnimationFrame(animate)
    globe.rotation.y += 0.005 // Slowly rotate the globe

    // Pulsate the inner glow slightly
    halo.scale.setScalar(1.3 + 0.05 * Math.sin(Date.now() * 0.003)) // Adjust scale change to 0.05

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
}
