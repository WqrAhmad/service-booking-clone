import { computed } from 'vue'
import { useAppStore } from '@/stores/index'

export type PermissionModule = 'job' | 'mapper' | 'service' | 'staff'
export type PermissionAction = 'List' | 'Add' | 'Edit' | 'Delete'

/**
 * Composable for staff add/edit/delete permissions on admin pages.
 * Admin users have all permissions. Staff users are checked against user.permissions.
 * Permission objects from API typically have: name (e.g. "Job"), display_name ("List"|"Add"|"Edit"|"Delete").
 */
export function useStaffPermissions() {
  const appStore = useAppStore()
  const user = computed(() => appStore.getUser as any)

  const isAdmin = computed(() => (user.value?.role?.name ?? '').toString().toLowerCase() === 'admin')
  const isStaff = computed(() => (user.value?.role?.name ?? '').toString().toLowerCase() === 'staff')

  const userPermissions = computed(() => {
    const perms = user.value?.permissions
    return Array.isArray(perms) ? perms : []
  })

  /** Check if the user has a permission for the given module and action */
  function hasPermission(module: PermissionModule, action: PermissionAction): boolean {
    if (isAdmin.value) return true
    if (!isStaff.value) return false

    const perms = userPermissions.value
    const moduleLower = module.toLowerCase()
    const actionLower = action.toLowerCase()

    return perms.some((p: any) => {
      const name = (p.name ?? p.type ?? '').toString().toLowerCase()
      const displayName = (p.display_name ?? '').toString().toLowerCase()
      const moduleMatch = name.includes(moduleLower) || moduleLower.includes(name)
      const actionMatch = displayName === actionLower
      return moduleMatch && actionMatch
    })
  }

  const canList = (module: PermissionModule) => hasPermission(module, 'List')
  const canAdd = (module: PermissionModule) => hasPermission(module, 'Add')
  const canEdit = (module: PermissionModule) => hasPermission(module, 'Edit')
  const canDelete = (module: PermissionModule) => hasPermission(module, 'Delete')

  return {
    isAdmin,
    isStaff,
    canList,
    canAdd,
    canEdit,
    canDelete,
    hasPermission,
  }
}
