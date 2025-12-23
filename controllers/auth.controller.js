export const Register = (req, res) => {
  const { username, password, fullname, email } = req.body;
  res.json({
    message: "User registered!",
    data: { username, password, fullname, email },
  });
};

export const Login = (req, res) => {
  res.json({ message: "User logged in!" });
};
