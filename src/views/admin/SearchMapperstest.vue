<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Search Mappers</h1>
        <p class="text-gray-600 mt-2">Find available mappers by location and service type</p>
      </div>

      <!-- Search Form -->
      <div class="bg-white rounded-lg shadow-xl p-6 mb-8">
        <form @submit.prevent="searchMappers" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Postcode -->
            <div>
              <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
                Postcode <span class="text-red-500">*</span>
              </label>
              <input
                id="postcode"
                v-model="searchForm.postcode"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g., SW1A 1AA"
              />
            </div>

            <!-- Service Type -->
            <div class="relative">
              <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <div class="relative">
                <input
                  id="serviceType"
                  :value="serviceTypeDisplay"
                  @focus="showServiceDropdown = true"
                  @input="filterServiceOptions"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Select service type or type to search"
                />
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                
                <!-- Dropdown -->
                <div
                  v-if="showServiceDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    @click="selectService('')"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': searchForm.serviceType === '' }"
                  >
                    All Services
                  </div>
                  <div
                    v-for="service in filteredServiceOptions"
                    :key="service.id"
                    @click="selectService(service.name)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': searchForm.serviceType === service.name }"
                  >
                    {{ service.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Radius -->
            <div class="relative">
              <label for="radius" class="block text-sm font-medium text-gray-700 mb-2">
                Search Radius
              </label>
              <div class="relative">
                <input
                  id="radius"
                  :value="radiusDisplay"
                  @focus="showRadiusDropdown = true"
                  @input="filterRadiusOptions"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Select radius"
                />
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                
                <!-- Dropdown -->
                <div
                  v-if="showRadiusDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    v-for="option in filteredRadiusOptions"
                    :key="option.value"
                    @click="selectRadius(option.value)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': searchForm.radius === option.value }"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search Mappers
            </button>
          </div>
        </form>
      </div>

      <!-- Results -->
      <div v-if="searchResults.length > 0" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            Found {{ searchResults.length }} mapper(s)
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="mapper in searchResults"
            :key="mapper.id"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ mapper.businessName }}</h3>
                <p class="text-sm text-gray-500">{{ mapper.fullName }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  mapper.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ mapper.isAvailable ? 'Available' : 'Not Available' }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ mapper.postcode }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949H19a2 2 0 002-2V7a2 2 0 00-2-2h-1.9a1 1 0 00-.9.684l-1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 01-5.516-5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498z" />
                </svg>
                {{ mapper.phoneNumber }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ mapper.email }}
              </div>
            </div>

            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Services Offered:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="service in mapper.services"
                  :key="service.name"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {{ service.name }} - £{{ service.price }}
                </span>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-1">Distance:</p>
              <p class="text-sm text-gray-600">{{ mapper.distance }} miles away</p>
            </div>

            <button
              @click="selectMapper(mapper)"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Select Mapper
            </button>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="hasSearched" class="bg-white rounded-lg shadow p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-600">No mappers found matching your criteria</p>
      </div>

      <!-- Initial State -->
      <div v-else class="bg-white rounded-lg shadow p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-600">Enter search criteria to find available mappers</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Service {
  name: string;
  price: number;
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface Mapper {
  id: string;
  fullName: string;
  businessName: string;
  postcode: string;
  phoneNumber: string;
  email: string;
  services: Service[];
  isAvailable: boolean;
  distance: number;
}

interface SearchForm {
  postcode: string;
  serviceType: string;
  radius: number;
}

const searchForm = ref<SearchForm>({
  postcode: '',
  serviceType: '',
  radius: 20,
});

const searchResults = ref<Mapper[]>([]);
const hasSearched = ref(false);
const availableServices = ref<ServiceType[]>([]);
const showRadiusDropdown = ref(false);
const radiusSearchQuery = ref('');
const showServiceDropdown = ref(false);
const serviceSearchQuery = ref('');

const radiusOptions = [
  { value: 10, label: '10 miles' },
  { value: 20, label: '20 miles' },
  { value: 30, label: '30 miles' },
  { value: 40, label: '40 miles' },
  { value: 50, label: '50 miles' },
  { value: 60, label: '60 miles' },
  { value: 70, label: '70 miles' },
  { value: 80, label: '80 miles' },
  { value: 90, label: '90 miles' },
  { value: 100, label: '100 miles' },
];

const radiusDisplay = computed(() => {
  const option = radiusOptions.find(opt => opt.value === searchForm.value.radius);
  return option ? option.label : '';
});

const serviceTypeDisplay = computed(() => {
  return searchForm.value.serviceType || '';
});

const filteredRadiusOptions = computed(() => {
  if (!radiusSearchQuery.value) {
    return radiusOptions;
  }
  const query = radiusSearchQuery.value.toLowerCase();
  return radiusOptions.filter(option => 
    option.label.toLowerCase().includes(query)
  );
});

const filteredServiceOptions = computed(() => {
  if (!serviceSearchQuery.value) {
    return availableServices.value;
  }
  const query = serviceSearchQuery.value.toLowerCase();
  return availableServices.value.filter(service => 
    service.name.toLowerCase().includes(query)
  );
});

const selectRadius = (value: number) => {
  searchForm.value.radius = value;
  showRadiusDropdown.value = false;
  radiusSearchQuery.value = '';
};

const selectService = (serviceName: string) => {
  searchForm.value.serviceType = serviceName;
  showServiceDropdown.value = false;
  serviceSearchQuery.value = '';
};

const filterRadiusOptions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  radiusSearchQuery.value = target.value;
};

const filterServiceOptions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  serviceSearchQuery.value = target.value;
};

onMounted(() => {
  fetchServices();
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      showRadiusDropdown.value = false;
      showServiceDropdown.value = false;
    }
  });
});

const fetchServices = async () => {
  // TODO: Fetch services from API
  // const response = await httpService.get('/admin/services?active=true');
  // availableServices.value = response.data;
  
  // Mock data
  availableServices.value = [
    { id: '1', name: 'Floor Mapping', description: 'Detailed floor mapping service', isActive: true },
    { id: '2', name: 'Property Survey', description: 'Comprehensive property survey', isActive: true },
    { id: '3', name: 'Site Inspection', description: 'On-site inspection and evaluation', isActive: true },
  ];
};

const searchMappers = async () => {
  hasSearched.value = true;
  // TODO: Implement API call to search mappers
  // const response = await httpService.post('/admin/search-mappers', searchForm.value);
  // searchResults.value = response.data;
  
  // Mock data for demonstration
  searchResults.value = [
    {
      id: '1',
      fullName: 'John Smith',
      businessName: 'Smith Mapping Services',
      postcode: 'SW1A 1AA',
      phoneNumber: '+44 20 1234 5678',
      email: 'john@smithmapping.com',
      services: [
        { name: 'Floor Mapping', price: 150 },
        { name: 'Property Survey', price: 200 },
      ],
      isAvailable: true,
      distance: 5.2,
    },
  ];
};

const selectMapper = (mapper: Mapper) => {
  // Navigate to job creation with mapper pre-selected
  router.push({
    path: '/admin/create-job',
    query: { mapperId: mapper.id },
  });
};
</script>
