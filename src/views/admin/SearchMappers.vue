<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ pageMode === 'edit' ? 'Edit Job' : pageMode === 'duplicate' ? 'Duplicate Job' : 'Create Job' }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ pageMode === 'edit' ? 'Update job details and mapper' : pageMode === 'duplicate' ?
            'Create a copy with a new mapper and address' : 'Find available mappers and create a new job' }}
        </p>
      </div>

      <!-- Loading job for edit/duplicate -->
      <div v-if="loadingJob"
        class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
        <svg class="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="text-blue-800">Loading job...</span>
      </div>

      <form v-else @submit.prevent="submitJob" class="space-y-8">

        <!-- ═══════════════════════════════════════════ -->
        <!-- Vehicle Lookup Section                      -->
        <!-- ═══════════════════════════════════════════ -->
        <div class="bg-white rounded-lg shadow-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="registration" class="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Registration <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <input id="registration" v-model="formData.registration" type="text"
                  class="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                  placeholder="e.g., W4LAL"
                  @input="formData.registration = ($event.target as HTMLInputElement).value.toUpperCase()" />
                <button type="button" @click="lookupVehicle" :disabled="loadingVehicle"
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {{ loadingVehicle ? 'Looking up...' : 'Lookup' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Vehicle Details Display -->
          <div v-if="vehicleDetails && vehicleDetails.id" class="mt-6">
            <div
              class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-2xl overflow-hidden">
              <div class="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-6">
                    <div class="bg-white rounded-lg p-4 shadow-lg">
                      <img v-if="engineDetails?.brand_image" :src="engineDetails.brand_image"
                        :alt="vehicleDetails.name || 'Vehicle Brand'" class="h-16 w-auto" />
                    </div>
                    <div class="text-white">
                      <h2 class="text-3xl font-bold mb-1">{{ vehicleDetails.name || '' }}</h2>
                      <div class="flex items-center space-x-4 text-blue-100">
                        <span class="text-lg font-semibold bg-white/20 px-3 py-1 rounded">{{ formData.registration
                        }}</span>
                        <span class="text-sm">{{ vehicleDetails.year }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="hidden lg:flex space-x-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                      <div class="text-2xl font-bold text-white">{{ engineDetails?.horsepower_white }}hp</div>
                      <div class="text-xs text-blue-100">Power</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                      <div class="text-2xl font-bold text-white">{{ engineDetails?.torque_white }}Nm</div>
                      <div class="text-xs text-blue-100">Torque</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div class="lg:col-span-4 space-y-4">
                    <h3 class="text-lg font-semibold text-white mb-3">Vehicle Details</h3>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Energy</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.energy || 'N/A' }}</p>
                      </div>
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Engine Number</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.engine_number || 'N/A' }}
                        </p>
                      </div>
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Compression Ratio</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.compression_ratio || 'N/A'
                        }}</p>
                      </div>
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Bore Stroke Ratio</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.bore_stroke_ratio || 'N/A'
                        }}</p>
                      </div>
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Method</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.method || 'N/A' }}</p>
                      </div>
                      <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p class="text-xs text-gray-400 mb-1">Cylinder Content</p>
                        <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.['Cylinder content'] ||
                          'N/A' }}</p>
                      </div>
                    </div>
                    <div
                      class="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
                      <h4 class="text-sm font-semibold text-blue-300 mb-2">Engine ECU</h4>
                      <p class="text-xs text-white">{{ engineDetails?.specz?.engine_ecu || 'N/A' }}</p>
                    </div>
                  </div>

                  <div class="lg:col-span-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        class="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-400/30">
                        <div class="flex items-start justify-between mb-4">
                          <div>
                            <h3 class="text-lg font-bold text-white mb-1">Engine Power</h3>
                            <p class="text-xs text-gray-400">Performance Increase</p>
                          </div>
                          <div class="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                            <span class="text-xl font-bold">{{ Math.round((engineDetails?.horsepower_white -
                              engineDetails?.horsepower_original) / engineDetails?.horsepower_original * 100) }}%</span>
                          </div>
                        </div>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Stock</span>
                            <span class="text-2xl font-bold text-gray-300">{{ engineDetails?.horsepower_original }}<span
                                class="text-sm">hp</span></span>
                          </div>
                          <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                              :style="{ width: `${(engineDetails?.horsepower_original / engineDetails?.horsepower_white) * 100}%` }">
                            </div>
                          </div>
                          <div class="flex justify-between items-center mt-4">
                            <span class="text-sm text-gray-400">Tuned</span>
                            <span class="text-2xl font-bold text-white">{{ engineDetails?.horsepower_white }}<span
                                class="text-sm">hp</span></span>
                          </div>
                          <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                              style="width: 100%"></div>
                          </div>
                          <div class="mt-4 pt-4 border-t border-white/10 text-center">
                            <span class="text-lg text-red-400 font-bold">+{{ engineDetails?.horsepower_white -
                              engineDetails?.horsepower_original }}hp gain</span>
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
                        <div class="flex items-start justify-between mb-4">
                          <div>
                            <h3 class="text-lg font-bold text-white mb-1">Engine Torque</h3>
                            <p class="text-xs text-gray-400">Performance Increase</p>
                          </div>
                          <div class="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                            <span class="text-xl font-bold">{{ Math.round((engineDetails?.torque_white -
                              engineDetails?.torque_original) / engineDetails?.torque_original * 100) }}%</span>
                          </div>
                        </div>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Stock</span>
                            <span class="text-2xl font-bold text-gray-300">{{ engineDetails?.torque_original }}<span
                                class="text-sm">Nm</span></span>
                          </div>
                          <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                              :style="{ width: `${(engineDetails?.torque_original / engineDetails?.torque_white) * 100}%` }">
                            </div>
                          </div>
                          <div class="flex justify-between items-center mt-4">
                            <span class="text-sm text-gray-400">Tuned</span>
                            <span class="text-2xl font-bold text-white">{{ engineDetails?.torque_white }}<span
                                class="text-sm">Nm</span></span>
                          </div>
                          <div class="w-full bg-white/10 rounded-full h-2">
                            <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style="width: 100%"></div>
                          </div>
                          <div class="mt-4 pt-4 border-t border-white/10 text-center">
                            <span class="text-lg text-blue-400 font-bold">+{{ engineDetails?.torque_white -
                              engineDetails?.torque_original }}Nm gain</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="engineDetails?.options && engineDetails?.options.length > 0"
                      class="mt-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <h4 class="text-sm font-semibold text-white mb-3">Available Tuning Options</h4>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="option in engineDetails?.options" :key="option"
                          class="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-medium">
                          {{ formatOption(option) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vehicle Loading -->
          <div v-if="loadingVehicle" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <p class="text-blue-800">Fetching vehicle information...</p>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════ -->
        <!-- Customer Information Section                -->
        <!-- ═══════════════════════════════════════════ -->
        <div class="bg-white rounded-lg shadow-xl p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Customer Information</h3>

          <!-- Row 1: Name + Email + Phone -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="customerName" class="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span class="text-red-500">*</span>
              </label>
              <input id="customerName" v-model="formData.customerName" type="text"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                :class="errors.customerName ? 'border-red-500' : 'border-gray-300'" placeholder="Enter customer name" />
              <p v-if="errors.customerName" class="mt-1 text-xs text-red-500">{{ errors.customerName }}</p>
            </div>
            <div>
              <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Customer Email <span class="text-red-500">*</span>
              </label>
              <input id="customerEmail" v-model="formData.customerEmail" type="email"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                :class="errors.customerEmail ? 'border-red-500' : 'border-gray-300'"
                placeholder="customer@example.com" />
              <p v-if="errors.customerEmail" class="mt-1 text-xs text-red-500">{{ errors.customerEmail }}</p>
            </div>
            <div>
              <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Customer Phone
              </label>
              <input id="customerPhone" v-model="formData.customerPhone" type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="+44 20 1234 5678" />
            </div>
          </div>

          <!-- Row 2: Date + Time -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            <div>
              <label for="scheduledDate" class="block text-sm font-medium text-gray-700 mb-2">
                Date <span class="text-red-500">*</span>
              </label>
              <el-date-picker v-model="formData.scheduledDate" type="date" placeholder="Select date" format="DD/MM/YYYY"
                value-format="YYYY-MM-DD" :disabled-date="disablePastDates" :clearable="false" @change="mergeDateTime"
                class="!w-full custom-date-picker" style="min-height: 48px;"
                :class="errors.scheduled_at ? 'date-picker-error' : ''" popper-class="custom-date-popper" />
              <p v-if="errors.scheduled_at && !formData.scheduledDate" class="mt-1 text-xs text-red-500">Date is
                required</p>
            </div>
            <div>
              <label for="scheduledTime" class="block text-sm font-medium text-gray-700 mb-2">
                Time <span class="text-red-500">*</span>
              </label>
              <input id="scheduledTime" v-model="formData.scheduledTime" type="time" @change="mergeDateTime"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                :class="errors.scheduled_at && !formData.scheduledTime ? 'border-red-500' : 'border-gray-300'" />
              <p v-if="errors.scheduled_at && !formData.scheduledTime" class="mt-1 text-xs text-red-500">Time is
                required</p>
              <p v-if="errors.scheduled_at && formData.scheduledDate && formData.scheduledTime"
                class="mt-1 text-xs text-red-500">{{ errors.scheduled_at }}</p>
            </div>
          </div>

          <!-- Row 3: Postcode + Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label for="jobPostcode" class="block text-sm font-medium text-gray-700 mb-2">
                Job Postcode <span class="text-red-500">*</span>
              </label>
              <input id="jobPostcode" v-model="formData.jobPostcode" type="text"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                :class="errors.jobPostcode ? 'border-red-500' : 'border-gray-300'" placeholder="e.g. SW1A 1AA" />
              <p v-if="errors.jobPostcode" class="mt-1 text-xs text-red-500">{{ errors.jobPostcode }}</p>
            </div>
            <div>
              <label for="jobAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Job Address
              </label>
              <input id="jobAddress" v-model="formData.jobAddress" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter job address" />
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════ -->
        <!-- Staff Search Section                       -->
        <!-- ═══════════════════════════════════════════ -->
        <div class="bg-white rounded-lg shadow-xl p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Find Staff</h3>
          <p class="text-sm text-gray-600 mb-4">Staffs are searched by the <strong>Job Postcode</strong> entered in
            Customer Information above.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Service Type -->
            <div class="relative">
              <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-2">
                Service Type <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input id="serviceType" :value="serviceTypeDisplay" @focus="showServiceDropdown = true"
                  @input="filterServiceOptions" type="text"
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="errors.serviceId ? 'border-red-500' : 'border-gray-300'" placeholder="Select service type" />
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <div v-if="showServiceDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div v-for="service in filteredServiceOptions" :key="service.id" @click="selectService(service)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': searchCriteria.serviceId === service.id }">
                    {{ service.name }}
                  </div>
                </div>
              </div>
              <p v-if="errors.serviceId" class="mt-1 text-xs text-red-500">{{ errors.serviceId }}</p>
            </div>

            <!-- Radius -->
            <div class="relative">
              <label for="radius" class="block text-sm font-medium text-gray-700 mb-2">
                Search Radius
              </label>
              <div class="relative">
                <input id="radius" :value="radiusDisplay" @focus="showRadiusDropdown = true"
                  @input="filterRadiusOptions" type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Select radius" />
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <div v-if="showRadiusDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div v-for="option in filteredRadiusOptions" :key="option.value" @click="selectRadius(option.value)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': searchCriteria.radius === option.value }">
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Button -->
          <div class="mt-6 flex justify-end">
            <button type="button" @click="searchStaffs"
              :disabled="loadingStaffs || !formData.jobPostcode || !searchCriteria.serviceId"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {{ loadingStaffs ? 'Searching...' : 'Search Staffs' }}
            </button>
          </div>

          <!-- Loading Staffs -->
          <div v-if="loadingStaffs" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <p class="text-blue-800">Searching for available mappers...</p>
            </div>
          </div>

          <!-- Staff Results -->
          <div v-if="searchResults.length > 0 && !loadingStaffs" class="mt-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-gray-900">Available Staffs ({{ searchResults.length }})</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="mapper in searchResults" :key="mapper.id"
                class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                :class="{ 'ring-2 ring-blue-500': formData.mapperId === mapper.id }">
                <!-- Staff Header -->
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ mapper.business_name }}</h3>
                    <p class="text-sm text-gray-500">{{ mapper.name }}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Distance: {{ getDistance(mapper.latitude, mapper.longitude, formData.jobLatitude,
                      formData.jobLongitude) }}
                  </span>
                </div>

                <!-- Staff Contact -->
                <div class="space-y-2 mb-4">
                  <div class="flex items-start text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ mapper.address }}<span v-if="mapper.address && mapper.post_code">, </span>{{
                      mapper.post_code }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ mapper.phone }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ mapper.email }}
                  </div>
                </div>

                <!-- Map Embed -->
                <div v-if="getStaffLat(mapper) != null && getStaffLng(mapper) != null"
                  class="mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <a :href="mapperMapLink(mapper)" target="_blank" rel="noopener noreferrer"
                    class="block w-full h-24 sm:h-28 relative group"
                    :title="'View ' + (mapper.business_name || mapper.name) + ' on map'">
                    <iframe :src="mapperEmbedMapUrl(mapper)" class="w-full h-full border-0 pointer-events-none"
                      loading="lazy" />
                    <span class="absolute inset-0 group-hover:bg-black/5 transition-colors" />
                    <span
                      class="absolute bottom-1 right-1 text-[10px] text-gray-500 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">View
                      on map ↗</span>
                  </a>
                </div>

                <!-- Selected Services Pricing Table -->
                <div v-if="getStaffSelectedServices(mapper).length > 0"
                  class="mb-4 rounded-xl border border-gray-200/80 bg-gradient-to-b from-slate-50 to-gray-50/80 overflow-hidden">
                  <div class="px-3.5 py-2 border-b border-gray-200/60 bg-white/60 flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">Selected Services</span>
                    <span class="text-xs text-gray-400 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      {{ getStaffSelectedServices(mapper).length }} service{{ getStaffSelectedServices(mapper).length
                        !== 1 ? 's' : '' }}
                    </span>
                  </div>
                  <div class="px-3.5 py-3">
                    <table class="w-full text-sm">
                      <thead>
                        <tr>
                          <td class="pb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Service</td>
                          <td class="pb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Fee
                          </td>
                          <td class="pb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">
                            Deposit</td>
                          <td class="pb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Total
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="sel in getStaffSelectedServices(mapper)" :key="sel.serviceId"
                          class="border-t border-gray-100">
                          <td class="py-1.5 text-gray-800 font-medium">{{ sel.serviceName }}</td>
                          <td class="py-1.5 text-right tabular-nums text-gray-900">£{{ Number(sel.price).toFixed(2) }}
                          </td>
                          <td class="py-1.5 text-right tabular-nums text-gray-900">£{{
                            Number(sel.platformFee).toFixed(2) }}</td>
                          <td class="py-1.5 text-right tabular-nums font-semibold text-blue-700">
                            £{{ (Number(sel.price) + Number(sel.platformFee)).toFixed(2) }}
                          </td>
                        </tr>
                        <tr v-if="getStaffSelectedServices(mapper).length > 1" class="border-t-2 border-gray-200">
                          <td class="pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wide" colspan="3">Grand
                            Total</td>
                          <td class="pt-2 text-right tabular-nums text-base font-bold text-blue-700">
                            £{{getStaffSelectedServices(mapper).reduce((sum, s) => sum + Number(s.price) +
                              Number(s.platformFee), 0).toFixed(2)}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Fallback: original pricing -->
                <div v-else-if="getSelectedServicePrice(mapper) || selectedServicePlatformFee > 0"
                  class="mb-4 rounded-xl border border-gray-200/80 bg-gradient-to-b from-slate-50 to-gray-50/80 overflow-hidden">
                  <div class="px-3.5 py-2 border-b border-gray-200/60 bg-white/60">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{
                      searchCriteria.serviceName }}</span>
                  </div>
                  <div class="px-3.5 py-3">
                    <table class="w-full text-sm">
                      <tbody>
                        <tr>
                          <td class="py-1.5 text-gray-600">Service Fee</td>
                          <td class="py-1.5 text-gray-600">Deposit Fee</td>
                          <td class="py-1.5 font-semibold text-gray-900">Total</td>
                        </tr>
                        <tr v-if="selectedServicePlatformFee > 0">
                          <td class="py-1.5 text-left font-medium tabular-nums text-gray-900">£{{
                            getSelectedServicePrice(mapper) }}</td>
                          <td class="py-1.5 text-left font-medium tabular-nums text-gray-900">£{{
                            selectedServicePlatformFee.toFixed(2) }}</td>
                          <td class="py-1.5 text-left text-base font-semibold tabular-nums text-blue-700">£{{
                            getTotalQuotedPrice(mapper) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                  <button type="button" @click="openServicesDialog(mapper)"
                    class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    All Services
                  </button>
                  <button type="button" @click="selectStaff(mapper)"
                    class="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-white"
                    :class="formData.mapperId === mapper.id ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'">
                    {{ formData.mapperId === mapper.id ? '✓ Selected' : 'Select Staff' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit mode: show currently assigned mapper when no search done yet -->
          <div v-if="pageMode === 'edit' && !hasSearched && formData.mapperId && formData.mapperName"
            class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-green-800">Currently assigned mapper: {{ formData.mapperName }}</p>
              <p class="text-xs text-green-600 mt-0.5">Search mappers above to assign a different one, or keep the
                current assignment.</p>
            </div>
          </div>

          <p v-if="errors.mapperId && searchResults.length === 0" class="mt-4 text-xs text-red-500 text-center">{{
            errors.mapperId }}</p>

          <div v-else-if="hasSearched && !loadingStaffs && searchResults.length === 0"
            class="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600">No mappers found. Try adjusting your search criteria.</p>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4">
          <button type="button" @click="router.back()"
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200">
            Cancel
          </button>
          <button v-if="canAddJob" type="submit" :disabled="submitting"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ submitting
              ? (pageMode === 'edit' ? 'Updating...' : 'Creating Job...')
              : (pageMode === 'edit' ? 'Update Job' : pageMode === 'duplicate' ? 'Create Duplicate Job' : 'Create Job')
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- Staff Services & Prices Dialog                    -->
    <!-- ═══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="servicesDialog.open" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeServicesDialog">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeServicesDialog" />
          <div
            class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            @click.stop>

            <!-- Dialog Header -->
            <div
              class="bg-gradient-to-r from-slate-800 to-blue-900 px-6 py-5 flex items-start justify-between shrink-0">
              <div>
                <h2 class="text-xl font-bold text-white">{{ servicesDialog.mapper?.business_name }}</h2>
                <p class="text-blue-200 text-sm mt-0.5">{{ servicesDialog.mapper?.name }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', servicesDialog.mapper?.available === 'available' ? 'bg-green-400/20 text-green-300 ring-1 ring-green-400/30' : 'bg-red-400/20 text-red-300 ring-1 ring-red-400/30']">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                      :class="servicesDialog.mapper?.available === 'available' ? 'bg-green-400' : 'bg-red-400'"></span>
                    {{ servicesDialog.mapper?.available === 'available' ? 'Available' : 'Not Available' }}
                  </span>
                  <span class="text-blue-300 text-xs">{{ servicesDialog.mapper?.post_code }}</span>
                </div>
              </div>
              <button type="button" @click="closeServicesDialog"
                class="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Global Platform Fee Override Banner -->
            <div class="bg-blue-50 border-b border-blue-100 px-6 py-3 shrink-0">
              <div class="flex items-center gap-3 flex-wrap">
                <svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-blue-700 mr-auto font-medium">Deposit Fee <span
                    class="font-normal text-blue-500">(applies to all selected services)</span></p>
                <div class="flex items-center gap-1.5">
                  <span class="text-sm font-semibold text-blue-700">£</span>
                  <input v-model.number="dialogPlatformFeeOverride" type="number" min="0" step="0.01"
                    class="w-28 px-2.5 py-1.5 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white text-blue-900 font-semibold"
                    placeholder="0.00" />
                </div>
              </div>
            </div>

            <!-- Services Body -->
            <div class="overflow-y-auto flex-1 px-6 py-4">
              <div v-if="!servicesDialog.mapper?.services || servicesDialog.mapper.services.length === 0"
                class="py-12 text-center">
                <svg class="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-gray-500 font-medium">No services listed</p>
                <p class="text-gray-400 text-sm mt-1">This mapper hasn't added any services yet.</p>
              </div>

              <div v-else>
                <div v-if="searchCriteria.serviceId"
                  class="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-blue-700">Filtering by: <strong>{{ searchCriteria.serviceName }}</strong></p>
                </div>

                <!-- Select All -->
                <div class="mb-3 flex items-center gap-2.5 px-1">
                  <input id="select-all-services" type="checkbox" :checked="dialogAllSelected"
                    :indeterminate="dialogSomeSelected && !dialogAllSelected" @change="toggleSelectAllServices"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <label for="select-all-services"
                    class="text-sm font-medium text-gray-600 cursor-pointer select-none flex-1">
                    Select all services
                  </label>
                  <span v-if="dialogSelectedServices.length > 0"
                    class="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {{ dialogSelectedServices.length }} selected
                  </span>
                </div>

                <!-- Service rows -->
                <div class="space-y-3">
                  <div v-for="(svc, idx) in servicesDialog.mapper.services" :key="svc.id ?? idx"
                    class="rounded-xl border transition-all duration-150" :class="[
                      isDialogServiceSelected(svc, idx)
                        ? 'border-blue-300 bg-blue-50/60 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    ]">
                    <div class="px-4 py-3.5">
                      <div class="flex items-start gap-3">
                        <input :id="`svc-${svc.id ?? idx}`" type="checkbox" :checked="isDialogServiceSelected(svc, idx)"
                          @change="toggleDialogService(svc, idx)"
                          class="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                        <div class="flex-1 min-w-0">
                          <label :for="`svc-${svc.id ?? idx}`" class="flex items-center gap-2 flex-wrap cursor-pointer">
                            <span class="font-semibold text-gray-900 text-sm">
                              {{ svc.service?.name ?? svc.name ?? 'Unnamed Service' }}
                            </span>
                            <span v-if="isCurrentlySelectedService(svc)"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Search Filter
                            </span>
                            <span v-if="isDialogServiceSelected(svc, idx)"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Selected
                            </span>
                          </label>
                          <p v-if="svc.service?.description" class="text-xs text-gray-500 mt-0.5">
                            {{ svc.service.description }}
                          </p>
                        </div>
                      </div>

                      <!-- Selected: price override inputs -->
                      <div v-if="isDialogServiceSelected(svc, idx)" class="mt-3 ml-7 flex items-center gap-3 flex-wrap">
                        <div class="flex flex-col gap-0.5">
                          <label class="text-[10px] font-medium uppercase tracking-wide text-gray-400">Service
                            Fee</label>
                          <div class="flex items-center gap-1">
                            <span class="text-sm text-gray-500 font-medium">£</span>
                            <input :value="getDialogServicePrice(svc, idx)"
                              @input="setDialogServicePrice(svc, idx, ($event.target as HTMLInputElement).value)"
                              type="number" min="0" step="0.01"
                              class="w-24 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none font-semibold text-gray-900"
                              :placeholder="svc.price != null ? Number(svc.price).toFixed(2) : '0.00'" />
                          </div>
                        </div>
                        <span class="text-gray-300 text-lg font-light mt-3">+</span>
                        <div class="flex flex-col gap-0.5">
                          <label class="text-[10px] font-medium uppercase tracking-wide text-gray-400">Deposit</label>
                          <div class="flex items-center gap-1">
                            <span class="text-sm text-gray-500 font-medium">£</span>
                            <input :value="getDialogServicePlatformFee(svc, idx)"
                              @input="setDialogServicePlatformFee(svc, idx, ($event.target as HTMLInputElement).value)"
                              type="number" min="0" step="0.01"
                              class="w-24 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none font-semibold text-gray-900"
                              :placeholder="(dialogPlatformFeeOverride ?? 0).toFixed(2)" />
                          </div>
                        </div>
                        <span class="text-gray-300 text-lg font-light mt-3">=</span>
                        <div class="flex flex-col gap-0.5">
                          <label class="text-[10px] font-medium uppercase tracking-wide text-slate-400">Total</label>
                          <div class="bg-slate-800 rounded-lg px-3 py-1.5">
                            <p class="text-sm font-bold text-white tabular-nums">
                              £{{ ((Number(getDialogServicePrice(svc, idx)) || 0) + (getDialogServicePlatformFee(svc,
                                idx) || 0)).toFixed(2) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Not selected: original price display -->
                      <div v-else class="mt-2 ml-7 flex items-center gap-3">
                        <div>
                          <p class="text-[10px] font-medium uppercase tracking-wide text-gray-400">Original Fee</p>
                          <p class="text-sm font-bold text-gray-700">
                            {{ svc.price != null ? `£${Number(svc.price).toFixed(2)}` : '—' }}
                          </p>
                        </div>
                        <span v-if="selectedServicePlatformFee > 0" class="text-gray-300 text-lg font-light">+</span>
                        <div v-if="selectedServicePlatformFee > 0">
                          <p class="text-[10px] font-medium uppercase tracking-wide text-gray-400">Deposit</p>
                          <p class="text-sm font-bold text-gray-500">£{{ selectedServicePlatformFee.toFixed(2) }}</p>
                        </div>
                        <span v-if="selectedServicePlatformFee > 0 && svc.price != null"
                          class="text-gray-300 text-lg font-light">=</span>
                        <div v-if="svc.price != null" class="bg-slate-100 rounded-lg px-3 py-1.5">
                          <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">Total</p>
                          <p class="text-sm font-bold text-slate-700">
                            £{{ (Number(svc.price) + (selectedServicePlatformFee ?? 0)).toFixed(2) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>{{ servicesDialog.mapper.services.length }} service{{ servicesDialog.mapper.services.length !==
                    1 ? 's' : '' }} offered</span>
                  <span class="text-xs text-gray-400">Deposit: £{{ (dialogPlatformFeeOverride ?? 0).toFixed(2) }} per
                    job</span>
                </div>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div
              class="border-t border-gray-100 px-6 py-4 bg-gray-50/80 flex items-center justify-between gap-3 shrink-0">
              <button type="button" @click="closeServicesDialog"
                class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Close
              </button>
              <div class="flex items-center gap-2">
                <span v-if="dialogSelectedServices.length === 0"
                  class="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                  Select at least one service
                </span>
                <button type="button" @click="selectStaffFromDialog" :disabled="dialogSelectedServices.length === 0"
                  class="px-5 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="[
                    formData.mapperId === servicesDialog.mapper?.id
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                  ]">
                  {{ formData.mapperId === servicesDialog.mapper?.id ? '✓ Staff Selected' : 'Select This Staff' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
import { servicesService, jobService, notificationService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';

const router = useRouter();
const route = useRoute();
const { canAdd } = useStaffPermissions();
const canAddJob = computed(() => canAdd('job'));

// ─── Edit / Duplicate mode ────────────────────────────────────────────
const editJobId = ref<string | null>(null);
const pageMode = ref<'edit' | 'duplicate' | null>(null);
const loadingJob = ref(false);

// ─── Form data ────────────────────────────────────────────────────────
const formData: any = ref({
  registration: '',
  vehicleId: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  vehicleVariant: '',
  engineDetails: null as any,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  jobAddress: '',
  jobPostcode: '',
  jobLatitude: null as number | null,
  jobLongitude: null as number | null,
  scheduled_at: '',
  scheduledDate: '',
  scheduledTime: '',
  mapperId: '' as string | number,
  mapperName: '',
});

const searchCriteria = ref({
  serviceId: '',
  serviceName: '',
  radius: 20,
});

// ─── UI state ─────────────────────────────────────────────────────────
const loadingVehicle = ref(false);
const vehicleError = ref('');
const vehicleDetails = ref<any>(null);
const engineDetails = ref<any>(null);
const loadingStaffs = ref(false);
const loadingServices = ref(false);
const hasSearched = ref(false);
const submitting = ref(false);
const showRadiusDropdown = ref(false);
const showServiceDropdown = ref(false);
const radiusSearchQuery = ref('');
const serviceSearchQuery = ref('');
const searchResults = ref<any[]>([]);
const availableServices = ref<any[]>([]);
const errors = ref<Record<string, string>>({});

// ════════════════════════════════════════════════════════════════════
// DIALOG MULTISELECT STATE
// ════════════════════════════════════════════════════════════════════

const dialogSelectedServices = ref<string[]>([]);
const dialogServicePriceOverrides = ref<Record<string, number>>({});
const dialogServiceFeeOverrides = ref<Record<string, number>>({});
const dialogPlatformFeeOverride = ref<number>(0);

const confirmedStaffServices = ref<Record<string, Array<{
  serviceId: number;
  serviceRowId: string;
  serviceName: string;
  price: number;
  platformFee: number;
}>>>({});

// ─── Stable key for a mapper-service row ─────────────────────────────
const svcKey = (svc: any, idx: number): string => String(svc.id ?? idx);

// ─── Dialog computed ──────────────────────────────────────────────────
const dialogAllSelected = computed(() => {
  const services = servicesDialog.value.mapper?.services ?? [];
  if (!services.length) return false;
  return services.every((svc: any, idx: number) =>
    dialogSelectedServices.value.includes(svcKey(svc, idx))
  );
});
const dialogSomeSelected = computed(() => dialogSelectedServices.value.length > 0);

const toggleSelectAllServices = () => {
  const services = servicesDialog.value.mapper?.services ?? [];
  if (dialogAllSelected.value) {
    dialogSelectedServices.value = [];
  } else {
    services.forEach((svc: any, idx: number) => {
      const key = svcKey(svc, idx);
      if (!dialogSelectedServices.value.includes(key)) dialogSelectedServices.value.push(key);
      if (dialogServicePriceOverrides.value[key] == null)
        dialogServicePriceOverrides.value[key] = svc.price != null ? Number(svc.price) : 0;
      if (dialogServiceFeeOverrides.value[key] == null)
        dialogServiceFeeOverrides.value[key] = dialogPlatformFeeOverride.value ?? 0;
    });
  }
};

const isDialogServiceSelected = (svc: any, idx: any): boolean =>
  dialogSelectedServices.value.includes(svcKey(svc, idx));

const toggleDialogService = (svc: any, idx: any) => {
  const key = svcKey(svc, idx);
  const pos = dialogSelectedServices.value.indexOf(key);
  if (pos === -1) {
    dialogSelectedServices.value.push(key);
    if (dialogServicePriceOverrides.value[key] == null)
      dialogServicePriceOverrides.value[key] = svc.price != null ? Number(svc.price) : 0;
    if (dialogServiceFeeOverrides.value[key] == null)
      dialogServiceFeeOverrides.value[key] = dialogPlatformFeeOverride.value ?? 0;
  } else {
    dialogSelectedServices.value.splice(pos, 1);
  }
};

const getDialogServicePrice = (svc: any, idx: any): number => {
  const key = svcKey(svc, idx);
  return dialogServicePriceOverrides.value[key] != null
    ? dialogServicePriceOverrides.value[key]
    : (svc.price != null ? Number(svc.price) : 0);
};
const setDialogServicePrice = (svc: any, idx: any, val: any) => {
  dialogServicePriceOverrides.value[svcKey(svc, idx)] = parseFloat(val) || 0;
};

const getDialogServicePlatformFee = (svc: any, idx: any): number => {
  const key = svcKey(svc, idx);
  return dialogServiceFeeOverrides.value[key] != null
    ? dialogServiceFeeOverrides.value[key]
    : (dialogPlatformFeeOverride.value ?? 0);
};
const setDialogServicePlatformFee = (svc: any, idx: any, val: string) => {
  dialogServiceFeeOverrides.value[svcKey(svc, idx)] = parseFloat(val) || 0;
};

// ════════════════════════════════════════════════════════════════════
// DIALOG OPEN / CLOSE / SELECT
// ════════════════════════════════════════════════════════════════════
const servicesDialog = ref<{ open: boolean; mapper: any | null }>({ open: false, mapper: null });

const openServicesDialog = (mapper: any) => {
  servicesDialog.value = { open: true, mapper };
  dialogPlatformFeeOverride.value = selectedServicePlatformFee.value;

  const existing = confirmedStaffServices.value[mapper.id];
  if (existing?.length) {
    dialogSelectedServices.value = existing.map(s => s.serviceRowId);
    dialogServicePriceOverrides.value = Object.fromEntries(existing.map(s => [s.serviceRowId, s.price]));
    dialogServiceFeeOverrides.value = Object.fromEntries(existing.map(s => [s.serviceRowId, s.platformFee]));
    dialogPlatformFeeOverride.value = existing[0]?.platformFee ?? selectedServicePlatformFee.value;
  } else {
    dialogSelectedServices.value = [];
    dialogServicePriceOverrides.value = {};
    dialogServiceFeeOverrides.value = {};
  }
};

const closeServicesDialog = () => { servicesDialog.value = { open: false, mapper: null }; };

const selectStaffFromDialog = () => {
  if (!servicesDialog.value.mapper || dialogSelectedServices.value.length === 0) return;

  const mapper = servicesDialog.value.mapper;
  const mapperServices: any[] = mapper.services ?? [];

  confirmedStaffServices.value[mapper.id] = dialogSelectedServices.value.map(rowKey => {
    const row = mapperServices.find(
      (svc: any, idx: number) => svcKey(svc, idx) === rowKey
    );

    return {
      serviceId: Number(row?.service?.id ?? row?.service_id ?? rowKey),
      serviceRowId: rowKey,
      serviceName: row?.service?.name ?? row?.name ?? 'Unknown Service',
      price: dialogServicePriceOverrides.value[rowKey] ?? (row?.price != null ? Number(row.price) : 0),
      platformFee: dialogServiceFeeOverrides.value[rowKey] ?? dialogPlatformFeeOverride.value ?? 0,
    };
  });

  selectStaff(mapper);
  closeServicesDialog();
};

const getStaffSelectedServices = (mapper: any) =>
  confirmedStaffServices.value[mapper.id] ?? [];

const isCurrentlySelectedService = (svc: any): boolean => {
  if (!searchCriteria.value.serviceId) return false;
  return String(svc.service?.id ?? svc.service_id) === String(searchCriteria.value.serviceId);
};

// ─── Radius options ───────────────────────────────────────────────────
const radiusOptions = [
  { value: 10, label: '10 miles' }, { value: 20, label: '20 miles' },
  { value: 30, label: '30 miles' }, { value: 40, label: '40 miles' },
  { value: 50, label: '50 miles' }, { value: 60, label: '60 miles' },
  { value: 70, label: '70 miles' }, { value: 80, label: '80 miles' },
  { value: 90, label: '90 miles' }, { value: 100, label: '100 miles' },
];

// ─── Computed ─────────────────────────────────────────────────────────
const radiusDisplay = computed(() => radiusOptions.find(o => o.value === searchCriteria.value.radius)?.label ?? '');
const serviceTypeDisplay = computed(() => searchCriteria.value.serviceName || '');

const selectedServicePlatformFee = computed(() => {
  if (!searchCriteria.value.serviceId || !availableServices.value?.length) return 0;
  const svc = availableServices.value.find(
    (s: any) => String(s.id) === String(searchCriteria.value.serviceId)
  );
  return Number(svc?.platform_fee ?? svc?.platformFee) || 0;
});

const filteredRadiusOptions = computed(() =>
  !radiusSearchQuery.value ? radiusOptions
    : radiusOptions.filter(o => o.label.toLowerCase().includes(radiusSearchQuery.value.toLowerCase()))
);
const filteredServiceOptions = computed(() =>
  !serviceSearchQuery.value ? availableServices.value
    : availableServices.value.filter((s: any) => s.name.toLowerCase().includes(serviceSearchQuery.value.toLowerCase()))
);

// ─── Merge date + time ────────────────────────────────────────────────
const mergeDateTime = () => {
  if (formData.value.scheduledDate && formData.value.scheduledTime) {
    formData.value.scheduled_at = `${formData.value.scheduledDate} ${formData.value.scheduledTime}:00`;
    if (errors.value.scheduled_at) delete errors.value.scheduled_at;
  } else {
    formData.value.scheduled_at = '';
  }
};

// ─── Validation ───────────────────────────────────────────────────────
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  // registration and vehicleId validation removed
  if (!formData.value.customerName?.trim()) { errors.value.customerName = 'Customer name is required'; isValid = false; }
  if (!formData.value.customerEmail?.trim()) {
    errors.value.customerEmail = 'Customer email is required'; isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.customerEmail)) {
    errors.value.customerEmail = 'Please enter a valid email address'; isValid = false;
  }
  if (!formData.value.scheduledDate || !formData.value.scheduledTime) { errors.value.scheduled_at = 'Date and time are required'; isValid = false; }
  if (!formData.value.jobPostcode?.trim()) { errors.value.jobPostcode = 'Job postcode is required'; isValid = false; }
  if (!searchCriteria.value.serviceId) { errors.value.serviceId = 'Service type is required'; isValid = false; }

  return isValid;
};

// ─── Helpers ──────────────────────────────────────────────────────────
const disablePastDates = (date: Date) => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return date <= t;
};
const formatOption = (option: string) => option.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const selectRadius = (value: number) => { searchCriteria.value.radius = value; showRadiusDropdown.value = false; radiusSearchQuery.value = ''; };
const selectService = (service: any) => {
  searchCriteria.value.serviceId = service.id;
  searchCriteria.value.serviceName = service.name;
  showServiceDropdown.value = false;
  serviceSearchQuery.value = '';
  if (errors.value.serviceId) delete errors.value.serviceId;
};
const filterRadiusOptions = (e: Event) => { radiusSearchQuery.value = (e.target as HTMLInputElement).value; };
const filterServiceOptions = (e: Event) => { serviceSearchQuery.value = (e.target as HTMLInputElement).value; };

// ─── Staff helpers ───────────────────────────────────────────────────
const selectStaff = (mapper: any) => {
  formData.value.mapperId = mapper.id;
  formData.value.mapperName = mapper.name;
  if (errors.value.mapperId) delete errors.value.mapperId;
};

const getSelectedServicePrice = (mapper: any): string | null => {
  if (!mapper.services || !searchCriteria.value.serviceId) return null;
  const s = mapper.services.find(
    (s: any) =>
      String(s.service?.id) === String(searchCriteria.value.serviceId) ||
      String(s.service_id) === String(searchCriteria.value.serviceId)
  );
  return s ? s.price : null;
};
const getSelectedServicePriceNumber = (mapper: any): number => {
  const p = getSelectedServicePrice(mapper);
  if (p == null || p === '') return 0;
  const n = Number(p);
  return Number.isFinite(n) ? n : 0;
};
const getTotalQuotedPrice = (mapper: any): string | null => {
  const total = getSelectedServicePriceNumber(mapper) + selectedServicePlatformFee.value;
  return total > 0 ? total.toFixed(2) : null;
};

const getStaffLat = (mapper: any): number | null => {
  const v = mapper?.latitude ?? mapper?.lat;
  if (v == null || v === '') return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
};
const getStaffLng = (mapper: any): number | null => {
  const v = mapper?.longitude ?? mapper?.lng;
  if (v == null || v === '') return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
};

const MAP_DELTA = 0.008;
const mapperEmbedMapUrl = (mapper: any): string => {
  const lat = getStaffLat(mapper)!, lng = getStaffLng(mapper)!;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${[lng - MAP_DELTA, lat - MAP_DELTA, lng + MAP_DELTA, lat + MAP_DELTA].join(',')}&layer=mapnik&marker=${lat},${lng}`;
};
const mapperMapLink = (mapper: any): string => {
  const lat = getStaffLat(mapper)!, lng = getStaffLng(mapper)!;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
};

// ─── API Calls ────────────────────────────────────────────────────────
const lookupVehicle = async () => {
  if (!formData.value.registration) {
    errors.value.registration = 'Please enter a vehicle registration number';
    vehicleError.value = 'Please enter a vehicle registration number';
    return;
  }
  loadingVehicle.value = true;
  vehicleError.value = '';
  vehicleDetails.value = null;
  engineDetails.value = null;
  if (errors.value.registration) delete errors.value.registration;
  try {
    const response = await fetch(`https://backend-2.tuning-company.co.uk/resolve?reg=${formData.value.registration}`);
    if (!response.ok) throw new Error('Vehicle not found');
    const data = await response.json();
    if (!data.success) throw new Error('Vehicle lookup failed');
    vehicleDetails.value = data;
    formData.value.vehicleId = data.id;
    formData.value.vehicleMake = data.make;
    formData.value.vehicleModel = data.model;
    formData.value.vehicleYear = data.year;
    formData.value.vehicleVariant = data.variant;
    if (errors.value.vehicleId) delete errors.value.vehicleId;
    if (data.id) await fetchEngineDetails(data.id);
  } catch {
    vehicleError.value = 'Unable to find vehicle details. Please check the registration number and try again.';
    errors.value.vehicleId = 'Vehicle not found. Please check the registration.';
  } finally {
    loadingVehicle.value = false;
  }
};

const fetchEngineDetails = async (engineId: string) => {
  try {
    const response = await fetch(`https://backend-2.tuning-company.co.uk/getEngineDetails/?engine_id=${engineId}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    engineDetails.value = data.engineDetails;
    formData.value.engineDetails = data.engineDetails;
  } catch { /* silent */ }
};

const fetchServices = async () => {
  try {
    loadingServices.value = true;
    const res: any = await servicesService.getServicesList([
      { key: 'take-all', value: 'true' },
      { key: 'status', value: 'active' },
    ]);
    availableServices.value = res.data || res;
  } catch (e) {
    if (e instanceof AxiosError) console.error('Error fetching services:', e.response?.data?.message);
  } finally {
    loadingServices.value = false;
  }
};

const searchStaffs = async () => {
  if (!formData.value.jobPostcode || !searchCriteria.value.serviceId) return;
  hasSearched.value = true;
  loadingStaffs.value = true;
  searchResults.value = [];
  try {
    const res: any = await jobService.getJobSearchList([
      { key: 'post_code', value: formData.value.jobPostcode },
      { key: 'latitude', value: formData.value.jobLatitude },
      { key: 'longitude', value: formData.value.jobLongitude },
      { key: 'service_id', value: searchCriteria.value.serviceId },
      { key: 'available', value: 'available' },
      { key: 'radius', value: searchCriteria.value.radius.toString() },
    ]);
    searchResults.value = res.data || res;
  } catch {
    notificationService.showError('Add Correct Postcode');
  } finally {
    loadingStaffs.value = false;
  }
};

const submitJob = async () => {
  if (!validateForm()) {
    document.querySelector('.border-red-500')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  submitting.value = true;
  try {
    // ── Build services[] ──────────────────────────────────────────
    const mapperId = String(formData.value.mapperId);
    const confirmed = confirmedStaffServices.value[mapperId] ?? [];

    let servicesPayload: Array<{ service_id: number; service_price?: number; platform_fee?: number }>;

    if (confirmed.length > 0) {
      servicesPayload = confirmed.map(s => ({
        service_id: s.serviceId,
        service_price: s.price,
        platform_fee: s.platformFee,
      }));
    } else if (searchCriteria.value.serviceId) {
      servicesPayload = [
        { service_id: Number(searchCriteria.value.serviceId) },
      ];
    } else {
      servicesPayload = [];
    }

    const jobData: any = {
      registration: formData.value.registration,
      vehicle_id: formData.value.vehicleId,
      vehicle_make: formData.value.vehicleMake,
      vehicle_model: formData.value.vehicleModel,
      vehicle_year: formData.value.vehicleYear,
      vehicle_variant: formData.value.vehicleVariant,
      engine_details: formData.value.engineDetails,
      customer_name: formData.value.customerName,
      customer_email: formData.value.customerEmail,
      customer_phone: formData.value.customerPhone || null,
      customer_address: formData.value.jobAddress,
      post_code: formData.value.jobPostcode,
      latitude: formData.value.jobLatitude,
      longitude: formData.value.jobLongitude,
      scheduled_at: formData.value.scheduled_at || null,
      user_id: formData.value.mapperId,
      service_id: searchCriteria.value.serviceId,
      status: 'pending',
      services: servicesPayload,
    };

    if (pageMode.value === 'edit' && editJobId.value) {
      const res: any = await jobService.updateJob(editJobId.value, jobData);
      notificationService.showSuccess(res?.message ?? 'Job updated successfully');
    } else {
      const res: any = await jobService.addJob(jobData);
      notificationService.showSuccess(res?.message ?? (pageMode.value === 'duplicate' ? 'Job duplicated successfully' : 'Job created successfully'));
    }
    router.push('/admin/jobs');
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422)
        notificationService.showError(error.response.data.message || 'Validation error. Please check all fields.');
      else if (error.response?.status === 401)
        notificationService.showError('Unauthorized. Please log in again.');
      else
        notificationService.showError('Failed to create job. Please try again.');
    } else {
      notificationService.showError('An unexpected error occurred.');
    }
  } finally {
    submitting.value = false;
  }
};

// ─── Edit / Duplicate prefill ─────────────────────────────────────────
const fetchJobAndPrefill = async () => {
  const jobId = route.query.jobId as string | undefined;
  const mode = route.query.mode as string | undefined;
  if (!jobId || !mode || (mode !== 'edit' && mode !== 'duplicate')) return;

  editJobId.value = jobId;
  pageMode.value = mode as 'edit' | 'duplicate';
  loadingJob.value = true;

  try {
    const res: any = await jobService.getJobById(jobId);
    const job = res?.data ?? res;
    if (!job) { notificationService.showError('Job not found'); return; }

    // ── Vehicle ───────────────────────────────────────────────────
    formData.value.registration = job.registration || '';
    formData.value.vehicleId = job.vehicle_id || job.vehicleId || '';
    formData.value.vehicleMake = job.vehicle_make || job.vehicleMake || '';
    formData.value.vehicleModel = job.vehicle_model || job.vehicleModel || '';
    formData.value.vehicleYear = job.vehicle_year || job.vehicleYear || '';
    formData.value.vehicleVariant = job.vehicle_variant || job.vehicleVariant || '';
    formData.value.engineDetails = job.engine_details ?? job.engineDetails ?? null;

    if (job.registration) {
      vehicleDetails.value = {
        id: job.vehicle_id || job.vehicleId || '',
        make: job.vehicle_make || job.vehicleMake || '',
        model: job.vehicle_model || job.vehicleModel || '',
        year: job.vehicle_year || job.vehicleYear || '',
        variant: job.vehicle_variant || job.vehicleVariant || '',
        name: [job.vehicle_make, job.vehicle_model, job.vehicle_variant].filter(Boolean).join(' '),
      };
      engineDetails.value = job.engine_details ?? job.engineDetails ?? null;
      lookupVehicle();
    }

    // ── Customer ──────────────────────────────────────────────────
    formData.value.customerName = job.customer_name || '';
    formData.value.customerEmail = job.customer_email || '';
    formData.value.customerPhone = job.customer_phone || '';

    // ── Date/Time ─────────────────────────────────────────────────
    if (job.scheduled_at) {
      const [datePart, timePart] = job.scheduled_at.split(' ');
      formData.value.scheduledDate = datePart || '';
      formData.value.scheduledTime = timePart ? timePart.substring(0, 5) : '';
      formData.value.scheduled_at = job.scheduled_at;
    }

    // ── Address / Postcode ────────────────────────────────────────
    formData.value.jobAddress = job.customer_address || '';
    formData.value.jobPostcode = job.post_code || '';
    formData.value.jobLatitude = job.latitude != null ? Number(job.latitude) : null;
    formData.value.jobLongitude = job.longitude != null ? Number(job.longitude) : null;

    if (mode === 'duplicate') {
      formData.value.mapperId = '';
      formData.value.mapperName = '';
      searchCriteria.value.serviceId = '';
      searchCriteria.value.serviceName = '';
      searchCriteria.value.radius = 20;
    } else {
      formData.value.mapperId = String(job.mapper_id ?? job.mapper?.id ?? '');
      formData.value.mapperName = job.mapper?.name ?? '';

      const firstServiceId = job.service_ids?.[0] ?? job.service_id ?? job.service?.id;
      if (firstServiceId) {
        searchCriteria.value.serviceId = String(firstServiceId);
        const firstJobSvc = (job.job_services ?? [])[0];
        searchCriteria.value.serviceName =
          firstJobSvc?.service?.name ?? job.service?.name ?? '';

        if (!searchCriteria.value.serviceName && availableServices.value.length) {
          const found = availableServices.value.find(
            (s: any) => String(s.id) === String(firstServiceId)
          );
          if (found) searchCriteria.value.serviceName = found.name;
        }
      }

      const jobServices = job.job_services ?? job.services ?? [];
      if (jobServices.length && formData.value.mapperId) {
        confirmedStaffServices.value[formData.value.mapperId] = jobServices.map((s: any) => ({
          serviceId: Number(s.service_id ?? s.service?.id ?? s.id),
          serviceRowId: String(s.mapper_service_id ?? s.service_id ?? s.id),
          serviceName: s.service?.name ?? s.name ?? '',
          price: Number(s.service_price ?? s.price ?? 0),
          platformFee: Number(s.platform_fee ?? 0),
        }));
      }
    }
  } catch {
    notificationService.showError('Failed to load job');
  } finally {
    loadingJob.value = false;
  }
};

// ─── Postcode → lat/lng debounce ──────────────────────────────────────
let postcodeTimer: ReturnType<typeof setTimeout> | null = null;
watch(() => formData.value.jobPostcode, (val: string) => {
  formData.value.jobLatitude = null;
  formData.value.jobLongitude = null;
  if (errors.value.jobPostcode) delete errors.value.jobPostcode;
  const pc = val?.trim();
  if (!pc || pc.length < 5) return;
  if (postcodeTimer) clearTimeout(postcodeTimer);
  postcodeTimer = setTimeout(async () => {
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 200 && data.result) {
        formData.value.jobLatitude = data.result.latitude;
        formData.value.jobLongitude = data.result.longitude;
      }
    } catch { /* silent */ }
  }, 600);
});

// ─── After services load, try to patch in service name for edit ───────
watch(availableServices, (svcs) => {
  if (pageMode.value === 'edit' && searchCriteria.value.serviceId && !searchCriteria.value.serviceName && svcs.length) {
    const found = svcs.find((s: any) => String(s.id) === String(searchCriteria.value.serviceId));
    if (found) searchCriteria.value.serviceName = found.name;
  }
});

watch(() => formData.value.scheduledDate, () => mergeDateTime());
watch(() => formData.value.scheduledTime, () => mergeDateTime());
watch(() => formData.value.customerName, (v) => { if (v && errors.value.customerName) delete errors.value.customerName; });
watch(() => formData.value.customerEmail, (v) => { if (v && errors.value.customerEmail) delete errors.value.customerEmail; });
watch(() => formData.value.mapperId, (v) => { if (v && errors.value.mapperId) delete errors.value.mapperId; });
watch(() => formData.value.registration, (v) => { if (v && errors.value.registration) delete errors.value.registration; });

const handleClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    showRadiusDropdown.value = false;
    showServiceDropdown.value = false;
  }
};
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && servicesDialog.value.open) closeServicesDialog();
};

// ─── Haversine distance ───────────────────────────────────────────────
const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any): string => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 'N/A';
  const R = 3958.8;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(Number(lat2) - Number(lat1));
  const dLon = toRad(Number(lon2) - Number(lon1));
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) * Math.sin(dLon / 2) ** 2;
  return `${(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)} miles`;
};

onMounted(() => {
  fetchServices();
  fetchJobAndPrefill();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
watch(() => [route.query.jobId, route.query.mode], () => { fetchJobAndPrefill(); }, { immediate: false });
</script>

<style>
.custom-date-picker {
  height: 48px !important;
}

.custom-date-picker .el-input__wrapper {
  padding: 0 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px #d1d5db !important;
  transition: all 0.2s ease !important;
}

.custom-date-picker .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #9ca3af !important;
}

.custom-date-picker .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px #3b82f6 !important;
}

.custom-date-picker .el-input__inner {
  height: 46px !important;
  font-size: 14px !important;
}

.custom-date-picker .el-input__prefix {
  color: #6b7280 !important;
}

.date-picker-error .el-input__wrapper {
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.date-picker-error .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.date-picker-error .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px #ef4444 !important;
}

.el-date-editor.el-input {
  height: 50px !important;
}

.custom-date-popper {
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
}

.custom-date-popper .el-date-picker__header {
  padding: 12px 16px !important;
}

.custom-date-popper .el-date-picker__header-label {
  font-weight: 600 !important;
  color: #1f2937 !important;
}

.custom-date-popper .el-picker-panel__icon-btn {
  color: #6b7280 !important;
}

.custom-date-popper .el-picker-panel__icon-btn:hover {
  color: #3b82f6 !important;
}

.custom-date-popper .el-date-table th {
  font-weight: 600 !important;
  color: #6b7280 !important;
  padding: 8px 0 !important;
}

.custom-date-popper .el-date-table td {
  padding: 4px !important;
}

.custom-date-popper .el-date-table td .el-date-table-cell {
  height: 36px !important;
  width: 36px !important;
  border-radius: 8px !important;
}

.custom-date-popper .el-date-table td.today .el-date-table-cell__text {
  color: #3b82f6 !important;
  font-weight: 600 !important;
}

.custom-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell {
  background-color: #3b82f6 !important;
  border-radius: 8px !important;
}

.custom-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  color: white !important;
}

.custom-date-popper .el-date-table td.available:hover .el-date-table-cell {
  background-color: #eff6ff !important;
}

.custom-date-popper .el-date-table td.disabled .el-date-table-cell__text {
  color: #d1d5db !important;
}

.custom-date-popper .el-picker-panel__footer {
  border-top: 1px solid #e5e7eb !important;
  padding: 8px 12px !important;
}

.custom-date-popper .el-picker-panel__link-btn {
  color: #3b82f6 !important;
  font-weight: 500 !important;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-active .relative,
.dialog-fade-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .relative {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}

.dialog-fade-leave-to .relative {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}
</style>