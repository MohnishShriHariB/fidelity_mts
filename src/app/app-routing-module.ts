import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { TransferComponent } from './transfer-component/transfer-component';
import { HistoryComponent } from './history-component/history-component'
import { inject } from '@angular/core';
import { AuthService } from './auth-service'
import { ProfileComponent } from './profile-component/profile-component';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isUserLoggedin() ? true : false;
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