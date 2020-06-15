import React, { Component } from "react";
import "./editVacation.css";
import { Vacation } from "../../models/vacation";
import io from "socket.io-client";



let socket: any;

interface EditVacationState {
    vacation: Vacation;

}


export class EditVacation extends Component<any, EditVacationState>{

    public constructor() {
        super(undefined);
        this.state = {
            vacation: new Vacation

        }
    }




    public setImage = (e: any): void => {
        const val = e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.image = `${val}`;
        this.setState({ vacation });
    }

    public setprice = (e: any): void => {
        const val = +e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.price = val;
        this.setState({ vacation });
    }

    public setLocation = (e: any): void => {
        const val = e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.location = `${val}`;
        let id = +this.props.match.params.vacID;
        vacation.vacationID = id;
        this.setState({ vacation });
    }

    public setDescription = (e: any): void => {
        const val = e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.description = `${val}`;
        this.setState({ vacation });
    }

    public setEndDate = (e: any): void => {
        const val = e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.endDate = `${val}`;
        this.setState({ vacation });
    }

    public setStartDate = (e: any): void => {
        const val = e.target.value;
        let vacation = { ...this.state.vacation };
        vacation.startDate = `${val}`;
        this.setState({ vacation });
    }


    public componentDidMount(): void {
        socket = io.connect("http://localhost:3007");
        let id = +this.props.match.params.vacID
        fetch("http://localhost:3001/api/vacations/" + id)
            .then(response => response.json())
            .then(vacation => this.setState({ vacation }))
    }
    public vacationEmit(): void {
        alert("vacation emit");
        socket.emit("admin-made-changes")
    }




    public componentWillUnmount(): void {
        if (socket) {
            socket.disconnect();
        }


    }

    public updateVacaton = (): void => {
        let id = +this.props.match.params.vacID;
        fetch("http://localhost:3001/api/vacations/" + id, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.vacation)
        })
            .then(response => response.json())
            .then(vacation => {
                alert("Vacation to " + vacation.location + " has been successfully updated.  ");
                this.vacationEmit();
                this.props.history.push("/home");
            })
            .catch(err => alert("error shit"));
    };


    public render(): JSX.Element {
        return (
            <div className="edit-vacation">
                <h2>Edit Vacation !</h2>


                <label >Start Date </label>
                <input onChange={this.setStartDate} value={this.state.vacation.startDate} type="date" />
                <br />
                <label >  End Date </label>
                <input onChange={this.setEndDate} value={this.state.vacation.endDate} type="date" />
                <br />
                <label >Description</label>
                <input onChange={this.setDescription} value={this.state.vacation.description} type="text" />
                <br />
                <label >Location</label>
                <input onChange={this.setLocation} value={this.state.vacation.location} type="text" />
                <br />
                <label >Image</label>
                <input disabled onChange={this.setImage} value={this.state.vacation.image} type="text" />
                <br />
                <label >Price</label>
                <input onChange={this.setprice} value={this.state.vacation.price} type="number" />
                <br /><br />
                <button id="editButton" onClick={this.updateVacaton}> update</button>


            </div>
        )
    }
}