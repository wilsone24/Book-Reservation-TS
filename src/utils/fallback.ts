import { Request, Response } from "express";

function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

export default routeNotFound;
