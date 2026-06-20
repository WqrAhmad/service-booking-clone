<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 flex items-start justify-center">
    <div class="w-full max-w-4xl">

      <!-- Top Bar (hidden on print) -->
      <div class="mb-4 flex items-center justify-between no-print">
        <button @click="$router.back()"
          class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job
        </button>
        <button @click="printSheet" :disabled="isLoading"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors shadow disabled:opacity-50">
          Print / Save PDF
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-lg p-16 text-center">
        <svg class="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-gray-500 text-sm">Loading job sheet...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p class="text-red-500 font-medium mb-3">{{ error }}</p>
        <button @click="loadData" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Retry
        </button>
      </div>

      <!-- Job Sheet Card -->
      <div v-else-if="jobDetails" id="job-sheet" class="bg-white rounded-2xl shadow-lg overflow-hidden font-sans">

        <!-- Header -->
        <div class="px-8 pt-8 pb-5 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-xl font-extrabold text-gray-900 tracking-tight uppercase">Job Sheet</h1>
              <p class="text-sm text-gray-500 mt-0.5">Ref: {{ jobDetails.job_number }}</p>
            </div>
            <span :class="[
              'px-3 py-1 inline-flex text-xs font-semibold rounded-full uppercase tracking-wide',
              getStatusClass(jobDetails.status)
            ]">
              {{ jobDetails.status ?? '—' }}
            </span>
          </div>
        </div>

        <!-- Customer Details + Job Logistics -->
        <div class="px-8 py-6 grid grid-cols-2 gap-8 border-b border-gray-100">
          <!-- Customer Details -->
          <div>
            <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Customer Details</p>
            <table class="w-full text-sm">
              <tbody>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Name:</td>
                  <td class="text-gray-500">{{ jobDetails.customer_name ?? '—' }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Address:</td>
                  <td class="text-gray-500">{{ jobDetails.customer_address ?? '—' }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Town:</td>
                  <td class="text-gray-500">{{ extractedTown }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Postcode:</td>
                  <td class="text-gray-500">{{ jobDetails.post_code ?? '—' }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Phone:</td>
                  <td class="text-gray-500">{{ jobDetails.customer_phone ?? jobDetails.mapper?.phone ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Job Logistics -->
          <div>
            <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Job Logistics</p>
            <table class="w-full text-sm">
              <tbody>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Date:</td>
                  <td class="text-gray-500">{{ formattedDate }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Time:</td>
                  <td class="text-gray-500">{{ formattedTime }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">Location:</td>
                  <td class="text-gray-500">{{ jobDetails.location ?? 'Customers' }}</td>
                </tr>
                <tr class="leading-7">
                  <td class="font-semibold text-gray-800 pr-3 whitespace-nowrap">VRN:</td>
                  <td>
                    <span
                      class="inline-block bg-yellow-400 text-black font-extrabold px-3 py-0.5 rounded text-sm tracking-widest">
                      {{ jobDetails.registration ?? '—' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vehicle Technical Data -->
        <div class="px-8 py-6 border-b border-gray-100">
          <div class="bg-gray-50 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-bold text-gray-800">Vehicle Technical Data</p>
              <div v-if="isLookingUp" class="flex items-center gap-2 text-xs text-blue-500 no-print">
                <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Looking up vehicle...
              </div>
            </div>

            <div class="grid grid-cols-3 gap-y-3 text-sm">
              <div>
                <span class="text-gray-500">Make / Model: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.model }}</span>
              </div>
              <div>
                <span class="text-gray-500">Year: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.year }}</span>
              </div>
              <div>
                <span class="text-gray-500">Energy: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.energy }}</span>
              </div>
              <div>
                <span class="text-gray-500">Engine: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.engine }}</span>
              </div>
              <div>
                <span class="text-gray-500">Fuel: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.fuel }}</span>
              </div>
              <div>
                <span class="text-gray-500">Gearbox: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.gearbox }}</span>
              </div>
              <div>
                <span class="text-gray-500">Capacity: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.capacity }}</span>
              </div>
              <div>
                <span class="text-gray-500">Power: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.power }}</span>
              </div>
              <div>
                <span class="text-gray-500">ECU: </span>
                <span class="font-bold text-gray-900">{{ vehicleInfo.ecu }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Assigned Staff -->
        <div v-if="jobDetails.staff" class="px-8 py-6 border-b border-gray-100">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Assigned Technician</p>
          <div class="bg-gray-50 rounded-xl p-5 flex items-center gap-4">
            <img v-if="jobDetails.staff?.avatar" :src="jobDetails.staff.avatar" alt="Staff Profile Image"
              class="w-12 h-12 rounded-full object-cover shrink-0" />
            <div class="flex-1 grid grid-cols-2 gap-y-1 text-sm">
              <div class="font-bold text-gray-900 col-span-2">{{ jobDetails.staff?.name ?? '—' }}</div>
              <div class="text-gray-500">{{ jobDetails.staff?.business_name ?? '—' }}</div>
              <div class="text-gray-500">{{ jobDetails.staff?.phone ?? '—' }}</div>
              <div class="text-gray-500 col-span-2">{{ jobDetails.staff?.post_code ?? '—' }}</div>
            </div>
            <span :class="[
              'px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap no-print',
              jobDetails.staff?.available === 'not_available'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            ]">
              {{ jobDetails.staff?.available === 'not_available' ? 'Not Available' : 'Available' }}
            </span>
          </div>
        </div>

        <!-- Service Description Table -->
        <div class="px-8 py-6 border-b border-gray-100">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left font-bold text-gray-900 pb-3">Service Description</th>
                <th class="text-left font-bold text-gray-900 pb-3">Qty</th>
                <th class="text-left font-bold text-gray-900 pb-3">Unit Price</th>
                <th class="text-left font-bold text-gray-900 pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100" v-for="(service, index) in jobDetails.job_services" :key="index">
                <td class="py-4 text-gray-600">{{ service?.service?.name ?? '—' }}</td>
                <td class="py-4 text-left text-gray-600">{{ service?.qty ?? 1 }}</td>
                <td class="py-4 text-left">£{{ formatMoney(service?.service_price) }}</td>
                <td class="py-4 text-left font-medium text-gray-900">
                  £{{ formatMoney((service?.qty ?? 1) * (service?.service_price ?? 0)) }}
                </td>
              </tr>
              <tr v-if="!jobDetails.job_services || jobDetails.job_services.length === 0">
                <td colspan="4" class="py-4 text-center text-gray-400">No services listed</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right py-2 pe-5 font-black">Grand Total:</td>
                <td class="text-left py-2 font-black">£{{ grandTotal.toFixed(2) }}</td>
              </tr>


            </tfoot>
          </table>
        </div>

        <!-- Technician / Job Notes -->
        <div class="px-8 py-6 border-b border-gray-100">
          <p class="text-sm font-bold text-gray-900 mb-3">Technician / Job Notes:</p>
          <p class="text-sm text-gray-400 min-h-[60px] whitespace-pre-line">
            {{ jobDetails.notes ?? '' }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 text-center">
          <p class="text-xs text-gray-400">
            {{ jobDetails.mapper?.business_name ?? 'The Remap Master' }}
            <span v-if="jobDetails.mapper?.post_code">, {{ jobDetails.mapper.post_code }}</span>
          </p>
          <p class="text-xs text-gray-400 mt-0.5">{{ jobDetails.mapper?.phone ?? '' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { jobService, notificationService } from '@/services/_singletons';
import { AxiosError } from 'axios';

// ── State ─────────────────────────────────────────────────────────────────────
const route = useRoute();
const isLoading = ref(false);
const isLookingUp = ref(false);
const error = ref('');

const jobDetails: any = ref(null);
const vehicleData: any = ref(null);   // from /resolve
const engineData: any = ref(null);   // from /getEngineDetails

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => loadData());

async function loadData() {
  const id: any = route.query.id;
  if (!id) { error.value = 'No job ID provided.'; return; }
  await fetchJob(id);
}

// ── 1. Fetch Job by ID ────────────────────────────────────────────────────────
const fetchJob = async (id: string) => {
  try {
    isLoading.value = true;
    error.value = '';

    const res: any = await jobService.getJobById(id);
    jobDetails.value = res.data;

    // Auto lookup vehicle using registration from job
    if (jobDetails.value?.registration) {
      lookupVehicle(jobDetails.value.registration); // non-blocking, runs in background
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      error.value = e.response?.data?.message ?? 'Failed to load job details.';
      notificationService.showError(error.value);
    } else {
      error.value = 'An unexpected error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};

// ── 2. Lookup Vehicle by Registration ────────────────────────────────────────
const lookupVehicle = async (reg: string) => {
  try {
    isLookingUp.value = true;
    const res = await fetch(`https://backend-2.tuning-company.co.uk/resolve?reg=${reg}`);
    if (!res.ok) throw new Error('Vehicle not found');
    const data = await res.json();
    if (!data.success) throw new Error('Lookup failed');
    vehicleData.value = data;

    // Fetch engine details if vehicle id available
    if (data.id) {
      await fetchEngineDetails(data.id);
    }
  } catch (e) {
    console.warn('Vehicle lookup skipped:', e);
    // Non-fatal — sheet still renders using jobDetails fallbacks
  } finally {
    isLookingUp.value = false;
  }
};

// ── 3. Fetch Engine Details ───────────────────────────────────────────────────
const fetchEngineDetails = async (engineId: string) => {
  try {
    const res = await fetch(
      `https://backend-2.tuning-company.co.uk/getEngineDetails/?engine_id=${engineId}`
    );
    if (!res.ok) throw new Error('Engine details not found');
    const data = await res.json();
    engineData.value = data.engineDetails;
  } catch (e) {
    console.warn('Engine details skipped:', e);
  }
};

// ── Computed: Merged vehicle info ─────────────────────────────────────────────
// vehicleData.value  →  response from /resolve
// vehicleData.value.engineDetails  →  nested engine object inside /resolve response
// engineData.value   →  response from /getEngineDetails (same shape as engineDetails)
const vehicleInfo = computed(() => {
  // /resolve nests engine data under engineDetails
  const ed = vehicleData.value?.engineDetails ?? engineData.value ?? null;
  const specz = ed?.specz ?? {};

  // Parse make/model/year from fullname: "Audi Q5 FY - MK1 - 2017 - 2018 2.0 TDI CR 190hp"
  const fullname: string = ed?.fullname ?? '';
  const fullnameParts = fullname.split(' - ');

  // First word(s) before the first dash segment = brand + model
  const makeModel = fullnameParts[0]?.trim() ?? '';
  // Year: find a 4-digit year anywhere in the fullname
  const yearMatch = fullname.match(/\b(19|20)\d{2}\b/);

  // Show tuned power alongside stock when a tune has been applied
  const stockPower = ed?.horsepower_original;
  const tunedPower = ed?.horsepower_white;
  let powerLabel = '—';
  if (stockPower != null && tunedPower != null && tunedPower !== stockPower) {
    powerLabel = `${stockPower} hp → ${tunedPower} hp`;
  } else if (stockPower != null) {
    powerLabel = `${stockPower} hp`;
  }

  return {
    energy: specz?.energy ?? '—',
    model: makeModel || jobDetails.value?.vehicle_model || '—',
    year: yearMatch?.[0] ?? '—',
    engine: specz?.engine_number ?? '—',
    color: specz?.colour ?? specz?.color ?? jobDetails.value?.vehicle_color ?? '—',
    fuel: specz?.energy ?? '—',
    gearbox: specz?.method ?? '—',
    capacity: specz?.['Cylinder content'] ?? specz?.capacity ?? '—',
    power: powerLabel,
    ecu: specz?.engine_ecu ?? '—',
  };
});

// ── Computed: Extract town from address string ────────────────────────────────
const extractedTown = computed(() => {
  const addr: string = jobDetails.value?.customer_address ?? '';
  if (!addr) return '—';
  const parts = addr.split(',').map((s: string) => s.trim());
  // Return second part if exists, otherwise first
  return parts.length > 1 ? parts[1] : parts[0];
});

// ── Computed: Date & Time ─────────────────────────────────────────────────────
const formattedDate = computed(() => {
  const raw = jobDetails.value?.scheduled_at
    ?? jobDetails.value?.created_at
    ?? jobDetails.value?.date
    ?? '';
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toLocaleDateString('en-GB');
});

const formattedTime = computed(() => {
  const raw = jobDetails.value?.scheduled_at
    ?? jobDetails.value?.created_at
    ?? jobDetails.value?.date
    ?? '';
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '—';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
});

// ── Computed: Money formatting ────────────────────────────────────────────────
const formatMoney = (value: any): string => {
  const n = Number(value) || 0;
  return n.toFixed(2);
};

// ── Computed: Totals (qty-aware, mirrors Job Details grandTotal logic) ────────
const grandTotal = computed(() => {
  return (jobDetails.value?.job_services || []).reduce((sum: number, service: any) => {
    const qty = Number(service?.qty) || 1;
    const price = Number(service?.service_price) || 0;
    return sum + qty * price;
  }, 0);
});

// const totalPlatformFee = computed(() => {
//   return (jobDetails.value?.job_services || []).reduce((sum: number, service: any) => {
//     return sum + (Number(service?.platform_fee) || 0);
//   }, 0);
// });

// const totalOutstandingAmount = computed(() => {
//   return grandTotal.value + totalPlatformFee.value;
// });

// ── Status badge styling (mirrors Job Details page) ──────────────────────────
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

// ── Print ─────────────────────────────────────────────────────────────────────
const printSheet = () => window.print();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
  }

  #job-sheet {
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  /* Force green background to print */
  .bg-green-500 {
    background-color: #22c55e !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Force the SVG tick to be visible */
  .bg-green-500 svg {
    display: block !important;
    visibility: visible !important;
    stroke: white !important;
  }

  /* Force border colour on unchecked box */
  .border-gray-300 {
    border-color: #d1d5db !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>