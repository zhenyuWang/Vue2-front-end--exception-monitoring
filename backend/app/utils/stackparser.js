'use strict';
const ErrorStachParser = require('error-stack-parser');
const { SourceMapConsumer } = require('source-map');
const path = require('path');
const fs = require('fs');
module.exports = class StackParser {
  constructor(sourceMapDir) {
    this.sourceMapDir = sourceMapDir;
    this.consumers = {};
  }
  async parseStackTrack(stack, message) {
    const error = new Error(message);
    error.stack = stack;
    const stackFrame = ErrorStachParser.parse(error);
    return await this.getOriginalErrorStack(stackFrame);
  }
  async getOriginalErrorStack(stackFrame) {
    const origin = await this.getOriginPosition(stackFrame[0]);
    return origin;
  }
  async getOriginPosition(stackFrame) {
    let { columnNumber, lineNumber, fileName } = stackFrame;
    fileName = path.basename(fileName);
    // 判断consumer是否存在
    let consumer = this.consumers[fileName];
    if (consumer === undefined) {
      // 读取sourcemap
      const sourceMapPath = path.resolve(this.sourceMapDir, fileName + '.map');
      // 判断文件是否存在
      if (!fs.existsSync(sourceMapPath)) {
        return stackFrame;
      }
      const content = fs.readFileSync(sourceMapPath, 'utf-8');
      consumer = await new SourceMapConsumer(content, null);
      this.consumers[fileName] = consumer;
    }
    const parseData = consumer.originalPositionFor({ line: lineNumber, column: columnNumber });
    return parseData;
  }
};
