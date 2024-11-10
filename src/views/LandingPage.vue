<template>
  <div id="mlora-app" class="landing-page">
    <div class="globe-container" ref="globeContainer"></div>
    <div class="hero-section">
      <div class="hero-content">
        <h1>Effortless Fine-Tuning with mLoRA</h1>
        <p>A powerful tool for developers to fine-tune multiple LLMs simultaneously.</p>
      </div>
      <div class="hero-image">
        <img src="@/assets/mlora_llama_image.png" alt="mLoRA Llama Illustration" />
      </div>
      <div class="glowing-box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { initGlowingGlobe } from '@/utils/GlowingGlobe'

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const globeContainer = ref<HTMLElement | null>(null)

    onMounted(() => {
      if (globeContainer.value) {
        initGlowingGlobe(globeContainer.value)
      }
    })

    return {
      globeContainer,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

.landing-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100vw;
  overflow-y: auto;
  background-color: #0a0a23;
  color: #ffffff;
}

.globe-container {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  z-index: 1;
}

.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  z-index: 2;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.hero-image {
  margin-top: -1rem;
  position: relative;
  z-index: 2;
  transform: scale(0.6);
}

.hero-image img {
  width: 450px;
  height: auto;
  filter: drop-shadow(0 0 30px rgba(108, 99, 255, 0.6));
}

.glowing-box {
  position: absolute;
  top: 124%; /* Adjust to align the box with llama's stomach */
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 800px;
  border-radius: 20px;
  background: linear-gradient(180deg, hsl(259, 89%, 61%), #413ca8);
  z-index: 3;
}
</style>
