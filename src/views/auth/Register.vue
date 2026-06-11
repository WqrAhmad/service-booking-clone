<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
        <p class="text-gray-600">Register to start managing your service provider business</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Full Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              v-model="formData.name"
              type="text"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.name ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your full name"
              @blur="validateFullName"
              @input="errors.name = ''"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="businessName" class="block text-sm font-medium text-gray-700 mb-2">
              Business Name <span class="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              v-model="formData.business_name"
              type="text"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.business_name ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your business name"
              @blur="validateBusinessName"
              @input="errors.business_name = ''"
            />
            <p v-if="errors.business_name" class="mt-1 text-sm text-red-600">{{ errors.business_name }}</p>
          </div>
</div>          <!-- Address -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              v-model="formData.phone"
              type="tel"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.phone ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your phone number"
              @blur="validatePhone"
              @input="errors.phone = ''"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Email Address -->
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
 </div>

          <!-- Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Confirm your password"
                @blur="validateConfirmPassword"
                @input="errors.password_confirmation = ''"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
          </div>
          </div>

          <!-- Website (Optional) -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              id="website"
              v-model="formData.website"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address <span class="text-red-500">*</span>
            </label>
            <input
              id="address"
              ref="addressInput"
              v-model="formData.address"
              type="text"
              autocomplete="off"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.address ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Start typing UK address"
              @blur="validateAddress"
              @input="errors.address = ''"
            />
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>

          <!-- Postcode (auto-filled from address) -->
          <div>
            <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
              Postcode <span class="text-red-500">*</span>
            </label>
            <input
              id="postcode"
              v-model="formData.post_code"
              type="text"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                errors.post_code ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="e.g., SW1A 1AA"
              @blur="validatePostcode"
              @input="errors.post_code = ''"
            />
            <p v-if="errors.post_code" class="mt-1 text-sm text-red-600">{{ errors.post_code }}</p>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isLoading">Register</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            </button>
          </div>

          <!-- Login Link -->
          <div class="text-center pt-4">
            <p class="text-gray-600">
              Already have an account?
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { authService, notificationService } from '@/services/_singletons';

const router = useRouter();
const addressInput = ref<HTMLInputElement | null>(null);

interface FormData {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  post_code: string;
  latitude: number | null;
  longitude: number | null;
  website: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  post_code: string;
  password: string;
  password_confirmation: string;
}

const formData = ref<FormData>({
  name: '',
  business_name: '',
  email: '',
  phone: '',
  address: '',
  post_code: '',
  latitude: null,
  longitude: null,
  website: '',
  password: '',
  password_confirmation: '',
});

const errors = ref<FormErrors>({
  name: '',
  business_name: '',
  email: '',
  phone: '',
  address: '',
  post_code: '',
  password: '',
  password_confirmation: '',
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Initialize Google Places Autocomplete for address (restricted to UK)
const initAddressAutocomplete = () => {
  if (!addressInput.value) return;
  const googleObj = (window as any).google;
  if (!googleObj?.maps?.places?.Autocomplete) return;

  const autocomplete = new googleObj.maps.places.Autocomplete(addressInput.value, {
    fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    types: ['address'],
    componentRestrictions: { country: 'gb' }, // Restrict to UK
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place) return;

    if (place.formatted_address) {
      formData.value.address = place.formatted_address;
    } else if (place.name) {
      formData.value.address = place.name;
    }

    // Extract postcode from address components
    if (place.address_components && Array.isArray(place.address_components)) {
      const postalComponent = place.address_components.find((component: any) =>
        component.types?.includes('postal_code')
      );

      if (postalComponent) {
        formData.value.post_code =
          postalComponent.long_name || postalComponent.short_name || formData.value.post_code;
      }
    }

    // Extract latitude and longitude from geometry
    if (place.geometry?.location) {
      const lat = typeof place.geometry.location.lat === 'function'
        ? place.geometry.location.lat()
        : place.geometry.location.lat;
      const lng = typeof place.geometry.location.lng === 'function'
        ? place.geometry.location.lng()
        : place.geometry.location.lng;

      formData.value.latitude = lat;
      formData.value.longitude = lng;
    }

    // Clear address error after selection
    errors.value.address = '';
  });
};

// Validation functions
const validateFullName = () => {
  if (!formData.value.name.trim()) {
    errors.value.name = 'Full name is required';
    return false;
  }
  
  if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Full name must be at least 2 characters';
    return false;
  }
  
  errors.value.name = '';
  return true;
};

const validateBusinessName = () => {
  if (!formData.value.business_name.trim()) {
    errors.value.business_name = 'Business name is required';
    return false;
  }
  
  if (formData.value.business_name.trim().length < 2) {
    errors.value.business_name = 'Business name must be at least 2 characters';
    return false;
  }
  
  errors.value.business_name = '';
  return true;
};

const validatePhone = () => {
  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Phone number is required';
    return false;
  }
  
  errors.value.phone = '';
  return true;
};

const validateAddress = () => {
  if (!formData.value.address.trim()) {
    errors.value.address = 'Address is required';
    return false;
  }
  
  errors.value.address = '';
  return true;
};

const validatePostcode = () => {
  if (!formData.value.post_code.trim()) {
    errors.value.post_code = 'Postcode is required';
    return false;
  }
  
  errors.value.post_code = '';
  return true;
};

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

const validateForm = () => {
  const isFullNameValid = validateFullName();
  const isBusinessNameValid = validateBusinessName();
  const isPhoneValid = validatePhone();
  const isAddressValid = validateAddress();
  const isPostcodeValid = validatePostcode();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  return (
    isFullNameValid &&
    isBusinessNameValid &&
    isPhoneValid &&
    isAddressValid &&
    isPostcodeValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  );
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // Prepare data for API
    const registrationData:any = {
      name: formData.value.name,
      business_name: formData.value.business_name,
      address: formData.value.address,
      post_code: formData.value.post_code,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      phone: formData.value.phone,
      email: formData.value.email,
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation,
      website: formData.value.website || null,
    };
    
    const res:any = await authService.signUp(registrationData);
    console.log(res , 'res');
    notificationService.showSuccess(res.message);
    sessionStorage.setItem('register_email', formData.value.email);
    router.push('/register-otp');
    
    
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

onMounted(() => {
  initAddressAutocomplete();
});
</script>