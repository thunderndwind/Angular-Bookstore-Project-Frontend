import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageBooksComponent } from './admin/manage-books/manage-books.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    // Add a default route for the empty path
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'admin', component: AdminDashboardComponent, children: [
        { path: 'dashboard', component: ManageBooksComponent },
        //{ path: 'users', component: ManageUsersComponent },
        { path: 'books', component: ManageBooksComponent },
    ]},
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
];