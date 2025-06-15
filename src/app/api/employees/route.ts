import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        code: true,
        lastName: true,
        firstName: true,
        fullName: true,
        email: true,
        phone: true,
        division: true,
        department: true,
        currentPosition: true,
        hireDate: true,
        terminationDate: true,
        agreementType: true,
        workingHours: true,
        remoteDays: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
