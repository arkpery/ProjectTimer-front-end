import {User} from '../user.model';

export class Team {
    constructor(
        public _id?: string,
        public name?: string,
        public admin?: User | string | any,
        public members?: Array<User> | Array<string> | Array<any> | any,
        public created_at?: Date,
        public updated_at?: Date,
    ) { }
}
