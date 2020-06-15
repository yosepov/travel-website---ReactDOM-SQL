import React, { Component } from "react";
import "./register.css";
import { User } from "../../models/user";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import io from "socket.io-client";

let socket: any;
interface registerState {
    user: User;
    users: User[];
    usernameError: string;
    passwordError: string;
    firstNameError: string;
    lastNameError: string;
}

export class Register extends Component<any, registerState>{


    public constructor(props: any) {
        super(props);
        this.state = {
            user: new User(),
            users: [],
            usernameError: "",
            passwordError: "",
            firstNameError: "",
            lastNameError: ""
        };
    }



    public componentDidMount() {
        socket = io.connect("http://localhost:3007");
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => this.setState({ users }))
            .catch(err => alert(err.message));
    }


    public setFirstName = (e: any): void => {
        const firstName = e.target.value;
        e.target.style.background = "none";
        this.setState({ firstNameError: "" });
        if (firstName.length > 30) {
            this.setState({ firstNameError: "First Name longer than 30 letters" });
            e.target.style.background = "red";
        }

        const user = { ...this.state.user };
        user.firstName = `${firstName}`;
        this.setState({ user });
    }


    public setLastName = (e: any): void => {
        const lastName = e.target.value;
        e.target.style.background = "none";
        this.setState({ lastNameError: "" });
        if (lastName.length > 30) {
            this.setState({ lastNameError: "Last Name longer than 30 letters" });
            e.target.style.background = "red";
        }
        const user = { ...this.state.user };
        user.lastName = `${lastName}`;
        this.setState({ user });
    }


    public setUsername = (e: any): void => {
        const username = e.target.value;
        e.target.style.background = "none";
        this.setState({ usernameError: "" });
        if (username.length > 30) {
            this.setState({ usernameError: "Username longer than 16 letters" });
            e.target.style.background = "red";
        }
        this.state.users.map(user => {
            if (user.username === username) {
                this.setState({ usernameError: "Username already exist" });
                e.target.style.background = "red";
                return false;
            }

        })

        const user = { ...this.state.user };
        user.username = `${username}`;
        socket.emit("user-check", username);
        this.setState({ user });
    }

    public setPassword = (e: any): void => {
        const password = e.target.value;
        e.target.style.background = "none";
        this.setState({ passwordError: "" });
        if (password.length > 16) {
            this.setState({ passwordError: "Password longer than 16 letters" });
            e.target.style.background = "red";
        }
        const user = { ...this.state.user };
        user.password = `${password}`;
        this.setState({ user });
    }




    public addUser = (): void => {
        fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.user)
        })
            .then(response => response.json())
            .then(user => {
                alert("User has been successfully added by: " + user.username);

                const action = { type: ActionType.addUser, payload: user };
                store.dispatch(action);
                this.props.history.push("/login");
            })
            .catch(err => alert(err));
    };


    public render(): JSX.Element {
        return (
            <div className="register">

                <form>
                    <div className="register-box">
                        <input onChange={this.setFirstName} placeholder="first name..." type="text" /><br></br>
                        <span>{this.state.firstNameError}</span>
                        <br></br>
                        <input onChange={this.setLastName} placeholder="last name..." type="text" /><br></br>
                        <span>{this.state.lastNameError}</span>
                        <br></br>
                        <input onChange={this.setUsername} placeholder="username..." type="text" /><br></br>
                        <span>{this.state.usernameError}</span>
                        <br></br>
                        <input onChange={this.setPassword} placeholder="password..." type="password" /><br></br>
                        <span>{this.state.passwordError}</span>
                        <br></br>

                        <button id="registerButton" type="button" disabled={this.state.user.password === "" || this.state.user.username === "" ||
                            this.state.user.firstName === "" || this.state.user.lastName === "" ||
                            this.state.usernameError === "Username already exist" || this.state.passwordError === "Password longer than 16 letters"
                            || this.state.firstNameError === "First Name longer than 30 letters" || this.state.lastNameError === "Last Name longer than 30 letters"
                            || this.state.usernameError === "Username longer than 16 letters"}
                            onClick={this.addUser}>Sign Up!
                    </button>
                    </div>

                </form>
            </div>
        )
    }
}