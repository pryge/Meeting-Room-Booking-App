import { User } from "./models";

User.findAll().then((users) =>
  console.log(users.map((u) => ({ email: u.email, role: u.role }))),
);
