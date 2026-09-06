export type NewsletterSignupInput = {
  email: string;
  website?: string;
};

export type NewsletterSignupErrors = Partial<Record<keyof NewsletterSignupInput, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateNewsletterSignup(input: NewsletterSignupInput) {
  const errors: NewsletterSignupErrors = {};

  if (input.website) {
    errors.website = "Spam protection triggered.";
  }

  if (!emailPattern.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}
