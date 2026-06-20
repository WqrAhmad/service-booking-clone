<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="mx-auto">

            <div class="mb-8">
                <slot name="header" />
            </div>

            <form @submit.prevent="$emit('submit')" class="space-y-8">

                <!-- ══════════════════════════════════════════════ -->
                <!-- Vehicle Lookup                                 -->
                <!-- ══════════════════════════════════════════════ -->
                <div class="bg-white rounded-lg shadow-xl p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>

                    <div>
                        <label for="registration" class="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Registration <span class="text-red-500">*</span>
                        </label>
                        <div class="flex gap-2">
                            <input id="registration" v-model="formData.registration" type="text"
                                placeholder="e.g., W4LAL"
                                class="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                                :class="errors.registration ? 'border-red-500' : 'border-gray-300'"
                                @input="formData.registration = ($event.target as HTMLInputElement).value.toUpperCase()" />
                            <button type="button" :disabled="loadingVehicle"
                                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                @click="$emit('lookupVehicle')">
                                {{ loadingVehicle ? 'Looking up...' : 'Lookup' }}
                            </button>
                        </div>
                        <p v-if="errors.registration" class="mt-1 text-xs text-red-500">{{ errors.registration }}</p>
                    </div>

                    <!-- Loading spinner -->
                    <div v-if="loadingVehicle" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div class="flex items-center justify-center">
                            <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p class="text-blue-800">Fetching vehicle information...</p>
                        </div>
                    </div>

                    <!-- Vehicle details card -->
                    <div v-if="vehicleDetails && vehicleDetails.id" class="mt-6">
                        <div
                            class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-2xl overflow-hidden">
                            <div class="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-6">
                                        <div class="bg-white rounded-lg p-4 shadow-lg">
                                            <img v-if="engineDetails?.brand_image" :src="engineDetails.brand_image"
                                                :alt="vehicleDetails.name || 'Vehicle Brand'" class="h-16 w-auto" />
                                        </div>
                                        <div class="text-white">
                                            <h2 class="text-3xl font-bold mb-1">{{ vehicleDetails.name || '' }}</h2>
                                            <div class="flex items-center space-x-4 text-blue-100">
                                                <span class="text-lg font-semibold bg-white/20 px-3 py-1 rounded">{{
                                                    formData.registration }}</span>
                                                <span class="text-sm">{{ vehicleDetails.year }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="hidden lg:flex space-x-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                                            <div class="text-2xl font-bold text-white">{{
                                                engineDetails?.horsepower_white }}hp</div>
                                            <div class="text-xs text-blue-100">Power</div>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                                            <div class="text-2xl font-bold text-white">{{ engineDetails?.torque_white
                                            }}Nm</div>
                                            <div class="text-xs text-blue-100">Torque</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6">
                                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div class="lg:col-span-4 space-y-4">
                                        <h3 class="text-lg font-semibold text-white mb-3">Vehicle Details</h3>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Energy</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.energy || 'N/A' }}</p>
                                            </div>
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Engine Number</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.engine_number || 'N/A' }}</p>
                                            </div>
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Compression Ratio</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.compression_ratio || 'N/A' }}</p>
                                            </div>
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Bore Stroke Ratio</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.bore_stroke_ratio || 'N/A' }}</p>
                                            </div>
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Method</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.method || 'N/A' }}</p>
                                            </div>
                                            <div
                                                class="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                                <p class="text-xs text-gray-400 mb-1">Cylinder Content</p>
                                                <p class="text-sm font-semibold text-white">{{
                                                    engineDetails?.specz?.['Cylinder content'] || 'N/A' }}</p>
                                            </div>
                                        </div>
                                        <div
                                            class="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
                                            <h4 class="text-sm font-semibold text-blue-300 mb-2">Engine ECU</h4>
                                            <p class="text-xs text-white">{{ engineDetails?.specz?.engine_ecu || 'N/A'
                                            }}</p>
                                        </div>
                                    </div>

                                    <div class="lg:col-span-8">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <!-- HP -->
                                            <div
                                                class="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-400/30">
                                                <div class="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 class="text-lg font-bold text-white mb-1">Engine Power</h3>
                                                        <p class="text-xs text-gray-400">Performance Increase</p>
                                                    </div>
                                                    <div
                                                        class="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                                                        <span class="text-xl font-bold">{{
                                                            Math.round((engineDetails?.horsepower_white -
                                                                engineDetails?.horsepower_original) /
                                                                engineDetails?.horsepower_original * 100) }}%</span>
                                                    </div>
                                                </div>
                                                <div class="space-y-3">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm text-gray-400">Stock</span>
                                                        <span class="text-2xl font-bold text-gray-300">{{
                                                            engineDetails?.horsepower_original }}<span
                                                                class="text-sm">hp</span></span>
                                                    </div>
                                                    <div class="w-full bg-white/10 rounded-full h-2">
                                                        <div class="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                                                            :style="{ width: `${(engineDetails?.horsepower_original / engineDetails?.horsepower_white) * 100}%` }" />
                                                    </div>
                                                    <div class="flex justify-between items-center mt-4">
                                                        <span class="text-sm text-gray-400">Tuned</span>
                                                        <span class="text-2xl font-bold text-white">{{
                                                            engineDetails?.horsepower_white }}<span
                                                                class="text-sm">hp</span></span>
                                                    </div>
                                                    <div class="w-full bg-white/10 rounded-full h-2">
                                                        <div class="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                                                            style="width:100%" />
                                                    </div>
                                                    <div class="mt-4 pt-4 border-t border-white/10 text-center">
                                                        <span class="text-lg text-red-400 font-bold">+{{
                                                            engineDetails?.horsepower_white -
                                                            engineDetails?.horsepower_original }}hp gain</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Torque -->
                                            <div
                                                class="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
                                                <div class="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 class="text-lg font-bold text-white mb-1">Engine Torque</h3>
                                                        <p class="text-xs text-gray-400">Performance Increase</p>
                                                    </div>
                                                    <div
                                                        class="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                                                        <span class="text-xl font-bold">{{
                                                            Math.round((engineDetails?.torque_white -
                                                                engineDetails?.torque_original) /
                                                                engineDetails?.torque_original * 100) }}%</span>
                                                    </div>
                                                </div>
                                                <div class="space-y-3">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm text-gray-400">Stock</span>
                                                        <span class="text-2xl font-bold text-gray-300">{{
                                                            engineDetails?.torque_original }}<span
                                                                class="text-sm">Nm</span></span>
                                                    </div>
                                                    <div class="w-full bg-white/10 rounded-full h-2">
                                                        <div class="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                                                            :style="{ width: `${(engineDetails?.torque_original / engineDetails?.torque_white) * 100}%` }" />
                                                    </div>
                                                    <div class="flex justify-between items-center mt-4">
                                                        <span class="text-sm text-gray-400">Tuned</span>
                                                        <span class="text-2xl font-bold text-white">{{
                                                            engineDetails?.torque_white }}<span
                                                                class="text-sm">Nm</span></span>
                                                    </div>
                                                    <div class="w-full bg-white/10 rounded-full h-2">
                                                        <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                                            style="width:100%" />
                                                    </div>
                                                    <div class="mt-4 pt-4 border-t border-white/10 text-center">
                                                        <span class="text-lg text-blue-400 font-bold">+{{
                                                            engineDetails?.torque_white - engineDetails?.torque_original
                                                        }}Nm gain</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="engineDetails?.options?.length"
                                            class="mt-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                            <h4 class="text-sm font-semibold text-white mb-3">Available Tuning Options
                                            </h4>
                                            <div class="flex flex-wrap gap-2">
                                                <span v-for="option in engineDetails.options" :key="option"
                                                    class="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-medium">
                                                    {{ formatOption(option) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ══════════════════════════════════════════════ -->
                <!-- Customer Information                           -->
                <!-- ══════════════════════════════════════════════ -->
                <div class="bg-white rounded-lg shadow-xl p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Customer Information</h3>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label for="customerName" class="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name <span class="text-red-500">*</span>
                            </label>
                            <input id="customerName" v-model="formData.customerName" type="text"
                                placeholder="Enter customer name"
                                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                :class="errors.customerName ? 'border-red-500' : 'border-gray-300'" />
                            <p v-if="errors.customerName" class="mt-1 text-xs text-red-500">{{ errors.customerName }}
                            </p>
                        </div>

                        <div>
                            <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-2">
                                Customer Email <span class="text-red-500">*</span>
                            </label>
                            <input id="customerEmail" v-model="formData.customerEmail" type="email"
                                placeholder="customer@example.com"
                                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                :class="errors.customerEmail ? 'border-red-500' : 'border-gray-300'" />
                            <p v-if="errors.customerEmail" class="mt-1 text-xs text-red-500">{{ errors.customerEmail }}
                            </p>
                        </div>

                        <div>
                            <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-2">Customer
                                Phone</label>
                            <input id="customerPhone" v-model="formData.customerPhone" type="tel"
                                placeholder="+44 20 1234 5678"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Date <span class="text-red-500">*</span>
                                </label>
                                <el-date-picker v-model="formData.scheduledDate" type="date" placeholder="Select date"
                                    format="DD/MM/YYYY" value-format="YYYY-MM-DD" :clearable="false"
                                    class="!w-full custom-date-picker" style="min-height:48px"
                                    :class="errors.scheduled_at ? 'date-picker-error' : ''"
                                    popper-class="custom-date-popper" @change="mergeDateTime" />
                                <p v-if="errors.scheduled_at && !formData.scheduledDate"
                                    class="mt-1 text-xs text-red-500">
                                    Date is required
                                </p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Time <span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.scheduledTime" type="time"
                                    class="px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    :class="errors.scheduled_at && !formData.scheduled_at ? 'border-red-500' : 'border-gray-300'"
                                    @change="mergeDateTime" />
                                <p v-if="errors.scheduled_at && !formData.scheduled_at"
                                    class="mt-1 text-xs text-red-500">
                                    Time is required
                                </p>
                                <p v-if="errors.scheduled_at && formData.scheduled_at"
                                    class="mt-1 text-xs text-red-500">
                                    {{ errors.scheduled_at }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Staff <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.user_id"
                                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                :class="errors.user_id && !formData.user_id ? 'border-red-500' : 'border-gray-300'">
                                <option v-for="staff in availableStaff" :key="staff.id" :value="staff.id">{{ staff.name
                                    }}
                                </option>
                            </select>

                            <p v-if="errors.user_id && !formData.user_id" class="mt-1 text-xs text-red-500">
                                Staff is required
                            </p>
                            <p v-if="errors.user_id && formData.user_id" class="mt-1 text-xs text-red-500">
                                {{ errors.user_id }}
                            </p>
                        </div>

                        <div>
                            <label for="jobPostcode" class="block text-sm font-medium text-gray-700 mb-2">
                                Job Postcode <span class="text-red-500">*</span>
                            </label>
                            <input id="jobPostcode" v-model="formData.jobPostcode" type="text"
                                placeholder="e.g. SW1A 1AA"
                                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                                :class="errors.jobPostcode ? 'border-red-500' : 'border-gray-300'" />
                            <p v-if="errors.jobPostcode" class="mt-1 text-xs text-red-500">{{ errors.jobPostcode }}</p>
                        </div>

                        <div>
                            <label for="jobAddress" class="block text-sm font-medium text-gray-700 mb-2">Job
                                Address</label>
                            <input id="jobAddress" v-model="formData.jobAddress" type="text"
                                placeholder="Enter job address"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <template v-if="!isEdit">
                            <div class="flex items-center gap-2">
                                <el-switch v-model="formData.mail_customer" :active-value="true"
                                    :inactive-value="false" />
                                <label class="text-sm font-medium text-gray-700">Mail To Customer</label>
                            </div>

                        </template>
                    </div>
                </div>

                <!-- ══════════════════════════════════════════════ -->
                <!-- Services Table                                 -->
                <!-- ══════════════════════════════════════════════ -->
                <div class="bg-white rounded-lg shadow-xl overflow-hidden">
                    <!-- Table header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <h3 class="text-xl font-semibold text-gray-900">Services</h3>
                            <span class="svc-count-badge">{{ formData.services.length }} {{ formData.services.length ===
                                1 ? 'item' :
                                'items' }}</span>
                        </div>
                        <button type="button" class="svc-add-btn" @click="addServiceRow">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add service
                        </button>
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="svc-table">
                            <colgroup>
                                <col style="width: 22%" />
                                <col style="width: 30%" />
                                <col style="width: 10%" />
                                <col style="width: 14%" />
                                <col style="width: 14%" />
                                <col style="width: 10%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th style="text-align: center !important;">Qty</th>
                                    <th style="text-align: center !important;">Unit price</th>
                                    <th style="text-align: center !important;">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in formData.services" :key="index" class="svc-row">
                                    <td>
                                        <select v-model="item.service_id" class="svc-select"
                                            @change="onServiceChange(item)">
                                            <option value="">Select service</option>
                                            <option v-for="service in availableServices" :key="service.id"
                                                :value="service.id">
                                                {{ service.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <textarea v-model="item.description" rows="1" class="svc-textarea"
                                            placeholder="Optional notes…" @input="autoResize($event)" />
                                    </td>
                                    <td class="text-center">
                                        <input v-model.number="item.qty" type="number" min="1" class="svc-number" />
                                    </td>
                                    <td class="text-center">
                                        <div class="svc-price-wrap">
                                            <span class="svc-currency">£</span>
                                            <input v-model.number="item.price" type="text" min="0"
                                                class="svc-price-input" />
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span class="svc-total-val">
                                            £{{ ((item.qty || 0) * (item.price || 0)).toLocaleString('en-GB', {
                                                minimumFractionDigits:
                                                    2, maximumFractionDigits: 2
                                            }) }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button type="button" class="svc-delete-btn" aria-label="Remove row"
                                            @click="removeServiceRow(index)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                <!-- Empty state -->
                                <tr v-if="formData.services.length === 0">
                                    <td colspan="6" class="svc-empty">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        No services added yet. Click "Add service" to get started.
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="svc-grand-label">Grand total</td>
                                    <td class="text-center">
                                        <span class="svc-grand-badge">
                                            £{{ grandTotal.toLocaleString('en-GB', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }) }}
                                        </span>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Submit / Cancel -->
                <div class="flex justify-end gap-4">
                    <button type="button"
                        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200"
                        @click="$emit('cancel')">
                        Cancel
                    </button>
                    <slot name="submit-button" />
                </div>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';

const props = withDefaults(defineProps<{
    formData: any;
    isEdit?: boolean;
    errors: Record<string, string>;
    loadingVehicle: boolean;
    vehicleDetails: any;
    engineDetails: any;
    availableServices: any[];
    availableStaff: any[];
    formatOption: (o: string) => string;
    mergeDateTime: () => void;
}>(), { isEdit: false });

const emit = defineEmits<{
    submit: [];
    cancel: [];
    lookupVehicle: [];
}>();

const addServiceRow = () => {
    props.formData.services.push({ service_id: '', description: '', qty: 1, price: 0 });
};

const removeServiceRow = (index: any) => {
    props.formData.services.splice(index, 1);
};

const autoResize = (event: Event) => {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
};

const grandTotal = computed(() =>
    props.formData.services.reduce(
        (sum: number, item: any) => sum + (item.qty || 0) * (item.price || 0),
        0
    )
);
const onServiceChange = (item: any) => {
    const selected = props.availableServices.find(
        (s: any) => s.id === item.service_id
    );

    if (selected) {
        item.price = Number(selected.price ?? 0); // or selected.price
    } else {
        item.price = 0;
    }
};
</script>

<style>
/* ── Date picker ─────────────────────────────────── */
.custom-date-picker {
    height: 48px !important;
}

.custom-date-picker .el-input__wrapper {
    padding: 0 16px !important;
    border-radius: 8px !important;
    box-shadow: 0 0 0 1px #d1d5db !important;
    transition: all 0.2s ease !important;
}

.custom-date-picker .el-input__wrapper:hover {
    box-shadow: 0 0 0 1px #9ca3af !important;
}

.custom-date-picker .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 2px #3b82f6 !important;
}

.custom-date-picker .el-input__inner {
    height: 46px !important;
    font-size: 14px !important;
}

.date-picker-error .el-input__wrapper {
    box-shadow: 0 0 0 1px #ef4444 !important;
}

.el-date-editor.el-input {
    height: 50px !important;
}

.custom-date-popper {
    border-radius: 12px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .15) !important;
    border: none !important;
}

.custom-date-popper .el-date-picker__header-label {
    font-weight: 600 !important;
    color: #1f2937 !important;
}

.custom-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell {
    background-color: #3b82f6 !important;
    border-radius: 8px !important;
}

.custom-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
    color: white !important;
}

/* ── Services table ──────────────────────────────── */
.svc-count-badge {
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 2px 10px;
}

.svc-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 16px;
    background: #1d4ed8;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
}

.svc-add-btn:hover {
    background: #1e40af;
}

.svc-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.svc-table thead tr {
    background: #f9fafb;
    border-bottom: 1px solid #f3f4f6;
}

.svc-table thead th {
    padding: 11px 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #9ca3af;
    text-align: left;
}

.svc-row {
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.12s;
}

.svc-row:last-child {
    border-bottom: none;
}

.svc-row:hover {
    background: #f9fafb;
}

.svc-table td {
    padding: 10px 16px;
    vertical-align: middle;
    font-size: 13px;
    color: #111827;
}

/* select */
.svc-select {
    width: 100%;
    font-size: 13px;
    color: #111827;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 7px 10px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    cursor: pointer;
}

.svc-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

/* textarea */
.svc-textarea {
    width: 100%;
    font-size: 13px;
    color: #111827;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 7px 10px;
    outline: none;
    resize: none;
    overflow: hidden;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    min-height: 36px;
}

.svc-textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

/* qty number input */
.svc-number {
    width: 64px;
    font-size: 13px;
    color: #111827;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 7px 8px;
    outline: none;
    text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.svc-number:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

/* price input with £ prefix */
.svc-price-wrap {
    display: inline-flex;
    align-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.svc-price-wrap:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.svc-currency {
    padding: 0 8px;
    font-size: 13px;
    color: #9ca3af;
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    line-height: 36px;
    user-select: none;
}

.svc-price-input {
    width: 72px;
    font-size: 13px;
    color: #111827;
    border: none;
    outline: none;
    padding: 7px 8px;
    text-align: center;
    background: transparent;
}

/* row total */
.svc-total-val {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    background: #f3f4f6;
    border-radius: 6px;
    padding: 4px 10px;
    min-width: 72px;
    text-align: center;
}

/* delete button */
.svc-delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #fee2e2;
    background: #fff5f5;
    color: #dc2626;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
}

.svc-delete-btn:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

/* empty state */
.svc-empty {
    padding: 40px 16px !important;
    text-align: center;
    font-size: 13px;
    color: #9ca3af;
}

/* footer grand total */
.svc-table tfoot tr {
    background: #f9fafb;
    border-top: 2px solid #f3f4f6;
}

.svc-grand-label {
    padding: 14px 16px !important;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.02em;
}

.svc-grand-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 14px;
    font-weight: 600;
}
</style>