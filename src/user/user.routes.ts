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

async function handleAction(
  response: Response,
  action: () => Promise<any>,
  onSuccess?: (result: any) => object
) {
  try {
    const result = await action();
    response
      .status(200)
      .json(onSuccess ? onSuccess(result) : { message: "Success." });
  } catch (error) {
    response.status(500).json({
      message: "Failure.",
      information: (error as any).toString(),
    });
  }
}

async function CreateUser(
  request: Request<any, any, CreateUserType>,
  response: Response
) {
  handleAction(
    response,
    () => createUser(request.body),
    (user) => ({
      message: "Success.",
      user,
    })
  );
}

async function LoginUser(request: Request, response: Response) {
  const { email, password } = request.body;

  handleAction(
    response,
    () => loginUser(email, password),
    ({ token, user }) => ({
      message: "Success.",
      token,
      user,
    })
  );
}

async function ReadUser(request: Request, response: Response) {
  const { email } = request.body;

  handleAction(
    response,
    () => readUser(email),
    (user) => ({
      message: "Success.",
      user,
    })
  );
}

async function UpdateUser(request: Request, response: Response) {
  const userId = request.params.userId;
  const data = request.body;

  handleAction(
    response,
    () => updateUser(userId, data),
    (user) => ({
      message: "Success.",
      user,
    })
  );
}

async function DisableUser(request: Request, response: Response) {
  const targetUserId = request.params.userId;

  handleAction(response, () => disableUser(targetUserId));
}

userRoutes.post("/create", CreateUser);
userRoutes.post("/login", LoginUser);
userRoutes.post("/read", BookReadAuthMiddleware, ReadUser);
userRoutes.post("/update/:userId", UserModAuthMiddleware, UpdateUser);
userRoutes.post("/disable/:userId", UserDisableAuthMiddleware, DisableUser);

export default userRoutes;
