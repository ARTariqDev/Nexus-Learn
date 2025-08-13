import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ error: "Username/Email and password required" }),
        { status: 400 }
      );
    }

    await connectToDB();

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
