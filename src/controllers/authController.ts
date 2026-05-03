import Organisation, { OrganisationInterface } from "@/models/Organisation.js";
import User, { UserInterface } from "@/models/User.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const registerOrganisation = async (req: Request, res: Response) => {
  const { name, email, password, orgName, subscription_plan } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Organisation already exists!" });
  }

  const session = await mongoose.startSession();

  let response;

  try {
    await session.withTransaction(async () => {

      const organisations = await Organisation.create(
        [{ name: orgName, subscription_plan }],
        { session },
      ) as OrganisationInterface[];

      const organisation = organisations[0];

      if(!organisation) throw new Error("Failed to create Organisation!");

      const users = await User.create([{ name, email, password, orgId: organisation._id, role: 'admin' }], {
        session,
      }) as UserInterface[];

      const user = users[0]

      if(!user) throw new Error("Failed to create User!");

      response = {
        user: {id: user._id, name: user.name, email: user.email},
        organisation: { id: organisation._id, name: organisation.name, slug: organisation.slug }
      }
    });


    return res
      .status(201)
      .json({ message: "Organisation created successfully!", data: response });
  } catch (err: any) {

    if(err.code === 11000) {
        return res.status(400).json({ message: "Organization name/slug or email already exists." })
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
      
  } finally {
    session.endSession();
  }
};
