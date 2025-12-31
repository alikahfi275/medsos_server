import z from "zod";
import prisma from "../utils/prisma.js";
import cloudinary from "../utils/cloudinary.js";

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
        imageId: true,
      },
    });

    if (user) {
      return res.status(200).json({
        message: "Get User Success",
        data: user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSearchUser = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        fullname: true,
        image: true,
        imageId: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Get User Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putUpdateUser = async (req, res) => {
  try {
    // Validasi dengan zod
    const UserSchema = z.object({
      fullname: z.string().min(6, "Minimal 6 karakter"),
      username: z.string().min(6, "Minimal 6 karakter"),
      bio: z.string().min(10, "Minimal 10 karakter"),
    });

    const userValidated = UserSchema.parse(req.body);

    // Validasi untuk username
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: userValidated.username,
      },
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // update user berdasarkan id
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        fullname: userValidated.fullname,
        username: userValidated.username,
        email: userValidated.email,
        bio: userValidated.bio,
      },
      omit: {
        password: true,
        email: true,
      },
    });

    // berhasil
    return res.status(200).json({
      message: "Update User Success",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => err.message);
      return res.status(400).json({ message: errors });
    }
    res.status(500).json({ message: error.message });
  }
};

export const putUpdateAvatar = async (req, res) => {
  try {
    // validation
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    // get current dari user id
    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // validasi untuk menghapus gambar lama
    if (currentUser.imageId) {
      await cloudinary.uploader.destroy(currentUser.imageId);
    }

    // update gambar baru dengan buffer multer
    const fileStr = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "avatar",
      transformation: {
        width: 100,
        height: 100,
        crop: "fill",
      },
    });

    // update user image dan imageId
    const updateUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        image: result.secure_url,
        imageId: result.public_id,
      },
      omit: {
        password: true,
      },
    });

    // response success
    res.status(201).json({
      message: "Update Avatar Success",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
