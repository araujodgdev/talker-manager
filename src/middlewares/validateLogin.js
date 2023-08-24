const validateRequiredFields = (req, res, next) => {
  const requiredFields = ['email', 'password'];
  if (requiredFields[0] in req.body === false) {
    return res.status(400).send({
      message: 'O campo "email" é obrigatório',
    });
  }

  if (requiredFields[1] in req.body === false) {
    return res.status(400).send({
      message: 'O campo "password" é obrigatório',
    });
  }
  next();
};

const validateEmailFormat = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(req.body.email);
  if (isValidEmail) {
    next();
  } else {
    return res.status(400).send({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
};

const validatePasswordLength = (req, res, next) => {
  const { password } = req.body;
  const isValidPassword = password.length >= 6;
  if (isValidPassword) {
    next();
  } else {
    return res.status(400).send({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
};

module.exports = {
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordLength,
};
