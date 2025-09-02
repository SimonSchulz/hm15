export const emailExamples = {
  registrationEmail: (code: string) => {
    return `
    <h1>Thank you for your registration</h1>
    <p>To finish registration please follow the link below:</p>
    <p>
      <a href="https://somesite.com/confirm-email?code=${code}">Complete registration</a>
    </p>
  `;
  },
};
