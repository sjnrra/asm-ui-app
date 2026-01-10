import type { AsmStatement, AsmToken } from "./types";
import { TokenType } from "./types";

/**
 * z/OSアセンブラの固定カラム形式を解析
 * カラム1-8: ラベル（オプション）
 * カラム9: 空白（必須）
 * カラム10-71: 命令とオペランド
 * カラム72以降: コメント（継続行の場合はカラム72に'X'など）
 */
export function parseLine(line: string, lineNumber: number): AsmStatement {
  const rawText = line;
  const trimmed = line.trimEnd();
  
  // 空行または空白のみの行
  if (!trimmed || trimmed.trim().length === 0) {
    return {
      lineNumber,
      rawText,
      tokens: [
        {
          type: TokenType.WHITESPACE,
          text: line,
          columnStart: 0,
          columnEnd: line.length,
        },
      ],
    };
  }

  const tokens: AsmToken[] = [];
  let label: string | undefined;
  let opcode: string | undefined;
  let operandsText: string | undefined;
  let comment: string | undefined;

  // 元の行での最初の非空白文字の位置を取得
  const firstNonSpaceInLine = line.search(/\S/);
  
  // コメント行のチェック（カラム1に*がある場合）
  if (firstNonSpaceInLine >= 0 && line[firstNonSpaceInLine] === "*") {
    // コメント行全体
    return {
      lineNumber,
      rawText,
      comment: trimmed.substring(trimmed.search(/\S/)),
      tokens: [
        {
          type: TokenType.COMMENT,
          text: line,
          columnStart: 0,
          columnEnd: line.length,
        },
      ],
    };
  }

  // 継続行のチェック（カラム72に非空白文字がある場合）
  const isContinuation = line.length > 71 && line[71] !== " " && line[71] !== "\t" && line[71] !== "";

  // カラム1-8: ラベル
  // カラム1-8に非空白文字があり、カラム9が空白の場合にラベルと判定
  const labelArea = line.substring(0, Math.min(8, line.length));
  const labelTrimmed = labelArea.trim();
  
  // ラベルの条件: カラム1-8に非空白文字があり、カラム9が空白または行の終端
  if (labelTrimmed.length > 0 && (line.length <= 8 || line[8] === " " || line[8] === "\t")) {
    label = labelTrimmed;
    // ラベル部分の実際の位置を計算
    const labelStart = labelArea.length - labelArea.trimStart().length;
    const labelEnd = labelStart + labelTrimmed.length;
    
    // ラベル前の空白
    if (labelStart > 0) {
      tokens.push({
        type: TokenType.WHITESPACE,
        text: labelArea.substring(0, labelStart),
        columnStart: 0,
        columnEnd: labelStart,
      });
    }
    
    // ラベル
    tokens.push({
      type: TokenType.LABEL,
      text: labelTrimmed,
      columnStart: labelStart,
      columnEnd: labelEnd,
    });
    
    // カラム9の空白（ラベルの後からカラム9まで）
    if (line.length > 8) {
      const whitespaceAfterLabel = line.substring(labelEnd, 9);
      if (whitespaceAfterLabel.length > 0) {
        tokens.push({
          type: TokenType.WHITESPACE,
          text: whitespaceAfterLabel,
          columnStart: labelEnd,
          columnEnd: 9,
        });
      }
    }
  }

  // カラム10-71: 命令とオペランド
  // z/OSアセンブラでは、ラベルがない場合でも命令はカラム10（インデックス9）から始まる
  // ただし、カラム1-8が完全に空白で、カラム9以前から命令が始まる場合は柔軟に対応
  const instructionStart = label ? 9 : (firstNonSpaceInLine < 9 && firstNonSpaceInLine >= 0 ? firstNonSpaceInLine : 9);
  const instructionEnd = isContinuation ? 71 : Math.min(line.length, 72);
  let instructionPart = "";
  if (instructionStart < instructionEnd) {
    instructionPart = line.substring(instructionStart, instructionEnd).trim();
  }

  if (instructionPart) {
    // コメント開始位置を探す（"*"が現れる位置、前後が空白または行頭の場合）
    let commentStartIndex = -1;
    const originalPart = line.substring(instructionStart, instructionEnd);
    const commentMarker = originalPart.indexOf("*");
    
    if (commentMarker >= 0) {
      // "*"の前が空白または行頭で、かつ"*"の後に空白または行末の場合、コメントとみなす
      const beforeComment = commentMarker === 0 || /\s/.test(originalPart[commentMarker - 1]);
      if (beforeComment) {
        commentStartIndex = commentMarker;
      }
    }

    if (commentStartIndex >= 0) {
      // コメントがある場合
      const instruction = instructionPart.substring(0, instructionPart.indexOf("*")).trim();
      comment = originalPart.substring(commentStartIndex).trim();
      
      if (instruction) {
        // 命令部分をトークン化
        const instTokens = tokenizeInstructionPart(instruction, instructionStart);
        tokens.push(...instTokens);
        
        // オペコードとオペランドを抽出
        const parts = instruction.split(/\s+/, 2);
        opcode = parts[0];
        operandsText = parts[1];
      }
      
      // コメントトークン（元の文字列位置を使用）
      const commentStartPos = instructionStart + commentStartIndex;
      tokens.push({
        type: TokenType.COMMENT,
        text: originalPart.substring(commentStartIndex),
        columnStart: commentStartPos,
        columnEnd: instructionEnd,
      });
    } else {
      // コメントなし
      const instTokens = tokenizeInstructionPart(instructionPart, instructionStart);
      tokens.push(...instTokens);
      
      const parts = instructionPart.split(/\s+/, 2);
      opcode = parts[0];
      operandsText = parts[1];
    }
  } else if (isContinuation && line.length > 72) {
    // 継続行のみ（カラム72以降）
    comment = line.substring(72).trim();
    if (comment) {
      tokens.push({
        type: TokenType.COMMENT,
        text: line.substring(72),
        columnStart: 72,
        columnEnd: line.length,
      });
    }
  } else if (!label && trimmed.length > 0) {
    // ラベルもなく、命令部分も空の場合（インデントされたコメントなど）
    // 既にコメント行として処理されているはずなので、ここには来ない
  }

  return {
    lineNumber,
    rawText,
    label,
    opcode,
    operandsText,
    comment,
    tokens,
  };
}

/**
 * 命令部分（オペコードとオペランド）をトークン化
 */
function tokenizeInstructionPart(text: string, columnOffset: number): AsmToken[] {
  const tokens: AsmToken[] = [];
  let currentPos = 0;
  let inString = false;
  let stringChar = "";
  let currentToken = "";
  let tokenStart = 0;

  while (currentPos < text.length) {
    const char = text[currentPos];
    const isWhitespace = /\s/.test(char);

    if (inString) {
      currentToken += char;
      // 文字列終了チェック（アポストロフィが2つ続く場合はエスケープ、単独の場合は終了）
      if (char === stringChar) {
        // 次の文字もアポストロフィの場合はエスケープされたアポストロフィ
        if (currentPos < text.length - 1 && text[currentPos + 1] === stringChar) {
          currentToken += stringChar; // エスケープされたアポストロフィを追加
          currentPos += 2;
          continue;
        } else {
          // 文字列終了 - トークンタイプを判定
          // X'...'形式は数値として扱う
          if (/^X'[0-9A-F]+'$/i.test(currentToken) || /^XL'[0-9A-F]+'$/i.test(currentToken)) {
            tokens.push({
              type: TokenType.NUMBER,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
              metadata: { value: parseNumber(currentToken) },
            });
          }
          // B'...'形式も数値として扱う
          else if (/^B'[01]+'$/i.test(currentToken)) {
            tokens.push({
              type: TokenType.NUMBER,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
              metadata: { value: parseNumber(currentToken) },
            });
          }
          // C'...', CL8'...'などは文字列
          else {
            tokens.push({
              type: TokenType.STRING,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
            });
          }
          currentToken = "";
          inString = false;
          currentPos++;
          continue;
        }
      }
      currentPos++;
      continue;
    }

    // 文字列開始チェック（C'...', X'...', B'...'など）
    if ((char === "'" || char === '"') && !inString) {
      // 現在のトークンが文字列型指定子（C, X, B, CL8, XL, etc.）または空の場合
      if (currentToken === "" || /^[CXBFDL]L?\d*$/i.test(currentToken)) {
        if (currentToken && /^[CXBFDL]L?\d*$/i.test(currentToken)) {
          // 文字列型指定子を含めて文字列トークンとして扱う
          // tokenStartは既に設定されているはず
          // トークンに文字列開始のアポストロフィを含める
        } else {
          // 文字列型指定子がない場合（単独のアポストロフィ）
          tokenStart = currentPos;
        }
        inString = true;
        stringChar = char;
        currentToken = currentToken + char;
        currentPos++;
        continue;
      }
    }

    if (isWhitespace) {
      if (currentToken) {
        // トークンを確定
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      // 連続する空白を1つのトークンにまとめる
      const whitespaceStart = currentPos;
      while (currentPos < text.length && /\s/.test(text[currentPos])) {
        currentPos++;
      }
      if (whitespaceStart < currentPos) {
        tokens.push({
          type: TokenType.WHITESPACE,
          text: text.substring(whitespaceStart, currentPos),
          columnStart: columnOffset + whitespaceStart,
          columnEnd: columnOffset + currentPos,
        });
      }
      continue;
    }

    // デリミタのチェック
    if (/[,()]/.test(char)) {
      if (currentToken) {
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      tokens.push({
        type: TokenType.DELIMITER,
        text: char,
        columnStart: columnOffset + currentPos,
        columnEnd: columnOffset + currentPos + 1,
      });
      currentPos++;
      continue;
    }

    // 演算子のチェック（ただし、文字列内でない場合のみ）
    if (/[+\-*/=]/.test(char) && !inString) {
      // マイナス記号が数値の一部である可能性をチェック
      if (char === "-" && currentToken && /^\d+$/.test(currentToken)) {
        // 数値の一部として扱う（負の数の可能性、ただし演算子の可能性もある）
        // ここでは単純に演算子として処理
      }
      
      if (currentToken) {
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      
      // 演算子を単独のトークンとして追加
      tokens.push({
        type: TokenType.OPERATOR,
        text: char,
        columnStart: columnOffset + currentPos,
        columnEnd: columnOffset + currentPos + 1,
      });
      currentPos++;
      continue;
    }

    // 通常の文字
    if (!currentToken) {
      tokenStart = currentPos;
    }
    currentToken += char;
    currentPos++;
  }

  // 残りのトークンを処理
  if (currentToken) {
    tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
  }

  return tokens;
}

/**
 * トークンタイプを判定してトークンを作成
 */
function createToken(text: string, start: number, end: number): AsmToken {
  // レジスタ（R0-R15, GR0-GR15など、または単独のR1, R2など）
  if (/^R\d+$|^GR\d+$/i.test(text)) {
    return {
      type: TokenType.REGISTER,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // リテラル（=X'...', =C'...', =CL8'...'など）
  if (/^=([XCFHDB]|CL\d+|XL\d+|FL\d+|FD\d+|ED\d+|E\d+)/i.test(text)) {
    return {
      type: TokenType.LITERAL,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // 16進数リテラル（X'...', XL'...'など）
  if (/^X'[0-9A-F]+'$/i.test(text) || /^XL'[0-9A-F]+'$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseNumber(text),
      },
    };
  }

  // 文字列リテラル（C'...', CL8'...'など）
  if (/^C'[^']*'$/i.test(text) || /^CL\d+'[^']*'$/i.test(text)) {
    return {
      type: TokenType.STRING,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // ビット文字列（B'...'）
  if (/^B'[01]+'$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseInt(text.slice(2, -1), 2),
      },
    };
  }

  // 数値（16進Hサフィックス、10進数、符号付き）
  if (/^-?\d+$|^[0-9A-F]+H$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseNumber(text),
      },
    };
  }

  // 演算子（+, -, *, /, =）
  if (/^[+\-*/=]+$/.test(text)) {
    return {
      type: TokenType.OPERATOR,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // デフォルトはシンボルまたはオペコード（後で区別する）
  return {
    type: TokenType.SYMBOL,
    text,
    columnStart: start,
    columnEnd: end,
  };
}

/**
 * 数値をパース
 */
function parseNumber(text: string): number {
  // 16進数（Hサフィックス）
  if (/^\d+[Hh]$/.test(text)) {
    return parseInt(text.slice(0, -1), 16);
  }
  // X'...'形式
  if (/^X'[0-9A-F]+'$/i.test(text)) {
    return parseInt(text.slice(2, -1), 16);
  }
  // XL'...'形式
  if (/^XL'[0-9A-F]+'$/i.test(text)) {
    return parseInt(text.slice(3, -1), 16);
  }
  // B'...'形式（2進数）
  if (/^B'[01]+'$/i.test(text)) {
    return parseInt(text.slice(2, -1), 2);
  }
  // 10進数（符号付きを含む）
  if (/^-?\d+$/.test(text)) {
    return parseInt(text, 10);
  }
  return 0;
}