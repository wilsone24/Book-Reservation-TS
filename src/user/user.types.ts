import { UserType } from "./user.model";

export type CreateUserType = Omit<UserType, "_id">;
export type HeaderUserType = Pick<UserType, "_id" | "permissions">;
export type ReadUserType = Pick<UserType, "email">;
export type UpdateUserType = Partial<Omit<UserType, "_id">>;