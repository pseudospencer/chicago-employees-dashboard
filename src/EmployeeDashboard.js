import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";

class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : null,
            dataIsLoaded : false,
            apiPageLength : 500,
            minApiPage : 1,
            currentApiPage : 1,
            apiData : null,
            currentDataIndex: null,
            focusedEmployeeIndex : null,
            focusedEmployeeId : null,
            filtersApplied : null,
            maxEmployeeId : null,
            maxApiPage : null,
        };
        this.fetchApiData = this.fetchApiData.bind(this);
        this.handleFetchedApiData = this.handleFetchedApiData.bind(this);
        this.loadDataIfNeeded = this.loadDataIfNeeded.bind(this);
        this.incrementCurrentData = this.incrementCurrentData.bind(this);
        this.decrementCurrentData = this.decrementCurrentData.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    fetchApiData(pageNum = 1, pageLength = 100) {
        console.log("Fetch Data");
        const baseApiUrl = "https://dt-interviews.appspot.com/"
        const searchParams = "?page=" + pageNum + "&per_page=" + pageLength;
        const requestUrl = baseApiUrl + searchParams;

        fetch(requestUrl)
            .then(res => res.json())
            .then(
                result => {
                    this.handleFetchedApiData(result);
                },
                (error) => {
                    console.log("Error!", error);
                    this.setState({
                        dataIsLoaded : true,
                        error
                    });
                    return error;
                }
            )
    }
    handleFetchedApiData(data) {
        console.log("Got apiData", data);
        const {apiData, dataIsLoaded} = this.state;
        if (dataIsLoaded === false) {
            this.setState({
                apiData : [data],
                dataIsLoaded: true,
                currentDataIndex: 0,
            })
        } else {
            this.setState({
                apiData : [...apiData, data],
            })
        }
    }
    loadDataIfNeeded() {
        const { apiData, dataIsLoaded, currentApiPage, apiPageLength, currentDataIndex } = this.state;

        if (!dataIsLoaded && apiData === null) {
            this.fetchApiData(currentApiPage, apiPageLength);
        }

        if (dataIsLoaded && currentDataIndex >= apiData.length - 1) {
            this.fetchApiData(currentApiPage +1, apiPageLength)
        }

    }
    incrementCurrentData() {
        const { currentDataIndex, currentApiPage } = this.state;
        this.setState({
            currentDataIndex : currentDataIndex + 1,
            currentApiPage : currentApiPage + 1,
        });
    }
    decrementCurrentData() {
        const { currentDataIndex, currentApiPage } = this.state;
        if (currentDataIndex > 0) {
            const { currentDataIndex } = this.state;
            this.setState({
                currentDataIndex : currentDataIndex - 1,
                currentApiPage : currentApiPage - 1,
            });
        }
    }
    handleKeyPress(e) {
        const key = e.key.toUpperCase();
        console.log("keypressed", key);
        const { focusedEmployeeIndex, apiData, currentDataIndex } = this.state;
        const currentData = apiData[currentDataIndex];
        let newFocusedEmployeeIndex;

        const logEmployeeIndexAndId = () => {
            console.log("newFocusedEmployeeIndex", newFocusedEmployeeIndex, "focusedEmployeeId", currentData[newFocusedEmployeeIndex].id);
        }
        const setEmployeeIndexAndId = (newFocusedEmployeeIndex) => {
            this.setState({
                focusedEmployeeIndex: newFocusedEmployeeIndex,
                focusedEmployeeId: currentData[newFocusedEmployeeIndex].id,
            });
        }

        if (focusedEmployeeIndex === null) {
            // Need to create an index.
            if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ENTER") {
                newFocusedEmployeeIndex = 0;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ARROWUP") {
            if (focusedEmployeeIndex > 0) {
                // Decrement
                newFocusedEmployeeIndex = focusedEmployeeIndex - 1;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            } else if (focusedEmployeeIndex <= 0 && currentDataIndex > 0) {
                // decrement data and set index to data.length
                this.decrementCurrentData();
                newFocusedEmployeeIndex = currentData.length;
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ARROWDOWN") {
            if (focusedEmployeeIndex < currentData.length - 1) {
                // increment
                newFocusedEmployeeIndex = focusedEmployeeIndex + 1;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            } else {
                // increment data and, reset index to 0
                this.incrementCurrentData();
                newFocusedEmployeeIndex = 0;
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ENTER") {

        }
    }
    componentDidMount() {
        this.loadDataIfNeeded();
        document.addEventListener("keydown", this.handleKeyPress );
    }
    componentDidUpdate() {
        this.loadDataIfNeeded();
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
        document.removeEventListener("keydown", this.handleKeyPress() );
    }
    render() {
        const { dataIsLoaded, apiData, currentDataIndex, currentApiPage, apiPageLength } = this.state;

        if (this.state.error) {
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>Failed to fetch data... are you sure you are connected to the internet?</p>
                </div>
            )
        }
        else if (dataIsLoaded === false) {
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>Loading</p>
                </div>
            )
        }
        else if (dataIsLoaded === true) {
            const currentData = apiData[currentDataIndex];
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>

                    <p>{"API Page " + currentApiPage}</p>
                    {/* <button type="button" onClick={this.decrementCurrentData}>Previous Page</button>
                    <button type="button" onClick={this.incrementCurrentData}>Next Page</button> */}
                    <hr></hr>
                    <EmployeeTableView
                        currentData={currentData}
                        apiPageLength ={apiPageLength}
                        incrementData={this.incrementCurrentData}
                        decrementData={this.decrementCurrentData}
                    />
                </div>
            )

        }
    }
}

export default EmployeeDashboard;
