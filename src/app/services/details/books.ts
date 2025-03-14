import { Review } from './review';

export interface Book {
    _id: string;
    title: string;
    authors: string[];
    price: number;
    description: string;
    stock: number;
    reviews: Review[] ;
    image?: string;
    img?: string;
    images?: string;
    pages: number;
    __v?: number;
    rate: number;
  }

export interface BookResponse {
    book: Book;
    relatedBooks: Book[];
}