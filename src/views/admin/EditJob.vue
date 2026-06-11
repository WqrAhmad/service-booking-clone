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
      <span class="text-lg font-medium text-gray-700">Loading job...</span>
    </div>
  </div>

  <JobFormLayout v-else v-bind="layoutProps" @submit="submitJob" @cancel="router.back()" @lookupVehicle="lookupVehicle"
    @searchStaffs="searchStaffs" @selectStaff="selectStaff" @openServicesDialog="openServicesDialog"
    @closeServicesDialog="closeServicesDialog" @selectStaffFromDialog="selectStaffFromDialog"
    @toggleManualAddress="manualAddress = !manualAddress" @update:showServiceDropdown="showServiceDropdown = $event"
    @update:showRadiusDropdown="showRadiusDropdown = $event" @addressSelected="onAddressSelected">
    <!-- Page Header -->
    <template #header>
      <h1 class="text-3xl font-bold text-gray-900">Edit Job</h1>
      <p class="text-gray-600 mt-2">Update job details and mapper</p>
    </template>

    <!-- Currently assigned mapper banner -->
    <template #assigned-mapper>
      <div v-if="!hasSearched && formData.mapperId && formData.mapperName"
        class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
        <svg class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-sm font-semibold text-green-800">Currently assigned mapper: {{ formData.mapperName }}</p>
          <p class="text-xs text-green-600 mt-0.5">Search mappers above to assign a different one, or keep the current
            assignment.</p>
        </div>
      </div>
    </template>

    <!-- Submit Button -->
    <template #submit-button>
      <button v-if="canAddJob" type="submit" :disabled="submitting"
        class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ submitting ? 'Updating...' : 'Update Job' }}
      </button>
    </template>
  </JobFormLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
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
const editJobId = ref<string | null>(null);
const manualAddress = ref(false);

const {
  router, formData, searchCriteria, errors, submitting, availableServices,
  lookupVehicle, searchStaffs, selectStaff,
  openServicesDialog, closeServicesDialog, selectStaffFromDialog,
  validateForm, buildJobData, confirmedStaffServices,
  loadingVehicle, vehicleDetails, engineDetails,
  loadingStaffs, hasSearched,
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

// Handle address selection emitted from JobFormLayout
const onAddressSelected = (address: any) => {
  formData.value.jobAddress = [address.line_1, address.line_2, address.line_3, address.post_town]
    .filter(Boolean).join(', ');
  formData.value.jobPostcode = address.postcode ?? '';
  if (errors.value.jobPostcode) delete errors.value.jobPostcode;
};

const layoutProps = computed(() => ({
  isEdit: true,
  formData: formData.value,
  searchCriteria: searchCriteria.value,
  errors: errors.value,
  loadingVehicle: loadingVehicle.value,
  vehicleDetails: vehicleDetails.value,
  engineDetails: engineDetails.value,
  loadingStaffs: loadingStaffs.value,
  hasSearched: hasSearched.value,
  showServiceDropdown: showServiceDropdown.value,
  showRadiusDropdown: showRadiusDropdown.value,
  serviceTypeDisplay: serviceTypeDisplay.value,
  radiusDisplay: radiusDisplay.value,
  filteredServiceOptions: filteredServiceOptions.value,
  filteredRadiusOptions: filteredRadiusOptions.value,
  searchResults: searchResults.value,
  selectedServicePlatformFee: selectedServicePlatformFee.value,
  servicesDialog: servicesDialog.value,
  dialogSelectedServices: dialogSelectedServices.value,
  dialogPlatformFeeOverride: dialogPlatformFeeOverride.value,
  dialogAllSelected: dialogAllSelected.value,
  dialogSomeSelected: dialogSomeSelected.value,
  manualAddress: manualAddress.value,
  formatOption,
  disablePastDates,
  mergeDateTime,
  selectService,
  selectRadius,
  filterServiceOptions,
  filterRadiusOptions,
  getDistance,
  getStaffLat,
  getStaffLng,
  mapperEmbedMapUrl,
  mapperMapLink,
  getStaffSelectedServices,
  getSelectedServicePrice,
  getTotalQuotedPrice,
  isCurrentlySelectedService,
  isDialogServiceSelected,
  toggleSelectAllServices,
  toggleDialogService,
  getDialogServicePrice,
  setDialogServicePrice,
  getDialogServicePlatformFee,
  setDialogServicePlatformFee,
}));

// ─── Prefill form from job data ───────────────────────────────────────
const fetchJobAndPrefill = async () => {
  const jobId = route.params.id as string ?? route.query.jobId as string;
  if (!jobId) return;
  editJobId.value = jobId;
  loadingJob.value = true;
  try {
    const res: any = await jobService.getJobById(jobId);
    const job = res?.data ?? res;
    if (!job) { notificationService.showError('Job not found'); return; }

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
        variant: job.vehicle_variant || job.vehicleVariant || '',
        name: [job.vehicle_make, job.vehicle_model, job.vehicle_variant].filter(Boolean).join(' '),
      };
      engineDetails.value = job.engine_details ?? job.engineDetails ?? null;
      lookupVehicle();
    }

    formData.value.customerName = job.customer_name || '';
    formData.value.customerEmail = job.customer_email || '';
    formData.value.customerPhone = job.customer_phone || '';

    if (job.scheduled_at) {
      const [datePart, timePart] = job.scheduled_at.split(' ');
      formData.value.scheduledDate = datePart || '';
      formData.value.scheduledTime = timePart ? timePart.substring(0, 5) : '';
      formData.value.scheduled_at = job.scheduled_at;
    }

    // Pre-fill address — switch to manual mode so the postcode field is visible and editable
    if (job.customer_address || job.post_code) {
      manualAddress.value = true;
    }
    formData.value.jobAddress = job.customer_address || '';
    formData.value.jobPostcode = job.post_code || '';
    formData.value.jobLatitude = job.latitude != null ? Number(job.latitude) : null;
    formData.value.jobLongitude = job.longitude != null ? Number(job.longitude) : null;

    formData.value.mapperId = String(job.mapper_id ?? job.mapper?.id ?? '');
    formData.value.mapperName = job.mapper?.name ?? '';

    const firstServiceId = job.service_ids?.[0] ?? job.service_id ?? job.service?.id;
    if (firstServiceId) {
      searchCriteria.value.serviceId = String(firstServiceId);
      const firstJobSvc = (job.job_services ?? [])[0];
      searchCriteria.value.serviceName = firstJobSvc?.service?.name ?? job.service?.name ?? '';
      if (!searchCriteria.value.serviceName && availableServices.value.length) {
        const found = availableServices.value.find((s: any) => String(s.id) === String(firstServiceId));
        if (found) searchCriteria.value.serviceName = found.name;
      }
    }

    const jobServices = job.job_services ?? job.services ?? [];
    if (jobServices.length && formData.value.mapperId) {
      confirmedStaffServices.value[formData.value.mapperId] = jobServices.map((s: any) => ({
        serviceId: Number(s.service_id ?? s.service?.id ?? s.id),
        serviceRowId: String(s.mapper_service_id ?? s.service_id ?? s.id),
        serviceName: s.service?.name ?? s.name ?? '',
        price: Number(s.service_price ?? s.price ?? 0),
        platformFee: Number(s.platform_fee ?? 0),
      }));
    }
  } catch {
    notificationService.showError('Failed to load job');
  } finally {
    loadingJob.value = false;
  }
};

watch(availableServices, (svcs) => {
  if (searchCriteria.value.serviceId && !searchCriteria.value.serviceName && svcs.length) {
    const found = svcs.find((s: any) => String(s.id) === String(searchCriteria.value.serviceId));
    if (found) searchCriteria.value.serviceName = found.name;
  }
});

onMounted(() => {
  fetchJobAndPrefill();
});
watch(() => [route.params.id, route.query.jobId], () => fetchJobAndPrefill(), { immediate: false });

// ─── Submit ───────────────────────────────────────────────────────────
const submitJob = async () => {
  if (!validateForm()) {
    document.querySelector('.border-red-500')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  submitting.value = true;
  try {
    const res: any = await jobService.updateJob(editJobId.value!, buildJobData() as any);
    notificationService.showSuccess(res?.message ?? 'Job updated successfully');
    router.push('/admin/jobs');
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422)
        notificationService.showError(error.response.data.message || 'Validation error. Please check all fields.');
      else if (error.response?.status === 401)
        notificationService.showError('Unauthorized. Please log in again.');

    }
  } finally {
    submitting.value = false;
  }
};
</script>