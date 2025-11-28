import { UserModel, UserType } from "../user.model";
import { UpdateUserType } from "../user.types";

async function updateUserAction(
  user_id: string,
  data: UpdateUserType
): Promise<UserType> {
  const results = (await UserModel.findByIdAndUpdate(user_id, data, {
    new: true,
  })) as UserType;
  if (!results) {
    throw new Error("User Id does not match existing user.");
  }
  return results;
}

export default updateUserAction;
