import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.css'],
  standalone: true,
  imports: []
})
export class AddToCartButtonComponent {
  @Input() bookId: string = '';
  @Input() stock: number = 0;
  @Input() buttonClass: string = 'btn-primary';
  @Input() showQuantity: boolean = false;

  quantity: number = 1;
  isAdding: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void { }

  incrementQuantity(): void {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.bookId) {
      this.error = 'Invalid book ID';
      return;
    }

    if (this.stock <= 0) {
      this.error = 'This book is out of stock';
      return;
    }

    this.isAdding = true;
    this.error = null;
    this.success = null;

    this.cartService.addToCart(this.bookId, this.quantity).subscribe({
      next: (response) => {
        this.isAdding = false;
        this.success = response.message || 'Added to cart successfully';

        this.quantity = 1;

        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error: (error) => {
        this.isAdding = false;
        this.error = error.error?.message || 'Failed to add to cart';

        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    });
  }
}