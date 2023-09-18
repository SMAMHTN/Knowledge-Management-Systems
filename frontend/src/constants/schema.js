import * as yup from 'yup';

const requiredMsg = 'This field is required';
const numOnly = 'This field can only contain numeric values';
const integerMsg = 'This field must be a whole number';
const noHTMLMsg = 'HTML tags are not allowed';
const maxCharMsg = 'This field must be no more than 50 characters';
const minCharMsg = 'This field must be equal or more than 8 characters';
const validMailMsg = 'Put a valid Email Address';
const hasHtmlTagsRegex = /<[a-z][\s\S]*>/i;

export const catSchema = yup.object().shape({
  CategoryName: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg),
  CategoryParentID: yup
    .number()
    .typeError(numOnly)
    .required(requiredMsg)
    .integer(integerMsg),
  CategoryDescription: yup
    .string()
    .test('no-html', noHTMLMsg, (value) => {
      const hasHtmlTags = hasHtmlTagsRegex.test(value);
      return !hasHtmlTags;
    }),
});

export const roleSchema = yup.object().shape({
  RoleName: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg),
  RoleParentID: yup
    .number(numOnly)
    .required(requiredMsg)
    .typeError(numOnly)
    .integer(integerMsg),
  RoleDescription: yup
    .string()
    .test('no-html', noHTMLMsg, (value) => {
      const hasHtmlTags = hasHtmlTagsRegex.test(value);
      return !hasHtmlTags;
    }),
});

export const permSchema = yup.object().shape({
  CategoryID: yup
    .number()
    .typeError(numOnly)
    .required(requiredMsg)
    .integer(integerMsg),
  RoleID: yup
    .number()
    .typeError(numOnly)
    .required(requiredMsg)
    .integer(integerMsg),
  Create: yup.boolean(),
  Read: yup.boolean(),
  Update: yup.boolean(),
  Delete: yup.boolean(),
});

export const userSchema = yup.object().shape({
  Username: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg),
  Password: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg)
    .min(8, minCharMsg),
  Name: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg),
  Email: yup
    .string()
    .email(validMailMsg)
    .required(requiredMsg)
    .max(50, maxCharMsg),
  Address: yup
    .string(),
  Phone: yup
    .string()
    .max(50, maxCharMsg),
  RoleID: yup
    .number(numOnly)
    .required(requiredMsg)
    .typeError(numOnly)
    .integer(integerMsg),
  AppthemeID: yup
    .number(numOnly)
    .required(requiredMsg)
    .typeError(numOnly)
    .integer(integerMsg),
  Note: yup
    .string()
    .test('no-html', noHTMLMsg, (value) => {
      const hasHtmlTags = hasHtmlTagsRegex.test(value);
      return !hasHtmlTags;
    }),
  IsSuperAdmin: yup.boolean(),
  IsActive: yup.boolean(),
});
