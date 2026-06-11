<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Services</h1>
          <p class="text-gray-600 mt-2">Create and manage service types</p>
        </div>
        <button
          v-if="canAddService"
          @click="openCreateModal"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          + Add New Service
        </button>
      </div>

      <!-- Services List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading State -->
        <div v-if="listLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading services...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th
                  @click="sortTable('name')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div class="flex items-center">
                    Service Name
                    <span class="ml-2">
                      <svg v-if="sortBy === 'name' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"/>
                      </svg>
                      <svg v-else-if="sortBy === 'name' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
                      </svg>
                    </span>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  @click="sortTable('platform_fee')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div class="flex items-center">
                    Deposit Fee
                    <span class="ml-2">
                      <svg v-if="sortBy === 'platform_fee' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"/>
                      </svg>
                      <svg v-else-if="sortBy === 'platform_fee' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
                      </svg>
                    </span>
                  </div>
                </th>
                <th
                  @click="sortTable('is_active')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div class="flex items-center">
                    Status
                    <span class="ml-2">
                      <svg v-if="sortBy === 'is_active' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"/>
                      </svg>
                      <svg v-else-if="sortBy === 'is_active' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
                      </svg>
                    </span>
                  </div>
                </th>
                <th
                  @click="sortTable('created_at')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div class="flex items-center">
                    Created
                    <span class="ml-2">
                      <svg v-if="sortBy === 'created_at' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"/>
                      </svg>
                      <svg v-else-if="sortBy === 'created_at' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
                      </svg>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in serviceList.data" :key="service.id" class="hover:bg-gray-50">
                <!-- Actions Dropdown -->
                <td class="px-2 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="relative inline-block actions-dropdown">
                    <button
                      type="button"
                      @click.stop="toggleActionsDropdown(service.id)"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title="Actions"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div
                      v-if="actionsOpenId === service.id"
                      class="absolute left-0 z-20 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none block"
                      style="min-width: 10rem;"
                    >
                      <button
                        v-if="canEditService"
                        type="button"
                        @click.stop="closeAndRun(() => editService(service))"
                        class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        v-if="canDeleteService"
                        type="button"
                        @click.stop="closeAndRun(() => deleteService(service.id))"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ service.description || 'No description' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    £{{ Number(service.platform_fee || 0).toFixed(2) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      service.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ service.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(service.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!listLoading && (!serviceList.data || serviceList.data.length === 0)" class="p-8 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 mb-4">No services found</p>
          <button
            v-if="canAddService"
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Your First Service
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="!listLoading && serviceList.data && serviceList.data.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="page === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="page >= serviceList.last_page"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ serviceList.from || 0 }}</span>
                  to
                  <span class="font-medium">{{ serviceList.to || 0 }}</span>
                  of
                  <span class="font-medium">{{ serviceList.total || 0 }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <!-- Previous Button -->
                  <button
                    @click="previousPage"
                    :disabled="page === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  <!-- Page Numbers -->
                  <button
                    v-for="pageNum in visiblePages"
                    :key="pageNum"
                    @click="goToPage(pageNum)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      pageNum === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ pageNum }}
                  </button>

                  <!-- Next Button -->
                  <button
                    @click="nextPage"
                    :disabled="page >= serviceList.last_page"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Items per page selector -->
          <div class="mt-3 flex items-center justify-end">
            <label for="itemsPerPage" class="text-sm text-gray-700 mr-2">Items per page:</label>
            <select
              id="itemsPerPage"
              v-model="itemsPerPage"
              @change="changeItemsPerPage"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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

    <!-- Service Modal -->
    <ServiceModal
      ref="serviceModalRef"
      :is-visible="showModal"
      :edit-data="editingService"
      @close="closeModal"
      @submit="handleServiceSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { AxiosError } from 'axios'
import { servicesService, notificationService } from '@/services/_singletons'
import ServiceModal from '@/components/dialogs/AddEditServiceDialog.vue'
import { useStaffPermissions } from '@/composables/useStaffPermissions'
import Swal from 'sweetalert2'

const { canAdd, canEdit, canDelete } = useStaffPermissions()
const canAddService = computed(() => canAdd('service'))
const canEditService = computed(() => canEdit('service'))
const canDeleteService = computed(() => canDelete('service'))

interface ServiceFormData {
  name: string
  description: string
  platform_fee: number
  is_active: boolean
}

const serviceList: any = ref({
  data: [],
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0
})
const listLoading = ref(false)
const showModal = ref(false)
const editingService = ref<ServiceFormData | null>(null)
const updateId = ref(0)

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('id')
const orderBy = ref('desc')

const actionsOpenId = ref<string | number | null>(null)

const toggleActionsDropdown = (serviceId: string | number) => {
  actionsOpenId.value = actionsOpenId.value === serviceId ? null : serviceId
}

const closeAndRun = (fn: () => void) => {
  actionsOpenId.value = null
  fn()
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const visiblePages = computed(() => {
  const total = serviceList.value.last_page || 1
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

const sortTable = (column: string) => {
  if (sortBy.value === column) {
    orderBy.value = orderBy.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    orderBy.value = 'asc'
  }
  page.value = 1
  fetchServices()
}

const fetchServices = async () => {
  try {
    listLoading.value = true

    const res: any = await servicesService.getServicesList([
      { key: 'sort_column', value: sortBy.value },
      { key: 'sort_direction', value: orderBy.value },
      { key: 'per_page', value: itemsPerPage.value },
      { key: 'page', value: page.value },
    ])

    serviceList.value = res
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  } finally {
    listLoading.value = false
  }
}

const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= serviceList.value.last_page) {
    page.value = pageNum
    fetchServices()
  }
}

const nextPage = () => {
  if (page.value < serviceList.value.last_page) {
    page.value++
    fetchServices()
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
    fetchServices()
  }
}

const changeItemsPerPage = () => {
  page.value = 1
  fetchServices()
}

const openCreateModal = () => {
  editingService.value = null
  updateId.value = 0
  showModal.value = true
}

const editService = (service: any) => {
  editingService.value = {
    name: service.name,
    description: service.description || '',
    platform_fee: Number(service.platform_fee),
    is_active: service.is_active
  }
  updateId.value = service.id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingService.value = null
  updateId.value = 0
}

const handleServiceSubmit = async (formData: ServiceFormData) => {
  if (updateId.value !== 0) {
    await updateServices(updateId.value, formData)
  } else {
    await addNewService(formData)
  }
}

const addNewService = async (userData: any) => {
  try {
    const res: any = await servicesService.addServices(userData)
    notificationService.showSuccess(res.message)
    fetchServices()
    closeModal()
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

const updateServices = async (id: any, userData: any) => {
  try {
    const res: any = await servicesService.updateServices(id, userData)
    notificationService.showSuccess(res.message)
    fetchServices()
    closeModal()
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

const deleteService = async (id: any) => {
  try {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    }).then(async (result: any) => {
      if (result.value) {
        const res: any = await servicesService.deleteServices(id)
        notificationService.showSuccess(res.message)

        if (serviceList.value.data.length === 1 && page.value > 1) {
          page.value--
        }

        fetchServices()
        Swal.fire({
          title: 'Deleted!',
          text: 'Record has been deleted.',
          icon: 'success',
          customClass: { container: 'sweet-alerts' }
        })
      }
    })
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

onMounted(() => {
  fetchServices()

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.actions-dropdown')) {
      actionsOpenId.value = null
    }
  })
})
</script>