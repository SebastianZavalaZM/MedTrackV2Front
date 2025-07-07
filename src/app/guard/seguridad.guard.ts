import { ActivatedRouteSnapshot,  Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const seguridadGuard= (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
    const lService=inject(LoginService)
    const router=inject(Router)
    const rpta=lService.verificar();
    const allowedRoles = route.data['roles'] || []
    if(!rpta){
      router.navigate(['/login']);
      return false;
    }
  // Si hay roles definidos y el rol del usuario no está incluido
    return rpta;
};
