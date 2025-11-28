import { NextFunction, Request, Response } from "express";
import { HeaderUserType } from "../user/user.types";
import checkEnabledUserAction from "../user/actions/checkenabled.user.action";
import { decode } from "jsonwebtoken";

function decodeJwtValues(request: Request): HeaderUserType | null {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  return decode(token) as HeaderUserType;
}

async function validateUserPermission(
  request: Request,
  permission: string
): Promise<HeaderUserType> {
  const user = decodeJwtValues(request);
  if (!user) {
    throw { status: 401, message: "Not authorized." };
  }
  const isEnabled = await checkEnabledUserAction(user._id);
  if (!isEnabled) {
    throw { status: 401, message: "User disabled." };
  }
  const targetUserId = request.params.userId;
  const hasPermission =
    user.permissions[permission] || (targetUserId && user._id === targetUserId);
  if (!hasPermission) {
    throw { status: 403, message: "Permission denied." };
  }
  return user;
}

export function RequirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateUserPermission(req, permission);
      next();
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };
}

export const UserModAuthMiddleware = RequirePermission("UPDATE-USERS");
export const UserDisableAuthMiddleware = RequirePermission("DELETE-USERS");
export const BookCreateAuthMiddleware = RequirePermission("CREATE-BOOKS");
export const BookDisableAuthMiddleware = RequirePermission("DELETE-BOOKS");
export const BookReadAuthMiddleware = RequirePermission("READ-USERS");

export async function BookModAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.body.reserved === undefined) {
    return RequirePermission("UPDATE-BOOKS")(req, res, next);
  }
  const user = decodeJwtValues(req);

  if (!user) {
    res.status(401).json({ message: "Not authorized." });
    return;
  }

  req.body._id = user._id;
  next();
}
