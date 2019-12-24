const BaseEngine = require('./BaseEngine');
const { spawnSync } = require('child_process');
const path = require('path');

const type = 'php';

module.exports = class PhpEngine extends BaseEngine {
  static get type() {
    return type;
  }

  getType() {
    return type;
  }

  render({bodyFilePath, body, endpoint, request, context }) {
    const mockservr = JSON.stringify({
      request: {
        url: request.url,
        path: request.path,
        method: request.method,
        headers: request.headers,
        query: request.query
      },
      endpoint,
      context
    });
    const bodyFilePathDirname = path.dirname(bodyFilePath);
    const absoluteBodyFilePath = path.resolve(bodyFilePath);
    const phpRoot = `<?php
      $_MOCKSERVR = json_decode(<<<JSON
        ${mockservr}
JSON, 'true');
      include('${absoluteBodyFilePath}');
    `;
    const phpProcess = spawnSync('php', [], {
      input: phpRoot,
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    console.log(phpProcess.stderr);
    return phpProcess.stdout;
  }
};
