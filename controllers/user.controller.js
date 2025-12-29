import prisma from "../utils/prisma.js";

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
