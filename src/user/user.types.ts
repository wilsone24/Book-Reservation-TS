import { UserType } from "./user.model";

export type CreateUserType = Omit<UserType, "_id">;
