<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-12 md:col-span-12 text-center">
          <!-- <h3 class="text-2xl font-bold ">Remap Monster</h3> -->
        <div class="flex justify-center items-center">
          <img 
              v-if="generalSettings?.logo" 
              :src="generalSettings.logo" 
              :alt="generalSettings.title || 'Logo'"
              :style="{ width: generalSettings.logo_width + 'px', height: generalSettings.logo_height + 'px' }"
              class="object-contain "
            />
        </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} {{ generalSettings?.title || 'Remap Monster' }}. All rights reserved.
          </p>
          <div class="mt-4 md:mt-0 flex space-x-6">
            <router-link to="/privacy-policy" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</router-link>
            <router-link to="/terms-of-service" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</router-link>
            <router-link to="/cookie-policy" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/index';

const appStore = useAppStore();
const generalSettings:any = computed(() => appStore.getGeneralSettings);
const currentYear = computed(() => new Date().getFullYear());
</script>