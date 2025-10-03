
const express = require('express');
const  mongoose  = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv  = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const mainRoute = require("./routes/mainRoute")
const { checkUser }  =  require("./middleware/authenticationMiddleware") // this check the user is is alreaddy id login or not

const app = express();
const path = require('path');

dotenv.config();

app.set('view engine' , 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // Parse JSON bodies
// app.use(express.static(path.join(__dirname , "public")));
app.use(express.static('public'));
app.use(cookieParser())


const dbURI = process.env.DB_URI ;
mongoose.connect(dbURI)
.then(()=>{ console.log('mongoose are connectres')})
.catch(()=>{ console.log('mongoose failed to connected')})



app.use(checkUser);
app.use(authRoutes)
app.use(mainRoute);
// app.get("/" , function(req , res){
   //    res.render('index')
   // })
   
   const port = process.env.PORT || 3000 ;
   app.listen(port, function(){
      console.log(`Server is listening on port ${port}`)
   })

