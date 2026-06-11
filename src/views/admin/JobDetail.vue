<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Job Details</h1>
        <p class="text-gray-600 mt-2">Job # : {{ jobDetails?.job_number }}</p>
      </div>

      <div v-if="jobDetails && Object.keys(jobDetails).length > 0" class="space-y-6">
        <!-- Vehicle Details Display - Compact Vehicle Card (same as SearchStaffs) -->
        <div class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-2xl overflow-hidden">
          <!-- Default Header Section - Always Visible -->
          <div class="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <!-- Brand Logo Placeholder or Actual -->
                <div class="bg-white rounded-lg p-4 shadow-lg">
                  <img v-if="showVehicleDetails && engineDetails?.brand_image" :src="engineDetails.brand_image"
                    :alt="jobDetails.vehicle_make || ''" class="h-16 w-auto" />
                  <div v-else class="h-16 w-16 flex items-center justify-center">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>

                <!-- Vehicle Name & Registration -->
                <div class="text-white">
                  <h2 v-if="showVehicleDetails" class="text-3xl font-bold mb-1">{{ vehicleDetails.name || '' }}</h2>
                  <h2 v-else class="text-3xl font-bold mb-1">{{ jobDetails.vehicle_make }} {{ jobDetails.vehicle_model
                    }}</h2>
                  <div class="flex items-center space-x-4 text-blue-100">
                    <span class="text-lg font-semibold bg-white/20 px-3 py-1 rounded">{{ jobDetails.registration
                      }}</span>
                    <span v-if="showVehicleDetails" class="text-sm">{{ vehicleDetails.year }}</span>
                  </div>
                </div>
              </div>

              <!-- Lookup Button (when details not loaded) OR Quick Stats (when loaded) -->
              <div v-if="!showVehicleDetails" class="flex items-center">
                <button @click="lookupVehicle" :disabled="isLookingUp || !jobDetails.registration"
                  class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <svg v-if="isLookingUp" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {{ isLookingUp ? 'Looking up...' : 'Lookup Vehicle' }}
                </button>
              </div>
              <div v-else class="hidden lg:flex space-x-4">
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

          <!-- Main Content Grid - Only shown after lookup -->
          <div v-if="showVehicleDetails" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left: Vehicle Specs -->
              <div class="lg:col-span-4 space-y-4">
                <h3 class="text-lg font-semibold text-white mb-3">Vehicle Details</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Energy</p>
                    <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.energy || 'N/A' }}</p>
                  </div>
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Engine Number</p>
                    <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.engine_number || 'N/A' }}</p>
                  </div>
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Compression Ratio</p>
                    <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.compression_ratio || 'N/A' }}
                    </p>
                  </div>
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Bore Stroke Ratio</p>
                    <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.bore_stroke_ratio || 'N/A' }}
                    </p>
                  </div>
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Method</p>
                    <p class="text-sm font-semibold text-white">{{ engineDetails?.specz?.method || 'N/A' }}</p>
                  </div>
                  <div class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p class="text-xs text-gray-400 mb-1">Cylinder Content</p>
                    <p class="text-sm font-semibold text-white">
                      {{ engineDetails?.specz?.['Cylinder content'] || 'N/A' }}
                    </p>
                  </div>
                </div>

                <!-- Engine Info -->
                <div
                  class="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
                  <h4 class="text-sm font-semibold text-blue-300 mb-2">Engine ECU</h4>
                  <p class="text-xs text-white">{{ engineDetails?.specz?.engine_ecu || 'N/A' }}</p>
                </div>
              </div>

              <!-- Center & Right: Performance Metrics -->
              <div class="lg:col-span-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Power Performance -->
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
                        <div class="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style="width: 100%">
                        </div>
                      </div>

                      <div class="mt-4 pt-4 border-t border-white/10 text-center">
                        <span class="text-lg text-red-400 font-bold">+{{ engineDetails?.horsepower_white -
                          engineDetails?.horsepower_original }}hp gain</span>
                      </div>
                    </div>
                  </div>

                  <!-- Torque Performance -->
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
                        <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style="width: 100%">
                        </div>
                      </div>

                      <div class="mt-4 pt-4 border-t border-white/10 text-center">
                        <span class="text-lg text-blue-400 font-bold">+{{ engineDetails?.torque_white -
                          engineDetails?.torque_original }}Nm gain</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tuning Options -->
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

        <!-- Job Information -->
        <div class="bg-white rounded-lg shadow-xl p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Job Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
              <p class="text-gray-900 font-medium">{{ jobDetails?.customer_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Customer Email</label>
              <p class="text-gray-900">{{ jobDetails?.customer_email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Service Name</label>
              <template v-if="Array.isArray(jobDetails?.job_services)">
                <p v-for="(service, index) in jobDetails.job_services" :key="index" class="text-gray-900">
                  {{ service?.service?.name }}
                </p>
              </template>

              <p v-else class="text-gray-900">{{ jobDetails?.service?.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span :class="[
                'px-3 py-1 inline-flex text-sm font-semibold rounded-full',
                getStatusClass(jobDetails.status)
              ]">
                {{ jobDetails.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Job Address</label>
              <p class="text-gray-900">{{ jobDetails.customer_address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Postcode</label>
              <p class="text-gray-900">{{ jobDetails.post_code }}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-6 border border-green-200">
              <label class="block text-sm font-medium text-gray-500 mb-1">Assigned Staff</label>
              <div class="flex items-center gap-2 justify-between">
                <div> <img :src="jobDetails?.mapper?.avatar" alt="Staff Profile Image" class="w-10 h-10 rounded-full">
                </div>
                <div>
                  <p class="text-gray-900">{{ jobDetails?.mapper?.name }}</p>
                  <p class="text-sm text-gray-500">{{ jobDetails?.mapper?.business_name }}</p>
                  <p class="text-sm text-gray-500">{{ jobDetails?.mapper?.post_code }}</p>
                  <p class="text-sm text-gray-500">{{ jobDetails?.mapper?.phone }}</p>
                </div>
                <div>
                  <button :class="[
                    'px-4 py-2 font-medium rounded-lg transition-colors',
                    jobDetails?.mapper?.available === 'not_available'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  ]">
                    {{ jobDetails?.mapper?.available === 'not_available' ? 'Not Available' : 'Available' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-xl p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Invoice</h2>
            <div class="flex gap-3">
              <button
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                @click="goToJobSheet(jobDetails.id)">
                Job Sheet
              </button>

              <button v-if="canEditJob" @click="() => generateInvoice()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Generate Invoice
              </button>

              <button v-if="canEditJob" @click="generateInvoiceAndShare(jobDetails.id)"
                :disabled="isGeneratingAndSharing"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isGeneratingAndSharing">Share on WhatsApp</span>
                <span v-else>Sharing...</span>
              </button>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 space-y-4"
            v-if="jobDetails?.job_services && jobDetails?.job_services.length > 0">
            <!-- <div class="flex justify-between" v-for="(service, index) in jobDetails.job_services" :key="index">
              <span class="text-gray-600">{{ service?.service?.name }}:</span>
              <span class="font-medium text-gray-900">£{{ service?.service_price }}</span>
            </div> -->
            <table class="w-full">
              <thead class="bg-gray-100 py-2">
                <tr>
                  <th class="text-left py-2">Service</th>
                  <th class="text-left py-2">Service Price</th>
                  <th class="text-left py-2">Deposit Fee</th>
                  <th class="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(service, index) in jobDetails.job_services" :key="index">
                  <td>{{ service?.service?.name }}</td>
                  <td>£{{ service?.service_price }}</td>
                  <td>£{{ service?.platform_fee }}</td>
                  <td>£{{ service?.service_price + service?.platform_fee }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="3" class="text-right py-2 pe-5 ">Total</th>
                  <td class="text-left py-2">£{{ jobDetails.total_amount }}</td>
                </tr>
              </tfoot>
            </table>
          </div>


          <!-- Payment Link Dialog -->
          <transition enter-active-class="transition-opacity duration-150"
            leave-active-class="transition-opacity duration-150">
            <div v-if="showPaymentDialog && jobDetails?.payment_url"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Payment Link</h3>
                  <button @click="showPaymentDialog = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p class="text-sm text-gray-500 mb-3">
                  Share this link with the customer so they can complete payment.
                </p>

                <div class="flex gap-2">
                  <input type="text" :value="jobDetails.payment_url" readonly
                    class="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                  <button @click="copyPaymentLink"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0">
                    <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ copied ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Manual payment modal -->
          <div v-if="showManualPaymentModal" class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
            <div class="flex min-h-full items-center justify-center p-4">
              <div class="fixed inset-0 bg-black/50" @click="closeManualPaymentModal" />
              <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Mark payment received</h3>
                <div class="space-y-4">

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                    <input v-model.number="manualPaymentForm.amount" type="number" step="0.01" min="0" readonly disabled
                      placeholder="0.00"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea v-model="manualPaymentForm.notes" rows="3" placeholder="Optional notes"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                  <button type="button" @click="closeManualPaymentModal"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="button" @click="submitManualPayment" :disabled="manualPaymentSubmitting"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {{ manualPaymentSubmitting ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="text-center py-12">
        <p class="text-gray-600">Loading job details...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { notificationService, jobService, paymentService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import { useAppStore } from '@/stores';
import Swal from 'sweetalert2';
const { canEdit } = useStaffPermissions();
const canEditJob = computed(() => canEdit('job'));
const appStore = useAppStore();
const isLoading = ref(false);
const isGeneratingInvoice = ref(false);
const isGeneratingAndSharing = ref(false);
const isLookingUp = ref(false);
const showVehicleDetails = ref(false);
const copied = ref(false);
const showPaymentDialog = ref(false);
const showManualPaymentModal = ref(false);
const manualPaymentSubmitting = ref(false);
const manualPaymentForm = ref<{ amount: number | string; notes: string }>({ amount: '', notes: '' });
const vehicleDetails: any = ref({});
const engineDetails: any = ref({});
const jobDetails: any = ref({});
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const id: any = route.query.id
  if (id) {
    await fetchUserById(id)
  }
});

// Fetch user data
const fetchUserById = async (id: any) => {
  try {
    isLoading.value = true;
    const res: any = await jobService.getJobById(id);
    jobDetails.value = res.data
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    }
  } finally {
    isLoading.value = false;
  }
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    paid: 'bg-purple-100 text-purple-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatOption = (option: string): string => {
  return option
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const generateInvoice = async (options: { open?: boolean } = { open: true }) => {
  if (!jobDetails.value) return;

  try {
    isGeneratingInvoice.value = true;

    const res: any = await jobService.getpdfById(jobDetails.value.id);

    if (res.data && res.data?.pdf_url) {
      if (options.open !== false) {
        window.open(res.data?.pdf_url, '_blank');
        notificationService.showSuccess('Invoice generated successfully');
      }
      return true;
    }
    return false;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message || 'Failed to generate invoice');
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message || 'Unauthorized');
      return;
    }
  } finally {
    isGeneratingInvoice.value = false;
  }
};



const generateInvoiceAndShare = async (jobId: any) => {
  if (isGeneratingAndSharing.value) return;

  try {
    isGeneratingAndSharing.value = true;

    const result = await Swal.fire({
      icon: 'question',
      title: 'Share on WhatsApp?',
      text: 'Are you sure you want to share the invoice to the customer?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Share',
      cancelButtonText: 'Cancel',
      padding: '2em',
      customClass: { container: 'sweet-alerts' },
    });

    if (result.value) {
      const payload: any = {
        job_id: jobId,
      };
      const res: any = await jobService.shareOnWhatsApp(payload);
      notificationService.showSuccess(res.message);
      window.open(res.whatsapp_url, '_blank');
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
      return;
    }
  } finally {
    isGeneratingAndSharing.value = false;
  }
};


const closeManualPaymentModal = () => {
  showManualPaymentModal.value = false;
  manualPaymentForm.value = { amount: '', notes: '' };
};

const submitManualPayment = async () => {
  if (!jobDetails.value?.id) return;
  const amount = Number(manualPaymentForm.value.amount);
  if (Number.isNaN(amount) || amount < 0) {
    notificationService.showError('Please enter a valid amount');
    return;
  }
  try {
    manualPaymentSubmitting.value = true;
    await paymentService.manuallyPayment({
      job_id: jobDetails.value.id,
      amount,
      notes: manualPaymentForm.value.notes || undefined,
    });
    jobDetails.value.payment_status = 'paid';
    notificationService.showSuccess('Payment recorded');
    closeManualPaymentModal();
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError((e.response?.data as any)?.message || 'Failed to record payment');
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError((e.response?.data as any)?.message || 'Unauthorized');
      return;
    }
    notificationService.showError('Failed to record payment');
  } finally {
    manualPaymentSubmitting.value = false;
  }
};

const copyPaymentLink = async () => {
  appStore.setPaymentJob({
    id: jobDetails.value.id,
    job_number: jobDetails.value.job_number,
    service_name: jobDetails.value.service?.name,
    platform_fee: jobDetails.value.platform_fee,
    payment_url: jobDetails.value.payment_url,
  });
  const link = jobDetails.value?.payment_url;

  if (!link) return;
  try {
    await navigator.clipboard.writeText(link);
    copied.value = true;
    notificationService.showSuccess('Payment link copied to clipboard');
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    notificationService.showError('Failed to copy link');
  }
};
const lookupVehicle = async () => {
  try {
    isLookingUp.value = true;
    const response = await fetch(
      `https://backend-2.tuning-company.co.uk/resolve?reg=${jobDetails.value.registration}`
    );

    if (!response.ok) throw new Error('Vehicle not found');

    const data = await response.json();
    if (!data.success) throw new Error('Vehicle lookup failed');

    vehicleDetails.value = data;


    if (data.id) {
      await fetchEngineDetails(data.id);
    }
    showVehicleDetails.value = true;
  } catch (error) {
    console.error('Error looking up vehicle:', error);
    notificationService.showError('Vehicle lookup failed');
  } finally {
    isLookingUp.value = false;
  }
};

const fetchEngineDetails = async (engineId: string) => {
  try {
    const response = await fetch(
      `https://backend-2.tuning-company.co.uk/getEngineDetails/?engine_id=${engineId}`
    );

    if (!response.ok) throw new Error('Engine details not found');

    const data = await response.json();
    engineDetails.value = data.engineDetails;
  } catch (error) {
    console.error('Error fetching engine details:', error);
  }
};

const goToJobSheet = (id: string) => {
  router.push({ path: '/admin/jobs/job-sheet', query: { id } });
};
</script>