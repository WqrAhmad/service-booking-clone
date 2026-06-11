<template>
  <div class="invoice-container" v-if="job">
    <div class="invoice-content">
      <!-- Invoice Header -->
      <div class="invoice-header">
        <div class="invoice-logo">
          <h1 class="text-2xl font-bold text-gray-900">Invoice</h1>
        </div>
        <div class="invoice-info">
          <p class="text-sm text-gray-600">Invoice #{{ job.id }}</p>
          <p class="text-sm text-gray-600">Date: {{ invoiceDate }}</p>
        </div>
      </div>

      <!-- Company & Customer Info -->
      <div class="invoice-parties">
        <div class="invoice-from">
          <h3 class="font-semibold text-gray-900 mb-2">From:</h3>
          <p class="text-gray-700">Service Provider CRM</p>
          <p class="text-gray-700">Platform Services</p>
        </div>
        <div class="invoice-to">
          <h3 class="font-semibold text-gray-900 mb-2">To:</h3>
          <p class="text-gray-700 font-medium">{{ job.customerName }}</p>
          <p class="text-gray-700">{{ job.customerEmail }}</p>
          <p class="text-gray-700">{{ job.jobAddress }}</p>
          <p class="text-gray-700">{{ job.jobPostcode }}</p>
        </div>
      </div>

      <!-- Job Details -->
      <div class="invoice-details">
        <h3 class="font-semibold text-gray-900 mb-3">Job Details:</h3>
        <div class="detail-row">
          <span class="detail-label">Service Type:</span>
          <span class="detail-value">{{ job.serviceType }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Job Address:</span>
          <span class="detail-value">{{ job.jobAddress }}, {{ job.jobPostcode }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Assigned Staff:</span>
          <span class="detail-value">{{ job.mapperName }} - {{ job.mapperBusiness }}</span>
        </div>
        <div v-if="job.jobDescription" class="detail-row">
          <span class="detail-label">Description:</span>
          <span class="detail-value">{{ job.jobDescription }}</span>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="invoice-items">
        <table class="invoice-table">
          <thead>
            <tr>
              <th class="text-left">Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Service Fee</td>
              <td class="text-right">£{{ job.mapperFee.toFixed(2) }}</td>
            </tr>
            <tr>
              <td>Deposit Fee</td>
              <td class="text-right">£{{ job.platformFee.toFixed(2) }}</td>
            </tr>
            <tr class="total-row">
              <td class="font-bold">Total Amount</td>
              <td class="text-right font-bold">£{{ job.totalAmount.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment Status -->
      <div class="invoice-footer">
        <div class="payment-status">
          <p class="text-sm text-gray-600">
            <span class="font-semibold">Payment Status:</span>
            <span :class="job.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'">
              {{ job.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment' }}
            </span>
          </p>
          <p v-if="job.paymentLink" class="text-sm text-gray-600 mt-2">
            Payment Link: {{ job.paymentLink }}
          </p>
        </div>
      </div>

      <!-- Print Button (visible on screen, hidden when printing) -->
      <div class="print-actions no-print">
        <button @click="printInvoice" class="print-button">
          Print / Save as PDF
        </button>
        <button @click="closeWindow" class="close-button">
          Close
        </button>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading invoice...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Job {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  jobAddress: string;
  jobPostcode: string;
  mapperName: string;
  mapperBusiness: string;
  mapperFee: number;
  platformFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentLink: string | null;
  jobDescription: string;
}

const job = ref<Job | null>(null);
const invoiceDate = ref<string>('');

onMounted(() => {
  const jobId = route.params.id as string;

  // Get job data from sessionStorage (passed from JobDetail page)
  const jobData = sessionStorage.getItem(`invoice_job_${jobId}`);
  if (jobData) {
    job.value = JSON.parse(jobData);
    invoiceDate.value = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    // Fallback: Try to fetch from API or use mock data
    // TODO: Fetch job details from API
    // const response = await httpService.get(`/admin/jobs/${jobId}`);
    // job.value = response.data;

    // Mock data
    job.value = {
      id: jobId,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      serviceType: 'Floor Mapping',
      jobAddress: '123 Main Street, London',
      jobPostcode: 'SW1A 1AA',
      mapperName: 'John Smith',
      mapperBusiness: 'Smith Mapping Services',
      mapperFee: 150.00,
      platformFee: 15.00,
      totalAmount: 165.00,
      status: 'assigned',
      paymentStatus: 'pending',
      paymentLink: null,
      jobDescription: 'Floor mapping service required for property survey',
    };
    invoiceDate.value = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

const printInvoice = () => {
  window.print();
};

const closeWindow = () => {
  window.close();
};
</script>

<style scoped>
.invoice-container {
  min-height: 100vh;
  background: white;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.invoice-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.invoice-logo h1 {
  color: #111827;
  margin: 0;
}

.invoice-info {
  text-align: right;
}

.invoice-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.invoice-from,
.invoice-to {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.invoice-from h3,
.invoice-to h3 {
  color: #111827;
  margin-bottom: 10px;
}

.invoice-details {
  margin-bottom: 40px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.invoice-details h3 {
  color: #111827;
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  color: #111827;
}

.invoice-items {
  margin-bottom: 40px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
}

.invoice-table thead {
  background: #f3f4f6;
}

.invoice-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
}

.invoice-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.invoice-table .total-row {
  background: #f9fafb;
  font-size: 1.1em;
}

.invoice-table .total-row td {
  border-top: 2px solid #e5e7eb;
  border-bottom: none;
  padding-top: 16px;
}

.invoice-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
}

.payment-status {
  text-align: center;
}

.print-actions {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
}

.print-button,
.close-button {
  padding: 12px 24px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.print-button {
  background: #2563eb;
  color: white;
}

.print-button:hover {
  background: #1d4ed8;
}

.close-button {
  background: #6b7280;
  color: white;
}

.close-button:hover {
  background: #4b5563;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 18px;
  color: #6b7280;
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }

  .invoice-container {
    padding: 0;
  }

  .invoice-content {
    max-width: 100%;
  }

  .invoice-from,
  .invoice-to,
  .invoice-details {
    background: white;
    border: 1px solid #e5e7eb;
  }

  @page {
    margin: 1cm;
  }
}
</style>
