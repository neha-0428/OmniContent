import { Schema, model, type Document } from 'mongoose';
import slugify from "slugify";

export interface OrganisationInterface extends Document {
    name: string,
    slug: string,
    settings: {
        theme: 'light' | 'dark',
    },
    isActive: boolean,
    subscription_plan: string,
    createdAt: Date,
    updatedAt: Date
}

const organisationSchema = new Schema<OrganisationInterface>(
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
        isActive: {
            type: Boolean,
            default: true
        },
        subscription_plan: {
            type: String,
            enum: ['Free', 'Pro', 'Enterprise'],
            default: 'Free'
        },
        settings: {
            theme: { 
                type: String,
                enum: ['light', 'dark'],
                default: 'light'
            },
        },
    }, {
        timestamps: true
    }
)

organisationSchema.pre('save', function () {
    const organisation = this;

    if(organisation.isModified('name')) {
        organisation.slug = slugify(organisation.name, {
            lower: true,
            strict: true
        });
    }

})
    
const Organisation = model<OrganisationInterface>('Organisation', organisationSchema);
export default Organisation;