<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Staffs
      </button>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="mb-4">

          <div class="flex justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-1">Add New Staff</h2>
              <p class="text-sm text-gray-600">Create a new service provider mapper account</p>
            </div>
            <div>
              <button type="submit" :disabled="isSubmitting"
                class="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                <span v-if="!isSubmitting">Create Staff</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Creating...
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Staff Form -->
        <div class="bg-white rounded-lg shadow-xl p-6">

          <!-- Basic Information Section -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input id="fullName" v-model="formData.name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.name }" placeholder="Enter full name" />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>

              <!-- Business Name -->
              <div>
                <label for="businessName" class="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span class="text-red-500">*</span>
                </label>
                <input id="businessName" v-model="formData.business_name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter business name" />
              </div>
              <!-- Phone Number -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input id="phoneNumber" v-model="formData.phone" type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.phone }" placeholder="Enter phone number" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
              </div>

              <!-- Email Address -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input id="email" v-model="formData.email" type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.email }" placeholder="Enter email address" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Address & Postcode -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label for="mapperAddress" class="block text-sm font-medium text-gray-700 mb-1">
                  Address <span class="text-red-500">*</span>
                </label>
                <input id="mapperAddress" v-model="formData.address" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter address" />
              </div>
              <div>
                <label for="mapperPostCode" class="block text-sm font-medium text-gray-700 mb-1">
                  Postcode <span class="text-red-500">*</span>
                </label>
                <input id="mapperPostCode" v-model="formData.post_code" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter postcode" />
              </div>
              <div class="mt-4">
                <span class="block text-sm font-medium text-gray-700 mb-3">
                  Login Access <span class="text-red-500">*</span>
                </span>
                <div class="flex items-center space-x-6">
                  <label class="inline-flex items-center">
                    <input type="radio" class="form-radio text-blue-600" v-model="formData.is_login" :value="1" />
                    <span class="ml-2 text-sm text-gray-700">Yes (create login for this mapper)</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" class="form-radio text-blue-600" v-model="formData.is_login" :value="0" />
                    <span class="ml-2 text-sm text-gray-700">No (no login)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Website -->




            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" v-if="formData.is_login">
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                    :class="{ 'border-red-500': errors.password }" placeholder="Enter password" />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
              </div>

              <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input id="password_confirmation" v-model="formData.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                    :class="{ 'border-red-500': errors.password_confirmation }" placeholder="Confirm password" />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.password_confirmation
                  }}</p>
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
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService, authService } from '@/services/_singletons';
import { AxiosError } from 'axios';

const router = useRouter();
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);


const formData = ref({
  name: '',
  business_name: '',
  phone: '',
  email: '',
  password: 'password',
  password_confirmation: 'password',
  post_code: '',
  address: '',
  is_login: 0,
  available: 'available' as string,
});

const errors: any = ref({});





// ─── Validation ──────────────────────────────────────────────────────
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;
  if (!formData.value.name?.trim()) { errors.value.name = 'Full name is required'; isValid = false; }
  if (!formData.value.email?.trim()) { errors.value.email = 'Email is required'; isValid = false; }
  // if (!formData.value.business_name?.trim()) { errors.value.business_name = 'Business name is required'; isValid = false; }
  // if (!formData.value.address?.trim()) { errors.value.address = 'Address is required'; isValid = false; }
  // if (!formData.value.post_code?.trim()) { errors.value.post_code = 'Postcode is required'; isValid = false; }
  if (!formData.value.phone?.trim()) { errors.value.phone = 'Phone number is required'; isValid = false; }

  if (!formData.value.email?.trim()) {
    errors.value.email = 'Email is required'; isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'; isValid = false;
  }

  if (formData.value.is_login === 1) {
    if (!formData.value.password?.trim()) {
      errors.value.password = 'Password is required'; isValid = false;
    } else if (formData.value.password.length < 6) {
      errors.value.password = 'Password must be at least 6 characters'; isValid = false;
    }
    if (!formData.value.password_confirmation?.trim()) {
      errors.value.password_confirmation = 'Please confirm your password'; isValid = false;
    } else if (formData.value.password !== formData.value.password_confirmation) {
      errors.value.password_confirmation = 'Passwords do not match'; isValid = false;
    }
  }
  return isValid;
};

// ─── Submit ───────────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (!validateForm()) {
    notificationService.showError('Please fill all required fields before submitting');
    return;
  }
  try {
    isSubmitting.value = true;
    const submitData: any = {
      name: formData.value.name,
      business_name: formData.value.business_name,
      phone: formData.value.phone,
      email: formData.value.email,
      post_code: formData.value.post_code,
      address: formData.value.address,
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation,
      is_login: formData.value.is_login,
      available: formData.value.available,
    };
    const res: any = await authService.registerMapper(submitData);
    notificationService.showSuccess(res.message);
    router.push('/admin/staff');
  } catch (e) {
    if (e instanceof AxiosError) notificationService.showError(e.response?.data?.message);
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
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

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}





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