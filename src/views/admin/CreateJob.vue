<template>
  <JobFormLayout :formData="formData" :errors="errors" :loadingVehicle="loadingVehicle" :vehicleDetails="vehicleDetails"
    :engineDetails="engineDetails" :availableServices="availableServices" :availableStaff="availableStaff"
    :formatOption="formatOption" :mergeDateTime="mergeDateTime" @submit="submitJob" @cancel="router.back()"
    @lookupVehicle="lookupVehicle">
    <template #header>
      <h1 class="text-3xl font-bold text-gray-900">Create Job</h1>
      <p class="text-gray-600 mt-2">Create a new job</p>
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
import { computed } from 'vue';
import { AxiosError } from 'axios';
import { jobService, notificationService } from '@/services/_singletons';
import { useStaffPermissions } from '@/composables/useStaffPermissions';
import { useJobForm } from '@/composables/useJobForm';
import JobFormLayout from '@/components/JobFormLayout.vue';

const { canAdd } = useStaffPermissions();
const canAddJob = computed(() => canAdd('job'));

const {
  router,
  formData,
  errors,
  submitting,
  loadingVehicle,
  vehicleDetails,
  engineDetails,
  availableServices,
  availableStaff,
  formatOption,
  mergeDateTime,
  lookupVehicle,
  validateForm,
  buildJobData,
} = useJobForm();

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