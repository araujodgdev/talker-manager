const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidV4 } = require('uuid');

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
} = require('./middlewares/validateNewTalker');

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;
const NOT_FOUND = 404;
// const BAD_REQUEST = 400;
// const UNPROCESSABLE_CONTENT = 422;
// const UNAUTHORIZED = 401;

const TALKER_FILE_PATH = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

async function readTalkerFile() {
  try {
    const fileData = await fs.readFile(TALKER_FILE_PATH);
    const parsed = JSON.parse(fileData);
    return parsed;
  } catch (error) {
    return error.message;
  }
}

function generateRandomToken() {
  const token = uuidV4().slice(0, 16);
  return token;
}

async function writeNewTalker(talkerData) {
  try {
    const talkerFile = await readTalkerFile();
    const id = talkerFile.length + 1;
    talkerFile.push({ id, ...talkerData });
    const newTalkerFile = JSON.stringify(talkerFile);
    await fs.writeFile(TALKER_FILE_PATH, newTalkerFile);
    return { id, ...talkerData };
  } catch (error) {
    return error.message;
  }
}

async function updateTalker(id, talkerData) {
  try {
    const talkerFile = await readTalkerFile();
    const talkerIndex = talkerFile.findIndex((talker) => talker.id === Number(id));
    talkerFile[talkerIndex] = { id, ...talkerData };
    const newTalkerFile = JSON.stringify(talkerFile);
    await fs.writeFile(TALKER_FILE_PATH, newTalkerFile);
    return { id, ...talkerData };
  } catch (error) {
    return error.message;
  }
}

async function deleteTalker(id) {
  try {
    const talkerFile = await readTalkerFile();
    const filteredTalkers = talkerFile.filter((talker) => talker.id !== Number(id));
    const newTalkerFile = JSON.stringify(filteredTalkers);
    await fs.writeFile(TALKER_FILE_PATH, newTalkerFile);
  } catch (error) {
    return error.message;
  }
}

// iniciando o projeto!!! :rocket:

// Req 01
app.get('/talker', async (req, res) => {
  try {
    const talkerData = await readTalkerFile();

    if (!talkerData) {
      res.status(200).json([]);
    }

    res.status(OK).json(talkerData);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
});

// Req 02

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talkerData = await readTalkerFile();

    const talkerFound = talkerData.find((talker) => talker.id === Number(id));

    if (!talkerFound) {
      res.status(NOT_FOUND).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }

    res.status(OK).json(talkerFound);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
});

// Req 03 e Req 04

app.post(
  '/login',
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordLength,
  (req, res) => {
    try {
      const token = generateRandomToken();
      res.status(OK).json({
        token,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).send({
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
      res.status(CREATED).json(newTalker);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).send({
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
        res.status(NOT_FOUND).json({
          message: 'Pessoa palestrante não encontrada',
        });
      }
      const updatedTalker = await updateTalker(id, { name, age, talk });
    res.status(OK).json(updatedTalker);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).send({
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
      res.status(204).json();
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  },
);