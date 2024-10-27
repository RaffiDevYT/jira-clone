// import { z } from "zod";

// export const createWorkspaceSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(1, { message: "Required" })
//     .max(256, { message: "couldn't be more than 256 characters" }),
//   image: z
//     .union([
//       z.instanceof(File),
//       z.string().transform((value) => (value === "" ? undefined : value)),
//     ])
//     .optional(),
// });

// export const updateWorkspaceSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(1, { message: "Must be 1 or more characters" })
//     .max(256, { message: "couldn't be more than 256 characters" })
//     .optional(),
//   image: z
//     .union([
//       z.instanceof(File),
//       z.string().transform((value) => (value === "" ? undefined : value)),
//     ])
//     .optional(),
// });


import { z } from "zod";

// Check if `File` is defined in the current environment
const isFileDefined = typeof File !== "undefined";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(256, { message: "couldn't be more than 256 characters" }),
  image: z
    .union([
      isFileDefined ? z.instanceof(File) : z.any(), // Use z.any() if File is not defined
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Must be 1 or more characters" })
    .max(256, { message: "couldn't be more than 256 characters" })
    .optional(),
  image: z
    .union([
      isFileDefined ? z.instanceof(File) : z.any(), // Use z.any() if File is not defined
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
