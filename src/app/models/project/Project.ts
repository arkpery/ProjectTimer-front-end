import { Group } from "../team/Group";
import { User } from "../user/User";

export interface Project {
    _id: string;
    name: string;
    admin: User | string | any;
    groups: Array<Group> | Array<string> | Array<any> | any;
    created_at?: Date;
    updated_at?: Date;
    close: boolean;
};
