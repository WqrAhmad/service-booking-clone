<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
        <p class="text-gray-600">Enter your email address and we'll send you a verification code</p>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.email ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your email address"
              @blur="validateEmail"
              @input="errors.email = ''"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isLoading">Send Verification Code</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
          </div>

          <!-- Login Link -->
          <div class="text-center pt-4">
            <p class="text-gray-600">
              Remember your password?
              <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
                Login here
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { authService, notificationService } from '@/services/_singletons';

const router = useRouter();

interface FormData {
  email: string;
}

interface FormErrors {
  email: string;
}

const formData = ref<FormData>({
  email: '',
});

const errors = ref<FormErrors>({
  email: '',
});

const isLoading = ref(false);

// Validation function
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
    return false;
  }
  
  if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    return false;
  }
  
  errors.value.email = '';
  return true;
};

const handleSubmit = async () => {
  if (!validateEmail()) {
    return;
  }

  try {
    isLoading.value = true;
    const res:any = await authService.forgotPassword(formData.value.email);
    
    notificationService.showSuccess(res.data.message || 'Verification code sent to your email');
    
    // Store email in session/local storage for verification page
    sessionStorage.setItem('reset_email', formData.value.email);
    
    setTimeout(() => {
      router.push('/code-verification');
    }, 500);
    
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 404) {
      notificationService.showError('Email address not found');
      return;
    }
    notificationService.showError('An error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>