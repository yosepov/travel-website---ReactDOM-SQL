import React, { Component } from "react";
import "./login.css";
import { NavLink } from "react-router-dom";
import { User } from "../../models/user";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { Follow } from "../../models/follow";


interface LoginState {
    users: User[];
    username: string;
    user: User;
    password: string;
    error: string;
    follows: Follow[];


}


export class Login extends Component<any, LoginState>{

    public constructor() {
        super(undefined);
        this.state = {
            users: [],
            user: new User,
            username: "",
            password: "",
            error: "",
            follows: []

        }
    }

    public componentDidMount() {
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => this.setState({ users }))
            .catch(err => alert(err.message));

        fetch("http://localhost:3001/api/follows")
            .then(response => response.json())
            .then(follows => {
                const action = { type: ActionType.addFollow, payload: follows };
                store.dispatch(action);
            }
            )
            .catch(err => alert(err.message));

    }


    public setUsername = (e: any): void => {
        const username = e.target.value;
        this.setState({ username });

    }

    public setPassword = (e: any): void => {
        const password = e.target.value;
        this.setState({ password });
    }



    public loggedIn = (): void => {
        //validation
        const username = this.state.username;
        const password = this.state.password;
        this.state.users.map(u => {
            if (u.username != username || u.password != password) {
                this.setState({ error: "Invalid Password or Username" });
                return;
            } else {
                if (username === "admin") {
                    const action = { type: ActionType.adminPannel, payload: true };
                    store.dispatch(action);
                    this.props.history.push("/home");
                }
                const action = { type: ActionType.loggedIn, payload: u };
                store.dispatch(action);
                this.props.history.push("/home");



            }

        })

    }

    public forgotPassword() {
        alert("too bad, register again");
    }

    public render(): JSX.Element {
        return (
            <div className="login">
                <div className="login-page">
                    <div className="login-box">
                        <form action="">
                            <p>LOGIN</p>
                            <input onChange={this.setUsername} placeholder="username..." type="text" />
                            <br></br>
                            <input onChange={this.setPassword} placeholder="password..." type="password" />
                            <br></br>

                            <button type="button" onClick={this.loggedIn} >Login</button>
                        </form>


                        <NavLink to="/register">don't have an account? register now!</NavLink>
                        <br></br>
                        <NavLink onClick={this.forgotPassword} to="/register">forgot your password?</NavLink>
                    </div>
                </div>
            </div>
        )
    }
}