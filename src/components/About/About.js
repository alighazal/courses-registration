import React, { useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';


function About (props){

    let location = useLocation();

  /*   useEffect ( async () => {
        const result = await axios.get(` /api/departments/CSCE`) 
         
          console.log(result.data);
      }) */

    return (
        <div>
            <h1>About</h1>

            <div>
                Hello, everyone
                <br/>
                this is a website that is designed to help you register your course ..
                <br />
                1. you can see your information in the home page
                <br />
                2. see your course history and add courses
                <br />
                3. Explore all courses offerings
                <br />
                4. you would find beside each course title a tag indicating your status in regard to this course

            </div>
        </div>
    )

}

export default About;