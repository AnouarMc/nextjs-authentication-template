"use server";

import {
  updateUserName,
  updateUserImage,
  updatePrimaryEmail,
  updateUserPassword,
  getUserById,
} from "@/data/user";
import {
  createAccount,
  deleteAccount,
  deleteConnectedAccount,
} from "@/data/account";
import { verifyTokenOrThrow } from "@/data/verification";

import {
  otpSchema,
  otpSchemaType,
  imageSchema,
  imageSchemaType,
  resetPasswordSchema,
  resetPasswordSchemaType,
  updatePasswordSchema,
  updatePasswordSchemaType,
} from "@/schemas";
import bcrypt from "bcrypt";
import { defaultError } from "@/constants";
import { revalidatePath } from "next/cache";
import { formatZodErrors } from "@/lib/utils";
import { auth, updateServerSession } from "@/auth";
import { ExpiredToken, InvalidToken } from "@/types";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

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

export const addAccount = async (email: string, code: otpSchemaType) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    const validatedCode = otpSchema.safeParse(code);
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    const { otpCode } = code;
    await verifyTokenOrThrow(email, otpCode);
    await createAccount(userId, email);
    revalidatePath("/dashboard/profile");
    return { success: true, errors: null };
  } catch (error) {
    switch (true) {
      case error instanceof InvalidToken:
        return {
          success: false,
          errors: [{ name: "otpCode", message: "Invalid code" }],
        };
      case error instanceof ExpiredToken:
        return {
          success: false,
          errors: [{ name: "otpCode", message: "This code has expired" }],
        };
    }

    console.error(error);
    return defaultError;
  }
};

export const removeAccount = async (email: string, provider?: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return defaultError;
    }

    const { success, errors } = provider
      ? await deleteConnectedAccount(userId, email, provider)
      : await deleteAccount(userId, email);
    if (success) revalidatePath("/dashboard/profile");
    return {
      success,
      errors,
    };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};

export const setEmailAsPrimary = async (email: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    const { success, errors } = await updatePrimaryEmail(userId, email);
    if (!success) {
      return { success, errors };
    }
    await updateServerSession({ user: { email } });
    return { success, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};

export const changePassword = async (
  values: updatePasswordSchemaType | resetPasswordSchemaType
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }
    const schema =
      "currentPassword" in values ? updatePasswordSchema : resetPasswordSchema;

    const validatedPasswords = schema.safeParse(values);
    if (!validatedPasswords.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedPasswords.error),
      };
    }

    const { currentPassword, password: newPassword } =
      validatedPasswords.data as updatePasswordSchemaType;
    const userRecord = await getUserById(userId);

    if (userRecord?.password) {
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        userRecord?.password
      );
      if (!passwordMatch) {
        return {
          success: false,
          errors: [
            { name: "currentPassword", message: "Password is incorrect" },
          ],
        };
      }
    }

    if (!userRecord?.email) {
      return defaultError;
    }
    await updateUserPassword(userRecord.email, newPassword);

    if (!currentPassword)
      await updateServerSession({ user: { hasPassword: true } });
    return { success: true, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
