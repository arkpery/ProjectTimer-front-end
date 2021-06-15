import { Group } from "./Group";

export interface User {
    _id: string;
    email: string;
    password: string;
    groups: Array<Group> | Array<string> | any; 
    avatar: string;
    firstname: string,
    lastname: string,
    birthdate: string,
};
