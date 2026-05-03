import Organisation from "@/models/Organisation.js";
import User from "@/models/User.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const registerOrganisation = async (req: Request, res: Response) => {
  const { name, email, password, orgName, subscription_plan } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Organisation already exists!" });
  }

  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      const [orgnisation] = await Organisation.create(
        [{ name: orgName, subscription_plan }],
        { session },
      );

      const [user] = await User.create([{ name, email, password, orgId: orgnisation._id, role: 'admin' }], {
        session,
      });
    });

    result = { user, organisation };

    return res
      .status(201)
      .json({ message: "Organisation created successfully!", data: result });
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
