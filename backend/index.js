let express = require("express")
const bodyParser = require('body-parser');
var cors = require('cors')




const app = express();

app.use(cors());

app.use(bodyParser.json());


// initialize routes
app.use('/api', require('./routes/api'));

app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
})



app.listen(process.env.PORT || 5000 , function(){
    console.log('now listening for requests');
});