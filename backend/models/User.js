const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, //never return password in queries unless explicitly asked
    },
    role: {
      type: String,
      enum: ["patient", "dentist"],
      default: "patient",
    },
    //patient fields
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Invalid gender",
      },
      required: false,
      default: undefined,
    },
    phoneNumber: { type: String },
    //Dentist fields
    licenseNumber: { type: String },
    specialization: { type: String },
  },
  { timestamps: true },
);

//hashing password before saving to my databas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Method to compare entered password with hashed DB password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
