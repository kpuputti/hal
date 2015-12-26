'use strict';

const say = require('say');
const rec = require('node-record-lpcm16');
const wit = require('node-wit');
const request = require('request');
const wolfram = require('wolfram-alpha');

const VOICE = 'Alex';
const RECORD_OPTIONS = {

};
const RECORD_TIMEOUT = 10 * 5000;
const AUDIO_FORMAT = 'audio/wav';
const WIT_TOKEN = process.env.WIT_TOKEN;
const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID;
const WOLFRAM_OPTIONS = {};

const wolframClient = wolfram.createClient(WOLFRAM_APP_ID, WOLFRAM_OPTIONS);

function log(s) {
  console.log(s);
}

function get(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      if (err) {
        reject(err);
      } else if (response.statusCode !== 200) {
        reject(new Error('Failed to GET ' + url + ', got status ' + response.statusCode));
      } else {
        resolve(body);
      }
    });
  });
}

function record() {
  log('record()');
  const stream = rec.start(RECORD_OPTIONS);
  setTimeout(() => {
    try {
      stream.stop();
    } catch (e) {
      console.error('could not stop() stream');
    }
  }, RECORD_TIMEOUT);
  return stream;
}

function analyze(audioStream) {
  log('analyze()');
  return new Promise((resolve, reject) => {
    wit.captureSpeechIntent(WIT_TOKEN, audioStream, AUDIO_FORMAT, (err, response) => {
      if (err) {
        reject(err);
      } else {
        const text = response._text;
        resolve(text);
      }
    });
  });
}

function interpret(text) {
  log('interpret(): ' + text);
  return new Promise((resolve, reject) => {
    wolframClient.query(text, (err, response) => {
      if (err) {
        reject(err);
      } else {
        log('wolfram alpha result: ' + JSON.stringify(response, null, '  '));
        try {
          const result = response[1].subpods[0].text; // hack hack hackety hack
          resolve(text + ' ' + result);
        } catch(e) {
          reject(e);
        }
      }
    });
  });
}

function speak(text) {
  log('speak(): ' + text);
  return new Promise((resolve, reject) => {
    say.speak(VOICE, text, () => resolve(text));
  });
}

function main() {
  log('main()');
  analyze(record())
    .then(interpret)
    .then(speak)
    .then(() => log('done'))
    .catch(err => {
      console.error(err);
      speak('I\'m afraid I cannot let you do that')
        .then(() => log('done with error'));
    });
}

main();
