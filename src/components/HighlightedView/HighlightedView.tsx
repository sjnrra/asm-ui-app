// src/components/HighlightedView/HighlightedView.tsx
import type { AsmStatement } from "../../core/types";
import { TokenType } from "../../core/types";

interface HighlightedViewProps {
  statements: AsmStatement[];
  selectedLineNumber?: number;
  onLineClick?: (lineNumber: number) => void;
}

export const HighlightedView = ({
  statements,
  selectedLineNumber,
  onLineClick,
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
      <pre className="asm-highlight">
        {statements.map((stmt) => (
          <div
            key={stmt.lineNumber}
            className={`asm-line ${selectedLineNumber === stmt.lineNumber ? "selected" : ""}`}
            onClick={() => onLineClick?.(stmt.lineNumber)}
          >
            <span className="line-number">{stmt.lineNumber.toString().padStart(4, " ")}</span>
            <span className="line-content">
              {stmt.tokens.length > 0 ? (
                stmt.tokens.map((t, i) => (
                  <span
                    key={i}
                    className={getTokenClassName(t.type)}
                    title={t.type}
                  >
                    {t.text}
                  </span>
                ))
              ) : (
                <span className="tok-whitespace">{stmt.rawText}</span>
              )}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
};