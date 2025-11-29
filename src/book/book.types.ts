import { BookType } from "./book.model";

export type CreateBookType = Omit<BookType, "_id">;
export type BookQueryType = Partial<
  Omit<BookType, "pubDate"> & { pubDate: string }
>;
