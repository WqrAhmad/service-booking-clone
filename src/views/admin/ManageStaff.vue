<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage User</h1>
          <p class="text-gray-600 mt-2">Create and manage user members</p>
        </div>
        <button v-if="canAddStaff" @click="openCreateModal"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
          + Add New User
        </button>
      </div>

      <!-- Staff List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading State -->
        <div v-if="listLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading user...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th @click="sortTable('role_id')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Role
                    <span class="ml-2">
                      <svg v-if="sortBy === 'role_id' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'role_id' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
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
                <th @click="sortTable('name')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                  <div class="flex items-center">
                    Staff Name
                    <span class="ml-2">
                      <svg v-if="sortBy === 'name' && orderBy === 'asc'" class="w-4 h-4" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg v-else-if="sortBy === 'name' && orderBy === 'desc'" class="w-4 h-4" fill="currentColor"
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
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th @click="sortTable('created_at')"
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="staff in staffList.data" :key="staff.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ staff.role.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ staff.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ staff.email || '' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ staff.phone || '' }}</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button @click="viewPermissions(staff)"
                    class="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    :title="`View permissions (${staff.permissions?.length || 0})`">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="ml-1 text-sm font-medium">{{ staff.permissions?.length || 0 }}</span>
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    staff.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]">
                    {{ staff.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button v-if="canEditStaff" @click="editStaff(staff)" class="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button v-if="canDeleteStaff" @click="deleteStaff(staff.id)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!listLoading && (!staffList.data || staffList.data.length === 0)" class="p-8 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-500 mb-4">No staff members found</p>
          <button v-if="canAddStaff" @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Create Your First Staff Member
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="!listLoading && staffList.data && staffList.data.length > 0"
          class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <!-- Results Info -->
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="page === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button @click="nextPage" :disabled="page >= staffList.meta?.last_page"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ staffList.meta?.from || 0 }}</span>
                  to
                  <span class="font-medium">{{ staffList.meta?.to || 0 }}</span>
                  of
                  <span class="font-medium">{{ staffList.meta?.total || 0 }}</span>
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
                  <button @click="nextPage" :disabled="page >= staffList.last_page"
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

    <!-- Staff Modal -->
    <StaffModal ref="staffModalRef" :is-visible="showModal" :edit-data="editingStaff"
      :permissions-list="permissionsList" @close="closeModal" @submit="handleStaffSubmit" />

    <!-- Permissions Dialog -->
    <div v-if="showPermissionsDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click.self="closePermissionsDialog">
      <!-- Modal panel -->
      <div
        class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 class="text-lg font-semibold text-white">
                Staff Permissions
              </h3>
            </div>
            <button @click="closePermissionsDialog" class="text-white hover:text-gray-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-6 py-5">
          <!-- Staff Info -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-semibold text-gray-900">{{ selectedStaff?.name }}</h4>
                <p class="text-sm text-gray-600">{{ selectedStaff?.role?.name }}</p>
              </div>
            </div>
          </div>

          <!-- Permissions List -->
          <div>
            <h5 class="text-sm font-medium text-gray-700 mb-3">
              Assigned Permissions ({{ selectedStaff?.permissions?.length || 0 }})
            </h5>

            <div v-if="selectedStaff?.permissions && selectedStaff.permissions.length > 0"
              class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="permission in selectedStaff.permissions" :key="permission.id"
                class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                <svg class="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-gray-900">{{ permission.display_name }}</span>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p class="text-gray-500 text-sm">No permissions assigned</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4">
          <button @click="closePermissionsDialog"
            class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { AxiosError } from 'axios'
import { staffService, notificationService } from '@/services/_singletons'
import StaffModal from '@/components/dialogs/AddEditStaffDialog.vue'
import { useStaffPermissions } from '@/composables/useStaffPermissions'
import Swal from 'sweetalert2'

const { canAdd, canEdit, canDelete } = useStaffPermissions()
const canAddStaff = computed(() => canAdd('staff'))
const canEditStaff = computed(() => canEdit('staff'))
const canDeleteStaff = computed(() => canDelete('staff'))

interface StaffFormData {
  name: string
  email: string
  phone: string
  address: string
  password: string
  password_confirmation: string
  permissions: number[]
}

const staffList: any = ref({
  data: [],
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0
})
const permissionsList: any = ref<any[]>([])
const listLoading = ref(false)
const showModal = ref(false)
const editingStaff: any = ref<StaffFormData | null>(null)
const updateId = ref(0)

// Permissions Dialog
const showPermissionsDialog = ref(false)
const selectedStaff = ref<any>(null)

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('id')
const orderBy = ref('desc')



const visiblePages = computed(() => {
  const total = staffList.value.last_page || 1
  const current = page.value
  const pages: number[] = []

  // Always show first page
  pages.push(1)

  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }

  // Always show last page if there's more than one page
  if (total > 1) {
    pages.push(total)
  }

  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b)
})

// Permissions Dialog Methods
const viewPermissions = (staff: any) => {
  selectedStaff.value = staff
  showPermissionsDialog.value = true
}

const closePermissionsDialog = () => {
  showPermissionsDialog.value = false
  selectedStaff.value = null
}

// Sorting method
const sortTable = (column: string) => {
  if (sortBy.value === column) {
    // Toggle order if same column
    orderBy.value = orderBy.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new column and default to ascending
    sortBy.value = column
    orderBy.value = 'asc'
  }
  page.value = 1 // Reset to first page when sorting
  fetchStaff()
}

const fetchPermissions = async () => {
  try {
    const res: any = await staffService.getPermissions()
    permissionsList.value = res.data || res || []
  }
  catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

const fetchStaff = async () => {
  try {
    listLoading.value = true

    const res: any = await staffService.getStaffList([
      { key: 'sort_column', value: sortBy.value },
      { key: 'sort_direction', value: orderBy.value },
      { key: 'per_page', value: itemsPerPage.value },
      { key: 'page', value: page.value },
    ])

    staffList.value = res
  }
  catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
  finally {
    listLoading.value = false
  }
}

// Pagination methods
const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= staffList.value.last_page) {
    page.value = pageNum
    fetchStaff()
  }
}

const nextPage = () => {
  if (page.value < staffList.value.last_page) {
    page.value++
    fetchStaff()
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
    fetchStaff()
  }
}

const changeItemsPerPage = () => {
  page.value = 1 // Reset to first page when changing items per page
  fetchStaff()
}

const openCreateModal = () => {
  editingStaff.value = null
  updateId.value = 0
  showModal.value = true
}

const editStaff = (staff: any) => {
  editingStaff.value = {
    name: staff.name,
    email: staff.email || '',
    phone: staff.phone || '',
    address: staff.address || '',
    password: '',
    password_confirmation: '',
    permissions: staff.permissions ? staff.permissions.map((p: any) => p.id) : [],
  }
  updateId.value = staff.id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingStaff.value = null
  updateId.value = 0
}

const handleStaffSubmit = async (formData: any) => {
  if (updateId.value !== 0) {
    await updateStaff(updateId.value, formData)
  } else {
    await addNewStaff(formData)
  }
}

const addNewStaff = async (userData: any) => {
  try {
    const res: any = await staffService.addStaff(userData)
    notificationService.showSuccess(res.message)
    fetchStaff()
    closeModal()
  }
  catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

const updateStaff = async (id: any, userData: any) => {
  try {
    const res: any = await staffService.updateStaff(id, userData)
    notificationService.showSuccess(res.message)
    fetchStaff()
    closeModal()
  }
  catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)
      return
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message)
    }
  }
}

const deleteStaff = async (id: any) => {
  try {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    }).then(async (result: any) => {
      if (result.value) {
        const res: any = await staffService.deleteStaff(id)
        notificationService.showSuccess(res.message)

        // If we deleted the last item on the page and it's not the first page, go back one page
        if (staffList.value.data.length === 1 && page.value > 1) {
          page.value--
        }

        fetchStaff()
        Swal.fire({
          title: 'Deleted!',
          text: 'Staff member has been deleted.',
          icon: 'success',
          customClass: { container: 'sweet-alerts' }
        })
      }
    })
  }
  catch (e) {
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
  fetchPermissions()
  fetchStaff()
})
</script>