const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const OK = 200;
// const CREATED = 201;
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