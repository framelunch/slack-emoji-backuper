import Slack from 'slack-node';
import request from 'request';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

dotenv.config();

const { SLACK_TOKEN, OUTPUT } = process.env;
if (!SLACK_TOKEN) {
  throw new Error('Not found slack token.');
} else if (!OUTPUT) {
  throw new Error('Not found output path.');
}

const outputPath = path.join(process.cwd(), OUTPUT);
const slack = new Slack(SLACK_TOKEN);

slack.api('emoji.list', (err, response) => {
  Object.keys(response.emoji).forEach(key => {
    const url = response.emoji[key];

    if (url.match(/alias/)) {
      return;
    }

    mkdirp.sync(outputPath);
    const extention = url.match(/\.[^\.]+$/)[0];

    request
      .get(url)
      .on('response', res => console.log(`GET RESPONSE: ${url}`))
      .pipe(fs.createWriteStream(path.join(outputPath, key + extention)));
  });
});
