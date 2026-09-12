import { z } from 'zod';

export const profileRegistrationSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  fullName: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }).optional(),
  gender: z.string().min(1, { message: 'Gender is required' }),
  age: z.coerce.number().min(18, { message: 'Candidate must be at least 18 years old' }).max(100, { message: 'Invalid age' }).optional(),
  height: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  motherTongue: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  annualIncome: z.string().optional(),
  phone: z.string().optional(),
  about: z.string().optional(),
  aboutMe: z.string().optional(),
  image: z.string().optional(),
  profileImage: z.string().optional(),
  profilePhoto: z.string().optional(),
  photoUrl: z.string().optional(),
  verified: z.boolean().optional(),
  approved: z.boolean().optional(),
  status: z.string().optional()
}).passthrough().refine(data => data.name || data.fullName, {
  message: "Either 'name' or 'fullName' is required.",
  path: ['name']
});
