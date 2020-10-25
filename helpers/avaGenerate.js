const uuid = require('uuid').v4;
const path = require('path');
// const imgGen = require('js-image-generator');
const jdenticon = require('jdenticon');
const { promises: fsPromises } = require('fs');

const fileMove = require('./file-move');
const configEnv = require('../config.env');

module.exports = async (email) => {
  const firstAva = `${uuid()}.png`;
  const avaPath = path.join(configEnv.paths.tmp, firstAva);
  const avaDest = path.join(configEnv.paths.avatars, firstAva);

  const value = email;
  const size = 200;
  const png = jdenticon.toPng(value, size);
  // const firstAva = path.join(process.cwd(), 'tmp', `${uuid()}.png`);
  // imgGen.generateImage(100, 100, 30, function (err, image) {
  // fs.writeFileSync(firstAva, image.data);
  // });

  await fsPromises.writeFile(avaPath, png);
  await fileMove(avaPath, avaDest);

  return { firstAva, avaDest };
};
