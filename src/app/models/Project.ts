import { Group } from "./Group";
import { User } from "./User";

export interface Project {
    _id: string;
    name: string;
    admin: User | string;
    groups: Array<Group> | Array<string>;
    close: boolean
};