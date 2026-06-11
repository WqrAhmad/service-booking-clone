<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="close"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? 'Edit Staff Member' : 'Create New Staff Member' }}
          </h3>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name and Email Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Staff Name -->
            <div>
              <label for="staffName" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="staffName"
                v-model="formData.name"
                type="text"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.name ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="e.g., John Doe"
                @input="validateName"
                @blur="validateName"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="staffEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="staffEmail"
                v-model="formData.email"
                type="email"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.email ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="e.g., john.doe@example.com"
                @input="validateEmail"
                @blur="validateEmail"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>
            <div>
              <label for="staffPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                id="staffPhone"
                v-model="formData.phone"
                type="tel"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="e.g., +44 7700 900000"
                @input="validatePhone"
                @blur="validatePhone"
              />
              <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Status Field (only shown in edit mode) -->
          <div v-if="isEditMode" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="relative">
              <label for="staffStatus" class="block text-sm font-medium text-gray-700 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="staffStatus"
                  :value="statusDisplay"
                  @focus="showStatusDropdown = true"
                  type="text"
                  required
                  readonly
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  placeholder="Select status"
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
                  v-if="showStatusDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    v-for="status in statusOptions"
                    :key="status.value"
                    @click="selectStatus(status)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-100': formData.status === status.value }"
                  >
                    {{ status.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Row (only for create or if user wants to change) -->
          <div v-if="!isEditMode || showPasswordFields" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password -->
            <div>
              <label for="staffPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Password <span v-if="!isEditMode" class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="staffPassword"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  :class="[
                    'w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter password"
                  @input="validatePassword"
                  @blur="validatePassword"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Password Confirmation -->
            <div>
              <label for="staffPasswordConfirmation" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span v-if="!isEditMode" class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="staffPasswordConfirmation"
                  v-model="formData.password_confirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  :class="[
                    'w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Confirm password"
                  @input="validatePasswordConfirmation"
                  @blur="validatePasswordConfirmation"
                />
                <button
                  type="button"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="!showPasswordConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.password_confirmation }}</p>
            </div>
          </div>

          <!-- Toggle change password for edit mode -->
          <div v-if="isEditMode && !showPasswordFields">
            <button
              type="button"
              @click="togglePasswordFields"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Change Password
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <!-- Address -->
            <div>
              <label for="staffAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="staffAddress"
                v-model="formData.address"
                rows="2"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none',
                  errors.address ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Enter full address"
                maxlength="200"
                @input="validateAddress"
                @blur="validateAddress"
              ></textarea>
              <div class="flex justify-between mt-1">
                <p v-if="errors.address" class="text-xs text-red-500">{{ errors.address }}</p>
                <p class="text-xs text-gray-500 ml-auto">{{ formData.address.length }}/200</p>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div class="border border-gray-300 rounded-lg overflow-hidden">
              <div v-if="groupedPermissions && Object.keys(groupedPermissions).length > 0" class="max-h-96 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        List
                      </th>
                      <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Add
                      </th>
                      <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Edit
                      </th>
                      <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(permissions, category) in groupedPermissions"
                      :key="category"
                      class="hover:bg-gray-50"
                    >
                     <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
  {{ category === 'User' ? 'Staff' : category }}
</td>
                      <td class="px-4 py-3 text-center">
                        <input
                          v-if="getPermissionByType(permissions, 'List')"
                          v-model="formData.permissions"
                          type="checkbox"
                          :value="getPermissionByType(permissions, 'List').id"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span v-else class="text-gray-300">-</span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <input
                          v-if="getPermissionByType(permissions, 'Add')"
                          v-model="formData.permissions"
                          type="checkbox"
                          :value="getPermissionByType(permissions, 'Add').id"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span v-else class="text-gray-300">-</span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <input
                          v-if="getPermissionByType(permissions, 'Edit')"
                          v-model="formData.permissions"
                          type="checkbox"
                          :value="getPermissionByType(permissions, 'Edit').id"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span v-else class="text-gray-300">-</span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <input
                          v-if="getPermissionByType(permissions, 'Delete')"
                          v-model="formData.permissions"
                          type="checkbox"
                          :value="getPermissionByType(permissions, 'Delete').id"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span v-else class="text-gray-300">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-sm text-gray-500 text-center py-8">
                No permissions available
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <p class="text-xs text-gray-500">
                Selected: {{ formData.permissions.length }} permission(s)
              </p>
              <button
                v-if="formData.permissions.length > 0"
                type="button"
                @click="clearAllPermissions"
                class="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

interface StaffFormData {
  name: string
  email: string
  phone: string
  address: string
  password: string
  password_confirmation: string
  permissions: number[]
  status: string
}

interface Props {
  isVisible: boolean
  editData?: StaffFormData | null
  permissionsList?: Record<string, any[]>
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: StaffFormData): void
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  editData: null,
  permissionsList: () => ({})
})

const emit = defineEmits<Emits>()

const isSubmitting = ref(false)
const showStatusDropdown = ref(false)
const showPasswordFields = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const statusOptions = ref([
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
])

const formData = ref<StaffFormData>({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
  permissions: [],
  status: 'active'
})

const errors = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: ''
})

const statusDisplay = computed(() => {
  return statusOptions.value.find(status => status.value === formData.value.status)?.label || ''
})

const selectStatus = (status: any) => {
  formData.value.status = status.value
  showStatusDropdown.value = false
}

const togglePasswordFields = () => {
  showPasswordFields.value = true
  // Clear password fields and errors when showing them
  formData.value.password = ''
  formData.value.password_confirmation = ''
  errors.value.password = ''
  errors.value.password_confirmation = ''
}

const isEditMode = computed(() => props.editData !== null)

const groupedPermissions = computed(() => {
  if (!props.permissionsList || Object.keys(props.permissionsList).length === 0) {
    return {}
  }
  
  return props.permissionsList
})

const isFormValid = computed(() => {
  const basicValidation = 
    formData.value.name.trim().length >= 2 &&
    formData.value.email.trim().length > 0 &&
    !errors.value.name &&
    !errors.value.email &&
    !errors.value.phone &&
    !errors.value.address

  if (!isEditMode.value) {
    // For create mode, password is required
    return basicValidation &&
      formData.value.password.length >= 8 &&
      formData.value.password === formData.value.password_confirmation &&
      !errors.value.password &&
      !errors.value.password_confirmation
  } else if (showPasswordFields.value) {
    // For edit mode with password change - password is optional but if provided must be valid
    if (formData.value.password || formData.value.password_confirmation) {
      return basicValidation &&
        formData.value.password.length >= 8 &&
        formData.value.password === formData.value.password_confirmation &&
        !errors.value.password &&
        !errors.value.password_confirmation
    }
    return basicValidation
  } else {
    // For edit mode without password change
    return basicValidation
  }
})

// Validation functions
const validateName = () => {
  const name = formData.value.name.trim()
  if (!name) {
    errors.value.name = 'Name is required'
  } else if (name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  } else if (name.length > 100) {
    errors.value.name = 'Name must not exceed 100 characters'
  } else if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.value.name = 'Name can only contain letters, spaces, hyphens, and apostrophes'
  } else {
    errors.value.name = ''
  }
}

const validateEmail = () => {
  const email = formData.value.email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(email)) {
    errors.value.email = 'Please enter a valid email address'
  } else if (email.length > 255) {
    errors.value.email = 'Email must not exceed 255 characters'
  } else {
    errors.value.email = ''
  }
}

const validatePhone = () => {
  const phone = formData.value.phone.trim()
  if (phone && phone.length > 0) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/
    if (!phoneRegex.test(phone)) {
      errors.value.phone = 'Please enter a valid phone number'
    } else if (phone.length < 7 || phone.length > 20) {
      errors.value.phone = 'Phone number must be between 7 and 20 characters'
    } else {
      errors.value.phone = ''
    }
  } else {
    errors.value.phone = ''
  }
}

const validateAddress = () => {
  const address = formData.value.address.trim()
  if (address.length > 200) {
    errors.value.address = 'Address must not exceed 200 characters'
  } else {
    errors.value.address = ''
  }
}

const validatePassword = () => {
  const password = formData.value.password
  
  if (!isEditMode.value) {
    // Create mode - password required
    if (!password) {
      errors.value.password = 'Password is required'
    } else if (password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters'
    } else {
      errors.value.password = ''
    }
  } else if (showPasswordFields.value) {
    // Edit mode - password optional, but if provided must be valid
    if (password && password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters'
    } else {
      errors.value.password = ''
    }
  } else {
    errors.value.password = ''
  }
}

const validatePasswordConfirmation = () => {
  const password = formData.value.password
  const confirmation = formData.value.password_confirmation
  
  if (!isEditMode.value) {
    // Create mode - confirmation required
    if (!confirmation) {
      errors.value.password_confirmation = 'Please confirm your password'
    } else if (password !== confirmation) {
      errors.value.password_confirmation = 'Passwords do not match'
    } else {
      errors.value.password_confirmation = ''
    }
  } else if (showPasswordFields.value) {
    // Edit mode - if password provided, confirmation must match
    if (password && password !== confirmation) {
      errors.value.password_confirmation = 'Passwords do not match'
    } else {
      errors.value.password_confirmation = ''
    }
  } else {
    errors.value.password_confirmation = ''
  }
}

const validateForm = () => {
  validateName()
  validateEmail()
  validatePhone()
  validateAddress()
  
  if (!isEditMode.value || showPasswordFields.value) {
    validatePassword()
    validatePasswordConfirmation()
  }
  
  return isFormValid.value
}

// Permission management methods
const getPermissionByType = (permissions: any[], displayName: string) => {
  return permissions.find(p => p.display_name === displayName)
}

const clearAllPermissions = () => {
  formData.value.permissions = []
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    permissions: [],
    status: 'active'
  }
  errors.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  }
  showPasswordFields.value = false
  showPassword.value = false
  showPasswordConfirmation.value = false
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showStatusDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for changes in editData to populate form
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
    if (!formData.value.status) {
      formData.value.status = 'active'
    }
    showPasswordFields.value = false
    showPassword.value = false
    showPasswordConfirmation.value = false
    errors.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      password_confirmation: ''
    }
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

const close = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    const submitData:any = { ...formData.value }
    
    // If in edit mode and not changing password, remove password fields
    if (isEditMode.value && !showPasswordFields.value) {
      delete submitData.password
      delete submitData.password_confirmation
    }
    
    // If in edit mode and password fields are empty, remove them
    if (isEditMode.value && showPasswordFields.value && !submitData.password) {
      delete submitData.password
      delete submitData.password_confirmation
    }
    
    emit('submit', submitData)
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({
  close
})
</script>