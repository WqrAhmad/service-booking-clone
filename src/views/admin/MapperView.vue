<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">

      <!-- Top Action Bar -->
      <div class="mb-6 flex items-center justify-between">
        <button @click="$router.back()"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all font-medium text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Staffs
        </button>

        <button v-if="canEditStaff" @click="editStaff"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Staff
        </button>
      </div>

      <!-- Main Profile Layout -->
      <div v-if="mapperDetails && mapperDetails.id" class="space-y-6">

        <!-- Premium Profile Header Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <!-- Slate/Indigo Gradient Banner -->
          <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 h-32 md:h-40 relative">
            <!-- Subtle Background Patterns -->
            <div
              class="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            </div>
          </div>

          <!-- Profile Details Section with Overlapping Avatar -->
          <div class="px-6 md:px-8 pb-6 pt-4 relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div class="flex items-end gap-4 md:gap-5">
              <!-- Avatar overlapping the banner -->
              <div
                class="h-20 w-20 md:h-24 md:w-24 -mt-12 md:-mt-16 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0 relative z-10">
                <img v-if="mapperDetails.avatar" :src="mapperDetails.avatar" :alt="mapperDetails.name"
                  class="h-full w-full object-cover" />
                <div v-else
                  class="h-full w-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl md:text-2xl tracking-wide uppercase select-none">
                  {{ getInitials(mapperDetails.name) }}
                </div>
              </div>

              <div>
                <h1 class="text-xl md:text-2xl font-bold text-slate-900 leading-none">{{ mapperDetails.name }}</h1>
                <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
                  {{ mapperDetails.business_name || 'Service Partner' }}
                </p>
              </div>
            </div>

            <!-- Quick Actions / Badges -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Available Glow Badge -->
              <span :class="[
                'px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 shadow-xs',
                mapperDetails.available === 'available'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              ]">
                <span
                  :class="['h-2 w-2 rounded-full', mapperDetails.available === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                {{ mapperDetails.available === 'available' ? 'Available' : 'Unavailable' }}
              </span>

              <!-- Active/Inactive Status Badge -->
              <span :class="[
                'px-3 py-1.5 rounded-full text-xs font-semibold border',
                mapperDetails.status === 'active'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              ]">
                {{ mapperDetails.status === 'active' ? 'Active' : 'Inactive' }}
              </span>

              <div class="text-xs text-slate-400 ml-auto md:ml-2">
                Staff ID: <span class="font-mono text-slate-600 font-semibold">#{{ mapperDetails.id }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Information details grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Contact details card -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
            <div class="flex items-center gap-2 pb-4 border-b border-slate-100">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <h2 class="text-lg font-bold text-slate-900">Basic Information</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

              <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full
                  Name</label>
                <div class="flex items-center gap-2 text-slate-900 font-medium">
                  {{ mapperDetails.name }}
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Business
                  Name</label>
                <div class="flex items-center gap-2 text-slate-900 font-medium">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ mapperDetails.business_name || '—' }}
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email
                  Address</label>
                <a :href="`mailto:${mapperDetails.email}`"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ mapperDetails.email }}
                </a>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone
                  Number</label>
                <a :href="`tel:${mapperDetails.phone}`"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ mapperDetails.phone }}
                </a>
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Area /
                  Postcode</label>
                <div
                  class="flex items-center gap-2 text-slate-900 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <svg class="w-4.5 h-4.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ mapperDetails.post_code }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ mapperDetails.address }}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Statistics & Availability Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col justify-between">
            <div class="space-y-6">
              <div class="flex items-center gap-2 pb-4 border-b border-slate-100">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <h2 class="text-lg font-bold text-slate-900">Performance Summary</h2>
              </div>

              <!-- Stats Row -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Active Jobs -->
                <div
                  class="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 text-center transition-all hover:shadow-xs">
                  <span class="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Active Jobs</span>
                  <span class="text-3xl font-black text-slate-900">{{ mapperDetails.active_jobs ?? 0 }}</span>
                </div>

                <!-- Total Jobs -->
                <div
                  class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center transition-all hover:shadow-xs">
                  <span class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Jobs</span>
                  <span class="text-3xl font-black text-slate-900">{{ mapperDetails.total_jobs ?? 0 }}</span>
                </div>
              </div>

              <!-- Additional login & system info -->
              <div class="pt-4 space-y-3.5">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-400 font-medium">Login Access</span>
                  <span :class="[
                    'text-xs font-semibold px-2 py-0.5 rounded-full border',
                    mapperDetails.is_login === 1
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  ]">
                    {{ mapperDetails.is_login === 1 ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>

                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-400 font-medium">Account Status</span>
                  <span :class="[
                    'text-xs font-semibold px-2 py-0.5 rounded-full border uppercase',
                    mapperDetails.status === 'active'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  ]">
                    {{ mapperDetails.status || 'inactive' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Decorative quote/hint at bottom of stats -->
            <div class="mt-8 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-center">
              <p class="text-xs text-slate-500 italic font-medium">
                {{ mapperDetails.available === 'available'
                  ? 'Ready and active to receive new service bookings.'
                  : 'Currently offline or busy. New bookings paused.'
                }}
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <svg class="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-slate-500 font-medium text-sm">Loading staff details...</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notificationService, userService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import { useStaffPermissions } from '@/composables/useStaffPermissions';

const route = useRoute();
const router = useRouter();
const { canEdit } = useStaffPermissions();
const canEditStaff = computed(() => canEdit('mapper'));
const mapperDetails: any = ref({});

const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

onMounted(() => {
  const mapperId = route.query.id as string;
  fetchUserById(mapperId);
});

const fetchUserById = async (id: any) => {
  try {
    const res: any = await userService.getUserById(id);
    mapperDetails.value = res.data;
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

const editStaff = () => {
  const id = route.query.id;
  router.push({
    path: '/admin/staff/edit',
    query: { id }
  });
};
</script>
