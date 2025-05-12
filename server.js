const express = require('express');
const path = require('path')
const authRoute = require('./routes/authoRoute')

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, 'views')));
app.use('/api/auth',authRoute)
app.use('/',authRoute)
// chay server
const PORT = 3000;
app.listen(PORT,()=>{
    console.log("chay oke")
})
