import type { AsmStatement, AssemblyResult, ParseContext, ParseError } from "./types";
import { parseLine } from "./lineParser";
import { TokenType } from "./types";

/**
 * アセンブリソース全体を解析
 * 将来の拡張を考慮した構造化されたパーサー
 */
export class AssemblyParser {
  private context: ParseContext;

  constructor() {
    this.context = {
      symbols: new Map(),
      macros: new Map(),
    };
  }

  /**
   * ソースコード全体を解析
   */
  parse(source: string): AssemblyResult {
    const lines = source.split("\n");
    const statements: AsmStatement[] = [];
    const errors: ParseError[] = [];
    
    // 継続行を結合
    const processedLines: string[] = [];
    let continuationBuffer = "";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 継続行のチェック: カラム72（インデックス71）に非空白文字がある場合
      // +記号やその他の継続文字を許可
      const isContinuation = line.length > 71 && 
        line[71] !== " " && 
        line[71] !== "\t" && 
        line[71] !== "" &&
        line[71] !== undefined;
      
      if (continuationBuffer) {
        if (isContinuation) {
          // 継続行を結合: カラム73以降の内容を結合
          const continuationContent = line.length > 72 ? line.substring(72).trim() : "";
          continuationBuffer += continuationContent;
        } else {
          // 継続終了: バッファを確定して現在の行を処理
          processedLines.push(continuationBuffer);
          continuationBuffer = "";
          processedLines.push(line);
        }
      } else {
        if (isContinuation) {
          // 継続開始: カラム1-71の内容とカラム73以降を結合
          const mainContent = line.substring(0, 72).trimEnd();
          const continuationContent = line.length > 72 ? line.substring(72).trim() : "";
          continuationBuffer = mainContent + " " + continuationContent;
        } else {
          processedLines.push(line);
        }
      }
    }
    
    if (continuationBuffer) {
      processedLines.push(continuationBuffer);
    }

    // 各行を解析
    for (let i = 0; i < processedLines.length; i++) {
      try {
        const statement = parseLine(processedLines[i], i + 1);
        
        // ラベルがあればシンボルテーブルに追加
        if (statement.label) {
          this.context.symbols.set(statement.label, {
            name: statement.label,
            value: i + 1, // 仮の値、将来は実際のアドレスを計算
            type: "label",
            definedAt: i + 1,
          });
        }

        // トークンのタイプを補正（オペコードの判定）
        this.enrichStatement(statement);
        
        statements.push(statement);
      } catch (error) {
        errors.push({
          lineNumber: i + 1,
          column: 0,
          message: error instanceof Error ? error.message : "解析エラー",
          severity: "error",
        });
      }
    }

    return {
      statements,
      errors,
      symbols: this.context.symbols,
      context: this.context,
    };
  }

  /**
   * ステートメントを補強（オペコードの判定など）
   */
  private enrichStatement(statement: AsmStatement): void {
    if (!statement.opcode || statement.tokens.length === 0) {
      return;
    }

    // オペコードトークンを特定
    let foundLabel = false;
    for (const token of statement.tokens) {
      if (token.type === TokenType.LABEL) {
        foundLabel = true;
        continue;
      }
      
      if (token.type === TokenType.WHITESPACE) {
        continue;
      }

      if (foundLabel || !statement.label) {
        // 最初の非空白トークンがオペコード
        if (token.text === statement.opcode && token.type === TokenType.SYMBOL) {
          token.type = TokenType.OPCODE;
        }
        break;
      }
    }
  }

  /**
   * コンテキストを取得（将来の拡張用）
   */
  getContext(): ParseContext {
    return this.context;
  }
}

/**
 * 簡易パーサー関数（エクスポート用）
 */
export function parse(source: string): AssemblyResult {
  const parser = new AssemblyParser();
  return parser.parse(source);
}