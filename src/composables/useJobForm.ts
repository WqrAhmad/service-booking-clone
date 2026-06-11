// composables/useJobForm.ts
// ─── Shared logic for Add / Edit / Duplicate job pages ───────────────────────

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { servicesService, jobService, notificationService } from '@/services/_singletons';

export function useJobForm() {
  const router = useRouter();

  // ─── Form data ────────────────────────────────────────────────────────
  const formData: any = ref({
    registration: '',
    vehicleId: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleVariant: '',
    engineDetails: null as any,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    jobAddress: '',
    jobPostcode: '',
    jobLatitude: null as number | null,
    jobLongitude: null as number | null,
    scheduled_at: '',
    scheduledDate: '',
    scheduledTime: '',
    scheduledHour: '00',
    scheduledMinute: '00',
    scheduledPeriod: 'AM',
    mapperId: '' as string | number,
    mapperName: '',
    mail_customer: true,
    customer_whatsapp_msg: true,
    maspper_whatsapp_msg: true,
  });

  const searchCriteria = ref({
    serviceId: '',
    serviceName: '',
    radius: 30,
  });

  // ─── UI state ─────────────────────────────────────────────────────────
  const loadingVehicle = ref(false);
  const vehicleError = ref('');
  const vehicleDetails = ref<any>(null);
  const engineDetails = ref<any>(null);
  const loadingStaffs = ref(false);
  const loadingServices = ref(false);
  const hasSearched = ref(false);
  const submitting = ref(false);
  const showRadiusDropdown = ref(false);
  const showServiceDropdown = ref(false);
  const radiusSearchQuery = ref('');
  const serviceSearchQuery = ref('');
  const searchResults = ref<any[]>([]);
  const availableServices = ref<any[]>([]);
  const errors = ref<Record<string, string>>({});

  // ─── Dialog multi-select state ────────────────────────────────────────
  const dialogSelectedServices = ref<string[]>([]);
  const dialogServicePriceOverrides = ref<Record<string, number>>({});
  const dialogServiceFeeOverrides = ref<Record<string, number>>({});
  const dialogPlatformFeeOverride = ref<number>(0);
  const confirmedStaffServices = ref<Record<string, Array<{
    serviceId: number; serviceRowId: string; serviceName: string; price: number; platformFee: number;
  }>>>({});

  const servicesDialog = ref<{ open: boolean; mapper: any | null }>({ open: false, mapper: null });

  // ─── Radius options ───────────────────────────────────────────────────
  const radiusOptions = [
    { value: 10, label: '10 miles' }, { value: 20, label: '20 miles' },
    { value: 30, label: '30 miles' }, { value: 40, label: '40 miles' },
    { value: 50, label: '50 miles' }, { value: 60, label: '60 miles' },
    { value: 70, label: '70 miles' }, { value: 80, label: '80 miles' },
    { value: 90, label: '90 miles' }, { value: 100, label: '100 miles' },
  ];

  // ─── Computed ─────────────────────────────────────────────────────────
  const radiusDisplay = computed(() => radiusOptions.find(o => o.value === searchCriteria.value.radius)?.label ?? '');
  const serviceTypeDisplay = computed(() => searchCriteria.value.serviceName || '');

  const selectedServicePlatformFee = computed(() => {
    if (!searchCriteria.value.serviceId || !availableServices.value?.length) return 0;
    const svc = availableServices.value.find(
      (s: any) => String(s.id) === String(searchCriteria.value.serviceId)
    );
    return Number(svc?.platform_fee ?? svc?.platformFee) || 0;
  });

  const filteredRadiusOptions = computed(() =>
    !radiusSearchQuery.value ? radiusOptions
      : radiusOptions.filter(o => o.label.toLowerCase().includes(radiusSearchQuery.value.toLowerCase()))
  );
  const filteredServiceOptions = computed(() =>
    !serviceSearchQuery.value ? availableServices.value
      : availableServices.value.filter((s: any) => s.name.toLowerCase().includes(serviceSearchQuery.value.toLowerCase()))
  );

  // ─── Dialog computed ──────────────────────────────────────────────────
  const svcKey = (svc: any, idx: number): string => String(svc.id ?? idx);

  const dialogAllSelected = computed(() => {
    const services = servicesDialog.value.mapper?.services ?? [];
    if (!services.length) return false;
    return services.every((svc: any, idx: number) =>
      dialogSelectedServices.value.includes(svcKey(svc, idx))
    );
  });
  const dialogSomeSelected = computed(() => dialogSelectedServices.value.length > 0);

  // ─── Helpers ──────────────────────────────────────────────────────────
  const disablePastDates = (date: Date) => {
    const t = new Date(); t.setHours(0, 0, 0, 0); return date <= t;
  };
  const formatOption = (option: string) =>
    option.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const mergeDateTime = () => {
    const date = formData.value.scheduledDate;
    const hourStr = (formData.value.scheduledHour ?? '').toString().padStart(2, '0');
    const minuteStr = (formData.value.scheduledMinute ?? '').toString().padStart(2, '0');
    const period = (formData.value.scheduledPeriod ?? 'AM').toUpperCase();

    const hourNum = parseInt(hourStr, 10);
    const minuteNum = parseInt(minuteStr, 10);

    if (!date || isNaN(hourNum) || isNaN(minuteNum)) {
      formData.value.scheduledTime = '';
      formData.value.scheduled_at = '';
      return;
    }

    // Clamp to valid 12h values
    let h12 = hourNum;
    if (h12 <= 0 || h12 > 12) h12 = 12;
    let m = minuteNum;
    if (m < 0) m = 0;
    if (m > 59) m = 59;

    // Convert 12h + period -> 24h
    let h24 = h12 % 12;
    if (period === 'PM') h24 += 12;

    const hh = String(h24).padStart(2, '0');
    const mm = String(m).padStart(2, '0');

    formData.value.scheduledTime = `${hh}:${mm}`;

    if (formData.value.scheduledDate && formData.value.scheduledTime) {
      formData.value.scheduled_at = `${formData.value.scheduledDate} ${formData.value.scheduledTime}:00`;
      if (errors.value.scheduled_at) delete errors.value.scheduled_at;
    } else {
      formData.value.scheduled_at = '';
    }
  };

  const selectRadius = (value: number) => {
    searchCriteria.value.radius = value; showRadiusDropdown.value = false; radiusSearchQuery.value = '';
  };
  const selectService = (service: any) => {
    searchCriteria.value.serviceId = service.id;
    searchCriteria.value.serviceName = service.name;
    showServiceDropdown.value = false; serviceSearchQuery.value = '';
    if (errors.value.serviceId) delete errors.value.serviceId;
  };
  const filterRadiusOptions = (e: Event) => { radiusSearchQuery.value = (e.target as HTMLInputElement).value; };
  const filterServiceOptions = (e: Event) => { serviceSearchQuery.value = (e.target as HTMLInputElement).value; };

  // ─── Staff helpers ───────────────────────────────────────────────────
  const selectStaff = (mapper: any) => {
    formData.value.mapperId = mapper.id;
    formData.value.mapperName = mapper.name;
    if (errors.value.mapperId) delete errors.value.mapperId;
  };

  const getSelectedServicePrice = (mapper: any): string | null => {
    if (!mapper.services || !searchCriteria.value.serviceId) return null;
    const s = mapper.services.find(
      (s: any) =>
        String(s.service?.id) === String(searchCriteria.value.serviceId) ||
        String(s.service_id) === String(searchCriteria.value.serviceId)
    );
    return s ? s.price : null;
  };
  const getSelectedServicePriceNumber = (mapper: any): number => {
    const p = getSelectedServicePrice(mapper);
    if (p == null || p === '') return 0;
    const n = Number(p); return Number.isFinite(n) ? n : 0;
  };
  const getTotalQuotedPrice = (mapper: any): string | null => {
    const total = getSelectedServicePriceNumber(mapper) + selectedServicePlatformFee.value;
    return total > 0 ? total.toFixed(2) : null;
  };

  const getStaffLat = (mapper: any): number | null => {
    const v = mapper?.latitude ?? mapper?.lat;
    if (v == null || v === '') return null;
    const n = Number(v); return Number.isFinite(n) ? n : null;
  };
  const getStaffLng = (mapper: any): number | null => {
    const v = mapper?.longitude ?? mapper?.lng;
    if (v == null || v === '') return null;
    const n = Number(v); return Number.isFinite(n) ? n : null;
  };

  const MAP_DELTA = 0.008;
  const mapperEmbedMapUrl = (mapper: any): string => {
    const lat = getStaffLat(mapper)!, lng = getStaffLng(mapper)!;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${[lng - MAP_DELTA, lat - MAP_DELTA, lng + MAP_DELTA, lat + MAP_DELTA].join(',')}&layer=mapnik&marker=${lat},${lng}`;
  };
  const mapperMapLink = (mapper: any): string => {
    const lat = getStaffLat(mapper)!, lng = getStaffLng(mapper)!;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  };

  const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any): string => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 'N/A';
    const R = 3958.8, toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(Number(lat2) - Number(lat1));
    const dLon = toRad(Number(lon2) - Number(lon1));
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) * Math.sin(dLon / 2) ** 2;
    return `${(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)} miles`;
  };

  const getStaffSelectedServices = (mapper: any) => confirmedStaffServices.value[mapper.id] ?? [];

  const isCurrentlySelectedService = (svc: any): boolean => {
    if (!searchCriteria.value.serviceId) return false;
    return String(svc.service?.id ?? svc.service_id) === String(searchCriteria.value.serviceId);
  };

  // ─── Dialog actions ───────────────────────────────────────────────────
  const toggleSelectAllServices = () => {
    const services = servicesDialog.value.mapper?.services ?? [];
    if (dialogAllSelected.value) {
      dialogSelectedServices.value = [];
    } else {
      services.forEach((svc: any, idx: number) => {
        const key = svcKey(svc, idx);
        if (!dialogSelectedServices.value.includes(key)) dialogSelectedServices.value.push(key);
        if (dialogServicePriceOverrides.value[key] == null)
          dialogServicePriceOverrides.value[key] = svc.price != null ? Number(svc.price) : 0;
        if (dialogServiceFeeOverrides.value[key] == null)
          dialogServiceFeeOverrides.value[key] = dialogPlatformFeeOverride.value ?? 0;
      });
    }
  };

  const isDialogServiceSelected = (svc: any, idx: any): boolean =>
    dialogSelectedServices.value.includes(svcKey(svc, idx));

  const toggleDialogService = (svc: any, idx: any) => {
    const key = svcKey(svc, idx);
    const pos = dialogSelectedServices.value.indexOf(key);
    if (pos === -1) {
      dialogSelectedServices.value.push(key);
      if (dialogServicePriceOverrides.value[key] == null)
        dialogServicePriceOverrides.value[key] = svc.price != null ? Number(svc.price) : 0;
      if (dialogServiceFeeOverrides.value[key] == null)
        dialogServiceFeeOverrides.value[key] = dialogPlatformFeeOverride.value ?? 0;
    } else {
      dialogSelectedServices.value.splice(pos, 1);
    }
  };

  const getDialogServicePrice = (svc: any, idx: any): number => {
    const key = svcKey(svc, idx);
    return dialogServicePriceOverrides.value[key] != null
      ? dialogServicePriceOverrides.value[key]
      : (svc.price != null ? Number(svc.price) : 0);
  };
  const setDialogServicePrice = (svc: any, idx: any, val: any) => {
    dialogServicePriceOverrides.value[svcKey(svc, idx)] = parseFloat(val) || 0;
  };
  const getDialogServicePlatformFee = (svc: any, idx: any): number => {
    const key = svcKey(svc, idx);
    return dialogServiceFeeOverrides.value[key] != null
      ? dialogServiceFeeOverrides.value[key]
      : (dialogPlatformFeeOverride.value ?? 0);
  };
  const setDialogServicePlatformFee = (svc: any, idx: any, val: string) => {
    dialogServiceFeeOverrides.value[svcKey(svc, idx)] = parseFloat(val) || 0;
  };

  const openServicesDialog = (mapper: any) => {
    servicesDialog.value = { open: true, mapper };
    dialogPlatformFeeOverride.value = selectedServicePlatformFee.value;
    const existing = confirmedStaffServices.value[mapper.id];
    if (existing?.length) {
      dialogSelectedServices.value = existing.map(s => s.serviceRowId);
      dialogServicePriceOverrides.value = Object.fromEntries(existing.map(s => [s.serviceRowId, s.price]));
      dialogServiceFeeOverrides.value = Object.fromEntries(existing.map(s => [s.serviceRowId, s.platformFee]));
      dialogPlatformFeeOverride.value = existing[0]?.platformFee ?? selectedServicePlatformFee.value;
    } else {
      dialogSelectedServices.value = [];
      dialogServicePriceOverrides.value = {};
      dialogServiceFeeOverrides.value = {};
    }
  };

  const closeServicesDialog = () => { servicesDialog.value = { open: false, mapper: null }; };

  const selectStaffFromDialog = () => {
    if (!servicesDialog.value.mapper || dialogSelectedServices.value.length === 0) return;
    const mapper = servicesDialog.value.mapper;
    const mapperServices: any[] = mapper.services ?? [];
    confirmedStaffServices.value[mapper.id] = dialogSelectedServices.value.map(rowKey => {
      const row = mapperServices.find((svc: any, idx: number) => svcKey(svc, idx) === rowKey);
      return {
        serviceId: Number(row?.service?.id ?? row?.service_id ?? rowKey),
        serviceRowId: rowKey,
        serviceName: row?.service?.name ?? row?.name ?? 'Unknown Service',
        price: dialogServicePriceOverrides.value[rowKey] ?? (row?.price != null ? Number(row.price) : 0),
        platformFee: dialogServiceFeeOverrides.value[rowKey] ?? dialogPlatformFeeOverride.value ?? 0,
      };
    });
    selectStaff(mapper);
    closeServicesDialog();
  };

  // ─── Validation ───────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    errors.value = {};
    let isValid = true;
    if (!formData.value.customerName?.trim()) { errors.value.customerName = 'Customer name is required'; isValid = false; }
    if (!formData.value.customerEmail?.trim()) {
      errors.value.customerEmail = 'Customer email is required'; isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.customerEmail)) {
      errors.value.customerEmail = 'Please enter a valid email address'; isValid = false;
    }
    if (!formData.value.scheduledDate || !formData.value.scheduledTime) {
      errors.value.scheduled_at = 'Date and time are required'; isValid = false;
    }
    if (!formData.value.jobPostcode?.trim()) { errors.value.jobPostcode = 'Job postcode is required'; isValid = false; }
    if (!searchCriteria.value.serviceId) { errors.value.serviceId = 'Service type is required'; isValid = false; }
    return isValid;
  };

  // ─── API: Vehicle lookup ──────────────────────────────────────────────
  const lookupVehicle = async () => {
    if (!formData.value.registration) {
      errors.value.registration = 'Please enter a vehicle registration number';
      vehicleError.value = 'Please enter a vehicle registration number';
      return;
    }
    loadingVehicle.value = true; vehicleError.value = ''; vehicleDetails.value = null; engineDetails.value = null;
    if (errors.value.registration) delete errors.value.registration;
    try {
      const response = await fetch(`https://backend-2.tuning-company.co.uk/resolve?reg=${formData.value.registration}`);
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
      const response = await fetch(`https://backend-2.tuning-company.co.uk/getEngineDetails/?engine_id=${engineId}`);
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
      if (e instanceof AxiosError) console.error('Error fetching services:', e.response?.data?.message);
    } finally {
      loadingServices.value = false;
    }
  };

  // ─── API: Search mappers ──────────────────────────────────────────────
  const searchStaffs = async () => {
    if (!formData.value.jobPostcode || !searchCriteria.value.serviceId) return;
    hasSearched.value = true; loadingStaffs.value = true; searchResults.value = [];
    try {
      const res: any = await jobService.getJobSearchList([
        { key: 'post_code', value: formData.value.jobPostcode },
        { key: 'latitude', value: formData.value.jobLatitude },
        { key: 'longitude', value: formData.value.jobLongitude },
        { key: 'service_id', value: searchCriteria.value.serviceId },
        { key: 'available', value: 'available' },
        { key: 'radius', value: searchCriteria.value.radius.toString() },
      ]);
      searchResults.value = res.data || res;
    } catch {
      notificationService.showError('Add Correct Postcode');
    } finally {
      loadingStaffs.value = false;
    }
  };

  // ─── API: Submit (add or edit) ────────────────────────────────────────
  const buildServicesPayload = () => {
    const mapperId = String(formData.value.mapperId);
    const confirmed = confirmedStaffServices.value[mapperId] ?? [];
    if (confirmed.length > 0) {
      return confirmed.map(s => ({
        service_id: s.serviceId,
        service_price: s.price,
        platform_fee: s.platformFee,
      }));
    } else if (searchCriteria.value.serviceId) {
      return [{ service_id: Number(searchCriteria.value.serviceId) }];
    }
    return [];
  };

  const buildJobData = () => ({
    registration: formData.value.registration,
    vehicle_id: formData.value.vehicleId,
    vehicle_make: formData.value.vehicleMake,
    vehicle_model: formData.value.vehicleModel,
    vehicle_year: formData.value.vehicleYear,
    vehicle_variant: formData.value.vehicleVariant,
    engine_details: formData.value.engineDetails,
    customer_name: formData.value.customerName,
    customer_email: formData.value.customerEmail,
    customer_phone: formData.value.customerPhone || null,
    customer_address: formData.value.jobAddress,
    post_code: formData.value.jobPostcode,
    latitude: formData.value.jobLatitude,
    longitude: formData.value.jobLongitude,
    scheduled_at: formData.value.scheduled_at || null,
    user_id: formData.value.mapperId,
    service_id: searchCriteria.value.serviceId,
    status: 'pending',
    mail_customer: formData.value.mail_customer,
    customer_whatsapp_msg: formData.value.customer_whatsapp_msg,
    maspper_whatsapp_msg: formData.value.maspper_whatsapp_msg,
    services: buildServicesPayload(),
  });

  // ─── Postcode watcher ─────────────────────────────────────────────────
  let postcodeTimer: ReturnType<typeof setTimeout> | null = null;
  watch(() => formData.value.jobPostcode, (val: string) => {
    formData.value.jobLatitude = null;
    formData.value.jobLongitude = null;
    if (errors.value.jobPostcode) delete errors.value.jobPostcode;
    const pc = val?.trim();
    if (!pc || pc.length < 5) return;
    if (postcodeTimer) clearTimeout(postcodeTimer);
    postcodeTimer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 200 && data.result) {
          formData.value.jobLatitude = data.result.latitude;
          formData.value.jobLongitude = data.result.longitude;
        }
      } catch { /* silent */ }
    }, 600);
  });

  watch(availableServices, (svcs) => {
    // If a service is already chosen (e.g. in edit/duplicate flows) but only the ID is known,
    // back-fill the display name from the freshly loaded services list.
    if (searchCriteria.value.serviceId && !searchCriteria.value.serviceName && svcs.length) {
      const found = svcs.find((s: any) => String(s.id) === String(searchCriteria.value.serviceId));
      if (found) searchCriteria.value.serviceName = found.name;
    }

    // Default service selection for new jobs: if nothing is selected yet, automatically
    // pick the "Stage 1" service (matching by name, case-insensitive, and allowing
    // names that start with "Stage 1").
    if (!searchCriteria.value.serviceId && svcs.length) {
      const stage1 = svcs.find((s: any) => {
        if (!s?.name) return false;
        const n = String(s.name).toLowerCase();
        return n === 'stage 1' || n.startsWith('stage 1 ');
      });
      if (stage1) {
        searchCriteria.value.serviceId = stage1.id;
        searchCriteria.value.serviceName = stage1.name;
      }
    }
  });

  watch(() => formData.value.scheduledDate, () => mergeDateTime());
  watch(() => formData.value.scheduledHour, () => mergeDateTime());
  watch(() => formData.value.scheduledMinute, () => mergeDateTime());
  watch(
    () => formData.value.scheduledPeriod,
    () => {
      const h = String(formData.value.scheduledHour ?? '');
      const m = String(formData.value.scheduledMinute ?? '');
      // If time not yet set (or still 00:00), default to 9:00 when AM/PM is chosen
      if ((!h || h === '00') && (!m || m === '00')) {
        formData.value.scheduledHour = '9';
        formData.value.scheduledMinute = '00';
      }
      mergeDateTime();
    }
  );
  watch(() => formData.value.customerName, (v) => { if (v && errors.value.customerName) delete errors.value.customerName; });
  watch(() => formData.value.customerEmail, (v) => { if (v && errors.value.customerEmail) delete errors.value.customerEmail; });
  watch(() => formData.value.mapperId, (v) => { if (v && errors.value.mapperId) delete errors.value.mapperId; });
  watch(() => formData.value.registration, (v) => { if (v && errors.value.registration) delete errors.value.registration; });

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      showRadiusDropdown.value = false;
      showServiceDropdown.value = false;
    }
  };
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && servicesDialog.value.open) closeServicesDialog();
  };

  onMounted(() => {
    fetchServices();
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
  });
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
  });

  return {
    router,
    formData, searchCriteria, errors,
    loadingVehicle, vehicleError, vehicleDetails, engineDetails,
    loadingStaffs, loadingServices, hasSearched, submitting,
    showRadiusDropdown, showServiceDropdown,
    radiusSearchQuery, serviceSearchQuery,
    searchResults, availableServices,
    radiusOptions, radiusDisplay, serviceTypeDisplay,
    selectedServicePlatformFee, filteredRadiusOptions, filteredServiceOptions,
    // Dialog
    servicesDialog, dialogSelectedServices, dialogServicePriceOverrides,
    dialogServiceFeeOverrides, dialogPlatformFeeOverride, confirmedStaffServices,
    dialogAllSelected, dialogSomeSelected,
    // Methods
    disablePastDates, formatOption, mergeDateTime,
    selectRadius, selectService, filterRadiusOptions, filterServiceOptions,
    selectStaff, selectStaffFromDialog, openServicesDialog, closeServicesDialog,
    toggleSelectAllServices, isDialogServiceSelected, toggleDialogService,
    getDialogServicePrice, setDialogServicePrice, getDialogServicePlatformFee, setDialogServicePlatformFee,
    getSelectedServicePrice, getTotalQuotedPrice,
    getStaffLat, getStaffLng, mapperEmbedMapUrl, mapperMapLink, getDistance,
    getStaffSelectedServices, isCurrentlySelectedService,
    lookupVehicle, fetchServices, searchStaffs,
    validateForm, buildJobData,
  };
}