const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://sandeepenact:jtFunpsiGhbcnlXF@cluster0.vmhkw2c.mongodb.net/?retryWrites=true&w=majority")
.then((result) => {
    console.log("Mongo is connect successfull")
}).catch((err) => {
    console.log(err.message)
});

let express=require('express')
let app=express()


let userRoutes=require('./Routes/userroutes');
app.use('/ums',userRoutes);

let adminRoutes=require('./Routes/adminroutes');
app.use('/ums/admin',adminRoutes);


app.listen(3000,()=>{
    console.log('server start on port 3000')
})