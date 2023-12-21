import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

// Route Level Middleware - to protect route
router.use('/changePassword', checkUserAuth);
router.use('/loggedUser', checkUserAuth);
router.use('/logout', checkUserAuth);

// Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.UserLogin);
router.post('/send-password-reset-mail', UserController.sendUserPasswordResetEmail);
router.get('/resetPassword/:id/:token', UserController.ResetUserPassword);
router.post('/:id/:token', UserController.UpdateUserPassword);

// Private Routes
router.post('/changePassword', UserController.ChangeUserPassword);
router.get('/loggedUser', UserController.LoggedUserData)
router.get('/logout', UserController.LogoutUser)

export default router;