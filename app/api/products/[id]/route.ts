import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Type changed to Promise
) {
  const { id } = await params; // 2. Added await here
  await connectDB();
  const product = await Product.findById(id);
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Type changed to Promise
) {
  const { id } = await params; // 2. Added await here
  const body = await request.json();
  
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Type changed to Promise
) {
  const { id } = await params; // 2. Added await here
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json(true);
}