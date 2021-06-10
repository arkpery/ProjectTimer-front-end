import { User } from "./User";

export interface Group {
    _id: string;
    name: string;
    members: Array<User> | Array<string>;
    admin: User | string;
}