import formData from "form-data";
import Mailgun from "mailgun.js";

// Configure Mailgun Client
const mailgun = new Mailgun(FormData);

// Our sandbox domain form mailgun
const sandbox = "sandbox4772d961c0324582bf788c1be8b528d7.mailgun.org";

// When send mail gets no parameter use this default setup
const defaultOptions = {
  to: ["oliver@super-code.de"],
  subject: "Hello",
  html: "<h1>Testing some Mailgun awesomeness!</h1>",
};

// Mailgun client cache
// on first run we create a mailgun client
// once the client is created we can skip this
// process
let mg;

export const sendMail = ({ to, subject, html } = defaultOptions) => {
  if (!mg) {
    mg = mailgun.client({
      username: "api",
      key:
        process.env.MAILGUN_API_KEY ||
        "8b617c6d62d5dc8f7dea5c216932bb2b-135a8d32-f9cdc2b9",
    });
  }

  return mg.messages.create(sandbox, {
    from: `Excited User <mailgun@${sandbox}>`,
    to: to,
    subject: subject,
    html: html,
  });
};
