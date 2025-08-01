//controle les parametres des requetes concernant les articles

/**
 *
 *
 * Parses and formats query parameters for SQL use.
 *
 * @param {Object} query - Query object from the request (e.g., req.query)
 * @returns {Array} An array with formatted number and string values for SQL
 */

function parseNumberValue(values) {
  for (let key in values) {
    if (values.hasOwnProperty(key)) {
      if (key === "limit") {
        values[key] = parseInt(values[key], 10);
      } else if (key === "page") {
        values[key] =
          (parseInt(values[key], 10) - 1) * parseInt(values["limit"], 10);
      } else {
        values[key] = values[key].toLowerCase().trim();
      }
    }
  }
  return values;
}

function checkParams(paramsReq, paramsExpected) {
  const allowedParams = {
    page: (val) => Number.isInteger(+val) && +val > 0,
    limit: (val) => Number.isInteger(+val) && +val > 0,
    category: (val) => typeof val === "string" && val.trim().length > 0,
    search: (val) => typeof val === "string" && val.trim().length > 0,
    articleId: (val) => Number.isInteger(+val) && +val > 0,
  };

  const errors = [];

  // Valide chaque paramètre et sa valeur
  for (const [key, value] of Object.entries(paramsReq)) {
    if (paramsExpected.includes(key)) {
      if (!allowedParams[key](value)) {
        errors.push(`Invalid value for '${key}': ${value}`);
      }
    } else {
      errors.push(`Unknown parameter '${key}'`);
    }
  }

  if (errors.length > 0) {
    return {
      status: "error",
      data: errors,
    };
  }

  const resultParsed = parseNumberValue(paramsReq);

  return { status: "success", data: resultParsed };
}

module.exports = checkParams;
