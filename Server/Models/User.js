import { v4 as uuid } from 'uuid';

export default function UserModel({ email, hashedPassword }) {
  const signupDate = Math.floor(Date.now() / 1000);
  const userId = uuid();

  return {
    _id: userId,
    balance: 500,
    email: email.toLowerCase(),
    password: hashedPassword,
    signupDate
  };
}
