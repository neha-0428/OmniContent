import z from "zod";

const fieldValidationSchema = z.object({
  name: z.string().trim().min(1, "Field name cannot be empty").lowercase(),
  type: z.enum(["text", "number", "boolean", "rich-text", "media"], {
    error: () => ({
      message: "Type must be text, number, boolean, rich-text, or media",
    }),
  }),
  required: z.boolean().default(false),
});

export const createCollectionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  fields: z
    .array(fieldValidationSchema)
    .min(1, "A collection must have at least one field"), // Prevents creating an empty blueprint
});
