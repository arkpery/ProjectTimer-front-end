import { Group } from "./Group";

export interface User {
    _id: string;
    email: string;
    password: string;
    groups: Array<Group> | Array<string>;
    avatar: string;
}