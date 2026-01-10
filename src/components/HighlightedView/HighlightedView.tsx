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
          
          const lineClassNames = [
            "asm-line",
            selectedLineNumber === stmt.lineNumber ? "selected" : "",
            isExternal ? "external-source" : "",
            isMacroCall ? "macro-call" : "",
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
                {isExternal && (
                  <span className="external-marker" title={`外部ファイル: ${stmt.sourceFile || (stmt.opcode && context?.macros?.get(stmt.opcode.toUpperCase())?.sourceFile) || ""}`}>
                    📄
                  </span>
                )}
                {(isMacroCall || (stmt.opcode && context?.macros?.has(stmt.opcode.toUpperCase()))) && (
                  <span className="macro-marker" title={`マクロ呼び出し: ${stmt.macroName || stmt.opcode}`}>
                    ⚡
                  </span>
                )}
                <span className="line-number-text">{stmt.lineNumber.toString().padStart(4, " ")}</span>
              </span>
              <span className="line-content">
              {stmt.tokens.length > 0 ? (() => {
                // トークンをcolumnStartの順にソート
                const sortedTokens = [...stmt.tokens]
                  .filter((t) => t.columnStart < 80) // 80カラム未満から始まるトークンのみ表示
                  .sort((a, b) => a.columnStart - b.columnStart);
                
                const elements: (ReactElement | null)[] = [];
                let lastEnd = 0;
                
                for (let i = 0; i < sortedTokens.length; i++) {
                  const token = sortedTokens[i];
                  
                  // 前のトークンとの間に空白がある場合は空白を挿入
                  if (token.columnStart > lastEnd) {
                    const gap = token.columnStart - lastEnd;
                    elements.push(
                      <span
                        key={`gap-${i}`}
                        className="tok-whitespace"
                      >
                        {" ".repeat(gap)}
                      </span>
                    );
                  }
                  
                  // 80カラムを超える部分を切り取る
                  let text = token.text;
                  if (token.columnEnd > 80) {
                    const maxLength = 80 - token.columnStart;
                    text = text.substring(0, Math.max(0, maxLength));
                  }
                  
                  if (text) {
                    elements.push(
                      <span
                        key={i}
                        className={getTokenClassName(token.type)}
                        title={token.type}
                      >
                        {text}
                      </span>
                    );
                    lastEnd = Math.min(token.columnEnd, 80);
                  }
                }
                
                return elements;
              })() : (
                <span className="tok-whitespace">{stmt.rawText.substring(0, 80)}</span>
              )}
            </span>
          </div>
          );
        })}
      </pre>
    </div>
  );
};