import { Group } from "../team/Group";

export interface User {
    _id: string;
    email: string;
    password: string;
    groups: Array<Group> | Array<string> | any; 
    avatar: string;
    firstname: string,
    lastname: string,
    birthdate: string,
    created_at: Date,
    updated_at: Date,
};
