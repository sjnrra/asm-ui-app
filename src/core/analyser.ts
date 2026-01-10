import type { AsmStatement, AssemblyResult, Operand, ParseError } from "./types";
import { TokenType } from "./types";
import { getOpcodeInfo } from "./opcode";

/**
 * アセンブリコードの意味解析を行うクラス
 * 将来の拡張を考慮した設計
 */
export class AssemblyAnalyzer {
  /**
   * 基本的な意味解析（エラーチェック、シンボル解決など）
   * 将来的にはより高度な解析（フロー解析、最適化など）を追加可能
   */
  analyze(result: AssemblyResult): AssemblyResult {
    const errors: ParseError[] = [...result.errors];
    const warnings: ParseError[] = [];

    // 各ステートメントを解析
    for (const statement of result.statements) {
      // オペランドの解析（将来の拡張用）
      if (statement.opcode && statement.operandsText) {
        try {
          const operands = this.parseOperands(statement.operandsText);
          const opcodeInfo = getOpcodeInfo(statement.opcode);
          
          if (!statement.instruction) {
            statement.instruction = {
              mnemonic: statement.opcode,
              format: opcodeInfo?.format,
              operands,
            };
          } else {
            statement.instruction.mnemonic = statement.opcode;
            statement.instruction.format = opcodeInfo?.format;
            statement.instruction.operands = operands;
          }
          
          // オペランド数の検証（将来の拡張）
          if (opcodeInfo && operands.length !== opcodeInfo.operands.count) {
            warnings.push({
              lineNumber: statement.lineNumber,
              column: 0,
              message: `オペランド数が一致しません: 期待値 ${opcodeInfo.operands.count}, 実際 ${operands.length}`,
              severity: "warning",
            });
          }
        } catch (error) {
          warnings.push({
            lineNumber: statement.lineNumber,
            column: 0,
            message: error instanceof Error ? error.message : "オペランド解析エラー",
            severity: "warning",
          });
        }
      } else if (statement.opcode) {
        // オペコードのみの場合（疑似命令など）
        const opcodeInfo = getOpcodeInfo(statement.opcode);
        if (opcodeInfo && !statement.instruction) {
          statement.instruction = {
            mnemonic: statement.opcode,
            format: opcodeInfo.format,
            operands: [],
          };
        }
      }

      // シンボル参照のチェック（将来の拡張用）
      this.checkSymbolReferences(statement, result.symbols, warnings);
    }

    return {
      ...result,
      errors: [...errors, ...warnings],
    };
  }

  /**
   * オペランド文字列を解析
   * 将来、より詳細なアドレッシングモード解析を追加可能
   */
  private parseOperands(operandsText: string): Operand[] {
    const operands: Operand[] = [];
    const parts = this.splitOperands(operandsText);

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // レジスタ
      if (/^R\d+$|^GR\d+$/i.test(trimmed)) {
        operands.push({
          type: "register",
          value: trimmed,
          register: trimmed.toUpperCase(),
        });
      }
      // ベース-ディスプレースメント形式（例: 4(R3), 1000(R5)）
      else if (/^\d+\(R\d+\)$/i.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\(R(\d+)\)$/i);
        if (match) {
          operands.push({
            type: "base-displacement",
            value: trimmed,
            displacement: parseInt(match[1], 10),
            baseRegister: `R${match[2]}`,
          });
        }
      }
      // インデックス付き（将来の拡張: 4(R3,R4)）
      else if (/^\d+\(R\d+,R\d+\)$/i.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\(R(\d+),R(\d+)\)$/i);
        if (match) {
          operands.push({
            type: "indexed",
            value: trimmed,
            displacement: parseInt(match[1], 10),
            baseRegister: `R${match[2]}`,
            indexRegister: `R${match[3]}`,
          });
        }
      }
      // 即値（数値）
      else if (/^-?\d+$|^[0-9A-F]+H$/i.test(trimmed)) {
        operands.push({
          type: "immediate",
          value: trimmed,
        });
      }
      // メモリ参照（シンボル）
      else {
        operands.push({
          type: "memory",
          value: trimmed,
        });
      }
    }

    return operands;
  }

  /**
   * オペランド文字列を分割（カンマ区切り、括弧を考慮）
   */
  private splitOperands(text: string): string[] {
    const parts: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === "(") {
        depth++;
        current += char;
      } else if (char === ")") {
        depth--;
        current += char;
      } else if (char === "," && depth === 0) {
        parts.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      parts.push(current);
    }

    return parts;
  }

  /**
   * シンボル参照をチェック（将来の拡張用）
   */
  private checkSymbolReferences(
    statement: AsmStatement,
    _symbols: Map<string, unknown>,
    _warnings: ParseError[]
  ): void {
    // 将来的には、未定義シンボルの参照を検出
    // 現時点では基本的な実装のみ
    for (const token of statement.tokens) {
      if (token.type === TokenType.SYMBOL && statement.opcode !== token.text) {
        // オペコードでないシンボルは参照の可能性がある
        // 将来的にはシンボルテーブルと照合
      }
    }
  }
}

/**
 * 簡易アナライザー関数（エクスポート用）
 */
export function analyze(result: AssemblyResult): AssemblyResult {
  const analyzer = new AssemblyAnalyzer();
  return analyzer.analyze(result);
}