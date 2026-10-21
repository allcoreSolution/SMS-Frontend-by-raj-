// Standard Code 128 Subset B patterns (ASCII 32 to 127)
const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

/**
 * Generate real Code 128 standard barcode bars array
 * @param {string} text - The alphanumeric text to encode
 * @returns {object} { bars, totalWidth, height }
 */
export const getCode128Bars = (text = 'STF-101') => {
  const clean = String(text || 'STF-101').trim();
  const start = 104; // Start Code B
  let checksum = start;
  const codes = [start];

  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i) - 32;
    const valid = (code >= 0 && code <= 95) ? code : 0;
    codes.push(valid);
    checksum += valid * (i + 1);
  }

  codes.push(checksum % 103);
  codes.push(106); // Stop Code

  const patternStr = codes.map(c => CODE128_PATTERNS[c] || CODE128_PATTERNS[0]).join('');

  let currentX = 10;
  let isBar = true;
  const bars = [];

  for (let i = 0; i < patternStr.length; i++) {
    const width = parseInt(patternStr[i], 10) * 2;
    if (isBar) {
      bars.push({ x: currentX, width });
    }
    currentX += width;
    isBar = !isBar;
  }

  return {
    code: clean,
    totalWidth: currentX + 10,
    height: 52,
    bars
  };
};
