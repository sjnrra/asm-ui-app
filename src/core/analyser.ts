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
        sourceFile: statement.sourceFile,
      });
    }
    // DC命令: 定数の定義
    else if (opcode === "DC") {
      const valueText = statement.operandsText || "";
      // DC命令のオペランドからデータ型を抽出
      const { dataType, length, parsedValue } = this.parseDCType(valueText);
      
      symbols.set(statement.label, {
        name: statement.label,
        value: parsedValue !== undefined ? parsedValue : valueText,
        type: "constant",
        definedAt: statement.lineNumber,
        sourceFile: statement.sourceFile,
        dataType: dataType,
        length: length,
      });
    }
    // DS命令: ストレージの定義
    else if (opcode === "DS") {
      const valueText = statement.operandsText || "";
      // DS命令のオペランドからデータ型を抽出
      const { dataType, length } = this.parseDSType(valueText);
      
      symbols.set(statement.label, {
        name: statement.label,
        value: valueText,
        type: "variable",
        definedAt: statement.lineNumber,
        sourceFile: statement.sourceFile,
        dataType: dataType,
        length: length,
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
        sourceFile: statement.sourceFile,
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

      // レジスタ（R0-R15, GR0-GR15, RA-RFなど）
      if (/^R\d+$|^GR\d+$|^R[ABCDEF]$/i.test(trimmedPart)) {
        operands.push({
          type: "register",
          value: trimmedPart,
          register: trimmedPart.toUpperCase(),
        });
      }
      // ベース-ディスプレースメント形式（例: 4(R3), 1000(R5), WORKAREA(R4)）
      else if (/^(\d+|[A-Z_][A-Z0-9_]*)?\(R\d+\)$/i.test(trimmedPart)) {
        const match = trimmedPart.match(/^(\d+|[A-Z_][A-Z0-9_]*)?\(R(\d+)\)$/i);
        if (match) {
          const displacement = match[1] ? (isNaN(Number(match[1])) ? undefined : parseInt(match[1], 10)) : 0;
          const symbol = match[1] && isNaN(Number(match[1])) ? match[1] : undefined;
          operands.push({
            type: "base-displacement",
            value: trimmedPart,
            displacement: displacement,
            baseRegister: `R${match[2]}`,
            ...(symbol && { value: symbol }), // シンボルがある場合はvalueを上書き
          });
        }
      }
      // インデックス付き（例: 4(R3,R4), WORKAREA(R4,R5)）
      else if (/^(\d+|[A-Z_][A-Z0-9_]*)?\(R\d+,R\d+\)$/i.test(trimmedPart)) {
        const match = trimmedPart.match(/^(\d+|[A-Z_][A-Z0-9_]*)?\(R(\d+),R(\d+)\)$/i);
        if (match) {
          const displacement = match[1] ? (isNaN(Number(match[1])) ? undefined : parseInt(match[1], 10)) : 0;
          const symbol = match[1] && isNaN(Number(match[1])) ? match[1] : undefined;
          operands.push({
            type: "indexed",
            value: trimmedPart,
            displacement: displacement,
            baseRegister: `R${match[2]}`,
            indexRegister: `R${match[3]}`,
            ...(symbol && { value: symbol }), // シンボルがある場合はvalueを上書き
          });
        }
      }
      // 即値（数値リテラル: 10進数、16進数）
      else if (/^-?\d+$|^[0-9A-F]+H$/i.test(trimmedPart)) {
        operands.push({
          type: "immediate",
          value: trimmedPart,
        });
      }
      // リテラル（=F'...', =C'...', =X'...'など）
      else if (/^=/.test(trimmedPart)) {
        operands.push({
          type: "immediate",
          value: trimmedPart,
        });
      }
      // メモリ参照（シンボル、ラベルなど）
      else {
        operands.push({
          type: "memory",
          value: trimmedPart,
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
   * DC命令のオペランドからデータ型を解析
   * 例: "F'100'" -> { dataType: "F", length: 4, parsedValue: 100 }
   * 例: "CL10'HELLO'" -> { dataType: "CL10", length: 10, parsedValue: "HELLO" }
   */
  private parseDCType(operandsText: string): { dataType: string; length?: number; parsedValue?: number | string } {
    const trimmed = operandsText.trim();
    
    // データ型パターンをマッチング
    // F'100' -> F, 100
    const fPattern = /^F'(-?\d+)'$/i;
    // H'100' -> H, 100
    const hPattern = /^H'(-?\d+)'$/i;
    // X'FF' -> X, FF
    const xPattern = /^X'([0-9A-F]+)'$/i;
    // C'HELLO' -> C, HELLO
    const cPattern = /^C'(.*)'$/i;
    // CL10'HELLO' -> CL10, HELLO
    const clPattern = /^CL(\d+)'(.*)'$/i;
    // D'123.45' -> D, 123.45
    const dPattern = /^D'([0-9.+-]+)'$/i;
    // A(label) -> A, label
    const aPattern = /^A\(([A-Z0-9_]+)\)$/i;
    // S(label) -> S, label
    const sPattern = /^S\(([A-Z0-9_]+)\)$/i;
    // Y(label) -> Y, label
    const yPattern = /^Y\(([A-Z0-9_]+)\)$/i;
    // V(label) -> V, label
    const vPattern = /^V\(([A-Z0-9_]+)\)$/i;
    // P'123.45' -> P, 123.45
    const pPattern = /^P'([0-9.+-]+)'$/i;
    // Z'123' -> Z, 123
    const zPattern = /^Z(\d+)'([0-9]+)'$/i;
    // E'1.23E+10' -> E, 1.23E+10
    const ePattern = /^E'([0-9.E+-]+)'$/i;
    
    let match: RegExpMatchArray | null;
    
    if ((match = trimmed.match(fPattern))) {
      return { dataType: "F", length: 4, parsedValue: parseInt(match[1], 10) };
    } else if ((match = trimmed.match(hPattern))) {
      return { dataType: "H", length: 2, parsedValue: parseInt(match[1], 10) };
    } else if ((match = trimmed.match(xPattern))) {
      return { dataType: "X", length: Math.ceil(match[1].length / 2), parsedValue: parseInt(match[1], 16) };
    } else if ((match = trimmed.match(clPattern))) {
      return { dataType: `CL${match[1]}`, length: parseInt(match[1], 10), parsedValue: match[2] };
    } else if ((match = trimmed.match(cPattern))) {
      return { dataType: "C", length: match[1].length, parsedValue: match[1] };
    } else if ((match = trimmed.match(dPattern))) {
      return { dataType: "D", length: 8, parsedValue: match[1] };
    } else if ((match = trimmed.match(aPattern))) {
      return { dataType: "A", length: 4, parsedValue: match[1] };
    } else if ((match = trimmed.match(sPattern))) {
      return { dataType: "S", length: 4, parsedValue: match[1] };
    } else if ((match = trimmed.match(yPattern))) {
      return { dataType: "Y", length: 2, parsedValue: match[1] };
    } else if ((match = trimmed.match(vPattern))) {
      return { dataType: "V", length: 4, parsedValue: match[1] };
    } else if ((match = trimmed.match(pPattern))) {
      return { dataType: "P", length: 8, parsedValue: match[1] };
    } else if ((match = trimmed.match(zPattern))) {
      return { dataType: `Z${match[1]}`, length: parseInt(match[1], 10), parsedValue: parseInt(match[2], 10) };
    } else if ((match = trimmed.match(ePattern))) {
      return { dataType: "E", length: 4, parsedValue: match[1] };
    }
    
    // パターンに一致しない場合、デフォルト値を返す
    return { dataType: trimmed };
  }

  /**
   * DS命令のオペランドからデータ型を解析
   * 例: "18F" -> { dataType: "F", length: 72 }
   * 例: "CL80" -> { dataType: "CL80", length: 80 }
   */
  private parseDSType(operandsText: string): { dataType: string; length?: number } {
    const trimmed = operandsText.trim();
    
    // データ型パターンをマッチング
    // 18F -> 18, F
    const repeatPattern = /^(\d+)([A-Z][A-Z0-9]*)$/i;
    // F -> F
    const singlePattern = /^([A-Z][A-Z0-9]*)$/i;
    // CL80 -> CL80
    const clPattern = /^CL(\d+)$/i;
    
    let match: RegExpMatchArray | null;
    
    if ((match = trimmed.match(repeatPattern))) {
      const count = parseInt(match[1], 10);
      const type = match[2].toUpperCase();
      const typeLength = this.getDataTypeLength(type);
      return { dataType: type, length: count * (typeLength || 0) };
    } else if ((match = trimmed.match(clPattern))) {
      return { dataType: `CL${match[1]}`, length: parseInt(match[1], 10) };
    } else if ((match = trimmed.match(singlePattern))) {
      const type = match[1].toUpperCase();
      const typeLength = this.getDataTypeLength(type);
      return { dataType: type, length: typeLength };
    }
    
    return { dataType: trimmed };
  }

  /**
   * データ型のバイト長を取得
   */
  private getDataTypeLength(type: string): number | undefined {
    const typeMap: Record<string, number> = {
      F: 4,    // Fullword
      H: 2,    // Halfword
      D: 8,    // Doubleword
      A: 4,    // Address
      S: 4,    // Address (short)
      Y: 2,    // Address (short)
      V: 4,    // Address (variable)
      X: 1,    // Hexadecimal (default 1 byte)
      C: 1,    // Character (default 1 byte)
      P: 8,    // Packed decimal
      Z: 1,    // Zoned decimal (default 1 byte)
      E: 4,    // Floating point (single precision)
    };
    
    // CL10形式の場合
    if (/^CL\d+$/i.test(type)) {
      const match = type.match(/^CL(\d+)$/i);
      return match ? parseInt(match[1], 10) : undefined;
    }
    
    return typeMap[type.toUpperCase()];
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