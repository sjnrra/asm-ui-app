import type { AsmStatement, AssemblyResult, Operand, ParseError, SymbolDefinition } from "./types";
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
          // オペコード情報を先に取得（オペランド数の検証に使用）
          const opcodeInfo = getOpcodeInfo(statement.opcode);
          
          // オペランドテキストをクリーンアップ（末尾のカンマを削除）
          const cleanedOperandsText = statement.operandsText.trim().replace(/,\s*$/, "").trim();
          
          // オペランドを解析
          const operands = cleanedOperandsText ? this.parseOperands(cleanedOperandsText) : [];
          
          if (!statement.instruction) {
            statement.instruction = {
              mnemonic: statement.opcode,
              format: opcodeInfo?.format,
              description: opcodeInfo?.description,
              operands,
            };
          } else {
            statement.instruction.mnemonic = statement.opcode;
            statement.instruction.format = opcodeInfo?.format;
            statement.instruction.description = opcodeInfo?.description;
            statement.instruction.operands = operands;
          }
          
          // オペランド数の検証（将来の拡張）
          // オペコード情報が存在し、オペランド数の不一致がある場合のみ警告
          if (opcodeInfo) {
            const expectedCount = opcodeInfo.operands.count;
            const actualCount = operands.length;
            
            // 期待値と実際の値が異なる場合のみ警告
            // ただし、以下の場合は警告を出さない：
            // 1. 期待値0で実際0（問題なし）
            // 2. 期待値が0で実際が1以上、かつオペランドがカンマのみ（SPACE , など）
            // 3. 括弧で囲まれた単一オペランド（OPEN (SNAPDCB,OUTPUT) など）
            // 4. SNAP、DCBなど複数パラメータを1つのオペランドとして扱うマクロ
            const trimmedOperands = cleanedOperandsText;
            const isSingleParenOperand = trimmedOperands.startsWith("(") && trimmedOperands.endsWith(")") && !trimmedOperands.includes(",");
            const isEmptyOrCommaOnly = trimmedOperands === "" || trimmedOperands === "," || /^,\s*$/.test(trimmedOperands);
            
            // SNAP、DCBなどのマクロは複数パラメータを1つのオペランドとして扱う
            const isMacroWithMultipleParams = ["SNAP", "DCB"].includes(statement.opcode);
            
            if (actualCount !== expectedCount) {
              // 特別なケース1: 期待値0で実際0（問題なし）
              if (actualCount === 0 && expectedCount === 0) {
                // 警告を出さない
              }
              // 特別なケース2: 期待値0で実際1以上、かつカンマのみの場合は無視（SPACE , など）
              else if (expectedCount === 0 && isEmptyOrCommaOnly) {
                // 警告を出さない
              }
              // 特別なケース3: 括弧で囲まれた単一オペランド（OPEN (SNAPDCB,OUTPUT) など）
              else if (isSingleParenOperand && actualCount === 1 && expectedCount >= 1) {
                // 警告を出さない（括弧内のカンマはオペランドの区切りではない）
              }
              // 特別なケース4: マクロの複数パラメータ
              else if (isMacroWithMultipleParams && actualCount >= 1 && expectedCount >= 1) {
                // 警告を出さない（マクロパラメータは複数でも1つのオペランドとして扱う）
              }
              // それ以外の不一致は警告
              else {
                const linePreview = statement.rawText.trim().substring(0, 60);
                warnings.push({
                  lineNumber: statement.lineNumber,
                  column: 0,
                  message: `L${statement.lineNumber}: オペランド数が一致しません（期待値 ${expectedCount}, 実際 ${actualCount}）: ${linePreview}${linePreview.length >= 60 ? "..." : ""}`,
                  severity: "warning",
                });
              }
            }
          }
        } catch (error) {
          const linePreview = statement.rawText.trim().substring(0, 60);
          warnings.push({
            lineNumber: statement.lineNumber,
            column: 0,
            message: `L${statement.lineNumber}: オペランド解析エラー: ${error instanceof Error ? error.message : "不明なエラー"} | ${linePreview}${linePreview.length >= 60 ? "..." : ""}`,
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
            description: opcodeInfo.description,
            operands: [],
          };
        }
      }

      // シンボル参照のチェック（将来の拡張用）
      this.checkSymbolReferences(statement, result.symbols, warnings);
      
      // EQU、DC、DSで定義されたシンボルをシンボルテーブルに追加
      this.processSymbolDefinitions(statement, result.symbols);
    }

    return {
      ...result,
      errors: [...errors, ...warnings],
    };
  }

  /**
   * シンボル定義を処理（EQU、DC、DSなど）
   */
  private processSymbolDefinitions(
    statement: AsmStatement,
    symbols: Map<string, SymbolDefinition>
  ): void {
    if (!statement.label || !statement.opcode) {
      return;
    }

    const opcode = statement.opcode.toUpperCase();
    
    // EQU命令: シンボルに値を割り当て
    if (opcode === "EQU") {
      let value: number | string = "";
      
      if (statement.operandsText) {
        const trimmed = statement.operandsText.trim();
        
        // *は現在のロケーションカウンタ（簡易的に行番号を使用）
        if (trimmed === "*") {
          value = statement.lineNumber;
        }
        // 10進数
        else if (/^-?\d+$/.test(trimmed)) {
          value = parseInt(trimmed, 10);
        }
        // 16進数（Hサフィックス）
        else if (/^[0-9A-F]+H$/i.test(trimmed)) {
          value = parseInt(trimmed.slice(0, -1), 16);
        }
        // X'...'形式
        else if (/^X'[0-9A-F]+'$/i.test(trimmed)) {
          value = parseInt(trimmed.slice(2, -1), 16);
        }
        // 式（例: TABLEEND-TABLEST）は文字列として保持（将来的に評価可能）
        else {
          value = trimmed;
        }
      } else {
        // オペランドがない場合は*とみなす
        value = statement.lineNumber;
      }
      
      symbols.set(statement.label, {
        name: statement.label,
        value,
        type: "equ",
        definedAt: statement.lineNumber,
      });
    }
    // DC命令: 定数の定義
    else if (opcode === "DC") {
      const valueText = statement.operandsText || "";
      // DC命令のオペランドを簡易的に保持（将来的に詳細解析可能）
      symbols.set(statement.label, {
        name: statement.label,
        value: valueText,
        type: "constant",
        definedAt: statement.lineNumber,
      });
    }
    // DS命令: ストレージの定義
    else if (opcode === "DS") {
      const valueText = statement.operandsText || "";
      // DS命令のオペランドを簡易的に保持（将来的に詳細解析可能）
      symbols.set(statement.label, {
        name: statement.label,
        value: valueText,
        type: "variable",
        definedAt: statement.lineNumber,
      });
    }
    // その他のラベル（CSECT、ENTRY POINTなど）
    else if (!symbols.has(statement.label)) {
      // ラベルとして既に追加されている場合はスキップ
      symbols.set(statement.label, {
        name: statement.label,
        value: statement.lineNumber,
        type: "label",
        definedAt: statement.lineNumber,
      });
    }
  }

  /**
   * オペランド文字列を解析
   * 将来、より詳細なアドレッシングモード解析を追加可能
   */
  private parseOperands(operandsText: string): Operand[] {
    const operands: Operand[] = [];
    
    // 空文字列またはカンマのみの場合はオペランドなし
    const trimmed = operandsText.trim().replace(/,\s*$/, "").trim();
    if (!trimmed || trimmed === ",") {
      return [];
    }
    
    const parts = this.splitOperands(operandsText);

    for (const part of parts) {
      const trimmedPart = part.trim();
      if (!trimmedPart || trimmedPart === ",") continue;

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
    const trimmed = text.trim();
    if (!trimmed) {
      return [];
    }

    // 末尾のカンマを削除（例: "DCB=SNAPDCB,SDATA=DM," -> "DCB=SNAPDCB,SDATA=DM"）
    const cleaned = trimmed.replace(/,\s*$/, "").trim();
    if (!cleaned) {
      return [];
    }

    // 括弧で囲まれた全体が1つのオペランドの場合（例: "(SNAPDCB,OUTPUT)"）
    // OPEN命令などで使用される
    if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
      // 外側の括弧のみの場合（ネストされた括弧がない場合）、1つのオペランドとして扱う
      let depth = 0;
      let isOuterParensOnly = true;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "(") {
          depth++;
        } else if (cleaned[i] === ")") {
          depth--;
          // 外側の括弧が閉じる前に深さが0になった場合、ネストがある
          if (depth === 0 && i < cleaned.length - 1) {
            isOuterParensOnly = false;
            break;
          }
        }
      }
      // 外側の括弧のみの場合は、1つのオペランドとして扱う（括弧内のカンマは区切りではない）
      if (isOuterParensOnly) {
        return [cleaned];
      }
    }

    const parts: string[] = [];
    let current = "";
    let depth = 0;
    let inString = false;

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      // 文字列リテラル内の処理
      if ((char === "'" || char === '"') && (i === 0 || cleaned[i - 1] !== "\\")) {
        inString = !inString;
        current += char;
        continue;
      }

      if (inString) {
        current += char;
        continue;
      }
      
      if (char === "(") {
        depth++;
        current += char;
      } else if (char === ")") {
        depth--;
        current += char;
      } else if (char === "," && depth === 0) {
        const trimmedPart = current.trim();
        if (trimmedPart) {
          parts.push(trimmedPart);
        }
        current = "";
      } else {
        current += char;
      }
    }

    const trimmedLast = current.trim();
    if (trimmedLast) {
      parts.push(trimmedLast);
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