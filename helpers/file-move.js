const fs = require('fs').promises;

module.exports = async (source, desc) => {
  try {
    await fs.rename(source, desc);
  } catch (e) {
    console.warn('warn', e);

    await fs.copyFile(source, desc);
    await fs.unlink(source);
  }
};
