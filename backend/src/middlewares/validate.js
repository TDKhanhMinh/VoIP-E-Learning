export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const parseJSONFields =
  (fields = []) =>
  (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `${field} must be valid JSON`,
          });
        }
      }
    }
    next();
  };
