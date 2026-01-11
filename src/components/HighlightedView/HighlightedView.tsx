// src/components/HighlightedView/HighlightedView.tsx
import type { ReactElement } from "react";
import type { AsmStatement, ParseContext } from "../../core/types";
import { TokenType } from "../../core/types";

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
            stmt.opcode?.toUpperCase() === "DSECT";
          
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
                // rawTextを直接使用して、元のテキスト内容を完全に保持
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