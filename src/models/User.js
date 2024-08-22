import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
  },
  cart: {
    new: {
      type: Array,
      default: [],
    },
    used: {
      type: Array,
      default: [],
    },
  },
  history: {
    new: {
      type: Array,
      default: [],
    },
    used: {
      type: Array,
      default: [],
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
