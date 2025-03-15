import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
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
  uploadProgress: number | null = null;

  // Form data
  showForm: boolean = false;
  isEditing: boolean = false;
  currentBookId: string | null = null;
  bookTitle: string = '';
  bookPrice: number | null = null;
  bookAuthors: string = '';
  bookDescription: string = '';
  bookStock: number = 0;
  selectedFile: File | null = null;
  bookImageUrl: string = '';

  constructor(private adminService: AdminService) { }

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
    this.bookAuthors = book.authors ? book.authors.join(', ') : '';
    this.bookDescription = book.description || '';
    this.bookStock = book.stock || 0;
    this.bookImageUrl = book.img || '';
    this.currentBookId = book._id;
    this.showForm = true;
    this.isEditing = true;
  }

  resetForm() {
    this.bookTitle = '';
    this.bookPrice = null;
    this.bookAuthors = '';
    this.bookDescription = '';
    this.bookStock = 0;
    this.selectedFile = null;
    this.bookImageUrl = '';
    this.currentBookId = null;
    this.error = null;
    this.uploadProgress = null;
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  saveBook() {
    if (!this.bookTitle || this.bookPrice === null) {
      this.error = 'Title and price are required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Parse authors from comma-separated string to array
    const authorsArray = this.bookAuthors
      ? this.bookAuthors.split(',').map(author => author.trim())
      : [];

    // Create book data object
    const bookData: any = {
      title: this.bookTitle,
      price: this.bookPrice,
      authors: JSON.stringify(authorsArray),
      description: this.bookDescription,
      stock: this.bookStock
    };

    // Add image if selected
    if (this.selectedFile) {
      bookData.image = this.selectedFile;
    } else if (this.bookImageUrl && this.isEditing) {
      bookData.img = this.bookImageUrl;
    }

    if (this.isEditing && this.currentBookId) {
      // Update existing book
      this.adminService.updateBook(this.currentBookId, bookData).subscribe({
        next: (response) => {
          if (response.error) {
            this.error = response.message || 'Failed to update book';
            this.isLoading = false;
          } else {
            this.loadBooks();
            this.showForm = false;
            this.resetForm();
          }
        },
        error: (err) => {
          this.error = 'Failed to update book';
          console.error('Error updating book:', err);
          this.isLoading = false;
        }
      });
    } else {
      // Add new book
      this.adminService.addBook(bookData).subscribe({
        next: (response) => {
          if (response.error) {
            this.error = response.message || 'Failed to add book';
            this.isLoading = false;
          } else {
            this.loadBooks();
            this.showForm = false;
            this.resetForm();
          }
        },
        error: (err) => {
          this.error = 'Failed to add book';
          console.error('Error adding book:', err);
          this.isLoading = false;
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