#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/sisteransi/src/index.js"(exports, module) {
    "use strict";
    var ESC2 = "\x1B";
    var CSI2 = `${ESC2}[`;
    var beep = "\x07";
    var cursor = {
      to(x, y2) {
        if (!y2) return `${CSI2}${x + 1}G`;
        return `${CSI2}${y2 + 1};${x + 1}H`;
      },
      move(x, y2) {
        let ret = "";
        if (x < 0) ret += `${CSI2}${-x}D`;
        else if (x > 0) ret += `${CSI2}${x}C`;
        if (y2 < 0) ret += `${CSI2}${-y2}A`;
        else if (y2 > 0) ret += `${CSI2}${y2}B`;
        return ret;
      },
      up: (count = 1) => `${CSI2}${count}A`,
      down: (count = 1) => `${CSI2}${count}B`,
      forward: (count = 1) => `${CSI2}${count}C`,
      backward: (count = 1) => `${CSI2}${count}D`,
      nextLine: (count = 1) => `${CSI2}E`.repeat(count),
      prevLine: (count = 1) => `${CSI2}F`.repeat(count),
      left: `${CSI2}G`,
      hide: `${CSI2}?25l`,
      show: `${CSI2}?25h`,
      save: `${ESC2}7`,
      restore: `${ESC2}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI2}S`.repeat(count),
      down: (count = 1) => `${CSI2}T`.repeat(count)
    };
    var erase = {
      screen: `${CSI2}2J`,
      up: (count = 1) => `${CSI2}1J`.repeat(count),
      down: (count = 1) => `${CSI2}J`.repeat(count),
      line: `${CSI2}2K`,
      lineEnd: `${CSI2}K`,
      lineStart: `${CSI2}1K`,
      lines(count) {
        let clear = "";
        for (let i = 0; i < count; i++)
          clear += this.line + (i < count - 1 ? cursor.up() : "");
        if (count)
          clear += cursor.left;
        return clear;
      }
    };
    module.exports = { cursor, scroll, erase, beep };
  }
});

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/picocolors/picocolors.js"(exports, module) {
    var p2 = process || {};
    var argv = p2.argv || [];
    var env = p2.env || {};
    var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p2.platform === "win32" || (p2.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input, index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "", cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors = (enabled = isColorSupported) => {
      let f = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: f("\x1B[0m", "\x1B[0m"),
        bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: f("\x1B[3m", "\x1B[23m"),
        underline: f("\x1B[4m", "\x1B[24m"),
        inverse: f("\x1B[7m", "\x1B[27m"),
        hidden: f("\x1B[8m", "\x1B[28m"),
        strikethrough: f("\x1B[9m", "\x1B[29m"),
        black: f("\x1B[30m", "\x1B[39m"),
        red: f("\x1B[31m", "\x1B[39m"),
        green: f("\x1B[32m", "\x1B[39m"),
        yellow: f("\x1B[33m", "\x1B[39m"),
        blue: f("\x1B[34m", "\x1B[39m"),
        magenta: f("\x1B[35m", "\x1B[39m"),
        cyan: f("\x1B[36m", "\x1B[39m"),
        white: f("\x1B[37m", "\x1B[39m"),
        gray: f("\x1B[90m", "\x1B[39m"),
        bgBlack: f("\x1B[40m", "\x1B[49m"),
        bgRed: f("\x1B[41m", "\x1B[49m"),
        bgGreen: f("\x1B[42m", "\x1B[49m"),
        bgYellow: f("\x1B[43m", "\x1B[49m"),
        bgBlue: f("\x1B[44m", "\x1B[49m"),
        bgMagenta: f("\x1B[45m", "\x1B[49m"),
        bgCyan: f("\x1B[46m", "\x1B[49m"),
        bgWhite: f("\x1B[47m", "\x1B[49m"),
        blackBright: f("\x1B[90m", "\x1B[39m"),
        redBright: f("\x1B[91m", "\x1B[39m"),
        greenBright: f("\x1B[92m", "\x1B[39m"),
        yellowBright: f("\x1B[93m", "\x1B[39m"),
        blueBright: f("\x1B[94m", "\x1B[39m"),
        magentaBright: f("\x1B[95m", "\x1B[39m"),
        cyanBright: f("\x1B[96m", "\x1B[39m"),
        whiteBright: f("\x1B[97m", "\x1B[39m"),
        bgBlackBright: f("\x1B[100m", "\x1B[49m"),
        bgRedBright: f("\x1B[101m", "\x1B[49m"),
        bgGreenBright: f("\x1B[102m", "\x1B[49m"),
        bgYellowBright: f("\x1B[103m", "\x1B[49m"),
        bgBlueBright: f("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
        bgCyanBright: f("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: f("\x1B[107m", "\x1B[49m")
      };
    };
    module.exports = createColors();
    module.exports.createColors = createColors;
  }
});

// node_modules/@clack/core/dist/index.mjs
import { styleText as y } from "node:util";
import { stdout as S, stdin as $ } from "node:process";
import * as _ from "node:readline";
import P from "node:readline";

// node_modules/fast-string-truncated-width/dist/utils.js
var isAmbiguous = (x) => {
  return x === 161 || x === 164 || x === 167 || x === 168 || x === 170 || x === 173 || x === 174 || x >= 176 && x <= 180 || x >= 182 && x <= 186 || x >= 188 && x <= 191 || x === 198 || x === 208 || x === 215 || x === 216 || x >= 222 && x <= 225 || x === 230 || x >= 232 && x <= 234 || x === 236 || x === 237 || x === 240 || x === 242 || x === 243 || x >= 247 && x <= 250 || x === 252 || x === 254 || x === 257 || x === 273 || x === 275 || x === 283 || x === 294 || x === 295 || x === 299 || x >= 305 && x <= 307 || x === 312 || x >= 319 && x <= 322 || x === 324 || x >= 328 && x <= 331 || x === 333 || x === 338 || x === 339 || x === 358 || x === 359 || x === 363 || x === 462 || x === 464 || x === 466 || x === 468 || x === 470 || x === 472 || x === 474 || x === 476 || x === 593 || x === 609 || x === 708 || x === 711 || x >= 713 && x <= 715 || x === 717 || x === 720 || x >= 728 && x <= 731 || x === 733 || x === 735 || x >= 768 && x <= 879 || x >= 913 && x <= 929 || x >= 931 && x <= 937 || x >= 945 && x <= 961 || x >= 963 && x <= 969 || x === 1025 || x >= 1040 && x <= 1103 || x === 1105 || x === 8208 || x >= 8211 && x <= 8214 || x === 8216 || x === 8217 || x === 8220 || x === 8221 || x >= 8224 && x <= 8226 || x >= 8228 && x <= 8231 || x === 8240 || x === 8242 || x === 8243 || x === 8245 || x === 8251 || x === 8254 || x === 8308 || x === 8319 || x >= 8321 && x <= 8324 || x === 8364 || x === 8451 || x === 8453 || x === 8457 || x === 8467 || x === 8470 || x === 8481 || x === 8482 || x === 8486 || x === 8491 || x === 8531 || x === 8532 || x >= 8539 && x <= 8542 || x >= 8544 && x <= 8555 || x >= 8560 && x <= 8569 || x === 8585 || x >= 8592 && x <= 8601 || x === 8632 || x === 8633 || x === 8658 || x === 8660 || x === 8679 || x === 8704 || x === 8706 || x === 8707 || x === 8711 || x === 8712 || x === 8715 || x === 8719 || x === 8721 || x === 8725 || x === 8730 || x >= 8733 && x <= 8736 || x === 8739 || x === 8741 || x >= 8743 && x <= 8748 || x === 8750 || x >= 8756 && x <= 8759 || x === 8764 || x === 8765 || x === 8776 || x === 8780 || x === 8786 || x === 8800 || x === 8801 || x >= 8804 && x <= 8807 || x === 8810 || x === 8811 || x === 8814 || x === 8815 || x === 8834 || x === 8835 || x === 8838 || x === 8839 || x === 8853 || x === 8857 || x === 8869 || x === 8895 || x === 8978 || x >= 9312 && x <= 9449 || x >= 9451 && x <= 9547 || x >= 9552 && x <= 9587 || x >= 9600 && x <= 9615 || x >= 9618 && x <= 9621 || x === 9632 || x === 9633 || x >= 9635 && x <= 9641 || x === 9650 || x === 9651 || x === 9654 || x === 9655 || x === 9660 || x === 9661 || x === 9664 || x === 9665 || x >= 9670 && x <= 9672 || x === 9675 || x >= 9678 && x <= 9681 || x >= 9698 && x <= 9701 || x === 9711 || x === 9733 || x === 9734 || x === 9737 || x === 9742 || x === 9743 || x === 9756 || x === 9758 || x === 9792 || x === 9794 || x === 9824 || x === 9825 || x >= 9827 && x <= 9829 || x >= 9831 && x <= 9834 || x === 9836 || x === 9837 || x === 9839 || x === 9886 || x === 9887 || x === 9919 || x >= 9926 && x <= 9933 || x >= 9935 && x <= 9939 || x >= 9941 && x <= 9953 || x === 9955 || x === 9960 || x === 9961 || x >= 9963 && x <= 9969 || x === 9972 || x >= 9974 && x <= 9977 || x === 9979 || x === 9980 || x === 9982 || x === 9983 || x === 10045 || x >= 10102 && x <= 10111 || x >= 11094 && x <= 11097 || x >= 12872 && x <= 12879 || x >= 57344 && x <= 63743 || x >= 65024 && x <= 65039 || x === 65533 || x >= 127232 && x <= 127242 || x >= 127248 && x <= 127277 || x >= 127280 && x <= 127337 || x >= 127344 && x <= 127373 || x === 127375 || x === 127376 || x >= 127387 && x <= 127404 || x >= 917760 && x <= 917999 || x >= 983040 && x <= 1048573 || x >= 1048576 && x <= 1114109;
};
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWide = (x) => {
  return x >= 4352 && x <= 4447 || x === 8986 || x === 8987 || x === 9001 || x === 9002 || x >= 9193 && x <= 9196 || x === 9200 || x === 9203 || x === 9725 || x === 9726 || x === 9748 || x === 9749 || x >= 9800 && x <= 9811 || x === 9855 || x === 9875 || x === 9889 || x === 9898 || x === 9899 || x === 9917 || x === 9918 || x === 9924 || x === 9925 || x === 9934 || x === 9940 || x === 9962 || x === 9970 || x === 9971 || x === 9973 || x === 9978 || x === 9981 || x === 9989 || x === 9994 || x === 9995 || x === 10024 || x === 10060 || x === 10062 || x >= 10067 && x <= 10069 || x === 10071 || x >= 10133 && x <= 10135 || x === 10160 || x === 10175 || x === 11035 || x === 11036 || x === 11088 || x === 11093 || x >= 11904 && x <= 11929 || x >= 11931 && x <= 12019 || x >= 12032 && x <= 12245 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12353 && x <= 12438 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 19968 && x <= 42124 || x >= 42128 && x <= 42182 || x >= 43360 && x <= 43388 || x >= 44032 && x <= 55203 || x >= 63744 && x <= 64255 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 94176 && x <= 94180 || x === 94192 || x === 94193 || x >= 94208 && x <= 100343 || x >= 100352 && x <= 101589 || x >= 101632 && x <= 101640 || x >= 110576 && x <= 110579 || x >= 110581 && x <= 110587 || x === 110589 || x === 110590 || x >= 110592 && x <= 110882 || x === 110898 || x >= 110928 && x <= 110930 || x === 110933 || x >= 110948 && x <= 110951 || x >= 110960 && x <= 111355 || x === 126980 || x === 127183 || x === 127374 || x >= 127377 && x <= 127386 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x === 127568 || x === 127569 || x >= 127584 && x <= 127589 || x >= 127744 && x <= 127776 || x >= 127789 && x <= 127797 || x >= 127799 && x <= 127868 || x >= 127870 && x <= 127891 || x >= 127904 && x <= 127946 || x >= 127951 && x <= 127955 || x >= 127968 && x <= 127984 || x === 127988 || x >= 127992 && x <= 128062 || x === 128064 || x >= 128066 && x <= 128252 || x >= 128255 && x <= 128317 || x >= 128331 && x <= 128334 || x >= 128336 && x <= 128359 || x === 128378 || x === 128405 || x === 128406 || x === 128420 || x >= 128507 && x <= 128591 || x >= 128640 && x <= 128709 || x === 128716 || x >= 128720 && x <= 128722 || x >= 128725 && x <= 128727 || x >= 128732 && x <= 128735 || x === 128747 || x === 128748 || x >= 128756 && x <= 128764 || x >= 128992 && x <= 129003 || x === 129008 || x >= 129292 && x <= 129338 || x >= 129340 && x <= 129349 || x >= 129351 && x <= 129535 || x >= 129648 && x <= 129660 || x >= 129664 && x <= 129672 || x >= 129680 && x <= 129725 || x >= 129727 && x <= 129733 || x >= 129742 && x <= 129755 || x >= 129760 && x <= 129768 || x >= 129776 && x <= 129784 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = new RegExp("[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F\\u20E3?))*", "yu");
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = new RegExp("\\p{M}+", "gu");
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = widthOptions.ansiWidth ?? 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const AMBIGUOUS_WIDTH = widthOptions.ambiguousWidth ?? 1;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = widthOptions.fullWidthWidth ?? 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? 2;
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer: while (true) {
    if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
      const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
      lengthExtra = 0;
      for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
        const codePoint = char.codePointAt(0) || 0;
        if (isFullWidth(codePoint)) {
          widthExtra = FULL_WIDTH_WIDTH;
        } else if (isWide(codePoint)) {
          widthExtra = WIDE_WIDTH;
        } else if (AMBIGUOUS_WIDTH !== REGULAR_WIDTH && isAmbiguous(codePoint)) {
          widthExtra = AMBIGUOUS_WIDTH;
        } else {
          widthExtra = REGULAR_WIDTH;
        }
        if (width + widthExtra > truncationLimit) {
          truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
        }
        if (width + widthExtra > LIMIT) {
          truncationEnabled = true;
          break outer;
        }
        lengthExtra += char.length;
        width += widthExtra;
      }
      unmatchedStart = unmatchedEnd = 0;
    }
    if (index >= length)
      break;
    LATIN_RE.lastIndex = index;
    if (LATIN_RE.test(input)) {
      lengthExtra = LATIN_RE.lastIndex - index;
      widthExtra = lengthExtra * REGULAR_WIDTH;
      if (width + widthExtra > truncationLimit) {
        truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / REGULAR_WIDTH));
      }
      if (width + widthExtra > LIMIT) {
        truncationEnabled = true;
        break;
      }
      width += widthExtra;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = LATIN_RE.lastIndex;
      continue;
    }
    ANSI_RE.lastIndex = index;
    if (ANSI_RE.test(input)) {
      if (width + ANSI_WIDTH > truncationLimit) {
        truncationIndex = Math.min(truncationIndex, index);
      }
      if (width + ANSI_WIDTH > LIMIT) {
        truncationEnabled = true;
        break;
      }
      width += ANSI_WIDTH;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = ANSI_RE.lastIndex;
      continue;
    }
    CONTROL_RE.lastIndex = index;
    if (CONTROL_RE.test(input)) {
      lengthExtra = CONTROL_RE.lastIndex - index;
      widthExtra = lengthExtra * CONTROL_WIDTH;
      if (width + widthExtra > truncationLimit) {
        truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / CONTROL_WIDTH));
      }
      if (width + widthExtra > LIMIT) {
        truncationEnabled = true;
        break;
      }
      width += widthExtra;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = CONTROL_RE.lastIndex;
      continue;
    }
    TAB_RE.lastIndex = index;
    if (TAB_RE.test(input)) {
      lengthExtra = TAB_RE.lastIndex - index;
      widthExtra = lengthExtra * TAB_WIDTH;
      if (width + widthExtra > truncationLimit) {
        truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / TAB_WIDTH));
      }
      if (width + widthExtra > LIMIT) {
        truncationEnabled = true;
        break;
      }
      width += widthExtra;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = TAB_RE.lastIndex;
      continue;
    }
    EMOJI_RE.lastIndex = index;
    if (EMOJI_RE.test(input)) {
      if (width + EMOJI_WIDTH > truncationLimit) {
        truncationIndex = Math.min(truncationIndex, index);
      }
      if (width + EMOJI_WIDTH > LIMIT) {
        truncationEnabled = true;
        break;
      }
      width += EMOJI_WIDTH;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = EMOJI_RE.lastIndex;
      continue;
    }
    index += 1;
  }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options = {}) => {
  return dist_default(input, NO_TRUNCATION2, options).width;
};
var dist_default2 = fastStringWidth;

// node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "\x9B";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return void 0;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === void 0 ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== void 0 && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options = {}) => {
  if (options.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    if (options.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join("\n");
  let inSurrogate = false;
  for (let i = 0; i < preString.length; i++) {
    const character = preString[i];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
    } else {
      continue;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== void 0) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? void 0 : code;
      } else if (groups?.uri !== void 0) {
        escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
      }
    }
    if (preString[i + 1] === "\n") {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : void 0;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === "\n") {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join("\n");
}

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { ReadStream as D } from "node:tty";
function d(r, t2, e) {
  if (!e.some((o) => !o.disabled)) return r;
  const s = r + t2, i = Math.max(e.length - 1, 0), n = s < 0 ? i : s > i ? 0 : s;
  return e[n].disabled ? d(n, t2 < 0 ? -1 : 1, e) : n;
}
var E = ["up", "down", "left", "right", "space", "enter", "cancel"];
var G = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var u = { actions: new Set(E), aliases: /* @__PURE__ */ new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["", "cancel"], ["escape", "cancel"]]), messages: { cancel: "Canceled", error: "Something went wrong" }, withGuide: true, date: { monthNames: [...G], messages: { required: "Please enter a valid date", invalidMonth: "There are only 12 months in a year", invalidDay: (r, t2) => `There are only ${r} days in ${t2}`, afterMin: (r) => `Date must be on or after ${r.toISOString().slice(0, 10)}`, beforeMax: (r) => `Date must be on or before ${r.toISOString().slice(0, 10)}` } } };
function V(r, t2) {
  if (typeof r == "string") return u.aliases.get(r) === t2;
  for (const e of r) if (e !== void 0 && V(e, t2)) return true;
  return false;
}
function j(r, t2) {
  if (r === t2) return;
  const e = r.split(`
`), s = t2.split(`
`), i = Math.max(e.length, s.length), n = [];
  for (let o = 0; o < i; o++) e[o] !== s[o] && n.push(o);
  return { lines: n, numLinesBefore: e.length, numLinesAfter: s.length, numLines: i };
}
var Y = globalThis.process.platform.startsWith("win");
var C = Symbol("clack:cancel");
function q(r) {
  return r === C;
}
function w(r, t2) {
  const e = r;
  e.isTTY && e.setRawMode(t2);
}
function z({ input: r = $, output: t2 = S, overwrite: e = true, hideCursor: s = true } = {}) {
  const i = _.createInterface({ input: r, output: t2, prompt: "", tabSize: 1 });
  _.emitKeypressEvents(r, i), r instanceof D && r.isTTY && r.setRawMode(true);
  const n = (o, { name: a, sequence: h }) => {
    const l = String(o);
    if (V([l, a, h], "cancel")) {
      s && t2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!e) return;
    const f = a === "return" ? 0 : -1, v = a === "return" ? -1 : 0;
    _.moveCursor(t2, f, v, () => {
      _.clearLine(t2, 1, () => {
        r.once("keypress", n);
      });
    });
  };
  return s && t2.write(import_sisteransi.cursor.hide), r.once("keypress", n), () => {
    r.off("keypress", n), s && t2.write(import_sisteransi.cursor.show), r instanceof D && r.isTTY && !Y && r.setRawMode(false), i.terminal = false, i.close();
  };
}
var O = (r) => "columns" in r && typeof r.columns == "number" ? r.columns : 80;
var A = (r) => "rows" in r && typeof r.rows == "number" ? r.rows : 20;
function R(r, t2, e, s = e) {
  const i = O(r ?? S);
  return wrapAnsi(t2, i - e.length, { hard: true, trim: false }).split(`
`).map((n, o) => `${o === 0 ? s : e}${n}`).join(`
`);
}
var p = class {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = /* @__PURE__ */ new Map();
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(t2, e = true) {
    const { input: s = $, output: i = S, render: n, signal: o, ...a } = t2;
    this.opts = a, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = n.bind(this), this._track = e, this._abortSignal = o, this.input = s, this.output = i;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(t2, e) {
    const s = this._subscribers.get(t2) ?? [];
    s.push(e), this._subscribers.set(t2, s);
  }
  on(t2, e) {
    this.setSubscriber(t2, { cb: e });
  }
  once(t2, e) {
    this.setSubscriber(t2, { cb: e, once: true });
  }
  emit(t2, ...e) {
    const s = this._subscribers.get(t2) ?? [], i = [];
    for (const n of s) n.cb(...e), n.once && i.push(() => s.splice(s.indexOf(n), 1));
    for (const n of i) n();
  }
  prompt() {
    return new Promise((t2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted) return this.state = "cancel", this.close(), t2(C);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = P.createInterface({ input: this.input, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), w(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), w(this.input, false), t2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), w(this.input, false), t2(C);
      });
    });
  }
  _isActionKey(t2, e) {
    return t2 === "	";
  }
  _setValue(t2) {
    this.value = t2, this.emit("value", this.value);
  }
  _setUserInput(t2, e) {
    this.userInput = t2 ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(t2, e) {
    if (this._track && e.name !== "return" && (e.name && this._isActionKey(t2, e) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && u.aliases.has(e.name) && this.emit("cursor", u.aliases.get(e.name)), u.actions.has(e.name) && this.emit("cursor", e.name)), t2 && (t2.toLowerCase() === "y" || t2.toLowerCase() === "n") && this.emit("confirm", t2.toLowerCase() === "y"), this.emit("key", t2?.toLowerCase(), e), e?.name === "return") {
      if (this.opts.validate) {
        const s = this.opts.validate(this.value);
        s && (this.error = s instanceof Error ? s.message : s, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    V([t2, e?.name, e?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), w(this.input, false), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const t2 = wrapAnsi(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, t2 * -1));
  }
  render() {
    const t2 = wrapAnsi(this._render(this) ?? "", process.stdout.columns, { hard: true, trim: false });
    if (t2 !== this._prevFrame) {
      if (this.state === "initial") this.output.write(import_sisteransi.cursor.hide);
      else {
        const e = j(this._prevFrame, t2), s = A(this.output);
        if (this.restoreCursor(), e) {
          const i = Math.max(0, e.numLinesAfter - s), n = Math.max(0, e.numLinesBefore - s);
          let o = e.lines.find((a) => a >= i);
          if (o === void 0) {
            this._prevFrame = t2;
            return;
          }
          if (e.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, o - n)), this.output.write(import_sisteransi.erase.lines(1));
            const a = t2.split(`
`);
            this.output.write(a[o]), this._prevFrame = t2, this.output.write(import_sisteransi.cursor.move(0, a.length - o - 1));
            return;
          } else if (e.lines.length > 1) {
            if (i < n) o = i;
            else {
              const h = o - n;
              h > 0 && this.output.write(import_sisteransi.cursor.move(0, h));
            }
            this.output.write(import_sisteransi.erase.down());
            const a = t2.split(`
`).slice(o);
            this.output.write(a.join(`
`)), this._prevFrame = t2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(t2), this.state === "initial" && (this.state = "active"), this._prevFrame = t2;
    }
  }
};
var Q = class extends p {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(t2) {
    super(t2, false), this.value = !!t2.initialValue, this.on("userInput", () => {
      this.value = this._value;
    }), this.on("confirm", (e) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = e, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
};
var it = class extends p {
  options;
  cursor = 0;
  get _value() {
    return this.options[this.cursor].value;
  }
  get _enabledOptions() {
    return this.options.filter((t2) => t2.disabled !== true);
  }
  toggleAll() {
    const t2 = this._enabledOptions, e = this.value !== void 0 && this.value.length === t2.length;
    this.value = e ? [] : t2.map((s) => s.value);
  }
  toggleInvert() {
    const t2 = this.value;
    if (!t2) return;
    const e = this._enabledOptions.filter((s) => !t2.includes(s.value));
    this.value = e.map((s) => s.value);
  }
  toggleValue() {
    this.value === void 0 && (this.value = []);
    const t2 = this.value.includes(this._value);
    this.value = t2 ? this.value.filter((e) => e !== this._value) : [...this.value, this._value];
  }
  constructor(t2) {
    super(t2, false), this.options = t2.options, this.value = [...t2.initialValues ?? []];
    const e = Math.max(this.options.findIndex(({ value: s }) => s === t2.cursorAt), 0);
    this.cursor = this.options[e].disabled ? d(e, 1, this.options) : e, this.on("key", (s) => {
      s === "a" && this.toggleAll(), s === "i" && this.toggleInvert();
    }), this.on("cursor", (s) => {
      switch (s) {
        case "left":
        case "up":
          this.cursor = d(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = d(this.cursor, 1, this.options);
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
var rt = class extends p {
  _mask = "\u2022";
  get cursor() {
    return this._cursor;
  }
  get masked() {
    return this.userInput.replaceAll(/./g, this._mask);
  }
  get userInputWithCursor() {
    if (this.state === "submit" || this.state === "cancel") return this.masked;
    const t2 = this.userInput;
    if (this.cursor >= t2.length) return `${this.masked}${y(["inverse", "hidden"], "_")}`;
    const e = this.masked, s = e.slice(0, this.cursor), i = e.slice(this.cursor);
    return `${s}${y("inverse", i[0])}${i.slice(1)}`;
  }
  clear() {
    this._clearUserInput();
  }
  constructor({ mask: t2, ...e }) {
    super(e), this._mask = t2 ?? "\u2022", this.on("userInput", (s) => {
      this._setValue(s);
    });
  }
};
var nt = class extends p {
  options;
  cursor = 0;
  get _selectedValue() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._selectedValue.value;
  }
  constructor(t2) {
    super(t2, false), this.options = t2.options;
    const e = this.options.findIndex(({ value: i }) => i === t2.initialValue), s = e === -1 ? 0 : e;
    this.cursor = this.options[s].disabled ? d(s, 1, this.options) : s, this.changeValue(), this.on("cursor", (i) => {
      switch (i) {
        case "left":
        case "up":
          this.cursor = d(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = d(this.cursor, 1, this.options);
          break;
      }
      this.changeValue();
    });
  }
};
var at = class extends p {
  get userInputWithCursor() {
    if (this.state === "submit") return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length) return `${this.userInput}\u2588`;
    const e = t2.slice(0, this.cursor), [s, ...i] = t2.slice(this.cursor);
    return `${e}${y("inverse", s)}${i.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(t2) {
    super({ ...t2, initialUserInput: t2.initialUserInput ?? t2.initialValue }), this.on("userInput", (e) => {
      this._setValue(e);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === void 0 && (this.value = "");
    });
  }
};

// node_modules/@clack/prompts/dist/index.mjs
import { styleText as t, stripVTControlCharacters as ne } from "node:util";
import P2 from "node:process";
var import_sisteransi2 = __toESM(require_src(), 1);
function Ze() {
  return P2.platform !== "win32" ? P2.env.TERM !== "linux" : !!P2.env.CI || !!P2.env.WT_SESSION || !!P2.env.TERMINUS_SUBLIME || P2.env.ConEmuTask === "{cmd::Cmder}" || P2.env.TERM_PROGRAM === "Terminus-Sublime" || P2.env.TERM_PROGRAM === "vscode" || P2.env.TERM === "xterm-256color" || P2.env.TERM === "alacritty" || P2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var ee = Ze();
var ae = () => process.env.CI === "true";
var w2 = (e, i) => ee ? e : i;
var _e = w2("\u25C6", "*");
var oe = w2("\u25A0", "x");
var ue = w2("\u25B2", "x");
var F = w2("\u25C7", "o");
var le = w2("\u250C", "T");
var d2 = w2("\u2502", "|");
var E2 = w2("\u2514", "\u2014");
var Ie = w2("\u2510", "T");
var Ee = w2("\u2518", "\u2014");
var z2 = w2("\u25CF", ">");
var H2 = w2("\u25CB", " ");
var te = w2("\u25FB", "[\u2022]");
var U = w2("\u25FC", "[+]");
var J = w2("\u25FB", "[ ]");
var xe = w2("\u25AA", "\u2022");
var se = w2("\u2500", "-");
var ce = w2("\u256E", "+");
var Ge = w2("\u251C", "+");
var $e = w2("\u256F", "+");
var de = w2("\u2570", "+");
var Oe = w2("\u256D", "+");
var he = w2("\u25CF", "\u2022");
var pe = w2("\u25C6", "*");
var me = w2("\u25B2", "!");
var ge = w2("\u25A0", "x");
var V2 = (e) => {
  switch (e) {
    case "initial":
    case "active":
      return t("cyan", _e);
    case "cancel":
      return t("red", oe);
    case "error":
      return t("yellow", ue);
    case "submit":
      return t("green", F);
  }
};
var ye = (e) => {
  switch (e) {
    case "initial":
    case "active":
      return t("cyan", d2);
    case "cancel":
      return t("red", d2);
    case "error":
      return t("yellow", d2);
    case "submit":
      return t("green", d2);
  }
};
var et2 = (e, i, s, r, u2) => {
  let n = i, o = 0;
  for (let c2 = s; c2 < r; c2++) {
    const a = e[c2];
    if (n = n - a.length, o++, n <= u2) break;
  }
  return { lineCount: n, removals: o };
};
var Y2 = ({ cursor: e, options: i, style: s, output: r = process.stdout, maxItems: u2 = Number.POSITIVE_INFINITY, columnPadding: n = 0, rowPadding: o = 4 }) => {
  const c2 = O(r) - n, a = A(r), l = t("dim", "..."), $2 = Math.max(a - o, 0), y2 = Math.max(Math.min(u2, $2), 5);
  let p2 = 0;
  e >= y2 - 3 && (p2 = Math.max(Math.min(e - y2 + 3, i.length - y2), 0));
  let m = y2 < i.length && p2 > 0, g = y2 < i.length && p2 + y2 < i.length;
  const S2 = Math.min(p2 + y2, i.length), h = [];
  let f = 0;
  m && f++, g && f++;
  const v = p2 + (m ? 1 : 0), T = S2 - (g ? 1 : 0);
  for (let b = v; b < T; b++) {
    const x = wrapAnsi(s(i[b], b === e), c2, { hard: true, trim: false }).split(`
`);
    h.push(x), f += x.length;
  }
  if (f > $2) {
    let b = 0, x = 0, G2 = f;
    const M2 = e - v, R2 = (j2, D2) => et2(h, G2, j2, D2, $2);
    m ? ({ lineCount: G2, removals: b } = R2(0, M2), G2 > $2 && ({ lineCount: G2, removals: x } = R2(M2 + 1, h.length))) : ({ lineCount: G2, removals: x } = R2(M2 + 1, h.length), G2 > $2 && ({ lineCount: G2, removals: b } = R2(0, M2))), b > 0 && (m = true, h.splice(0, b)), x > 0 && (g = true, h.splice(h.length - x, x));
  }
  const C2 = [];
  m && C2.push(l);
  for (const b of h) for (const x of b) C2.push(x);
  return g && C2.push(l), C2;
};
var ot2 = (e) => {
  const i = e.active ?? "Yes", s = e.inactive ?? "No";
  return new Q({ active: i, inactive: s, signal: e.signal, input: e.input, output: e.output, initialValue: e.initialValue ?? true, render() {
    const r = e.withGuide ?? u.withGuide, u2 = `${V2(this.state)}  `, n = r ? `${t("gray", d2)}  ` : "", o = R(e.output, e.message, n, u2), c2 = `${r ? `${t("gray", d2)}
` : ""}${o}
`, a = this.value ? i : s;
    switch (this.state) {
      case "submit": {
        const l = r ? `${t("gray", d2)}  ` : "";
        return `${c2}${l}${t("dim", a)}`;
      }
      case "cancel": {
        const l = r ? `${t("gray", d2)}  ` : "";
        return `${c2}${l}${t(["strikethrough", "dim"], a)}${r ? `
${t("gray", d2)}` : ""}`;
      }
      default: {
        const l = r ? `${t("cyan", d2)}  ` : "", $2 = r ? t("cyan", E2) : "";
        return `${c2}${l}${this.value ? `${t("green", z2)} ${i}` : `${t("dim", H2)} ${t("dim", i)}`}${e.vertical ? r ? `
${t("cyan", d2)}  ` : `
` : ` ${t("dim", "/")} `}${this.value ? `${t("dim", H2)} ${t("dim", s)}` : `${t("green", z2)} ${s}`}
${$2}
`;
      }
    }
  } }).prompt();
};
var O2 = { message: (e = [], { symbol: i = t("gray", d2), secondarySymbol: s = t("gray", d2), output: r = process.stdout, spacing: u2 = 1, withGuide: n } = {}) => {
  const o = [], c2 = n ?? u.withGuide, a = c2 ? s : "", l = c2 ? `${i}  ` : "", $2 = c2 ? `${s}  ` : "";
  for (let p2 = 0; p2 < u2; p2++) o.push(a);
  const y2 = Array.isArray(e) ? e : e.split(`
`);
  if (y2.length > 0) {
    const [p2, ...m] = y2;
    p2.length > 0 ? o.push(`${l}${p2}`) : o.push(c2 ? i : "");
    for (const g of m) g.length > 0 ? o.push(`${$2}${g}`) : o.push(c2 ? s : "");
  }
  r.write(`${o.join(`
`)}
`);
}, info: (e, i) => {
  O2.message(e, { ...i, symbol: t("blue", he) });
}, success: (e, i) => {
  O2.message(e, { ...i, symbol: t("green", pe) });
}, step: (e, i) => {
  O2.message(e, { ...i, symbol: t("green", F) });
}, warn: (e, i) => {
  O2.message(e, { ...i, symbol: t("yellow", me) });
}, warning: (e, i) => {
  O2.warn(e, i);
}, error: (e, i) => {
  O2.message(e, { ...i, symbol: t("red", ge) });
} };
var pt = (e = "", i) => {
  const s = i?.output ?? process.stdout, r = i?.withGuide ?? u.withGuide ? `${t("gray", E2)}  ` : "";
  s.write(`${r}${t("red", e)}

`);
};
var mt = (e = "", i) => {
  const s = i?.output ?? process.stdout, r = i?.withGuide ?? u.withGuide ? `${t("gray", le)}  ` : "";
  s.write(`${r}${e}
`);
};
var gt = (e = "", i) => {
  const s = i?.output ?? process.stdout, r = i?.withGuide ?? u.withGuide ? `${t("gray", d2)}
${t("gray", E2)}  ` : "";
  s.write(`${r}${e}

`);
};
var Q2 = (e, i) => e.split(`
`).map((s) => i(s)).join(`
`);
var yt = (e) => {
  const i = (r, u2) => {
    const n = r.label ?? String(r.value);
    return u2 === "disabled" ? `${t("gray", J)} ${Q2(n, (o) => t(["strikethrough", "gray"], o))}${r.hint ? ` ${t("dim", `(${r.hint ?? "disabled"})`)}` : ""}` : u2 === "active" ? `${t("cyan", te)} ${n}${r.hint ? ` ${t("dim", `(${r.hint})`)}` : ""}` : u2 === "selected" ? `${t("green", U)} ${Q2(n, (o) => t("dim", o))}${r.hint ? ` ${t("dim", `(${r.hint})`)}` : ""}` : u2 === "cancelled" ? `${Q2(n, (o) => t(["strikethrough", "dim"], o))}` : u2 === "active-selected" ? `${t("green", U)} ${n}${r.hint ? ` ${t("dim", `(${r.hint})`)}` : ""}` : u2 === "submitted" ? `${Q2(n, (o) => t("dim", o))}` : `${t("dim", J)} ${Q2(n, (o) => t("dim", o))}`;
  }, s = e.required ?? true;
  return new it({ options: e.options, signal: e.signal, input: e.input, output: e.output, initialValues: e.initialValues, required: s, cursorAt: e.cursorAt, validate(r) {
    if (s && (r === void 0 || r.length === 0)) return `Please select at least one option.
${t("reset", t("dim", `Press ${t(["gray", "bgWhite", "inverse"], " space ")} to select, ${t("gray", t("bgWhite", t("inverse", " enter ")))} to submit`))}`;
  }, render() {
    const r = e.withGuide ?? u.withGuide, u2 = R(e.output, e.message, r ? `${ye(this.state)}  ` : "", `${V2(this.state)}  `), n = `${r ? `${t("gray", d2)}
` : ""}${u2}
`, o = this.value ?? [], c2 = (a, l) => {
      if (a.disabled) return i(a, "disabled");
      const $2 = o.includes(a.value);
      return l && $2 ? i(a, "active-selected") : $2 ? i(a, "selected") : i(a, l ? "active" : "inactive");
    };
    switch (this.state) {
      case "submit": {
        const a = this.options.filter(({ value: $2 }) => o.includes($2)).map(($2) => i($2, "submitted")).join(t("dim", ", ")) || t("dim", "none"), l = R(e.output, a, r ? `${t("gray", d2)}  ` : "");
        return `${n}${l}`;
      }
      case "cancel": {
        const a = this.options.filter(({ value: $2 }) => o.includes($2)).map(($2) => i($2, "cancelled")).join(t("dim", ", "));
        if (a.trim() === "") return `${n}${t("gray", d2)}`;
        const l = R(e.output, a, r ? `${t("gray", d2)}  ` : "");
        return `${n}${l}${r ? `
${t("gray", d2)}` : ""}`;
      }
      case "error": {
        const a = r ? `${t("yellow", d2)}  ` : "", l = this.error.split(`
`).map((p2, m) => m === 0 ? `${r ? `${t("yellow", E2)}  ` : ""}${t("yellow", p2)}` : `   ${p2}`).join(`
`), $2 = n.split(`
`).length, y2 = l.split(`
`).length + 1;
        return `${n}${a}${Y2({ output: e.output, options: this.options, cursor: this.cursor, maxItems: e.maxItems, columnPadding: a.length, rowPadding: $2 + y2, style: c2 }).join(`
${a}`)}
${l}
`;
      }
      default: {
        const a = r ? `${t("cyan", d2)}  ` : "", l = n.split(`
`).length, $2 = r ? 2 : 1;
        return `${n}${a}${Y2({ output: e.output, options: this.options, cursor: this.cursor, maxItems: e.maxItems, columnPadding: a.length, rowPadding: l + $2, style: c2 }).join(`
${a}`)}
${r ? t("cyan", E2) : ""}
`;
      }
    }
  } }).prompt();
};
var ft = (e) => t("dim", e);
var vt = (e, i, s) => {
  const r = { hard: true, trim: false }, u2 = wrapAnsi(e, i, r).split(`
`), n = u2.reduce((a, l) => Math.max(dist_default2(l), a), 0), o = u2.map(s).reduce((a, l) => Math.max(dist_default2(l), a), 0), c2 = i - (o - n);
  return wrapAnsi(e, c2, r);
};
var wt = (e = "", i = "", s) => {
  const r = s?.output ?? P2.stdout, u2 = s?.withGuide ?? u.withGuide, n = s?.format ?? ft, o = ["", ...vt(e, O(r) - 6, n).split(`
`).map(n), ""], c2 = dist_default2(i), a = Math.max(o.reduce((p2, m) => {
    const g = dist_default2(m);
    return g > p2 ? g : p2;
  }, 0), c2) + 2, l = o.map((p2) => `${t("gray", d2)}  ${p2}${" ".repeat(a - dist_default2(p2))}${t("gray", d2)}`).join(`
`), $2 = u2 ? `${t("gray", d2)}
` : "", y2 = u2 ? Ge : de;
  r.write(`${$2}${t("green", F)}  ${t("reset", i)} ${t("gray", se.repeat(Math.max(a - c2 - 1, 1)) + ce)}
${l}
${t("gray", y2 + se.repeat(a + 2) + $e)}
`);
};
var bt = (e) => new rt({ validate: e.validate, mask: e.mask ?? xe, signal: e.signal, input: e.input, output: e.output, render() {
  const i = e.withGuide ?? u.withGuide, s = `${i ? `${t("gray", d2)}
` : ""}${V2(this.state)}  ${e.message}
`, r = this.userInputWithCursor, u2 = this.masked;
  switch (this.state) {
    case "error": {
      const n = i ? `${t("yellow", d2)}  ` : "", o = i ? `${t("yellow", E2)}  ` : "", c2 = u2 ?? "";
      return e.clearOnError && this.clear(), `${s.trim()}
${n}${c2}
${o}${t("yellow", this.error)}
`;
    }
    case "submit": {
      const n = i ? `${t("gray", d2)}  ` : "", o = u2 ? t("dim", u2) : "";
      return `${s}${n}${o}`;
    }
    case "cancel": {
      const n = i ? `${t("gray", d2)}  ` : "", o = u2 ? t(["strikethrough", "dim"], u2) : "";
      return `${s}${n}${o}${u2 && i ? `
${t("gray", d2)}` : ""}`;
    }
    default: {
      const n = i ? `${t("cyan", d2)}  ` : "", o = i ? t("cyan", E2) : "";
      return `${s}${n}${r}
${o}
`;
    }
  }
} }).prompt();
var Ct = (e) => t("magenta", e);
var fe = ({ indicator: e = "dots", onCancel: i, output: s = process.stdout, cancelMessage: r, errorMessage: u2, frames: n = ee ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"], delay: o = ee ? 80 : 120, signal: c2, ...a } = {}) => {
  const l = ae();
  let $2, y2, p2 = false, m = false, g = "", S2, h = performance.now();
  const f = O(s), v = a?.styleFrame ?? Ct, T = (_2) => {
    const A2 = _2 > 1 ? u2 ?? u.messages.error : r ?? u.messages.cancel;
    m = _2 === 1, p2 && (W(A2, _2), m && typeof i == "function" && i());
  }, C2 = () => T(2), b = () => T(1), x = () => {
    process.on("uncaughtExceptionMonitor", C2), process.on("unhandledRejection", C2), process.on("SIGINT", b), process.on("SIGTERM", b), process.on("exit", T), c2 && c2.addEventListener("abort", b);
  }, G2 = () => {
    process.removeListener("uncaughtExceptionMonitor", C2), process.removeListener("unhandledRejection", C2), process.removeListener("SIGINT", b), process.removeListener("SIGTERM", b), process.removeListener("exit", T), c2 && c2.removeEventListener("abort", b);
  }, M2 = () => {
    if (S2 === void 0) return;
    l && s.write(`
`);
    const _2 = wrapAnsi(S2, f, { hard: true, trim: false }).split(`
`);
    _2.length > 1 && s.write(import_sisteransi2.cursor.up(_2.length - 1)), s.write(import_sisteransi2.cursor.to(0)), s.write(import_sisteransi2.erase.down());
  }, R2 = (_2) => _2.replace(/\.+$/, ""), j2 = (_2) => {
    const A2 = (performance.now() - _2) / 1e3, k = Math.floor(A2 / 60), L = Math.floor(A2 % 60);
    return k > 0 ? `[${k}m ${L}s]` : `[${L}s]`;
  }, D2 = a.withGuide ?? u.withGuide, ie = (_2 = "") => {
    p2 = true, $2 = z({ output: s }), g = R2(_2), h = performance.now(), D2 && s.write(`${t("gray", d2)}
`);
    let A2 = 0, k = 0;
    x(), y2 = setInterval(() => {
      if (l && g === S2) return;
      M2(), S2 = g;
      const L = v(n[A2]);
      let Z;
      if (l) Z = `${L}  ${g}...`;
      else if (e === "timer") Z = `${L}  ${g} ${j2(h)}`;
      else {
        const Be = ".".repeat(Math.floor(k)).slice(0, 3);
        Z = `${L}  ${g}${Be}`;
      }
      const Ne = wrapAnsi(Z, f, { hard: true, trim: false });
      s.write(Ne), A2 = A2 + 1 < n.length ? A2 + 1 : 0, k = k < 4 ? k + 0.125 : 0;
    }, o);
  }, W = (_2 = "", A2 = 0, k = false) => {
    if (!p2) return;
    p2 = false, clearInterval(y2), M2();
    const L = A2 === 0 ? t("green", F) : A2 === 1 ? t("red", oe) : t("red", ue);
    g = _2 ?? g, k || (e === "timer" ? s.write(`${L}  ${g} ${j2(h)}
`) : s.write(`${L}  ${g}
`)), G2(), $2();
  };
  return { start: ie, stop: (_2 = "") => W(_2, 0), message: (_2 = "") => {
    g = R2(_2 ?? g);
  }, cancel: (_2 = "") => W(_2, 1), error: (_2 = "") => W(_2, 2), clear: () => W("", 0, true), get isCancelled() {
    return m;
  } };
};
var Ve = { light: w2("\u2500", "-"), heavy: w2("\u2501", "="), block: w2("\u2588", "#") };
var re = (e, i) => e.includes(`
`) ? e.split(`
`).map((s) => i(s)).join(`
`) : i(e);
var _t = (e) => {
  const i = (s, r) => {
    const u2 = s.label ?? String(s.value);
    switch (r) {
      case "disabled":
        return `${t("gray", H2)} ${re(u2, (n) => t("gray", n))}${s.hint ? ` ${t("dim", `(${s.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${re(u2, (n) => t("dim", n))}`;
      case "active":
        return `${t("green", z2)} ${u2}${s.hint ? ` ${t("dim", `(${s.hint})`)}` : ""}`;
      case "cancelled":
        return `${re(u2, (n) => t(["strikethrough", "dim"], n))}`;
      default:
        return `${t("dim", H2)} ${re(u2, (n) => t("dim", n))}`;
    }
  };
  return new nt({ options: e.options, signal: e.signal, input: e.input, output: e.output, initialValue: e.initialValue, render() {
    const s = e.withGuide ?? u.withGuide, r = `${V2(this.state)}  `, u2 = `${ye(this.state)}  `, n = R(e.output, e.message, u2, r), o = `${s ? `${t("gray", d2)}
` : ""}${n}
`;
    switch (this.state) {
      case "submit": {
        const c2 = s ? `${t("gray", d2)}  ` : "", a = R(e.output, i(this.options[this.cursor], "selected"), c2);
        return `${o}${a}`;
      }
      case "cancel": {
        const c2 = s ? `${t("gray", d2)}  ` : "", a = R(e.output, i(this.options[this.cursor], "cancelled"), c2);
        return `${o}${a}${s ? `
${t("gray", d2)}` : ""}`;
      }
      default: {
        const c2 = s ? `${t("cyan", d2)}  ` : "", a = s ? t("cyan", E2) : "", l = o.split(`
`).length, $2 = s ? 2 : 1;
        return `${o}${c2}${Y2({ output: e.output, cursor: this.cursor, options: this.options, maxItems: e.maxItems, columnPadding: c2.length, rowPadding: l + $2, style: (y2, p2) => i(y2, y2.disabled ? "disabled" : p2 ? "active" : "inactive") }).join(`
${c2}`)}
${a}
`;
      }
    }
  } }).prompt();
};
var je = `${t("gray", d2)}  `;
var Et = async (e, i) => {
  for (const s of e) {
    if (s.enabled === false) continue;
    const r = fe(i);
    r.start(s.title);
    const u2 = await s.task(r.message);
    r.stop(u2 || s.title);
  }
};
var Ot = (e) => new at({ validate: e.validate, placeholder: e.placeholder, defaultValue: e.defaultValue, initialValue: e.initialValue, output: e.output, signal: e.signal, input: e.input, render() {
  const i = e?.withGuide ?? u.withGuide, s = `${`${i ? `${t("gray", d2)}
` : ""}${V2(this.state)}  `}${e.message}
`, r = e.placeholder ? t("inverse", e.placeholder[0]) + t("dim", e.placeholder.slice(1)) : t(["inverse", "hidden"], "_"), u2 = this.userInput ? this.userInputWithCursor : r, n = this.value ?? "";
  switch (this.state) {
    case "error": {
      const o = this.error ? `  ${t("yellow", this.error)}` : "", c2 = i ? `${t("yellow", d2)}  ` : "", a = i ? t("yellow", E2) : "";
      return `${s.trim()}
${c2}${u2}
${a}${o}
`;
    }
    case "submit": {
      const o = n ? `  ${t("dim", n)}` : "", c2 = i ? t("gray", d2) : "";
      return `${s}${c2}${o}`;
    }
    case "cancel": {
      const o = n ? `  ${t(["strikethrough", "dim"], n)}` : "", c2 = i ? t("gray", d2) : "";
      return `${s}${c2}${o}${n.trim() ? `
${c2}` : ""}`;
    }
    default: {
      const o = i ? `${t("cyan", d2)}  ` : "", c2 = i ? t("cyan", E2) : "";
      return `${s}${o}${u2}
${c2}
`;
    }
  }
} }).prompt();

// src/steps/welcome.ts
var import_picocolors = __toESM(require_picocolors(), 1);
import { existsSync } from "fs";

// src/utils/system.ts
import { execSync } from "child_process";
import { homedir } from "os";
import { join } from "path";
function detectOS() {
  switch (process.platform) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
}
function commandExists(command) {
  try {
    const isWindows = process.platform === "win32";
    const checkCmd = isWindows ? "where" : "which";
    execSync(`${checkCmd} ${command}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}
function runCommand(command, args = []) {
  try {
    const fullCommand = [command, ...args].join(" ");
    const stdout = execSync(fullCommand, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
    return { stdout: stdout.trim(), stderr: "", exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout?.toString().trim() ?? "",
      stderr: error.stderr?.toString().trim() ?? "",
      exitCode: error.status ?? 1
    };
  }
}
function expandHome(filepath) {
  if (filepath.startsWith("~")) {
    return join(homedir(), filepath.slice(1));
  }
  return filepath;
}

// src/steps/welcome.ts
async function runWelcome() {
  mt(import_picocolors.default.bgCyan(import_picocolors.default.black(" claude-mem installer ")));
  O2.info(`Version: 1.0.0`);
  O2.info(`Platform: ${process.platform} (${process.arch})`);
  const settingsExist = existsSync(expandHome("~/.claude-mem/settings.json"));
  const pluginExist = existsSync(expandHome("~/.claude/plugins/marketplaces/henyeu247-max/"));
  const alreadyInstalled = settingsExist && pluginExist;
  if (alreadyInstalled) {
    O2.warn("Existing claude-mem installation detected.");
  }
  const installMode = await _t({
    message: "What would you like to do?",
    options: alreadyInstalled ? [
      { value: "upgrade", label: "Upgrade", hint: "update to latest version" },
      { value: "configure", label: "Configure", hint: "change settings only" },
      { value: "fresh", label: "Fresh Install", hint: "reinstall from scratch" }
    ] : [
      { value: "fresh", label: "Fresh Install", hint: "recommended" },
      { value: "configure", label: "Configure Only", hint: "set up settings without installing" }
    ]
  });
  if (q(installMode)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  return installMode;
}

// src/steps/dependencies.ts
var import_picocolors2 = __toESM(require_picocolors(), 1);

// src/utils/dependencies.ts
import { existsSync as existsSync2 } from "fs";
import { execSync as execSync2 } from "child_process";
function findBinary(name, extraPaths = []) {
  if (commandExists(name)) {
    const result = runCommand("which", [name]);
    const versionResult = runCommand(name, ["--version"]);
    return {
      found: true,
      path: result.stdout,
      version: parseVersion(versionResult.stdout) || parseVersion(versionResult.stderr)
    };
  }
  for (const extraPath of extraPaths) {
    const fullPath = expandHome(extraPath);
    if (existsSync2(fullPath)) {
      const versionResult = runCommand(fullPath, ["--version"]);
      return {
        found: true,
        path: fullPath,
        version: parseVersion(versionResult.stdout) || parseVersion(versionResult.stderr)
      };
    }
  }
  return { found: false, path: null, version: null };
}
function parseVersion(output) {
  if (!output) return null;
  const match = output.match(/(\d+\.\d+(\.\d+)?)/);
  return match ? match[1] : null;
}
function compareVersions(current, minimum) {
  const currentParts = current.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);
  for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
    const a = currentParts[i] || 0;
    const b = minimumParts[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return true;
}
function installBun() {
  const os = detectOS();
  if (os === "windows") {
    execSync2('powershell -c "irm bun.sh/install.ps1 | iex"', { stdio: "inherit" });
  } else {
    execSync2("curl -fsSL https://bun.sh/install | bash", { stdio: "inherit" });
  }
}
function installUv() {
  const os = detectOS();
  if (os === "windows") {
    execSync2('powershell -c "irm https://astral.sh/uv/install.ps1 | iex"', { stdio: "inherit" });
  } else {
    execSync2("curl -fsSL https://astral.sh/uv/install.sh | sh", { stdio: "inherit" });
  }
}

// src/steps/dependencies.ts
var BUN_EXTRA_PATHS = ["~/.bun/bin/bun", "/usr/local/bin/bun", "/opt/homebrew/bin/bun"];
var UV_EXTRA_PATHS = ["~/.local/bin/uv", "~/.cargo/bin/uv"];
async function runDependencyChecks() {
  const status = {
    nodeOk: false,
    gitOk: false,
    bunOk: false,
    uvOk: false,
    bunPath: null,
    uvPath: null
  };
  await Et([
    {
      title: "Checking Node.js",
      task: async () => {
        const version = process.version.slice(1);
        if (compareVersions(version, "18.0.0")) {
          status.nodeOk = true;
          return `Node.js ${process.version} ${import_picocolors2.default.green("\u2713")}`;
        }
        return `Node.js ${process.version} \u2014 requires >= 18.0.0 ${import_picocolors2.default.red("\u2717")}`;
      }
    },
    {
      title: "Checking git",
      task: async () => {
        const info = findBinary("git");
        if (info.found) {
          status.gitOk = true;
          return `git ${info.version ?? ""} ${import_picocolors2.default.green("\u2713")}`;
        }
        return `git not found ${import_picocolors2.default.red("\u2717")}`;
      }
    },
    {
      title: "Checking Bun",
      task: async () => {
        const info = findBinary("bun", BUN_EXTRA_PATHS);
        if (info.found && info.version && compareVersions(info.version, "1.1.14")) {
          status.bunOk = true;
          status.bunPath = info.path;
          return `Bun ${info.version} ${import_picocolors2.default.green("\u2713")}`;
        }
        if (info.found && info.version) {
          return `Bun ${info.version} \u2014 requires >= 1.1.14 ${import_picocolors2.default.yellow("\u26A0")}`;
        }
        return `Bun not found ${import_picocolors2.default.yellow("\u26A0")}`;
      }
    },
    {
      title: "Checking uv",
      task: async () => {
        const info = findBinary("uv", UV_EXTRA_PATHS);
        if (info.found) {
          status.uvOk = true;
          status.uvPath = info.path;
          return `uv ${info.version ?? ""} ${import_picocolors2.default.green("\u2713")}`;
        }
        return `uv not found ${import_picocolors2.default.yellow("\u26A0")}`;
      }
    }
  ]);
  if (!status.gitOk) {
    const os = detectOS();
    O2.error("git is required but not found.");
    if (os === "macos") {
      O2.info("Install with: xcode-select --install");
    } else if (os === "linux") {
      O2.info("Install with: sudo apt install git (or your distro equivalent)");
    } else {
      O2.info("Download from: https://git-scm.com/downloads");
    }
    pt("Please install git and try again.");
    process.exit(1);
  }
  if (!status.nodeOk) {
    O2.error(`Node.js >= 18.0.0 is required. Current: ${process.version}`);
    pt("Please upgrade Node.js and try again.");
    process.exit(1);
  }
  if (!status.bunOk) {
    const shouldInstall = await ot2({
      message: "Bun is required but not found. Install it now?",
      initialValue: true
    });
    if (q(shouldInstall)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    if (shouldInstall) {
      const s = fe();
      s.start("Installing Bun...");
      try {
        installBun();
        const recheck = findBinary("bun", BUN_EXTRA_PATHS);
        if (recheck.found) {
          status.bunOk = true;
          status.bunPath = recheck.path;
          s.stop(`Bun installed ${import_picocolors2.default.green("\u2713")}`);
        } else {
          s.stop(`Bun installed but not found in PATH. You may need to restart your shell.`);
        }
      } catch {
        s.stop(`Bun installation failed. Install manually: curl -fsSL https://bun.sh/install | bash`);
      }
    } else {
      O2.warn("Bun is required for claude-mem. Install manually: curl -fsSL https://bun.sh/install | bash");
      pt("Cannot continue without Bun.");
      process.exit(1);
    }
  }
  if (!status.uvOk) {
    const shouldInstall = await ot2({
      message: "uv (Python package manager) is recommended for Chroma. Install it now?",
      initialValue: true
    });
    if (q(shouldInstall)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    if (shouldInstall) {
      const s = fe();
      s.start("Installing uv...");
      try {
        installUv();
        const recheck = findBinary("uv", UV_EXTRA_PATHS);
        if (recheck.found) {
          status.uvOk = true;
          status.uvPath = recheck.path;
          s.stop(`uv installed ${import_picocolors2.default.green("\u2713")}`);
        } else {
          s.stop("uv installed but not found in PATH. You may need to restart your shell.");
        }
      } catch {
        s.stop("uv installation failed. Install manually: curl -fsSL https://astral.sh/uv/install.sh | sh");
      }
    } else {
      O2.warn("Skipping uv \u2014 Chroma vector search will not be available.");
    }
  }
  return status;
}

// src/steps/ide-selection.ts
async function runIdeSelection() {
  const result = await yt({
    message: "Which IDEs do you use?",
    options: [
      { value: "claude-code", label: "Claude Code", hint: "recommended" },
      { value: "cursor", label: "Cursor" }
      // Windsurf coming soon - not yet selectable
    ],
    initialValues: ["claude-code"],
    required: true
  });
  if (q(result)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const selectedIDEs = result;
  if (selectedIDEs.includes("claude-code")) {
    O2.info("Claude Code: Plugin will be registered via marketplace.");
  }
  if (selectedIDEs.includes("cursor")) {
    O2.info("Cursor: Hooks will be configured for your projects.");
  }
  return selectedIDEs;
}

// src/steps/provider.ts
async function runProviderConfiguration() {
  const provider = await _t({
    message: "Which AI provider should claude-mem use for memory compression?",
    options: [
      { value: "claude", label: "Claude", hint: "uses your Claude subscription" },
      { value: "gemini", label: "Gemini", hint: "free tier available" },
      { value: "openrouter", label: "OpenRouter", hint: "free models available" }
    ]
  });
  if (q(provider)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const config = { provider };
  if (provider === "claude") {
    const authMethod = await _t({
      message: "How should Claude authenticate?",
      options: [
        { value: "cli", label: "CLI (Max Plan subscription)", hint: "no API key needed" },
        { value: "api", label: "API Key", hint: "uses Anthropic API credits" }
      ]
    });
    if (q(authMethod)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.claudeAuthMethod = authMethod;
    if (authMethod === "api") {
      const apiKey = await bt({
        message: "Enter your Anthropic API key:",
        validate: (value) => {
          if (!value || value.trim().length === 0) return "API key is required";
          if (!value.startsWith("sk-ant-")) return "Anthropic API keys start with sk-ant-";
        }
      });
      if (q(apiKey)) {
        pt("Installation cancelled.");
        process.exit(0);
      }
      config.apiKey = apiKey;
    }
  }
  if (provider === "gemini") {
    const apiKey = await bt({
      message: "Enter your Gemini API key:",
      validate: (value) => {
        if (!value || value.trim().length === 0) return "API key is required";
      }
    });
    if (q(apiKey)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.apiKey = apiKey;
    const model = await _t({
      message: "Which Gemini model?",
      options: [
        { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", hint: "fastest, highest free RPM" },
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", hint: "balanced" },
        { value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview", hint: "latest" }
      ]
    });
    if (q(model)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.model = model;
    const rateLimiting = await ot2({
      message: "Enable rate limiting? (recommended for free tier)",
      initialValue: true
    });
    if (q(rateLimiting)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.rateLimitingEnabled = rateLimiting;
  }
  if (provider === "openrouter") {
    const apiKey = await bt({
      message: "Enter your OpenRouter API key:",
      validate: (value) => {
        if (!value || value.trim().length === 0) return "API key is required";
      }
    });
    if (q(apiKey)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.apiKey = apiKey;
    const model = await Ot({
      message: "Which OpenRouter model?",
      defaultValue: "xiaomi/mimo-v2-flash:free",
      placeholder: "xiaomi/mimo-v2-flash:free"
    });
    if (q(model)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    config.model = model;
  }
  return config;
}

// src/steps/settings.ts
var import_picocolors3 = __toESM(require_picocolors(), 1);
async function runSettingsConfiguration() {
  const useDefaults = await ot2({
    message: "Use default settings? (recommended for most users)",
    initialValue: true
  });
  if (q(useDefaults)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  if (useDefaults) {
    return {
      workerPort: "37777",
      dataDir: "~/.claude-mem",
      contextObservations: "50",
      logLevel: "INFO",
      pythonVersion: "3.13",
      chromaEnabled: true,
      chromaMode: "local"
    };
  }
  const workerPort = await Ot({
    message: "Worker service port:",
    defaultValue: "37777",
    placeholder: "37777",
    validate: (value = "") => {
      const port = parseInt(value, 10);
      if (isNaN(port) || port < 1024 || port > 65535) {
        return "Port must be between 1024 and 65535";
      }
    }
  });
  if (q(workerPort)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const dataDir = await Ot({
    message: "Data directory:",
    defaultValue: "~/.claude-mem",
    placeholder: "~/.claude-mem"
  });
  if (q(dataDir)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const contextObservations = await Ot({
    message: "Number of context observations per session:",
    defaultValue: "50",
    placeholder: "50",
    validate: (value = "") => {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1 || num > 200) {
        return "Must be between 1 and 200";
      }
    }
  });
  if (q(contextObservations)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const logLevel = await _t({
    message: "Log level:",
    options: [
      { value: "DEBUG", label: "DEBUG", hint: "verbose" },
      { value: "INFO", label: "INFO", hint: "default" },
      { value: "WARN", label: "WARN" },
      { value: "ERROR", label: "ERROR", hint: "errors only" }
    ],
    initialValue: "INFO"
  });
  if (q(logLevel)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const pythonVersion = await Ot({
    message: "Python version (for Chroma):",
    defaultValue: "3.13",
    placeholder: "3.13"
  });
  if (q(pythonVersion)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  const chromaEnabled = await ot2({
    message: "Enable Chroma vector search?",
    initialValue: true
  });
  if (q(chromaEnabled)) {
    pt("Installation cancelled.");
    process.exit(0);
  }
  let chromaMode;
  let chromaHost;
  let chromaPort;
  let chromaSsl;
  if (chromaEnabled) {
    const mode = await _t({
      message: "Chroma mode:",
      options: [
        { value: "local", label: "Local", hint: "starts local Chroma server" },
        { value: "remote", label: "Remote", hint: "connect to existing server" }
      ]
    });
    if (q(mode)) {
      pt("Installation cancelled.");
      process.exit(0);
    }
    chromaMode = mode;
    if (mode === "remote") {
      const host = await Ot({
        message: "Chroma host:",
        defaultValue: "127.0.0.1",
        placeholder: "127.0.0.1"
      });
      if (q(host)) {
        pt("Installation cancelled.");
        process.exit(0);
      }
      chromaHost = host;
      const port = await Ot({
        message: "Chroma port:",
        defaultValue: "8000",
        placeholder: "8000",
        validate: (value = "") => {
          const portNum = parseInt(value, 10);
          if (isNaN(portNum) || portNum < 1 || portNum > 65535) return "Port must be between 1 and 65535";
        }
      });
      if (q(port)) {
        pt("Installation cancelled.");
        process.exit(0);
      }
      chromaPort = port;
      const ssl = await ot2({
        message: "Use SSL for Chroma connection?",
        initialValue: false
      });
      if (q(ssl)) {
        pt("Installation cancelled.");
        process.exit(0);
      }
      chromaSsl = ssl;
    }
  }
  const config = {
    workerPort,
    dataDir,
    contextObservations,
    logLevel,
    pythonVersion,
    chromaEnabled,
    chromaMode,
    chromaHost,
    chromaPort,
    chromaSsl
  };
  const summaryLines = [
    `Worker port: ${import_picocolors3.default.cyan(workerPort)}`,
    `Data directory: ${import_picocolors3.default.cyan(dataDir)}`,
    `Context observations: ${import_picocolors3.default.cyan(contextObservations)}`,
    `Log level: ${import_picocolors3.default.cyan(logLevel)}`,
    `Python version: ${import_picocolors3.default.cyan(pythonVersion)}`,
    `Chroma: ${chromaEnabled ? import_picocolors3.default.green("enabled") : import_picocolors3.default.dim("disabled")}`
  ];
  if (chromaEnabled && chromaMode) {
    summaryLines.push(`Chroma mode: ${import_picocolors3.default.cyan(chromaMode)}`);
  }
  wt(summaryLines.join("\n"), "Settings Summary");
  return config;
}

// src/utils/settings-writer.ts
import { existsSync as existsSync3, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
function expandDataDir(dataDir) {
  if (dataDir.startsWith("~")) {
    return join2(homedir2(), dataDir.slice(1));
  }
  return dataDir;
}
function buildSettingsObject(providerConfig, settingsConfig) {
  const settings = {
    CLAUDE_MEM_WORKER_PORT: settingsConfig.workerPort,
    CLAUDE_MEM_WORKER_HOST: "127.0.0.1",
    CLAUDE_MEM_DATA_DIR: expandDataDir(settingsConfig.dataDir),
    CLAUDE_MEM_CONTEXT_OBSERVATIONS: settingsConfig.contextObservations,
    CLAUDE_MEM_LOG_LEVEL: settingsConfig.logLevel,
    CLAUDE_MEM_PYTHON_VERSION: settingsConfig.pythonVersion,
    CLAUDE_MEM_PROVIDER: providerConfig.provider
  };
  if (providerConfig.provider === "claude") {
    settings.CLAUDE_MEM_CLAUDE_AUTH_METHOD = providerConfig.claudeAuthMethod ?? "cli";
  }
  if (providerConfig.provider === "gemini") {
    if (providerConfig.apiKey) settings.CLAUDE_MEM_GEMINI_API_KEY = providerConfig.apiKey;
    if (providerConfig.model) settings.CLAUDE_MEM_GEMINI_MODEL = providerConfig.model;
    settings.CLAUDE_MEM_GEMINI_RATE_LIMITING_ENABLED = providerConfig.rateLimitingEnabled !== false ? "true" : "false";
  }
  if (providerConfig.provider === "openrouter") {
    if (providerConfig.apiKey) settings.CLAUDE_MEM_OPENROUTER_API_KEY = providerConfig.apiKey;
    if (providerConfig.model) settings.CLAUDE_MEM_OPENROUTER_MODEL = providerConfig.model;
  }
  if (settingsConfig.chromaEnabled) {
    settings.CLAUDE_MEM_CHROMA_MODE = settingsConfig.chromaMode ?? "local";
    if (settingsConfig.chromaMode === "remote") {
      if (settingsConfig.chromaHost) settings.CLAUDE_MEM_CHROMA_HOST = settingsConfig.chromaHost;
      if (settingsConfig.chromaPort) settings.CLAUDE_MEM_CHROMA_PORT = settingsConfig.chromaPort;
      if (settingsConfig.chromaSsl !== void 0) settings.CLAUDE_MEM_CHROMA_SSL = String(settingsConfig.chromaSsl);
    }
  }
  return settings;
}
function writeSettings(providerConfig, settingsConfig) {
  const dataDir = expandDataDir(settingsConfig.dataDir);
  const settingsPath = join2(dataDir, "settings.json");
  if (!existsSync3(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  let existingSettings = {};
  if (existsSync3(settingsPath)) {
    const raw = readFileSync(settingsPath, "utf-8");
    existingSettings = JSON.parse(raw);
  }
  const newSettings = buildSettingsObject(providerConfig, settingsConfig);
  const merged = { ...existingSettings, ...newSettings };
  writeFileSync(settingsPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
}

// src/steps/install.ts
var import_picocolors4 = __toESM(require_picocolors(), 1);
import { execSync as execSync3 } from "child_process";
import { existsSync as existsSync4, mkdirSync as mkdirSync2, readFileSync as readFileSync2, writeFileSync as writeFileSync2, cpSync, rmSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir3, tmpdir } from "os";
var MARKETPLACE_NAME = "henyeu247-max";
var MARKETPLACE_DIR = join3(homedir3(), ".claude", "plugins", "marketplaces", MARKETPLACE_NAME);
var PLUGINS_DIR = join3(homedir3(), ".claude", "plugins");
var CLAUDE_SETTINGS_PATH = join3(homedir3(), ".claude", "settings.json");
function ensureDir(directoryPath) {
  if (!existsSync4(directoryPath)) {
    mkdirSync2(directoryPath, { recursive: true });
  }
}
function readJsonFile(filepath) {
  if (!existsSync4(filepath)) return {};
  return JSON.parse(readFileSync2(filepath, "utf-8"));
}
function writeJsonFile(filepath, data) {
  ensureDir(join3(filepath, ".."));
  writeFileSync2(filepath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
function registerMarketplace() {
  const knownMarketplacesPath = join3(PLUGINS_DIR, "known_marketplaces.json");
  const knownMarketplaces = readJsonFile(knownMarketplacesPath);
  knownMarketplaces[MARKETPLACE_NAME] = {
    source: {
      source: "github",
      repo: "henyeu247-max/claude-mem-xai"
    },
    installLocation: MARKETPLACE_DIR,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    autoUpdate: true
  };
  ensureDir(PLUGINS_DIR);
  writeJsonFile(knownMarketplacesPath, knownMarketplaces);
}
function registerPlugin(version) {
  const installedPluginsPath = join3(PLUGINS_DIR, "installed_plugins.json");
  const installedPlugins = readJsonFile(installedPluginsPath);
  if (!installedPlugins.version) installedPlugins.version = 2;
  if (!installedPlugins.plugins) installedPlugins.plugins = {};
  const pluginCachePath = join3(PLUGINS_DIR, "cache", MARKETPLACE_NAME, "claude-mem", version);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  installedPlugins.plugins[`claude-mem@${MARKETPLACE_NAME}`] = [
    {
      scope: "user",
      installPath: pluginCachePath,
      version,
      installedAt: now,
      lastUpdated: now
    }
  ];
  writeJsonFile(installedPluginsPath, installedPlugins);
  ensureDir(pluginCachePath);
  const pluginSourceDir = join3(MARKETPLACE_DIR, "plugin");
  if (existsSync4(pluginSourceDir)) {
    cpSync(pluginSourceDir, pluginCachePath, { recursive: true });
  }
}
function enablePluginInClaudeSettings() {
  const settings = readJsonFile(CLAUDE_SETTINGS_PATH);
  if (!settings.enabledPlugins) settings.enabledPlugins = {};
  settings.enabledPlugins[`claude-mem@${MARKETPLACE_NAME}`] = true;
  writeJsonFile(CLAUDE_SETTINGS_PATH, settings);
}
function getPluginVersion() {
  const pluginJsonPath = join3(MARKETPLACE_DIR, "plugin", ".claude-plugin", "plugin.json");
  if (existsSync4(pluginJsonPath)) {
    const pluginJson = JSON.parse(readFileSync2(pluginJsonPath, "utf-8"));
    return pluginJson.version ?? "1.0.0";
  }
  return "1.0.0";
}
async function runInstallation(selectedIDEs) {
  const tempDir = join3(tmpdir(), `claude-mem-install-${Date.now()}`);
  await Et([
    {
      title: "Cloning claude-mem-xai repository",
      task: async (message) => {
        message("Downloading latest release...");
        execSync3(
          `git clone --depth 1 https://github.com/henyeu247-max/claude-mem-xai.git "${tempDir}"`,
          { stdio: "pipe" }
        );
        return `Repository cloned ${import_picocolors4.default.green("OK")}`;
      }
    },
    {
      title: "Installing dependencies",
      task: async (message) => {
        message("Running npm install...");
        execSync3("npm install", { cwd: tempDir, stdio: "pipe" });
        return `Dependencies installed ${import_picocolors4.default.green("OK")}`;
      }
    },
    {
      title: "Building plugin",
      task: async (message) => {
        message("Compiling TypeScript and bundling...");
        execSync3("npm run build", { cwd: tempDir, stdio: "pipe" });
        return `Plugin built ${import_picocolors4.default.green("OK")}`;
      }
    },
    {
      title: "Registering plugin",
      task: async (message) => {
        message("Copying files to marketplace directory...");
        ensureDir(MARKETPLACE_DIR);
        const excludePatterns = [".git", "package-lock.json", "bun.lock", "node_modules", "dist"];
        cpSync(tempDir, MARKETPLACE_DIR, {
          recursive: true,
          force: true,
          filter: (src) => {
            const relative = src.replace(tempDir, "").replace(/^[/\\]/, "");
            return !excludePatterns.some((p2) => relative.startsWith(p2) || relative.includes(`/${p2}/`) || relative.includes(`\\${p2}\\`));
          }
        });
        message("Registering marketplace...");
        registerMarketplace();
        message("Installing marketplace dependencies...");
        execSync3("npm install", { cwd: MARKETPLACE_DIR, stdio: "pipe" });
        message("Registering plugin in Claude Code...");
        const version = getPluginVersion();
        registerPlugin(version);
        message("Enabling plugin...");
        enablePluginInClaudeSettings();
        return `Plugin registered (v${getPluginVersion()}) ${import_picocolors4.default.green("OK")}`;
      }
    }
  ]);
  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {
  }
  if (selectedIDEs.includes("cursor")) {
    O2.info("Cursor hook configuration will be available after first launch.");
    O2.info("Run: claude-mem cursor-setup (coming soon)");
  }
}

// src/steps/worker.ts
var import_picocolors5 = __toESM(require_picocolors(), 1);
import { spawn } from "child_process";
import { join as join4 } from "path";
import { homedir as homedir4 } from "os";
var MARKETPLACE_DIR2 = join4(homedir4(), ".claude", "plugins", "marketplaces", "henyeu247-max");
var HEALTH_CHECK_INTERVAL_MS = 1e3;
var HEALTH_CHECK_MAX_ATTEMPTS = 30;
async function pollHealthEndpoint(port, maxAttempts = HEALTH_CHECK_MAX_ATTEMPTS) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return true;
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_INTERVAL_MS));
  }
  return false;
}
async function runWorkerStartup(workerPort, dataDir) {
  const bunInfo = findBinary("bun", ["~/.bun/bin/bun", "/usr/local/bin/bun", "/opt/homebrew/bin/bun"]);
  if (!bunInfo.found || !bunInfo.path) {
    O2.error("Bun is required to start the worker but was not found.");
    O2.info("Install Bun: curl -fsSL https://bun.sh/install | bash");
    return;
  }
  const workerScript = join4(MARKETPLACE_DIR2, "plugin", "scripts", "worker-service.cjs");
  const expandedDataDir = expandHome(dataDir);
  const logPath = join4(expandedDataDir, "logs");
  const s = fe();
  s.start("Starting worker service...");
  const child = spawn(bunInfo.path, [workerScript], {
    cwd: MARKETPLACE_DIR2,
    detached: true,
    stdio: "ignore",
    env: {
      ...process.env,
      CLAUDE_MEM_WORKER_PORT: workerPort,
      CLAUDE_MEM_DATA_DIR: expandedDataDir
    }
  });
  child.unref();
  const workerIsHealthy = await pollHealthEndpoint(workerPort);
  if (workerIsHealthy) {
    s.stop(`Worker running on port ${import_picocolors5.default.cyan(workerPort)} ${import_picocolors5.default.green("OK")}`);
  } else {
    s.stop(`Worker may still be starting. Check logs at: ${logPath}`);
    O2.warn("Health check timed out. The worker might need more time to initialize.");
    O2.info(`Check status: curl http://127.0.0.1:${workerPort}/api/health`);
  }
}

// src/steps/complete.ts
var import_picocolors6 = __toESM(require_picocolors(), 1);
function getProviderLabel(config) {
  switch (config.provider) {
    case "claude":
      return config.claudeAuthMethod === "api" ? "Claude (API Key)" : "Claude (CLI subscription)";
    case "gemini":
      return `Gemini (${config.model ?? "gemini-2.5-flash-lite"})`;
    case "openrouter":
      return `OpenRouter (${config.model ?? "xiaomi/mimo-v2-flash:free"})`;
  }
}
function getIDELabels(ides) {
  return ides.map((ide) => {
    switch (ide) {
      case "claude-code":
        return "Claude Code";
      case "cursor":
        return "Cursor";
    }
  }).join(", ");
}
function runCompletion(providerConfig, settingsConfig, selectedIDEs) {
  const summaryLines = [
    `Provider:   ${import_picocolors6.default.cyan(getProviderLabel(providerConfig))}`,
    `IDEs:       ${import_picocolors6.default.cyan(getIDELabels(selectedIDEs))}`,
    `Data dir:   ${import_picocolors6.default.cyan(settingsConfig.dataDir)}`,
    `Port:       ${import_picocolors6.default.cyan(settingsConfig.workerPort)}`,
    `Chroma:     ${settingsConfig.chromaEnabled ? import_picocolors6.default.green("enabled") : import_picocolors6.default.dim("disabled")}`
  ];
  wt(summaryLines.join("\n"), "Configuration Summary");
  const nextStepsLines = [];
  if (selectedIDEs.includes("claude-code")) {
    nextStepsLines.push("Open Claude Code and start a conversation \u2014 memory is automatic!");
  }
  if (selectedIDEs.includes("cursor")) {
    nextStepsLines.push("Open Cursor \u2014 hooks are active in your projects.");
  }
  nextStepsLines.push(`View your memories: ${import_picocolors6.default.underline(`http://localhost:${settingsConfig.workerPort}`)}`);
  nextStepsLines.push(`Search past work: use ${import_picocolors6.default.bold("/mem-search")} in Claude Code`);
  wt(nextStepsLines.join("\n"), "Next Steps");
  gt(import_picocolors6.default.green("claude-mem installed successfully!"));
}

// src/index.ts
async function runInstaller() {
  if (!process.stdin.isTTY) {
    console.error("Error: This installer requires an interactive terminal.");
    console.error("Run directly: npx claude-mem-installer");
    process.exit(1);
  }
  const installMode = await runWelcome();
  await runDependencyChecks();
  const selectedIDEs = await runIdeSelection();
  const providerConfig = await runProviderConfiguration();
  const settingsConfig = await runSettingsConfiguration();
  writeSettings(providerConfig, settingsConfig);
  O2.success("Settings saved.");
  if (installMode !== "configure") {
    await runInstallation(selectedIDEs);
    await runWorkerStartup(settingsConfig.workerPort, settingsConfig.dataDir);
  }
  runCompletion(providerConfig, settingsConfig, selectedIDEs);
}
runInstaller().catch((error) => {
  pt("Installation failed.");
  console.error(error);
  process.exit(1);
});
