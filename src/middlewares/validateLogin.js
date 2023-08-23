const validateRequiredFields = (req, res, next) => {
  const requiredFields = ['email', 'password'];
  if (requiredFields[0] in req.body === false) {
    res.status(400).send({
      message: 'O campo "email" é obrigatório',
    });
  }

  if (requiredFields[1] in req.body === false) {
    res.status(400).send({
      message: 'O campo "password" é obrigatório',
    });
  }

  next();
};

const validateFieldFormat = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(req.body.email);
  const isValidPassword = req.body.password >= 6;
  if (!isValidEmail) {
    res.status(400).send({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  if (!isValidPassword) {
    res.status(400).send({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

module.exports = {
  validateRequiredFields,
  validateFieldFormat,
};