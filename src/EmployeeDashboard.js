import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";

class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : null,
            api : {
                dataIsLoaded : false,
                pageLength : 25,
                minPage : 1,
                currentPage : 1,
                currentDataIndex : null,
                data : null,
            },
            table : {
                pageLength : 25,
                minPage : 0,
                maxPage : 0,
                currentPage : 0,
                uiPage: 1,
            },
            focusedEmployee : {
                index : null,
                id : null,
            },
            filtersApplied : null,
        };
        this.fetchApiData = this.fetchApiData.bind(this);
        this.handleFetchedApiData = this.handleFetchedApiData.bind(this);
        this.loadDataIfNeeded = this.loadDataIfNeeded.bind(this);
        this.incrementCurrentData = this.incrementCurrentData.bind(this);
        this.decrementCurrentData = this.decrementCurrentData.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    fetchApiData(pageNum = 1, pageLength = 100) {
        // console.log("Fetch Data");
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
                    const { api } = this.state;
                    this.setState({
                        api : {
                            ...api,
                            dataIsLoaded : true,
                            error,
                        }
                    });
                    return error;
                }
            )
    }
    handleFetchedApiData(newData) {
        console.log("Got apiData", newData);
        const { api } = this.state;

        if (api.dataIsLoaded === false) {
            this.setState({
                api : { ...api,
                    data : [newData],
                    dataIsLoaded: true,
                    currentDataIndex: 0,
                },
            })
        } else {
            this.setState({
                api : {
                    ...api,
                    data : [...api.data, newData],
                }
            })
        }
    }
    loadDataIfNeeded() {
        const { api } = this.state;

        if (!api.dataIsLoaded && api.data === null) {
            console.log("fetching first data");
            this.fetchApiData(api.currentPage, api.pageLength);
        }

        if (api.dataIsLoaded && api.currentDataIndex >= api.data.length - 1) {
            console.log("fetching more data, currentPage", api.currentPage);
            this.fetchApiData(api.currentPage +1, api.pageLength);
        }
    }
    incrementCurrentData() {
        const { api } = this.state;
        this.setState({
            api : {
                ...api,
                currentDataIndex : api.currentDataIndex + 1,
                currentPage : api.currentPage + 1,
            }
        });
    }
    decrementCurrentData() {
        const { api } = this.state;
        // never go below 0
        if (api.currentDataIndex > 0) {
            this.setState({
                api : {
                    ...api,
                    currentDataIndex : api.currentDataIndex - 1,
                    currentPage : api.currentPage - 1,
                }
            });
        }
    }
    handleKeyPress(e) {
        const key = e.key.toUpperCase();
        console.log("keypressed", key);
        const { api, focusedEmployee } = this.state;
        const currentData = api.data[api.currentDataIndex];
        let newFocusedEmployeeIndex;

        const logEmployeeIndexAndId = () => {
            console.log("newFocusedEmployeeIndex", newFocusedEmployeeIndex, "focusedEmployeeId", currentData[newFocusedEmployeeIndex].id);
        }
        const setEmployeeIndexAndId = (newFocusedEmployeeIndex) => {
            this.setState({
                focusedEmployee : {
                    ...focusedEmployee,
                    index : newFocusedEmployeeIndex,
                    id : currentData[newFocusedEmployeeIndex].id
                },
            });
        }

        if (focusedEmployee.index === null) {
            if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ENTER") {
                newFocusedEmployeeIndex = 0;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ARROWUP") {
            if (focusedEmployee.index > 0) {
                // Decrement
                newFocusedEmployeeIndex = focusedEmployee.index - 1;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);

            } else if (focusedEmployee.Index <= 0 && api.currentDataIndex > 0) {
                // decrement data and set index to data.length
                this.decrementCurrentData();
                newFocusedEmployeeIndex = currentData.length - 1;
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ARROWDOWN") {
            if (focusedEmployee.index < currentData.length - 1) {
                // increment
                newFocusedEmployeeIndex = focusedEmployee.index + 1;
                logEmployeeIndexAndId();
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            } else {
                // NOTE:  was working on this when I started having the side effects.

                // increment data and reset index to 0
                console.log("incrementData, set focusedEmployeeIndex to 0")
                newFocusedEmployeeIndex = 0;
                logEmployeeIndexAndId();
                this.incrementCurrentData();
                console.log("increment action initiated", currentData[0].id, currentData)
                setEmployeeIndexAndId(newFocusedEmployeeIndex);
            }
        } else if (key === "ENTER") {

        }
    }
    componentDidMount() {
        console.log("EmployeeDashboard componentDidMount");
        this.loadDataIfNeeded();
        document.addEventListener("keydown", this.handleKeyPress );
    }
    componentDidUpdate() {
        console.log("EmployeeDashboard componentDidUpdate");
        this.loadDataIfNeeded();
    }
    componentWillUnmount() {
        console.log("EmployeeDashboard componentWillUnmount");
        document.removeEventListener("keydown", this.handleKeyPress() );
    }
    render() {
        const { api, focusedEmployee  } = this.state;
        if (api.error) {
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>Failed to fetch data... are you sure you are connected to the internet?</p>
                </div>
            )
        }
        else if (api.dataIsLoaded === false) {
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>Loading</p>
                </div>
            )
        }
        else if (api.dataIsLoaded === true) {
            const currentData = api.data[api.currentDataIndex];
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>

                    <p>{"API Page " + api.currentPage}</p>
                    {/* <button type="button" onClick={this.decrementCurrentData}>Previous Page</button>
                    <button type="button" onClick={this.incrementCurrentData}>Next Page</button> */}
                    <hr></hr>
                    {/* <EmployeeTableView
                        currentData={currentData}
                        apiPageLength ={apiPageLength}
                        incrementData={this.incrementCurrentData}
                        decrementData={this.decrementCurrentData}
                        focusedEmployeeId={focusedEmployeeId}
                    /> */}
                </div>
            )

        }
    }
}

export default EmployeeDashboard;
