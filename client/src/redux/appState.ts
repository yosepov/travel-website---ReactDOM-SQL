
import { User } from "../models/user";
import { Vacation } from "../models/vacation";
import { Follow } from "../models/follow";

// מחלקה המכילה את כל המידע הקיים ברמת האפליקציה
export class AppState {
    public vacations: Vacation[] = [];
    public vacation: Vacation | undefined;
    public users: User[] = [];
    public follows: Follow[] = [];
    public follow:  Follow | undefined;
    public loggedUser:  User | undefined;
    public LoggedAdmin:  User | undefined;
}

// הערה: אם רכיב מסוים צריך מידע רק לשימושו האישי
// AppState-אין להגדיר מידע זה ב
// של הרכיב עצמו State-מידע זה יהיה ב

