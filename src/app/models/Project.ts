import { Group } from "./Group";
import { User } from "./User";

export interface Project {
    _id: string;
    name: string;
    admin: User | string | any;
    groups: Array<Group> | Array<string> | Array<any> | any;
    created_at?: Date;
    updated_at?: Date;
    close: boolean;
};
