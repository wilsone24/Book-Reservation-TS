import { Request, Response, Router } from "express";
import { CreateUserType } from "./user.types";
import {
  createUser,
  loginUser,
  readUser,
  updateUser,
  disableUser,
} from "./user.controller";
import {
  BookReadAuthMiddleware,
  UserModAuthMiddleware,
  UserDisableAuthMiddleware,
} from "../middlewares/auth";

const userRoutes = Router();

async function CreateUser(
  request: Request<CreateUserType>,
  response: Response
) {
  try {
    const user = await createUser(request.body);

    response.status(200).json({
      message: "Success.",
      user: user,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function LoginUser(request: Request, response: Response) {
  const { email, password } = request.body;
  try {
    const { token, user } = await loginUser(email, password);

    response.status(200).json({
      message: "Success.",
      token: token,
      user: user,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function ReadUser(request: Request, response: Response) {
  const { email } = request.body;
  try {
    const user = await readUser(email);
    response.status(200).json({
      message: "Success.",
      user: user,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function UpdateUser(request: Request, response: Response) {
  const userId = request.params.userId;
  const data = request.body;
  try {
    const user = await updateUser(userId, data);
    response.status(200).json({
      message: "Success.",
      user: user,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function DisableUser(request: Request, response: Response) {
  const targetUserId = request.params.userId;
  try {
    await disableUser(targetUserId);
    response.status(200).json({
      message: "Success.",
    });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

userRoutes.post("/create", CreateUser);
userRoutes.post("/login", LoginUser);
userRoutes.post("/read", BookReadAuthMiddleware, ReadUser);
userRoutes.post("/update/:userId", UserModAuthMiddleware, UpdateUser);
userRoutes.post("/disable/:userId", UserDisableAuthMiddleware, DisableUser);
export default userRoutes;
