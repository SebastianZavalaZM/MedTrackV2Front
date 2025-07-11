import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const lService = inject(LoginService);
  const router = inject(Router);
  const isAuthenticated = lService.verificar();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] || [];
  const userRole = lService.showRole();

  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    router.navigate(['/homes']);
    return false;
  }

  return true;
};
