// src/components/HighlightedView/HighlightedView.tsx
import type { ReactElement } from "react";
import type { AsmStatement, ParseContext } from "../../core/Types";
import { TokenType } from "../../core/Types";

interface HighlightedViewProps {
  statements: AsmStatement[];
  selectedLineNumber?: number;
  onLineClick?: (lineNumber: number) => void;
  context?: ParseContext;
}

export const HighlightedView = ({
  statements,
  selectedLineNumber,
  onLineClick,
  context,
}: HighlightedViewProps) => {
  const getTokenClassName = (tokenType: TokenType): string => {
    const typeMap: Record<TokenType, string> = {
      [TokenType.LABEL]: "tok-label",
      [TokenType.OPCODE]: "tok-opcode",
      [TokenType.REGISTER]: "tok-register",
      [TokenType.SYMBOL]: "tok-symbol",
      [TokenType.LITERAL]: "tok-literal",
      [TokenType.NUMBER]: "tok-number",
      [TokenType.OPERATOR]: "tok-operator",
      [TokenType.STRING]: "tok-string",
      [TokenType.COMMENT]: "tok-comment",
      [TokenType.WHITESPACE]: "tok-whitespace",
      [TokenType.DELIMITER]: "tok-delimiter",
      [TokenType.ADDRESSING]: "tok-addressing",
    };
    return typeMap[tokenType] || "tok-unknown";
  };

  return (
    <div className="highlighted-view">
      <div className="panel-header">
        <h3>解析結果（ハイライト表示）</h3>
      </div>
      <pre className="asm-highlight">
        {statements.map((stmt) => {
          // 外部ファイルかどうかの判定
          // 1. 直接sourceFileが設定されている場合
          // 2. マクロ呼び出しで、そのマクロが外部ファイルで定義されている場合
          // 3. opcodeがマクロ名として登録されており、そのマクロが外部ファイルで定義されている場合
          let isExternal = !!stmt.sourceFile;
          let isMacroCall = !!stmt.isMacroCall;

          // opcodeがマクロ名として登録されているかチェック
          if (context?.macros && stmt.opcode) {
            const opcodeUpper = stmt.opcode.toUpperCase();
            if (context.macros.has(opcodeUpper)) {
              // マクロ呼び出しとしてマーク
              isMacroCall = true;
              // このマクロが外部ファイルで定義されているかチェック
              if (!isExternal) {
                const macroDef = context.macros.get(opcodeUpper);
                if (macroDef?.sourceFile) {
                  isExternal = true;
                }
              }
            }
          }

          // 淡く表示する条件の判定
          const isFaded =
            (stmt.opcode?.toUpperCase() === "DS" && stmt.operandsText?.trim().toUpperCase() === "0H") ||
            stmt.opcode?.toUpperCase() === "CSECT" ||
            stmt.opcode?.toUpperCase() === "DSECT" ||
            stmt.opcode?.toUpperCase() === "USING";

          const lineClassNames = [
            "asm-line",
            selectedLineNumber === stmt.lineNumber ? "selected" : "",
            isExternal ? "external-source" : "",
            isMacroCall ? "macro-call" : "",
            isFaded ? "faded-line" : "",
          ].filter(Boolean).join(" ");

          return (
            <div
              key={stmt.lineNumber}
              className={lineClassNames}
              onClick={() => onLineClick?.(stmt.lineNumber)}
              title={
                isExternal
                  ? `外部ファイル: ${stmt.sourceFile || (stmt.opcode && context?.macros?.get(stmt.opcode.toUpperCase())?.sourceFile) || ""}${isMacroCall || (stmt.opcode && context?.macros?.has(stmt.opcode.toUpperCase())) ? ` (マクロ呼び出し: ${stmt.macroName || stmt.opcode})` : ""}`
                  : isMacroCall || (stmt.opcode && context?.macros?.has(stmt.opcode.toUpperCase()))
                    ? `マクロ呼び出し: ${stmt.macroName || stmt.opcode}`
                    : undefined
              }
            >
              <span className="line-number">
                <span className="line-number-text">{stmt.lineNumber.toString().padStart(4, " ")}</span>
              </span>
              <span className="line-content">
                {(() => {
                  // 継続行の場合、operandsTextを使用してハイライト表示
                  if (stmt.isContinuation && stmt.operandsText && stmt.operandsText.trim().length > 0) {
                    const rawText = stmt.rawText.substring(0, 80); // 80カラムまで

                    // operandsTextを基にトークンを生成
                    // rawText内でoperandsTextの開始位置を探す
                    const operandsTextTrimmed = stmt.operandsText.trim();
                    const firstNonSpaceInRawText = rawText.search(/\S/);

                    // rawTextの最初の非空白文字から始まる部分を使用
                    // 継続行の場合、カラム1-71がオペランド部分
                    const operandsStartPos = firstNonSpaceInRawText >= 0 ? firstNonSpaceInRawText : 0;

                    // operandsTextを=や,で分割してトークン化
                    const elements: (ReactElement | null)[] = [];
                    let currentPos = 0;

                    // operandsTextの前の部分（空白など）を追加
                    if (operandsStartPos > 0) {
                      const beforeOperands = rawText.substring(0, operandsStartPos);
                      if (beforeOperands.length > 0) {
                        elements.push(
                          <span key="before-operands" className="tok-whitespace">
                            {beforeOperands}
                          </span>
                        );
                        currentPos = operandsStartPos;
                      }
                    }

                    // operandsTextをトークン化
                    // =や,で分割しつつ、括弧内の=や,は考慮しない
                    const operandsText = stmt.operandsText.trim();
                    // rawTextの最初の非空白文字から始まる部分を使用（継続行は通常カラム1から始まる）
                    const rawTextFromFirstNonSpace = rawText.substring(operandsStartPos);
                    let depth = 0;
                    let inString = false;
                    let stringChar = '';
                    let currentToken = '';
                    let tokenStart = 0;
                    let tokenStartInRawText = operandsStartPos;

                    // operandsTextを基にトークン化（rawTextの位置に適用）
                    for (let i = 0; i < operandsText.length; i++) {
                      const char = operandsText[i];
                      const posInRawText = operandsStartPos + i;

                      // 文字列内のチェック
                      if ((char === "'" || char === '"') && (i === 0 || operandsText[i - 1] !== "\\")) {
                        if (!inString) {
                          inString = true;
                          stringChar = char;
                        } else if (char === stringChar) {
                          if (i + 1 >= operandsText.length || operandsText[i + 1] !== stringChar) {
                            inString = false;
                            stringChar = '';
                          } else {
                            i++; // エスケープされたクォート
                          }
                        }
                        if (currentToken === '') {
                          tokenStart = i;
                          tokenStartInRawText = posInRawText;
                        }
                        currentToken += char;
                        continue;
                      }

                      if (inString) {
                        currentToken += char;
                        continue;
                      }

                      // 括弧の深さを追跡
                      if (char === '(') {
                        depth++;
                        if (currentToken === '') {
                          tokenStart = i;
                          tokenStartInRawText = posInRawText;
                        }
                        currentToken += char;
                        continue;
                      } else if (char === ')') {
                        depth--;
                        currentToken += char;
                        continue;
                      }

                      // デリミタ（=や,）の処理（括弧外のみ）
                      if ((char === '=' || char === ',') && depth === 0) {
                        // 現在のトークンを確定
                        if (currentToken.trim().length > 0) {
                          const tokenType = char === '=' ? TokenType.SYMBOL : TokenType.SYMBOL;
                          elements.push(
                            <span
                              key={`token-${tokenStartInRawText}`}
                              className={getTokenClassName(tokenType)}
                            >
                              {currentToken.trim()}
                            </span>
                          );
                          currentPos = tokenStartInRawText + currentToken.trim().length;
                        }

                        // デリミタを追加
                        elements.push(
                          <span
                            key={`delim-${posInRawText}`}
                            className={getTokenClassName(char === '=' ? TokenType.OPERATOR : TokenType.DELIMITER)}
                          >
                            {char}
                          </span>
                        );
                        currentPos = posInRawText + 1;
                        currentToken = '';
                        tokenStart = i + 1;
                        tokenStartInRawText = posInRawText + 1;
                        continue;
                      }

                      // 通常の文字
                      if (currentToken === '') {
                        tokenStart = i;
                        tokenStartInRawText = posInRawText;
                      }
                      currentToken += char;
                    }

                    // 最後のトークンを追加
                    if (currentToken.trim().length > 0) {
                      elements.push(
                        <span
                          key={`token-${tokenStartInRawText}-final`}
                          className={getTokenClassName(TokenType.SYMBOL)}
                        >
                          {currentToken.trim()}
                        </span>
                      );
                      currentPos = tokenStartInRawText + currentToken.trim().length;
                    }

                    // 残りのテキスト（カラム72以降の+など）を追加
                    // ★継続行の場合のみ通過する
                    const operandsEndPos = operandsStartPos + operandsText.length;
                    if (operandsEndPos < rawText.length && operandsEndPos < 80) {
                      const remainingText = rawText.substring(operandsEndPos, 71);
                      if (remainingText.length > 0) {
                        elements.push(
                          <span
                            key="remaining-text"
                            className="tok-comment"
                          >
                            {remainingText}
                          </span>
                        );
                      }
                      const remainingText2 = rawText.substring(71, 72);
                      elements.push(
                        <span
                          className="tok-whitespace"
                        >
                          {remainingText2}
                        </span>
                      );
                    }

                    return elements.length > 0 ? elements : <span className="tok-whitespace">{rawText}</span>;
                    
                  }

                  // 通常の行の処理（既存のロジック）
                  const rawText = stmt.rawText.substring(0, 80); // 80カラムまで
                  if (stmt.tokens.length === 0) {
                    return <span className="tok-whitespace">{rawText}</span>;
                  }

                  // すべてのトークン（コメントを含む）を位置順にソート
                  const allTokens = stmt.tokens
                    .filter((t) => t.columnStart < 80)
                    .sort((a, b) => a.columnStart - b.columnStart);

                  // rawTextを順番に処理し、トークンを順番に配置
                  const elements: (ReactElement | null)[] = [];
                  let currentPos = 0;

                  for (let i = 0; i < allTokens.length; i++) {
                    const token = allTokens[i];

                    // 現在の位置からトークンの開始位置までの空白を追加
                    if (token.columnStart > currentPos) {
                      const whitespaceText = rawText.substring(currentPos, token.columnStart);
                      if (whitespaceText.length > 0) {
                        elements.push(
                          <span
                            key={`whitespace-${currentPos}-${i}`}
                            className="tok-whitespace"
                          >
                            {whitespaceText}
                          </span>
                        );
                      }
                    }

                    // トークンのテキストをrawTextから取得（位置情報を使用）
                    const tokenEnd = Math.min(token.columnEnd, rawText.length, 80);
                    const tokenStart = Math.max(token.columnStart, currentPos);

                    if (tokenStart < tokenEnd) {
                      const tokenText = rawText.substring(tokenStart, tokenEnd);
                      if (tokenText.length > 0 || token.type === TokenType.WHITESPACE) {
                        elements.push(
                          <span
                            key={`token-${tokenStart}-${i}`}
                            className={getTokenClassName(token.type)}
                            title={token.type}
                          >
                            {tokenText}
                          </span>
                        );
                        currentPos = tokenEnd;
                      }
                    }
                  }

                  // 最後のトークンの後に残りのテキストがある場合
                  if (currentPos < rawText.length && currentPos < 80) {
                    const remainingText = rawText.substring(currentPos, 80);
                    if (remainingText.length > 0) {
                      elements.push(
                        <span
                          key={`remaining-${currentPos}`}
                          className="tok-whitespace"
                        >
                          {remainingText}
                        </span>
                      );
                    }
                  }

                  return elements.length > 0 ? elements : <span className="tok-whitespace">{rawText}</span>;
                })()}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};