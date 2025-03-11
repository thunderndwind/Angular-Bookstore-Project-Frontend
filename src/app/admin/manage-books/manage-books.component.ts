import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css'],
})
export class ManageBooksComponent implements OnInit {
  books: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  
  // Form data
  showForm: boolean = false;
  isEditing: boolean = false;
  currentBookId: string | null = null;
  bookTitle: string = '';
  bookPrice: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.adminService.getBooks().subscribe({
      next: (data) => {
        this.books = data.books || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again.';
        this.isLoading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  openAddForm() {
    this.resetForm();
    this.showForm = true;
    this.isEditing = false;
  }

  openEditForm(book: any) {
    this.resetForm();
    this.bookTitle = book.title;
    this.bookPrice = book.price;
    this.currentBookId = book._id;
    this.showForm = true;
    this.isEditing = true;
  }

  resetForm() {
    this.bookTitle = '';
    this.bookPrice = null;
    this.currentBookId = null;
    this.error = null;
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  saveBook() {
    if (!this.bookTitle || this.bookPrice === null) {
      this.error = 'Title and price are required';
      return;
    }

    const bookData = {
      title: this.bookTitle,
      price: this.bookPrice
    };

    this.isLoading = true;

    if (this.isEditing && this.currentBookId) {
      // Update existing book
      this.adminService.updateBook(this.currentBookId, bookData).subscribe({
        next: () => {
          this.loadBooks();
          this.showForm = false;
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Failed to update book';
          this.isLoading = false;
          console.error('Error updating book:', err);
        }
      });
    } else {
      // Add new book
      this.adminService.addBook(bookData).subscribe({
        next: () => {
          this.loadBooks();
          this.showForm = false;
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Failed to add book';
          this.isLoading = false;
          console.error('Error adding book:', err);
        }
      });
    }
  }

  deleteBook(bookId: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.isLoading = true;
      this.adminService.deleteBook(bookId).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (err) => {
          this.error = 'Failed to delete book';
          this.isLoading = false;
          console.error('Error deleting book:', err);
        }
      });
    }
  }
}