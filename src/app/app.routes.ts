import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageBooksComponent } from './admin/manage-books/manage-books.component';
import { HomeComponent } from './pages/home/home.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'admin', component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            //{ path: 'users', component: ManageUsersComponent },
            { path: 'books', component: ManageBooksComponent },
    ]},
    { path: '**', redirectTo: 'not-found' }
];