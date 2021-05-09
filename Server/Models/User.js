import { v4 as uuid } from 'uuid';

export default function UserModel({ displayName, email, hashedPassword }) {
  const signupDate = Math.floor(Date.now() / 1000);
  const userId = uuid();

  return {
    _id: userId,
    balance: 500,
    displayName,
    email: email.toLowerCase(),
    password: hashedPassword,
    signupDate
  };
}
