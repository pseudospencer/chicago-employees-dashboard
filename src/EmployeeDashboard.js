import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";

const DEBUG_STATEMENTS = true;

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
        this.loadApiDataIfNeeded = this.loadApiDataIfNeeded.bind(this);
        this.incrementCurrentApiData = this.incrementCurrentApiData.bind(this);
        this.decrementCurrentApiData = this.decrementCurrentApiData.bind(this);

        this.createTableDisplayPagesLookup = this.createTableDisplayPagesLookup.bind(this);
        this.setTablePageAndUiPage = this.setTablePageAndUiPage.bind(this);
        this.paginateTableUp = this.paginateTableUp.bind(this);
        this.paginateTableDown = this.paginateTableDown.bind(this);

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    // Api Methods
    fetchApiData(pageNum = 1, pageLength = 100) {
        if (DEBUG_STATEMENTS) {
            console.log("Fetch Data");
        }
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
        if (DEBUG_STATEMENTS) {
            console.log("Got apiData", newData);
        }
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
    loadApiDataIfNeeded() {
        const { api } = this.state;

        if (!api.dataIsLoaded && api.data === null) {
            if (DEBUG_STATEMENTS) {
                console.log("fetching first data");
            }
            this.fetchApiData(api.currentPage, api.pageLength);
        } else {
            if (api.dataIsLoaded && api.currentDataIndex + 1 >= api.data.length ) {
                if (DEBUG_STATEMENTS) {
                    console.log("fetching more data, currentPage", api.currentPage, "fetching page", api.currentPage + 1);
                }
                this.fetchApiData(api.currentPage + 1, api.pageLength);
            }
        }

    }
    incrementCurrentApiData() {
        const { api } = this.state;
        this.setState({
            api : {
                ...api,
                currentDataIndex : api.currentDataIndex + 1,
                currentPage : api.currentPage + 1,
            }
        });
    }
    decrementCurrentApiData() {
        const { api } = this.state;
        // never go below index 0
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

    // Table Methods
    createTableDisplayPagesLookup() {
        if (DEBUG_STATEMENTS) {
            console.log("createTableDisplayPagesLookup");
        }
        const { api, table } = this.state;
        const currentData = api.data[api.currentDataIndex];
        const numOfPages = Math.floor(currentData.length / table.pageLength);;
        const remainder = currentData.length % table.pageLength;
        let displayPagesLookup = [];
        let startIndex;
        let endIndex;
        let minId;
        let maxId;

        for (let i = 0; i < numOfPages; i++) {
            startIndex = table.pageLength * i;
            endIndex = table.pageLength * (i + 1);
            minId = currentData[startIndex].id;
            maxId = currentData[endIndex - 1].id;
            displayPagesLookup = [...displayPagesLookup,
                    {
                        startIndex: startIndex,
                        endIndex: endIndex,
                        minId: minId,
                        maxId: maxId,
                    }
                ];
        }
        if ( remainder > 0 ) {
            startIndex = table.pageLength * numOfPages;
            endIndex = currentData.length;
            minId = currentData[startIndex].id;
            maxId = currentData[endIndex - 1].id;
            displayPagesLookup = [...displayPagesLookup,
                    {
                        startIndex: startIndex,
                        endIndex: endIndex,
                        minId: minId,
                        maxId: maxId,
                    }
                ];
        }
        this.setState({
            table: {
                ...table,
                maxPage: numOfPages,
                displayPagesLookup: displayPagesLookup,
            }
        });
    }
    setTablePageAndUiPage(newPage, newUiPage) {
        const { table } = this.state;

        if (DEBUG_STATEMENTS) {
            console.log("setTablePageAndUiPage", newPage, newUiPage);
        }

        this.setState({
            table : {
                ...table,
                currentPage : newPage,
                uiPage: newUiPage,
            }
        });
    }
    paginateTableUp() {
        const { table } = this.state;
        let newPage;
        let newUiPage;

        if ( table.currentPage < table.maxPage - 1 ) {
            if (DEBUG_STATEMENTS) {
                console.log("paginateTableUp");
            }
            newPage = table.currentPage + 1;
            newUiPage = table.uiPage + 1;
            this.setTablePageAndUiPage(newPage, newUiPage);

        } else {
            if (DEBUG_STATEMENTS) {
                console.log("paginateTableUp increment");
            }
            newPage = table.minPage;
            newUiPage = table.uiPage + 1;
            this.setTablePageAndUiPage(newPage, newUiPage);
        }
    }
    paginateTableDown() {
        const { table } = this.state;
        let newPage;
        let newUiPage;

        if ( table.currentPage > table.minPage && table.uiPage > 1 ) {
            if (DEBUG_STATEMENTS) {
                console.log("paginateTableDown", "uiPageNum", table.uiPage);
            }
            newPage = table.currentPage - 1;
            newUiPage = table.uiPageNum - 1;
            this.setTablePageAndUiPage(newPage, newUiPage);

        } else if ( table.currentPage <= table.minPage && table.uiPage > 1 ) {
            if (DEBUG_STATEMENTS) {
                console.log("paginateTableDown decrement", "uiPageNum", table.uiPage);
            }
            newPage = table.maxPage;
            newUiPage = table.uiPageNum - 1;
            this.setTablePageAndUiPage(newPage, newUiPage);
        } else {
            // do nothing
        }
    }

    // Component Methods
    handleKeyPress(e) {
        const key = e.key.toUpperCase();
        if (DEBUG_STATEMENTS) {
            console.log("keypressed", key);
        }
        const { api, focusedEmployee } = this.state;
        const currentData = api.data[api.currentDataIndex];
        let newFocusedEmployeeIndex;

        const logEmployeeIndexAndId = () => {
            console.log("newFocusedEmployeeIndex", newFocusedEmployeeIndex, "focusedEmployeeId", currentData[newFocusedEmployeeIndex].id);
        }
        const setEmployeeIndexAndId = (newFocusedEmployeeIndex, newIdLocation) => {

            if (DEBUG_STATEMENTS) {
                console.log("setEmployeeIndexAndId", newFocusedEmployeeIndex, newIdLocation[newFocusedEmployeeIndex].id, newIdLocation[newFocusedEmployeeIndex]);
            }

            this.setState({
                focusedEmployee : {
                    ...focusedEmployee,
                    index : newFocusedEmployeeIndex,
                    id : newIdLocation[newFocusedEmployeeIndex].id
                },
            });
        }

        if (focusedEmployee.index === null) {
            if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ENTER") {
                newFocusedEmployeeIndex = 0;
                if (DEBUG_STATEMENTS) {
                    logEmployeeIndexAndId();
                }
                setEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
            }
        }
        else if (key === "ARROWUP") {
            if (focusedEmployee.index > 0) {
                // Decrement
                newFocusedEmployeeIndex = focusedEmployee.index - 1;
                if (DEBUG_STATEMENTS) {
                    logEmployeeIndexAndId();
                }
                setEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);

            } else if (focusedEmployee.Index <= 0 && api.currentDataIndex > 0) {
                // decrement data and set index to data.length - 1
                const prevData = api.data[api.currentDataIndex - 1]
                newFocusedEmployeeIndex = prevData.length - 1;
                if (DEBUG_STATEMENTS) {
                    logEmployeeIndexAndId();
                }
                this.decrementCurrentApiData();
                this.paginateTableDown();
                setEmployeeIndexAndId(newFocusedEmployeeIndex, prevData);
            }
        }
        else if (key === "ARROWDOWN") {
            if (focusedEmployee.index < currentData.length - 1) {
                // increment
                newFocusedEmployeeIndex = focusedEmployee.index + 1;
                if (DEBUG_STATEMENTS) {
                    logEmployeeIndexAndId();
                }
                setEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
            } else {
                // increment data and reset index to 0
                newFocusedEmployeeIndex = 0;
                const nextData = api.data[api.currentDataIndex + 1];
                if (DEBUG_STATEMENTS) {
                    logEmployeeIndexAndId();
                }
                this.incrementCurrentApiData();
                this.paginateTableUp();
                setEmployeeIndexAndId(newFocusedEmployeeIndex, nextData);
            }
        } else if (key === "ENTER") {

        }
    }
    componentDidMount() {
        if (DEBUG_STATEMENTS) {
            console.log("EmployeeDashboard componentDidMount");
        }
        this.loadApiDataIfNeeded();
        document.addEventListener("keydown", this.handleKeyPress );
    }
    componentDidUpdate(prevProps, prevState) {
        const { api, table, focusedEmployee } = this.state;

        if (DEBUG_STATEMENTS) {
            console.log("EmployeeDashboard componentDidUpdate", this.state);
        }

        if ( prevState.api !== api ) {
            this.loadApiDataIfNeeded();
        }

        if ( !table.displayPagesLookup ) {
            this.createTableDisplayPagesLookup()
        }
    }
    componentWillUnmount() {
        console.log("EmployeeDashboard componentWillUnmount");
        document.removeEventListener("keydown", this.handleKeyPress() );
    }
    render() {
        if(DEBUG_STATEMENTS) {
            console.log("RENDER");
        }
        const { api, table, focusedEmployee  } = this.state;
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

            let rows; // NOTE: rendering table to be handled by a separate tableComponent

            if (DEBUG_STATEMENTS) {
                console.log("should create table: ", table.displayPagesLookup, table.currentPage, table.maxPage, table.currentPage <= table.maxPage);
            }

            if (table.displayPagesLookup && table.currentPage <= table.maxPage) {
                const start = table.displayPagesLookup[table.currentPage].startIndex;
                const end = table.displayPagesLookup[table.currentPage].endIndex;
                const currentPageData = currentData.slice(start, end);

                if (DEBUG_STATEMENTS) {
                    console.log("Creating table: start", start, "end", end, "currentPageData");
                }

                const toTitleCase = (str) => {
                    str = str.toLowerCase().split(' ');
                    for (var i = 0; i < str.length; i++) {
                        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                    }
                    return str.join(' ');
                };
                rows = currentPageData.map( item => {
                    const style = item.id === focusedEmployee.id ? {color: "blue"} : {};
                    return (
                        <tr key={item.id} style={style}>
                            <td>{item.id}</td>
                            <td>{toTitleCase(item.name)}</td>
                            <td>{toTitleCase(item.department)}</td>
                        </tr>
                    )
                });
                if (DEBUG_STATEMENTS) {
                    console.log("EmployeeTableView Render currentPage",  table.currentPage, "maxPage", table.maxPage);
                }

            }
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>{"API Page " + api.currentPage}</p>
                    <button type="button" onClick={this.decrementCurrentApiData}>Previous Page</button>
                    <button type="button" onClick={this.incrementCurrentApiData}>Next Page</button>
                    <hr></hr>

                    <div id="employee-table-view">
                        <h2>Employee Table View</h2>
                        <p>{"TableView Page " + (table.uiPage)}</p>
                        <button type="button" onClick={this.paginateDown}>Previous Page</button>
                        <button type="button" onClick={this.paginateUp}>Next Page</button>
                        <div className='table-wrapper'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* <EmployeeTableView
                        currentData={currentData}
                        apiPageLength ={apiPageLength}
                        incrementData={this.incrementCurrentApiData}
                        decrementData={this.decrementCurrentApiData}
                        focusedEmployeeId={focusedEmployeeId}
                    /> */}
                </div>
            )
        }
    }
}

export default EmployeeDashboard;
