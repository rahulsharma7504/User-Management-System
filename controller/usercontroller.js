const { Modal } = require('../Modal/usermodal');

//----Use rendom string
const { all } = require("proxy-addr");

const redomstring=require('randomstring')
const { emit } = require("process");
const send = require("send");
const { userInfo } = require("os");

const Ragistration = async (req, res) => {
  try {
    res.render('rajister');

  } catch (error) {
    console.log(error.message);

  }
};


//-----<---Sendmail
let nodemailer = require('nodemailer')
let sendmail = async (name, email, user_id) => {
  try {
    const Transporter = nodemailer.createTransport({
      //  service:"Gmail",
      host: 'mail.sandeepdeveloper.com',
      port: 465,
      requireTLS: true,

      auth: {
        user:"management_system@sandeepdeveloper.com",
        pass:'(@eAb-x;d,$#',
      },
    });
    const mailOption = {
      from:"management_system@sandeepdeveloper.com",
      to: email,
      subject: "For verification mail",
      html: '<p>Hii ' + name + ' please verify your mail to activate your account <a href="http://localhost:3000/ums/verify?id=' + user_id + '">verify</a></p>'
    };
    Transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Email has been sent", info.response);
      }
    });

  } catch (error) {
    console.log(error.message)

  }
}

const Ragistrationdata = async (req, res) => {
  try {
    let Data = Modal({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      image: req.file.filename,
      password: req.body.password,
      is_varified: 0
    })
    let userData = await Data.save();
    let storemail = sendmail(req.body.name, req.body.email, userData._id)
    res.render('rajister', { message: 'Your Ragistration is successful please check your Mail' });
  } catch (error) {
    console.log(error.message)

  }
}
//----===Verify User Mail

const verifyMail = async (req, res) => {
  try {
    const Mail = await Modal.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } })
    console.log(Mail)
    res.render('verify')
  } catch (error) {
    console.log(error.message)

  }
};
//----User Login Load

const userLogin = async (req, res) => {
  try {
    res.render('login')

  } catch (error) {
    console.log(error.message)

  }
};

const userLoginData = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    const userData = await Modal.findOne({ email: email, password: password });
    console.log(userData)
    if (userData) {
      if (userData.is_varified === 0) {
        res.render('login', { message: 'Please verify first' })

      } else {
        req.session.user_id = userData._id
        res.redirect('home')
      }
    } else {
      res.render('login', { message: 'Username or Password is incorrect' })
    }

  } catch (error) {
    console.log(error.message)

  }
};

//Load User home page
const loadHome = async (req, res) => {
  try {
    const userprofile = await Modal.findById({ _id: req.session.user_id })
    res.render("home",{userprofile})

  } catch (error) { 
    console.log(error.message)
  }
}
// user Log-out
const LogOut = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/ums/login")
  } catch (error) {
    console.log(error.message)
  }
}

//Forget Pass
const forget=async(req,res)=>{
  try {
    res.render('forget')
  } catch (error) {
    console.log(error.message)
    
  }
}

//-----Send Reset password Mail
const mailsend=async(name,email,password,token)=>{
  try {
    var Transporter = nodemailer.createTransport({
      //  service:"Gmail",
      host: 'mail.sandeepdeveloper.com',
      port: 465,
      requireTLS: true,

      auth: {
        user: 'management_system@sandeepdeveloper.com',
        pass: '(@eAb-x;d,$#',
      },
    });
    const mailOption = {
      from:'management_system@sandeepdeveloper.com',
      to: email,
      subject: "For Reset Your passwor",
      html: '<p>Hii ' + name + ' your password is ' + password + ' to Enjoy my website <a href="http://localhost:3000/reset-pass?token=' + token + '">Reset Password</a></p>'
    };
    Transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Email has been sent", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const forgetPass=async(req,res)=>{
  try {
    let email=req.body.email;
    let maildata=await Modal.findOne({email:email});
    if(maildata){
        if(maildata.is_varified==0){
          res.render('forget',{message:'please verify first'})
        }else{
       const RendomString=redomstring.generate();
       const updated=await Modal.updateOne({email:email},{$set:{token:RendomString}})
      mailsend(maildata.name,maildata.email,maildata.password,RendomString)
      res.render('forget',{message:'we have sent you pass on your mail'})

        }
    }
    else{
      res.render('forget',{message:"Email is incorrect"})
    }

  } catch (error) {
    console.log(error.message)
    
  }
}
//-----Re-send verification Mail
const ReVerifyMail=async(req,res)=>{
  try {
    res.render('Re-verification')
  } catch (error) {
    console.log(error.message)
    
  }
}

const userReverifymail=async(req,res)=>{
  try {
    let email=req.body.email;
    let findemail=await Modal.findOne({email:email});
    if(findemail){
      sendmail(findemail.name,findemail.email,findemail._id);
      res.render('Re-verification',{message:'Mail is send to user'});
      res.redirect('verify')
    }else{
      res.render('Re-verification',{message:'Given mail is not exist'});

    }
  } catch (error) {
    console.log(error.message)
    
  }
}
//----User profile edit
const profileEdit=async(req,res)=>{
  try {
    let id=req.query.id.trim();
    let editdata=await Modal.findOne({_id:id});
    if(editdata){
      res.render('edit',{editdata})

    }else{
      res.redirect('home')
    }

  } catch (error) {
    console.log(error.message)
    
  }
}
const updateprofile = async (req, res) => {
  try {
    let data = req.body.editdata;

    if (req.file) {
      const userdata = await Modal.findByIdAndUpdate(
        { _id: data },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile, // Fix: Use 'mobile' instead of 'email' for mobile field
            image: req.file.filename
          },
        },
        { new: true } // To get the updated document as a result
      );
      console.log(userdata);
    } else {
      const userdata = await Modal.findByIdAndUpdate( 
        { _id: data },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile // Fix: Use 'mobile' instead of 'email' for mobile field
          },
        },
        { new: true } // To get the updated document as a result
      );
      console.log(userdata);
    res.redirect('home');

    }

  } catch (error) {
    console.log(error.message);
  }
};









//-----<---Export all methods

module.exports = {
  Ragistration,
  Ragistrationdata,
  verifyMail,
  userLogin,
  userLoginData,
  loadHome,
  LogOut,
  forget,
  forgetPass,
  ReVerifyMail,
  userReverifymail,
  profileEdit,
  updateprofile
}