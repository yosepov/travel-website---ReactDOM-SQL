import React, { Component } from "react";
import "./adminPannel.css";
import { Vacation } from "../../models/vacation";
import { User } from "../../models/user";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import io from "socket.io-client";
import { Unsubscribe } from "redux";
import axios from "axios";


let socket: any;

interface AdminState {
    vacations: Vacation[];
    vacation: Vacation;
    admin: User | undefined;
    selectedImage: any;
}

export class AdminPannel extends Component<any, AdminState> {

    private unsubscribeStore: Unsubscribe;


    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: [],
            vacation: new Vacation(),
            admin: store.getState().LoggedAdmin,
            selectedImage: null

        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ vacations: store.getState().vacations }));

    }


    public vacationEmit(): void {
        alert("vacation emit");
        socket.emit("admin-made-changes")
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore(); // הפסקת ההאזנה
        if (socket) {
            socket.disconnect();
        }


    }

    public componentDidMount() {
        socket = io.connect("http://localhost:3007");

        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations =>
                this.setState({ vacations }))
            .catch(err => alert(err.message));
    }





    public addVacation = (): void => {
        console.log("push the button")
        const formData = new FormData();
        console.log("form data 1")
        const addedVacation = this.state.vacation
        console.log(addedVacation ? addedVacation : "no aded vacation");
        formData.append("myImage", this.state.selectedImage, this.state.selectedImage.name);
        console.log("image: ", this.state.selectedImage.name);
        formData.append("addedVacation", JSON.stringify(addedVacation));
        axios.post("http://localhost:3001/upload", formData);


        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations => {
                this.setState({ vacations })
                const action = { type: ActionType.addVacation, payload: addedVacation };
                store.dispatch(action);
                this.vacationEmit();

            })
            .catch(err => alert(err.message));


        alert("The new vacation has been succesfully added!");


    };




    public setLocation = (e: any): void => {
        const location = e.target.value;
        const vacation = { ...this.state.vacation };
        vacation.location = `${location}`;
        this.setState({ vacation });
    }

    public setDescription = (e: any): void => {
        const description = e.target.value;
        const vacation = { ...this.state.vacation };
        vacation.description = `${description}`;
        this.setState({ vacation });
    }

    public setStartDate = (e: any): void => {
        const startDate = e.target.value;
        const vacation = { ...this.state.vacation };
        vacation.startDate = startDate;
        this.setState({ vacation });
    }


    public setEndtDate = (e: any): void => {
        const endDate = e.target.value;
        const vacation = { ...this.state.vacation };
        vacation.endDate = endDate;
        this.setState({ vacation });
    }

    public setPrice = (e: any): void => {
        const price = +e.target.value;
        const vacation = { ...this.state.vacation };
        vacation.price = price;
        this.setState({ vacation });
    }

    public setImage = (e: any): void => {
        const image = e.target.value;
        const vacation = { ...this.state.vacation };
        let current = this.getFile(image);
        vacation.image = `${current}`;
        this.setState({ vacation });
        alert(current);

    }

    public getFile = (filePath: any): any => {
        return filePath.substr(filePath.lastIndexOf('\\') + 1).split('.')[0];
    }

    public fileSelect = (e: any) => {
        this.setState({
            selectedImage: e.target.files[0]
        });
    }


    public render(): JSX.Element {
        return (
            <div className="admin-pannel">

                <div className="add-vacation-box">

                    <h2>Add Vacation Now!</h2>
                    <label>Select an Image: </label>
                    <input onChange={this.fileSelect} type="file" accept="image/*" name="myImage" />
                    <br></br>

                    <input className="input" onChange={this.setDescription} type="text" placeholder="description..." autoFocus />
                    <br /><br />

                    <input className="input" onChange={this.setLocation} type="text" placeholder="location..." />
                    <br /><br />

                    <input className="input" onChange={this.setStartDate} type="date" placeholder="start time..." />
                    <br /><br />

                    <input className="input" onChange={this.setEndtDate} type="date" placeholder="end time..." />
                    <br /><br />
                    <br></br>  <br></br>

                    <input className="input" onChange={this.setPrice} type="number" placeholder="price..." />
                    <br /><br />

                    <button id="addVacationButton" onClick={this.addVacation} >Add Vacation</button>

                </div>

                <div className="website-details-box">

                </div>






            </div>
        );
    }
}