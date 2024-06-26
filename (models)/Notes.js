import mongoose, { Schema } from "mongoose";

// Ensure environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Use native promises
mongoose.Promise = global.Promise;

// Define the notes schema with validation
const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["personal", "work", "miscellaneous"], // Example categories
    },
  },
  { timestamps: true }
);

// Create the Notes model
const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);

export default Notes;
