import { Router, Request, Response } from "express";
import { createBook, readOneBook, readBooks } from "./book.controller";
import { CreateBookType, BookQueryType } from "./book.types";
import {
  BookCreateAuthMiddleware,
  BookReadAuthMiddleware,
} from "../middlewares/auth";

const bookRoutes = Router();

function handleError(
  response: Response,
  status: number,
  message: string,
  error?: unknown
) {
  return response.status(status).json({
    message,
    information: error instanceof Error ? error.message : String(error),
  });
}

async function CreateBookHandler(
  request: Request<any, any, CreateBookType>,
  response: Response
) {
  try {
    const newBook = await createBook(request.body);

    return response.status(200).json({
      message: "Success.",
      book: newBook,
    });
  } catch (error) {
    return handleError(response, 500, "Failure.", error);
  }
}

async function SearchBooksHandler(
  request: Request<any, any, any, BookQueryType>,
  response: Response
) {
  try {
    const { _id, ...query } = request.query;
    const results = _id ? await readOneBook(_id) : await readBooks(query);

    return response.status(230).json({
      message: "Query results.",
      results,
    });
  } catch (error) {
    return handleError(response, 401, "Invalid query.", error);
  }
}

bookRoutes.post("/create", BookCreateAuthMiddleware, CreateBookHandler);
bookRoutes.get("/search", BookReadAuthMiddleware, SearchBooksHandler);

export default bookRoutes;
