import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";

const DEBUG_STATEMENTS = !true;

class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : null,
            api : {
                dataIsLoaded : false,
                pageLength : 100,
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
        this.incrementTablePage = this.incrementTablePage.bind(this);
        this.decrementTablePage = this.decrementTablePage.bind(this);

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
            if (api.dataIsLoaded && api.data && api.currentDataIndex + 1 >= api.data.length) {

                // NOTE: This crashes if no API data - would also crash app if there was an error fetching data.

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
        if (DEBUG_STATEMENTS) {
            console.log("setTablePageAndUiPage", "table.currentPage", newPage, "table.uiPage", newUiPage);
        }
        const { table } = this.state;
        this.setState({
            table : {
                ...table,
                currentPage : newPage,
                uiPage: newUiPage,
            }
        });
    }
    incrementTablePage() {
        const { table } = this.state;
        let newPage;
        let newUiPage;

        if ( table.currentPage < table.maxPage - 1 ) {
            if (DEBUG_STATEMENTS) {
                console.log("incrementTablePage");
            }
            newPage = table.currentPage + 1;
            newUiPage = table.uiPage + 1;
            this.setTablePageAndUiPage(newPage, newUiPage);

        } else {
            if (DEBUG_STATEMENTS) {
                console.log("incrementTablePage increment");
            }
            newPage = table.minPage;
            newUiPage = table.uiPage + 1;
            this.setTablePageAndUiPage(newPage, newUiPage);
        }
    }
    decrementTablePage() {
        const { table } = this.state;
        let newPage;
        let newUiPage;

        // never go below page 1
        if ( table.uiPage > 1 ) {
            if ( table.currentPage > table.minPage ) {
                if (DEBUG_STATEMENTS) {
                    console.log("decrementTablePage", "uiPageNum", table.uiPage);
                }
                newPage = table.currentPage - 1;
                newUiPage = table.uiPage - 1;
                this.setTablePageAndUiPage(newPage, newUiPage);

            } else  {
                if (DEBUG_STATEMENTS) {
                    console.log("decrementTablePage decrement", "table.currentPage", table.currentPage, "uiPage", table.uiPage);
                }
                newPage = table.maxPage - 1;
                newUiPage = table.uiPage - 1;
                this.setTablePageAndUiPage(newPage, newUiPage);
            }
        }
    }

    // Focused Employee methods
    setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, newIdLocation) {
        const { focusedEmployee } = this.state;
        if (DEBUG_STATEMENTS) {
            console.log("setFocusedEmployeeIndexAndId", newFocusedEmployeeIndex, newIdLocation[newFocusedEmployeeIndex].id, newIdLocation[newFocusedEmployeeIndex]);
        }
        this.setState({
            focusedEmployee : {
                ...focusedEmployee,
                index : newFocusedEmployeeIndex,
                id : newIdLocation[newFocusedEmployeeIndex].id
            },
        });
    }
    incrementFocusedEmployee() {
        const { focusedEmployee } = this.state;
        let newFocusedEmployeeIndex;

    }
    decrementFocusedEmployee() {
        const { focusedEmployee } = this.state;
        let newFocusedEmployeeIndex;
    }
    nullifyFocusedEmployee() {
        const { focusedEmployee } = this.state;
        let newFocusedEmployeeIndex;
    }

    // Component Methods
    handleKeyPress(e) {
        const key = e.key.toUpperCase();
        if (DEBUG_STATEMENTS) {
            console.log("keypressed", key);
        }
        const { api, table, focusedEmployee } = this.state;

        if ( api.data ) {
            const currentData = api.data[api.currentDataIndex];
            let newFocusedEmployeeIndex;

            const logEmployeeIndexAndId = () => {
                console.log("newFocusedEmployeeIndex", newFocusedEmployeeIndex, "focusedEmployeeId", currentData[newFocusedEmployeeIndex].id);
            }
            const setFocusedEmployeeIndexAndId = (newFocusedEmployeeIndex, newIdLocation) => {
                if (DEBUG_STATEMENTS) {
                    console.log("setFocusedEmployeeIndexAndId", newFocusedEmployeeIndex, newIdLocation[newFocusedEmployeeIndex].id, newIdLocation[newFocusedEmployeeIndex]);
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
                    // create focusedEmployee
                    newFocusedEmployeeIndex = 0;
                    if (DEBUG_STATEMENTS) {
                        logEmployeeIndexAndId();
                    }
                    setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
                }
            }
            else if (key === "ARROWUP") {
                if (focusedEmployee.index > 0) {
                    // decrement focusedEmployee.index
                    newFocusedEmployeeIndex = focusedEmployee.index - 1;
                    if (DEBUG_STATEMENTS) {
                        logEmployeeIndexAndId();
                    }
                    setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);

                    if (focusedEmployee.index % table.pageLength === 0) {
                        this.decrementTablePage();
                    }

                }
                else if (focusedEmployee.index === 0 ) {
                    if (api.currentDataIndex > 0) {
                        // decrement data, decrement page, and set focusedEmployee index to data.length - 1
                        const prevData = api.data[api.currentDataIndex - 1];
                        newFocusedEmployeeIndex = prevData.length - 1;
                        if (DEBUG_STATEMENTS) {
                            logEmployeeIndexAndId();
                        }
                        setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, prevData);
                        this.decrementTablePage();
                        this.decrementCurrentApiData();

                    }
                }
                else {
                    // This should never happen
                    if (DEBUG_STATEMENTS) {
                        console.log("ARROW UP ELSE", focusedEmployee);
                    }
                }
            }
            else if (key === "ARROWDOWN") {
                if (focusedEmployee.index < currentData.length - 1) {
                    if (focusedEmployee.index % table.pageLength !== table.pageLength - 1) {
                        // increment focusedEmployee.index
                        newFocusedEmployeeIndex = focusedEmployee.index + 1;
                        if (DEBUG_STATEMENTS) {
                            logEmployeeIndexAndId();
                        }
                        setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
                    }
                    else if (focusedEmployee.index % table.pageLength === table.pageLength - 1) {
                        // increment focusedEmployee.index, increment page
                        newFocusedEmployeeIndex = focusedEmployee.index + 1;
                        if (DEBUG_STATEMENTS) {
                            logEmployeeIndexAndId();
                        }
                        this.incrementTablePage();
                        setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
                    }
                }
                else {
                    // increment data, increment page, and reset focusedEmployee.index to 0
                    newFocusedEmployeeIndex = 0;
                    const nextData = api.data[api.currentDataIndex + 1];
                    if (DEBUG_STATEMENTS) {
                        logEmployeeIndexAndId();
                    }
                    this.incrementCurrentApiData();
                    this.incrementTablePage();
                    setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, nextData);
                }
            }
            else if (key === "ENTER") {

            }
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

        if ( api.data && !table.displayPagesLookup ) {
            this.createTableDisplayPagesLookup()
        }
    }
    componentWillUnmount() {
        console.log("EmployeeDashboard componentWillUnmount");
        document.removeEventListener("keydown", this.handleKeyPress() );
    }
    render() {
        if (DEBUG_STATEMENTS) {
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

            const paginateApiButtons = (
                <div className="paginate-api-buttons">
                    <button type="button" onClick={this.decrementCurrentApiData}>Previous Page</button>
                    <button type="button" onClick={this.incrementCurrentApiData}>Next Page</button>
                </div>
            );
            return(
                <div id="employee-dashboard">
                    <h1>City of Chicago Employees Dashboard</h1>
                    <p>{"API Page " + api.currentPage}</p>
                    {/* {paginateApiButtons} */}
                    <hr></hr>
                    <EmployeeTableView
                        currentData={currentData}
                        table={table}
                        focusedEmployee={focusedEmployee}
                        incrementTablePage={this.incrementTablePage}
                        decrementTablePage={this.decrementTablePage}
                    />
                </div>


            )
        }
    }
}

export default EmployeeDashboard;
