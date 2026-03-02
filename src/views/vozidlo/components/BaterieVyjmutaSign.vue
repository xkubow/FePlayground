<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Červený kruh -->
    <circle v-if="baterieVyjmuta" cx="32" cy="32" r="30" stroke="red" stroke-width="3" />

    <!-- Telo batérie -->
    <rect x="10" y="20" width="44" height="24" rx="2" ry="2" fill="#ccc" stroke="#333" stroke-width="2" />

    <!-- Vývody batérie -->
    <rect x="12" y="16" width="6" height="4" fill="#666" />
    <rect x="46" y="16" width="6" height="4" fill="#666" />

    <!-- Väčší symbol blesku -->
    <polygon points="30,22 28,34 33,34 31,44 38,30 33,30 36,22" fill="orange" stroke="#000" stroke-width="1" />

    <!-- Červená šikmá čiara zakončená presne na kruhu -->
    <line v-if="baterieVyjmuta" x1="10.0" y1="10.0" x2="54.0" y2="54.0" stroke="red" stroke-width="4" />
  </svg>
</template>

<script setup lang="ts">
  // Default the prop to true if not passed
  defineProps<{
    baterieVyjmuta: boolean;
  }>();
</script>

<style scoped></style>
