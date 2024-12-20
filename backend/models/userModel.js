import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Your email isn't valid",
    },
  },
  password: {
    type: String,
    required: true,
  },
  isSeller: {
    type: Boolean,
    default: true,
  },
  stripeAccountId: String,
  isActiveStripeAccount: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (passedPassword) {
  return await bcryptjs.compare(passedPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export { User };
