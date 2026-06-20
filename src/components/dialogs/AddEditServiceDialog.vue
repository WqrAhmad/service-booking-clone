<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? 'Edit Service' : 'Create New Service' }}
          </h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Service Name -->
          <div>
            <label for="serviceName" class="block text-sm font-medium text-gray-700 mb-2">
              Service Name <span class="text-red-500">*</span>
            </label>
            <input id="serviceName" v-model="formData.name" type="text" required :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
              errors.name ? 'border-red-500' : 'border-gray-300'
            ]" placeholder="e.g., Floor Mapping" @input="validateName" @blur="validateName" />
            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="serviceDescription" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea id="serviceDescription" v-model="formData.description" rows="3" :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none',
              errors.description ? 'border-red-500' : 'border-gray-300'
            ]" placeholder="Enter service description" maxlength="500" @input="validateDescription"
              @blur="validateDescription"></textarea>
            <div class="flex justify-between mt-1">
              <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
              <p class="text-xs text-gray-500 ml-auto">{{ formData.description.length }}/500</p>
            </div>
          </div>

          <!-- Deposit Fee -->
          <div>
            <label for="servicePlatformFee" class="block text-sm font-medium text-gray-700 mb-2">
              Price (£) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">£</span>
              </div>
              <input id="servicePlatformFee" v-model.number="formData.price" type="number" step="0.01" min="0"
                max="99999.99" required :class="[
                  'w-full pl-7 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',
                  errors.price ? 'border-red-500' : 'border-gray-300'
                ]" placeholder="0.00" @input="validatePlatformFee" @blur="validatePlatformFee" />
            </div>
            <p v-if="errors.price" class="mt-1 text-xs text-red-500">{{ errors.price }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">Fixed Deposit Fee for this service (e.g., 10.00)</p>
          </div>

          <!-- Active Status -->
          <div>
            <label class="flex items-center">
              <input v-model="formData.is_active" type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span class="ml-2 text-sm text-gray-700">Active (available for selection)</span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="close"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting || !isFormValid"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface ServiceFormData {
  name: string
  description: string
  price: number
  is_active: boolean
}

interface Props {
  isVisible: boolean
  editData?: ServiceFormData | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: ServiceFormData): void
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  editData: null
})

const emit = defineEmits<Emits>()

const isSubmitting = ref(false)

const formData = ref<ServiceFormData>({
  name: '',
  description: '',
  price: 0,
  is_active: true
})

const errors = ref({
  name: '',
  description: '',
  price: ''
})

const isEditMode = computed(() => props.editData !== null)

const isFormValid = computed(() => {
  return (
    formData.value.name.trim().length >= 3 &&
    formData.value.price >= 0 &&
    !errors.value.name &&
    !errors.value.description &&
    !errors.value.price
  )
})

// Validation functions
const validateName = () => {
  const name = formData.value.name.trim()
  if (!name) {
    errors.value.name = 'Service name is required'
  } else if (name.length < 3) {
    errors.value.name = 'Service name must be at least 3 characters'
  } else if (name.length > 100) {
    errors.value.name = 'Service name must not exceed 100 characters'
  } else if (!/^[a-zA-Z0-9\s\-&]+$/.test(name)) {
    errors.value.name = 'Service name can only contain letters, numbers, spaces, hyphens, and ampersands'
  } else {
    errors.value.name = ''
  }
}

const validateDescription = () => {
  const description = formData.value.description.trim()
  if (description.length > 500) {
    errors.value.description = 'Description must not exceed 500 characters'
  } else {
    errors.value.description = ''
  }
}

const validatePlatformFee = () => {
  const fee = formData.value.price
  if (fee < 0) {
    errors.value.price = 'Price cannot be negative'
  } else if (fee > 99999.99) {
    errors.value.price = 'Price cannot exceed £99,999.99'
  } else if (isNaN(fee)) {
    errors.value.price = 'Please enter a valid number'
  } else {
    errors.value.price = ''
  }
}

const validateForm = () => {
  validateName()
  validateDescription()
  validatePlatformFee()
  return isFormValid.value
}
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: 0,
    is_active: true
  }
  errors.value = {
    name: '',
    description: '',
    price: ''
  }
}
// Watch for changes in editData to populate form
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
    // Clear errors when loading edit data
    errors.value = {
      name: '',
      description: '',
      price: ''
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
    emit('submit', { ...formData.value })
  } finally {
    isSubmitting.value = false
  }
}

// Expose close method for parent component
defineExpose({
  close
})
</script>