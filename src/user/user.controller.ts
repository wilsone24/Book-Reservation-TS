import createUserAction from "./actions/create.user.action";
import readUserAction from "./actions/read.user.action";
import { UserType } from "./user.model";
import { CreateUserType } from "./user.types";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

async function createUser(userData: CreateUserType): Promise<UserType> {
  try {
    const user = await createUserAction(userData);
    return user;
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function readUser(
  email: string,
  password: string
): Promise<{ token: string; user: UserType }> {
  try {
    const user = await readUserAction({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    let passwordValid;

    try {
      passwordValid = await argon2.verify(user.password, password);
    } catch (argonError) {
      const errMsg =
        argonError instanceof Error ? argonError.message : String(argonError);
      throw new Error(`Password verification error: ${errMsg}`);
    }

    if (!passwordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { _id: user._id, permissions: user.permissions },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { token, user };
  } catch (error: any) {
    throw new Error(error?.message || "Error reading user");
  }
}

export { createUser, readUser };
