import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    let token;

    token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not authorized as a user"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Not authorized as a user"
            })
        }

        if(!user.isActive){
            return res.status(401).json({
                success: false,
                message: "Account is not active, contact admin"
            })
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized as a user"
        })
    }
} 

export const isAdmin = async (req, res, next) => {
    if(req.user && req.user.role === "ADMIN" &&  req.user.email === process.env.ADMIN_EMAIL){
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "Not authorized as an admin"
        })
    }
}
