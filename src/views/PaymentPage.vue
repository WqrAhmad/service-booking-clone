<!-- <template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xl mx-auto">
      <div class="mb-8 text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Secure Payment</h1>
        <p class="mt-2 text-sm text-gray-600">
          Complete payment for job
          <span v-if="jobNumber" class="font-semibold text-gray-800">#{{ jobNumber }}</span>
        </p>
      </div>

      <div v-if="isLoading" class="bg-white rounded-xl shadow p-6 text-center text-gray-600">
        Loading payment details...
      </div>

      <div v-else-if="!paymentUrl" class="bg-white rounded-xl shadow p-6 text-center text-red-600">
        Invalid or expired payment link.
      </div>

      <div v-else-if="!paymentCompleted" class="space-y-6">
        <div class="bg-white rounded-xl shadow p-6 space-y-3">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Service</span>
            <span class="font-medium text-gray-900">{{ serviceName || 'Job Payment' }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>Total Amount</span>
            <span class="font-semibold text-lg text-gray-900">£{{ totalAmount }}</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

          <StripeComponent ref="stripeComponent" v-model="formData.payment_method" :amount="amount" label="Card Details"
            placeholder="Enter your card details" required @handleCardValidation="handleCardValidation" />


          <button
            type="button"
            :disabled="isSubmitting"
            @click="submitPayment"
            class="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm">
            <span v-if="!isSubmitting">Continue to Secure Payment</span>
            <span v-else>Redirecting...</span>
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
    >
      <div
        v-if="showThankYou"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Thank you for your payment!</h2>
          <p class="text-sm text-gray-600 mb-6">
            Your payment has been processed successfully
            <span v-if="jobNumber">for job #{{ jobNumber }}</span>.
          </p>
          <button
            type="button"
            @click="showThankYou = false"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { notificationService, paymentService } from '@/services/_singletons';
import { AxiosError } from 'axios';
import StripeComponent from '@/components/StripeComponent.vue';
import { useAppStore } from '@/stores';

const route = useRoute();
const appStore = useAppStore();
const stripeComponent: any = ref(null);

const handleCardValidation = (event: any) => {
  console.log('Card validation:', event);
};

const isLoading = ref(true);
const isSubmitting = ref(false);
const showThankYou = ref(false);
const paymentCompleted = ref(false);
const jobNumber = ref<string | null>(null);
const serviceName = ref<string | null>(null);
const totalAmount = ref<number | null>(null);
const paymentUrl = ref<string | null>(null);

const formData: any = ref({
  amount: '',
  job_id: '',
  payment_method: '',
});

const amount = computed(() => totalAmount.value ?? 0);

const populateFromJob = (job: any) => {
  console.log(job);
  jobNumber.value = job.job_number ?? '';
  serviceName.value = job.service ?? '';
  const fee = job.platform_free ;
  totalAmount.value = fee ?? 0;

  paymentUrl.value = job.payment_url ?? null;

  formData.value.amount = totalAmount.value ?? '';
  formData.value.job_id = route.params.id as string | undefined;
};

onMounted(async () => {
  const id = route.params.id as string | undefined;
  if (id) {
    try {
      const jobDetails:any = await paymentService.getJobDetails(id);
      if (jobDetails.data) {
        populateFromJob(jobDetails.data);
        isLoading.value = false;
        return;
      }
    } catch (e) {
      console.error('Failed to fetch job details:', e);
    }
  }
  isLoading.value = false;
  notificationService.showError('Invalid or missing payment data.');
});

const submitPayment = async () => {
  if (!stripeComponent.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const paymentMethod = await stripeComponent.value.generateToken();

    if (!paymentMethod) {
      return;
    }

    stripeComponent.value.clearCardDetails();
    isLoading.value = true;
    formData.value.payment_method = paymentMethod.id;

    const payload = {
      amount: formData.value.amount,
      job_id: formData.value.job_id,
      payment_method: formData.value.payment_method,
    };

    const res: any = await paymentService.add(payload);
    notificationService.showSuccess(res.message || 'Payment processed successfully.');
    showThankYou.value = true;
    appStore.clearPaymentJob();
    paymentCompleted.value = true;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.request?.status === 400) {
      notificationService.showError(e.response?.data.message);
      return;
    }
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};
</script>

<style scoped></style> -->
<template>
  <div>
    <h1>Payment Page</h1>
  </div>
</template>