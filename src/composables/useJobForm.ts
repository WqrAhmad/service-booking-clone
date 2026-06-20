// composables/useJobForm.ts

import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { servicesService, userService } from '@/services/_singletons';

export function useJobForm() {
  const router = useRouter();

  // ─── Form data ────────────────────────────────────────────────────────
  const formData: any = ref({
    registration: '',
    vehicleId: '',
    vehicleYear: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    jobAddress: '',
    jobPostcode: '',
    scheduled_at: '',
    scheduledDate: '',
    scheduledTime: '',
    user_id: '',
    mail_customer: true,
    services: [
      {
        service_id: '',
        description: '',
        qty: 1,
        price: 0,
      },
    ],
  });

  // ─── UI state ─────────────────────────────────────────────────────────
  const loadingVehicle = ref(false);
  const vehicleError = ref('');
  const vehicleDetails = ref<any>(null);
  const engineDetails = ref<any>(null);
  const loadingServices = ref(false);
  const loadingStaff = ref(false);
  const submitting = ref(false);
  const availableServices = ref<any[]>([]);
  const availableStaff = ref<any[]>([]);
  const errors = ref<Record<string, string>>({});

  // ─── Helpers ──────────────────────────────────────────────────────────
  const formatOption = (option: string) =>
    option.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const mergeDateTime = () => {
    const date = formData.value.scheduledDate;
    const time = formData.value.scheduledTime;

    if (date && time) {
      formData.value.scheduled_at = `${date} ${time}:00`;
      if (errors.value.scheduled_at) delete errors.value.scheduled_at;
    } else {
      formData.value.scheduled_at = '';
    }
  };

  // ─── Validation ───────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.customerName?.trim()) {
      errors.value.customerName = 'Customer name is required';
      isValid = false;
    }
    if (!formData.value.user_id) {
      errors.value.user_id = 'Staff is required';
      isValid = false;
    }
    if (!formData.value.customerEmail?.trim()) {
      errors.value.customerEmail = 'Customer email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.customerEmail)) {
      errors.value.customerEmail = 'Please enter a valid email address';
      isValid = false;
    }
    if (!formData.value.scheduledDate || !formData.value.scheduledTime) {
      errors.value.scheduled_at = 'Date and time are required';
      isValid = false;
    }
    if (!formData.value.jobPostcode?.trim()) {
      errors.value.jobPostcode = 'Job postcode is required';
      isValid = false;
    }

    return isValid;
  };

  // ─── API: Vehicle lookup ──────────────────────────────────────────────
  const lookupVehicle = async () => {
    if (!formData.value.registration) {
      errors.value.registration = 'Please enter a vehicle registration number';
      vehicleError.value = 'Please enter a vehicle registration number';
      return;
    }
    loadingVehicle.value = true;
    vehicleError.value = '';
    vehicleDetails.value = null;
    engineDetails.value = null;
    if (errors.value.registration) delete errors.value.registration;

    try {
      const response = await fetch(
        `https://backend-2.tuning-company.co.uk/resolve?reg=${formData.value.registration}`
      );
      if (!response.ok) throw new Error('Vehicle not found');
      const data = await response.json();
      if (!data.success) throw new Error('Vehicle lookup failed');

      vehicleDetails.value = data;
      formData.value.vehicleId = data.id;
      formData.value.vehicleMake = data.make;
      formData.value.vehicleModel = data.model;
      formData.value.vehicleYear = data.year;
      formData.value.vehicleVariant = data.variant;
      if (errors.value.vehicleId) delete errors.value.vehicleId;
      if (data.id) await fetchEngineDetails(data.id);
    } catch {
      vehicleError.value = 'Unable to find vehicle details. Please check the registration number and try again.';
      errors.value.vehicleId = 'Vehicle not found. Please check the registration.';
    } finally {
      loadingVehicle.value = false;
    }
  };

  const fetchEngineDetails = async (engineId: string) => {
    try {
      const response = await fetch(
        `https://backend-2.tuning-company.co.uk/getEngineDetails/?engine_id=${engineId}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      engineDetails.value = data.engineDetails;
      formData.value.engineDetails = data.engineDetails;
    } catch { /* silent */ }
  };

  // ─── API: Services ────────────────────────────────────────────────────
  const fetchServices = async () => {
    try {
      loadingServices.value = true;
      const res: any = await servicesService.getServicesList([
        { key: 'take-all', value: 'true' },
        { key: 'status', value: 'active' },
      ]);
      availableServices.value = res.data || res;
    } catch (e) {
      if (e instanceof AxiosError)
        console.error('Error fetching services:', e.response?.data?.message);
    } finally {
      loadingServices.value = false;
    }
  };

  // ─── API: Staff ─────────────────────────────────────────────────────
  const fetchStaff = async () => {
    try {
      loadingStaff.value = true;
      const res: any = await userService.getUserList([
        { key: 'take_all', value: 'true' },
        { key: 'available', value: 'available' }

      ]);
      availableStaff.value = res.data || res;
    } catch (e) {
      if (e instanceof AxiosError)
        console.error('Error fetching staff:', e.response?.data?.message);
    } finally {
      loadingStaff.value = false;
    }
  };

  // ─── Build payload ────────────────────────────────────────────────────
  const buildJobData = () => ({
    registration: formData.value.registration,
    vehicle_id: formData.value.vehicleId,
    user_id: formData.value.user_id,
    vehicle_year: formData.value.vehicleYear,
    customer_name: formData.value.customerName,
    customer_email: formData.value.customerEmail,
    customer_phone: formData.value.customerPhone || null,
    customer_address: formData.value.jobAddress,
    post_code: formData.value.jobPostcode,
    scheduled_at: formData.value.scheduled_at || null,
    status: 'pending',
    mail_customer: formData.value.mail_customer,
    services: formData.value.services
      .filter((s: any) => s.service_id)
      .map((s: any) => ({
        service_id: s.service_id,
        description: s.description,
        qty: s.qty,
        price: s.price,
      })),
  });



  // ─── DateTime watchers ────────────────────────────────────────────────
  watch(() => formData.value.scheduledDate, () => mergeDateTime());
  watch(() => formData.value.scheduledTime, () => mergeDateTime());

  // ─── Field error-clear watchers ───────────────────────────────────────
  watch(() => formData.value.customerName, v => { if (v && errors.value.customerName) delete errors.value.customerName; });
  watch(() => formData.value.customerEmail, v => { if (v && errors.value.customerEmail) delete errors.value.customerEmail; });
  watch(() => formData.value.jobPostcode, v => { if (v && errors.value.jobPostcode) delete errors.value.jobPostcode; });
  watch(() => formData.value.user_id, v => { if (v && errors.value.user_id) delete errors.value.user_id; });

  watch(() => formData.value.registration, v => { if (v && errors.value.registration) delete errors.value.registration; });

  onMounted(() => {
    fetchServices();
    fetchStaff();
  });

  return {
    router,
    formData,
    errors,
    loadingVehicle,
    vehicleError,
    vehicleDetails,
    engineDetails,
    loadingServices,
    submitting,
    availableServices,
    availableStaff,
    // Methods
    formatOption,
    mergeDateTime,
    lookupVehicle,
    fetchServices,
    fetchStaff,
    validateForm,
    buildJobData,
  };
}