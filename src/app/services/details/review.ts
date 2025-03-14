export interface Review {
    _id?: string;
    name?: string;
    comment: string;
    rating: number;
    book?: string;
    user?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
