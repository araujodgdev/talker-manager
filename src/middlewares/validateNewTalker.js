const { parse, isValid } = require('date-fns');

const validateAuthorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send({ message: 'Token não encontrado' });
  }
  if (token.length !== 16 || typeof token !== 'string') {
    res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    res
      .status(400)
      .send({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    res.status(400).send({ message: 'O campo "age" é obrigatório' });
  }

  if (age < 18 || !Number.isInteger(age)) {
    res
      .status(400)
      .send({
        message:
          'O campo "age" deve ser um número inteiro igual ou maior que 18',
      });
  }
  next();
};

const validateDateFormat = (date) => {
  const dateFormat = 'dd/MM/yyyy';
  const parsedDate = parse(date, dateFormat, new Date());
  return isValid(parsedDate);
};

const validateWatchedAt = (watchedAt, res) => {
  if (!validateDateFormat(watchedAt)) {
    res
      .status(400)
      .send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
};

const validateRate = (rate, res) => {
  if (rate < 1 || rate > 5 || !Number.isInteger(rate) || rate === 0) {
    res.status(400).send({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    res.status(400).send({ message: 'O campo "talk" é obrigatório' });
  }
  const { watchedAt, rate } = talk;
  if (!watchedAt) {
    res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' });
  } else if (!validateDateFormat(watchedAt)) {
    res.status(400).send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  validateWatchedAt(watchedAt, res);
  if (!rate) {
    res.status(400).send({ message: 'O campo "rate" é obrigatório' });
  }
  validateRate(rate, res);
  next();
};

module.exports = {
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
};