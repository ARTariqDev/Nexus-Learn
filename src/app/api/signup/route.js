import { hash } from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password required" }), {
        status: 400,
      });
    }

    await connectToDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
