import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function Department (props) {

   
      
    const [departments,SetDepartments] = useState ([])
    
    
    useEffect (()=> {
      axios.get(' /api/departments').then( (response) => {
        // handle success
        SetDepartments(response.data)
      })

    }, []) 
    
    return (
    
    <div>

      <h1>Hello, {props.name}</h1>

      {
        departments.map(
          (Department) => (
            <div key={Department.department}>

              <div >
                <Link to = {`/departments/${Department.department}`}>
                  {Department.department} 
                </Link>    
              </div>
              
            </div>
          )

        )
      }

    </div>)
    

}

  

export default Department;
