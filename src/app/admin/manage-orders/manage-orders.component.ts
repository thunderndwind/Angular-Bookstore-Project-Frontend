/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
  providers: [DatePipe]
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  isLoading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  
  // Pagination
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  
  // Filters
  filterForm: FormGroup;
  statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  paymentOptions = ['All', 'Credit Card', 'PayPal', 'Cash on Delivery'];
  
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.filterForm = this.fb.group({
      userId: [''],
      status: ['All'],
      paymentMethod: ['All'],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    const filters = this.getFilters();
    
    this.adminService.getOrders({
      page: this.currentPage,
      limit: this.itemsPerPage,
      ...filters
    }).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.filteredOrders = [...this.orders];
        this.totalItems = response.pagination.total;
        this.totalPages = response.pagination.pages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  getFilters(): any {
    const filters: any = {};
    const formValues = this.filterForm.value;
    
    if (formValues.userId) filters.user = formValues.userId;
    if (formValues.status && formValues.status !== 'All') filters.status = formValues.status;
    if (formValues.paymentMethod && formValues.paymentMethod !== 'All') filters.payment_method = formValues.paymentMethod;
    if (formValues.startDate) filters.startDate = this.formatDate(formValues.startDate);
    if (formValues.endDate) filters.endDate = this.formatDate(formValues.endDate);
    
    return filters;
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  resetFilters(): void {
    this.filterForm.reset({
      userId: '',
      status: 'All',
      paymentMethod: 'All',
      startDate: '',
      endDate: ''
    });
    this.currentPage = 1;
    this.loadOrders();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.isLoading = true;
    this.adminService.updateOrder(orderId, { status }).subscribe({
      next: (response) => {
        this.success = 'Order status updated successfully';
        this.loadOrders();
        
        // Update the selected order if it's open
        if (this.selectedOrder && this.selectedOrder._id === orderId) {
          this.selectedOrder.status = status;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to update order status';
        this.isLoading = false;
        console.error('Error updating order status:', err);
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    this.isLoading = true;
    this.adminService.deleteOrder(orderId).subscribe({
      next: (response) => {
        this.success = 'Order deleted successfully';
        this.loadOrders();
        
        // Close the details modal if it's open
        if (this.selectedOrder && this.selectedOrder._id === orderId) {
          this.selectedOrder = null;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete order';
        this.isLoading = false;
        console.error('Error deleting order:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  formatPrice(price: number): string {
    return price ? `$${price.toFixed(2)}` : '$0.00';
  }
}*/