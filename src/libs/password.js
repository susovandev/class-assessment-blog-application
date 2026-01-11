import bcrypt from "bcryptjs";

export const hashPasswordHelper = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePasswordHelper = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
