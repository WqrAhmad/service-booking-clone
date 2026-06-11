<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="text-center mb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Staff Profile</h2>
        <p class="text-sm text-gray-600">Complete your profile information</p>
      </div>

      <!-- Profile Form -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Basic Information Section -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input id="fullName" v-model="formData.name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.name }" placeholder="Enter your full name" />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>

              <!-- Business Name -->
              <div>
                <label for="businessName" class="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span class="text-red-500">*</span>
                </label>
                <input id="businessName" v-model="formData.business_name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.business_name }" placeholder="Enter your business name" />
                <p v-if="errors.business_name" class="mt-1 text-xs text-red-500">{{ errors.business_name }}</p>
              </div>
            </div>

            <!-- Address & Postcode (Simple inputs) -->
            <div class="mt-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Simple Postcode field -->
                <div>
                  <label for="post_code" class="block text-sm font-medium text-gray-700 mb-1">
                    Post Code <span class="text-red-500">*</span>
                  </label>
                  <input id="post_code" v-model="formData.post_code" type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                    :class="errors.post_code ? 'border-red-500' : 'border-gray-300'" placeholder="e.g. SW1A 1AA" />
                  <p v-if="errors.post_code" class="mt-1 text-xs text-red-500">{{ errors.post_code }}</p>
                </div>

                <!-- Simple Address field spanning remaining columns -->
                <div class="md:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                    Address <span class="text-red-500">*</span>
                  </label>
                  <input id="address" v-model="formData.address" type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    :class="errors.address ? 'border-red-500' : 'border-gray-300'"
                    placeholder="Enter your full address" />
                  <p v-if="errors.address" class="mt-1 text-xs text-red-500">{{ errors.address }}</p>
                </div>
              </div>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <!-- Phone Number -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input id="phoneNumber" v-model="formData.phone" type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.phone }" placeholder="Enter your phone number" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
              </div>

              <!-- Email Address -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input id="email" v-model="formData.email" type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.email }" placeholder="Enter your email address" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Website -->

          </div>

          <!-- Services Section -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Services Offered and Prices</h3>
            <p class="text-xs text-gray-500 mb-4">Set prices for each service. All available services are shown below.
            </p>

            <div v-if="allServices.length === 0" class="text-gray-500 text-sm mb-4 text-center py-6">
              No services available. Please contact admin to add services.
            </div>

            <div v-else class="space-y-3">
              <div v-for="service in allServices" :key="service.id"
                class="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <p class="text-gray-900 font-semibold text-sm">{{ service.name }}</p>
                    <p v-if="service.description" class="text-xs text-gray-500 mt-1">{{ service.description }}</p>
                  </div>
                  <div>
                    <div class="flex flex-row justify-between items-center mb-1">
                      <label :for="`service-price-${service.id}`" class="block text-sm font-medium text-gray-700">
                        Your Price (£) <span class="text-red-500">*</span>
                      </label>
                      <span class="flex flex-row items-center gap-2">
                        <!-- Custom Toggle Switch -->
                        <div class="relative inline-block">
                          <input :id="`service-active-${service.id}`" type="checkbox"
                            :checked="getServiceData(service.id).is_active"
                            @change="updateServiceActive(service.id, ($event.target as HTMLInputElement).checked)"
                            class="sr-only peer" />
                          <label :for="`service-active-${service.id}`" class="
        relative flex h-5 w-10 cursor-pointer items-center rounded-full
        transition-all duration-300 ease-in-out
        bg-red-200 peer-checked:bg-green-500
        hover:shadow-md
        peer-focus:ring-2 peer-focus:ring-offset-1
        peer-focus:ring-red-300 peer-checked:peer-focus:ring-green-300
      ">
                            <!-- Toggle Circle -->
                            <span class="
          absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-md
          transition-all duration-300 ease-in-out
          peer-checked:translate-x-5
          peer-checked:shadow-lg
        "></span>
                          </label>
                        </div>

                        <!-- Status Label with Animation -->
                        <span class="
      text-xs font-medium transition-all duration-300 ease-in-out
      transform
    " :class="getServiceData(service.id).is_active
      ? 'text-green-600 scale-100'
      : 'text-red-500 scale-95'
      ">
                          {{ getServiceData(service.id).is_active ? 'Active' : 'Inactive' }}
                        </span>

                        <!-- Optional Status Icon -->
                        <span class="
      inline-flex h-4 w-4 items-center justify-center rounded-full
      transition-all duration-300 ease-in-out
      transform
    " :class="getServiceData(service.id).is_active
      ? 'bg-green-100 text-green-600 scale-100 rotate-0'
      : 'bg-red-100 text-red-500 scale-90 rotate-180'
      ">
                          <svg v-if="getServiceData(service.id).is_active" class="h-2.5 w-2.5 animate-bounce-in"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd" />
                          </svg>
                          <svg v-else class="h-2.5 w-2.5 animate-shake" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <input :id="`service-price-${service.id}`" :value="getServiceData(service.id).price"
                      @input="updateServicePrice(service.id, ($event.target as HTMLInputElement).value)" type="number"
                      step="0.01" min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      :class="{ 'border-red-500': errors[`service_${service.id}`] }" placeholder="0.00" />
                    <p v-if="errors[`service_${service.id}`]" class="mt-1 text-xs text-red-500">{{
                      errors[`service_${service.id}`] }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="errors.services" class="mt-2 text-xs text-red-500">{{ errors.services }}</p>
          </div>


          <!-- Availability and VAT Section -->
          <div class="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
              <div class="flex gap-2">
                <label
                  class="relative flex-1 cursor-pointer rounded-lg border-2 px-3 py-2.5 transition-all duration-300 ease-in-out hover:shadow-sm group"
                  :class="formData.available === 'available' ? 'border-green-500 bg-green-50 shadow-sm scale-105' : 'border-gray-200 bg-white hover:border-green-300'">
                  <input v-model="formData.available" type="radio" value="available" class="sr-only peer" />
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out"
                        :class="formData.available === 'available' ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white group-hover:border-green-400'">
                        <span v-if="formData.available === 'available'"
                          class="h-1.5 w-1.5 rounded-full bg-white animate-scale-in"></span>
                      </div>
                      <span class="text-sm font-medium transition-colors duration-300"
                        :class="formData.available === 'available' ? 'text-green-700' : 'text-gray-700'">Available</span>
                    </div>
                    <svg v-if="formData.available === 'available'" class="h-4 w-4 text-green-600 animate-bounce-in"
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </label>
                <label
                  class="relative flex-1 cursor-pointer rounded-lg border-2 px-3 py-2.5 transition-all duration-300 ease-in-out hover:shadow-sm group"
                  :class="formData.available === 'not_available' ? 'border-red-500 bg-red-50 shadow-sm scale-105' : 'border-gray-200 bg-white hover:border-red-300'">
                  <input v-model="formData.available" type="radio" value="not_available" class="sr-only peer" />
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out"
                        :class="formData.available === 'not_available' ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white group-hover:border-red-400'">
                        <span v-if="formData.available === 'not_available'"
                          class="h-1.5 w-1.5 rounded-full bg-white animate-scale-in"></span>
                      </div>
                      <span class="text-sm font-medium transition-colors duration-300"
                        :class="formData.available === 'not_available' ? 'text-red-700' : 'text-gray-700'">Not
                        Available</span>
                    </div>
                    <svg v-if="formData.available === 'not_available'" class="h-4 w-4 text-red-600 animate-bounce-in"
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </label>
              </div>
              <p class="mt-1.5 text-xs text-gray-500">
                {{ formData.available === 'available' ? 'Staff is currently available to accept jobs' :
                  'Staff is not available to accept jobs at this time' }}
              </p>
            </div>


          </div>



          <!-- Submit Button -->
          <div class="pt-4 border-t border-gray-200">
            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span v-if="!isSubmitting">Save Profile</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { notificationService, userService, servicesService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useAppStore } from '@/stores/index';

const isLoading = ref(false);
const isSubmitting = ref(false);
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const appStore = useAppStore();
const user: any = computed(() => appStore.getUser);
const userId = computed(() => user.value?.id);

const formData: any = ref({
  name: '',
  business_name: '',
  phone: '',
  email: '',
  post_code: '',
  available: 'available',
  address: '',
  latitude: null,
  longitude: null,
  radius: null,
  services: [],
  availability: []
});

const errors: any = ref({});
const allServices: any = ref([]);

// Initialize availability for all days
const initializeavailability = () => {
  if (formData.value.availability.length === 0) {
    formData.value.availability = daysOfWeek.map(day => ({
      day: day,
      opening_time: '09:00',
      closing_time: '17:00',
      is_closed: false
    }));
  }
};

// Get service data from formData.services
const getServiceData = (serviceId: string) => {
  const service = formData.value.services.find((s: any) => s.service_id === serviceId);
  return service || { service_id: serviceId, price: '', is_active: false };
};

// Update service price
const updateServicePrice = (serviceId: string, price: string) => {
  const index = formData.value.services.findIndex((s: any) => s.service_id === serviceId);

  if (index >= 0) {
    formData.value.services[index].price = price;
  } else {
    formData.value.services.push({
      service_id: serviceId,
      price: price,
      is_active: false
    });
  }

  // Clear error for this service
  delete errors.value[`service_${serviceId}`];
};

// Update service active status
const updateServiceActive = (serviceId: string, isActive: boolean) => {
  const index = formData.value.services.findIndex((s: any) => s.service_id === serviceId);

  if (index >= 0) {
    formData.value.services[index].is_active = isActive;
  } else {
    formData.value.services.push({
      service_id: serviceId,
      price: '',
      is_active: isActive
    });
  }
};


// Validation function
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  // Basic Information Validation
  if (!formData.value.name || formData.value.name.trim() === '') {
    errors.value.name = 'Full name is required';
    isValid = false;
  }

  if (!formData.value.business_name || formData.value.business_name.trim() === '') {
    errors.value.business_name = 'Business name is required';
    isValid = false;
  }

  if (!formData.value.address || formData.value.address.trim() === '') {
    errors.value.address = 'Address is required';
    isValid = false;
  }

  if (!formData.value.post_code || formData.value.post_code.trim() === '') {
    errors.value.post_code = 'Postcode is required';
    isValid = false;
  }

  // Radius Validation


  if (!formData.value.phone || formData.value.phone.trim() === '') {
    errors.value.phone = 'Phone number is required';
    isValid = false;
  }

  if (!formData.value.email || formData.value.email.trim() === '') {
    errors.value.email = 'Email is required';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = 'Please enter a valid email address';
      isValid = false;
    }
  }




  // Services Validation
  allServices.value.forEach((service: any) => {
    const serviceData = getServiceData(service.id);
    if (serviceData.is_active && (!serviceData.price || serviceData.price === '' || parseFloat(serviceData.price) <= 0)) {
      errors.value[`service_${service.id}`] = 'Price is required for active services';
      isValid = false;
    }
  });

  // Check if at least one service is active
  const hasActiveService = formData.value.services.some((s: any) => s.is_active);
  if (!hasActiveService) {
    errors.value.services = 'Please activate at least one service';
    isValid = false;
  }
  return isValid;
};

// Fetch user data
const fetchUserById = async () => {
  try {
    isLoading.value = true;
    const res: any = await userService.getUserById(userId.value);

    formData.value.name = res.data.name || '';
    formData.value.business_name = res.data.business_name || '';
    formData.value.phone = res.data.phone || '';
    formData.value.email = res.data.email || '';
    formData.value.post_code = res.data.post_code || '';
    // Changed: handle string values
    formData.value.available = res.data.available || 'available';
    formData.value.address = res.data.address || '';
    formData.value.latitude = res.data.latitude ?? null;
    formData.value.longitude = res.data.longitude ?? null;
    formData.value.radius = res.data.radius ?? null;
    formData.value.avatar = res.data.avatar || '';

    // Load services if available
    if (res.data.services && Array.isArray(res.data.services)) {
      formData.value.services = res.data.services.map((s: any) => ({
        service_id: s.service.id,
        price: s.price || '',
        is_active: s.is_active
      }));
    }
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

// Fetch services
const fetchServices = async () => {
  try {
    const res: any = await servicesService.getServicesList([
      { key: 'take_all', value: 'true' }
      , { key: 'status', value: 'active' }
    ]);
    allServices.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    }
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    notificationService.showError('Please fill all required fields before submitting');
    return;
  }

  try {
    isSubmitting.value = true;

    // Prepare data for submission
    const submitData: any = {
      name: formData.value.name,
      business_name: formData.value.business_name,
      phone: formData.value.phone,
      email: formData.value.email,
      post_code: formData.value.post_code,
      available: formData.value.available, // Changed: now sends string value
      address: formData.value.address,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      radius: formData.value.radius ? Number(formData.value.radius) : null,
      services: formData.value.services.map((s: any) => ({
        service_id: s.service_id,
        price: parseFloat(s.price) || 0,
        is_active: s.is_active
      }))
    };

    await userService.updateProfile(userId.value, submitData);
    notificationService.showSuccess('Profile updated successfully!');
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    }
  } finally {
    isSubmitting.value = false;
  }
};

let postcodeTimer: ReturnType<typeof setTimeout> | null = null;
watch(() => formData.value.post_code, (val: string) => {
  formData.value.latitude = null;
  formData.value.longitude = null;
  if (errors.value.post_code) delete errors.value.post_code;
  const pc = val?.trim();
  if (!pc || pc.length < 5) return;
  if (postcodeTimer) clearTimeout(postcodeTimer);
  postcodeTimer = setTimeout(async () => {
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 200 && data.result) {
        formData.value.latitude = data.result.latitude;
        formData.value.longitude = data.result.longitude;
      }
    } catch { /* silent */ }
  }, 600);
});

watch(() => formData.value.address, (val: string) => {
  if (val && errors.value.address) delete errors.value.address;
});

onMounted(() => {
  initializeavailability();
  fetchServices();
  fetchUserById();
});
</script>

<style>
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-2px);
  }

  75% {
    transform: translateX(2px);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }

  50% {
    transform: scale(1.2) rotate(0deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scale-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }

  50% {
    transform: scale(1.2) rotate(0deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Postcode lookup widget styles removed */

/* Custom time input styling */
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: all 0.2s ease;
}

input[type="time"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

input[type="time"]:disabled::-webkit-calendar-picker-indicator {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>