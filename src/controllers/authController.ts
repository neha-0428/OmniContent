import Organisation from "@/models/Organisation.js";
import { Request, Response } from "express";


export const registerOrganisation = async (req: Request, res: Response) => {
    try {
        const { name, slug, isActive, subscription_plan, settings } = req.body;

        const existingOrganisation = await Organisation.findOne({ slug })
        if(existingOrganisation) {
            return res.status(400).json({ message: "Organisation already exists!" })
        }

        const organisation = new Organisation({ name, slug, isActive, subscription_plan, settings });
        await organisation.save();

        return res.status(201).json({ message: "Organisation created successfully!" })

    } catch (err) {
        
        return res.status(500).json({ message: "Internal Server Error", error: err })

    }
}