import { expect } from '@oclif/test';
import * as App from './../src/cores/app';
import * as fs from 'node:fs';
import * as sinon from 'sinon';
import nock from 'nock';

describe('Test generating image with quote', () => {
  const imageFolder = './test-folder-image';
  const imagePath = `${imageFolder}/Milia Monstrousity-12125-808.jpg`;

  it('run generate image test', async () => {
    sinon.stub(App, 'setDesktopWallpaper').callsFake(async (imagePath: string) => {
      imagePath + 1;
    });

    sinon.stub(Date, 'now').callsFake(() => 1_683_802_520_808);

    nock('https://api.quotable.io').get('/random').reply(200, {
      author: 'Milia Monstrousity',
      content: 'Be better everyday to achieve peace in life',
      _id: '12125'
    });

    // eslint-disable-next-line new-cap
    await App.CreateQuoteWalpaper({
      imageFolder
    });

    const fileExits = fs.existsSync(imagePath);
    expect(fileExits).to.be.true;
  });

  afterEach(() => {
    fs.unlinkSync(imagePath);
    fs.rmSync(imageFolder, { recursive: true });
  });
});
