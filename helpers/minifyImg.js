const fs = require('fs').promises;
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

module.exports = async function (draftPath, draftFileName) {
  const [ava] = await imagemin([`tmp/${draftFileName}`], {
    destination: 'public/images',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
  await fs.unlink(draftPath);
  return ava;
};
