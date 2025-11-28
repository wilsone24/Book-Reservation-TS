import { Request, Response, Router } from "express";
import { CreateUserType } from "./user.types";
import { createUser, loginUser, readUser } from "./user.controller";
import { BookReadAuthMiddleware } from "../middlewares/auth";

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

userRoutes.post("/create", CreateUser);
userRoutes.post("/login", LoginUser);
userRoutes.post("/read", BookReadAuthMiddleware, ReadUser);
export default userRoutes;
