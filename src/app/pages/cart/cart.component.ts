import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Router, RouterLink } from '@angular/router';

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
    private router: Router
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
    this.router.navigate(['/checkout']);
  }
}