import { UserModel, UserType } from "../user.model";

async function loginUserAction(query: object): Promise<UserType> {
  const results = (await UserModel.findOne(query)) as UserType;
  return results;
}

export default loginUserAction;
