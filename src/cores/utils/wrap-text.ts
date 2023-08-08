import * as Canvas from 'canvas';

interface wrapTextType {
  lines: Array<Array<string>>;
  longestLineWidth: number;
}
const wrapText = function (
  ctx: Canvas.CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): wrapTextType {
  const words = text.split(' ');
  let line = ''; // store the text of the current line
  let testLine = ''; // store the text to test if it's too long
  const lineArray = []; // array of lines the function will return
  let longestLineWidth = 0;

  for (let n = 0; n < words.length; n++) {
    testLine += `${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    const lineWidth = ctx.measureText(line).width;

    if (lineWidth > longestLineWidth) {
      longestLineWidth = lineWidth;
    }

    if (testWidth > maxWidth && n > 0) {
      lineArray.push([line]);
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      line += `${words[n]} `;
    }

    if (n === words.length - 1) {
      if (testWidth > longestLineWidth && lineArray.length === 0) {
        longestLineWidth = testWidth;
      }

      lineArray.push([line]);
    }
  }

  // Return the line array
  return {
    lines: lineArray,
    longestLineWidth: Math.ceil(longestLineWidth)
  };
};

export default wrapText;
