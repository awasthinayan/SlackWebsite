import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string(),
  phone: z.string().min(10, "Phone must be 10 digits"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string(),
  dob: z.string(), // or z.date()
});
