import mongoose from "mongoose";
import validator from "validator";

// Defining Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tc: {
        type: Boolean,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    verifyToken: {
        type: String
    }
})

// userSchema.methods.generateAuthToken = async function () {
//     try {
//         let token = jwt.sign({ userID: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
//         this.tokens = this.tokens.concat({ token: token })
//         await this.save()
//         return token
//     } catch (error) {
//         resizeBy.status(422).send({
//             status: "error",
//             message: "server error"
//         })
//     }
// }

// Creating Model
const UserModel = mongoose.model('users', userSchema)

export default UserModel;