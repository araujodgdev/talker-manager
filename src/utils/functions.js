const fs = require('fs').promises;
const { v4: uuidV4 } = require('uuid');
const path = require('path');

const TALKER_FILE_PATH = path.resolve(__dirname, '../talker.json');

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

async function updateRate(id, newRate) {
  try {
    const talkerFile = await readTalkerFile();
    const talkerIndex = talkerFile.findIndex((talker) => talker.id === Number(id));
    talkerFile[talkerIndex].talk.rate = newRate;
    const newTalkerFile = JSON.stringify(talkerFile);
    await fs.writeFile(TALKER_FILE_PATH, newTalkerFile);
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

module.exports = { 
  readTalkerFile, writeNewTalker, updateTalker, deleteTalker, generateRandomToken, updateRate };