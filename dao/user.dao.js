import User from "../db/userSchema.js";

export const findByEmail = async (email) => {
    return await User.findOne({ email });
}

export const findById = async (id) => {
    return await User.findById(id);
}

export const createUser = async (name, email, password) => {
    const user = new User({ name, email, password });
    return await user.save();
}
