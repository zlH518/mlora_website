<template>
  <Layout />
  <!-- This will render the Layout with the navbar and router-view -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from './Layout.vue'

export default defineComponent({
  name: 'App',
  components: {
    Layout,
  },
})
</script>

<style>
/* Global app styles */
</style>
