"use server";

import { updateUserImage, updateUserName } from "@/data/user";

import { defaultError } from "@/constants";
import { revalidatePath } from "next/cache";
import { auth, updateServerSession } from "@/auth";

import { imageSchema, imageSchemaType } from "@/schemas";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { formatZodErrors } from "@/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateProfileName = async (name: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    await updateUserName(userId, name);
    await updateServerSession({ user: { name } });
    return { success: true, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};

export const updateProfileImage = async (img?: imageSchemaType) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    const validatedImage = imageSchema.safeParse(img);
    if (!validatedImage.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedImage.error),
      };
    }

    const file = validatedImage.data.image[0];
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url }: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: userId }, (err, result) => {
          if (err) return reject(err);
          if (!result) return reject(new Error("Something went wrong"));
          resolve(result);
        })
        .end(buffer);
    });

    await updateUserImage(userId, url);
    await updateServerSession({ user: { image: url } });
    return { success: true, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};

export const revalidateDashboard = async () => {
  revalidatePath("/dashboard");
};
