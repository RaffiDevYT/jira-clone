// import { Hono } from "hono";
// import { ID, Query } from "node-appwrite";
// import { zValidator } from "@hono/zod-validator";

// import { MemberRole } from "@/features/members/types";
// import { getMember } from "@/features/members/utils";

// import { sessionMiddleware } from "@/lib/session-middleware";
// import {
//   DATABASE_ID,
//   IMAGES_BUCKET_ID,
//   MEMBERS_ID,
//   WORKSPACES_ID,
// } from "@/config";
// import { generateInviteCode } from "@/lib/utils";

// import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
// import { Workspace } from "../types";

// const workspaces = new Hono()
//   .get("/", sessionMiddleware, async (c) => {
//     const user = c.get("user");
//     const databases = c.get("databases");

//     const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
//       Query.equal("userId", user.$id),
//     ]);

//     if (members.total === 0) {
//       return c.json({ data: { documents: [] }, total: 0 });
//     }

//     const workspaceIds = members.documents.map((member) => member.workspaceId);

//     const workspaces = await databases.listDocuments(
//       DATABASE_ID,
//       WORKSPACES_ID,
//       [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
//     );

//     return c.json({
//       data: workspaces,
//       success: true,
//       message: "fetched workspace successfully",
//     });
//   })
//   .post(
//     "/",
//     sessionMiddleware,
//     zValidator("form", createWorkspaceSchema),
//     async (c) => {
//       const user = c.get("user");
//       const databases = c.get("databases");
//       const storage = c.get("storage");

//       const { name, image } = c.req.valid("form");

//       let uploadedImageUrl: string | undefined;

//       if (image instanceof File) {
//         const file = await storage.createFile(
//           IMAGES_BUCKET_ID,
//           ID.unique(),
//           image
//         );

//         /*
//         ArrayBuffer: Raw binary data.
//         Base64: Textual encoding of binary data.      
//         (ArrayBuffer to Base64) when you need to send the binary data as text (e.g., in JSON, HTML, etc.).
//       */

//         const arrayBuffer = await storage.getFilePreview(
//           IMAGES_BUCKET_ID,
//           file.$id
//         );

//         uploadedImageUrl = `data:image/png;base64,${Buffer.from(
//           arrayBuffer
//         ).toString("base64")}`;
//       }

//       const workspace = await databases.createDocument(
//         DATABASE_ID,
//         WORKSPACES_ID,
//         ID.unique(),
//         {
//           name,
//           userId: user.$id,
//           imageUrl: uploadedImageUrl,
//           inviteCode: generateInviteCode(6),
//         }
//       );

//       await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
//         userId: user.$id,
//         workspaceId: workspace.$id,
//         role: MemberRole.ADMIN,
//       });

//       return c.json({
//         data: workspace,
//         success: true,
//         message: "created workspace successfully",
//       });
//     }
//   )
//   .patch(
//     "/:workspaceId",
//     sessionMiddleware,
//     zValidator("form", updateWorkspaceSchema),
//     async (c) => {
//       const user = c.get("user");
//       const databases = c.get("databases");
//       const storage = c.get("storage");

//       const { name, image } = c.req.valid("form");

//       const workspaceId = c.req.param("workspaceId");

//       const member = await getMember({
//         databases,
//         workspaceId,
//         userId: user.$id,
//       });

//       if (!member || member.role !== MemberRole.ADMIN) {
//         return c.json(
//           {
//             success: false,
//             message: "unauthorized",
//           },
//           401
//         );
//       }

//       let uploadedImageUrl: string | undefined;

//       if (image instanceof File) {
//         const file = await storage.createFile(
//           IMAGES_BUCKET_ID,
//           ID.unique(),
//           image
//         );

//         /*
//         ArrayBuffer: Raw binary data.
//         Base64: Textual encoding of binary data.      
//         (ArrayBuffer to Base64) when you need to send the binary data as text (e.g., in JSON, HTML, etc.).
//       */

//         const arrayBuffer = await storage.getFilePreview(
//           IMAGES_BUCKET_ID,
//           file.$id
//         );

//         uploadedImageUrl = `data:image/png;base64,${Buffer.from(
//           arrayBuffer
//         ).toString("base64")}`;
//       } else {
//         uploadedImageUrl = image;
//       }

//       const workspace = await databases.updateDocument(
//         DATABASE_ID,
//         WORKSPACES_ID,
//         workspaceId,
//         {
//           name,
//           imageUrl: uploadedImageUrl,
//         }
//       );

//       return c.json({
//         data: workspace,
//         success: true,
//         message: "updated workspace successfully",
//       });
//     }
//   )
//   .delete(":workspaceId", sessionMiddleware, async (c) => {
//     //get the param
//     const { workspaceId } = c.req.param();
//     const databases = c.get("databases");
//     const user = c.get("user");

//     //utilize the session to fetch the userID and check wheather he is part of this workspace with admin access or not
//     const member = await getMember({
//       databases,
//       workspaceId,
//       userId: user.$id,
//     });

//     //if not then return unauthorized
//     if (!member || member.role !== MemberRole.ADMIN) {
//       return c.json(
//         {
//           success: false,
//           message: "unauthorized",
//         },
//         401
//       );
//     }

//     //otherwise just run query on the workspaces and implement the delete functionality
//     //one more catch: need to delete members , projects and tasks that are linked to this workspace
//     //in postgres i would have just simply added cascade property
//     // TODO: delete members, projects and tasks
//     const workspace = await databases.deleteDocument(
//       DATABASE_ID,
//       WORKSPACES_ID,
//       workspaceId
//     );

//     console.log("deleted workspace data: ", workspace);

//     return c.json({
//       data: workspace,
//       success: true,
//       message: "deleted workspace successfully",
//     });
//   })
//   .post(":workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
//     //get the param
//     const { workspaceId } = c.req.param();
//     const databases = c.get("databases");
//     const user = c.get("user");

//     //utilize the session to fetch the userID and check wheather he is part of this workspace with admin access or not
//     const member = await getMember({
//       databases,
//       workspaceId,
//       userId: user.$id,
//     });

//     //if not then return unauthorized
//     if (!member || member.role !== MemberRole.ADMIN) {
//       return c.json(
//         {
//           success: false,
//           message: "unauthorized",
//         },
//         401
//       );
//     }

//     const workspace = await databases.updateDocument(
//       DATABASE_ID,
//       WORKSPACES_ID,
//       workspaceId,
//       { inviteCode: generateInviteCode(6) }
//     );

//     return c.json({
//       data: workspace,
//       success: true,
//       message: "invite code reset successfully",
//     });
//   })
//   .post(":workspaceId/join/:inviteCode", sessionMiddleware, async (c) => {
//     //fetch id and code
//     const { workspaceId, inviteCode } = c.req.param();

//     const user = c.get("user");
//     const databases = c.get("databases");

//     //check: already member of this workspace
//     const member = await getMember({
//       databases,
//       workspaceId,
//       userId: user.$id,
//     });

//     if (member) {
//       return c.json(
//         {
//           success: false,
//           message: "already a member",
//         },
//         400
//       );
//     }

//     //check: workspace exist
//     const workspace = await databases.getDocument<Workspace>(
//       DATABASE_ID,
//       WORKSPACES_ID,
//       workspaceId
//     );

//     //verify inivite code
//     if (workspace.inviteCode !== inviteCode)
//       return c.json(
//         {
//           success: false,
//           message: "invalid invite link",
//         },
//         400
//       );

//     //create a member with the user id and workspace id with member access
//     await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
//       workspaceId,
//       userId: user.$id,
//       role: MemberRole.ADMIN,
//     });

//     return c.json({
//       data: workspace,
//       success: true,
//       message: "joined workspace successfully",
//     });
//   });

// export default workspaces;

import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
import { Workspace } from "../types";

const workspaces = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [] }, total: 0 });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({
      data: workspaces,
      success: true,
      message: "Fetched workspace successfully",
    });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl = null;

      if (image && Buffer.isBuffer(image)) {
        try {
          const fileId = ID.unique();

          // Create a Blob from the Buffer
          const blob = new Blob([image], { type: 'image/png' });
          // Create a File object from the Blob
          const file = new File([blob], `${fileId}.png`, { type: 'image/png' });

          const uploadedFile = await storage.createFile(IMAGES_BUCKET_ID, fileId, file);
          const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, uploadedFile.$id);
          uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        } catch (error) {
          return c.json({ success: false, message: "Error uploading image" }, 500);
        }
      }

      try {
        const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        });

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

        return c.json({
          data: workspace,
          success: true,
          message: "Created workspace successfully",
        });
      } catch (error) {
        return c.json({ success: false, message: "Error creating workspace" }, 500);
      }
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");
      const workspaceId = c.req.param("workspaceId");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
      }

      let uploadedImageUrl = null;

      if (image && Buffer.isBuffer(image)) {
        try {
          const fileId = ID.unique();

          // Create a Blob from the Buffer
          const blob = new Blob([image], { type: 'image/png' });
          // Create a File object from the Blob
          const file = new File([blob], `${fileId}.png`, { type: 'image/png' });

          const uploadedFile = await storage.createFile(IMAGES_BUCKET_ID, fileId, file);
          const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, uploadedFile.$id);
          uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        } catch (error) {
          return c.json({ success: false, message: "Error uploading image" }, 500);
        }
      } else {
        uploadedImageUrl = image; // Use existing image URL if not a new upload
      }

      try {
        const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
          name,
          imageUrl: uploadedImageUrl,
        });

        return c.json({
          data: workspace,
          success: true,
          message: "Updated workspace successfully",
        });
      } catch (error) {
        return c.json({ success: false, message: "Error updating workspace" }, 500);
      }
    }
  )
  .delete(":workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    try {
      const workspace = await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      return c.json({
        data: workspace,
        success: true,
        message: "Deleted workspace successfully",
      });
    } catch (error) {
      return c.json({ success: false, message: "Error deleting workspace" }, 500);
    }
  })
  .post(":workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    try {
      const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
        inviteCode: generateInviteCode(6),
      });

      return c.json({
        data: workspace,
        success: true,
        message: "Invite code reset successfully",
      });
    } catch (error) {
      return c.json({ success: false, message: "Error resetting invite code" }, 500);
    }
  })
  .post(":workspaceId/join/:inviteCode", sessionMiddleware, async (c) => {
    const { workspaceId, inviteCode } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (member) {
      return c.json({ success: false, message: "Already a member" }, 400);
    }

    try {
      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== inviteCode) {
        return c.json({ success: false, message: "Invalid invite link" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({
        data: workspace,
        success: true,
        message: "Joined workspace successfully",
      });
    } catch (error) {
      return c.json({ success: false, message: "Error joining workspace" }, 500);
    }
  });

export default workspaces;
