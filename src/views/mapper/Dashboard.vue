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
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Assigned Jobs</h2>
          </div>

          <div v-if="jobList.length === 0" class="p-8 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">No jobs assigned yet</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div v-for="job in jobList" :key="job.id" class="p-3 hover:bg-gray-50 transition-colors">
              <div class="flex flex-row justify-between items-center my-5">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-900">Job #{{ job.job_number }}</h3>
                  <span :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusClass(job.status)
                  ]">
                    {{ job.status }}
                  </span>
                </div>
                <div class="flex flex-col items-end gap-3 shrink-0">
                  <div class="flex flex-row gap-2">
                    <button @click="viewJob(job.id)"
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                      View Details
                    </button>
                    <button v-if="job.status === 'assigned'" @click="updateJobStatus(job.id, 'in_progress')"
                      :disabled="updatingJobId === job.id"
                      class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <span v-if="updatingJobId === job.id"
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>{{ updatingJobId === job.id ? 'Starting...' : 'Start Job' }}</span>
                    </button>
                    <button v-if="job.status === 'in_progress'" @click="updateJobStatus(job.id, 'completed')"
                      :disabled="updatingJobId === job.id"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <span v-if="updatingJobId === job.id"
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>{{ updatingJobId === job.id ? 'Completing...' : 'Complete Job' }}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Service Details -->
                  <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 class="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-3">Service Details</h4>
                    <div class="space-y-2">
                      <div>
                        <p class="text-xs text-blue-700 font-medium">Service Name</p>
                        <p class="text-sm text-blue-900 font-semibold">{{ job?.service?.name }}</p>
                      </div>
                      <div v-if="job?.service?.description">
                        <p class="text-xs text-blue-700 font-medium">Description</p>
                        <p class="text-sm text-blue-900">{{ job?.service?.description }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Customer Details -->
                  <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 class="text-xs font-semibold text-green-900 uppercase tracking-wide mb-3">Customer Details</h4>
                    <div class="space-y-2">
                      <div>
                        <p class="text-xs text-green-700 font-medium">Customer Name</p>
                        <p class="text-sm text-green-900 font-semibold">{{ job.customer_name }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-green-700 font-medium">Location</p>
                        <p class="text-sm text-green-900">{{ job.customer_address }}</p>
                      </div>
                      <div v-if="job.customer_email">
                        <p class="text-xs text-green-700 font-medium">Email</p>
                        <p class="text-sm text-green-900">{{ job.customer_email }}</p>
                      </div>
                      <div v-if="job.customer_phone">
                        <p class="text-xs text-green-700 font-medium">Phone</p>
                        <p class="text-sm text-green-900">{{ job.customer_phone }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Price Details -->
                  <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 class="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-3">Price</h4>
                    <div class="space-y-2">
                      <div>
                        <p class="text-xs text-purple-700 font-medium">Total Amount</p>
                        <p class="text-2xl font-bold text-purple-900">£{{ job.service_price }}</p>
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
    .reduce((sum, j) => sum + (j.service_price || 0), 0);

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
  router.push(`/mapper/jobs/${jobId}`);
};

// Fetch jobs on component mount
onMounted(() => {
  fetchUserById();
});
</script>