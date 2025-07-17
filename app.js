import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import  express from 'express';
const app = express();
import mongoose from 'mongoose';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { nanoid } from 'nanoid';
import cors from 'cors';
import auth_router from './routes/userauth.route.js';
import User from './db/userSchema.js';
import { isAuthenticated } from './Userchecker.js';

console.log("JWT Secret in app.js:", process.env.JWT_SECRET);
// app.use(cors());

app.use(cookieParser());
// app.use(isAuthenticated);
// ✅ Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

//dbs


 async function connectDB() {
   await mongoose.connect(process.env.DB)

 }
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


const urlSchema = new mongoose.Schema({

    full_url : String,
    short_url: String,
    count: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Url = mongoose.model("Url", urlSchema);



app.post("/api/create",isAuthenticated,async (req,res) => {
    const {url } = req.body;
   console.log(`Received URL: ${url}`);
   console.log("User in request:", req.user);

    const data = await Url.findOne({full_url : url})
    console.log("Data found in DB:", data);

      let short_Url;
   if(data) {
      short_Url = data.short_url;
   }else{
      short_Url = nanoid(6);
   }

   if(req.user) {
      const newurl = new Url({
              full_url: url,
              short_url: short_Url,
              count: 0,
              user: req.user._id // Associate the URL with the authenticated user
            })
              newurl.save()
              .then((res) => console.log(res))
              .catch((err) => console.error(err));
      res.send(`http://localhost:3000/${short_Url}`);
   } else {
      const newurl = new Url({
              url: url,
              short_url: short_Url,
              count: 0,
            })
              newurl.save()
              .then((res) => console.log(res))
              .catch((err) => console.error(err));
            res.send("full_url : " + full_url + " short_url : " + short_url);
    }
})

app.post("/api/create2", isAuthenticated,(req,res) => {
   const {full_url,short_url} = req.body;
    console.log("User in request:", req.user);
   const newurl = new Url({
     full_url: full_url,
     short_url: short_url,
     count: 0,
     user: req.user._id // Associate the URL with the authenticated user,
   })
    newurl.save()
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
  res.send("full_url : " + full_url + "short_url" + short_url);
})

app.get ("/:id",(req,res) => {
   const {id} = req.params;
   Url.findOne({short_url: id})
    .then((data) => {
      if(data) {
        data.count += 1;
        data.save();
        res.redirect(data.full_url);
      } else {
        res.status(404).send("URL not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server error");
    });
   
})

app.listen(3000,() => {
    console.log('Server is running on port 3000');
})


// authentication 
app.use("/api/auth",auth_router);