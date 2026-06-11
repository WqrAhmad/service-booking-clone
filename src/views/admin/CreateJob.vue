<template>
  <JobFormLayout v-bind="layoutProps" @submit="submitJob" @cancel="router.back()" @lookupVehicle="lookupVehicle"
    @searchStaffs="searchStaffs" @selectStaff="selectStaff" @openServicesDialog="openServicesDialog"
    @closeServicesDialog="closeServicesDialog" @selectStaffFromDialog="selectStaffFromDialog"
    @toggleManualAddress="manualAddress = !manualAddress" @update:showServiceDropdown="showServiceDropdown = $event"
    @update:showRadiusDropdown="showRadiusDropdown = $event" @addressSelected="onAddressSelected">
    <template #header>
      <h1 class="text-3xl font-bold text-gray-900">Create Job</h1>
      <p class="text-gray-600 mt-2">Find available mappers and create a new job</p>
    </template>

    <template #submit-button>
      <button v-if="canAddJob" type="submit" :disabled="submitting"
        class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ submitting ? 'Creating Job...' : 'Create Job' }}
      </button>
    </template>
  </JobFormLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AxiosError } from 'axios';
import { jobService, notificationService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import { useJobForm } from '@/composables/useJobForm';
import JobFormLayout from '@/components/JobFormLayout.vue';

const { canAdd } = useStaffPermissions();
const canAddJob = computed(() => canAdd('job'));

const manualAddress = ref(false);

const {
  router, formData, searchCriteria, errors, submitting,
  lookupVehicle, searchStaffs, selectStaff,
  openServicesDialog, closeServicesDialog, selectStaffFromDialog,
  validateForm, buildJobData,
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

const submitJob = async () => {
  if (!validateForm()) {
    document.querySelector('.border-red-500')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  submitting.value = true;
  try {
    const res: any = await jobService.addJob(buildJobData() as any);
    notificationService.showSuccess(res?.message ?? 'Job created successfully');
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