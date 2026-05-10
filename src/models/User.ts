import { Model, model, Schema, Types, type Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserInterface extends Document {
    name: string,
    orgId: Types.ObjectId,
    email: string,
    password: string,
    role: 'admin' | 'editor' | 'viewer',
    is_active: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface UserMethods {
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<UserInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'viewer'],
            default: 'viewer'
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: Partial<UserInterface>) => {
                delete ret.password;
                return ret;
            }
        }
    }
)

userSchema.methods.comparePassword = async function (password: string) {

    return await bcrypt.compare(password, this.password);

}

userSchema.pre('save', async function () {
    const user = this;

    // Encrypt password
    if(user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
})

// need to implement findOneAndUpdate middleware for updates. Currently use find().save() uses two db rounds.

type UserModel = Model<UserInterface, {}, UserMethods>;

const User = model<UserInterface, UserModel>('User', userSchema);
export default User;