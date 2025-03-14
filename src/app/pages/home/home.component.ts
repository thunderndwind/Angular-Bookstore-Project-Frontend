import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookService } from '../../services/book/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredBooks: any[] = []; // Array to store featured books
  newArrivals: any[] = [];   // Array to store new arrivals
  loading = true;            // Loading state
  error: string | null = null; // Error message

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
    this.loadNewArrivals();
  }

  loadFeaturedBooks(): void {
    this.bookService.getBooks(0, 6).subscribe({ // Fetch first 6 books as featured
      next: (data) => {
        this.featuredBooks = data.books;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load featured books';
        this.loading = false;
        console.error('Error loading featured books:', err);
      }
    });
  }
  
  loadNewArrivals(): void {
    this.bookService.getBooks(0, 6).subscribe({ // Fetch first 6 books as new arrivals
      next: (data) => {
        this.newArrivals = data.books;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load new arrivals';
        this.loading = false;
        console.error('Error loading new arrivals:', err);
      }
    });
  }
}