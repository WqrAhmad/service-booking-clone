<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">General Settings</h1>
        <p class="text-gray-600 mt-2">Manage system settings</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-xl p-8 text-center">
        <p class="text-gray-600">Loading settings...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Settings Form -->
      <div v-if="!loading" class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Logo & Favicon Settings -->
          <div class="pb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Logo & Favicon Settings</h2>
            
            <div class="space-y-6">
              <!-- Favicon -->
              <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="favicon" class="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div class="flex items-center gap-4">
                  <input
                    id="favicon"
                    v-model="settings.favicon"
                    type="text"
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter favicon URL or upload file"
                    :disabled="faviconFile !== null"
                  />
                  <input
                    ref="faviconFileInput"
                    type="file"
                    accept="image/x-icon,image/png,image/jpeg"
                    @change="handleFaviconUpload"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="faviconFileInput?.click()"
                    class="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
                <div v-if="faviconPreview || settings.favicon" class="mt-2 flex items-center gap-2">
                  <img :src="faviconPreview || settings.favicon" alt="Favicon" class="w-8 h-8" />
                  <span class="text-sm text-gray-500">Current favicon preview</span>
                  <button
                    v-if="faviconFile"
                    type="button"
                    @click="clearFavicon"
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Upload or enter URL for the site favicon (recommended: 32x32 or 16x16 pixels)
                </p>
              </div>

              <!-- Logo -->
              <div>
                <label for="logo" class="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div class="flex items-center gap-4">
                  <input
                    id="logo"
                    v-model="settings.logo"
                    type="text"
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter logo URL or upload file"
                    :disabled="logoFile !== null"
                  />
                  <input
                    ref="logoFileInput"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    @change="handleLogoUpload"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="logoFileInput?.click()"
                    class="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
                <div v-if="logoPreview || settings.logo" class="mt-2 flex items-center gap-2">
                  <img 
                    :src="logoPreview || settings.logo" 
                    alt="Logo" 
                    :style="{ height: settings.logo_height + 'px', width: settings.logo_width + 'px' }" 
                  />
                  <span class="text-sm text-gray-500">Current logo preview</span>
                  <button
                    v-if="logoFile"
                    type="button"
                    @click="clearLogo"
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Upload or enter URL for the site logo
                </p>
              </div>

              </div>
              <!-- Logo Dimensions -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="logoWidth" class="block text-sm font-medium text-gray-700 mb-2">
                    Logo Width (px)
                  </label>
                  <input
                    id="logoWidth"
                    v-model.number="settings.logo_width"
                    type="number"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label for="logoHeight" class="block text-sm font-medium text-gray-700 mb-2">
                    Logo Height (px)
                  </label>
                  <input
                    id="logoHeight"
                    v-model.number="settings.logo_height"
                    type="number"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="50"
                  />
                </div>
              </div>
              <p class="text-sm text-gray-500">
                Set the display dimensions for the logo (width and height in pixels)
              </p>
            </div>
          </div>

          <!-- Additional Settings -->
          <div class=" border-t border-gray-200 pt-8 mb-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Site Title
                </label>
                <input
                  id="title"
                  v-model="settings.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter site title"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  id="email"
                  v-model="settings.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter contact email"
                />
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  id="phone"
                  v-model="settings.phone"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter contact phone"
                />
              </div>
              </div>
              <!-- Address -->
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  v-model="settings.address"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter address"
                ></textarea>
              </div>
             
             
            </div>
          </div>

          <!-- Submit Button -->
          <div  class="pb-5">
            <button
              type="submit"
              :disabled="saving"
              class=" bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
       
        </form>
        <div class="border-t border-gray-200 border-dashed pt-5 mt-5">
                <label for="terms" class="block text-sm font-medium text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <QuillEditor
                  id="terms"
                  v-model:content="terms.content"
                  content-type="html"
                  theme="snow"
                  toolbar="full"
                  class="bg-white min-h-76 max-h-96 overflow-y-auto border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"

                />
              </div>
              <div class="pt-6 border-t border-gray-200">
                <button
                  @click="handleSubmitTerms"
                  :disabled="savingTerms"

                  class=" bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ savingTerms ? 'Saving...' : 'Save Terms and Conditions' }}
                </button>
              </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { generalSettingService, notificationService , termConditionService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useAppStore } from '@/stores/index';
const appStore = useAppStore();
const settings: any = ref({
  favicon: null,
  logo: null,
  logo_width: 200,
  logo_height: 50,
  title: '',
  email: null,
  phone: null,
  address: null,
});
const terms = ref({
  content: '',
});

const faviconFileInput = ref<HTMLInputElement | null>(null);
const logoFileInput = ref<HTMLInputElement | null>(null);
const faviconFile = ref<File | null>(null);
const logoFile = ref<File | null>(null);
const faviconPreview = ref<string | null>(null);
const logoPreview = ref<string | null>(null);
const loading = ref(true);
const saving = ref(false);
const savingTerms = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await fetchSettings();
});

const fetchSettings = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response: any = await generalSettingService.fetchGeneralData();
    
    // Set all settings values
    settings.value.title = response.data.title;
    settings.value.email = response.data.email;
    settings.value.phone = response.data.phone;
    settings.value.address = response.data.address;
    settings.value.logo_width = response.data.logo_width;
    settings.value.logo_height = response.data.logo_height;
    
    
    logoPreview.value = response.data.logo;
    faviconPreview.value = response.data.favicon;
    appStore.setGeneralSettings({
      favicon: response.data.favicon,
      logo: response.data.logo,
      logo_width: response.data.logo_width,
      logo_height: response.data.logo_height,
      title: response.data.title,
      email: response.data.email,
      phone: response.data.phone,
      address: response.data.address,
    });
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
    } 
  } finally {
    loading.value = false;
  }
};

const handleFaviconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    faviconFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      faviconPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearFavicon = () => {
  faviconFile.value = null;
  faviconPreview.value = null;
  settings.value.favicon = null;
  if (faviconFileInput.value) {
    faviconFileInput.value.value = '';
  }
};

const clearLogo = () => {
  logoFile.value = null;
  logoPreview.value = null;
  settings.value.logo = null;
  if (logoFileInput.value) {
    logoFileInput.value.value = '';
  }
};

const handleSubmit = async () => {
  try {
    saving.value = true;
    error.value = null;
    
    // Create FormData for multipart/form-data request
    const formData: any = new FormData();
    
    // Append files if they exist
    if (faviconFile.value) {
      formData.append('favicon', faviconFile.value);
    } else if (settings.value.favicon) {
      formData.append('favicon', settings.value.favicon);
    }
    
    if (logoFile.value) {
      formData.append('logo', logoFile.value);
    } else if (settings.value.logo) {
      formData.append('logo', settings.value.logo);
    }
    
    // Append other fields
    formData.append('logo_width', settings.value.logo_width.toString());
    formData.append('logo_height', settings.value.logo_height.toString());
    formData.append('title', settings.value.title || '');
    formData.append('email', settings.value.email || '');
    formData.append('phone', settings.value.phone || '');
    formData.append('address', settings.value.address || '');
    
    await generalSettingService.updateGeneralSetting(formData);
    
    notificationService.showSuccess('Settings saved successfully!');
    
    // Clear file references after successful upload
    faviconFile.value = null;
    logoFile.value = null;
    
    // Refresh settings to get updated URLs from server
    await fetchSettings();
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
    } 
  } finally {
    saving.value = false;
  }
};
onMounted(async () => {
  await fetchTermsAndConditions();
});
const fetchTermsAndConditions = async () => {
  try {
   
    const res: any = await termConditionService.showTermCondition();
    terms.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    } 
  }
}
const handleSubmitTerms = async () => {
  try {
    const payload:any = {
      content: terms.value.content || '',
    };
    const res: any = await termConditionService.addTermCondition(payload);
    notificationService.showSuccess(res.message);
    await fetchSettings();
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
      error.value = e.response.data.message;
    } 
  }
}
</script>