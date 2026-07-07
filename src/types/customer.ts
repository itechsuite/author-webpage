export interface CustomerPurchase {
  bookId: string;
  bookTitle: string;
  orderId: string;
  amountTotal: number; // smallest currency unit
  currency: string;
  purchasedAt: string;
}

export interface Customer {
  _id?: string;
  email: string;
  name?: string;
  purchases: CustomerPurchase[];
  createdAt: string;
  updatedAt: string;
}
