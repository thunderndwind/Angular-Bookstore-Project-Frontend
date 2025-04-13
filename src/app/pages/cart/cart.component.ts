import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class CartComponent {
  cartItems: any[] = [];
  totalAmount: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartItems = response.cartItems;
        this.totalAmount = response.totalAmount;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load cart';
        this.isLoading = false;

        if (error.status === 401) {

          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateQuantity(bookId: string, quantity: number): void {
    if (quantity < 1) return;

    this.cartService.updateCartItem(bookId, quantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to update item';
      }
    });
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(bookId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to remove item';
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.totalAmount = 0;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to clear cart';
      }
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.notificationService.showToast({
        message: 'Your cart is empty',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    const totalPrice = this.cartItems.reduce((sum, item) => sum + item.total, 0);

    this.orderService.createOrder(this.cartItems, totalPrice).subscribe({
      next: (response) => {
        this.notificationService.showToast({
          message: 'Order placed successfully!',
          type: 'success',
          duration: 3000
        });

        // Clear cart after successful order
        this.cartService.clearCart().subscribe({
          next: () => {
            this.cartItems = [];
            this.router.navigate(['/order/user']);
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
          }
        });
      },
      error: (error) => {
        let errorMessage = 'Failed to place order';

        if (error.error?.message?.includes('stock')) {
          errorMessage = error.error.message;
        }

        this.notificationService.showToast({
          message: errorMessage,
          type: 'error',
          duration: 4000
        });
      }
    });
  }
}