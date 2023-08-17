const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;
// const NOT_FOUND = 404;
// const BAD_REQUEST = 400;
// const UNPROCESSABLE_CONTENT = 422;
// const UNAUTHORIZED = 401;

const TALKER_FILE_PATH = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// iniciando o projeto!!! :rocket:
app.get("/talker", async (req, res) => {
  try {
    const talkerData = await fs.readFile(TALKER_FILE_PATH);
    const parsed = JSON.parse(talkerData);

    if (!talkerData) {
      res.status(200).json([])
    }

    res.status(OK).json(parsed)
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
})