import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertType } from '../enum/alert-type.enum';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {


  constructor(private accountService: AccountService, private alertService: AlertService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.isLoggedIn(state.url);
  }

  private isLoggedIn(url: string): boolean {
    if (this.accountService.isLoggedIn) {
      return true;
    }
    this.accountService.redirectUrl = url;
    this.router.navigate(['/login']);
    this.alertService.showAlert('You must be logged in to access this page', AlertType.DANGER);
    return false;
  }



}
