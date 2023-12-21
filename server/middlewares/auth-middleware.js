import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization;

        // Verifying token
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // Get user from token
        req.user = await UserModel.findById(userID).select('-password')
        next()
    } catch (error) {
        res.status(200).send({
            status: "failed",
            message: "Login to continue"
        })
    }

    // OLD CODE

    // let token 
    // // Get token from header
    // const { authorization } = req.headers;

    // if (authorization && authorization.startsWith('Bearer')) {
    //     try {
    //         token = authorization.split(' ')[1]

    //         // Verifying bearer token
    //         const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

    //         // Get user from token
    //         req.user = await UserModel.findById(userID).select('-password')
    //         next()
    //     } catch (error) {
    //         res.status(401).send({ "status": "failed", "message": "Unauthorised User" })
    //     }
    // } else {
    //     res.status(401).send({ "status": "failed", "message": "Unauthorised User, No Token found" })
    // }
}

export default checkUserAuth;