import { Project } from "../project/Project";
import { User } from "../user/User";

export interface Timer {
    _id?: string,
    description: string,
    taskType: string,
    user: User | string | any,
    startTime: string,
    duration: number,
    project: Project | string | any
};
