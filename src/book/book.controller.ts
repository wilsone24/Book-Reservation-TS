import CreateBookAction from "./actions/create.book.action";
import ReadOneBookAction from "./actions/readone.book.action";
import ReadBooksAction from "./actions/read.book.action";
import UpdateBookAction from "./actions/update.book.action";
import { BookType } from "./book.model";
import { CreateBookType, BookQueryType, UpdateBookType } from "./book.types";

function formatError(context: string, error: unknown): Error {
  const message = error instanceof Error ? error.message : "Unknown error";
  return new Error(`${context}: ${message}`);
}

async function createBook(bookData: CreateBookType): Promise<BookType> {
  try {
    if (!bookData) {
      throw new Error("Book data is required");
    }

    return await CreateBookAction(bookData);
  } catch (error) {
    console.error("Error creating book:", error);
    throw formatError("Error creating book", error);
  }
}

async function readBooks(query: BookQueryType): Promise<BookType[] | BookType> {
  try {
    const finalQuery: BookQueryType = {
      ...query,
      disabled: false,
    };
    if (finalQuery.pubDate) {
      finalQuery.pubDate = new Date(finalQuery.pubDate).toISOString();
    }

    return await ReadBooksAction(finalQuery);
  } catch (error) {
    console.error("Error reading books:", error);
    throw formatError("Error retrieving books", error);
  }
}

async function readOneBook(bookId: string): Promise<BookType | null> {
  try {
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    const book = await ReadOneBookAction(bookId);
    if (book?.disabled) {
      return null;
    }

    return book;
  } catch (error) {
    console.error(`Error reading book ${bookId}:`, error);
    throw formatError("Error retrieving book", error);
  }
}

async function updateBook(
  bookId: string,
  payload: UpdateBookType
): Promise<BookType> {
  try {
    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const bookExists = await ReadOneBookAction(bookId);
    if (!bookExists) {
      throw new Error(`Book with ID ${bookId} does not exist`);
    }

    return await UpdateBookAction(bookId, payload);
  } catch (error) {
    console.error(`Error updating book ${bookId}:`, error);
    throw formatError("Error updating book", error);
  }
}

export { createBook, readBooks, readOneBook, updateBook };
