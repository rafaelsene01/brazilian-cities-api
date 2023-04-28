const removeAccentuation = (newString) => {
  if (!newString) return '';
  let text = newString;
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };

  for (const letra of Object.keys(mapaAcentosHex)) {
    const expressaoRegular = mapaAcentosHex[letra];
    text = text.replace(expressaoRegular, letra);
  }

  return text;
};

const normalizeString = (value) => {
  return removeAccentuation(value).replace(/\s/g, '');
};

export const matchString = (s1, s2) => {
  return new RegExp(normalizeString(s1), 'i').test(normalizeString(s2));
};
