export interface ContactMessage {
  from: "customer" | "admin";
  body: string;
  createdAt: string;
  adminEmail?: string; // which admin sent this, when from === "admin"
}

export interface ContactThread {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  status: "open" | "closed";
  messages: ContactMessage[];
  createdAt: string;
  updatedAt: string;
}
