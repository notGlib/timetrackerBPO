import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const project = await prisma.project.create({
      data: {
        name: data.name,
        clientId: parseInt(data.clientId),
        address: data.address,
        location: data.location,
        budget: data.budget,
        manager: data.manager,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
