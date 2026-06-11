<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Staffs</h1>
          <p class="text-gray-600 mt-2">View and manage all service provider mappers</p>
        </div>
        <div v-if="canAddStaff">
          <button @click="addStaff"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Staff
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input v-model="filters.search" @input="handleSearchInput" type="text"
              placeholder="Name, business, email..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <!-- Service Filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <div class="relative">
              <input :value="serviceDisplay" @focus="showServiceDropdown = true" @input="filterServiceOptions"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <div v-if="showServiceDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div @click="selectService('')" class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.service_id === '' }">
                  All Services
                </div>
                <div v-for="service in filteredServiceOptions" :key="service.id" @click="selectService(service.id)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.service_id === service.id }">
                  {{ service.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Availability Filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div class="relative">
              <input :value="availabilityDisplay" @focus="showAvailabilityDropdown = true"
                @input="filterAvailabilityOptions" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <div v-if="showAvailabilityDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div @click="selectAvailability('')" class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.availability === '' }">
                  All
                </div>
                <div v-for="option in filteredAvailabilityOptions" :key="option.value"
                  @click="selectAvailability(option.value)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.availability === option.value }">
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- Postcode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
            <input v-model="filters.postcode" @input="handlePostcodeInput" type="text" placeholder="Enter postcode"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button @click="resetFilters"
              class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Staffs Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading State -->
        <div v-if="listLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading mappers...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th @click="sortTable('full_name')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Staff
                    <span class="ml-2">
                      <svg v-if="sortBy === 'full_name' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'full_name' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th @click="sortTable('email')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Contact
                    <span class="ml-2">
                      <svg v-if="sortBy === 'email' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'email' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th @click="sortTable('postcode')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Location
                    <span class="ml-2">
                      <svg v-if="sortBy === 'postcode' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'postcode' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th @click="sortTable('is_available')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Status
                    <span class="ml-2">
                      <svg v-if="sortBy === 'is_available' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'is_available' && orderBy === 'desc'" class="w-4 h-4"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jobs
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="mapper in mapperList.data" :key="mapper.id" class="hover:bg-gray-50">

                <!-- Actions Dropdown -->
                <td class="px-2 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="relative inline-block actions-dropdown">
                    <button type="button" @click.stop="toggleActionsDropdown(mapper.id)"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title="Actions">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div v-if="actionsOpenId === mapper.id"
                      class="absolute left-0 z-20 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none block"
                      style="min-width: 10rem;">
                      <button type="button" @click.stop="closeAndRun(() => viewStaff(mapper.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        View
                      </button>
                      <button v-if="canEditStaff" type="button" @click.stop="closeAndRun(() => editStaff(mapper.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                        Edit
                      </button>
                      <button v-if="canDeleteStaff" type="button"
                        @click.stop="closeAndRun(() => deleteStaff(mapper.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ mapper.name }}</div>
                  <div class="text-sm text-gray-500">{{ mapper.business_name || '' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ mapper.email }}</div>
                  <div class="text-sm text-gray-500">{{ mapper.phone || '' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ mapper.post_code || '' }}</div>
                  <!-- <div class="text-sm text-gray-500">{{ mapper.address || '' }}</div> -->
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="service in (mapper?.services || []).slice(0, 2)" :key="service.id"
                      class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {{ service?.service?.name || '' }}
                    </span>
                    <span v-if="(mapper.services || []).length > 2"
                      class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{{ mapper.services.length - 2 }} more
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    mapper.available === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]">
                    {{ mapper.available === 'available' ? 'Available' : 'Not Available' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Active: {{ mapper.active_jobs || 0 }}</div>
                  <div class="text-gray-500">Total: {{ mapper.total_jobs || 0 }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!listLoading && (!mapperList.data || mapperList.data.length === 0)" class="p-8 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-500">No mappers found</p>
        </div>

        <!-- Pagination -->
        <div v-if="!listLoading && mapperList.data && mapperList.data.length > 0"
          class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="page === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button @click="nextPage" :disabled="page >= mapperList.meta.last_page"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ mapperList.meta.from || 0 }}</span>
                  to
                  <span class="font-medium">{{ mapperList.meta.to || 0 }}</span>
                  of
                  <span class="font-medium">{{ mapperList.meta.total || 0 }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <!-- Previous Button -->
                  <button @click="previousPage" :disabled="page === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>

                  <!-- Page Numbers -->
                  <button v-for="pageNum in visiblePages" :key="pageNum" @click="goToPage(pageNum)" :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    pageNum === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]">
                    {{ pageNum }}
                  </button>

                  <!-- Next Button -->
                  <button @click="nextPage" :disabled="page >= mapperList.last_page"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Items per page selector -->
          <div class="mt-3 flex items-center justify-end">
            <label for="itemsPerPage" class="text-sm text-gray-700 mr-2">Items per page:</label>
            <select id="itemsPerPage" v-model="itemsPerPage" @change="changeItemsPerPage"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { userService, notificationService, servicesService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import Swal from 'sweetalert2';

const router = useRouter();
const { canEdit, canDelete, canAdd } = useStaffPermissions();
const canAddStaff = computed(() => canAdd('mapper'));
const canEditStaff = computed(() => canEdit('mapper'));
const canDeleteStaff = computed(() => canDelete('mapper'));

const actionsOpenId = ref<string | number | null>(null);

const toggleActionsDropdown = (mapperId: string | number) => {
  actionsOpenId.value = actionsOpenId.value === mapperId ? null : mapperId;
};

const closeAndRun = (fn: () => void) => {
  actionsOpenId.value = null;
  fn();
};

const filters = ref({
  search: '',
  service_id: '',
  availability: '',
  postcode: '',
});

const mapperList: any = ref({
  data: [],
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0
})

const listLoading = ref(false);
const showServiceDropdown = ref(false);
const showAvailabilityDropdown = ref(false);
const serviceSearchQuery = ref('');
const availabilitySearchQuery = ref('');

const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref('id');
const orderBy = ref('desc');

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let postcodeTimeout: ReturnType<typeof setTimeout> | null = null;

const allServices: any = ref([]);

const availabilityOptions = [
  { value: 'available', label: 'Available' },
  { value: 'not_available', label: 'Not Available' },
];

const serviceDisplay = computed(() => {
  if (!filters.value.service_id) return '';
  const service = allServices.value.find((s: any) => s.id === filters.value.service_id);
  return service ? service.name : '';
});

const availabilityDisplay = computed(() => {
  if (!filters.value.availability) return '';
  const option = availabilityOptions.find(opt => opt.value === filters.value.availability);
  return option ? option.label : '';
});

const filteredServiceOptions = computed(() => {
  if (!serviceSearchQuery.value) return allServices.value;
  const query = serviceSearchQuery.value.toLowerCase();
  return allServices.value.filter((service: any) =>
    service.name.toLowerCase().includes(query)
  );
});

const filteredAvailabilityOptions = computed(() => {
  if (!availabilitySearchQuery.value) return availabilityOptions;
  const query = availabilitySearchQuery.value.toLowerCase();
  return availabilityOptions.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  );
});

const visiblePages = computed(() => {
  const total = mapperList.value.meta.last_page || 1
  const current = page.value
  const pages: number[] = []

  pages.push(1)

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }

  if (total > 1) {
    pages.push(total)
  }

  return [...new Set(pages)].sort((a, b) => a - b)
})


const selectService = (value: string) => {
  filters.value.service_id = value;
  showServiceDropdown.value = false;
  serviceSearchQuery.value = '';
  page.value = 1;
  fetchStaffs();
};

const selectAvailability = (value: string) => {
  filters.value.availability = value;
  showAvailabilityDropdown.value = false;
  availabilitySearchQuery.value = '';
  page.value = 1;
  fetchStaffs();
};

const filterServiceOptions = (event: Event) => {
  serviceSearchQuery.value = (event.target as HTMLInputElement).value;
};

const filterAvailabilityOptions = (event: Event) => {
  availabilitySearchQuery.value = (event.target as HTMLInputElement).value;
};

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchStaffs();
  }, 500);
};

const handlePostcodeInput = () => {
  if (postcodeTimeout) clearTimeout(postcodeTimeout);
  postcodeTimeout = setTimeout(() => {
    page.value = 1;
    fetchStaffs();
  }, 500);
};

const sortTable = (column: string) => {
  if (sortBy.value === column) {
    orderBy.value = orderBy.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    orderBy.value = 'asc';
  }
  page.value = 1;
  fetchStaffs();
};

const fetchStaffs = async () => {
  try {
    listLoading.value = true;

    const params: { key: string; value: any }[] = [
      { key: 'sort_column', value: sortBy.value },
      { key: 'sort_direction', value: orderBy.value },
      { key: 'per_page', value: itemsPerPage.value },
      { key: 'page', value: page.value },
    ];

    if (filters.value.search) params.push({ key: 'search', value: filters.value.search });
    if (filters.value.service_id) params.push({ key: 'service_id', value: filters.value.service_id });
    if (filters.value.availability) params.push({ key: 'available', value: filters.value.availability });
    if (filters.value.postcode) params.push({ key: 'post_code', value: filters.value.postcode });

    const res: any = await userService.getUserList(params);
    mapperList.value = res;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
    }
  } finally {
    listLoading.value = false;
  }
};

const fetchAllServices = async () => {
  try {
    const res: any = await servicesService.getServicesList([
      { key: 'take_all', value: 'true' },
      { key: 'status', value: 'active' }
    ]);
    allServices.value = res.data;
  } catch (e) {
    console.error('Error fetching services:', e);
  }
};

const resetFilters = () => {
  filters.value = { search: '', service_id: '', availability: '', postcode: '' };
  page.value = 1;
  fetchStaffs();
};

const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= mapperList.value.meta.last_page) {
    page.value = pageNum
    fetchStaffs()
  }
}
const nextPage = () => {
  if (page.value < mapperList.value.meta.last_page) {
    page.value++
    fetchStaffs()
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
    fetchStaffs()
  }
}
const changeItemsPerPage = () => {
  page.value = 1
  fetchStaffs()
}

const viewStaff = (id: string) => {
  router.push({ path: '/admin/mappers/view', query: { id } });
};

const addStaff = () => {
  router.push({ path: '/admin/mappers/add' });
};

const editStaff = (id: any) => {
  router.push({ path: '/admin/mappers/edit', query: { id } });
};

const deleteStaff = async (id: any) => {
  try {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete mapper',
      text: 'Are you sure you want to delete this mapper?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    });
    if (!result.isConfirmed) return;

    const res: any = await userService.deleteUser(id);
    notificationService.showSuccess(res.message);
    fetchStaffs();
    await Swal.fire({
      title: 'Deleted!',
      text: 'The mapper has been deleted.',
      icon: 'success',
      customClass: { container: 'sweet-alerts' },
    });
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

onMounted(() => {
  fetchStaffs();
  fetchAllServices();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      showServiceDropdown.value = false;
      showAvailabilityDropdown.value = false;
    }
    if (!target.closest('.actions-dropdown')) {
      actionsOpenId.value = null;
    }
  });
});
</script>