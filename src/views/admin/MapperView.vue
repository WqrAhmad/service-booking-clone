<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Staffs
        </button>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Staff Details</h1>
            <p class="text-gray-600 mt-2">View mapper profile and information</p>
          </div>
          <button v-if="canEditStaff" @click="editStaff"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Edit Staff
          </button>
        </div>
      </div>

      <div v-if="mapperDetails" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-xl p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p class="text-gray-900 font-medium">{{ mapperDetails.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
              <p class="text-gray-900 font-medium">{{ mapperDetails.business_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <a :href="`mailto:${mapperDetails.email}`" class="text-blue-600 hover:text-blue-700">
                {{ mapperDetails.email }}
              </a>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <a :href="`tel:${mapperDetails.phone}`" class="text-blue-600 hover:text-blue-700">
                {{ mapperDetails.phone }}
              </a>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p class="text-gray-900">{{ mapperDetails.address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Postcode</label>
              <p class="text-gray-900">{{ mapperDetails.post_code }}</p>
            </div>
            <div v-if="mapperDetails.website">
              <label class="block text-sm font-medium text-gray-500 mb-1">Website</label>
              <a :href="mapperDetails.website" target="_blank" class="text-blue-600 hover:text-blue-700">
                {{ mapperDetails.website }}
              </a>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="bg-white rounded-lg shadow-xl p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Services Offered</h2>

          <div v-if="mapperDetails.services && mapperDetails.services.length > 0" class="space-y-4">
            <div v-for="(service, index) in mapperDetails.services" :key="index"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <p class="font-semibold text-gray-900">{{ service.service?.name }}</p>
                    <span :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      service.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    ]">
                      {{ service.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <p v-if="service.description" class="text-sm text-gray-600 mb-2">{{ service.description }}</p>
                  <div class="flex gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Your Price (£):</span>
                      <span class="text-gray-900 font-medium ml-1">£{{ typeof service.price === 'number' ?
                        service.price.toFixed(2) : service.price }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            No services added yet
          </div>
        </div>

        <!-- Status Information -->
        <div class="bg-white rounded-lg shadow-xl p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Status & Statistics</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Availability Status</label>
              <span :class="[
                'px-3 py-1 inline-flex text-sm font-semibold rounded-full',
                mapperDetails.available
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]">
                {{ mapperDetails.available ? 'Available' : 'Not Available' }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">VAT Registered</label>
              <p class="text-gray-900">{{ mapperDetails.vat_registered ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Active Jobs</label>
              <p class="text-2xl font-bold text-gray-900">{{ mapperDetails.active_jobs || 0 }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Total Jobs</label>
              <p class="text-2xl font-bold text-gray-900">{{ mapperDetails.total_jobs || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="bg-white rounded-lg shadow-xl p-8 text-center">
        <p class="text-gray-500">Loading mapper details...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notificationService, userService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useStaffPermissions } from '@/composables/useStaffPermissions';

const route = useRoute();
const router = useRouter();
const { canEdit } = useStaffPermissions();
const canEditStaff = computed(() => canEdit('mapper'));
const mapperDetails: any = ref({});



onMounted(() => {
  const mapperId = route.query.id as string;
  fetchUserById(mapperId);
});

const fetchUserById = async (id: any) => {
  try {
    const res: any = await userService.getUserById(id);
    mapperDetails.value = res.data

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
const editStaff = () => {
  const id = route.query.id
  router.push({
    path: '/admin/mappers/edit',
    query: { id }
  });
};
</script>
