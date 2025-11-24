import createUserAction from "./create.user.action";
import { UserType } from "./user.model";
import { CreateUserType } from "./user.types";

async function createUser(userData: CreateUserType): Promise<UserType> {
  try {
    const user = await createUserAction(userData);

    return user;
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}
export { createUser };
