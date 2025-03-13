import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredBooks: Book[] = [];
  newArrivals: Book[] = [];
  loading = true;
  error: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
    this.loadNewArrivals();
  }

  loadFeaturedBooks(): void {
    this.bookService.getFeaturedBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books;
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
    this.bookService.getNewArrivals().subscribe({
      next: (books) => {
        this.newArrivals = books;
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