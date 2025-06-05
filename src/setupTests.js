// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';
// import 'web-streams-polyfill/ponyfill';
import { ReadableStream, WritableStream } from 'stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;