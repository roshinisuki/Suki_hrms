import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { professionalTaxSlabSchema, validateSlabOverlap } from '@/lib/validations/master';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.professionalTaxSlab.findFirst({ where: { id: parseInt(id) } });
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = professionalTaxSlabSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.professionalTaxSlab.findMany({ where: { code: parsed.data.code } });
  const overlapError = validateSlabOverlap(
    existing.map((r) => ({ id: r.id, effectiveFrom: r.effectiveFrom, effectiveTo: r.effectiveTo })),
    parsed.data.effectiveFrom,
    parsed.data.effectiveTo ?? null,
    parseInt(id)
  );
  if (overlapError) return NextResponse.json({ error: overlapError }, { status: 409 });

  const record = await prisma.professionalTaxSlab.update({ where: { id: parseInt(id) }, data: parsed.data });
  return NextResponse.json(record);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.professionalTaxSlab.update({ where: { id: parseInt(id) }, data: { isActive: false } });
  return NextResponse.json({ message: 'Deactivated' });
}
