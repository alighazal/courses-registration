//let config = require('../config/mysql_config.json')
//let mysql = require("mysql")

const { Client } = require('pg');

const express = require ('express');
const router = express.Router();

//let connection = mysql.createConnection(config);

/* connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
}); */
const client = new Client({
    connectionString: "postgres://omnswgtkpjazzy:10c065cf840be5e302d66b4a6e1dcdd43f92fbeece0751b1e38b9990afd3fc98@ec2-54-225-214-37.compute-1.amazonaws.com:5432/das6cgi07fpjd0",
    ssl: {
      rejectUnauthorized: false
    }
  });
  
client.connect();



// get a list of depaartments from the db
router.get('/departments', function(req, res){

    let sql = `SELECT * FROM Departments`;

    client.query(sql, (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});

router.get('/departments/:id', function(req, res){

    let sql = `
    SELECT C.Department, C.CourseNumber, C.Name 
    FROM COURSE C  WHERE C.Department = $1 ;
    `;

    client.query(sql, [req.params.id] , (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});

router.get('/departments/:id/:course', function(req, res){

    let sql = `
    SELECT C.Department, C.CourseNumber, C.Name, C.Credits ,C.Description, C.Notes, C.Crosslisted_Department, C.Crosslisted_CourseNumber, CP.Department_1ST, CP.CourseNumber_1ST, CP.Department_2ND, CP.CourseNumber_2ND, CP.Concurrency, Semester
    FROM COURSE C
    LEFT OUTER JOIN COURSE_PREREQUISTE CP 
    ON C.Department = CP.Department_1ST AND C.CourseNumber = CP.CourseNumber_1ST
    LEFT OUTER JOIN COURSE_SEMESTER CS
    ON C.Department = CS.Department AND C.CourseNumber = CS.CourseNumber
    WHERE C.Department = $1 AND C.CourseNumber = $2;
    `;

    client.query(sql, [req.params.id, req.params.course ] , (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});


router.get('/student/', function(req, res){

    let sql = `
    SELECT * FROM STUDENT WHERE AUC_ID = $1;
    `;

    console.log(req);

    client.query(sql, [req.query.id] , (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});

router.get('/mycourses/', function(req, res){

    let sql = `
    SELECT * FROM STUDENT_COURSE WHERE AUC_ID = $1;
    `;

    console.log(req);

    client.query(sql, [req.query.id] , (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});

router.get('/course_review/', function(req, res){

    let sql = `
    SELECT * FROM STUDENT_REVIEW where Department = $1 AND CourseNumber = $2;
    `;

    console.log(req.query.Department, req.query.CourseNumber);

    client.query(sql, [req.query.Department, req.query.CourseNumber ] , (error, results) => {
        if (error) {
        return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        res.send(results.rows);
    });
    
});


router.post('/add_review/', function(req, res){

    let sql = `
    INSERT INTO 
    STUDENT_REVIEW(AUC_ID, Department, CourseNumber, Rating, Review)
    Values($1, $2, $3, $4, $5  );
    `;

    console.log(req.body);

     client.query(sql, [req.body.AUC_ID, req.body.Department, req.body.CourseNumber, req.body.rating, req.body.review],
        (error, results) => {
            if (error) {
            return console.error(error.message);
        }
        //console.log(fields);
        console.log(results.rows);
        //res.send(results);
    }); 
    
});

router.post('/add_course/', function(req, res){

    let sql = `
    INSERT INTO 
    STUDENT_COURSE(AUC_ID, Department, CourseNumber, Grade, Semester, Year )
    Values($1, $2, $3, $4, $5, $6 );
    `;

    console.log(req.body);

     client.query(sql, [req.body.AUC_ID, req.body.Department, req.body.CourseNumber, req.body.Grade, req.body.Semester, req.body.Year ],
        (error, results) => {
            if (error) {
            res.send(error.message);
            return console.error(error.message);
        }
        //console.log(fields);
        //console.log(results.rows);
        res.send(results);
    }); 
    
});

/* 

 */

// add a new ninja to the db
router.post('/ninjas', function(req, res){
    res.send({type: 'POST'});
});

// update a ninja in the db
router.put('/ninjas/:id', function(req, res){
    res.send({type: 'PUT'});
});

// delete a ninja from the db
router.delete('/ninjas/:id', function(req, res){
    res.send({type: 'DELETE'});
});

module.exports = router;