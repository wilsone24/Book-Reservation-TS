import { BookModel, BookType } from "../book.model";
import { UpdateBookType } from "../book.types";

async function updateBookAction(
  bookId: string,
  payload: UpdateBookType
): Promise<BookType> {
  const book = (await BookModel.findByIdAndUpdate(bookId, payload, {
    new: true,
  })) as BookType;

  if (!book) {
    throw new Error("The provided bookId does not exist.");
  }

  return book;
}

export default updateBookAction;
