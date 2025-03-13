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
        path: 'order/user/:id',
        component: OrderHistoryComponent,
        title: 'Order History',
    },
    { path: 'notifications',
        children: [
            { path: 'user/:userId', component: NotificationComponent },
            { path: 'user/:userId/unread-count', component: NotificationComponent },
            { path: '**', component: NotificationComponent }
        ]
    }

];
