import { Router, Request, Response } from "express";
import {
  createBook,
  readOneBook,
  readBooks,
  updateBook,
  disableBook,
} from "./book.controller";
import { CreateBookType, BookQueryType, UpdateBookType } from "./book.types";
import {
  BookCreateAuthMiddleware,
  BookReadAuthMiddleware,
  BookModAuthMiddleware,
  BookDisableAuthMiddleware,
} from "../middlewares/auth";

const bookRoutes = Router();

function sendError(
  res: Response,
  status: number,
  message: string,
  error?: unknown
) {
  return res.status(status).json({
    message,
    information: error instanceof Error ? error.message : String(error),
  });
}

async function CreateBookHandler(
  req: Request<any, any, CreateBookType>,
  res: Response
) {
  try {
    const createdBook = await createBook(req.body);
    return res.status(200).json({
      message: "Success.",
      book: createdBook,
    });
  } catch (error) {
    return sendError(res, 500, "Failure.", error);
  }
}

async function SearchBooksHandler(
  req: Request<any, any, any, BookQueryType>,
  res: Response
) {
  try {
    const { _id, ...query } = req.query;
    const results = _id ? await readOneBook(_id) : await readBooks(query);

    return res.status(230).json({
      message: "Query results.",
      results,
    });
  } catch (error) {
    return sendError(res, 401, "Invalid query.", error);
  }
}

async function UpdateBookHandler(
  req: Request<{ bookId: string }, any, UpdateBookType>,
  res: Response
) {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    const updatedBook = await updateBook(bookId, updateData);

    return res.status(200).json({
      message: "Success.",
      results: updatedBook,
    });
  } catch (error) {
    return sendError(res, 500, "Failure to update book.", error);
  }
}

async function DisableBookHandler(
  req: Request<{ bookId: string }>,
  res: Response
) {
  try {
    const { bookId } = req.params;

    await disableBook(bookId);

    return res.status(200).json({
      message: "Success.",
    });
  } catch (error) {
    return sendError(res, 500, "Failure to delete/disable book.", error);
  }
}

bookRoutes.post("/create", BookCreateAuthMiddleware, CreateBookHandler);
bookRoutes.get("/search", BookReadAuthMiddleware, SearchBooksHandler);
bookRoutes.put("/update/:bookId", BookModAuthMiddleware, UpdateBookHandler);
bookRoutes.delete(
  "/disable/:bookId",
  BookDisableAuthMiddleware,
  DisableBookHandler
);

export default bookRoutes;
