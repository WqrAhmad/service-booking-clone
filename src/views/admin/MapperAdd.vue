<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-4">
        <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Staffs
        </button>
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Add New Staff</h2>
        <p class="text-sm text-gray-600">Create a new service provider mapper account</p>
      </div>

      <!-- Add Staff Form -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <form @submit.prevent="handleSubmit" class="space-y-5">
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
                  :class="{ 'border-red-500': errors.business_name }" placeholder="Enter business name" />
                <p v-if="errors.business_name" class="mt-1 text-xs text-red-500">{{ errors.business_name }}</p>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="mapperAddress" class="block text-sm font-medium text-gray-700 mb-1">
                  Address <span class="text-red-500">*</span>
                </label>
                <input id="mapperAddress" v-model="formData.address" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.address }" placeholder="Enter address" />
                <p v-if="errors.address" class="mt-1 text-xs text-red-500">{{ errors.address }}</p>
              </div>
              <div>
                <label for="mapperPostCode" class="block text-sm font-medium text-gray-700 mb-1">
                  Postcode <span class="text-red-500">*</span>
                </label>
                <input id="mapperPostCode" v-model="formData.post_code" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="{ 'border-red-500': errors.post_code }" placeholder="Enter postcode" />
                <p v-if="errors.post_code" class="mt-1 text-xs text-red-500">{{ errors.post_code }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <p class="text-gray-900 font-semibold text-sm">{{ service.name }}</p>
                    <p v-if="service.description" class="text-xs text-gray-500 mt-1">{{ service.description }}</p>
                  </div>
                  <div>
                    <div class="flex flex-row justify-between items-center mb-1">
                      <label :for="`service-price-${service.id}`" class="block text-sm font-medium text-gray-700">
                        Your Price (£) <span class="text-red-500">*</span>
                      </label>
                      <span class="flex flex-row items-center gap-2">
                        <div class="relative inline-block">
                          <input :id="`service-active-${service.id}`" type="checkbox"
                            :checked="getServiceData(service.id).is_active"
                            @change="updateServiceActive(service.id, ($event.target as HTMLInputElement).checked)"
                            class="sr-only peer" />
                          <label :for="`service-active-${service.id}`"
                            class="relative flex h-5 w-10 cursor-pointer items-center rounded-full transition-all duration-300 ease-in-out bg-red-200 peer-checked:bg-green-500 hover:shadow-md peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-red-300 peer-checked:peer-focus:ring-green-300">
                            <span
                              class="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:shadow-lg"></span>
                          </label>
                        </div>
                        <span class="text-xs font-medium transition-all duration-300 ease-in-out transform"
                          :class="getServiceData(service.id).is_active ? 'text-green-600 scale-100' : 'text-red-500 scale-95'">
                          {{ getServiceData(service.id).is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <span
                          class="inline-flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ease-in-out transform"
                          :class="getServiceData(service.id).is_active ? 'bg-green-100 text-green-600 scale-100 rotate-0' : 'bg-red-100 text-red-500 scale-90 rotate-180'">
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

          <!-- VAT Number Field (Conditional) -->
          <div v-if="formData.vat_registered === true" class="border-t border-gray-200 pt-4">
            <div>
              <label for="vatNumber" class="block text-sm font-medium text-gray-700 mb-1">
                VAT Number <span class="text-red-500">*</span>
              </label>
              <input id="vatNumber" v-model="formData.vat_number" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                :class="{ 'border-red-500': errors.vat_number }" placeholder="e.g., GB123456789" />
              <p v-if="errors.vat_number" class="mt-1 text-xs text-red-500">{{ errors.vat_number }}</p>
              <p class="mt-1 text-xs text-gray-500">Enter the VAT registration number</p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService, authService, servicesService } from '@/services/_singletons';
import { AxiosError } from 'axios';

const router = useRouter();
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  latitude: null as number | null,
  longitude: null as number | null,
  website: '',
  available: 'available' as string,
  vat_registered: false as boolean,
  mobile: false as boolean,
  garage: false as boolean,
  vat_number: '',
  services: [] as { service_id: string | number; price: string; is_active: boolean }[],
  availability: [] as { day: string; opening_time: string; closing_time: string; is_closed: boolean }[],
});

const errors: any = ref({});
const allServices: any = ref([]);

// ─── Availability ────────────────────────────────────────────────────
const initializeavailability = () => {
  if (formData.value.availability.length === 0) {
    formData.value.availability = daysOfWeek.map(day => ({
      day,
      opening_time: '09:00',
      closing_time: '17:00',
      is_closed: false,
    }));
  }
};



// ─── Services ────────────────────────────────────────────────────────
const getServiceData = (serviceId: string | number) => {
  return formData.value.services.find((s: any) => s.service_id === serviceId)
    || { service_id: serviceId, price: '', is_active: false };
};

const updateServicePrice = (serviceId: string | number, price: string) => {
  const index = formData.value.services.findIndex((s: any) => s.service_id === serviceId);
  if (index >= 0) {
    formData.value.services[index].price = price;
  } else {
    formData.value.services.push({ service_id: serviceId, price, is_active: false });
  }
  delete errors.value[`service_${serviceId}`];
};

const updateServiceActive = (serviceId: string | number, isActive: boolean) => {
  const index = formData.value.services.findIndex((s: any) => s.service_id === serviceId);
  if (index >= 0) {
    formData.value.services[index].is_active = isActive;
  } else {
    formData.value.services.push({ service_id: serviceId, price: '', is_active: isActive });
  }
};

const fetchServices = async () => {
  try {
    const res: any = await servicesService.getServicesList([
      { key: 'take_all', value: 'true' },
      { key: 'status', value: 'active' },
    ]);
    allServices.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError) notificationService.showError(e.response?.data?.message);
  }
};

// ─── Validation ──────────────────────────────────────────────────────
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.name?.trim()) { errors.value.name = 'Full name is required'; isValid = false; }
  if (!formData.value.business_name?.trim()) { errors.value.business_name = 'Business name is required'; isValid = false; }
  if (!formData.value.address?.trim()) { errors.value.address = 'Address is required'; isValid = false; }
  if (!formData.value.post_code?.trim()) { errors.value.post_code = 'Postcode is required'; isValid = false; }
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

  if (formData.value.website?.trim() && !/^https?:\/\/.+/.test(formData.value.website)) {
    errors.value.website = 'Please enter a valid URL (starting with http:// or https://)'; isValid = false;
  }

  if (formData.value.vat_registered === true && !formData.value.vat_number?.trim()) {
    errors.value.vat_number = 'VAT number is required when VAT registered'; isValid = false;
  }


  allServices.value.forEach((service: any) => {
    const sd = getServiceData(service.id);
    if (sd.is_active && (!sd.price || parseFloat(sd.price) <= 0)) {
      errors.value[`service_${service.id}`] = 'Price is required for active services'; isValid = false;
    }
  });
  if (!formData.value.services.some((s: any) => s.is_active)) {
    errors.value.services = 'Please activate at least one service'; isValid = false;
  }

  formData.value.availability.forEach((av: any, i: number) => {
    if (!av.is_closed) {
      if (!av.opening_time) { errors.value[`availability_${i}_opening`] = 'Opening time is required'; errors.value[`availability_${i}`] = 'Please set opening hours or mark as closed'; isValid = false; }
      if (!av.closing_time) { errors.value[`availability_${i}_closing`] = 'Closing time is required'; errors.value[`availability_${i}`] = 'Please set opening hours or mark as closed'; isValid = false; }
      if (av.opening_time && av.closing_time && av.opening_time >= av.closing_time) { errors.value[`availability_${i}`] = 'Closing time must be after opening time'; isValid = false; }
    }
  });

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
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      website: formData.value.website || null,
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation,
      is_login: formData.value.is_login,
      available: formData.value.available,
      vat_registered: formData.value.vat_registered,
      mobile: formData.value.mobile,
      garage: formData.value.garage,
      services: formData.value.services.filter((s: any) => s.is_active).map((s: any) => ({ service_id: s.service_id, price: parseFloat(s.price) || 0, is_active: true })),
      availability: formData.value.availability.map((a: any) => ({ day: a.day, opening_time: a.is_closed ? null : a.opening_time, closing_time: a.is_closed ? null : a.closing_time, is_closed: a.is_closed })),
    };
    if (formData.value.vat_registered === true) submitData.vat_number = formData.value.vat_number;

    const res: any = await authService.registerMapper(submitData);
    notificationService.showSuccess(res.data.message);
    router.push('/admin/mappers');
  } catch (e) {
    if (e instanceof AxiosError) notificationService.showError(e.response?.data?.message);
  } finally {
    isSubmitting.value = false;
  }
};

// ─── Geocode postcode in background ──────────────────────────────────
let postcodeTimer: ReturnType<typeof setTimeout> | null = null;
watch(() => formData.value.post_code, (pc) => {
  if (postcodeTimer) clearTimeout(postcodeTimer);
  if (!pc || pc.trim().length < 3) return;
  postcodeTimer = setTimeout(() => {
    fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc.trim())}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 200 && data.result) {
          formData.value.latitude = data.result.latitude;
          formData.value.longitude = data.result.longitude;
        }
      })
      .catch(() => { });
  }, 500);
});

// ─── onMounted ────────────────────────────────────────────────────────
onMounted(() => {
  initializeavailability();
  fetchServices();
});
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