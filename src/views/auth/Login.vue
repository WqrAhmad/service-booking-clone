<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p class="text-gray-600">Login to your service provider account</p>
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
              v-model="formData.login"
              type="email"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.login ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your email address"
              @blur="validateEmail"
              @input="errors.login = ''"
            />
            <p v-if="errors.login" class="mt-1 text-sm text-red-600">{{ errors.login }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.password ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Enter your password"
                @blur="validatePassword"
                @input="errors.password = ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </router-link>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isLoading">Login</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="text-center pt-4">
            <p class="text-gray-600">
              Don't have an account?
              <!-- <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-semibold">
                Register here
              </router-link> -->
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
// Import your services
import { authService , notificationService } from '@/services/_singletons';
import { useAppStore } from '@/stores/index';

const router = useRouter();

interface FormData {
  login: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  login: string;
  password: string;
}

const formData = ref<FormData>({
  login: '',
  password: '',
  remember: false,
});

const errors = ref<FormErrors>({
  login: '',
  password: '',
});

const isLoading = ref(false);
const showPassword = ref(false);

// Validation functions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!formData.value.login) {
    errors.value.login = 'Email is required';
    return false;
  }
  
  if (!emailRegex.test(formData.value.login)) {
    errors.value.login = 'Please enter a valid email address';
    return false;
  }
  
  errors.value.login = '';
  return true;
};

const validatePassword = () => {
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
    return false;
  }
  
  if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    return false;
  }
  
  errors.value.password = '';
  return true;
};

const validateForm = () => {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  
  return isEmailValid && isPasswordValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    isLoading.value = true;
    const res = await authService.login(
      formData.value.login,
      formData.value.password,
      formData.value.remember
    );
    useAppStore().setLogin();
    notificationService.showSuccess(res.data.message || 'Login Successfully');
    
    // Role-based routing
    setTimeout(() => {
      const roleName = (res.data.user.role?.name || '').toLowerCase();
      if (roleName === 'admin') {
        router.push('/admin/dashboard');
      } else if (roleName === 'staff') {
        router.push('/admin/dashboard');
      } else if (roleName === 'mapper') {
        if (res.data.user.services && res.data.user.services.length === 0) {
          router.push('/mapper/profile');
        } else {
          router.push('/mapper/dashboard');
        }
      } else {
        router.push('/');
      }
    }, 500);
    
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>