import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { TransferComponent } from './transfer-component/transfer-component';
import { HistoryComponent } from './history-component/history-component';
import { ProfileComponent } from './profile-component/profile-component';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth-service'
import { isPlatformBrowser } from '@angular/common';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If we are on the browser, check for login session
  if (isPlatformBrowser(platformId)) {
    if (auth.isUserLoggedin()) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }

  // If we are on the server, ALWAYS ALLOW.
  // This lets the server render the page structure.
  // The client-side guard will run again immediately after and verify the session.
  return true;
};

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'transfer', component: TransferComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }