import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20');
  const search = searchParams.get('search') ?? '';

  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { employeeCode: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : {}),
  };

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: {
        department: { select: { name: true } },
        designation: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.employee.count({ where }),
  ]);

  return NextResponse.json({
    data: employees,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    employeeCode,
    firstName,
    lastName,
    departmentId,
    subDepartmentId,
    designationId,
    employeeTypeId,
    categoryId,
    gradeId,
    levelId,
    unitId,
  } = body;

  if (!employeeCode || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'employeeCode, firstName, and lastName are required' },
      { status: 400 }
    );
  }

  const existing = await prisma.employee.findUnique({
    where: { employeeCode },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'employeeCode already exists' },
      { status: 409 }
    );
  }

  const employee = await prisma.employee.create({
    data: {
      employeeCode,
      firstName,
      lastName,
      departmentId: departmentId ?? null,
      subDepartmentId: subDepartmentId ?? null,
      designationId: designationId ?? null,
      employeeTypeId: employeeTypeId ?? null,
      categoryId: categoryId ?? null,
      gradeId: gradeId ?? null,
      levelId: levelId ?? null,
      unitId: unitId ?? null,
    },
  });

  return NextResponse.json(employee, { status: 201 });
}
