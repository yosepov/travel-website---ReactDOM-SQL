import React, { Component } from "react";
import "./myfollows.css";
import { User } from "../../models/user";
import { store } from "../../redux/store";
import { Vacation } from "../../models/vacation";
import { Follow } from "../../models/follow";
import { ActionType } from "../../redux/actionType";
import io from "socket.io-client";
import { Unsubscribe } from "redux";

let socket: any;

interface MyFollowsState {
    logged: User | undefined;
    follow: Follow;
    follows: Follow[];
    userFollows: Follow[];
    vacations: Vacation[];
}

export class MyFollows extends Component<any, MyFollowsState>{
    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            logged: store.getState().loggedUser,
            vacations: store.getState().vacations,
            follow: new Follow,
            follows: store.getState().follows,
            userFollows: []
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

    public componentDidMount = (): void => {
        socket = io.connect("http://localhost:3007");
        fetch("http://localhost:3001/api/follows")
            .then(response => response.json())
            .then(follows =>
                this.setState({ follows }))
            .catch(err => alert(err.message));


        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations =>
                this.setState({ vacations }))
            .catch(err => alert(err.message));
        if (this.state.logged) {
            fetch("http://localhost:3001/api/follows/usersfollows/" + this.state.logged.userID)
                .then(response => response.json())
                .then(userFollows =>
                    this.setState({ userFollows }))
                .catch(err => alert(err.message));



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
                    this.props.history.push("/my-follows");
                })
                .catch(err => alert(err));


        }


    };

    public vacationEmit(): void {
        socket.emit("admin-made-changes")
    }


    public removeFollow = (e: any): void => {
        if (window.confirm("Are you sure you want to remove this Vacation?") === true) {
            let vacID = +e.target.value;
            if (this.state.logged) {

                let userID = this.state.logged.userID

                fetch(`http://localhost:3001/api/follows/usersfollows/${userID}/${vacID}`, {
                    method: "DELETE",

                });

                const action = { type: ActionType.removeFollow, payload: userID };
                store.dispatch(action);
                this.vacationEmit();

                alert("loading follows - you will redirect to home page in 2 seconds");
                setTimeout(() => {
                    this.props.history.push("/home");

                }, 2000);



            }

        }


    };





    public render(): JSX.Element {
        return (
            <div className="my-follows">
                <h1>my follows</h1>




                {this.state.vacations.map(v =>




                    <div style={{ display: this.state.userFollows.find(f => f.vacationID === v.vacationID ? true : false) ? "" : "none" }} key={v.vacationID} className={"vacation-card"} >
                        <h2 className="vacation-location">{v.location}</h2>
                        <p className="vacation-date">{v.startDate} till {v.endDate}</p>
                        <img src={"http://localhost:3001/assets/images/" + v.image} width="100%" height="40%" alt="" />
                        <p className="vacation-description">{v.description}</p>
                        <p className="vacation-price">Only {v.price}$ </p>

                        <button className="unfollow" style={{ display: this.state.userFollows.find(f => f.vacationID === v.vacationID ? true : false) ? "" : "none" }} onClick={this.removeFollow} value={v.vacationID}>unfollow</button>
                        <button className="follow" style={{ display: this.state.logged ? (this.state.userFollows.find(f => f.vacationID === v.vacationID ? true : false) ? "none" : "") : "none" }} onClick={this.addFollow} value={v.vacationID}>Follow</button>


                    </div>







                )}



            </div>
        )
    }
}