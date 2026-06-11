<template>
  <!-- Loading overlay -->
  <div v-if="loadingJob" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="p-8 bg-white rounded-xl shadow-lg flex items-center gap-4">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <span class="text-lg font-medium text-gray-700">Loading job to duplicate...</span>
    </div>
  </div>

  <JobFormLayout v-else v-bind="layoutProps" @submit="submitJob" @cancel="router.back()" @lookupVehicle="lookupVehicle"
    @searchStaffs="searchStaffs" @selectStaff="selectStaff" @openServicesDialog="openServicesDialog"
    @closeServicesDialog="closeServicesDialog" @selectStaffFromDialog="selectStaffFromDialog"
    @toggleManualAddress="manualAddress = !manualAddress" @update:showServiceDropdown="showServiceDropdown = $event"
    @update:showRadiusDropdown="showRadiusDropdown = $event" @addressSelected="onAddressSelected">
    <!-- Page Header -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 bg-amber-100 rounded-lg">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Duplicate Job</h1>
          <p class="text-gray-600 mt-1">Create a copy with a new mapper and address</p>
        </div>
      </div>
      <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
        <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-amber-700">Customer details have been copied from the original job. Please select a new
          mapper and update the address if needed.</p>
      </div>
    </template>

    <!-- Submit Button -->
    <template #submit-button>
      <button v-if="canAddJob" type="submit" :disabled="submitting"
        class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ submitting ? 'Creating...' : 'Create Duplicate Job' }}
      </button>
    </template>
  </JobFormLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { jobService, notificationService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import { useJobForm } from '@/composables/useJobForm';
import JobFormLayout from '@/components/JobFormLayout.vue';

const route = useRoute();
const { canAdd } = useStaffPermissions();
const canAddJob = computed(() => canAdd('job'));

const loadingJob = ref(false);
const manualAddress = ref(true); // show address fields when duplicating (address copied from source job)

const {
  router, formData, searchCriteria, errors, submitting,
  lookupVehicle, searchStaffs, selectStaff,
  openServicesDialog, closeServicesDialog, selectStaffFromDialog,
  validateForm, buildJobData,
  vehicleDetails, engineDetails,
  loadingVehicle, loadingStaffs, hasSearched,
  showServiceDropdown, showRadiusDropdown,
  serviceTypeDisplay, radiusDisplay,
  filteredServiceOptions, filteredRadiusOptions,
  searchResults, selectedServicePlatformFee,
  servicesDialog, dialogSelectedServices, dialogPlatformFeeOverride,
  dialogAllSelected, dialogSomeSelected,
  formatOption, disablePastDates, mergeDateTime,
  selectService, selectRadius, filterServiceOptions, filterRadiusOptions,
  getDistance, getStaffLat, getStaffLng, mapperEmbedMapUrl, mapperMapLink,
  getStaffSelectedServices, getSelectedServicePrice, getTotalQuotedPrice,
  isCurrentlySelectedService, isDialogServiceSelected,
  toggleSelectAllServices, toggleDialogService,
  getDialogServicePrice, setDialogServicePrice,
  getDialogServicePlatformFee, setDialogServicePlatformFee,
} = useJobForm();

const onAddressSelected = (address: any) => {
  formData.value.jobAddress = [address.line_1, address.line_2, address.line_3, address.post_town]
    .filter(Boolean).join(', ');
  formData.value.jobPostcode = address.postcode ?? '';
  if (errors.value.jobPostcode) delete errors.value.jobPostcode;
};

const layoutProps = computed(() => ({
  formData: formData.value, searchCriteria: searchCriteria.value, errors: errors.value,
  loadingVehicle: loadingVehicle.value, vehicleDetails: vehicleDetails.value,
  engineDetails: engineDetails.value, loadingStaffs: loadingStaffs.value,
  hasSearched: hasSearched.value, showServiceDropdown: showServiceDropdown.value,
  showRadiusDropdown: showRadiusDropdown.value, serviceTypeDisplay: serviceTypeDisplay.value,
  radiusDisplay: radiusDisplay.value, filteredServiceOptions: filteredServiceOptions.value,
  filteredRadiusOptions: filteredRadiusOptions.value, searchResults: searchResults.value,
  selectedServicePlatformFee: selectedServicePlatformFee.value,
  servicesDialog: servicesDialog.value, dialogSelectedServices: dialogSelectedServices.value,
  dialogPlatformFeeOverride: dialogPlatformFeeOverride.value,
  dialogAllSelected: dialogAllSelected.value, dialogSomeSelected: dialogSomeSelected.value,
  manualAddress: manualAddress.value,
  formatOption, disablePastDates, mergeDateTime, selectService, selectRadius,
  filterServiceOptions, filterRadiusOptions, getDistance, getStaffLat, getStaffLng,
  mapperEmbedMapUrl, mapperMapLink, getStaffSelectedServices,
  getSelectedServicePrice, getTotalQuotedPrice, isCurrentlySelectedService,
  isDialogServiceSelected, toggleSelectAllServices, toggleDialogService,
  getDialogServicePrice, setDialogServicePrice, getDialogServicePlatformFee, setDialogServicePlatformFee,
}));

// ─── Prefill from source job (customer data only, no mapper) ──────────
const fetchJobAndPrefill = async () => {
  const jobId = route.params.id as string ?? route.query.jobId as string;
  if (!jobId) return;
  loadingJob.value = true;
  try {
    const res: any = await jobService.getJobById(jobId);
    const job = res?.data ?? res;
    if (!job) { notificationService.showError('Job not found'); return; }

    // Copy vehicle
    formData.value.registration = job.registration || '';
    formData.value.vehicleId = job.vehicle_id || job.vehicleId || '';
    formData.value.vehicleMake = job.vehicle_make || job.vehicleMake || '';
    formData.value.vehicleModel = job.vehicle_model || job.vehicleModel || '';
    formData.value.vehicleYear = job.vehicle_year || job.vehicleYear || '';
    formData.value.vehicleVariant = job.vehicle_variant || job.vehicleVariant || '';
    formData.value.engineDetails = job.engine_details ?? job.engineDetails ?? null;

    if (job.registration) {
      vehicleDetails.value = {
        id: job.vehicle_id || job.vehicleId || '',
        make: job.vehicle_make || job.vehicleMake || '',
        model: job.vehicle_model || job.vehicleModel || '',
        year: job.vehicle_year || job.vehicleYear || '',
        name: [job.vehicle_make, job.vehicle_model, job.vehicle_variant].filter(Boolean).join(' '),
      };
      engineDetails.value = job.engine_details ?? job.engineDetails ?? null;
    }

    // Copy customer info
    formData.value.customerName = job.customer_name || '';
    formData.value.customerEmail = job.customer_email || '';
    formData.value.customerPhone = job.customer_phone || '';

    // Copy address/postcode
    formData.value.jobAddress = job.customer_address || '';
    formData.value.jobPostcode = job.post_code || '';
    formData.value.jobLatitude = job.latitude != null ? Number(job.latitude) : null;
    formData.value.jobLongitude = job.longitude != null ? Number(job.longitude) : null;

    // ── Reset mapper & date — user must pick fresh ──────────────────
    formData.value.mapperId = '';
    formData.value.mapperName = '';
    formData.value.scheduledDate = '';
    formData.value.scheduledTime = '';
    formData.value.scheduled_at = '';
    searchCriteria.value.serviceId = '';
    searchCriteria.value.serviceName = '';
    searchCriteria.value.radius = 20;
  } catch {
    notificationService.showError('Failed to load job for duplication');
  } finally {
    loadingJob.value = false;
  }
};

onMounted(() => fetchJobAndPrefill());

// ─── Submit ───────────────────────────────────────────────────────────
const submitJob = async () => {
  if (!validateForm()) {
    document.querySelector('.border-red-500')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  submitting.value = true;
  try {
    const res: any = await jobService.addJob(buildJobData() as any);
    notificationService.showSuccess(res?.message ?? 'Job duplicated successfully');
    router.push('/admin/jobs');
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) notificationService.showError(error.response.data.message || 'Validation error. Please check all fields.');
      else if (error.response?.status === 401) notificationService.showError('Unauthorized. Please log in again.');
      else notificationService.showError('Failed to duplicate job. Please try again.');
    } else {
      notificationService.showError('An unexpected error occurred.');
    }
  } finally {
    submitting.value = false;
  }
};
</script>