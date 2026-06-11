<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Verify Your Code</h2>
        <p class="text-gray-600">Enter the 4-digit code sent to {{ maskedEmail }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Code Input Boxes -->
          <div class="flex justify-center gap-3 mb-6">
            <input
              v-for="index in 4"
              :key="index"
              :ref="el => inputRefs[index - 1] = el as HTMLInputElement"
              v-model="code[index - 1]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]*"
              :class="[
                'w-16 h-16 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.code ? 'border-red-500' : 'border-gray-300'
              ]"
              @input="handleInput(index - 1, $event)"
              @keydown="handleKeyDown(index - 1, $event)"
              @paste="handlePaste"
            />
          </div>
          <p v-if="errors.code" class="text-sm text-red-600 text-center -mt-4">{{ errors.code }}</p>

          <!-- Resend Code -->
          <div class="text-center">
            <p class="text-gray-600 text-sm">
              Didn't receive the code?
              <button
                type="button"
                @click="resendCode"
                class="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="resendCooldown > 0 || isResending"
              >
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Sending...' : 'Resend Code' }}
              </button>
            </p>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="!isCodeComplete || isLoading"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isLoading">Verify Code</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { authService, notificationService } from '@/services/_singletons';

const router = useRouter();

const code = ref<string[]>(['', '', '', '']);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const resendCooldown = ref(0);
const isLoading = ref(false);
const isResending = ref(false);
const email = ref('');

interface FormErrors {
  code: string;
}

const errors = ref<FormErrors>({
  code: '',
});

const isCodeComplete = computed(() => {
  return code.value.every(digit => digit !== '');
});

const maskedEmail = computed(() => {
  if (!email.value) return '***';
  const [username, domain] = email.value.split('@');
  const maskedUsername = username.substring(0, 2) + '***';
  return `${maskedUsername}@${domain}`;
});

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/[^0-9]/g, '');
  
  errors.value.code = '';
  
  if (value) {
    code.value[index] = value;
    
    if (index < 3 && inputRefs.value[index + 1]) {
      nextTick(() => {
        inputRefs.value[index + 1]?.focus();
      });
    }
  } else {
    code.value[index] = '';
  }
};

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
  
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < 3) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
  
  if (pastedData) {
    for (let i = 0; i < 4; i++) {
      code.value[i] = pastedData[i] || '';
    }
    const lastFilledIndex = Math.min(pastedData.length - 1, 3);
    nextTick(() => {
      inputRefs.value[lastFilledIndex]?.focus();
    });
  }
};

const resendCode = async () => {
  if (resendCooldown.value > 0 || isResending.value) return;
  
  try {
    isResending.value = true;
    const res:any = await authService.forgotPassword(email.value);
    
    notificationService.showSuccess(res.data.message || 'Verification code resent');
    
    // Start cooldown timer
    resendCooldown.value = 60;
    const timer = setInterval(() => {
      resendCooldown.value--;
      if (resendCooldown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
  } catch (e) {
    if (e instanceof AxiosError) {
      notificationService.showError(e.response?.data.message || 'Failed to resend code');
    }
  } finally {
    isResending.value = false;
  }
};

const handleSubmit = async () => {
  if (!isCodeComplete.value) {
    errors.value.code = 'Please enter the complete code';
    return;
  }

  const verificationCode = code.value.join('');
  
  try {
    isLoading.value = true;
    const res:any = await authService.sendOpt(verificationCode , email.value);
    
    notificationService.showSuccess(res.data.message || 'Code verified successfully');
    
    // Store verification token if provided
    if (res.data.token) {
      sessionStorage.setItem('reset_token', res.data.token);
    }
    
    setTimeout(() => {
      router.push('/reset-password');
    }, 500);
    
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      errors.value.code = e.response.data.message || 'Invalid verification code';
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      errors.value.code = 'Invalid or expired code';
      notificationService.showError(e.response?.data.message);
      return;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Get email from session storage
  const storedEmail = sessionStorage.getItem('reset_email');
  if (!storedEmail) {
    notificationService.showError('Session expired. Please start over.');
    router.push('/forgot-password');
    return;
  }
  email.value = storedEmail;
  
  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
});
</script>