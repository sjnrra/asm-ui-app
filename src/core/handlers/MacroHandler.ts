/**
 * マクロ処理モジュール
 * MACRO/ENDMの定義と展開を処理する
 */

import type { AsmStatement, MacroDefinition, ParseError, ParseContext } from "../Types";
import { parseLine } from "../LineParser";

/**
 * マクロ定義の状態
 */
export interface MacroDefinitionState {
  name: string;
  startLine: number;
  body: string[];
  parameters: string[];
  sourceFile?: string;
}

/**
 * マクロ定義を抽出
 * 
 * @param lines ソースコードの行配列
 * @param sourceFile ソースファイル名
 * @param context パースコンテキスト（マクロ定義を追加する）
 */
export function parseMacroDefinitions(
  lines: string[],
  sourceFile: string,
  context: ParseContext
): void {
  let inMacroDefinition = false;
  let macroName = "";
  let macroStartLine = 0;
  let macroBody: string[] = [];
  let macroParameters: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stmt = parseLine(line, i + 1);

    if (stmt.opcode && stmt.opcode.toUpperCase() === "MACRO") {
      // MACRO命令の場合、ラベルが8文字を超える可能性があるため、元の行から直接マクロ名を抽出
      const trimmedLine = line.trim();
      const firstSpaceIndex = trimmedLine.indexOf(" ");
      if (firstSpaceIndex > 0) {
        macroName = trimmedLine.substring(0, firstSpaceIndex).toUpperCase();
        macroStartLine = i + 1;

        // MACROの後の部分からパラメータを抽出
        const afterMacro = trimmedLine.substring(firstSpaceIndex + 1).trim();
        if (afterMacro.toUpperCase().startsWith("MACRO")) {
          const macroParams = afterMacro.substring(5).trim();
          macroParameters = macroParams
            ? macroParams
                .split(/\s*,\s*/)
                .map((p) => p.trim().replace(/^&/, ""))
                .filter((p) => p.length > 0)
            : [];
        } else {
          macroParameters = [];
        }

        macroBody = [];
        inMacroDefinition = true;
      }
    } else if (stmt.opcode && stmt.opcode.toUpperCase() === "ENDM") {
      if (inMacroDefinition) {
        // マクロ本体を解析してステートメントに変換
        const bodyStatements: AsmStatement[] = [];
        const bodyLines: string[] = []; // 元の行テキストを保持（パラメータ置換用）
        for (let j = 0; j < macroBody.length; j++) {
          try {
            const stmt = parseLine(macroBody[j], macroStartLine + j + 1);
            bodyStatements.push(stmt);
            bodyLines.push(macroBody[j]); // 元の行テキストを保持
          } catch (error) {
            // エラーは無視（マクロ本体の解析は後で行う）
            bodyLines.push(macroBody[j]); // エラーでも元の行は保持
          }
        }

        // マクロ定義を登録
        const macroDef: MacroDefinition = {
          name: macroName,
          parameters: macroParameters,
          body: bodyStatements,
          bodyLines: bodyLines, // 元の行テキストを保存
          definedAt: macroStartLine,
          sourceFile,
        };

        if (!context.macros) {
          context.macros = new Map();
        }
        context.macros.set(macroName, macroDef);

        inMacroDefinition = false;
        macroName = "";
        macroBody = [];
        macroParameters = [];
      }
    } else if (inMacroDefinition) {
      // マクロ定義中の場合、マクロ本体に追加
      macroBody.push(line);
    }
  }
}

/**
 * マクロ定義を開始
 * 
 * @param statement MACRO命令のステートメント
 * @param lineNumber 行番号
 * @param sourceFile ソースファイル名
 * @returns マクロ定義の状態
 */
export function startMacroDefinition(
  statement: AsmStatement,
  lineNumber: number,
  sourceFile?: string
): MacroDefinitionState {
  const macroName = statement.label || "UNKNOWN";
  return {
    name: macroName.toUpperCase(),
    startLine: lineNumber,
    body: [],
    parameters: statement.operandsText
      ? statement.operandsText
          .split(/\s*,\s*/)
          .map((p) => p.trim().replace(/^&/, ""))
          .filter((p) => p.length > 0)
      : [],
    sourceFile,
  };
}

/**
 * マクロ定義を終了して登録
 * 
 * @param macroState マクロ定義の状態
 * @param context パースコンテキスト
 * @returns 登録されたマクロ定義
 */
export function endMacroDefinition(
  macroState: MacroDefinitionState,
  context: ParseContext
): MacroDefinition {
  // マクロ本体を解析してステートメントに変換
  const bodyStatements: AsmStatement[] = [];
  const bodyLines: string[] = []; // 元の行テキストを保持（パラメータ置換用）
  for (let i = 0; i < macroState.body.length; i++) {
    try {
      const stmt = parseLine(macroState.body[i], macroState.startLine + i + 1);
      bodyStatements.push(stmt);
      bodyLines.push(macroState.body[i]); // 元の行テキストを保持
    } catch (error) {
      // エラーは無視（マクロ本体の解析は後で行う）
      bodyLines.push(macroState.body[i]); // エラーでも元の行は保持
    }
  }

  const macroDef: MacroDefinition = {
    name: macroState.name,
    parameters: macroState.parameters,
    body: bodyStatements,
    bodyLines: bodyLines, // 元の行テキストを保存
    definedAt: macroState.startLine,
    sourceFile: macroState.sourceFile,
  };

  if (!context.macros) {
    context.macros = new Map();
  }
  context.macros.set(macroState.name, macroDef);

  return macroDef;
}

/**
 * マクロ呼び出しを展開
 * 
 * @param statement マクロ呼び出しのステートメント
 * @param lineNumber 行番号
 * @param context パースコンテキスト
 * @returns 展開された行の配列とエラー（あれば）
 */
export function expandMacro(
  statement: AsmStatement,
  lineNumber: number,
  context: ParseContext
): {
  lines: string[];
  error?: ParseError;
} {
  if (!statement.opcode || !context.macros) {
    return { lines: [] };
  }

  const macroName = statement.opcode.toUpperCase();
  const macroDef = context.macros.get(macroName);

  if (!macroDef) {
    return {
      lines: [],
      error: {
        lineNumber,
        column: 0,
        message: `マクロ "${macroName}" が定義されていません`,
        severity: "error",
      },
    };
  }

  // マクロパラメータを取得
  const actualParams: string[] = [];
  if (statement.operandsText) {
    const params = statement.operandsText.split(/\s*,\s*/).map((p) => p.trim());
    actualParams.push(...params);
  }

  // パラメータマッピングを作成
  const paramMap = new Map<string, string>();
  for (let i = 0; i < macroDef.parameters.length; i++) {
    const formalParam = macroDef.parameters[i];
    const actualParam = i < actualParams.length ? actualParams[i] : "";
    paramMap.set(formalParam.toUpperCase(), actualParam);
  }

  // マクロ本体を展開（パラメータ置換）
  const bodyLines = macroDef.bodyLines || macroDef.body.map((stmt) => stmt.rawText);
  const expandedLines: string[] = [];

  for (const bodyLine of bodyLines) {
    let expandedLine = bodyLine;

    // パラメータ置換（&PARAM形式）
    for (const [formal, actual] of paramMap.entries()) {
      const regex = new RegExp(`&${formal}\\b`, "gi");
      expandedLine = expandedLine.replace(regex, actual);
    }

    expandedLines.push(expandedLine);
  }

  return { lines: expandedLines };
}
