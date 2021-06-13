import { Project } from "./Project";
import { User } from "./User";

export interface Timer {
    _id: string;
    description: string;
    taskType: string;
    user: User | string | any;
    startTime: string,
    duration: number,
    project: Project | string | any;
};
