import React, { useEffect, useState } from 'react';
import 'axios';
import axios from 'axios';

import AddCourses from '../Course/AddCourses';


function Home (props){

    
    return (
        <div>
            <h1>Hello,  { props.student.name } </h1>
            <h2> id :   { props.student.auc_id } </h2>
            <h2>Here is your GPA  { props.student.gpa } </h2>
            <h2>Number of credits :   { props.student.numbercredits} </h2>

            <hr/>

            {/* <AddCourses student = {props.student}/> */}

        </div>   
    
    )

}

export default Home;