import { Schema, model, type Document } from 'mongoose';

export interface OrganizationInterface extends Document {
    name: string;
    slug: string;
    settings: {
        theme: 'light' | 'dark',
        language: string
    },
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}

const organizationSchema = new Schema<OrganizationInterface>(
    {
        name: {
            type: String,
            required: [true, 'Organization Name is required'],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        settings: {
            theme: { type: String, enum: ['light', 'dark'], default: 'light'},
            language: { type: String, default: 'en'}
        },
        isActive: {
            type: Boolean,
            default: true
        },
    }, {
        timestamps: true
    }
)

const Organization = model<OrganizationInterface>('Organization', organizationSchema);
export default Organization;