import { hash } from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Username, email, and password are required" }),
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username or email already in use" }),
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
