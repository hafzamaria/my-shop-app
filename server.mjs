import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import { stringToHash, varifyHash } from "bcrypt-inzi"
import jwt from 'jsonwebtoken' ///jwt work
import cookieParser from 'cookie-parser';///jwtwork

const SECRET = process.env.SECRET || "topsecret";///jwt work

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser()) ///jwt work

app.use(cors({/////jwt work
    origin: ['http://localhost:3000', "*", 'https://react-login-signup-app.netlify.app'],
    credentials: true
}));

let dbURI = 'mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/socialmrdiaBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////step 01 (create schema)///this validation is for security purpose//

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, },
  password: { type: String, required: true, },
  age: { type: Number, min: 17, max: 65, default: 18 },
  // subjects:Array,
  isMarried: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now }, //go to schema type (ctrl+f)typt on box date now & copy///
});

const userModel = mongoose.model('User1', userSchema);




app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne(
        { email: body.email },
        // { email:1, firstName:1, lastName:1, age:1, password:0 },
        "email firstName lastName age password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            var token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true
                            });

                            res.send({
                                message: "login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    age: data.age,
                                    _id: data._id
                                }
                            });
                            return;
                        } else {
                            console.log("user not found");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })



})
app.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true
    });

    res.send({ message: "Logout successful" });
})

app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, data) => {
        if (!err) {
            console.log("data: ", data);

            if (data) { // user already exist
                console.log("user already exist: ", data);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email.toLowerCase(),
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});

app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/users", async (req, res) => {

    try {
        let allUser = await userModel.find({}).exec();
        res.send(allUser);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})

app.get("/profile", async (req, res) => {

    try {
        let user = await userModel.findOne({ _id: req.body.token._id }).exec();
        res.send(user);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////

// app.post("/signup", (req, res) => {

    //     let body = req.body;
    
    //     if (!body.firstName
    //         || !body.lastName
    //         || !body.email
    //         || !body.password
    //     ) {
    //         res.status(400).send(
    //             `required fields missing, request example: 
    //                 {
    //                     "firstName": "John",
    //                     "lastName": "Doe",
    //                     "email": "abc@abc.com",
    //                     "password": "12345"
    //                 }`
    //         );
    //         return;
    //     }
    
    //     // check if user already exist // query email user
    //     userModel.findOne({ email: body.email }, (err, data) => {
    //         if (!err) {
    //             console.log("data: ", data);
    
    //             if (data) { // user already exist
    //                 console.log("user already exist: ", data);
    //                 res.status(400).send({ message: "user already exist,, please try a different email" });
    //                 return;
    
    //             } else { // user not already exist
    
    //                 stringToHash(body.password).then(hashString => {
    
    //                     userModel.create({
    //                         firstName: body.firstName,
    //                         lastName: body.lastName,
    //                         email: body.email.toLowerCase(),
    //                         password: hashString
    //                     },
    //                         (err, result) => {
    //                             if (!err) {
    //                                 console.log("data saved: ", result);
    //                                 res.status(201).send({ message: "user is created" });
    //                             } else {
    //                                 console.log("db error: ", err);
    //                                 res.status(500).send({ message: "internal server error" });
    //                             }
    //                         });
    //                 })
    
    //             }
    //         } else {
    //             console.log("db error: ", err);
    //             res.status(500).send({ message: "db error in query" });
    //             return;
    //         }
    //     })
    // });}


/////hm jtni b cheze database mai save karege sbke liye schema & model bnana hoga////

// app.post("/signup", (req, res) => {

//   let body = req.body;

//   if (!body.firstName  ////its a validation///
//       || !body.lastName
//       || !body.email
//       || !body.password
//   ) {
//       res.status(400).send(  ////we guide user by givinging eg//
//           `required fields missing, request example: 
//               {
//                   "firstName": "John",
//                   "lastName": "Doe",
//                   "email": "abc@abc.com",
//                   "password": "12345"
//               }`
//       );
//       return;
//   }

//   //////step04//////
//   let dbURI = 'mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/socialmrdiaBase?retryWrites=true&w=majority';
//   mongoose.connect(dbURI);
//   // check if user already exist // query email user
//   userModel.findOne({ email: body.email }, (err, data) => {
//       if (!err) {
//           console.log("data: ", data);

//           if (data) { // user already exist
//               console.log("user already exist: ", data);
//               res.status(400).send({ message: "user already exist,, please try a different email" });
//               return;

//           } else { // user not already exist

//             stringToHash(body.password).then(hashString => {

//                 userModel.create({
//                     firstName: body.firstName,
//                     lastName: body.lastName,
//                     email: body.email.toLowerCase(),
//                     password: hashString
//                 },
//                     (err, result) => {
//                         if (!err) {
//                             console.log("data saved: ", result);
//                             res.status(201).send({ message: "user is created" });
//                         } else {
//                             console.log("db error: ", err);
//                             res.status(500).send({ message: "internal server error" });
//                         }
//                     });
//             })

//         }
//     } else {
//         console.log("db error: ", err);
//         res.status(500).send({ message: "db error in query" });
//         return;
//     }
// })
// });



/////signup
// app.post("/signup", (req, res) => {

//     let body = req.body;
  
//     if (!body.firstName  ////its a validation///
//         || !body.lastName
//         || !body.email
//         || !body.password
//     ) {
//         res.status(400).send(  ////we guide user by givinging eg//
//             `required fields missing, request example: 
//                 {
//                     "firstName": "John",
//                     "lastName": "Doe",
//                     "email": "abc@abc.com",
//                     "password": "12345"
//                 }`
//         );
//         return;
//     }
  
//     //////step04//////
    
//     // check if user already exist // query email user
//     userModel.findOne({ email: body.email }, (err, data) => {
//         if (!err) {
//             console.log("data: ", data);
  
//             if (data) { // user already exist
//                 console.log("user already exist: ", data);
//                 res.status(400).send({ message: "user already exist,, please try a different email" });
//                 return;
  
//             } else { // user not already exist
  
//                 stringToHash(body.password).then(hashString => {
  
//                     let newUser = new userModel({
//                         firstName: body.firstName,
//                         lastName: body.lastName,
//                         email: body.email.toLowerCase(),
//                         password: hashString,
//                         _id: data._id
//                         // password:body.password,
//                     });
//                     newUser.save((err, result) => {
//                         if (!err) {
//                             console.log("data saved: ", result);
//                             res.status(201).send({ message: "user is created" });
//                         } else {
//                             console.log("db error: ", err);
//                             res.status(500).send({ message: "internal server error" });
//                         }
//                     });
//                 })
  
//             }
//         } else {
//             console.log("db error: ", err);
//             res.status(500).send({ message: "db error in query" });
//         }
//     })
//   });


  ////jwt work token verification

// app.use(function (req, res, next) {
//     console.log("req.cookies: ", req.cookies);

//     if (!req.cookies.Token) {
//         res.status(401).send({
//             message: "include http-only credentials with every request"
//         })
//         return;
//     }
//     jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
//         if (!err) {

//             console.log("decodedData: ", decodedData);

//             const nowDate = new Date().getTime() / 1000;

//             if (decodedData.exp < nowDate) {
//                 res.status(401).send("token expired")
//             } else {

//                 console.log("token approved");

//                 req.body.token = decodedData
//                 next();
//             }
//         } else {
//             res.status(401).send("invalid token")
//         }
//     });
// })
  /////login///
// app.post("/login", (req, res) => {
//     console.log("error" , error)
//     let body = req.body;

//     if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
//         res.status(400).send(
//             `required fields missing, request example: 
//                 {
//                     "email": "abc@abc.com",
//                     "password": "12345"
//                 }`
//         );
//         return;
//     }

//     // check if user already exist // query email user
//     userModel.findOne( { email: body.email },
//         'email firstName lastName age password', ///this is called projection
//         (err, data) => {
//         if (!err) {
//             console.log("data: ", data);

//             if (data) { // user found
//                 varifyHash(body.password, data.password).then(isMatched => {

//                     console.log("isMatched: ", isMatched);

//                     if (isMatched) {
//                         // TODO:  add JWT token

//                         var token = jwt.sign({ ////jwt work
//                             _id: data._id,
//                             email: data.email,
//                             iat: Math.floor(Date.now() / 1000) - 30, ///issue at
//                             exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),////expire
//                         }, SECRET);

//                         console.log("token: ", token);

//                         res.cookie('Token', token, {
//                             maxAge: 86_400_000, ////after 24hours expire
//                             httpOnly: true ////http cookie is secure
//                         });

//                         ///////token---cokies//

//                         res.send({ message: "login successful", 
//                         profile:{
//                         email:data.email,
//                         firstName:data.firstName,
//                        lastName:data.lastName},
//                        _id: data._id
//                     });
                      
//                     } else {
//                         console.log("user not found");
//                         res.status(401).send({ message: "Incorrect email or password" });
//                         return;
//                     }
//                 }   ///ismatched
//                 )   ///.then

//             }   ///if(data)
//              else { // user not already exist
//                 console.log("user not found");
//                 res.status(401).send({ message: "Incorrect email or password" });
//                 return;
//             }
//         }   ///if(!err)
//          else {
//             console.log("db error: ", err);
//             res.status(500).send({ message: "login failed, please try later" });
//             return;
//         }
//     }   ///(err,data)
//     )    ///.findone



// }///login
// )//app.post


///////jwt work///
// app.post("/logout", (req, res) => {

//     res.cookie('Token', '', {
//         maxAge: 0,
//         httpOnly: true
//     });

//     res.send({ message: "Logout successful" });
// })
///////


  



//////////

// app.get("/users", async (req, res) => {

//     try {
//         let allUser = await userModel.find({}).exec();
//         res.send(allUser);

//     } catch (error) {
//         res.status(500).send({ message: "error getting users" });
//     }
// })





// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
/////jwt work//
// app.get("/profile", async (req, res) => {

//     try {
//         let user = await userModel.findOne({ _id: req.body.token._id }).exec();
//         res.send(user);

//     } catch (error) {
//         res.status(500).send({ message: "error getting users" });
//     }
// })
////////////////////////////////////////