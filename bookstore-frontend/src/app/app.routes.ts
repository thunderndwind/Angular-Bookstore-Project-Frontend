import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { AppComponent } from './app.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

export const routes: Routes = [
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
    }
    
];
