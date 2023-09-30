let express=require('express');
let admin_route=express();
let adminController=require('../controller/admincontroller');
let session=require('express-session')
let config=require('../config/config')
//<---Authentication
let auth=require('../Auth/auth')
let multer=require('multer');
let path=require('path')

admin_route.use("/images",express.static('images'))
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

admin_route.use(session({secret:config,
     resave: false,
    saveUninitialized: false,
}))
let bodyparser=require('body-parser');
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}));
admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')

admin_route.get('/',auth.isLogout, adminController.adminLogin);
admin_route.post('/',adminController.adminData);
//<-----Admin Home Page load
admin_route.get('/Home',auth.isLogin, adminController.adminHome)

//-----admin logout
admin_route.get('/Logout',adminController.LogOut)
///---Admi forget password
admin_route.get('/forget',adminController.forgetpass)
admin_route.post('/forget',adminController.forgetpassverify)
 admin_route.get('/reset-pass',adminController.updatepass)
 admin_route.post('/reset-pass',adminController.resetpass);

 ///---Dashboard
 admin_route.get('/dashboard', auth.isLogin,adminController.adminDashboard)

///----Add new user

admin_route.get('/new-user',auth.isLogin,adminController.new_user)
admin_route.post('/new-user',auth.isLogin, upload.single('image'),adminController.new_user_data)


//----For Edit User data
admin_route.get('/edit-user',adminController.edituser)
admin_route.post('/edit-user',adminController.edituserdata)
///------For Delete users
admin_route.get('/delete-user',adminController.deleteusers);
//----FOR EXPORT USER DATA IN TO PDF
admin_route.get('/export-pdf',adminController.exportdata)


admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
})


//<-----export admin_routes


module.exports=admin_route