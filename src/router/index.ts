// router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/home/index.vue';
import Login from '@/views/auth/Login.vue';
// import Register from '@/views/auth/Register.vue';
import RegisterOtp from '@/views/auth/RegisterOtp.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import CodeVerification from '@/views/auth/CodeVerification.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import MapperProfile from '@/views/mapper/Profile.vue';
import MapperDashboard from '@/views/mapper/Dashboard.vue';
import MapperJobDetail from '@/views/mapper/JobDetail.vue';
import AdminDashboard from '@/views/admin/Dashboard.vue';
import AdminSearchMappers from '@/views/admin/SearchMappers.vue';
import AdminCreateJob from '@/views/admin/CreateJob.vue';
import AdminEditJob from '@/views/admin/EditJob.vue';
import AdminDuplicateJob from '@/views/admin/DuplicateJob.vue';
import AdminJobs from '@/views/admin/Jobs.vue';
import AdminJobDetail from '@/views/admin/JobDetail.vue';
import AdminJobSheet from '@/views/admin/JobSheet.vue';
import AdminManageMappers from '@/views/admin/ManageMappers.vue';
import AdminMapperView from '@/views/admin/MapperView.vue';
import AdminMapperEdit from '@/views/admin/MapperEdit.vue';
import AdminMapperAdd from '@/views/admin/MapperAdd.vue';
import AdminPlatformSettings from '@/views/admin/PlatformSettings.vue';
import AdminManageServices from '@/views/admin/ManageServices.vue';
import AdminInvoice from '@/views/admin/Invoice.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import TermsOfService from '@/views/TermsOfService.vue';
import TermsAndConditions from '@/views/TermsAndCondition.vue';
import CookiePolicy from '@/views/CookiePolicy.vue';
import AdminManageStaff from '@/views/admin/ManageStaff.vue';

// Define your routes
const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Home, meta: { public: true } }, // Home is public
    { path: '/login', component: Login, meta: { public: true, guestOnly: true } }, // Only for guests
    // { path: '/register', component: Register, meta: { public: true, guestOnly: true } },
    { path: '/register-otp', component: RegisterOtp, meta: { public: true, guestOnly: true } },
    { path: '/forgot-password', component: ForgotPassword, meta: { public: true, guestOnly: true } },
    { path: '/code-verification', component: CodeVerification, meta: { public: true, guestOnly: true } },
    { path: '/reset-password', component: ResetPassword, meta: { public: true, guestOnly: true } },

    // Policy pages
    { path: '/privacy-policy', component: PrivacyPolicy, meta: { public: true } },
    { path: '/terms-of-service', component: TermsOfService, meta: { public: true } },
    { path: '/terms-conditions', component: TermsAndConditions, meta: { public: true } },
    { path: '/cookie-policy', component: CookiePolicy, meta: { public: true } },

    // Mapper routes (protected)
    { path: '/mapper/profile', component: MapperProfile, meta: { requiresAuth: true } },
    { path: '/mapper/dashboard', component: MapperDashboard, meta: { requiresAuth: true } },
    { path: '/mapper/jobs/:id', component: MapperJobDetail, meta: { requiresAuth: true } },

    // Admin routes (protected)
    { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true } },
    { path: '/admin/search-mappers', component: AdminSearchMappers, meta: { requiresAuth: true } },
    { path: '/admin/create-job', component: AdminCreateJob, meta: { requiresAuth: true } },
    { path: '/admin/edit-job', component: AdminEditJob, meta: { requiresAuth: true } },
    { path: '/admin/duplicate-job', component: AdminDuplicateJob, meta: { requiresAuth: true } },
    { path: '/admin/jobs', component: AdminJobs, meta: { requiresAuth: true } },
    { path: '/admin/jobs/view', component: AdminJobDetail, meta: { requiresAuth: true } },
    { path: '/admin/jobs/job-sheet', component: AdminJobSheet, meta: { requiresAuth: true } },
    { path: '/admin/invoice/:id', component: AdminInvoice, meta: { requiresAuth: true } },
    { path: '/admin/mappers', component: AdminManageMappers, meta: { requiresAuth: true } },
    { path: '/admin/mappers/add', component: AdminMapperAdd, meta: { requiresAuth: true } },
    { path: '/admin/mappers/view', component: AdminMapperView, meta: { requiresAuth: true } },
    { path: '/admin/mappers/edit', component: AdminMapperEdit, meta: { requiresAuth: true } },
    { path: '/admin/services', component: AdminManageServices, meta: { requiresAuth: true } },
    { path: '/admin/staff', component: AdminManageStaff, meta: { requiresAuth: true } },
    { path: '/admin/settings', component: AdminPlatformSettings, meta: { requiresAuth: true } },
    // Public payment page for customers
    { path: '/payment/:id', component: PaymentPage, meta: { public: true } },
];

// Create router
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

// Navigation guard

router.beforeEach((to, from, next) => {
    console.log(from, 'from')
    const authLocal: string | null = localStorage.getItem('token');
    const authSession: string | null = sessionStorage.getItem('token');
    const isAuthenticated = Boolean(authLocal || authSession);

    // Redirect authenticated users away from guest-only pages (login, register, etc.)
    if (isAuthenticated && to.meta.guestOnly) {
        return next('/');
    }

    // Require authentication for protected routes
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    // Allow navigation
    next();
});

export default router;