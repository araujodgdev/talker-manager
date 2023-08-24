const express = require('express');
const { 
  readTalkerFile,
  writeNewTalker,
  updateTalker,
  deleteTalker,
  generateRandomToken,
  updateRate,
} = require('./utils/functions');
const {
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordLength,
} = require('./middlewares/validateLogin');

const {
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  validateQueryRate,
  validateWatchedAtQuery,
  validateIdRate,
} = require('./middlewares/validateNewTalker');

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;
const NOT_FOUND = 404;

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.use(express.json());

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online', PORT);
});

app.get('/talker', async (req, res) => {
  try {
    const talkerData = await readTalkerFile();

    if (!talkerData) {
      return res.status(200).json([]);
    }

    return res.status(OK).json(talkerData);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
});

app.get('/talker/search',
  validateAuthorization,
  validateQueryRate,
  validateWatchedAtQuery,
  async (req, res) => {
  try {
    const { q, rate, date } = req.query;
    let talkerData = await readTalkerFile();
    if (q) talkerData = talkerData.filter((talker) => talker.name.includes(q));
    if (rate) {
      talkerData = talkerData.filter((talker) => talker.talk.rate === Number(rate));
    }
    if (date) {
      talkerData = talkerData.filter((talker) => talker.talk.watchedAt === date);
    }
    return res.status(OK).json(talkerData);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    }); 
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talkerData = await readTalkerFile();

    const talkerFound = talkerData.find((talker) => talker.id === Number(id));

    if (!talkerFound) {
      return res.status(NOT_FOUND).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }

    return res.status(OK).json(talkerFound);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
});

app.post(
  '/login',
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordLength,
  (req, res) => {
    try {
      const token = generateRandomToken();
      return res.status(OK).json({
        token,
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  },
);

app.post(
  '/talker',
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
  validateWatchedAt,
  async (req, res) => {
    try {
      const { name, age, talk } = req.body;
      const newTalker = await writeNewTalker({ name, age, talk });
      return res.status(CREATED).json(newTalker);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  },
);

app.put(
  '/talker/:id',
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
  validateWatchedAt,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, age, talk } = req.body;
      const talkerFile = await readTalkerFile();
      const talkerIndex = talkerFile.findIndex((talker) => talker.id === Number(id));
      if (talkerIndex < 0) {
        return res.status(NOT_FOUND).json({
          message: 'Pessoa palestrante não encontrada',
        });
      }
      const updatedTalker = await updateTalker(id, { name, age, talk });
    res.status(OK).json(updatedTalker);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  },
);

app.delete(
  '/talker/:id',
  validateAuthorization,
  async (req, res) => {
    try {
      const { id } = req.params;
      await deleteTalker(id);
      return res.status(204).json();
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  },
);

app.patch('/talker/rate/:id', validateAuthorization, validateIdRate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;
    const talkerFile = await readTalkerFile();
    const talkerIndex = talkerFile.findIndex((talker) => talker.id === Number(id));
    if (talkerIndex < 0) {
      return res.status(NOT_FOUND).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    await updateRate(id, rate);
    return res.status(204).json([]);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
});