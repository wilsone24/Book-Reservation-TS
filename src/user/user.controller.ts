import createUserAction from "./actions/create.user.action";
import loginUserAction from "./actions/login.user.action";
import readUserAction from "./actions/read.user.action";
import updateUserAction from "./actions/update.user.action";
import disableUserAction from "./actions/disable.user.action";
import { UserType } from "./user.model";
import { CreateUserType, ReadUserType, UpdateUserType } from "./user.types";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

async function createUser(userData: CreateUserType): Promise<UserType> {
  try {
    const user = await createUserAction(userData);
    return user;
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: UserType }> {
  try {
    const user = await loginUserAction({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordValid = await argon2.verify(user.password, password);

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

async function readUser(email: ReadUserType): Promise<UserType> {
  try {
    const user = await readUserAction(email);
    return user;
  } catch (error: any) {
    throw new Error(error?.message || "Error reading user");
  }
}

async function updateUser(
  user_id: string,
  data: UpdateUserType
): Promise<UserType> {
  try {
    if (data.password) data.password = await argon2.hash(data.password);
    const user = await updateUserAction(user_id, data);
    return user;
  } catch (error: any) {
    throw new Error(error?.message || "Error updating user");
  }
}

async function disableUser(targetUserId: string): Promise<void> {
  try {
    await disableUserAction(targetUserId);
  } catch (error: any) {
    throw new Error(`Error disabling user: ${error.message}`);
  }
}

export { createUser, loginUser, readUser, updateUser, disableUser };
