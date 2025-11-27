import { NextFunction, Request, Response } from "express";
import { HeaderUserType } from "../user/user.types";
import checkEnabledUserAction from "../user/checkenabled.user.action";
import jwt from "jsonwebtoken";

function decodeJwtValues(request: Request): HeaderUserType | null {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtValues = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as HeaderUserType;

    return jwtValues;
  } catch {
    return null;
  }
}

function checkUserPermission(permission: string) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const user = decodeJwtValues(request);

    if (!user) {
      return response.status(401).json({ message: "Not authorized." });
    }

    if (!(await checkEnabledUserAction(user._id))) {
      return response.status(401).json({ message: "User disabled." });
    }

    const targetUserId = request.params.userId;

    const hasPermission =
      user.permissions[permission] ||
      (targetUserId && user._id === targetUserId);

    if (!hasPermission) {
      return response.status(403).json({ message: "Permission denied." });
    }
    next();
  };
}

export const UserModAuthMiddleware = checkUserPermission("UPDATE-USERS");
