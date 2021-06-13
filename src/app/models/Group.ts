import { User } from "./User";

export interface Group {
    _id: string;
    name: string;
    members: Array<string> | Array<User> | any,
    admin: User | string | any;
};
