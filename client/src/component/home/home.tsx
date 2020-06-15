import React, { Component } from "react";
import "./home.css";
import { User } from "../../models/user";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { Vacation } from "../../models/vacation";
import { Follow } from "../../models/follow";
import { ActionType } from "../../redux/actionType";
import io from "socket.io-client";


let socket: any;

interface HomeState {
    logged: User | undefined;
    follow: Follow;
    follows: Follow[];
    userFollows: Follow[];
    users: User[];
    vacations: Vacation[];
    userID: number;
    vacationID: number;
    admin: User | undefined;
    vacation: Vacation | undefined;

}



export class Home extends Component<any, HomeState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            logged: store.getState().loggedUser,
            users: store.getState().users,
            vacations: store.getState().vacations,
            vacation: store.getState().vacation,
            follow: new Follow(),
            follows: store.getState().follows,
            userFollows: [],
            userID: 0,
            vacationID: 0,
            admin: store.getState().LoggedAdmin
        }
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                logged: store.getState().loggedUser,
                vacations: store.getState().vacations
            }));
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore(); // הפסקת ההאזנה
        if (socket) {
            socket.disconnect();
        }


    }


    public componentDidMount() {
        if (this.state.logged) {
            socket = io.connect("http://localhost:3007");
            socket.on("admin-made-changes", (vacations: Vacation[]): void => {
                const action = { type: ActionType.GetAllvacations, payload: vacations };
                store.dispatch(action);
            });
        } else {
            this.props.history.push("/login")
        }

        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations =>
                this.setState({ vacations }))
            .catch(err => alert(err.message));


        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users =>
                this.setState({ users }))
            .catch(err => alert(err.message));



        fetch("http://localhost:3001/api/follows")
            .then(response => response.json())
            .then(follows =>
                this.setState({ follows }))
            .catch(err => alert(err.message));


        if (this.state.logged) {
            fetch("http://localhost:3001/api/follows/usersfollows/" + this.state.logged.userID)
                .then(response => response.json())
                .then(userFollows =>
                    this.setState({ userFollows }))
                .catch(err => alert(err.message));



        }

    }

    public editVacation = (e: any): void => {
        const id = +e.target.value;

        this.vacationEmit();
        this.props.history.push("/edit-vacation/" + id);


    }

    public vacationEmit(): void {
        socket.emit("admin-made-changes")
    }


    public deleteVacation = (e: any): void => {
        if (window.confirm("Are you sure you want to delete this Vacation?") === true) {
            let id = +e.target.value;

            alert("vacation deleted");
            fetch("http://localhost:3001/api/vacations/" + id, { method: 'delete' })
                .then(vacation => {
                    const action = { type: ActionType.DeleteVacation, payload: id }
                    store.dispatch(action);
                    this.vacationEmit();

                })
                .catch(err => alert(err));
        }
    }


    public addFollow = (e: any): void => {
        const vacationID = +e.target.value;
        if (this.state.logged) {

            const uID = this.state.logged.userID;


            fetch("http://localhost:3001/api/follows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    userID: uID,
                    vacationID: vacationID
                })
            })
                .then(response => response.json())
                .then(follow => {

                    const action = { type: ActionType.addFollow, payload: follow };
                    store.dispatch(action);
                    this.vacationEmit();
                    this.props.history.push("/my-follows");
                })
                .catch(err => alert(err));
        }


    };



    public removeFollow = (e: any): void => {
        if (window.confirm("Are you sure you want to unfollow this Vacation?") === true) {
            let vacID = +e.target.value;
            if (this.state.logged) {

                let userID = this.state.logged.userID

                fetch(`http://localhost:3001/api/follows/usersfollows/${userID}/${vacID}`, {
                    method: "DELETE"
                });
                const action = { type: ActionType.removeFollow, payload: userID };
                store.dispatch(action);
                this.vacationEmit();

            }


        }
        alert("loading follows - you will redirect to My Follows page in 2 seconds");
        setTimeout(() => {
            this.props.history.push("/my-follows");

        }, 2000);


    };




    public render(): JSX.Element {

        return (
            <div className="home">

                {this.state.vacations.map(v =>




                    <div key={v.vacationID} className={"vacation-card"} >

                        <button value={v.vacationID} onClick={this.editVacation} style={{ display: this.state.admin ? "" : "none" }} >Edit</button>
                        <button value={v.vacationID} onClick={this.deleteVacation} style={{ display: this.state.admin ? "" : "none" }} >X</button>
                        <h2 className="vacation-location">{v.location}</h2>
                        <p className="vacation-date">{v.startDate} till {v.endDate}</p>
                        <img src={"http://localhost:3001/assets/images/" + v.image} width="100%" height="40%" alt="" />
                        <p className="vacation-description">{v.description}</p>
                        <p className="vacation-price">Only {v.price}$ </p>

                        <button className="follow" style={{ display: !this.state.admin ? this.state.logged ? (this.state.userFollows.find(f => f.vacationID === v.vacationID ? true : false) ? "none" : "") : "none" : "none" }} onClick={this.addFollow} value={v.vacationID}>Follow</button>
                        <button className="unfollow" style={{ display: this.state.userFollows.find(f => f.vacationID === v.vacationID ? true : false) ? "" : "none" }} onClick={this.removeFollow} value={v.vacationID}>unfollow</button>


                    </div>

                )}

            </div>
        )
    }
}