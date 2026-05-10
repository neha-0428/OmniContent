import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  orgName: z.string().min(2, "Organization name is required"),
  subscription_plan: z.enum(["Free", "Pro", "Enterprise"]),
});

// This type can be exported to your frontend
export type RegisterInput = z.infer<typeof registerSchema>;
