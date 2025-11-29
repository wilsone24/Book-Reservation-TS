import { Router, Request, Response } from "express";
import { createBook, readOneBook } from "./book.controller";
import { CreateBookType, BookQueryType } from "./book.types";
import { BookCreateAuthMiddleware } from "../middlewares/auth";

const bookRoutes = Router();

async function CreateBook(
  request: Request<any, any, CreateBookType>,
  response: Response
) {
  try {
    const book = await createBook(request.body);

    response.status(200).json({
      message: "Success.",
      book: book,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function SearchBooks(
  request: Request<any, any, any, BookQueryType>,
  response: Response
) {
  try {
    let results;
    if (request.query._id) {
      results = await readOneBook(request.query._id);
    } else {
      results = await readBooks(request.query);
    }

    response.status(230).json({
      message: "Query results.",
      results: results,
    });
  } catch (error) {
    response.status(401).json({
      message: "Invalid query.",
    });
  }
}

bookRoutes.post("/create", BookCreateAuthMiddleware, CreateBook);
bookRoutes.get("/search", SearchBooks);

export default bookRoutes;
