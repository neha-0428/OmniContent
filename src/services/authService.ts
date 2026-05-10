import Organisation, { OrganisationInterface } from "@/models/Organisation.js"
import User, { UserInterface } from "@/models/User.js"
import { toTitleCase } from "@/utils/helpers.js"
import mongoose from "mongoose"

export interface RegisterDTO {
    name: string
    email: string
    password: string
    orgName: string
    subscription_plan: 'Free' | 'Pro' | 'Enterprise'
}

export const registerService = async (data: RegisterDTO) => {

    let session = await mongoose.startSession()
    let response;

    try {
        await session.withTransaction(async () => {

            const organisations = await Organisation.create(
                [{ name: data.orgName, subscription_plan: toTitleCase(data.subscription_plan) }],
                { session },
            ) as OrganisationInterface[];

            const organisation = organisations[0]

            if (!organisation) throw new Error('Failed to create Organisation');

            const users = await User.create(
                [{ name: data.name, email: data.email, password: data.password, orgId: organisation._id, role: 'admin' }],
                { session },
            ) as UserInterface[];

            const user = users[0]

            if (!user) throw new Error('Failed to create User')

            response = {
                user: {id: user._id, name: user.name, email: user.email},
                organisation: { id: organisation._id, name: organisation.name, slug: organisation.slug }
            }
        })

        return response;

    } finally {
        session.endSession();
    }
}