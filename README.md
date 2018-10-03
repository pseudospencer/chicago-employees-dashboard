# About

I built this application September - October 2018, as a coding challenge for a React Developer role.

I was given a functional spec and documentation on a provided web server's API, and had a week to complete the challenge.

This was my first time building an application of this complexity, and I learned a lot in the process!

# Project Requirements

*(Copied from the challenge)*

* Use React to create the front-end.
* The app should be usable on all screen sizes (from mobile phone to desktop).
* The app should provide three screens:

    1. The first screen should be the list of all employees with only their `first name`, `last name` and `title`.
        * It should be possible to filter the list based on the employees' departments (Police, General Services, etc.).
        * The keyboard can be used: *Down* to focus on the next row, *Up* to focus on the previous row, and *Enter* to navigate to the next screen with the currently focused employee's details.
    2. Clicking on an employee's name or hitting *Enter* while focused on an employee should trigger the second screen, which should display all the information about this employee: id, first name, last name, title, salary, department.
        * The keyboard can be used here too. *Down* changes the employee information displayed to that of the "next" employee. The *Up* key is the previous employee. And the *Enter* key takes you back to the table view with the current employee focused.
    3. Lastly, the third screen should provide a form to add a new employee to the database; all the information should be provided: `first name`, `last name`, `title`, `salary` and `department`.

### *Important*

* Having a fully functional application at the end.
* Code quality and overall cleanness of the project.
* Overall, we want to see your production-level code. Think of this exercise as a project you would ship, and that you, or someone else, would then have to maintain, extend, etc.


### *Not Important*

* The visual design of the user interface: you are not expected to be web UI/UX designer so feel free to keep it simple.
* The boilerplate stuff. It's perfectly acceptable to use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to save time.

# Technologies used

- This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
- CSS and some components from [Bootstrap](http://getbootstrap.com/) and [React-Bootstrap](https://react-bootstrap.github.io/)
- Form page and handling with [Formik](https://github.com/jaredpalmer/formik)
- Form validation with [Yup](https://github.com/jquense/yup)
