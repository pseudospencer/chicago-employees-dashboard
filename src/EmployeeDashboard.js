import React, { Component } from 'react';
import EmployeeTableView from "./EmployeeTableView";
import EmployeeDetailView from "./EmployeeDetailView";
import EmployeeFormView from "./EmployeeFormView";
import NavComponent from "./NavComponent";
import HeaderComponent from "./HeaderComponent";

const DEBUG_STATEMENTS = !true;
const TABLE_VIEW = 0;
const DETAIL_VIEW = 1;
const FORM_VIEW = 2;

const DEFAULT_FILTER_VALUE = "Select department";   // departmentNames[0]

class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : TABLE_VIEW,
            api : {
                dataIsLoaded : false,
                pageLength : 50000,
                minPage : 1,
                currentPage : 1,
                currentDataIndex : null,
                data : null,
                filteredData : null,
                currentDataPointer: "data",
            },
            table : {
                pageLength : 25,
                minPage : 0,
                maxPage : 0,
                currentPage : 0,
                uiPage: 1,
                displayPagesLookup: null,
                filter : DEFAULT_FILTER_VALUE,
                filteredDisplayPagesLookup: null,
            },
            focusedEmployee : {
                index : null,
                id : null,
            },
        };
        // API methods
        this.fetchApiData = this.fetchApiData.bind(this);
        this.handleFetchedApiData = this.handleFetchedApiData.bind(this);
        this.loadApiDataIfNeeded = this.loadApiDataIfNeeded.bind(this);
        this.incrementCurrentApiData = this.incrementCurrentApiData.bind(this);
        this.decrementCurrentApiData = this.decrementCurrentApiData.bind(this);
        this.createFilteredData = this.createFilteredData.bind(this);
        this.setDataPointer = this.setDataPointer.bind(this);
        // Table Methods
        this.createTableDisplayPagesLookup = this.createTableDisplayPagesLookup.bind(this);
        this.setTablePageAndUiPage = this.setTablePageAndUiPage.bind(this);
        this.incrementTablePage = this.incrementTablePage.bind(this);
        this.decrementTablePage = this.decrementTablePage.bind(this);
        this.zeroTablePage = this.zeroTablePage.bind(this);
        // focusedEmployee methods
        this.setFocusedEmployeeIndexAndId = this.setFocusedEmployeeIndexAndId.bind(this);
        this.incrementFocusedEmployee = this.incrementFocusedEmployee.bind(this);
        this.decrementFocusedEmployee = this.decrementFocusedEmployee.bind(this);
        this.nullifyFocusedEmployee = this.nullifyFocusedEmployee.bind(this);
        // Event Handlers
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleIncrementTablePageButton = this.handleIncrementTablePageButton.bind(this);
        this.handleDecrementTablePageButton = this.handleDecrementTablePageButton.bind(this);
        this.handleEmployeeNameClick = this.handleEmployeeNameClick.bind(this);
        this.handleDetailViewBackButton = this.handleDetailViewBackButton.bind(this);
        this.handleNavAddEmployee = this.handleNavAddEmployee.bind(this);
        this.handleNavViewEmployees = this.handleNavViewEmployees.bind(this);
        this.handleDepartmentFilterChange = this.handleDepartmentFilterChange.bind(this);
        this.handleNewDepartmentFilterApplication = this.handleNewDepartmentFilterApplication.bind(this);
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
    createFilteredData() {
        if (DEBUG_STATEMENTS) {
            console.log("createFilteredData");
        }
        this.setState( state => {

            const { api, table } = state;

            if (table.filter !== DEFAULT_FILTER_VALUE) {
                const filteredData = api.data.map( innerArray => {
                    return innerArray.filter( item => item.department === table.filter);
                });

            return ({ api :
                        {
                        ...state.api,
                        filteredData: filteredData,
                        },
                    })
            }
        })
    }
    setDataPointer() {
        this.setState( (state) => {

            const { api, table } = state;

            let dataPointer;
            if (table.filter === DEFAULT_FILTER_VALUE) {
                dataPointer = "data";
            } else {
                dataPointer = "filteredData";
            }

            if (DEBUG_STATEMENTS) {
                console.log("setDataPointer, new pointer=", dataPointer);
            }

            return ({
                    api : {
                        ...state.api,
                        currentDataPointer: dataPointer,
                    }
                })
        });
    }

    // Table Methods
    createTableDisplayPagesLookup() {
        if (DEBUG_STATEMENTS) {
            console.log("createTableDisplayPagesLookup");
        }

        this.setState( state => {

            const { api, table } = state;

            const currentDataPointer = api.currentDataPointer;
            const currentData = api[currentDataPointer][api.currentDataIndex];

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

            if (DEBUG_STATEMENTS) {
                console.log("createTableDisplayPagesLookup, currentDataPointer=", currentDataPointer);
            }

            console.log("createTableDisplayPagesLookup, currentDataPointer=", currentDataPointer);

            if (currentDataPointer === "data") {
                return ({
                    table: {
                        ...table,
                        maxPage: numOfPages,
                        displayPagesLookup: displayPagesLookup,
                    }
                });
            }
            else if (currentDataPointer === "filteredData") {
                return ({
                    table: {
                        ...table,
                        maxPage: numOfPages,
                        filteredDisplayPagesLookup: displayPagesLookup,
                    }
                });
            }
        })
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
    zeroTablePage() {
        if (DEBUG_STATEMENTS) {
            console.log("zeroTablePage");
        }
        const newPage = 0;
        const newUiPage = 1;
        this.setTablePageAndUiPage(newPage, newUiPage);
    }

    // Focused Employee methods
    setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, newIdLocation) {
        const { focusedEmployee, api } = this.state;

        if (newFocusedEmployeeIndex === null && newIdLocation === null) {
            if (DEBUG_STATEMENTS) {
                console.log("setFocusedEmployeeIndexAndId", newFocusedEmployeeIndex, newIdLocation);
            }
            this.setState({
                focusedEmployee : {
                    ...focusedEmployee,
                    index : newFocusedEmployeeIndex,
                    id : newIdLocation,
                },
            });
        }
        else {
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
    }
    incrementFocusedEmployee(whileIncrementingData = false) {
        const { focusedEmployee, api } = this.state;
        let newFocusedEmployeeIndex;

        if (whileIncrementingData || whileIncrementingData == "whileIncrementingData") {
            newFocusedEmployeeIndex = 0;
            const nextData = api.data[api.currentDataIndex + 1];
        }
        else {
            const currentData = api[api.currentDataPointer][api.currentDataIndex];
            newFocusedEmployeeIndex = focusedEmployee.index + 1;
            this.setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
        }
    }
    decrementFocusedEmployee(whileDecrementingData = false) {
        const { focusedEmployee, api } = this.state;
        let newFocusedEmployeeIndex;

        if (whileDecrementingData || whileDecrementingData == "whileDecrementingData") {
            const prevData = api.data[api.currentDataIndex - 1];
            newFocusedEmployeeIndex = prevData.length - 1;
            this.setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, prevData);
        }
        else {
            const currentData = api[api.currentDataPointer][api.currentDataIndex];
            newFocusedEmployeeIndex = focusedEmployee.index - 1;
            this.setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
        }
    }
    nullifyFocusedEmployee() {
        this.setFocusedEmployeeIndexAndId(null, null);
    }

    // Event Handlers
    handleKeyPress(e) {
        const { api, table, focusedEmployee, currentView } = this.state;
        let key = e.key;

        if (DEBUG_STATEMENTS) {
            console.log("keypressed", key);
        }

        if ( api.data && currentView === TABLE_VIEW || api.data && currentView === DETAIL_VIEW ) {
            key = e.key.toUpperCase();

            const currentData = api.data[api.currentDataIndex];
            let newFocusedEmployeeIndex;

            if (focusedEmployee.index === null ) {
                if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ENTER") {
                    // create focusedEmployee
                    newFocusedEmployeeIndex = table.currentPage * table.pageLength;
                    this.setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
                }
            }
            else if (key === "ARROWUP") {
                if (focusedEmployee.index > 0 && focusedEmployee.index % table.pageLength === 0) {
                    // decrement focusedEmployee, decrement table page
                    this.decrementFocusedEmployee();
                    this.decrementTablePage();
                }
                else if (focusedEmployee.index > 0) {
                    // decrement focused employee
                    this.decrementFocusedEmployee();
                }
                else if (focusedEmployee.index === 0 && api.currentDataIndex > 0) {
                    // decrement data, decrement page, and decrement focusedEmployee
                    this.decrementFocusedEmployee("whileDecrementingData");
                    this.decrementTablePage();
                    this.decrementCurrentApiData();
                }
                else {
                    // Do nothing, because focusedEmployee.index should never become negative
                    if (DEBUG_STATEMENTS) {
                        console.log("ARROW UP ELSE", focusedEmployee);
                    }
                }
            }
            else if (key === "ARROWDOWN") {
                if (focusedEmployee.index < currentData.length - 1 && focusedEmployee.index % table.pageLength === table.pageLength - 1) {
                    // increment focusedEmployee, increment table page
                    if (DEBUG_STATEMENTS) {
                        console.log("focusedEmployee.index < currentData.length - 1 && focusedEmployee.index % table.pageLength === table.pageLength - 1");
                    }
                    this.incrementFocusedEmployee();
                    this.incrementTablePage();
                }
                else if (focusedEmployee.index < currentData.length - 1) {
                    // increment focusedEmployee
                    if (DEBUG_STATEMENTS) {
                        console.log("focusedEmployee.index < currentData.length - 1");
                    }
                    this.incrementFocusedEmployee();
                }
                else if ( focusedEmployee.index === currentData.length - 1 ) {
                    // increment focusedEmployee, table page, and api data
                    if (DEBUG_STATEMENTS) {
                        console.log('focusedEmployee.index === currentData.length - 1')
                    }
                    this.incrementFocusedEmployee("whileIncrementingData");
                    this.incrementTablePage();
                    this.incrementCurrentApiData();
                }
                else {
                    // do nothing, because focusedEmployee.index should never become greater than currentData.length - 1
                    if (DEBUG_STATEMENTS) {
                        console.log("ARROWDOWN ELSE", currentData, focusedEmployee);
                    }
                }
            }
            else if (key === "ENTER") {
                if ( currentView === TABLE_VIEW ) {
                    this.setState({
                        currentView : DETAIL_VIEW,
                    });
                }
                else if ( currentView === DETAIL_VIEW ) {
                    this.setState({
                        currentView: TABLE_VIEW,
                    });
                }
            }
        }
    }
    handleIncrementTablePageButton() {
        this.incrementTablePage();
        this.nullifyFocusedEmployee();
    }
    handleDecrementTablePageButton() {
        this.decrementTablePage();
        this.nullifyFocusedEmployee();
    }
    handleEmployeeNameClick(clickedIndex) {
        const { focusedEmployee, api } = this.state;
        const currentData = api.data[api.currentDataIndex];
        const newFocusedEmployeeIndex = clickedIndex;

        this.setFocusedEmployeeIndexAndId(newFocusedEmployeeIndex, currentData);
        this.setState({
            currentView: DETAIL_VIEW,
        });
    }
    handleDetailViewBackButton() {
        const { currentView } = this.state;
        if ( currentView === DETAIL_VIEW ) {
            this.setState({
                currentView : TABLE_VIEW,
            });
        }
    }
    handleNavViewEmployees() {
        const { currentView } = this.state;
        if ( currentView === FORM_VIEW ) {
            this.setState({
                currentView : TABLE_VIEW,
            });
        }
    }
    handleNavAddEmployee() {
        const { currentView } = this.state;
        if ( currentView === TABLE_VIEW || currentView === DETAIL_VIEW ) {
            this.setState({
                currentView : FORM_VIEW,
            });
        }
    }
    handleDepartmentFilterChange(e) {
        const { table } = this.state;
        const value = e.target.value;
        if (DEBUG_STATEMENTS) {
            console.log("handleDepartmentFilterChange, value=", value);
        }
        this.setState({
            table : {
                ...table,
                filter: value,
            }
        })
    }
    handleNewDepartmentFilterApplication() {
        if (DEBUG_STATEMENTS) {
            console.log("handleNewDepartmentFilterApplication")
        }

        // debugger;

        this.setDataPointer();
        this.createFilteredData();
        this.createTableDisplayPagesLookup();
        this.nullifyFocusedEmployee();
        this.zeroTablePage();
    }

    // Lifecycle
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

        if ( api.data && table.displayPagesLookup === null ) {
            this.createTableDisplayPagesLookup();
        }

        if ( api.data && prevState.table.filter !== table.filter ) {
            this.handleNewDepartmentFilterApplication();
        }
    }
    componentWillUnmount() {
        console.log("EmployeeDashboard componentWillUnmount");
        document.removeEventListener("keydown", this.handleKeyPress );
    }
    render() {
        if (DEBUG_STATEMENTS) {
            console.log("RENDER");
        }
        const { api, table, focusedEmployee, currentView } = this.state;

        const nav = (
            <NavComponent
                handleNavAddEmployee={this.handleNavAddEmployee}
                handleNavViewEmployees={this.handleNavViewEmployees}
                currentView={currentView}
            />
        )

        if (api.error) {
            return(
                <div id="employee-dashboard">
                    <HeaderComponent />
                    <p>Failed to fetch data... are you sure you are connected to the internet?</p>
                </div>
            )
        }
        else if (currentView === FORM_VIEW) {
            return(
                <div id="employee-dashboard">
                    <HeaderComponent />
                    {nav}
                    <EmployeeFormView />
                </div>
            )
        }
        else if (api.dataIsLoaded === false) {
            return(
                <div id="employee-dashboard">
                    <HeaderComponent />
                    {nav}
                    <p>Loading</p>
                </div>
            )
        }
        else if (api.dataIsLoaded === true) {

            const currentData =
                api[api.currentDataPointer][api.currentDataIndex];

            if (currentView === TABLE_VIEW) {
                return(
                    <div id="employee-dashboard">
                        <HeaderComponent />
                        {nav}
                        <EmployeeTableView
                            currentData={currentData}
                            table={table}
                            focusedEmployee={focusedEmployee}
                            incrementTablePage={this.handleIncrementTablePageButton}
                            decrementTablePage={this.handleDecrementTablePageButton}
                            handleNameClick={this.handleEmployeeNameClick}
                            handleDepartmentFilter={this.handleDepartmentFilterChange}
                        />
                    </div>
                )
            }
            else if (currentView === DETAIL_VIEW) {
                return(
                    <div id="employee-dashboard">
                        <HeaderComponent />
                        {nav}
                        <EmployeeDetailView
                            currentData={currentData}
                            focusedEmployee={focusedEmployee}
                            handleBackButton={this.handleDetailViewBackButton}
                        />
                    </div>
                )
            }
        }
    }
}

export default EmployeeDashboard;
