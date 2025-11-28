import { Router, Request, Response } from "express";
import { createBook } from "./book.controller";
import { CreateBookType } from "./book.types";
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

bookRoutes.post("/create", BookCreateAuthMiddleware, CreateBook);

export default bookRoutes;
