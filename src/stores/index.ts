import type { Pinia } from 'pinia'
import { createPinia, defineStore } from 'pinia'

import type { IGeneralSetting } from '@/model/general-setting.model'

export const useAppStore = defineStore('app', {
  state: () => ({
    logged: false,
    userEmail: '',
    user: {},
    generalSettings: null,
    paymentJob: null as any | null,
    
  }),

  actions: {
    setEmail(payload: any) {
        this.userEmail = payload;
    },
    setGeneralSettings(payload: any) {
      this.generalSettings = payload;
    },
    setPaymentJob(payload: any) {
      this.paymentJob = payload;
    },
    clearPaymentJob() {
      this.paymentJob = null;
    },
    setLogin() {
      this.logged = true
    },
    setLogout() {
      this.logged = false
      this.user = {}
      this.userEmail = ''
    },
    setUser(payload: object) {
      this.user = payload
    },
    syncAuthState() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        this.logged = false
        this.user = {}
        this.userEmail = ''
      }
    },
  },
  getters: {
   
    isLogged(state) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      return state.logged && !!token
    },
    getUser(state) {
      return state.user
    },
    getGeneralSettings(state) {
      return state.generalSettings;
    },
    getUserEmail(state) {
      return state.userEmail
    },
    getPaymentJob(state) {
      return state.paymentJob;
    },

  },
  persist: {
    storage: localStorage,

    // paths: ['layout'],
  },
})

export const useGeneralSettingsStore = defineStore('generalSettings', {
  state: () => ({
    generalSettings: null as IGeneralSetting | null,
    isLoading: false,
  }),

  actions: {
    setGeneralSettings(payload: IGeneralSetting | null) {
      this.generalSettings = payload
      
      // Update document title
      if (payload?.title) {
        document.title = payload.title
      }
      
      // Update favicon
      if (payload?.favicon) {
        this.updateFavicon(payload.favicon)
      }
    },

    updateFavicon(faviconUrl: string) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
      existingFavicons.forEach(link => link.remove())
      
      // Create new favicon link
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      link.href = faviconUrl
      document.head.appendChild(link)
      
      // Also add shortcut icon for older browsers
      const shortcutLink = document.createElement('link')
      shortcutLink.rel = 'shortcut icon'
      shortcutLink.type = 'image/png'
      shortcutLink.href = faviconUrl
      document.head.appendChild(shortcutLink)
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },
  },

  getters: {
    getGeneralSettings: (state) => state.generalSettings,
    getIsLoading: (state) => state.isLoading,
  },

  persist: {
    storage: localStorage,
  },
})


let piniaInstance: Pinia | null = null

const pinia = (): Pinia => {
  if (piniaInstance !== null)
    return piniaInstance

  piniaInstance = createPinia()

  return piniaInstance
}

export default pinia
