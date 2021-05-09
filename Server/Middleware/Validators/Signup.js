import { body } from 'express-validator';

export default [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email is not in a valid format')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot be greater than 255 characters'),
  body('displayName')
    .notEmpty()
    .withMessage('Display name is required')
    .isString()
    .withMessage('Display name is invalid')
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage('Display name cannot be greater than 255 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Invalid password')
    .isLength({ max: 255 })
    .withMessage('Password cannot be greater than 255 characters')
];
