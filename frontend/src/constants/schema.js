import * as yup from 'yup';

const requiredMsg = 'This field is required';
const numOnly = 'This field can only contain numeric values';
const integerMsg = 'This field must be a whole number';
const noHTMLMsg = 'HTML tags are not allowed';
const maxCharMsg = 'This field must be no more than 50 characters';

const hasHtmlTagsRegex = /<[a-z][\s\S]*>/i;

export const catSchema = yup.object().shape({
  CategoryName: yup
    .string()
    .required(requiredMsg)
    .max(50, maxCharMsg),
  CategoryParentID: yup
    .number()
    .typeError(numOnly)
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
    .number()
    .typeError(numOnly)
    .integer(integerMsg),
  RoleDescription: yup
    .string()
    .test('no-html', noHTMLMsg, (value) => {
      const hasHtmlTags = hasHtmlTagsRegex.test(value);
      return !hasHtmlTags;
    }),
});
