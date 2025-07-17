import  jwt  from "jsonwebtoken"

export const signToken = (user) => {
    console.log("JWT Secret:", process.env.JWT_SECRET);
     console.log("Signing token for user:", user);
     
 return jwt.sign(user,
    process.env.JWT_SECRET,{expiresIn: "29m"}
 )
}

export const verifyToken = (token) => {
   return token ? jwt.verify(token, process.env.JWT_SECRET) : null;
}



      