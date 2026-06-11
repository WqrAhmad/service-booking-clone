<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue';
import NavBar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useAppStore } from '@/stores/index';
import { generalSettingService, notificationService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useRoute } from 'vue-router';

const appStore = useAppStore();
const isLoading = ref(true);
const route = useRoute();
// Computed property to get general settings
const generalSettings = computed(() => appStore.getGeneralSettings);

// Function to update favicon
const updateFavicon = (faviconUrl: string) => {
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(link => link.remove());
  
  const icons = [
    { rel: 'icon', type: 'image/x-icon', href: faviconUrl },
    { rel: 'shortcut icon', type: 'image/x-icon', href: faviconUrl },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: faviconUrl },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: faviconUrl }
  ];
  
  icons.forEach(iconConfig => {
    const link = document.createElement('link');
    link.rel = iconConfig.rel;
    link.type = iconConfig.type;
    if (iconConfig.sizes) link.setAttribute('sizes', iconConfig.sizes);
    link.href = faviconUrl;
    document.head.appendChild(link);
  });
  
  setTimeout(() => {
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach((link: any) => {
      const url = new URL(link.href);
      url.searchParams.set('v', Date.now().toString());
      link.href = url.toString();
    });
  }, 100);
};

// Update document title and favicon when settings change
watch(generalSettings, (settings: any) => {
  if (settings) {
    if (settings.title) {
      document.title = settings.title;
    }
    
    if (settings.favicon) {
      updateFavicon(settings.favicon);
    }
  }
}, { immediate: true });

// Fetch general settings
const fetchSettings = async () => {
  try {
    const response: any = await generalSettingService.fetchGeneralData();
    appStore.setGeneralSettings(response.data);
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    } 
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // Option 1: Always fetch (simplest)
  await fetchSettings();
  
  // Option 2: Only fetch if truly empty (check for null/undefined specifically)
  // if (appStore.getGeneralSettings === null || appStore.getGeneralSettings === undefined) {
  //   await fetchSettings();
  // } else {
  //   isLoading.value = false;
  // }
});
const hideLayoutRoutes = ['/admin/jobs/job-sheet', '/terms-conditions'];
const showLayout = computed(() => !hideLayoutRoutes.includes(route.path));
</script>

<template>
  <NavBar v-if="showLayout" />
  <router-view v-if="!isLoading" :key="$route.fullPath" />
  <div v-else class="loading">Loading...</div>
  <Footer v-if="showLayout" />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

body {
  font-family: "Outfit", sans-serif;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
</style>