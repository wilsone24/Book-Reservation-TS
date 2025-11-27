import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HeaderUserType } from "../user/user.types";

function verifyToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return response
      .status(401)
      .json({ message: "Missing Authorization header" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (request as any).user = decoded;
    next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}

export { verifyToken };
