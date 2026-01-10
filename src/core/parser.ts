import type { AsmStatement, AssemblyResult, ParseContext, ParseError } from "./types";
import { parseLine } from "./lineParser";
import { TokenType } from "./types";
import { FileManager } from "./fileManager";
import { OPCODE_DATABASE } from "./opcode";

/**
 * アセンブリソース全体を解析
 * 将来の拡張を考慮した構造化されたパーサー
 * COPY文とMACRO/ENDMに対応
 */
export class AssemblyParser {
  private context: ParseContext;
  private fileManager: FileManager;
  private inMacroDefinition: { name: string; startLine: number; body: string[]; parameters: string[]; sourceFile?: string } | null = null;
  private copyStack: Set<string> = new Set(); // COPY文の循環参照チェック用
  private maxCopyDepth: number = 10; // 最大COPY深度
  private currentCopyDepth: number = 0; // 現在のCOPY深度
  private maxStatements: number = 100000; // 最大ステートメント数（無限ループ防止）

  constructor(fileManager?: FileManager) {
    this.context = {
      symbols: new Map(),
      macros: new Map(),
    };
    this.fileManager = fileManager || new FileManager();
    
    // 外部ファイルからマクロ定義を自動的に読み込む
    this.loadMacrosFromFiles();
  }

  /**
   * fileManagerに登録されているファイルからマクロ定義を自動的に読み込む
   */
  private loadMacrosFromFiles(): void {
    const allFiles = this.fileManager.getAllFiles();
    console.log(`loadMacrosFromFiles: ${allFiles.length}個のファイルを確認`);
    for (const file of allFiles) {
      // .MACや.MACLIBファイルのみをパース（他のファイルはCOPY文で読み込まれる）
      const fileNameUpper = file.name.toUpperCase();
      if (fileNameUpper.endsWith('.MAC') || fileNameUpper.endsWith('.MACLIB')) {
        try {
          // ファイル内容をパースしてマクロ定義を抽出
          const lines = file.content.split('\n');
          console.log(`マクロ定義ファイルを読み込み中: ${file.name} (${lines.length}行)`);
          this.parseMacroDefinitions(lines, file.name);
        } catch (error) {
          console.warn(`ファイル "${file.name}" からのマクロ定義読み込みに失敗しました:`, error);
        }
      }
    }
    console.log(`loadMacrosFromFiles完了: 登録済みマクロ数 = ${this.context.macros?.size || 0}, マクロ名 = [${Array.from(this.context.macros?.keys() || []).join(', ')}]`);
  }

  /**
   * ファイル内容からマクロ定義を抽出
   */
  private parseMacroDefinitions(lines: string[], sourceFile: string): void {
    let inMacroDefinition = false;
    let macroName = '';
    let macroStartLine = 0;
    let macroBody: string[] = [];
    let macroParameters: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const stmt = parseLine(line, i + 1);

      // デバッグ: マクロ定義の可能性がある行をチェック
      if (line.trim().length > 0 && !line.trim().startsWith('*')) {
        const trimmed = line.trim().toUpperCase();
        if (trimmed.includes('MACRO') && (trimmed.includes('LOADCONST') || trimmed.includes('RESTOREREGS'))) {
          console.log(`parseMacroDefinitions [${sourceFile}:${i+1}]: "${line.substring(0, 60)}" -> label="${stmt.label}", opcode="${stmt.opcode}", operands="${stmt.operandsText}"`);
        }
      }

      if (stmt.opcode && stmt.opcode.toUpperCase() === 'MACRO') {
        // MACRO命令の場合、ラベルが8文字を超える可能性があるため、元の行から直接マクロ名を抽出
        // 例: "RESTOREREGS MACRO" または "LOADCONST MACRO &REG,&VALUE"
        const trimmedLine = line.trim();
        const firstSpaceIndex = trimmedLine.indexOf(' ');
        if (firstSpaceIndex > 0) {
          // 最初の空白までの部分がマクロ名
          macroName = trimmedLine.substring(0, firstSpaceIndex).toUpperCase();
          macroStartLine = i + 1;
          
          // MACROの後の部分からパラメータを抽出
          const afterMacro = trimmedLine.substring(firstSpaceIndex + 1).trim();
          if (afterMacro.toUpperCase().startsWith('MACRO')) {
            const macroParams = afterMacro.substring(5).trim(); // "MACRO"をスキップ
            macroParameters = macroParams
              ? macroParams.split(/\s*,\s*/).map(p => p.trim().replace(/^&/, '')).filter(p => p.length > 0)
              : [];
          } else {
            macroParameters = [];
          }
          
          macroBody = [];
          inMacroDefinition = true;
          console.log(`外部ファイルからマクロ定義検出: ${macroName} in ${sourceFile} (パラメータ: [${macroParameters.join(', ')}], 元の行: "${line.substring(0, 60)}")`);
        } else if (stmt.label) {
          // フォールバック: parseLineの結果を使用
          macroName = stmt.label.toUpperCase();
          macroStartLine = i + 1;
          macroParameters = stmt.operandsText
            ? stmt.operandsText.split(/\s*,\s*/).map(p => p.trim().replace(/^&/, '')).filter(p => p.length > 0)
            : [];
          macroBody = [];
          inMacroDefinition = true;
          console.log(`外部ファイルからマクロ定義検出: ${macroName} in ${sourceFile} (パラメータ: [${macroParameters.join(', ')}], parseLine結果を使用)`);
        } else {
          console.warn(`parseMacroDefinitions [${sourceFile}:${i+1}]: MACRO命令が見つかりましたが、ラベルがありません: "${line.substring(0, 60)}"`);
        }
      } else if (stmt.opcode && stmt.opcode.toUpperCase() === 'ENDM' && inMacroDefinition) {
        // マクロ定義を保存（既存の定義がある場合は上書きしない）
        if (!this.context.macros) {
          this.context.macros = new Map();
        }
        // 既存のマクロ定義がある場合は上書きしない（COPY文で読み込まれた定義を優先）
        if (!this.context.macros.has(macroName)) {
          this.context.macros.set(macroName, {
            name: macroName,
            parameters: macroParameters,
            body: [], // 本体は必要に応じて後で解析
            bodyLines: macroBody,
            definedAt: macroStartLine,
            sourceFile: sourceFile,
          });
          console.log(`外部ファイルからマクロ定義完了: ${macroName} in ${sourceFile} (本体行数: ${macroBody.length})`);
        } else {
          console.log(`マクロ定義 "${macroName}" は既に存在するため、スキップしました (既存の定義を優先)`);
        }
        inMacroDefinition = false;
        macroName = '';
        macroBody = [];
        macroParameters = [];
      } else if (inMacroDefinition) {
        macroBody.push(line);
      }
    }

    // ファイルの最後までマクロ定義が終了していない場合の警告
    if (inMacroDefinition) {
      console.warn(`ファイル "${sourceFile}" でマクロ定義 "${macroName}" がENDMで終了していません`);
    }
  }

  /**
   * ソースコード全体を解析（COPY文とMACRO/ENDMに対応）
   */
  parse(source: string, baseLineNumber: number = 1): AssemblyResult {
    // 外部ファイルからマクロ定義を読み込む（parse実行時に最新の状態を反映）
    this.loadMacrosFromFiles();
    
    // 循環参照チェック用のスタックをリセット
    this.copyStack.clear();
    this.currentCopyDepth = 0;
    
    const lines = source.split("\n");
    const statements: AsmStatement[] = [];
    const errors: ParseError[] = [];
    
    // ステートメント数の上限チェック（無限ループ防止）
    let statementCount = 0;
    
    // 継続行を結合（元の行番号を保持）
    interface ProcessedLine {
      content: string;
      originalLineNumber: number; // 元のソースコードでの行番号（1始まり）
      sourceFile?: string; // ソースファイル名（COPY展開用）
      expandedFrom?: string; // マクロ展開元のマクロ名
    }
    
    const processedLines: ProcessedLine[] = [];
    let continuationBuffer: { content: string; startLineNumber: number } | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const originalLineNumber = baseLineNumber + i; // ベース行番号を考慮
      
      // 継続行のチェック: カラム72（インデックス71）に非空白文字がある場合
      const isContinuation = line.length > 71 && 
        line[71] !== " " && 
        line[71] !== "\t" && 
        line[71] !== "" &&
        line[71] !== undefined;
      
      if (continuationBuffer) {
        if (isContinuation) {
          // 継続行を結合: カラム73以降の内容を結合
          const continuationContent = line.length > 72 ? line.substring(72).trim() : "";
          continuationBuffer.content += continuationContent;
        } else {
          // 継続終了: バッファを確定して現在の行を処理
          processedLines.push({
            content: continuationBuffer.content,
            originalLineNumber: continuationBuffer.startLineNumber,
          });
          continuationBuffer = null;
          processedLines.push({
            content: line,
            originalLineNumber,
          });
        }
      } else {
        if (isContinuation) {
          // 継続開始: カラム1-71の内容とカラム73以降を結合
          const mainContent = line.substring(0, 72).trimEnd();
          const continuationContent = line.length > 72 ? line.substring(72).trim() : "";
          continuationBuffer = {
            content: mainContent + " " + continuationContent,
            startLineNumber: originalLineNumber,
          };
        } else {
          processedLines.push({
            content: line,
            originalLineNumber,
          });
        }
      }
    }
    
    // 最後に継続バッファが残っている場合
    if (continuationBuffer) {
      processedLines.push({
        content: continuationBuffer.content,
        originalLineNumber: continuationBuffer.startLineNumber,
      });
    }

    // 各行を解析（COPY文とMACRO/ENDMの処理を含む）
    let currentLineIndex = 0;
    while (currentLineIndex < processedLines.length) {
      // ステートメント数の上限チェック
      if (statementCount >= this.maxStatements) {
        errors.push({
          lineNumber: processedLines[Math.min(currentLineIndex, processedLines.length - 1)].originalLineNumber,
          column: 0,
          message: `ステートメント数が上限（${this.maxStatements}）を超えました。無限ループの可能性があります。`,
          severity: "error",
        });
        break;
      }

      const processedLine = processedLines[currentLineIndex];
      currentLineIndex++;

      try {
        const statement = parseLine(processedLine.content, processedLine.originalLineNumber);
        statementCount++;
        
        // 外部ファイルからの読み込み情報を設定
        if (processedLine.sourceFile) {
          statement.sourceFile = processedLine.sourceFile;
        }
        
        // COPY文の処理
        if (statement.opcode && statement.opcode.toUpperCase() === "COPY") {
          const copyResult = this.processCopyStatement(statement, processedLine.originalLineNumber);
          if (copyResult.insertedLines > 0) {
            // COPYで挿入された行を現在の位置に挿入
            const insertIndex = currentLineIndex;
            for (let j = 0; j < copyResult.lines.length; j++) {
              processedLines.splice(insertIndex + j, 0, {
                content: copyResult.lines[j],
                originalLineNumber: processedLine.originalLineNumber + j + 1, // COPY文の次の行から
                sourceFile: copyResult.fileName,
              });
            }
            currentLineIndex += copyResult.insertedLines;
            statementCount += copyResult.insertedLines; // 挿入された行数もカウント
          }
          if (copyResult.error) {
            errors.push(copyResult.error);
          }
          continue; // COPY文自体は出力しない
        }

        // MACRO命令の処理
        if (statement.opcode && statement.opcode.toUpperCase() === "MACRO") {
          console.log(`MACRO命令検出: ${statement.label || "unknown"} at line ${processedLine.originalLineNumber} (sourceFile: ${processedLine.sourceFile || "main"})`);
          this.startMacroDefinition(statement, processedLine.originalLineNumber, processedLine.sourceFile);
          continue; // MACRO命令自体は出力しない
        }

        // ENDM命令の処理
        if (statement.opcode && statement.opcode.toUpperCase() === "ENDM") {
          if (this.inMacroDefinition) {
            console.log(`ENDM命令検出: マクロ "${this.inMacroDefinition.name}" を完了 at line ${processedLine.originalLineNumber}`);
            this.endMacroDefinition();
          } else {
            errors.push({
              lineNumber: processedLine.originalLineNumber,
              column: 0,
              message: "対応するMACRO命令が見つかりません",
              severity: "error",
            });
          }
          continue; // ENDM命令自体は出力しない
        }

        // マクロ定義中の場合、マクロ本体に追加
        if (this.inMacroDefinition) {
          this.inMacroDefinition.body.push(processedLine.content);
          continue;
        }

        // 通常のステートメントの処理
        // 外部ファイル情報を設定
        if (processedLine.sourceFile) {
          statement.sourceFile = processedLine.sourceFile;
        }
        if (processedLine.expandedFrom) {
          statement.isExpanded = true;
          statement.expandedFrom = processedLine.expandedFrom;
        }
        
        // ラベルがあればシンボルテーブルに追加
        if (statement.label) {
          this.context.symbols.set(statement.label, {
            name: statement.label,
            value: processedLine.originalLineNumber,
            type: "label",
            definedAt: processedLine.originalLineNumber,
          });
        }

        // オペコード情報の補完とマクロ呼び出しの検出
        // 1. まずオペコードデータベースで検索
        // 2. 見つからなければマクロ定義を検索
        this.enrichStatement(statement, processedLine.originalLineNumber, errors);
        
        statements.push(statement);
      } catch (error) {
        errors.push({
          lineNumber: processedLine.originalLineNumber,
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
   * COPY文を処理してファイルを読み込む
   */
  private processCopyStatement(statement: AsmStatement, lineNumber: number): {
    lines: string[];
    insertedLines: number;
    fileName?: string;
    error?: ParseError;
  } {
    if (!statement.operandsText) {
      return {
        lines: [],
        insertedLines: 0,
        error: {
          lineNumber,
          column: 0,
          message: "COPY命令にファイル名が指定されていません",
          severity: "error",
        },
      };
    }

    // オペランドからファイル名を抽出（カンマや空白で区切られる可能性がある）
    const fileName = statement.operandsText.split(/\s*,\s*/)[0].trim();
    const normalizedFileName = fileName.toUpperCase();

    // 循環参照チェック
    if (this.copyStack.has(normalizedFileName)) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: 循環参照が検出されました。ファイル "${fileName}" は既に読み込み中です。`,
          severity: "error",
        },
      };
    }

    // 最大深度チェック
    if (this.currentCopyDepth >= this.maxCopyDepth) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: 最大深度（${this.maxCopyDepth}）を超えました。ファイル "${fileName}" の読み込みをスキップします。`,
          severity: "error",
        },
      };
    }

    const file = this.fileManager.findFile(fileName);

    if (!file) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: ファイル "${fileName}" が見つかりません`,
          severity: "warning",
        },
      };
    }

    // 循環参照チェック用にスタックに追加
    this.copyStack.add(normalizedFileName);
    this.currentCopyDepth++;

    try {
      // ファイルの内容を行ごとに返す
      // 注: COPYで読み込まれたファイル内のCOPY文は後続のパスで処理される
      const lines = file.content.split("\n");
      return {
        lines,
        insertedLines: lines.length,
        fileName: file.name,
      };
    } finally {
      // スタックから削除（エラーが発生しても確実に削除する）
      this.copyStack.delete(normalizedFileName);
      this.currentCopyDepth--;
    }
  }

  /**
   * MACRO定義の開始
   */
  private startMacroDefinition(statement: AsmStatement, lineNumber: number, sourceFile?: string): void {
    if (!statement.label) {
      console.warn(`MACRO命令: ラベル（マクロ名）が見つかりません at line ${lineNumber}`);
      return; // マクロ名が必要
    }

    // パラメータを取得（MACRO命令のオペランドから）
    const parameters: string[] = [];
    if (statement.operandsText) {
      // パラメータをカンマまたは空白で分割（&記号を除去）
      const params = statement.operandsText
        .split(/\s*,\s*/)
        .map(p => p.trim().replace(/^&/, "")); // &記号を除去
      parameters.push(...params.filter(p => p.length > 0));
    }

    const macroName = statement.label.toUpperCase();
    console.log(`MACRO定義開始: ${macroName} (パラメータ: [${parameters.join(", ")}]) at line ${lineNumber} from ${sourceFile || "main"}`);

    this.inMacroDefinition = {
      name: macroName,
      startLine: lineNumber,
      body: [],
      parameters: parameters, // パラメータを保存
      sourceFile: sourceFile,
    };
  }

  /**
   * MACRO定義の終了
   */
  private endMacroDefinition(): void {
    if (!this.inMacroDefinition) {
      return;
    }

    const macroName = this.inMacroDefinition.name;
    const macroBody = this.inMacroDefinition.body;
    const parameters = this.inMacroDefinition.parameters;

    // マクロ本体を解析してステートメントに変換
    const bodyStatements: AsmStatement[] = [];
    const bodyLines: string[] = []; // 元の行テキストを保持（パラメータ置換用）
    for (let i = 0; i < macroBody.length; i++) {
      try {
        const stmt = parseLine(macroBody[i], this.inMacroDefinition.startLine + i + 1);
        bodyStatements.push(stmt);
        bodyLines.push(macroBody[i]); // 元の行テキストを保持
      } catch (error) {
        // エラーは無視（マクロ本体の解析は後で行う）
        bodyLines.push(macroBody[i]); // エラーでも元の行は保持
      }
    }

    // マクロ定義を保存
    if (!this.context.macros) {
      this.context.macros = new Map();
    }
    
    // COPY文で読み込まれたマクロ定義は、loadMacrosFromFilesで読み込まれた定義を上書きする
    const existingMacro = this.context.macros.get(macroName);
    this.context.macros.set(macroName, {
      name: macroName,
      parameters,
      body: bodyStatements,
      bodyLines: bodyLines, // 元の行テキストを保存
      definedAt: this.inMacroDefinition.startLine,
      sourceFile: this.inMacroDefinition.sourceFile, // マクロ定義が定義されたファイル
    });

    if (existingMacro) {
      console.log(`マクロ定義更新: ${macroName} (COPY文で読み込まれた定義で上書き, パラメータ: [${parameters.join(", ")}], 本体行数: ${bodyLines.length}, sourceFile: ${this.inMacroDefinition.sourceFile || "main"})`);
      console.log(`  既存の定義: sourceFile=${existingMacro.sourceFile || "unknown"}, definedAt=${existingMacro.definedAt}`);
    } else {
      console.log(`マクロ定義完了: ${macroName} (パラメータ: [${parameters.join(", ")}], 本体行数: ${bodyLines.length}, sourceFile: ${this.inMacroDefinition.sourceFile || "main"})`);
    }
    if (bodyLines.length > 0) {
      console.log(`  マクロ本体の最初の行: "${bodyLines[0].substring(0, 50)}"`);
    }

    this.inMacroDefinition = null;
  }

  /**
   * マクロ呼び出しを展開
   */
  private expandMacro(statement: AsmStatement, lineNumber: number): {
    lines: string[];
    error?: ParseError;
  } {
    if (!statement.opcode || !this.context.macros) {
      return { lines: [] };
    }

    const macroName = statement.opcode.toUpperCase();
    const macroDef = this.context.macros.get(macroName);

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
      const params = statement.operandsText.split(/\s*,\s*/).map(p => p.trim());
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
    // bodyLinesが存在する場合はそれを使用、ない場合はbodyからrawTextを取得
    const bodyLines = macroDef.bodyLines || macroDef.body.map(stmt => stmt.rawText);
    const expandedLines: string[] = [];
    
    for (const bodyLine of bodyLines) {
      let expandedLine = bodyLine;
      
      // パラメータ置換（&PARAM形式）
      for (const [formal, actual] of paramMap.entries()) {
        // &PARAM の形式で置換（単語境界を考慮）
        const regex = new RegExp(`&${formal}\\b`, "gi");
        expandedLine = expandedLine.replace(regex, actual);
      }
      
      expandedLines.push(expandedLine);
    }

    console.log(`マクロ展開: ${macroName} -> ${expandedLines.length}行 (パラメータマップ: ${Array.from(paramMap.entries()).map(([k, v]) => `${k}=${v}`).join(", ")})`);
    if (expandedLines.length > 0) {
      console.log(`  展開後の最初の行: "${expandedLines[0].substring(0, 50)}"`);
    }

    return { lines: expandedLines };
  }

  /**
   * ステートメント情報を補完
   * 1. オペコードを索引（OPCODE_DATABASE）で検索
   * 2. 見つかった場合、命令情報を設定
   * 3. 見つからない場合、マクロ定義を検索
   * 4. マクロが見つかった場合、マクロ呼び出しとしてマーク
   */
  private enrichStatement(statement: AsmStatement, lineNumber: number, errors: ParseError[]): void {
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

    // 1. まずオペコードデータベースで検索
    const opcodeUpper = statement.opcode.toUpperCase();
    const opcodeInfo = OPCODE_DATABASE.get(opcodeUpper);
    
    if (opcodeInfo) {
      // オペコードが見つかった場合、命令情報を設定（既存の実装を維持）
      // 既存のinstructionが存在する場合は上書きしない（オペランド解析結果を保持）
      if (!statement.instruction) {
        statement.instruction = {
          mnemonic: opcodeInfo.mnemonic,
          format: opcodeInfo.format,
          description: opcodeInfo.description,
          // operandsは既存の実装（analyser.ts）で設定されるため、ここでは設定しない
        };
      } else {
        // 既存のinstructionがある場合、不足している情報のみ追加
        if (!statement.instruction.mnemonic) {
          statement.instruction.mnemonic = opcodeInfo.mnemonic;
        }
        if (!statement.instruction.format) {
          statement.instruction.format = opcodeInfo.format;
        }
        if (!statement.instruction.description) {
          statement.instruction.description = opcodeInfo.description;
        }
      }
      return; // オペコードが見つかったので、マクロ検出は不要
    }

    // 2. オペコードが見つからない場合、マクロ定義を検索
    if (this.context.macros) {
      const hasMacro = this.context.macros.has(opcodeUpper);
      if (hasMacro) {
        const macroDef = this.context.macros.get(opcodeUpper);
        console.log(`マクロ呼び出し検出: ${opcodeUpper} at line ${lineNumber} (オペランド: "${statement.operandsText || ""}", sourceFile: ${macroDef?.sourceFile || "unknown"})`);
        // マクロ呼び出しとしてマーク（展開は行わない）
        statement.isMacroCall = true;
        statement.macroName = opcodeUpper;
        
        // 展開エラーチェックのみ実行（展開自体は行わない）
        const expandedResult = this.expandMacro(statement, lineNumber);
        if (expandedResult.error) {
          errors.push(expandedResult.error);
        }
      } else {
        // デバッグ用: マクロが見つからない場合のログ
        if (opcodeUpper === 'LOADCONST' || opcodeUpper === 'STOREREG' || opcodeUpper === 'SAVEREGS' || opcodeUpper === 'RESTOREREGS') {
          console.log(`マクロ未検出: ${opcodeUpper} at line ${lineNumber}`);
          console.log(`  登録済みマクロ数: ${this.context.macros.size}`);
          console.log(`  登録済みマクロ名: [${Array.from(this.context.macros.keys()).join(', ')}]`);
          if (this.context.macros.size > 0) {
            // 最初の3つのマクロ定義の詳細を表示
            let count = 0;
            for (const [name, def] of this.context.macros.entries()) {
              if (count >= 3) break;
              console.log(`    - ${name}: sourceFile=${def.sourceFile || "unknown"}, definedAt=${def.definedAt}, parameters=[${def.parameters.join(', ')}]`);
              count++;
            }
          }
        }
      }
    } else {
      console.warn(`enrichStatement: this.context.macros is null or undefined at line ${lineNumber}`);
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
export function parse(source: string, fileManager?: FileManager): AssemblyResult {
  const parser = new AssemblyParser(fileManager);
  return parser.parse(source);
}