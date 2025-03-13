import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BookCardComponent, PaginationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'angular-frontend';
  books = [
    {
      title: "The Art of War",
      price: "19.99",
      description: "A classic strategy book by Sun Tzu.",
      image: "/assets/img/The-Art-of-War.jpeg"
    },
    {
      title: "Atomic Habits",
      price: "25.99",
      description: "A guide to building better habits by James Clear.",
      image: "/assets/img/atomic-habits.png"
    },
    {
      title: "Clean Code",
      price: "32.50",
      description: "A book on writing clean and maintainable code by Robert C. Martin.",
      image: "/assets/img/clean-code.jpg"
    },
    {
      title: "The Lean Startup",
      price: "28.00",
      description: "A guide to innovative startups by Eric Ries.",
      image: "/assets/img/lean-startup.jpg"
    },
    {
      title: "Thinking, Fast and Slow",
      price: "22.99",
      description: "Insights into human decision-making by Daniel Kahneman.",
      image: "/assets/img/thinking-fast-and-slow.jpeg"
    },
    {
      title: "Sapiens",
      price: "30.00",
      description: "A brief history of humankind by Yuval Noah Harari.",
      image: "/assets/img/sapiens.jpg"
    },
    {
      title: "Deep Work",
      price: "27.99",
      description: "A book on productivity by Cal Newport.",
      image: "/assets/img/deep-work.jpg"
    },
    {
      title: "Grit",
      price: "24.50",
      description: "A study on perseverance by Angela Duckworth.",
      image: "/assets/img/grit.jpeg"
    },
    {
      title: "Zero to One",
      price: "29.99",
      description: "A startup guide by Peter Thiel.",
      image: "/assets/img/zero-to-one.jpg"
    }
  ];
}
