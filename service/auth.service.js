import { createUser, findByEmail } from "../dao/user.dao.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async ( name , email , password ) => {
    const user = await findByEmail(email);
    if(user){
        throw new Error("User already exists");
    }
    const newUser = await createUser(name, email, password);
    if(!newUser){
        throw new Error("User registration failed");
    }
    const token = await signToken({ id: newUser._id });
    return token;
}

export const loginUser = async (email, password) => {
   const user = await findByEmail(email);
   if(!user || user.password !== password){
        throw new Error("Invalid email or password");
    }
    const token = await signToken({ id: user._id });
    return token;
}
