const { Modal } = require('../Modal/usermodal');
const rendomstring = require('randomstring')
const nodemailer = require('nodemailer');
const { render, response } = require('../Routes/adminroutes');
//---For User data into PDF formet;
let ejs = require('ejs');
let path = require('path');
let pdf = require('html-pdf');
let fs = require('fs');


const mailsend = async (name, email, token) => {
  try {
    var Transporter = nodemailer.createTransport({
      //  service:"Gmail",
      host: "mail.sandeepdeveloper.com",
      port: 465,
      requireTLS: true,

      auth: {
        user:'management_system@sandeepdeveloper.com',
        pass:'(@eAb-x;d,$#',
      },
    });
    const mailOption = {
      from:"management_system@sandeepdeveloper.com",
      to: email,
      subject: "For Reset Your password",
      html: '<p>Hii ' + name + ' to Enjoy my website <a href="http://localhost:3000/admin/reset-pass?token=' + token + '">Reset Password</a></p>'
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
//For New user mail
const new_user_mail = async (name, email, password, user_id) => {
  try {
    var Transporter = nodemailer.createTransport({
      //  service:"Gmail",
      host: "mail.sandeepdeveloper.com",
      port: 465,
      requireTLS: true,

      auth: {
        user: "management_system@sandeepdeveloper.com",
        pass: "(@eAb-x;d,$#",
      },
    });
    const mailOption = {
      from: "management_system@sandeepdeveloper.com",
      to: email,
      subject: "For add new user by Admin",
      html: '<p>Hii ' + name + ' to Enjoy my website <a href="http://localhost:3000/verify?id=' + user_id + '">Click to add new user</a> <br><br>' + email + '<b>and your password is</b>:' + password + '</p>'
    };
    Transporter.sendMail(mailOption, (error, info)=> {
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





const adminLogin = async (req, res) => {
  try {
    res.render('adminLogin')
  } catch (error) {
    console.log(error.message)


  }
}
const adminData = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let userData = await Modal.findOne({ email: email, password: password });
    console.log(userData)
    if (userData) {
      if (userData.is_admine === 0) {
        res.render('adminLogin', { message: 'Admin Is Not Exist' })
      } else {
        req.session.user_id = userData._id;

        res.redirect('/ums/admin/Home')
      }
    } else {
      res.render('adminLogin', { message: 'Mail and password is incorrect' })
    }
  } catch (error) {
    console.log(error.message)


  }
}
const adminHome = async (req, res) => {
  try {
    const admin = await Modal.findById({ _id: req.session.user_id })
    res.render('adminHome', { admin })
  } catch (error) {
    console.log(error.message)


  };
};
const LogOut = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/ums/Logout")
  } catch (error) {
    console.log(error.message)
  }
}

//---Forget Password
const forgetpass = async (req, res) => {
  try {
    res.render('forgetpass')
  } catch (error) {
    console.log(error.message)

  }
}
const forgetpassverify = async (req, res) => {
  try {
    let email = req.body.email;
    let maildata = await Modal.findOne({ email: email });
    if (maildata) {
      if (maildata.is_admine == 0) {
        res.render('forgetpass', { message: 'Email is incorrect' });
      } else {
        const Rendomstring = rendomstring.generate();
        let updatedata = await Modal.updateOne({ email: email }, { $set: { token: Rendomstring } });
        mailsend(maildata.name, maildata.email, Rendomstring); // Fix the variable name here
        res.render('forgetpass', { message: 'Please check your mail to reset your password' });
      }
    } else {
      res.render('forgetpass', { message: 'Email is not exist' });
    }
  } catch (error) {
    console.log(error.message);
  }
}

const updatepass = async (req, res) => {
  try {
    let token = req.query.token;
    let tokendata = await Modal.findOne({ token: token });
    if (tokendata) {
      console.log(tokendata);
      res.render('updatepass', { user_id: tokendata._id });
    } else {

      res.render('404', { message: 'Invalid link' });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const resetpass = async (req, res) => {
  try {
    let iddata = req.body.data; // Use "userdata" instead of "user_id"
    let password = req.body.password;
    console.log(iddata);

    let userData = await Modal.findByIdAndUpdate({ _id: iddata }, { $set: { password: password, token: '' } });
    if (userData) {
      res.redirect('/ums/admin');
    } else {
      res.render('updatepass', { message: 'password is not update' });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//==Add new user
const new_user = async (req, res) => {
  try {
    res.render('new-user')
  } catch (error) {
    console.log(error.message)

  }
}
const adminDashboard = async (req, res) => {
  try {

    const data = await Modal.find({ is_admine: 0 });

    res.render('Dashboard', { data })
  } catch (error) {
    console.log(error.message)

  }
}

const new_user_data = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const image = req.file.filename;
    const password = rendomstring.generate(7);
    let data = [name, email, mobile, image, password];
    let store = new Modal({
      name: name,
      email: email,
      mobile: mobile,
      image: image,
      password: password,
      is_admine: 0
    })
    let save = await store.save();
    if (save) {
      new_user_mail(save.name, save.email, save.password, save._id)
      res.redirect('/ums/admin/dashboard');

    } else {
      res.render('new-user', { message: 'Form is not submit' })
    }


  } catch (error) {
    console.log(error.message)

  }
}

//---Edit users
const edituser = async (req, res) => {
  try {
    let id = req.query.id.trim();
    let data = await Modal.findById({ _id: id });
    if (data) {
      res.render('edit-user', { data })

    }
  } catch (error) {
    console.log(error.message)

  }
}

const edituserdata = async (req, res) => {
  try {
    let id = req.body.data;
    let updatedata = await Modal.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          is_varified: req.body.is_verified // I assume it's "is_verified" instead of "is_varified"
        }
      },
      { new: true }
    );
    console.log(updatedata);
    res.redirect('/ums/admin/dashboard');
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately
  }
}
//----For delete user
const deleteusers = async (req, res) => {
  try {
    let data = req.query.id;
    const cut = await Modal.deleteOne({ _id: data });

    res.redirect('/ums/admin/dashboard')
  } catch (error) {
    console.log(error.message)

  }
}

///-For export data into pdf 
const exportdata = async (req, res) => {
  try {
    // res.render('exportpdfdata')
    const retrive = await Modal.find({ is_admine: 0 }); // Wait for the data to be retrieved
    const data = {
      data: retrive,
    };
    const filename = path.resolve(__dirname, '../views/admin/exportpdfdata.ejs');
    let htmldata = fs.readFileSync(filename).toString();
    let option = {
      format: 'A3',
      orientation: 'portrait',
      border: '20mm'
    };
    let ejsdata = ejs.render(htmldata, data);
    pdf.create(ejsdata, option).toFile('users_data.pdf', (err, response) => {
      if (err) console.log(err.message);
      const filepath = path.resolve(__dirname, '../users_data.pdf');
      const fsdata = fs.readFile(filepath, (err, file) => {
        if (err) {
          console.log(err.message);

        }
        res.setHeader('content-type', 'application/pdf')
        res.setHeader('content-disposition', 'attechment;filename="users_data.pdf"')
        res.send(file)
      })
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminLogin,
  adminData,
  adminHome,
  LogOut,
  forgetpass,
  forgetpassverify,
  updatepass,
  resetpass,
  adminDashboard,
  new_user,
  new_user_data,
  edituser,
  edituserdata,
  deleteusers,
  exportdata

}