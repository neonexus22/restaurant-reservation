import validator from "validator";

export default function validateSignup(body: any) {
  const { firstName, lastName, email, city, phone, password } = body;

  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isLength(firstName, { min: 2, max: 50 }),
      message: "First name is invalid",
    },
    {
      valid: validator.isLength(lastName, { min: 2, max: 50 }),
      message: "Last name is invalid",
    },
    {
      valid: validator.isEmail(email),
      message: "Email is invalid",
    },
    {
      valid: validator.isLength(city, { min: 2 }),
      message: "City is invalid",
    },
    {
      valid: validator.isMobilePhone(phone),
      message: "Phone is invalid",
    },
    {
      valid: validator.isStrongPassword(password),
      message: "Password is not strong enough",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.message);
    }
  });

  return errors;
}
