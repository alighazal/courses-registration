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
    async ()=> {
        await axios.get(" /api/mycourses",{
            params: {
                id: "900171722"
            }
        }).then( (response) => {
            console.log(response.data);
            setStudentHistory(response.data);

            for(const course of response.data ) {
              console.log((course.department 
                + '-' + course.coursenumber).toString());
              /*   (state) => [...state, (response.data[i].department + '-' + response.data[i].coursenumber).toString()])
                 */
              setStudentHistoryID( 
                (state) => [...state,
                   (course.department 
                    + '-' + course.coursenumber).toString()]);

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

  useEffect ( () => {
    console.log(studentHistoryID)
  },[studentHistoryID])

  return (
      <HashRouter>
        <div className="App">


        <Navbar color="light" light expand="md">
        <NavbarBrand href="/">AUC COURSES</NavbarBrand>
            <Nav className="mr-auto" navbar>

            <NavItem>
              
              <Link style={{ textDecoration: 'none', margin: 5 }} to="/"> Home</Link>
            </NavItem>

            <NavItem>
              
              <Link style={{ textDecoration: 'none', margin: 5 }} to="/about"> About</Link>
            </NavItem>

            <NavItem>
              <Link  style={{ textDecoration: 'none', margin: 5 }} to="/history/">History</Link>
            </NavItem>

            <NavItem>
              <Link style={{ textDecoration: 'none', margin: 5 }} to="/departments/">Explore</Link>
            </NavItem>
            
          </Nav>
          <NavbarText>Made with &hearts; in Alexandira</NavbarText>

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
              <Course studentHistoryID = {studentHistoryID} />
            </Route>
          </Switch>


          
        </div>
      </HashRouter>
   
  );
}

export default App;
