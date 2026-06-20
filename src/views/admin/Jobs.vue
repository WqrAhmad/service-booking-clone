<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Job Management</h1>
          <p class="text-gray-600 mt-2">View and manage all jobs</p>
        </div>
        <router-link v-if="canAddJob" to="/admin/create-job"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
          + Create New Job
        </router-link>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <!-- Job ID Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Job #</label>
            <input v-model="filters.jobId" @input="handleJobIdInput" type="text" placeholder="Enter job #"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <!-- Registration Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Reg</label>
            <input v-model="filters.registration" @input="handleRegistrationInput" type="text"
              placeholder="Enter registration"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <!-- Status Filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <input :value="statusDisplay" @focus="showStatusDropdown = true" @input="filterStatusOptions" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>

              <!-- Dropdown -->
              <div v-if="showStatusDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div @click="selectStatus('')" class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.status === '' }">
                  All Statuses
                </div>
                <div v-for="option in filteredStatusOptions" :key="option.value" @click="selectStatus(option.value)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.status === option.value }">
                  {{ option.label }}
                </div>
              </div>
            </div>
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

              <!-- Dropdown -->
              <div v-if="showServiceDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div v-if="servicesLoading" class="px-4 py-2 text-gray-500 text-center">
                  Loading services...
                </div>
                <div v-else @click="selectService('')"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.serviceId === '' }">
                  All Services
                </div>
                <div v-for="service in filteredServiceOptions" :key="service.id" @click="selectService(service.id)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.serviceId === service.id }">
                  {{ service.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Staff Filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Staff</label>
            <div class="relative">
              <input :value="mapperDisplay" @focus="showStaffDropdown = true" @input="filterStaffOptions" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>

              <!-- Dropdown -->
              <div v-if="showStaffDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div v-if="mappersLoading" class="px-4 py-2 text-gray-500 text-center">
                  Loading mappers...
                </div>
                <div v-else @click="selectStaff('')" class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.mapperId === '' }">
                  All Staffs
                </div>
                <div v-for="mapper in filteredStaffOptions" :key="mapper.id" @click="selectStaff(mapper.id)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  :class="{ 'bg-blue-100': filters.mapperId === mapper.id }">
                  <div class="font-medium">{{ mapper.name }}</div>
                  <div class="text-xs text-gray-500">{{ mapper.business_name || mapper.email }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input v-model="filters.search" @input="handleSearchInput" type="text"
              placeholder="Customer name, email, postcode..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <el-date-picker v-model="filters.fromDate" @change="handleFromDateInput" type="date"
              placeholder="Select date" format="DD/MM/YYYY" value-format="YYYY-MM-DD" :clearable="true"
              class="!w-full custom-date-picker" popper-class="custom-date-popper" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <el-date-picker v-model="filters.toDate" @change="handleToDateInput" type="date" placeholder="Select date"
              format="DD/MM/YYYY" value-format="YYYY-MM-DD" :clearable="true" class="!w-full custom-date-picker"
              popper-class="custom-date-popper" />
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button @click="resetFilters"
              class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
              Reset All
            </button>
          </div>
        </div>
      </div>

      <!-- Jobs Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading State -->
        <div v-if="listLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading jobs...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                </th>
                <th @click="sortTable('id')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Job ID
                    <span class="ml-2">
                      <svg v-if="sortBy === 'id' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'id' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
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
                  Reg #
                </th>
                <th @click="sortTable('customer_name')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Customer
                    <span class="ml-2">
                      <svg v-if="sortBy === 'customer_name' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'customer_name' && orderBy === 'desc'" class="w-4 h-4"
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
                  Service
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th @click="sortTable('total_amount')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Amount
                    <span class="ml-2">
                      <svg v-if="sortBy === 'total_amount' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'total_amount' && orderBy === 'desc'" class="w-4 h-4"
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
                <th @click="sortTable('status')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Status
                    <span class="ml-2">
                      <svg v-if="sortBy === 'status' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'status' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
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

              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
                <td class="px-2 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="relative inline-block actions-dropdown">
                    <button type="button" @click.stop="toggleActionsDropdown(job.id)"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title="Actions">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div v-if="actionsOpenId === job.id"
                      class="absolute left-0 z-20 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none block"
                      style="min-width: 10rem;">
                      <button v-if="canEditJob" type="button" @click.stop="closeAndRun(() => editJob(job.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">
                        Edit
                      </button>
                      <!-- duplicate job -->
                      <button v-if="canListJobs" type="button" @click.stop="closeAndRun(() => duplicateJob(job.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">
                        Duplicate Job
                      </button>



                      <button v-if="canListJobs" type="button" @click.stop="closeAndRun(() => viewJob(job.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        View
                      </button>
                      <button v-if="canDeleteJob" type="button" @click.stop="closeAndRun(() => deleteJob(job.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                      <button v-if="job.payment_status === 'pending' && canListJobs" type="button"
                        @click.stop="closeAndRun(() => resendInvoice(job.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                        Resend Invoice
                      </button>

                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ job.job_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ job.registration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ job.customer_name }}</div>
                  <div class="text-sm text-gray-500">{{ job.customer_email }}</div>
                </td>
                <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ job.service?.name || '' }}
                </td> -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex flex-wrap gap-1 min-w-[200px]">
                    <span v-for="serviceName in (
                      Array.isArray(job.job_services)
                        ? job.job_services.map(s => s.service?.name).filter(Boolean)
                        : (job.service?.name ? [job.service.name] : [])
                    )" :key="serviceName"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 max-w-full truncate">
                      {{ serviceName }}
                    </span>

                    <span v-if="(!Array.isArray(job.job_services) || !job.job_services.length) && !job.service?.name"
                      class="text-xs text-gray-400">
                      No service
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ job.staff?.name || '' }}</div>
                  <div class="text-sm text-gray-500">{{ job.staff?.business_name || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(job.scheduled_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  £{{ Number(job.total_amount || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select :value="job.status" @change="onStatusChange(job, ($event.target as HTMLSelectElement).value)"
                    :class="[
                      'px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                      getStatusClass(job.status)
                    ]">
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!listLoading && (!jobs || jobs.length === 0)" class="p-8 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 mb-4">No jobs found</p>
          <router-link v-if="canAddJob" to="/admin/search-mappers"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-block">
            Create Your First Job
          </router-link>
        </div>

        <!-- Pagination -->
        <div v-if="!listLoading && jobs && jobs.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <!-- Results Info -->
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="page === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button @click="nextPage" :disabled="page >= totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ fromItem }}</span>
                  to
                  <span class="font-medium">{{ toItem }}</span>
                  of
                  <span class="font-medium">{{ totalItems }}</span>
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
                  <button @click="nextPage" :disabled="page >= totalPages"
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

      <!-- Manual payment modal -->
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closePaymentModal" />
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mark payment received</h3>
            <div class="space-y-4">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                <input v-model.number="paymentForm.amount" type="number" step="0.01" min="0" disabled readonly
                  placeholder="0.00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea v-model="paymentForm.notes" rows="2" placeholder="Optional notes"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="closePaymentModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" @click="submitManualPayment" :disabled="paymentSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ paymentSubmitting ? 'Saving...' : 'Save' }}
              </button>
            </div>
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
import { jobService, notificationService, paymentService, servicesService, userService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import { formatDateTime } from '@/composables/formatDateTime';
import Swal from 'sweetalert2';

const router = useRouter();
const { canAdd, canDelete, canList, canEdit } = useStaffPermissions();
const canAddJob = computed(() => canAdd('job'));
const canDeleteJob = computed(() => canDelete('job'));
const canListJobs = computed(() => canList('job'));
const canEditJob = computed(() => canEdit('job'));

const actionsOpenId = ref<string | number | null>(null);

const toggleActionsDropdown = (jobId: string | number) => {
  actionsOpenId.value = actionsOpenId.value === jobId ? null : jobId;
};

const closeAndRun = (fn: () => void) => {
  actionsOpenId.value = null;
  fn();
};

const filters = ref({
  jobId: '',
  registration: '',
  status: '',
  paymentStatus: '',
  serviceId: '',
  mapperId: '',
  search: '',
  fromDate: '',
  toDate: '',
});

const jobList: any = ref({
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0
});

const listLoading = ref(false);
const servicesLoading = ref(false);
const mappersLoading = ref(false);

const showStatusDropdown = ref(false);
const statusSearchQuery = ref('');
const showPaymentStatusDropdown = ref(false);
const showServiceDropdown = ref(false);
const serviceSearchQuery = ref('');
const showStaffDropdown = ref(false);
const mapperSearchQuery = ref('');

const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref('id');
const orderBy = ref('desc');

// Services and Staffs data
const servicesList = ref<any[]>([]);
const mappersList = ref<any[]>([]);

// Search debounce
let searchTimeout: NodeJS.Timeout;
let jobIdTimeout: NodeJS.Timeout;
let registrationTimeout: NodeJS.Timeout;

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];



// Computed properties for pagination
const jobs = computed(() => jobList.value.data || []);
const totalPages = computed(() => jobList.value.meta.last_page || 1);
const totalItems = computed(() => jobList.value.meta.total || 0);
const fromItem = computed(() => jobList.value.meta.from || 0);
const toItem = computed(() => jobList.value.meta.to || 0);

const statusDisplay = computed(() => {
  if (!filters.value.status) return '';
  const option = statusOptions.find(opt => opt.value === filters.value.status);
  return option ? option.label : '';
});



const serviceDisplay = computed(() => {
  if (!filters.value.serviceId) return '';
  const service = servicesList.value.find(s => s.id === filters.value.serviceId);
  return service ? service.name : '';
});

const mapperDisplay = computed(() => {
  if (!filters.value.mapperId) return '';
  const mapper = mappersList.value.find(m => m.id === filters.value.mapperId);
  return mapper ? mapper.name : '';
});

const filteredStatusOptions = computed(() => {
  if (!statusSearchQuery.value) {
    return statusOptions;
  }
  const query = statusSearchQuery.value.toLowerCase();
  return statusOptions.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  );
});



const filteredServiceOptions = computed(() => {
  if (!serviceSearchQuery.value) {
    return servicesList.value;
  }
  const query = serviceSearchQuery.value.toLowerCase();
  return servicesList.value.filter(service =>
    service.name.toLowerCase().includes(query)
  );
});

const filteredStaffOptions = computed(() => {
  if (!mapperSearchQuery.value) {
    return mappersList.value;
  }
  const query = mapperSearchQuery.value.toLowerCase();
  return mappersList.value.filter(mapper =>
    mapper.name.toLowerCase().includes(query) ||
    (mapper.business_name && mapper.business_name.toLowerCase().includes(query)) ||
    (mapper.email && mapper.email.toLowerCase().includes(query))
  );
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = page.value;
  const pages: number[] = [];

  // Always show first page
  pages.push(1);

  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  // Always show last page if there's more than one page
  if (total > 1) {
    pages.push(total);
  }

  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b);
});

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const onStatusChange = async (job: any, newStatus: string) => {
  if (newStatus === job.status) return;
  try {
    const res: any = await jobService.updateStatus(String(job.id), { status: newStatus });
    job.status = newStatus;
    notificationService.showSuccess(res.message, 'Status Updated Successfully');
    fetchJobs();
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

const showPaymentModal = ref(false);
const paymentModalJob = ref<any>(null);
const paymentSubmitting = ref(false);
const paymentForm = ref({ amount: '' as number | string, notes: '' });


const closePaymentModal = () => {
  showPaymentModal.value = false;
  paymentModalJob.value = null;
  paymentForm.value = { amount: '', notes: '' };
};

const submitManualPayment = async () => {
  if (!paymentModalJob.value) return;
  const job = paymentModalJob.value;
  const amount = Number(paymentForm.value.amount);
  if (Number.isNaN(amount) || amount < 0) {
    notificationService.error('Please enter a valid amount');
    return;
  }
  try {
    paymentSubmitting.value = true;
    await paymentService.manuallyPayment({
      job_id: job.id,
      amount,
      notes: paymentForm.value.notes || '',
    });
    notificationService.showSuccess('Payment recorded');
    closePaymentModal();
    fetchJobs();
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data?.message) {
      notificationService.error(e.response.data.message);
    } else {
      notificationService.error('Failed to record payment');
    }
  } finally {
    paymentSubmitting.value = false;
  }
};

const selectStatus = (value: string) => {
  filters.value.status = value;
  showStatusDropdown.value = false;
  statusSearchQuery.value = '';
  page.value = 1;
  fetchJobs();
};


const selectService = (value: string) => {
  filters.value.serviceId = value;
  showServiceDropdown.value = false;
  serviceSearchQuery.value = '';
  page.value = 1;
  fetchJobs();
};

const selectStaff = (value: string) => {
  filters.value.mapperId = value;
  showStaffDropdown.value = false;
  mapperSearchQuery.value = '';
  page.value = 1;
  fetchJobs();
};

const filterStatusOptions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  statusSearchQuery.value = target.value;
};



const filterServiceOptions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  serviceSearchQuery.value = target.value;
};

const filterStaffOptions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  mapperSearchQuery.value = target.value;
};

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchJobs();
  }, 500);
};

const handleJobIdInput = () => {
  clearTimeout(jobIdTimeout);
  jobIdTimeout = setTimeout(() => {
    page.value = 1;
    fetchJobs();
  }, 500);
};

const handleRegistrationInput = () => {
  clearTimeout(registrationTimeout);
  registrationTimeout = setTimeout(() => {
    page.value = 1;
    fetchJobs();
  }, 500);
};

const handleFromDateInput = () => {
  page.value = 1;
  fetchJobs();
};

const handleToDateInput = () => {
  page.value = 1;
  fetchJobs();
};

const sortTable = (column: string) => {
  if (sortBy.value === column) {
    orderBy.value = orderBy.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    orderBy.value = 'asc';
  }
  page.value = 1;
  fetchJobs();
};

const fetchJobs = async () => {
  try {
    listLoading.value = true;

    const params: any[] = [
      { key: 'sort_column', value: sortBy.value },
      { key: 'sort_direction', value: orderBy.value },
      { key: 'per_page', value: itemsPerPage.value },
      { key: 'page', value: page.value },
    ];

    if (filters.value.jobId) {
      params.push({ key: 'job_number', value: filters.value.jobId });
    }

    if (filters.value.registration) {
      params.push({ key: 'registration', value: filters.value.registration });
    }

    if (filters.value.status) {
      params.push({ key: 'status', value: filters.value.status });
    }

    if (filters.value.paymentStatus) {
      params.push({ key: 'payment_status', value: filters.value.paymentStatus });
    }

    if (filters.value.serviceId) {
      params.push({ key: 'service_id', value: filters.value.serviceId });
    }

    if (filters.value.mapperId) {
      params.push({ key: 'user_id', value: filters.value.mapperId });
    }

    if (filters.value.search) {
      params.push({ key: 'search', value: filters.value.search });
    }

    if (filters.value.fromDate) {
      params.push({ key: 'from_date', value: filters.value.fromDate });
    }

    if (filters.value.toDate) {
      params.push({ key: 'to_date', value: filters.value.toDate });
    }

    const res: any = await jobService.getJobList(params);
    jobList.value = res;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.error(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.error(e.response.data.message);
    }
  } finally {
    listLoading.value = false;
  }
};

const fetchServices = async () => {
  try {
    servicesLoading.value = true;

    const res: any = await servicesService.getServicesList([{
      key: 'take_all', value: 'true'
    }, { key: 'status', value: 'active' }]);
    servicesList.value = res.data
  } catch (e) {
    console.error('Error fetching services:', e);
    notificationService.error('Failed to load services');
  } finally {
    servicesLoading.value = false;
  }
};

const fetchStaffs = async () => {
  try {
    mappersLoading.value = true;
    const res: any = await userService.getUserList([{
      key: 'take_all', value: 'true'
    }]);
    mappersList.value = res.data;
  } catch (e) {
    console.error('Error fetching mappers:', e);
    notificationService.error('Failed to load mappers');
  } finally {
    mappersLoading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    jobId: '',
    registration: '',
    status: '',
    paymentStatus: '',
    serviceId: '',
    mapperId: '',
    search: '',
    fromDate: '',
    toDate: '',
  };
  page.value = 1;
  fetchJobs();
};

const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    page.value = pageNum;
    fetchJobs();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchJobs();
  }
};

const previousPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchJobs();
  }
};

const changeItemsPerPage = () => {
  page.value = 1;
  fetchJobs();
};


const viewJob = (id: any) => {
  router.push({
    path: '/admin/jobs/view',
    query: { id }
  });
};

const editJob = (id: any) => {
  router.push({
    path: '/admin/edit-job',
    query: { jobId: id, mode: 'edit' }
  });
};

const duplicateJob = (id: any) => {
  router.push({
    path: '/admin/duplicate-job',
    query: { jobId: id, mode: 'duplicate' }
  });
};


const resendInvoice = async (jobId: string) => {
  console.log(jobId, 'jobId')
  try {
    Swal.fire({
      icon: 'question',
      title: 'Resend Invoice?',
      text: 'Are you sure you want to resend the invoice to the customer?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Resend',
      cancelButtonText: 'Cancel',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    }).then(async (result: any) => {
      if (result.value) {
        // Call your resend invoice API
        // const res = await jobService.resendInvoice(jobId);
        // notificationService.success(res.message);

        notificationService.showSuccess('Invoice resent successfully!');
        Swal.fire({
          title: 'Sent!',
          text: 'Invoice has been resent to the customer.',
          icon: 'success',
          customClass: { container: 'sweet-alerts' }
        });
      }
    });
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.error(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.error(e.response.data.message);
    }
  }
};
// const shareOnWhatsApp = async (jobId: any) => {
//   try {
//     Swal.fire({
//       icon: 'question',
//       title: 'Share on WhatsApp?',
//       text: 'Are you sure you want to share the invoice to the customer?',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Share',
//       cancelButtonText: 'Cancel',
//       padding: '2em',
//       customClass: { container: 'sweet-alerts' },
//     }).then(async (result: any) => {
//       if (result.value) {
//         const payload:any = {
//           job_id: jobId
//         }
//         const res:any = await jobService.shareOnWhatsApp(payload);
//         notificationService.success(res.message);
//         Swal.fire({ 
//           title: 'Sent!', 
//           text: 'Invoice has been shared to the customer.', 
//           icon: 'success', 
//           customClass: { container: 'sweet-alerts' } 
//         });
//       }
//     });
//   } catch (e) {
//     if (e instanceof AxiosError && e.response?.status === 422) {
//       notificationService.error(e.response.data.message);
//       return;
//     }
//     if (e instanceof AxiosError && e.response?.status === 401) {
//       notificationService.error(e.response.data.message);
//     }
//   }
// };  

onMounted(() => {
  fetchJobs();
  fetchServices();
  fetchStaffs();

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      showStatusDropdown.value = false;
      showPaymentStatusDropdown.value = false;
      showServiceDropdown.value = false;
      showStaffDropdown.value = false;
    }
    if (!target.closest('.actions-dropdown')) {
      actionsOpenId.value = null;
    }
  });
});
const deleteJob = async (id: any) => {
  try {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    }).then(async (result: any) => {
      if (result.value) {
        const res: any = await jobService.deleteJob(id)
        notificationService.showSuccess(res.message)
        fetchJobs()
        Swal.fire({ title: 'Deleted!', text: 'Record has been deleted.', icon: 'success', customClass: { container: 'sweet-alerts' } })
      }
    })
  }
  catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)

      return
    }
    if (e instanceof AxiosError && e.response?.status === 401)
      notificationService.showError(e.response.data.message)
  }

}
</script>

<style>
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

/* Date Picker Dropdown (Popper) Styling */
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

.el-date-editor.el-input {
  height: 40px !important;
}
</style>