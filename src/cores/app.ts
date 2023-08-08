import * as fs from 'node:fs';
import * as Canvas from 'canvas';
import wrapText from './utils/wrap-text';

const setWallpaper = (imagePath: string, options?: any): Promise<void> =>
  import('wallpaper').then(({ setWallpaper }: { setWallpaper: any }) =>
    setWallpaper(imagePath, options)
  );

const fetch = (url: any, init?: any) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

let appConfig = {
  imageWidth: 1920,
  imageHeight: 1080,
  quoteURL: 'https://api.quotable.io/random',
  fontFamily: 'Arial',
  fontSize: 60,
  get fontLineHeight() {
    return this.fontSize + 30;
  },
  colors: {
    backgroundColor: '#000',
    fontColor: '#fff'
  },
  imageMime: 'image/jpeg',
  imageExt: '.jpg',
  imageFolder: './quotes'
};

interface fetchResponse {
  author: string;
  _id: string;
  content: string;
}

const saveImage = (
  buffer: Buffer,
  folderPath: string,
  imageName: string,
  imageExt: string
): string => {
  // eslint-disable-next-line unicorn/better-regex, no-useless-escape
  const imgname = imageName.replace(/[\/\\:*?"<>]/g, '-');

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const imgpath = `${folderPath}/${imgname}${imageExt}`;
  fs.writeFileSync(imgpath, buffer);

  return imgpath;
};

const setDesktopWallpaper = async (imagePath: string): Promise<void> => {
  await setWallpaper(imagePath);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function CreateQuoteWalpaper(config?: any): Promise<void> {
  if (config) {
    appConfig = {
      ...appConfig,
      ...config
    };
  }

  // Fetch quote from public API
  const response = await fetch(appConfig.quoteURL);
  const resposequote = await response.json();
  const { author, _id: quoteId, content: quote } = resposequote as fetchResponse;

  // Initialize and Configure Canvas
  const canvas = Canvas.createCanvas(appConfig.imageWidth, appConfig.imageHeight);
  const context = canvas.getContext('2d');

  context.fillStyle = appConfig.colors.backgroundColor;
  context.fillRect(0, 0, appConfig.imageWidth, appConfig.imageHeight);

  context.font = `bold ${appConfig.fontSize}pt ${appConfig.fontFamily}`;
  context.textAlign = 'left';
  context.textBaseline = 'top';

  // Safe width for quote is 90% of image width
  const safewidth = Math.floor(0.9 * appConfig.imageWidth);

  // Wrap long quote
  const wrappedtext = wrapText(context, quote, safewidth);

  context.fillStyle = appConfig.colors.fontColor;

  // Center quote horizontally and vertically
  const startXPos = Math.floor((appConfig.imageWidth - wrappedtext.longestLineWidth) / 2);
  const startYPos = Math.floor(
    (appConfig.imageHeight - wrappedtext.lines.length * appConfig.fontLineHeight) / 2
  );

  // Draw each line of quote on canvas
  // eslint-disable-next-line unicorn/no-array-for-each
  wrappedtext.lines.forEach(function (item: Array<string>, index: number) {
    const itemYPos = startYPos + appConfig.fontLineHeight * index;

    context.fillText(item[0], startXPos, itemYPos);
  });

  // Calculate y coordinate of quote's last line
  const endYPos = startYPos + appConfig.fontLineHeight * (wrappedtext.lines.length - 1);

  const authorText = `- ${author} `;

  const authorLineWidth = context.measureText(authorText).width;

  // Aligning author name to the right side of the quote
  const authorXPos = wrappedtext.longestLineWidth + startXPos - authorLineWidth;
  const authorYPos = endYPos + Math.floor((appConfig.imageHeight - endYPos) / 2);

  // Draw author name with position based on quote's length
  if (wrappedtext.lines.length === 1 && wrappedtext.lines[0][0].length < authorText.length) {
    context.fillText(
      authorText,
      Math.floor((appConfig.imageWidth - authorLineWidth) / 2),
      authorYPos
    );
  } else {
    context.fillText(authorText, authorXPos, authorYPos);
  }

  // Export and save image as jpg
  const buffer = canvas.toBuffer('image/jpeg', { quality: 1 });
  const datenow = new Date(Date.now());
  const imgname = `${author}-${quoteId}-${datenow.getMilliseconds()}`;

  const imgPath = saveImage(buffer, appConfig.imageFolder, imgname, appConfig.imageExt);

  // Set desktop wallpaper
  await setDesktopWallpaper(imgPath);
}

export { CreateQuoteWalpaper, setDesktopWallpaper };
