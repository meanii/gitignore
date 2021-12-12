import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export class Permissions {
  isAllow: boolean = false
  canGoToRoute(allow: boolean): void {
    this.isAllow = allow
  }
}


@Injectable({
  providedIn: 'root'
})
export class RouterGaurdGuard implements CanActivate {

  constructor(
    private permissions: Permissions,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.permissions.isAllow){
    this.router.navigate([''])
      return true
    } else {
      return this.permissions.isAllow
    }
  }

}
