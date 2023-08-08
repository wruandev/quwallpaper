import { Command, Flags, ux } from '@oclif/core';
import * as App from './../cores/app';

export default class Generate extends Command {
  static description =
    'Generate image with quote in it and set your desktop background with the image';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    width: Flags.integer({
      char: 'w',
      description: "Image's width to generate. Set it to be same as your desktop width resolution.",
      default: 1920
    }),
    height: Flags.integer({
      char: 'h',
      description:
        "Image's height to generate. Set it to be same as your desktop height resolution.",
      default: 1080
    }),
    'font-size': Flags.integer({
      char: 's',
      description: 'Font size (pt) of the quote and author name.',
      default: 60
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output folder to store generated image.',
      default: './quotes'
    }),
    'font-family': Flags.string({
      char: 'f',
      description: 'Font family of quotes and author name.',
      default: 'Arial'
    }),
    color: Flags.string({
      char: 'c',
      description: 'Font color (hex) of the quotes and author name.',
      default: '#fff'
    }),
    'background-color': Flags.string({
      char: 'b',
      description: 'Background color (hex) of the generated image.',
      default: '#000'
    })
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Generate);

    this.log(`generating image with option:`);
    this.log(` - width: ${flags.width}`);
    this.log(` - height: ${flags.height}`);
    this.log(` - background color: ${flags['background-color']}`);
    this.log(` - font color: ${flags.color}`);
    this.log(` - font size: ${flags['font-size']}`);
    this.log(` - font family: ${flags['font-family']}`);
    this.log(` - output: ${flags.output}`);

    ux.action.start('creating...');

    // eslint-disable-next-line new-cap
    await App.CreateQuoteWalpaper({
      colors: {
        backgroundColor: flags['background-color'],
        fontColor: flags.color
      },
      imageWidth: flags.width,
      imageHeight: flags.height,
      fontSize: flags['font-size'],
      fontFamily: flags['font-family'],
      imageFolder: flags.output
    });
    ux.action.stop();

    this.log(`image successfully generated`);
  }
}
