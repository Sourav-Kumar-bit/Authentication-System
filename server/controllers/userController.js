import UserModel from '../models/User.js';
import bcrypt from 'bcrypt'; // to hash password
import jwt from 'jsonwebtoken';
import transporter from '../config/emailConfig.js';

class UserController {

    // To register the user
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        if (tc) {
            if (!name || !password || !password_confirmation || !tc) {
                res.status(422).send({
                    status: "error",
                    message: "Please fill all details"
                })
            } else {
                try {
                    const user = await UserModel.findOne({ email: email });
                    if (user) {
                        res.status(422).send({
                            status: "error",
                            message: "Email already in use"
                        })
                    } else {
                        if (password !== password_confirmation) {
                            res.status(422).send({
                                status: "error",
                                message: "Password mismatch"
                            })
                        } else {
                            const salt = await bcrypt.genSalt(12);
                            const hashedPassword = await bcrypt.hash(password, salt)
                            const userData = new UserModel({
                                name: name,
                                email: email,
                                password: hashedPassword,
                                tc: tc
                            })
                            await userData.save();
                            const saved_user = await UserModel.findOne({ email: email })

                            // Generating JWT token
                            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                            res.status(201).send({
                                status: "success",
                                message: "Registration Successful",
                                token: token
                            })
                        }
                    }
                } catch (error) {
                    res.status(500).send({
                        status: "error",
                        message: "Some technical error occured"
                    })
                }
            }
        } else {
            res.send({ "status": "error", "message": "Please accept Terms & Conditions" })
        }
    }

    // To log in the user
    static UserLogin = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).send({
                status: "error",
                message: "Please fill all fields"
            })
        }
        try {
            const user = await UserModel.findOne({ email: email });
            if (user != null) {
                const isMatch = await bcrypt.compare(password, user.password)
                if ((user.email === email) && isMatch) {
                    // Generating JWT token
                    // const token = await user.generateAuthToken()
                    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                    user.tokens = user.tokens.concat({ token: token })
                    await user.save()

                    // Generating cookie
                    res.cookie('usercookie', token, {
                        expiresIn: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })
                    res.status(201).send({
                        status: "success",
                        message: "Login Successful",
                        userDetails: user,
                        token: token
                    })
                } else {
                    res.status(200).send({
                        status: "failed",
                        message: "Please enter correct Email or Password"
                    })
                }
            } else {
                res.send({ "status": "failed", "message": "Invalid user" })
            }
        } catch (error) {
            res.status(422).send({
                status: "error",
                message: "Unable to login"
            })
        }
    }

    // To check if the user is already logged in
    static LoggedUserData = async (req, res) => {
        res.status(201).send({
            status: "success",
            user: req.user
        })
    }

    // To log out the user
    static LogoutUser = async (req, res) => {
        try {
            res.clearCookie('usercookie', { path: "/" })
            res.status(201).send({
                status: "success",
                user: req.user
            })
        } catch (error) {
            res.send({
                status: "failed",
                message: "Some Technical error Occured"
            })
        }
    }

    // To change password while user is logged in
    static ChangeUserPassword = async (req, res) => {
        const { password, password_new } = req.body;
        const { id } = req.headers
        try {
            const user = await UserModel.findOne({ _id: id });
            const isMatch = await bcrypt.compare(password, user.password)
            if ((password && password_new) && isMatch) {
                if (password === password_new) {
                    res.send({ "status": "failed", "message": "Old and New passwords cannot be same" })
                } else {
                    const salt = await bcrypt.genSalt(12);
                    const newHashedPassword = await bcrypt.hash(password_new, salt);
                    await UserModel.findByIdAndUpdate(req.user._id, {
                        $set: { password: newHashedPassword }
                    })
                    res.send({ "status": "success", "message": "Password updated successfully" })
                }
            } else {
                res.send({ "status": "failed", "message": "Please fill valid password" })
            }
        } catch (error) {
        }
    }

    // To send reset email to user's registered email address
    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body;
        if (email) {
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const secret = process.env.JWT_SECRET_KEY;
                // const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '5m' })
                const setUserToken = await UserModel.findByIdAndUpdate({ _id: user._id }, { verifyToken: token }, { new: true })
                const resetLink = `http://localhost:3000/forgotpassword/${user._id}/${token}`;

                // Send Email
                if (setUserToken) {
                    try {
                        let message = {
                            from: process.env.EMAIL_USER,
                            to: user.email,
                            subject: "Password Reset",
                            text: "Hello from Nodemailer",
                            html: `<a href=${resetLink}>Click Here</a> to reset your password <br /> <p>This link will expire in 5 minutes</p>`
                        }
                        transporter.sendMail(message, (err, info) => {
                            if (err) {
                                res.status(401).send({ "status": "error", "message": "Email not sent, Please try again" })
                            } else {
                                res.status(201).send({ "status": "success", "message": "Password reset email sent! Please check your registered Email", "info": info })
                            }
                        })
                    } catch (error) {
                        res.status(500).send({ "status": "failed", "message": "Some error occured, please try again." })
                    }
                } else {
                    res.status(500).send({ "status": "failed", "message": "Some error occured, please try again." })
                }
            } else {
                res.send({ "status": "failed", "message": "User does not exists" })
            }
        } else {
            res.status(401).send({ "status": "failed", "message": "Please enter email" })
        }
    }

    // To validate user for resetting the password using token
    static ResetUserPassword = async (req, res) => {
        const { id, token } = req.params;
        try {
            const user = await UserModel.findOne({ _id: id, verifyToken: token })
            const secret = process.env.JWT_SECRET_KEY
            // const secret = user._id + process.env.JWT_SECRET_KEY
            jwt.verify(token, secret)
            if (user) {
                res.status(201).json({
                    status: "success",
                    validuser: user
                })
            } else {
                res.status(401).json({
                    status: "failed",
                    message: "user does not exist"
                })
            }
        } catch (error) {
            res.status(401).send({
                status: "error",
                message: "Invalid token"
            })
        }
    }

    static UpdateUserPassword = async (req, res) => {
        const { password } = req.body;
        const { id, token } = req.params;

        try {
            const user = await UserModel.findOne({ _id: id, verifyToken: token })
            // const newSecret = user._id + process.env.JWT_SECRET_KEY
            const secret = process.env.JWT_SECRET_KEY
            jwt.verify(token, secret)
            if (user) {
                const salt = await bcrypt.genSalt(12);
                const newHashedPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(user._id, {
                    $set: { password: newHashedPassword }
                })
                res.status(201).send({ "status": "success", "message": "Password reset successfully" })
            } else {
                res.status(201).send({ "status": "failed", "message": "User does not exist" })
            }
        } catch (error) {
            res.send({ "status": "failed", "message": "Invalid token" })
        }
    }
}

export default UserController;