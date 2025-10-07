import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(1, "Name is required").max(50, "Name is too long").optional(),
});

// Vault item validation schema
export const vaultItemSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  password: z.string()
    .min(1, "Password is required")
    .max(500, "Password is too long"),
  url: z.string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  tags: z.array(z.string().max(50, "Tag too long"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VaultItemInput = z.infer<typeof vaultItemSchema>;
