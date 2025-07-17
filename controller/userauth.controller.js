import { findByEmail } from "../dao/user.dao.js";
import { loginUser, registerUser } from "../service/auth.service.js";
import { isAuthenticated } from "../Userchecker.js";

export const register = async (req,res) =>{
    const {name, email, password} = req.body;
    const token = await registerUser(name, email, password);

    console.log(
      "Registering user with token:" + token
    );
    

    // Set the token in a cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour in ms
    });

    if (!token) {
        return res.status(400).send("Registration failed");
    }

        
    res.status(200).send("Register endpoint hit");
    console.log("User registered successfully backend:", { name, email });
}

export const login = async (req,res) =>{
    const {email, password} = req.body;
    const token  = await loginUser(email, password);

   const user = await findByEmail(email);

    // Set the token in a cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour in ms
    });

    req.user = user;
    
     if (!token) {
        return res.status(400).send("Login failed");
    }

    //  console.log("Logging in user :", user);
  return res.status(200).json({
        message: "Login successful",
        user: {
            name: user.name,
            email: user.email,
            id: user._id
        }
    });

}


export const Check_me = async (req, res)  => { 

    console.log("User in Check_me:", req.user);

    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Return the authenticated user's information
        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error("Error in Check_me:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req,res) => {
    res.clearCookie("token" , {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour in ms
    })

    res.status(200).json({message : "Logout Successfull !!"})
}