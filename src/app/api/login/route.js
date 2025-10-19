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

    // Find user by username OR email (lowercase for case-insensitive search)
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() }, 
        { email: identifier.toLowerCase() }
      ],
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Use the comparePassword method from the User model
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ 
        message: "Login successful", 
        token,
        isAdmin: user.role === 'admin',
        redirectTo: user.role === 'admin' ? '/admin' : '/home'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
