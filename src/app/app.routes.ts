import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageBooksComponent } from './admin/manage-books/manage-books.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { CartComponent } from './pages/cart/cart.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { UserMonitoringComponent } from './admin/user-monitoring/user-monitoring.component';
import { SystemHealthComponent } from './admin/system-health/system-health.component';
import { AdminNotificationsComponent } from './admin/admin-notifications/admin-notifications.component';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    {
        path: 'admin', component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'users', component: ManageUsersComponent },
            { path: 'books', component: ManageBooksComponent },
            { path: 'monitoring', component: UserMonitoringComponent },
            { path: 'system-health', component: SystemHealthComponent },
            { path: 'notifications', component: AdminNotificationsComponent },
        ]
    },
    {
        path: '',
        component: AppComponent,
        title: 'Home',
    },
    {
        path: 'user/:id',
        component: UserProfileComponent,
        title: 'User Profile',
    },
    {
        path: 'order/order-history/:id',
        component: OrderHistoryComponent,
        title: 'Order History',
    },
    { path: 'cart', component: CartComponent },
    { path: '**', component: NotFoundComponent }
];