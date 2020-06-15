export class User {
    public constructor(
        public userID: number = 0,
        public firstName: string = "",
        public lastName: string = "",
        public username: string = "",
        public password: string = "",
        public loggedIn: boolean = false

    ) {
    }
}