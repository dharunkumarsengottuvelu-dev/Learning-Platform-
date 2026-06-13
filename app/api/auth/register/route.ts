import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, college, department, year, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        college,
        department,
        year,
        phone,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
