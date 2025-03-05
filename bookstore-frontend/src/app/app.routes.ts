import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        title: 'Home',
    },
    {
        path: 'user/:id',
        component: UserProfileComponent,
        title: 'User Profiel',
    }
    
];
