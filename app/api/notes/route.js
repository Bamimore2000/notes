import Notes from "@/(models)/Notes"; // Adjust the import path as needed
import { NextResponse } from "next/server";

// Handler for POST request to create a new note
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, body: noteBody, category } = body;

    // Validate the incoming data
    if (!title || !noteBody || !category) {
      return NextResponse.json(
        { message: "Invalid data: title, body, and category are required" },
        { status: 400 }
      );
    }

    // Create the new note
    const notesData = { title, body: noteBody, category };
    console.log(notesData);
    await Notes.create(notesData);

    return NextResponse.json({ message: "Note created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { message: "Error creating note", error: error.message },
      { status: 500 }
    );
  }
}

// Handler for GET request to fetch all notes
export async function GET(req) {
  const request = req.nextUrl.searchParams;
  const query = request.get("query");
  if (query) {
    try {
      const data = await Notes.find({ category: query });
      return NextResponse.json({ data });
    } catch (error) {}
  }
  try {
    const data = await Notes.find();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Error fetching notes", error: error.message },
      { status: 500 }
    );
  }
}
