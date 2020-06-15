import React, { Component } from "react";
import "./layout.css";
import { BrowserRouter, Switch, Route, Redirect, NavLink } from "react-router-dom";
import { Home } from "../home/home";
import { Login } from "../login/login";
import { Register } from "../register/register";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { User } from "../../models/user";
import { ActionType } from "../../redux/actionType";
import { AdminPannel } from "../adminPannel/adminPannel";
import { EditVacation } from "../editVcataion/editVacation";
import { MyFollows } from "../myfollows/myfollows";
import io from "socket.io-client";

let socket: any;
interface LayoutState {
    logged: User | undefined;
    admin: User | undefined;
}


export class Layout extends Component<any, LayoutState>{
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            logged: store.getState().loggedUser,
            admin: store.getState().LoggedAdmin
        }
        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ logged: store.getState().loggedUser });
            this.setState({ admin: store.getState().LoggedAdmin })
        }
        );
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore(); // הפסקת ההאזנה
        if (socket) {
            socket.disconnect();
        }


    }




    public loggedOut = (): void => {
        const action = { type: ActionType.loggedOut, payload: undefined };
        store.dispatch(action);
        localStorage.removeItem("admin");
        socket.disconnect();

    }

    public componentDidMount(): void {
        socket = io.connect("http://localhost:3007");
    }


    public render(): JSX.Element {
        return (
            <div className="layout">

                <BrowserRouter>


                    <header>
                        <h1>Travel Go</h1>
                        <nav>
                            <NavLink to="/home">Home</NavLink>
                            <NavLink style={{ display: this.state.logged ? "none" : "" }} to="/Login">Login</NavLink>
                            <NavLink style={{ display: this.state.admin ? "" : "none" }} to="/admin-pannel">Admin Pannel</NavLink>
                            <NavLink style={{ display: (this.state.admin) ? "none" : this.state.logged ? "" : "none" }} to="/my-follows">My-Follows</NavLink>
                            <NavLink onClick={this.loggedOut} style={{ display: this.state.logged ? "" : "none" }} to="/Login">log-Out</NavLink>
                        </nav>
                        <span id="hello-span">hello {this.state.logged ? this.state.logged.username : "Guest"}</span>
                    </header>
                    <hr />

                    <Switch>
                        <Route path="/home" component={Home} exact />
                        <Route path="/login" component={Login} exact />
                        <Route path="/my-follows" component={MyFollows} exact />
                        <Route path="/admin-pannel" component={AdminPannel} exact />
                        <Route path="/edit-vacation/:vacID" component={EditVacation} exact />
                        <Route path="/register" component={Register} exact />
                        <Redirect from="/" to="/home" exact />
                    </Switch>

                </BrowserRouter>
            </div>
        )
    }
}