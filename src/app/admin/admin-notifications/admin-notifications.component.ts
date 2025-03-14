import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent implements OnInit {
  userNotificationForm: FormGroup;
  systemMessageForm: FormGroup;

  isLoading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  notificationTypes = ['order', 'stock', 'system', 'inventory'];
  systemMessageTypes = ['maintenance', 'alert', 'info'];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.userNotificationForm = this.fb.group({
      userId: ['', Validators.required],
      message: ['', Validators.required],
      type: ['order', Validators.required],
      priority: ['normal'],
      action: [''],
      url: ['']
    });

    this.systemMessageForm = this.fb.group({
      message: ['', Validators.required],
      type: ['info', Validators.required],
      duration: [3600, [Validators.required, Validators.min(60)]],
      targetRoles: this.fb.group({
        customer: [true],
        admin: [false]
      })
    });
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  sendUserNotification(): void {
    if (this.userNotificationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = null;

    const formValue = this.userNotificationForm.value;

    // Prepare metadata
    const metadata: any = {};
    if (formValue.priority) metadata.priority = formValue.priority;
    if (formValue.action) metadata.action = formValue.action;
    if (formValue.url) metadata.url = formValue.url;

    const notificationData = {
      userId: formValue.userId,
      message: formValue.message,
      type: formValue.type,
      metadata
    };

    this.adminService.sendAdminNotification(notificationData).subscribe({
      next: (response) => {
        this.success = 'Notification sent successfully';
        this.isLoading = false;
        this.userNotificationForm.get('message')?.reset();
      },
      error: (err) => {
        this.error = 'Failed to send notification';
        this.isLoading = false;
        console.error('Error sending notification:', err);
      }
    });
  }

  broadcastSystemMessage(): void {
    if (this.systemMessageForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = null;

    const formValue = this.systemMessageForm.value;
    const targetRolesGroup = formValue.targetRoles;

    // Convert target roles from form group to array
    const targetRoles: string[] = [];
    if (targetRolesGroup.customer) targetRoles.push('customer');
    if (targetRolesGroup.admin) targetRoles.push('admin');

    const messageData = {
      message: formValue.message,
      type: formValue.type,
      duration: formValue.duration,
      targetRoles: targetRoles.length > 0 ? targetRoles : undefined
    };

    this.adminService.broadcastSystemMessage(messageData).subscribe({
      next: (response) => {
        this.success = 'System message broadcasted successfully';
        this.isLoading = false;
        this.systemMessageForm.get('message')?.reset();
      },
      error: (err) => {
        this.error = 'Failed to broadcast system message';
        this.isLoading = false;
        console.error('Error broadcasting system message:', err);
      }
    });
  }
}