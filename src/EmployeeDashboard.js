import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";

class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : null,
            dataIsLoaded : false,
            apiPageLength : 100,
            minApiPage : 1,
            currentApiPage : 1,
            currentDataIndex : 0,
            apiData : {
                previous : null,
                current : null,
                next : null,
            },
            apiData2 : null,
            selectedEmployeeId : null,
            filtersApplied : null,
            maxEmployeeId : null,
            maxApiPage : null,
        };
        this.fetchApiData = this.fetchApiData.bind(this);
        this.handleFetchedApiData = this.handleFetchedApiData.bind(this);
        this.handleFetchedApiData2 = this.handleFetchedApiData2.bind(this);
        this.loadDataIfNeeded = this.loadDataIfNeeded.bind(this);
        this.cycleDataForward = this.cycleDataForward.bind(this);
        this.cycleDataBackward = this.cycleDataBackward.bind(this);
    }

    fetchApiData(pageNum = 1, pageLength = 100) {
        const baseApiUrl = "https://dt-interviews.appspot.com/"
        const searchParams = "?page=" + pageNum + "&per_page=" + pageLength;
        const requestUrl = baseApiUrl + searchParams;

        fetch(requestUrl)
            .then(res => res.json())
            .then(
                result => {
                    this.handleFetchedApiData(result);
                    this.handleFetchedApiData2(result);
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

    handleFetchedApiData2(data) {
        const {apiData2} = this.state;

        console.log("Got apiData2", data);

        if (apiData2 === null) {
            this.setState({
                apiData2 : [data],
            })
        } else {
            this.setState({
                apiData2 : [...apiData2, data],
            })
        }

    }

    handleFetchedApiData(data) {
        // handles one payload of data, loads data into state based on current state
        const { apiData } = this.state;

        console.log("Got apiData", data);

        // case: no api data stored
        if (apiData.current === null && apiData.previous === null && apiData.next === null) {
            apiData.current = data;
            this.setState({
                dataIsLoaded: true,
                apiData : {
                    ...apiData
                }
            })
            console.log("Set current");
        }
        // case: there is some data but no current
        else if (apiData.current === null) {
            apiData.current = data;
            this.setState({
                apiData : {
                    ...apiData
                }
            })
            console.log("Set current");
        }
        else if (apiData.current !== null) {
            // case: there is current api data but no previous or next -> Add next (preload)
            if (apiData.next === null && apiData.previous === null) {
                apiData.next = data;
                this.setState({
                    apiData : {
                        ...apiData
                    }
                })
                console.log("Set next");
            }
            // case: there is current and previous but no next -> add next (cycling forward)
            else if (apiData.next === null && apiData.previous !== null) {
                apiData.next = data;
                this.setState({
                    apiData : {
                        ...apiData
                    }
                })
                console.log("Set next");
            }
            // case: there is current and next but no previous -> add previous (cycling backwards)
            else if (apiData.next !== null && apiData.previous === null) {
                apiData.previous = data;
                this.setState({
                    apiData : {
                        ...apiData
                    }
                })
                console.log("Set previous");
            }
        }
        else {
            // current is undefined
            // this should never happen
            console.error("apiData.current is undefined, apiData:", apiData);
        }
    }
    loadDataIfNeeded() {
        const { apiData, currentApiPage, dataIsLoaded } = this.state;

        // NOTE: has to be a better way to handle this than looking for null. Maybe some additional flags, i.e. currentLoaded, nextLoaded, previousLoaded
        // NOTE: May be a good idea to go back and change the data handling so that it does not delete data. Api Data could simply be an array of objects. and set current based on an index.

        if (apiData.current === null) {
            console.log("Fetch current");
            this.fetchApiData();
        }

        if (dataIsLoaded) {
            if (apiData.next === null) {
                this.fetchApiData(currentApiPage + 1);
                console.log("Fetch next");
            }

            if (apiData.previous === null && currentApiPage > 1) {
                this.fetchApiData(currentApiPage - 1);
                console.log("Fetch prev");
            }
        }

    }
    cycleDataForward() {
        // cycles apiData through state as so:
        //  next -> current; current -> previous; previous -> null
        const { apiData, currentApiPage } = this.state;
        const shallowCopy = {...apiData};

        shallowCopy.current = apiData.next;
        shallowCopy.previous = apiData.current;
        shallowCopy.next = null; // important -> handleFetchedApiData & loadDataIfNeeded look for null values

        this.setState({
            apiData : {
                ...shallowCopy
            },
            currentApiPage : currentApiPage + 1,
        });
        console.log("cycleDataForward");
    }
    cycleDataBackward() {
        // cycles apiData through state as so:
        // previous -> current; current -> next; next -> null
        const  { currentApiPage, minApiPage } = this.state;

        if (currentApiPage > minApiPage) {

            const { apiData } = this.state;
            const shallowCopy = {...apiData};

            shallowCopy.current = apiData.previous;
            shallowCopy.next = apiData.current;
            shallowCopy.previous = null; // important -> handleFetchedApiData & loadDataIfNeeded look for null values

            this.setState({
                apiData : {
                    ...shallowCopy
                },
                currentApiPage : currentApiPage - 1,
            });
            console.log("cycleDataBackward");
        }
    }
    componentDidMount() {
        this.loadDataIfNeeded();
    }
    componentDidUpdate() {
        this.loadDataIfNeeded();
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    render() {
        const { dataIsLoaded, apiData, currentApiPage, apiPageLength } = this.state;

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
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>

                    <p>{"API Page " + currentApiPage}</p>
                    {/* <button type="button" onClick={this.cycleDataBackward}>Previous Page</button>
                    <button type="button" onClick={this.cycleDataForward}>Next Page</button> */}
                    <hr></hr>
                    <EmployeeTableView
                        currentData={apiData.current}
                        apiPageLength ={apiPageLength}
                        cycleDataForward={this.cycleDataForward}
                        cycleDataBackward={this.cycleDataBackward}
                    />
                </div>
            )

        }
    }
}

export default EmployeeDashboard;
