<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p class="text-gray-600 mt-2">View your assigned jobs and manage your availability</p>
      </div>

      <!-- Loading State -->
      <div v-if="listLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <template v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Assigned Jobs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.assignedJobs }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">In Progress</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.inProgress }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Completed</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.completed }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Earnings</p>
                <p class="text-2xl font-semibold text-gray-900">£{{ stats.totalEarnings.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability Toggle -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Availability Status</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formData.available === 'available'
                  ? 'You are currently available to accept new jobs'
                  : 'You are not available to accept new jobs at this time'
                }}
              </p>
            </div>
            <button @click="toggleAvailability" :disabled="updatingAvailability" :class="[
              'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2',
              formData.available === 'available'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white',
              updatingAvailability ? 'opacity-50 cursor-not-allowed' : ''
            ]">
              <span v-if="updatingAvailability"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span v-if="!updatingAvailability && formData.available === 'available'">✓ Available</span>
              <span v-else-if="!updatingAvailability && formData.available !== 'available'">✗ Not Available</span>
              <span v-else>Updating...</span>
            </button>
          </div>
        </div>

        <!-- Assigned Jobs -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Assigned Jobs</h2>
            <span class="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
              {{ jobList.length }} {{ jobList.length === 1 ? 'Job' : 'Jobs' }}
            </span>
          </div>

          <div v-if="jobList.length === 0" class="bg-white rounded-xl border border-gray-200/80 p-8 text-center">
            <svg class="w-16 h-16 text-gray-450 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500 font-medium">No jobs assigned yet</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="job in jobList" :key="job.id" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200">
              <!-- Job Header Card -->
              <div class="px-6 py-4 bg-gray-50/75 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-xs font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">
                    Job #{{ job.job_number }}
                  </span>
                  <span v-if="job.registration" class="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md flex items-center gap-1.5 border border-slate-200/60">
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3M16 6h3a2 2 0 012 2v2" />
                    </svg>
                    Reg: {{ job.registration }}
                  </span>
                  <span v-if="job.scheduled_at_human" class="text-xs text-gray-550 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Scheduled: {{ job.scheduled_at_human }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span :class="[
                    'px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide border',
                    getStatusClass(job.status)
                  ]">
                    {{ job.status_formatted || job.status }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button @click="viewJob(job.id)"
                      class="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-all">
                      View Details
                    </button>
                    <button v-if="job.status === 'assigned'" @click="updateJobStatus(job.id, 'in_progress')"
                      :disabled="updatingJobId === job.id"
                      class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1.5">
                      <span v-if="updatingJobId === job.id" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      <span>Start Job</span>
                    </button>
                    <button v-if="job.status === 'in_progress'" @click="updateJobStatus(job.id, 'completed')"
                      :disabled="updatingJobId === job.id"
                      class="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1.5">
                      <span v-if="updatingJobId === job.id" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      <span>Complete Job</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <!-- Left Column: Service Table -->
                  <div class="lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Service Details</h4>
                      <div class="overflow-x-auto border border-gray-200 rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                            <tr>
                              <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                              <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                              <th class="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                              <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="js in job.job_services" :key="js.id" class="hover:bg-slate-50/50">
                              <td class="px-4 py-3 text-sm text-gray-800 font-medium">
                                {{ js.service?.name || 'N/A' }}
                                <p v-if="js.description" class="text-xs text-gray-500 font-normal mt-0.5">{{ js.description }}</p>
                              </td>
                              <td class="px-4 py-3 text-right text-sm text-gray-600">
                                {{ js.service_price_formatted || '£' + js.service_price }}
                              </td>
                              <td class="px-4 py-3 text-center text-sm text-gray-700">
                                {{ js.qty }}
                              </td>
                              <td class="px-4 py-3 text-right text-sm text-gray-900 font-semibold">
                                {{ js.line_total_formatted || '£' + js.line_total }}
                              </td>
                            </tr>
                          </tbody>
                          <tfoot class="bg-slate-55/40 border-t border-gray-200">
                            <tr>
                              <td colspan="2" class="px-4 py-2.5 text-right text-xs font-bold text-gray-550 uppercase tracking-wider">Total Summary:</td>
                              <td class="px-4 py-2.5 text-center text-sm font-bold text-gray-800">{{ job.total_qty }}</td>
                              <td class="px-4 py-2.5 text-right text-sm font-extrabold text-blue-600">
                                {{ job.total_amount_formatted || '£' + job.total_amount }}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column: Customer Details Side Card -->
                  <div class="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Info</h4>
                      <div class="space-y-4">
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-2xs">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Customer Name</p>
                            <p class="text-sm font-bold text-gray-800">{{ job.customer_name }}</p>
                          </div>
                        </div>

                        <div v-if="job.customer_phone" class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-2xs">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Phone</p>
                            <a :href="`tel:${job.customer_phone}`" class="text-sm font-bold text-blue-600 hover:text-blue-750 transition-colors">{{ job.customer_phone }}</a>
                          </div>
                        </div>

                        <div v-if="job.customer_email" class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-2xs">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                            <a :href="`mailto:${job.customer_email}`" class="text-sm font-bold text-blue-600 hover:text-blue-750 transition-colors truncate block max-w-[200px]" :title="job.customer_email">{{ job.customer_email }}</a>
                          </div>
                        </div>

                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-2xs">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Location</p>
                            <p class="text-sm font-medium text-gray-700 leading-relaxed">{{ job.customer_address }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { useAppStore } from '@/stores/index';
import { jobService, notificationService, userService } from '@/services/_singletons';

const router = useRouter();
const store: any = useAppStore();

const listLoading = ref(false);
const jobList = ref<any>([]);
const updatingJobId = ref<string | null>(null);
const updatingAvailability = ref(false);

// Get user ID from store
const userId = computed(() => store.user?.id);

// Calculate stats from jobs
const stats = computed<any>(() => {
  const assigned = jobList.value.filter(j => j.status === 'assigned').length;
  const inProgress = jobList.value.filter(j => j.status === 'in_progress').length;
  const completed = jobList.value.filter(j => j.status === 'completed').length;
  const totalEarnings = jobList.value
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + (Number(j.total_amount) || Number(j.service_price) || 0), 0);

  return {
    assignedJobs: assigned,
    inProgress,
    completed,
    totalEarnings,
  };
});

const formData: any = ref({
  available: ''
});

const fetchJobs = async () => {
  try {
    listLoading.value = true;
    const params: any[] = [
      { key: 'take_all', value: 'true' },

      { key: 'user_id', value: userId.value },
    ];
    // { key: 'payment_status', value: 'paid' },
    const res: any = await jobService.getJobList(params);
    jobList.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.error(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.error(e.response.data.message);
      return;
    }
    notificationService.error('Failed to load jobs');
  } finally {
    listLoading.value = false;
  }
};

const fetchUserById = async () => {
  try {
    const res: any = await userService.getUserById(userId.value);
    formData.value.available = res.data.available || 'available';
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

const toggleAvailability = async () => {
  try {
    updatingAvailability.value = true;
    formData.value.available = formData.value.available === 'available' ? 'unavailable' : 'available';

    const res: any = await userService.toggleAvailability(userId.value);


    notificationService.showSuccess(res.message, 'Availability Updated Successfully');
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
      return;
    }
  } finally {
    updatingAvailability.value = false;
  }
};

const updateJobStatus = async (jobId: string, newStatus: any) => {
  try {
    updatingJobId.value = jobId;
    const res: any = await jobService.updateStatus(jobId, { status: newStatus });
    notificationService.showSuccess(res.message, 'Status Updated Successfully');
    await fetchJobs();
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
    }
  } finally {
    updatingJobId.value = null;
  }
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const viewJob = (jobId: string) => {
  router.push(`/staff/jobs/${jobId}`);
};

// Fetch jobs on component mount
onMounted(() => {
  fetchUserById();
});
</script>