import { expect, test } from '@oclif/test';
import * as App from './../../src/cores/app';

describe('generate', () => {
  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate'])
    .it('runs generate command', (ctx) => {
      expect(ctx.stdout).to.contain('generating image with option:');

      expect(ctx.stdout).to.contain('image successfully generated');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-w', '1280'])
    .it('runs generate -w 1280', (ctx) => {
      expect(ctx.stdout).to.contain('width: 1280');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-h', '720'])
    .it('runs generate -h 720', (ctx) => {
      expect(ctx.stdout).to.contain('height: 720');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-c', '#ccc'])
    .it('runs generate -c #ccc', (ctx) => {
      expect(ctx.stdout).to.contain('font color: #ccc');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-b', '#ccc000'])
    .it('runs generate -b #ccc000', (ctx) => {
      expect(ctx.stdout).to.contain('background color: #ccc000');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-f', 'Verdana'])
    .it('runs generate -f Verdana', (ctx) => {
      expect(ctx.stdout).to.contain('font family: Verdana');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-s', '40'])
    .it('runs generate -s 40', (ctx) => {
      expect(ctx.stdout).to.contain('font size: 40');
    });

  test
    .stub(App, 'CreateQuoteWalpaper', async () => {
      return true;
    })
    .stdout()
    .command(['generate', '-o', './testimagefolder'])
    .it('runs generate -o ./testimagefolder', (ctx) => {
      expect(ctx.stdout).to.contain('output: ./testimagefolder');
    });
});
