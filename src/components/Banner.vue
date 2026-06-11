<template>
  <div class="relative w-full h-[100vh] flex items-center justify-center bg-linear-to-br from-blue-600 via-blue-700 to-blue-800">
    <!-- Optional: Background overlay for better text readability -->
    <div class="absolute inset-0 bg-black/20"></div>
    
    <!-- Centered content -->
    <div class="relative z-10 text-center">
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-wide">
        Remap Monster
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Optional: If you want to use a background image instead of gradient */
/* 
div {
  background-image: url('@/assets/images/banner.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
*/
</style>