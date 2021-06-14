export class User {
    _id?: string;
    
    constructor(
        public email?: string,
        public password?: string,
        public firstname?: string,
        public lastname?: string,        
        public birthdate?: Date,
        public avatar?: File,
        public groups?: string[]
    ) {

    }
}
