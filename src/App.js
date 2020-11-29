import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  HashRouter
} from "react-router-dom";

import axios from 'axios';


import Departments from './components/Departments/Departments';
import Home from "./components/Home/Home";
import About from "./components/About/About";
import DepartmentCourses from './components/DepartmentCourses/DepartmentCourses'
import Course from './components/Course/Course'
import History from './components/History/History'
import AddCourseReview from './components/CourseReview/AddCourseReview';
import { useState } from 'react';
import { useEffect } from 'react';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';


function App() {

  const [student, setStudent] = useState({
    auc_id: '',
    name: '',
    gpa: 0.0,
    numbercredits: 0
  });

  const [studentHistory, setStudentHistory] = useState([{
    auc_id: '',
    department: '',
    coursenumber: '',
    grade: '',
    semester: '',
    year: ''
  }]) ;

  const [studentHistoryID, setStudentHistoryID] = useState([]);




  useEffect (
    ()=> {
        axios.get(" /api/mycourses",{
            params: {
                id: "900171722"
            }
        }).then( (response) => {
            console.log(response.data);
            setStudentHistory(response.data);

            for(var i = 0; i < response.data.length; i++ ) {

              setStudentHistoryID( 
                ( state) => 
                ([...state,
                   (response.data[i].Department 
                    + '-' + response.data[i].CourseNumber).toString()]));

            }
        })      
  }, [])

  useEffect (
    ()=> {
        axios.get(" /api/student",{
            params: {
                id: "900171722"
            }
            }).then(
                (response) => {
                    console.log(response.data[0]);
                    setStudent(response.data[0]);
                }
        )
  }, [])

  useEffect ( () => {
    console.log(student)
  },[student])

  return (
      <Router>
        <div className="App">


        <Navbar color="light" light expand="md">
        <NavbarBrand href="/">AUC COURSES</NavbarBrand>
            <Nav className="mr-auto" navbar>

            <NavItem>
              <NavLink href="/"> Home</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/about"> About</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/history/">History</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/departments/">Explore</NavLink>
            </NavItem>
            
          </Nav>
          <NavbarText>Made with love</NavbarText>

      </Navbar>

               
          <hr />

          <Switch>
            <Route exact path="/">
              <Home student = {student} />
            </Route>

            <Route exact path="/history" component = {withRouter(History)}>
              <History  studentHistory = {studentHistory}  student = {student} />
            </Route>

            {
              /*
              get history and fomrat it and pass it down the dependency tree
              */ 
            }

            <Route exact path="/about" component = {withRouter(About)}/>
            <Route exact path="/add_course_review" component = {withRouter(AddCourseReview)}/>
            <Route exact path="/departments"  component = {withRouter(Departments)}/>
            
            <Route exact path="/departments/:id" >
              <DepartmentCourses studentHistoryID ={ studentHistoryID} />
            </Route>
            <Route  path="/departments/:id/:course" >
              <Course studentHistory = {studentHistory} />
            </Route>
          </Switch>


          
        </div>
      </Router>
   
  );
}

export default App;