import { UserModel, UserType } from "../user.model";
import { ReadUserType } from "../user.types";

async function readUserAction(email: ReadUserType): Promise<UserType> {
  const results = (await UserModel.findOne({ email: email })) as UserType;
  return results;
}

export default readUserAction;
