module.exports = (app) => {
  function filledOrErr(value, err) {
    if (!value) throw err;
    if (Array.isArray(value) && value.length === 0) throw err;
    if (typeof value === "string" && !value.trim()) throw err;
  }

  function emptyOrErr(value, err) {
    try {
      filledOrError(value, err);
    } catch (err) {
      return;
    }
    throw err;
  }

  function equalsOrErr(a, b, err) {
    if (a !== b) throw err;
  }

  return { filledOrErr, emptyOrErr, equalsOrErr };
};
