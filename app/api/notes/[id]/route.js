import { NextResponse } from "next/server";
import Notes from "@/(models)/Notes";
export async function DELETE(req, { params }) {
  try {
    console.log(params.id);
    const data = await Notes.findByIdAndDelete(params.id);

    return NextResponse.json("note deleted succesfully");
  } catch (error) {}
}

export async function GET(req, { params }) {
  const { id } = params;
  try {
    console.log(params);
    const data = await Notes.findById(id);
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {}
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const { title, body: noteBody, category } = body;

  // Validate the incoming data
  if (!title || !noteBody || !category) {
    return NextResponse.json(
      { message: "Invalid data: title, body, and category are required" },
      { status: 400 }
    );
  }
  try {
    // const body = await req.json();
    const data = await Notes.findByIdAndUpdate(id, { ...body });
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("there is a problem", error);
  }
}
