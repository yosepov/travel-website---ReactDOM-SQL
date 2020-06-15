import { AppState } from "./appState";
import { AnyAction } from "redux";
import { ActionType } from "./actionType";

export function reducer(oldAppState: AppState | undefined, action: AnyAction): AppState {

    // ריק AppState החזר אובייקט Ever בקריאה הראשונה
    if (!oldAppState) {
        return new AppState();
    }

    // הישן לאחד חדש AppState-עבור כל קריאה אחרת - שכפל את ה
    const newAppState = { ...oldAppState };

    switch (action.type) {

        // אם הבאנו את כל המוצרים מהשרת
        case ActionType.GetAllvacations:
            newAppState.vacations = action.payload;
            break;

        case ActionType.UpdateVacation:
            newAppState.vacation = action.payload;
            break;


        case ActionType.addUser:
            // newAppState.products.push(action.payload); // הוספת המוצר בסוף המערך
            newAppState.users.push(action.payload); // הוספת המוצר בתחילת המערך
            break;


        case ActionType.addVacation:
            // newAppState.products.push(action.payload); // הוספת המוצר בסוף המערך
            newAppState.vacations.push(action.payload); // הוספת המוצר בתחילת המערך
            break;


        case ActionType.addFollow:
            // newAppState.products.push(action.payload); // הוספת המוצר בסוף המערך
            newAppState.follows.push(action.payload); // הוספת המוצר בתחילת המערך
            break;


        case ActionType.loggedIn:
            newAppState.loggedUser = (action.payload);
            break;

        case ActionType.loggedOut:
            // newAppState.products.push(action.payload); // הוספת המוצר בסוף המערך
            newAppState.loggedUser = undefined; // הוספת המוצר בתחילת המערך
            newAppState.LoggedAdmin = undefined; // הוספת המוצר בתחילת המערך
            break;

            case ActionType.DeleteVacation:
                for(let i = 0 ; i < newAppState.vacations.length ; i++){
                    if(newAppState.vacations[i].vacationID === action.payload){
                        newAppState.vacations.splice(i,1);
                        break;
                    }
                }
                break;

                case ActionType.removeFollow:
                    for(let i = 0 ; i < newAppState.follows.length ; i++){
                        if(newAppState.follows[i].userID === action.payload){
                            newAppState.vacations.splice(i,1);
                            break;
                        }
                    }
                    break;


        case ActionType.adminPannel:
            newAppState.LoggedAdmin = (action.payload); // הוספת המוצר בתחילת המערך
            break;
        // מחיקת כל המוצרים כולם
        case ActionType.ClearAllvacations:
            newAppState.vacations = [];
            break;
    }

    return newAppState;
}