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
  featuredBooks: any[] = [];
  newArrivals: any[] = [];
  loading = true;
  error: string | null = null;
  
  featuredCurrentPage = 0;
  featuredTotalPages = 0;
  featuredTotalBooks = 0;
  featuredItemsPerPage = 6;
  
  // Pagination for New Arrivals
  newCurrentPage = 0;
  newTotalPages = 0;
  newTotalBooks = 0;
  newItemsPerPage = 6;

  Math = Math;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
    this.loadNewArrivals();
  }

  loadFeaturedBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.featuredCurrentPage, this.featuredItemsPerPage).subscribe({
      next: (data) => {
        this.featuredBooks = data.books;
        this.featuredTotalBooks = data.total || 0;
        this.featuredTotalPages = Math.ceil(this.featuredTotalBooks / this.featuredItemsPerPage);
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
    this.loading = true;
    this.bookService.getBooks(this.newCurrentPage, this.newItemsPerPage).subscribe({
      next: (data) => {
        this.newArrivals = data.books;
        this.newTotalBooks = data.total || 0;
        this.newTotalPages = Math.ceil(this.newTotalBooks / this.newItemsPerPage);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load new arrivals';
        this.loading = false;
        console.error('Error loading new arrivals:', err);
      }
    });
  }

  goToFeaturedPage(page: number): void {
    if (page >= 0 && page < this.featuredTotalPages) {
      this.featuredCurrentPage = page;
      this.loadFeaturedBooks();
    }
  }

  goToNewPage(page: number): void {
    if (page >= 0 && page < this.newTotalPages) {
      this.newCurrentPage = page;
      this.loadNewArrivals();
    }
  }

  // Helper method to create range of numbers (for pagination)
  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}