<template>
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
    @toggleManualAddress="manualAddress = !manualAddress" @addressSelected="onAddressSelected">
    <template #header>
      <h1 class="text-3xl font-bold text-gray-900">Duplicate Job</h1>
      <p class="text-gray-600 mt-2">Create a copy from an existing job</p>
    </template>

    <template #submit-button>
      <button v-if="canAddJob" type="submit" :disabled="submitting"
        class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
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
const manualAddress = ref(false);

const {
  router, formData, errors, submitting,
  lookupVehicle,
  validateForm, buildJobData,
  loadingVehicle, vehicleDetails, engineDetails,
  formatOption, mergeDateTime,
  availableServices, availableStaff,
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
  errors: errors.value,
  loadingVehicle: loadingVehicle.value,
  vehicleDetails: vehicleDetails.value,
  engineDetails: engineDetails.value,
  availableServices: availableServices.value,
  availableStaff: availableStaff.value,
  manualAddress: manualAddress.value,
  formatOption,
  mergeDateTime,
}));

// ─── Prefill form from job data ───────────────────────────────────────
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
        variant: job.vehicle_variant || job.vehicleVariant || '',
        name: [job.vehicle_make, job.vehicle_model, job.vehicle_variant].filter(Boolean).join(' '),
      };
      engineDetails.value = job.engine_details ?? job.engineDetails ?? null;
      lookupVehicle();
    }

    // Copy customer
    formData.value.customerName = job.customer_name || '';
    formData.value.customerEmail = job.customer_email || '';
    formData.value.customerPhone = job.customer_phone || '';

    // Copy schedule
    if (job.scheduled_at) {
      const [datePart, timePart] = job.scheduled_at.split(' ');
      formData.value.scheduledDate = datePart || '';
      formData.value.scheduledTime = timePart ? timePart.substring(0, 5) : '';
      formData.value.scheduled_at = job.scheduled_at;
    }

    // Copy address
    if (job.customer_address || job.post_code) {
      manualAddress.value = true;
    }
    formData.value.jobAddress = job.customer_address || '';
    formData.value.jobPostcode = job.post_code || '';
    formData.value.jobLatitude = job.latitude != null ? Number(job.latitude) : null;
    formData.value.jobLongitude = job.longitude != null ? Number(job.longitude) : null;

    // Copy services
    formData.value.services = job.job_services.map((service: any) => ({
      ...service,
      service_id: service.service_id ?? service.service?.id,
      qty: service.quantity ?? service.qty ?? 1,
      price: service.service_price ?? service.price ?? 0,
      description: service.description ?? '',
    }));

    // Copy staff
    formData.value.user_id = job.staff?.id ?? job.user_id ?? '';

  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 400) {
      notificationService.showError(e.response?.data.message);
    } else {
      notificationService.showError('Failed to load job for duplication');
    }
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
