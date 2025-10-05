import * as service from "../service/authService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authInfo = await service.login(email, password);
    res.status(200).json(authInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = (req, res) => {
  const url = service.getGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "Code not provided" });

    const { payload } = await service.getGoogleUser(code);

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
    };

    const token = generateAppToken(user);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
