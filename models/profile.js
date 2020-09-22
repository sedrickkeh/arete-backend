var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProfileSchema = new Schema(
  {
    // User
    user: { type: Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    name: { type: String },
    email: { type: String },

    // General Info
    title: { type: String },
    pref_name: { type: String },
    gender: { type: String },
    birth_year: { type: Number },
    contact_number: { type: String },

    // Learning-related
    location: [{ type: String, required: true }],
    hourly_rate: { type: Number },
    preference: { type: String },
    subjects: [String],
    time: [String],

    // Tutor Only
    examination_tutor: [String],
    overall_score: { type: String },
    detailed_scores: { type: String },
    experience: { type: String },
    licensed: { type: Boolean },
    university_name: { type: String },
    university_program: { type: String },
    self_introduction: { type: String },

    // Rating-related
    num_ones: { type: Number },
    num_twos: { type: Number },
    num_threes: { type: Number },
    num_fours: { type: Number },
    num_fives: { type: Number },
    num_reviews: { type: Number },
    num_ones: { type: Number },
    average_rating: { type: Number },

    // Student Only
    contact: {
      title: { type: String },
      name: { type: String },
      contact_number: { type: String },
      email: { type: String },
      relationship: { type: String },
    },
    school: { type: String },
    year: { type: String },
    examination_student: [String],
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
