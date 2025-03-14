import { Component, OnInit } from '@angular/core';
import { DetailsServices } from '../../services/details/details.service';
import { Book, BookResponse } from '../../services/details/books';
import { Review } from '../../services/details/review';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart/cart.service';


@Component({
  selector: 'app-details-page',
  imports: [FormsModule],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  bookID!: string;
  book!: Book;
  rBooks: Book[] = [];
  userReview!: Review;
  Math: Math = Math;
  user: any = {
    _id: undefined,
    name: undefined
  };
  addingToCart = false;
  quantity = 1;
  showReviewForm = false;
  errorMessage: string | null = null;

  constructor(
    private apiService: DetailsServices,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private cartService: CartService,

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.bookID = params.get('id')!; 
      this.loadBookDetails();
    });
    this.router.events
    .pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      this.viewportScroller.scrollToPosition([0, 0]); 
    });

    this.loadUserData();
  }

  async loadUserData() {
    const user = await this.apiService.getUser();
    console.log(user);
    if (user) this.user = user;
  }

  async loadBookDetails() {
    try {
      const data = await this.apiService.getDetails(this.bookID).toPromise();

      if (data) {
        this.book = data.book;
        this.rBooks = data.relatedBooks;
        const existingReview = this.book.reviews.find(r => r.user === this.user._id);
        this.userReview = existingReview || { rating: 0, comment: '' };
        console.log(this.userReview);
      } else {
        this.errorMessage = 'No data received from the server.';
      }
    } catch (error) {
      this.errorMessage = 'Error fetching book details. Please try again later.';
      console.error('Error fetching data:', error);
    }
  }

  incrementQty() {
    if (this.quantity < this.book.stock) this.quantity++;
  }

  decrementQty() {
    if (this.quantity > 1) this.quantity--;
  }

  validateQuantity() {
    if (this.quantity > this.book.stock) this.quantity = this.book.stock;
    if (this.quantity < 1) this.quantity = 1;
  }

  submitReview() {
    if (this.userReview._id) {
      console.log(this.bookID, this.userReview._id, this.userReview);
      this.apiService.updateReview(this.bookID, this.userReview._id, this.userReview).subscribe({
        next: (updatedReview) => {
          alert('Review updated');
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error updating review. Please try again.';
          console.error('Error updating review:', error);
        }
      });
    } else {
      this.apiService.createReview(this.bookID, {
        comment: this.userReview.comment,
        rating: this.userReview.rating,
        user: this.user._id
      }).subscribe({
        next: (newReview: Review) => {
          newReview.name = this.user.name;
          this.book.reviews.push(newReview);
          this.userReview = newReview;
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error adding review. Please try again.';
          console.error('Error adding review:', error);
        }
      });
    }
  }

  deleteReview() {
    if (!this.userReview._id) return;

    this.apiService.deleteReview(this.bookID, this.userReview._id).subscribe({
      next: () => {
        alert('Review deleted');
        this.book.reviews = this.book.reviews.filter(r => r._id !== this.userReview._id);
        this.userReview = { rating: 0, comment: '' };
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error deleting review. Please try again.';
        console.error('Error deleting review:', error);
      }
    });
  }

  updateForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  addToCart(): void {
    if(!this.user._id) {
      this.router.navigate(['/login']);
    }

    if (!this.book || !this.book._id) {
      console.error('Cannot add to cart: book ID is missing');
      return;
    }
    
    this.addingToCart = true;
    this.cartService.addToCart(this.book._id, this.quantity).subscribe({
      next: (response) => {
        console.log('Book added to cart:', this.book.title);
        // Add success feedback if desired
        this.addingToCart = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // Handle specific error cases
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        this.addingToCart = false;
      }
    });
  }

  navigateToBook(bookID: string) {
    this.router.navigate([`/details/${bookID}`]);
  }
  shareOnFacebook() {
    try {
      const url = encodeURIComponent(window.location.href);
      const message = encodeURIComponent(`Hello, watch out this book "${this.book.title}" on Celeste website!`);
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
      window.open(facebookUrl, '_blank');
    } catch (error) {
      console.error('Failed to share on Facebook:', error);
      alert('Oops! Something went wrong while trying to share on Facebook. Please try again.'); // Error message
    }
  }
  
  shareOnWhatsApp() {
    try {
      const message = encodeURIComponent(`Hello, watch out this book "${this.book.title}" on Celeste website!`);
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Failed to share on WhatsApp:', error);
      alert('Oops! Something went wrong while trying to share on WhatsApp. Please try again.'); 
    }
  }
  
  shareOnOther() {
    const message = `Hello, watch out this book "${this.book.title}" on Celeste website!`;
    navigator.clipboard.writeText(message)
      .then(() => {
        alert('Message copied to clipboard!');
      }) 
      .catch((error) => {
        console.error('Failed to copy:', error);
        alert('Oops! Failed to copy the message. Please try again or copy it manually.'); 
      });
  
  }
}