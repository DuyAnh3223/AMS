import { useAuthStore } from '../store/auth-store';

export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    return user.roles.some((role) =>
      role.permissions?.some((p) => p.name === permissionName)
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    const cleanRoleName = roleName.toUpperCase().replace(/^ROLE_/, '');
    return user.roles.some((role) => {
      const currentRoleName = role.name.toUpperCase().replace(/^ROLE_/, '');
      return currentRoleName === cleanRoleName;
    });
  };

  return {
    hasPermission,
    hasRole,
    userRole: user && user.roles.length > 0 ? user.roles[0].name.toLowerCase().replace(/^role_/, '') : 'user',
  };
}
