import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const employee = await prisma.employee.findFirst({
    where: { id: parseInt(id), deletedAt: null },
    include: {
      department: true,
      subDepartment: true,
      designation: true,
      employeeType: true,
      category: true,
      grade: true,
      level: true,
      unit: true,
      personalDetails: true,
      jobInfo: {
        include: {
          reportingManager: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
          shiftPlan: { select: { id: true, name: true } },
          otPlan: { select: { id: true, name: true } },
        },
      },
      salaryStructures: { orderBy: { effectiveFrom: 'desc' } },
      dependents: { where: { deletedAt: null } },
      experiences: { where: { deletedAt: null }, orderBy: { fromDate: 'desc' } },
      education: { where: { deletedAt: null } },
      documents: { where: { deletedAt: null } },
      kpiJd: true,
      exitInterview: true,
      assetAllocations: {
        where: { deletedAt: null, returnedDate: null },
        include: { assetMaster: { select: { id: true, code: true, name: true } } },
      },
    },
  });

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.employee.findFirst({
    where: { id: parseInt(id), deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

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

  if (employeeCode && employeeCode !== existing.employeeCode) {
    const conflict = await prisma.employee.findUnique({
      where: { employeeCode },
    });
    if (conflict) {
      return NextResponse.json({ error: 'employeeCode already exists' }, { status: 409 });
    }
  }

  const updated = await prisma.employee.update({
    where: { id: parseInt(id) },
    data: {
      employeeCode: employeeCode ?? undefined,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      departmentId: departmentId ?? undefined,
      subDepartmentId: subDepartmentId ?? undefined,
      designationId: designationId ?? undefined,
      employeeTypeId: employeeTypeId ?? undefined,
      categoryId: categoryId ?? undefined,
      gradeId: gradeId ?? undefined,
      levelId: levelId ?? undefined,
      unitId: unitId ?? undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const existing = await prisma.employee.findFirst({
    where: { id: parseInt(id), deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Soft-delete
  await prisma.employee.update({
    where: { id: parseInt(id) },
    data: { isActive: false, deletedAt: new Date() },
  });

  return NextResponse.json({ message: 'Employee deleted' });
}
