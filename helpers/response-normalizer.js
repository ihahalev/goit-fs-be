const responseNormalizer = (object) => {
  let isError = false;

  return {
    success: !isError,
    data: object,
    message: isError ? object.message : undefined
  };
};

module.exports = responseNormalizer;
