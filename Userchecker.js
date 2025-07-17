import { findById } from "./dao/user.dao.js";
import { verifyToken } from "./utils/helper.js";



export const isAuthenticated =  async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).send("Unauthorized");
        return  "Unauthorized";
    }

    // console.log("Verifying token:", token);
    try {
        const decoded = verifyToken(token);
        console.log("Token decoded successfully:", decoded);

        const user = await findById(decoded.id);

        req.user = user;
        console.log("User found:", user);
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).send("Unauthorized");
    }
}