<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p class="text-gray-600">Enter your new password below</p>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              New Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="formData.password"
                :type="showNewPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12',
                  errors.password ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Enter your new password"
                @blur="validateNewPassword"
                @input="errors.password = ''"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12',
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Confirm your new password"
                @blur="validateConfirmPassword"
                @input="errors.password_confirmation = ''"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
          </div>

          <!-- Password Strength Indicator -->
          <div v-if="formData.password" class="space-y-2">
            <p class="text-xs font-medium text-gray-700">Password Strength:</p>
            <div class="flex gap-1">
              <div
                v-for="(strength, index) in passwordStrength"
                :key="index"
                class="h-2 flex-1 rounded"
                :class="strength"
              ></div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isLoading">Reset Password</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            </button>
          </div>

          <!-- Back to Login -->
          <div class="text-center pt-4">
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              ← Back to Login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { authService, notificationService } from '@/services/_singletons';

const router = useRouter();

interface FormData {
  email: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  password: string;
  password_confirmation: string;
}

const formData = ref<FormData>({
  email: '',
  password: '',
  password_confirmation: '',
});

const errors = ref<FormErrors>({
  password: '',
  password_confirmation: '',
});

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

const validateNewPassword = () => {
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
    return false;
  }
  
  if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
    return false;
  }
  
  errors.value.password = '';
  return true;
};

const validateConfirmPassword = () => {
  if (!formData.value.password_confirmation) {
    errors.value.password_confirmation = 'Please confirm your password';
    return false;
  }
  
  if (formData.value.password !== formData.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match';
    return false;
  }
  
  errors.value.password_confirmation = '';
  return true;
};

const passwordStrength = computed(() => {
  const password = formData.value.password;
  if (!password) return ['bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const colors: any = [];
  for (let i = 0; i < 4; i++) {
    if (i < strength) {
      if (strength <= 2) colors.push('bg-red-500');
      else if (strength === 3) colors.push('bg-yellow-500');
      else colors.push('bg-green-500');
    } else {
      colors.push('bg-gray-200');
    }
  }
  
  return colors;
});

const isFormValid = computed(() => {
  return (
    formData.value.password.length >= 8 &&
    formData.value.password === formData.value.password_confirmation &&
    formData.value.password_confirmation.length > 0
  );
});

const handleSubmit = async () => {
  const isPasswordValid = validateNewPassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (!isPasswordValid || !isConfirmPasswordValid) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    const res:any = await authService.resetPassword(
      formData.value.email,
      formData.value.password,
      formData.value.password_confirmation
    );
    
    notificationService.showSuccess(res.data.message || 'Password reset successfully');
    
    // Clear session storage
    sessionStorage.removeItem('reset_email');
    
    setTimeout(() => {
      router.push('/login');
    }, 1000);
    
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message || 'Failed to reset password');
      return;
    }
    notificationService.showError('An error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const storedEmail = sessionStorage.getItem('reset_email');
  if (!storedEmail) {
    notificationService.showError('Session expired. Please start over.');
    router.push('/forgot-password');
    return;
  }
  formData.value.email = storedEmail;
});
</script>