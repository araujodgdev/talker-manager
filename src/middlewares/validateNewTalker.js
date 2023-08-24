const validateAuthorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (token.length !== 16 || typeof token !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age < 18 || !Number.isInteger(age)) {
    return res
      .status(400)
      .json({
        message:
          'O campo "age" deve ser um número inteiro igual ou maior que 18',
      });
  }
  next();
};

const validateDateFormat = (date) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  return regex.test(date);
};

const validateWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validateDateFormat(watchedAt)) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

module.exports = {
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
};