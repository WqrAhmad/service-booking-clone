<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage mappers, jobs, and platform settings</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Staffs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardData?.summary?.total_mappers || 0 }}</p>
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
                <p class="text-sm font-medium text-gray-500">Active Jobs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardData?.summary?.active_jobs || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pending Payments</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardData?.pending_payments?.count || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Platform Revenue</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardData?.summary?.platform_revenue_formatted ||
                  '£0.00' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Today's Revenue</h4>
            <p class="text-xl font-semibold text-gray-900">£{{ dashboardData?.revenue?.today?.platform || 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">This Week</h4>
            <p class="text-xl font-semibold text-gray-900">£{{ dashboardData?.revenue?.this_week?.platform || 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">This Month</h4>
            <p class="text-xl font-semibold text-gray-900">£{{ dashboardData?.revenue?.this_month?.platform || 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">This Year</h4>
            <p class="text-xl font-semibold text-gray-900">£{{ dashboardData?.revenue?.this_year?.platform || 0 }}</p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Revenue Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
            <canvas ref="revenueChart"></canvas>
          </div>

          <!-- Jobs by Status Chart -->


          <!-- Jobs Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Jobs Overview</h3>
            <canvas ref="jobsChart"></canvas>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Staff Growth</h3>
            <canvas ref="mappersChart"></canvas>
          </div>
          <!-- Staffs Growth Chart -->

        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Jobs by Status</h3>
            <canvas ref="jobsStatusChart"></canvas>
          </div>
          <!-- Recent Jobs -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
            <div class="space-y-3">
              <div v-for="job in dashboardData?.recent_activities?.recent_jobs?.slice(0, 5)" :key="job.id"
                class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-gray-900">#{{ job.job_number }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ job.customer_name }}</p>
                </div>
                <span :class="getStatusClass(job.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ job.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Top Staffs -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Staffs</h3>
            <div class="space-y-3">
              <div v-for="mapper in dashboardData?.recent_activities?.top_mappers?.slice(0, 5)" :key="mapper.id"
                class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ mapper.name }}</p>
                  <p class="text-xs text-gray-500">{{ mapper.business_name }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ mapper.completed_jobs }} jobs</p>
                  <p class="text-xs text-gray-500">{{ mapper.total_earnings_formatted }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            to="/admin/jobs"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Manage Jobs</h3>
                <p class="text-sm text-gray-500">View and manage all jobs</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/search-mappers"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Search Staffs</h3>
                <p class="text-sm text-gray-500">Find mappers by location and service</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/mappers"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Manage Staffs</h3>
                <p class="text-sm text-gray-500">View and manage all mappers</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/services"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Manage Services</h3>
                <p class="text-sm text-gray-500">Create and manage service types</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/settings"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">General Settings</h3>
                <p class="text-sm text-gray-500">Manage settings</p>
              </div>
            </div>
          </router-link>
        </div> -->
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { dashboardService, notificationService } from '@/services/_singletons';
import { AxiosError } from 'axios';

Chart.register(...registerables);

const loading = ref(false);
const dashboardData = ref<any>(null);

const revenueChart = ref<HTMLCanvasElement | null>(null);
const jobsChart = ref<HTMLCanvasElement | null>(null);
const mappersChart = ref<HTMLCanvasElement | null>(null);
const jobsStatusChart = ref<HTMLCanvasElement | null>(null);

let revenueChartInstance: Chart | null = null;
let jobsChartInstance: Chart | null = null;
let mappersChartInstance: Chart | null = null;
let jobsStatusChartInstance: Chart | null = null;

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800',
    'assigned': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const initializeCharts = () => {
  if (!dashboardData.value?.charts) return;

  // Cleanup existing charts before creating new ones
  cleanup();

  // Revenue Over Time Chart
  if (revenueChart.value && dashboardData.value.charts.revenue_chart) {
    const chartData = dashboardData.value.charts.revenue_chart;
    revenueChartInstance = new Chart(revenueChart.value, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          tension: 0.4,
          fill: true,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '£' + value;
              }
            }
          }
        }
      }
    });
  }

  // Jobs Status Distribution Chart
  if (jobsStatusChart.value && dashboardData.value.charts.status_distribution) {
    const statusData = dashboardData.value.charts.status_distribution;
    jobsStatusChartInstance = new Chart(jobsStatusChart.value, {
      type: 'doughnut',
      data: {
        labels: statusData.labels,
        datasets: [{
          data: statusData.data,
          backgroundColor: statusData.backgroundColor,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }

  // Jobs Chart
  if (jobsChart.value && dashboardData.value.charts.jobs_chart) {
    const chartData = dashboardData.value.charts.jobs_chart;
    jobsChartInstance = new Chart(jobsChart.value, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor,
          borderColor: dataset.borderColor,
          borderWidth: 1,
          borderRadius: 4,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }

  // Staff Growth Chart
  if (mappersChart.value && dashboardData.value.charts.mappers_chart) {
    const chartData = dashboardData.value.charts.mappers_chart;
    mappersChartInstance = new Chart(mappersChart.value, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor,
          borderColor: dataset.borderColor,
          borderWidth: 1,
          borderRadius: 4,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }
};

// const cleanup = () => {
//   if (revenueChartInstance) {
//     revenueChartInstance.destroy();
//     revenueChartInstance = null;
//   }
//   if (jobsChartInstance) {
//     jobsChartInstance.destroy();
//     jobsChartInstance = null;
//   }
//   if (mappersChartInstance) {
//     mappersChartInstance.destroy();
//     mappersChartInstance = null;
//   }
//   if (jobsStatusChartInstance) {
//     jobsStatusChartInstance.destroy();
//     jobsStatusChartInstance = null;
//   }
// };



const fetchDashboard = async () => {
  try {
    loading.value = true;
    const res: any = await dashboardService.getStatsList();
    dashboardData.value = res.data;

    // Wait for next tick to ensure canvas elements are rendered
    setTimeout(() => {
      initializeCharts();
    }, 100);
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.error(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.error(e.response.data.message);
    } else {
      notificationService.error('Failed to load dashboard data');
    }
  } finally {
    loading.value = false;
  }
};

const cleanup = () => {
  if (revenueChartInstance) revenueChartInstance.destroy();
  if (jobsChartInstance) jobsChartInstance.destroy();
  if (mappersChartInstance) mappersChartInstance.destroy();
  if (jobsStatusChartInstance) jobsStatusChartInstance.destroy();
};

onMounted(() => {
  fetchDashboard();
});

onUnmounted(() => {
  cleanup();
});
</script>