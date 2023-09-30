const express=require('express');
 
let user_routes=express();
let config=require('../config/config')
const session=require('express-session');
user_routes.use(session({
    secret:config.sessionSecrete,
    resave: false,
    saveUninitialized: false,
}))
const auth=require('../Auth/auth')

//-----Require Body-parser
let bodyparser=require('body-parser')

user_routes.use(bodyparser.json());
user_routes.use(bodyparser.urlencoded({extended:true}));

//-----Set view engine

user_routes.set('view engine','ejs')
user_routes.set('views','./views/user');

//----Import User Controller
let Controller=require('../controller/usercontroller')
///-----<---Use Multer for upload image
let multer=require('multer');
let path=require('path')

user_routes.use("/images",express.static('images'))
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../images'));
    },
    filename:(req,file,cb)=>{
        let name=Date.now()+'--'+file.originalname;
        cb(null,name)
    }
});
const upload=multer({storage:storage})


user_routes.get('/rajister', auth.isLogout, Controller.Ragistration);
user_routes.post('/rajister', upload.single('image') ,Controller.Ragistrationdata)

//----Verify Mail
user_routes.get('/verify',Controller.verifyMail);
// User login
user_routes.get('/login', auth.isLogout, Controller.userLogin)
user_routes.post('/login',Controller.userLoginData);
//user home page    
user_routes.get('/home', auth.isLogin, Controller.loadHome)

// ____...

user_routes.get("/logout",Controller.LogOut);

//----Forget Passwordforget
user_routes.get('/forget',Controller.forget);
user_routes.post('/forget',Controller.forgetPass);

//------Resend User Verification Mail
user_routes.get('/resend',Controller.ReVerifyMail);
user_routes.post('/resend',Controller.userReverifymail)


//----User profile edit 
user_routes.get('/edit',Controller.profileEdit);
user_routes.post('/edit',upload.single('image'), Controller.updateprofile)

//---Export user-routes
module.exports = user_routes






