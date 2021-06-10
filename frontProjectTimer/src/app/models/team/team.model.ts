import {User} from '../user/user.model'

export class Team {
    constructor(
        public name: string,
        public admin: User,
        public members?: User[],
        public created_at?: Date,
        public updated_at?: Date,
    ) { }
}
