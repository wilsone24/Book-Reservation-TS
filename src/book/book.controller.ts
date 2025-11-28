import CreateBookAction from "./actions/create.book.action";
import { BookType } from "./book.model";
import { CreateBookType } from "./book.types";

async function createBook(bookData: CreateBookType): Promise<BookType> {
  try {
    if (!bookData) {
      throw new Error("Book data is required");
    }

    return await CreateBookAction(bookData);
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error(
      `Error creating book: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export { createBook };
