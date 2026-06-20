<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Title Row -->
        <div class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-1">Staff Profile</h2>
              <p class="text-sm text-gray-600">Complete your profile information</p>
            </div>
            <div>
              <button type="submit" :disabled="isSubmitting"
                class="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
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
          </div>
        </div>

        <!-- Profile Form -->
        <div class="bg-white rounded-lg shadow-xl p-6">
          <div class="space-y-5">
            <!-- Basic Information Section -->
            <div class="border-b border-gray-200 pb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Business Name
                  </label>
                  <input id="businessName" v-model="formData.business_name" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your business name" />
                </div>
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
              <div class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input id="phoneNumber" v-model="formData.phone" type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      :class="{ 'border-red-500': errors.phone }" placeholder="Enter your phone number" />
                    <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
                  </div>
                  <div>
                    <label for="post_code" class="block text-sm font-medium text-gray-700 mb-1">
                      Post Code
                    </label>
                    <input id="post_code" v-model="formData.post_code" type="text"
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                      placeholder="e.g. SW1A 1AA" />
                  </div>
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input id="address" v-model="formData.address" type="text"
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter your full address" />
                  </div>


                </div>
              </div>

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



          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { notificationService, userService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useAppStore } from '@/stores/index';

const isLoading = ref(false);
const isSubmitting = ref(false);
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
});

const errors: any = ref({});





// Validation function
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  // Basic Information Validation
  if (!formData.value.name || formData.value.name.trim() === '') {
    errors.value.name = 'Full name is required';
    isValid = false;
  }



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

onMounted(() => {
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