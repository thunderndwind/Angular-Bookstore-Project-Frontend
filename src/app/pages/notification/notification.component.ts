import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-notification',
  imports: [MatPaginatorModule, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  totalNotifications = 0;
  pageSize = 10;
  currentPage = 1;
  unreadCount = 0;

  constructor(private notificationService: NotificationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
    this.notificationService.notifications$.subscribe((notifications: any[]) => {
      this.notifications = notifications;
    });
  }
  loadNotifications(): void {

    this.notificationService
      .getNotifications(this.currentPage, this.pageSize)
      .subscribe((response: any) => {
        this.notificationService.updateNotifications(response.notifications);
        this.totalNotifications = response.totalNotifications;
      });
  }


  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe((response: any) => {
      this.unreadCount = response.count;
      console.log(this.unreadCount);
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadNotifications();
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      this.unreadCount--;
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications = this.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      this.unreadCount = 0;
    });
  }

  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId).subscribe(() => {
      this.notifications = this.notifications.filter(
        (notification) => notification._id !== notificationId
      );
    });
  }

  deleteAllNotifications(): void {
    this.notificationService.deleteAllNotifications().subscribe(() => {
      this.notifications = [];
    });
  }

}
