# HAL

DIY HAL 9000 for home automation. Ask a question and let the
superintelligence read out an answer to you!

Currently only records audio, analyses it with
[wit.ai](https://wit.ai/) and queries the result using
[Wolfram|Alpha API](http://products.wolframalpha.com/api/). My plan is
to add more wit.ai intents for other purposes as well in the future.

## Usage

 - Get wit.ai and Wolfram|Alpha API tokens
 - Define `WIT_TOKEN` and `WOLFRAM_APP_ID` environment variables
 - `brew install sox` to enable recording audio
 - `npm install` to install dependencies
 - Run `node index.js`, ask your question (5 second timeout), wait,
   and hear Hal read out the result to you!
