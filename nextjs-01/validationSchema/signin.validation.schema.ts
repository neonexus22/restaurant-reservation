import validator from "validator";

export default function validateSignIn(body: any) {
  const errors: string[] = [];
  const { email, password } = body;

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      message: "Email is invalid",
    },
    {
      valid: validator.isLength(password, { min: 1 }),
      message: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.message);
    }
  });

  return errors;
}
