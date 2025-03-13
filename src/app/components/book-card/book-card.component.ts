import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../services/book.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: Book;
  
  constructor(private router: Router) {}
  
  viewBookDetails(): void {
    this.router.navigate(['/books', this.book.id]);
  }
  
  addToCart(): void {
    // Implement cart functionality here
    console.log('Added to cart:', this.book);
    // You would typically call a cart service here
  }
}