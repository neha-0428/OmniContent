import { model, Schema, Types, type Document } from "mongoose";

export interface UserInterface extends Document {
    name: string,
    orgId: Types.ObjectId,
    email: string,
    password: string,
    role: 'admin' | 'editor' | 'viewer',
}

const userSchema = new Schema<UserInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
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
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'viewer'],
            default: 'viewer'
        }
    },
    {
        timestamps: true
    }
)

const User = model<UserInterface>('User', userSchema);
export default User;