<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center min-h-16">
        <!-- Logo/Brand -->
        <div class="shrink-0">
          <router-link to="/" class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <img v-if="generalSettings?.logo" :src="generalSettings.logo" :alt="generalSettings.title || 'Logo'"
              :style="{ width: generalSettings.logo_width + 'px', height: generalSettings.logo_height + 'px' }"
              class="object-contain rounded-lg" />
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-3">
          <router-link to="/"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Home
          </router-link>

          <!-- Show these links only when logged in -->
          <template v-if="isLogged">
            <!-- Staff-only: no admin, only profile and dashboard -->
            <router-link v-if="isStaff" to="/staff/profile"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Profile
            </router-link>

            <!-- Admin/Staff: show only permitted links -->
            <template v-if="canAccessAdmin">
              <router-link v-if="canAccessJobs" to="/admin/jobs"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                Jobs
              </router-link>
              <router-link v-if="canAccessStaffs" to="/admin/staff"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                Staff
              </router-link>
              <router-link v-if="canAccessServices" to="/admin/services"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                Services
              </router-link>
              <router-link v-if="canAccessStaff" to="/admin/user"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                User
              </router-link>
              <router-link v-if="canAccessDashboard" to="/admin/dashboard"
                class="hover:text-white hover:bg-green-600 text-white bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                Dashboard
              </router-link>
            </template>
            <router-link v-if="isStaff" to="/staff/dashboard"
              class="hover:text-white hover:bg-green-600 text-white bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Dashboard
            </router-link>
            <!-- Profile Avatar Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
                <div
                  class="w-14 h-14 rounded-full bg-linear-to-br border-blue-600 border-4 from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <img v-if="user.avatar" :src="user.avatar" class="h-full w-full rounded-full object-cover" alt="">
                  <span v-else>{{ userInitials }}</span>
                </div>
              </button>

              <!-- Dropdown Menu -->
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm text-gray-500">Signed in as</p>
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ user?.email }}</p>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                      {{ user?.role?.name }}
                    </span>
                  </div>

                  <!-- Dropdown Links -->
                  <button @click="openProfileDialog"
                    class="flex items-center w-full border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Update Profile
                  </button>

                  <!-- Update Password Button -->
                  <button @click="openPasswordDialog"
                    class="flex items-center w-full border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Update Password
                  </button>
                  <router-link v-if="user?.role?.name === 'admin'" to="/admin/settings" @click="closeMobileMenu"
                    class="flex items-center w-full border-b border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Settings
                  </router-link>


                  <button @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <!-- Show login button only when not logged in -->
          <router-link v-else to="/login"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Login
          </router-link>
        </div>

        <!-- Mobile Navigation - Right side buttons -->
        <div class="md:hidden flex items-center space-x-2">
          <!-- Login button for mobile (only show when not logged in) -->
          <router-link v-if="!isLogged" to="/login"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Login
          </router-link>

          <!-- Profile Avatar for mobile (only show when logged in) -->
          <button v-if="isLogged" @click="toggleMobileMenu"
            class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow overflow-hidden">
            <img v-if="user.avatar" :src="user.avatar" class="h-full w-full rounded-full object-cover" alt="">
            <span v-else>{{ userInitials }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isMobileMenuOpen" @click="closeMobileMenu" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      </div>
    </transition>

    <!-- Mobile Drawer -->
    <transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
      <div v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto flex flex-col">
        <!-- Drawer Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2 class="text-xl font-bold text-gray-800"> <img v-if="generalSettings?.logo" :src="generalSettings.logo"
              :alt="generalSettings.title || 'Logo'"
              :style="{ width: generalSettings.logo_width + 'px', height: generalSettings.logo_height + 'px' }"
              class="object-contain " /></h2>
          <button @click="closeMobileMenu"
            class="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drawer Content - Scrollable -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- User Info Section (if logged in) -->
          <div v-if="isLogged && userEmail" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold overflow-hidden">
                <img v-if="user.avatar" :src="user.avatar" class="h-full w-full rounded-full object-cover" alt="">
                <span v-else>{{ userInitials }}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-600">Logged in as:</p>
                <p class="text-sm font-semibold text-gray-800 wrap-break-word">{{ userEmail }}</p>
              </div>
            </div>
            <span v-if="isAdmin" class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
              Admin
            </span>
            <span v-else-if="isManager"
              class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
              Manager
            </span>
            <span v-else-if="isStaff"
              class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
              Staff
            </span>
          </div>

          <!-- Navigation Links -->
          <div class="space-y-2">
            <router-link to="/" @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </router-link>

            <!-- Show these links only when logged in -->
            <template v-if="isLogged">
              <!-- Admin/Staff: show only permitted links -->
              <template v-if="canAccessAdmin">
                <router-link v-if="canAccessDashboard" to="/admin/dashboard" @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </router-link>
                <router-link v-if="canAccessJobs" to="/admin/jobs" @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Jobs
                </router-link>
                <router-link v-if="canAccessStaffs" to="/admin/staff" @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Staff
                </router-link>
                <router-link v-if="canAccessServices" to="/admin/services" @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Services
                </router-link>
                <router-link v-if="canAccessStaff" to="/admin/user" @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User
                </router-link>
              </template>

              <!-- Staff-only: Dashboard and Profile -->
              <router-link v-if="isStaff" to="/staff/dashboard" @click="closeMobileMenu"
                class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </router-link>
              <router-link v-if="isStaff" to="/staff/profile" @click="closeMobileMenu"
                class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </router-link>

              <!-- Update Profile Button -->
              <button @click="openProfileDialog"
                class="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Profile
              </button>

              <!-- Update Password Button -->
              <button @click="openPasswordDialog"
                class="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Update Password
              </button>
              <router-link v-if="user?.role?.name === 'admin'" to="/admin/settings" @click="closeMobileMenu"
                class="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Settings
              </router-link>
            </template>
          </div>
        </div>

        <!-- Logout Button - Fixed at Bottom -->
        <div v-if="isLogged" class="shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <button @click="handleLogout"
            class="flex items-center justify-center w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg text-base font-medium transition-colors shadow-md">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </transition>

    <!-- Update Profile Dialog -->
    <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isProfileDialogOpen" @click="closeProfileDialog"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div @click.stop class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Dialog Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800">Update Profile</h3>
            <button @click="closeProfileDialog"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Dialog Content -->
          <form @submit.prevent="handleProfileUpdate" class="p-6 space-y-4">
            <!-- Avatar Preview -->
            <div class="flex justify-center mb-4">
              <div class="relative">
                <div
                  class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-2xl hover:shadow-lg transition-shadow overflow-hidden">
                  <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" class="h-full w-full rounded-full object-cover"
                    alt="Avatar Preview">
                  <span v-else>{{ userInitials }}</span>
                </div>
              </div>
            </div>

            <!-- Name Field -->
            <div>
              <label for="profile-name" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input id="profile-name" v-model="profileForm.name" type="text" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                profileErrors.name ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Enter your full name" @blur="validateProfileName" @input="profileErrors.name = ''" />
              <p v-if="profileErrors.name" class="mt-1 text-sm text-red-600">{{ profileErrors.name }}</p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="profile-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input id="profile-email" v-model="profileForm.email" type="email" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                profileErrors.email ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Enter your email" @blur="validateProfileEmail" @input="profileErrors.email = ''" />
              <p v-if="profileErrors.email" class="mt-1 text-sm text-red-600">{{ profileErrors.email }}</p>
            </div>

            <!-- Phone Field -->
            <div>
              <label for="profile-phone" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input id="profile-phone" v-model="profileForm.phone" type="tel" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                profileErrors.phone ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Enter your phone number" @blur="validateProfilePhone"
                @input="profileErrors.phone = ''" />
              <p v-if="profileErrors.phone" class="mt-1 text-sm text-red-600">{{ profileErrors.phone }}</p>
            </div>

            <!-- Avatar Upload Field -->
            <div>
              <label for="profile-avatar" class="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input id="profile-avatar" ref="avatarInput" @change="updateProfileImage" type="file" accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p class="mt-1 text-xs text-gray-500">Max file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 pt-4">
              <button type="button" @click="closeProfileDialog"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" :disabled="isProfileUpdating"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isProfileUpdating ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Update Password Dialog -->
    <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isPasswordDialogOpen" @click="closePasswordDialog"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div @click.stop class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Dialog Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800">Update Password</h3>
            <button @click="closePasswordDialog"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Dialog Content -->
          <form @submit.prevent="handlePasswordUpdate" class="p-6 space-y-4">
            <!-- Current Password -->
            <div>
              <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">
                Current Password <span class="text-red-500">*</span>
              </label>
              <input id="current-password" v-model="passwordForm.current_password" type="password" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Enter current password" @blur="validatecurrent_password"
                @input="passwordErrors.current_password = ''" />
              <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-red-600">{{
                passwordErrors.current_password
              }}</p>
            </div>

            <!-- New Password -->
            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">
                New Password <span class="text-red-500">*</span>
              </label>
              <input id="new-password" v-model="passwordForm.password" type="password" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                passwordErrors.password ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Enter new password" @blur="validatepassword" @input="passwordErrors.password = ''" />
              <p v-if="passwordErrors.password" class="mt-1 text-sm text-red-600">{{ passwordErrors.password }}</p>
              <p v-else class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password <span class="text-red-500">*</span>
              </label>
              <input id="confirm-password" v-model="passwordForm.password_confirmation" type="password" :class="[
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                passwordErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              ]" placeholder="Confirm new password" @blur="validatePasswordConfirm"
                @input="passwordErrors.password_confirmation = ''" />
              <p v-if="passwordErrors.password_confirmation" class="mt-1 text-sm text-red-600">{{
                passwordErrors.password_confirmation }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 pt-4">
              <button type="button" @click="closePasswordDialog"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" :disabled="isPasswordUpdating"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isPasswordUpdating ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/index';
import { authService, notificationService } from '@/services/_singletons';
import { AxiosError } from 'axios';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const isProfileDialogOpen = ref(false);
const isPasswordDialogOpen = ref(false);
const isProfileUpdating = ref(false);
const isPasswordUpdating = ref(false);

// Avatar handling
const avatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref<string>('');
const avatarInput = ref<HTMLInputElement | null>(null);


// Form data
const profileForm = ref({
  name: '',
  email: '',
  phone: ''
});

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});

// Error states
const profileErrors = ref({
  name: '',
  email: '',
  phone: ''
});

const passwordErrors = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});



// Get data from store
const isLogged = computed(() => appStore.isLogged);
const userEmail = computed(() => appStore.getUserEmail);
const user: any = computed(() => appStore.getUser);
const generalSettings: any = computed(() => appStore.getGeneralSettings);

// Check if user is admin
const isAdmin = computed(() => {
  const userData = user.value as any;
  return userData?.role?.name?.toLowerCase() === 'admin';
});

// Check if user is staff (admin area but permission-based)
// const isStaff = computed(() => {
//   const userData = user.value as any;
//   return userData?.role?.name?.toLowerCase() === 'staff';
// });

// Check if user is mapper (no admin permissions)
const isStaff = computed(() => {
  const userData = user.value as any;
  return userData?.role?.name?.toLowerCase() === 'staff';
});

// Check if user is manager
const isManager = computed(() => {
  const userData = user.value as any;
  return userData?.role?.name?.toLowerCase() === 'manager';
});

// Staff/Manager: show admin nav only if they have the right permission
const canAccessAdmin = computed(() => isAdmin.value || isStaff.value || isManager.value);

const hasPermission = (slug: string): boolean => {
  const userData = user.value as any;
  if (isAdmin.value) return true;
  if (!isStaff.value && !isManager.value) return false;
  const perms = userData?.permissions || [];
  const slugLower = slug.toLowerCase();
  return perms.some((p: any) => {
    const name = (p.name || p.type || p.display_name || '').toString().toLowerCase();
    const category = (p.category || '').toString().toLowerCase();
    
    // Map mapper/staff and user/staff checks properly
    const isMapperSlug = slugLower === 'mapper';
    const isStaffSlug = slugLower === 'staff';
    
    if (isMapperSlug && (category === 'staff' || name.includes('staff'))) return true;
    if (isStaffSlug && (category === 'user' || name.includes('user'))) return true;

    return name.includes(slugLower) || slugLower.includes(name) || category.includes(slugLower) || slugLower.includes(category);
  });
};

const canAccessDashboard = computed(() => {
  if (isAdmin.value) return true;
  if (isStaff.value || isManager.value) {
    const hasExplicit = hasPermission('dashboard');
    if (hasExplicit) return true;
    const perms = (user.value as any)?.permissions || [];
    return perms.length > 0;
  }
  return false;
});
const canAccessJobs = computed(() => isAdmin.value || hasPermission('job'));
const canAccessStaffs = computed(() => isAdmin.value || hasPermission('mapper'));
const canAccessServices = computed(() => isAdmin.value || hasPermission('service'));
const canAccessStaff = computed(() => isAdmin.value || hasPermission('staff'));

// Get user initials for avatar
const userInitials = computed(() => {
  if (!userEmail.value) return 'U';
  const email = userEmail.value as string;
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

// Initialize profile form with user data
const initializeProfileForm = () => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    };
    // Set avatar preview from user's current avatar
    avatarPreviewUrl.value = user.value.avatar || '';
  }
  // Clear errors when initializing
  profileErrors.value = {
    name: '',
    email: '',
    phone: ''
  };
  // Clear avatar file
  avatarFile.value = null;
};

// Profile validation functions
const validateProfileName = () => {
  if (!profileForm.value.name.trim()) {
    profileErrors.value.name = 'Full name is required';
    return false;
  }

  if (profileForm.value.name.trim().length < 2) {
    profileErrors.value.name = 'Full name must be at least 2 characters';
    return false;
  }

  profileErrors.value.name = '';
  return true;
};

const validateProfileEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!profileForm.value.email.trim()) {
    profileErrors.value.email = 'Email is required';
    return false;
  }

  if (!emailRegex.test(profileForm.value.email)) {
    profileErrors.value.email = 'Please enter a valid email address';
    return false;
  }

  profileErrors.value.email = '';
  return true;
};

const validateProfilePhone = () => {
  if (!profileForm.value.phone.trim()) {
    profileErrors.value.phone = 'Phone number is required';
    return false;
  }

  profileErrors.value.phone = '';
  return true;
};

const validateProfileForm = () => {
  const isNameValid = validateProfileName();
  const isEmailValid = validateProfileEmail();
  const isPhoneValid = validateProfilePhone();

  return isNameValid && isEmailValid && isPhoneValid;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openProfileDialog = () => {
  initializeProfileForm();
  isProfileDialogOpen.value = true;
  closeDropdown();
  closeMobileMenu();
};

const closeProfileDialog = () => {
  isProfileDialogOpen.value = false;
  avatarFile.value = null;
  avatarPreviewUrl.value = user.value?.avatar || '';
  // Clear file input
  if (avatarInput.value) {
    avatarInput.value.value = '';
  }
};

const openPasswordDialog = () => {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };
  // Clear errors when opening
  passwordErrors.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };
  isPasswordDialogOpen.value = true;
  closeDropdown();
  closeMobileMenu();
};

const closePasswordDialog = () => {
  isPasswordDialogOpen.value = false;
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };
  // Clear errors when closing
  passwordErrors.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };
};

// Password validation functions
const validatecurrent_password = () => {
  if (!passwordForm.value.current_password) {
    passwordErrors.value.current_password = 'Current password is required';
    return false;
  }

  passwordErrors.value.current_password = '';
  return true;
};

const validatepassword = () => {
  if (!passwordForm.value.password) {
    passwordErrors.value.password = 'New password is required';
    return false;
  }



  passwordErrors.value.password = '';
  return true;
};

const validatePasswordConfirm = () => {
  if (!passwordForm.value.password_confirmation) {
    passwordErrors.value.password_confirmation = 'Please confirm your password';
    return false;
  }

  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    passwordErrors.value.password_confirmation = 'Passwords do not match';
    return false;
  }

  passwordErrors.value.password_confirmation = '';
  return true;
};

const validatePasswordForm = () => {
  const isCurrentValid = validatecurrent_password();
  const isNewValid = validatepassword();
  const isConfirmValid = validatePasswordConfirm();

  return isCurrentValid && isNewValid && isConfirmValid;
};

// Handle profile image upload
const updateProfileImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    notificationService.showError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
    target.value = '';
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    notificationService.showError('File size must be less than 5MB');
    target.value = '';
    return;
  }

  // Store the file object for upload
  avatarFile.value = file;

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreviewUrl.value = e.target?.result as string;
  };
  reader.onerror = () => {
    notificationService.showError('Error reading file. Please try again.');
  };
  reader.readAsDataURL(file);
};

const handleProfileUpdate = async () => {
  // Validate form before submission
  if (!validateProfileForm()) {
    return;
  }

  isProfileUpdating.value = true;

  try {
    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append('name', profileForm.value.name);
    formData.append('email', profileForm.value.email);
    formData.append('phone', profileForm.value.phone);

    // Append avatar file if selected
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    }

    const response: any = await authService.updateProfile(formData);
    appStore.setUser(response.data);

    // Clear avatar file after successful upload
    avatarFile.value = null;

    closeProfileDialog();
    notificationService.showSuccess('Profile updated successfully');
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    }
  } finally {
    isProfileUpdating.value = false;
  }
};

const handlePasswordUpdate = async () => {
  if (!validatePasswordForm()) {
    return;
  }

  isPasswordUpdating.value = true;

  try {
    await authService.updatePassword(passwordForm.value);
    closePasswordDialog();
    notificationService.showSuccess('Password updated successfully');
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    }
  } finally {
    isPasswordUpdating.value = false;
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Close mobile menu and dropdown when route changes
watch(() => route.path, () => {
  closeMobileMenu();
  closeDropdown();
});

const handleLogout = () => {
  // Clear store
  appStore.setLogout();
  appStore.setEmail('');
  appStore.setUser({});

  // Clear localStorage and sessionStorage
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  // Close menus
  closeMobileMenu();
  closeDropdown();

  // Redirect to login
  router.push('/login');
};
</script>