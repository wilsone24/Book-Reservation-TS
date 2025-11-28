import CreateBookAction from "./actions/create.book.action";
import ReadOneBookAction from "./actions/readone.book.action";
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

async function readOneBook(
  bookId: string
): Promise<{ book: BookType | null; reservationHistory: ReservationType[] }> {
  try {
    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const book = await ReadOneBookAction(bookId);
    if (book?.disabled) {
      return {
        book: null,
        reservationHistory: [],
      };
    }

    const reservationHistory = await ReadReservationsAction({ bookId });

    return {
      book,
      reservationHistory,
    };
  } catch (error) {
    console.error(`Error reading book ${bookId}:`, error);
    throw new Error(
      `Error retrieving book: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export { createBook, readOneBook };
