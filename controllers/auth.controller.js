import z from "zod";
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    // Validation
    const UserSchema = z.object({
      fullname: z.string().min(6, "Minimal 6 karakter"),
      username: z.string().min(6, "Minimal 6 karakter"),
      email: z.email("Email tidak valid example@mail.com"),
      password: z.string().min(8, "Minimal 8 karakter"),
    });

    const userValidated = UserSchema.parse(req.body);

    if (typeof userValidated.email !== "string") {
      return res.status(400).json({ message: "Email must be a string" });
    }
    // check email terdaftar

    const emailExisting = await prisma.user.findUnique({
      where: {
        email: userValidated.email,
      },
    });
    if (emailExisting) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const usernameExisting = await prisma.user.findUnique({
      where: {
        username: userValidated.username,
      },
    });
    if (usernameExisting) {
      return res.status(400).json({ message: "Username already registered" });
    }

    // enkripsi password

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userValidated.password, salt);

    // insert data ke db

    const newUser = await prisma.user.create({
      data: {
        fullname: userValidated.fullname,
        username: userValidated.username,
        email: userValidated.email,
        password: hashPassword,
      },
    });

    const jwtsecret = process.env.JWT_SECRET;

    const token = jwt.sign({ id: newUser.id }, jwtsecret, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User registered!",
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        image: newUser.image,
      },
      token: token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => err.message);
      return res.status(400).json({ message: errors });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation email sama password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingEmail) {
      return res
        .status(400)
        .json({ message: "User not found, please register" });
    }

    // bandingkan password req body dengan password database bcrypt

    const comparePassword = bcrypt.compareSync(
      password,
      existingEmail.password
    );

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    //  buat jwt simpan id user ke jwt

    const jwtsecret = process.env.JWT_SECRET;

    const token = jwt.sign({ id: existingEmail.id }, jwtsecret, {
      expiresIn: "1d",
    });

    //  res success

    return res.status(200).json({
      message: "Login success!",
      data: {
        id: existingEmail.id,
        fullname: existingEmail.fullname,
        username: existingEmail.username,
        email: existingEmail.email,
        bio: existingEmail.bio,
        image: existingEmail.image,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Get User Success",
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
