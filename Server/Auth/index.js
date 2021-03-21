import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export async function validatePasswordHash({ password, hashedPassword }) {
  return bcrypt.compare(password, hashedPassword);
}
