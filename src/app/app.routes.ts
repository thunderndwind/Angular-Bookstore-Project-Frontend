import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageBooksComponent } from './admin/manage-books/manage-books.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { adminGuard } from './guards/admin/admin.guard';
import { authGuard } from './guards/auth/auth.guard';
import { userGuard } from './guards/user/user.guard';
import { publicGuard } from './guards/public/public.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { CartComponent } from './pages/cart/cart.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { UserMonitoringComponent } from './admin/user-monitoring/user-monitoring.component';
import { SystemHealthComponent } from './admin/system-health/system-health.component';
import { AdminNotificationsComponent } from './admin/admin-notifications/admin-notifications.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [publicGuard] },
    // User/Guest routes with MainLayoutComponent
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            {
                path: 'notifications',
                canActivate: [authGuard, userGuard],
                children: [
                    { path: 'user/:userId', component: NotificationComponent },
                    { path: 'user/:userId/unread-count', component: NotificationComponent },
                    { path: '**', component: NotificationComponent }
                ]
            },
            { path: 'order/user', component: OrderHistoryComponent, title: 'Order History', canActivate: [authGuard, userGuard] },
            { path: 'details/:id', component: DetailsPageComponent, title: 'Details Page' },
            // { path: 'cart', component: CartComponent, canActivate: [authGuard] },
            { path: 'forbidden', component: ForbiddenComponent, canActivate: [authGuard] },
            { path: 'user', component: UserProfileComponent, title: 'User Profile', canActivate: [authGuard, userGuard] },

        ]
    },

    // Admin routes with AdminLayoutComponent
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'users', component: ManageUsersComponent },
            { path: 'books', component: ManageBooksComponent },
            { path: 'orders', component: ManageOrdersComponent },
            { path: 'monitoring', component: UserMonitoringComponent },
            { path: 'system-health', component: SystemHealthComponent },
            { path: 'notifications', component: AdminNotificationsComponent }
        ]
    },
    { path: '**', component: NotFoundComponent }
];