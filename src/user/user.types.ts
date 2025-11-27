import { UserType } from "./user.model";

export type CreateUserType = Omit<UserType, "_id">;
export type HeaderUserType = Pick<UserType, "_id" | "permissions">;
