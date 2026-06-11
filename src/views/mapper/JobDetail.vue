<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <button
          @click="$router.push('/mapper/dashboard')"
          class="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 group-hover:border-slate-300 group-hover:shadow transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span class="font-medium">Back to Dashboard</span>
        </button>
        <div class="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Job Details</p>
            <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Job #{{ job?.job_number }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="listLoading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="relative">
          <div class="w-14 h-14 rounded-full border-2 border-slate-200"></div>
          <div class="absolute inset-0 w-14 h-14 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
        </div>
        <p class="text-slate-500 font-medium">Loading job details...</p>
      </div>

      <div v-else-if="job" class="space-y-8">
        <!-- Status & Actions Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div class="px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-linear-to-br from-slate-50 to-white border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200">
                <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Current Status</p>
                <span
                  :class="[
                    'inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm',
                    getStatusClass(job.status)
                  ]"
                >
                  {{ formatStatus(job.status) }}
                </span>
              </div>
            </div>
            <div class="flex gap-3 shrink-0">
              <button
                v-if="job.status === 'assigned'"
                @click="updateJobStatus('in_progress')"
                :disabled="updatingStatus"
                class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="updatingStatus" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ updatingStatus ? 'Starting...' : 'Start Job' }}</span>
              </button>
              <button
                v-if="job.status === 'in_progress'"
                @click="updateJobStatus('completed')"
                :disabled="updatingStatus"
                class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="updatingStatus" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ updatingStatus ? 'Completing...' : 'Complete Job' }}</span>
              </button>
              <div
                v-if="job.status === 'completed'"
                class="px-5 py-2.5 bg-slate-100 text-slate-500 font-semibold rounded-xl flex items-center gap-2"
              >
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Job Completed</span>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="p-6 sm:p-8">
            <div class="grid gap-6 sm:grid-cols-3">
              <!-- Service Details -->
              <div class="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-blue-50/50 p-5 border border-blue-100">
                <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-blue-200/30 group-hover:bg-blue-200/50 transition-colors"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 class="text-xs font-bold text-blue-900 uppercase tracking-wider">Service</h3>
                  </div>
                  <p class="text-lg font-bold text-blue-900 mb-1">{{ job?.service?.name || '—' }}</p>
                  <p v-if="job?.service?.description" class="text-sm text-blue-700/90 leading-relaxed line-clamp-3">
                    {{ job.service.description }}
                  </p>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="group relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-50 to-emerald-50/50 p-5 border border-emerald-100">
                <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-emerald-200/30 group-hover:bg-emerald-200/50 transition-colors"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
                      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 class="text-xs font-bold text-emerald-900 uppercase tracking-wider">Customer</h3>
                  </div>
                  <p class="text-lg font-bold text-emerald-900 mb-2">{{ job.customer_name }}</p>
                  <div class="space-y-1.5 text-sm text-emerald-800/90">
                    <p class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{{ job.customer_address }}</span>
                    </p>
                    <a v-if="job.customer_email" :href="`mailto:${job.customer_email}`" class="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                      <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span class="truncate">{{ job.customer_email }}</span>
                    </a>
                    <a v-if="job.customer_phone" :href="`tel:${job.customer_phone}`" class="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                      <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{{ job.customer_phone }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Price Details -->
              <div class="group relative overflow-hidden rounded-xl bg-linear-to-br from-amber-50 to-amber-50/50 p-5 border border-amber-100">
                <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-amber-200/30 group-hover:bg-amber-200/50 transition-colors"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10">
                      <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="text-xs font-bold text-amber-900 uppercase tracking-wider">Your Fee</h3>
                  </div>
                  <p class="text-3xl font-bold text-amber-900 mb-2">£{{ job.service_price }}</p>
                  <p class="text-sm text-amber-800/80 leading-relaxed">
                    Payable upon completion and customer payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error / Not Found State -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-slate-600 font-medium">Job not found or failed to load</p>
        <p class="text-sm text-slate-500 mt-1">Please check the URL or try again later.</p>
        <button
          @click="$router.push('/mapper/dashboard')"
          class="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { jobService, notificationService } from '@/services/_singletons';

const route = useRoute();

const listLoading = ref(false);
const updatingStatus = ref(false);
const job = ref<any>(null);

onMounted(() => {
  const jobId = route.params.id as string;
  if (jobId) {
    fetchJobDetails(jobId);
  }
});

const fetchJobDetails = async (jobId: string) => {
  try {
    listLoading.value = true;
    const res: any = await jobService.getJobById(jobId);
    job.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
      return;
    }
    notificationService.showError('Failed to load job details');
  } finally {
    listLoading.value = false;
  }
};

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return map[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-800 border border-blue-200/50',
    in_progress: 'bg-amber-100 text-amber-800 border border-amber-200/50',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200/50',
  };
  return classes[status] || 'bg-slate-100 text-slate-800 border border-slate-200/50';
};

const updateJobStatus = async (newStatus: string) => {
  if (!job.value) return;

  try {
    updatingStatus.value = true;
    const res: any = await jobService.updateStatus(job.value.id, { status: newStatus });
    notificationService.showSuccess(res.message, 'Status Updated Successfully');
    job.value.status = newStatus;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data?.message);
      return;
    }
  } finally {
    updatingStatus.value = false;
  }
};
</script>
