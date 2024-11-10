<template>
  <div class="team-page">
    <h1>Meet the Team behind mLoRa</h1>
    <p>Get to know more about the developers in our team.</p>
    <p class="game-instruction">
      ✨ Here is a simple game for you: there are 4 team members and one supervisor. Click on nodes
      to try and find the hidden team members! Haha!
    </p>
    <div id="geo-globe">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { initNeuralNetworkAnimation } from '@/utils/GeometricGlobeAnimation'

export default defineComponent({
  name: 'TeamPage',
  setup() {
    onMounted(() => {
      initNeuralNetworkAnimation() // Start the animation when component is mounted
    })
  },
})
</script>

<style scoped>
.team-page {
  background-color: rgba(16, 16, 34, 0.95);
  color: #ffffff;
  height: 1000px; /* Set fixed height for the page */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start; /* Align items to the top */
  overflow: hidden;
  text-align: center;
  width: 100vw;
  padding-top: 200px; /* Push content below the navbar */
  position: relative;
  z-index: 1;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem; /* Reduce space below the main title */
}

p {
  font-size: 1.25rem;
  margin-bottom: 2rem; /* Adjust space below the subtitle */
}

.game-instruction {
  font-size: 1rem;
  color: #d4d3f2; /* Light purple */
  background-color: rgba(66, 59, 121, 0.2); /* Semi-transparent background */
  border: 1px solid rgba(128, 121, 189, 0.4); /* Subtle border */
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  max-width: 700px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem; /* Space below instruction */
}

#geo-globe {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
  margin-bottom: 0.5rem;
}

canvas {
  max-width: 100%;
  display: block;
  margin: 0 auto;
  width: 500px; /* Fixed width */
  height: 500px; /* Fixed height */
  position: relative;
  z-index: 0; /* Canvas should be behind the titles */
}
</style>
