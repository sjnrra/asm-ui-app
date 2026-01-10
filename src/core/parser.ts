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
      isContinuation?: boolean; // この行が継続行かどうか
      continuationLines?: number[]; // 継続行の行番号リスト（最初の行を含む）
      continuationOperands?: string[]; // 継続行のオペランド部分（最初の行のオペランド + 継続行の内容）
      continuationRawLines?: string[]; // 継続行の元の行の内容（完全な行）
    }
    
    const processedLines: ProcessedLine[] = [];
    let continuationBuffer: { 
      firstLine: string; // 最初の行の内容（カラム1-71）
      firstLineNumber: number; // 最初の行の行番号
      continuationLines: number[]; // 継続行の行番号リスト
      continuationOperands: string[]; // 継続行のオペランド部分（カラム1-71の内容）
      continuationRawLines: string[]; // 継続行の元の行の内容（完全な行）
    } | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const originalLineNumber = baseLineNumber + i; // ベース行番号を考慮
      
      // 継続行のチェック:
      // 1. 継続行開始: 現在の行の72桁目に文字があり、前の行の72桁目に文字がない場合
      // 2. 継続行: 前の行の72桁目に文字がある場合、この行は継続行
      const currentLineHasContinuation = line.length > 71 && 
        line[71] !== " " && 
        line[71] !== "\t" && 
        line[71] !== "" &&
        line[71] !== undefined;
      
      const prevLine = i > 0 ? lines[i - 1] : null;
      const prevLineHasContinuation = prevLine && prevLine.length > 71 && 
        prevLine[71] !== " " && 
        prevLine[71] !== "\t" && 
        prevLine[71] !== "" &&
        prevLine[71] !== undefined;
      
      // 継続行開始: 現在の行の72桁目に文字があり、前の行の72桁目に文字がない場合
      const isContinuationStart = currentLineHasContinuation && !prevLineHasContinuation;
      
      // 継続行: 前の行の72桁目に文字がある場合、この行は継続行
      const isContinuation = prevLineHasContinuation;
      
      if (continuationBuffer) {
        if (isContinuation) {
          // 継続行を結合: カラム1-71の内容（オペランドの続き）を結合
          const continuationContent = line.substring(0, 72).trimEnd();
          continuationBuffer.continuationOperands.push(continuationContent);
          continuationBuffer.continuationLines.push(originalLineNumber);
          continuationBuffer.continuationRawLines.push(line); // 元の行の内容を保存
        } else {
          // 継続終了: バッファを確定して現在の行を処理
          // オペランド部分に継続行の内容を追加
          // 継続行はオペランドから始まるので、最初の行のオペコードはそのまま保持
          const allContinuationOperands = continuationBuffer.continuationOperands.join(" ");
          let fullContent = continuationBuffer.firstLine;
          if (allContinuationOperands) {
            // 継続行の内容をオペランドに追加
            fullContent = continuationBuffer.firstLine + " " + allContinuationOperands;
          }
          
          processedLines.push({
            content: fullContent,
            originalLineNumber: continuationBuffer.firstLineNumber,
            continuationLines: continuationBuffer.continuationLines,
            continuationOperands: continuationBuffer.continuationOperands,
            continuationRawLines: continuationBuffer.continuationRawLines,
            isContinuation: false, // 最初の行なので継続行ではない
          });
          continuationBuffer = null;
          
          // 現在の行が新しい継続行開始かどうかをチェック
          if (isContinuationStart) {
            // 新しい継続行開始: カラム1-71の内容を保存
            const mainContent = line.substring(0, 72).trimEnd();
            continuationBuffer = {
              firstLine: mainContent,
              firstLineNumber: originalLineNumber,
              continuationLines: [originalLineNumber],
              continuationOperands: [],
              continuationRawLines: [],
            };
          } else {
            processedLines.push({
              content: line,
              originalLineNumber,
              isContinuation: false,
            });
          }
        }
      } else {
        if (isContinuationStart) {
          // 継続開始: 現在の行の72桁目に文字があり、前の行の72桁目に文字がない場合
          // カラム1-71の内容を保存
          const mainContent = line.substring(0, 72).trimEnd();
          continuationBuffer = {
            firstLine: mainContent,
            firstLineNumber: originalLineNumber,
            continuationLines: [originalLineNumber],
            continuationOperands: [],
            continuationRawLines: [],
          };
          // 最初の行を一時的に processedLines に追加（継続行開始としてマーク）
          // ただし、これは継続終了時に上書きされる
        } else {
          processedLines.push({
            content: line,
            originalLineNumber,
            isContinuation: false,
          });
        }
      }
    }
    
    // 最後に継続バッファが残っている場合
    if (continuationBuffer) {
      // オペランド部分に継続行の内容を追加
      const allContinuationOperands = continuationBuffer.continuationOperands.join(" ");
      let fullContent = continuationBuffer.firstLine;
      if (allContinuationOperands) {
        // 継続行の内容を追加
        fullContent = continuationBuffer.firstLine + " " + allContinuationOperands;
      }
      
      processedLines.push({
        content: fullContent,
        originalLineNumber: continuationBuffer.firstLineNumber,
        continuationLines: continuationBuffer.continuationLines,
        continuationOperands: continuationBuffer.continuationOperands,
        continuationRawLines: continuationBuffer.continuationRawLines,
        isContinuation: false, // 最初の行なので継続行ではない
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
        // 継続行がある場合、hasContinuationOperands フラグを設定
        // ただし、継続行開始行（最初の行）の場合は false に設定
        // hasContinuationOperands が true の場合、オペコードが undefined になってしまうため
        // 継続行開始行ではオペコードを保持する必要がある
        const isContinuationLine = processedLine.isContinuation; // 個別の継続行かどうか
        const hasContinuationOperands = isContinuationLine; // 個別の継続行の場合のみ true
        const statement = parseLine(processedLine.content, processedLine.originalLineNumber, hasContinuationOperands);
        statementCount++;
        
        // 外部ファイルからの読み込み情報を設定
        if (processedLine.sourceFile) {
          statement.sourceFile = processedLine.sourceFile;
        }
        
        // 継続行の情報を設定
        // continuationLines が存在し、最初の行が含まれている場合、継続行開始行
        // processedLine.originalLineNumber が continuationLines[0] と一致する場合、継続行開始行
        if (processedLine.continuationLines && processedLine.continuationLines.length > 1) {
          // 最初の行が continuationLines[0] に含まれている
          // processedLine.originalLineNumber が continuationLines[0] と一致することを確認
          const firstLineNumber = processedLine.continuationLines[0];
          if (processedLine.originalLineNumber === firstLineNumber) {
            // このステートメントが最初の行（継続行開始行）である
            statement.isContinuation = false; // 最初の行なので継続行ではない
            statement.continuationOf = undefined; // 最初の行なので継続元なし
            statement.continuationCount = processedLine.continuationLines.length - 1; // 継続行の数（最初の行を除く）
          } else {
            // このステートメントは継続行（個別の継続行として処理されている）
            statement.isContinuation = true;
            statement.continuationOf = firstLineNumber;
            statement.continuationCount = undefined; // 継続行自体なのでカウントは不要
          }
        } else if (processedLine.continuationOperands && processedLine.continuationOperands.length > 0) {
          // 継続行のオペランドがある場合、継続行があることを示す
          // continuationLines がない場合は、continuationOperands の数が継続行の数
          statement.isContinuation = false; // 最初の行なので継続行ではない
          statement.continuationOf = undefined; // 最初の行なので継続元なし
          statement.continuationCount = processedLine.continuationOperands.length; // 継続行の数
        } else if (processedLine.isContinuation) {
          // 個別の継続行
          statement.isContinuation = true;
          // continuationOf は後で設定する必要がある
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
            sourceFile: processedLine.sourceFile,
          });
        }

        // オペコード情報の補完とマクロ呼び出しの検出
        // 1. まずオペコードデータベースで検索
        // 2. 見つからなければマクロ定義を検索
        this.enrichStatement(statement, processedLine.originalLineNumber, errors);
        
        statements.push(statement);
        
        // 継続行がある場合、継続行も個別のステートメントとして追加
        if (processedLine.continuationLines && processedLine.continuationLines.length > 1 && processedLine.continuationOperands && processedLine.continuationRawLines) {
          // 最初の行番号を取得
          const firstLineNumber = processedLine.continuationLines[0];
          
          // 各継続行を個別のステートメントとして作成
          // continuationLines[0] は最初の行、continuationLines[1...] が継続行
          // continuationOperands と continuationRawLines のインデックスは i - 1
          // ただし、最後の行が継続行で continuationLines に含まれているが continuationOperands に含まれていない場合がある
          for (let i = 1; i < processedLine.continuationLines.length; i++) {
            const continuationLineNumber = processedLine.continuationLines[i];
            // continuationOperands と continuationRawLines のインデックスは i - 1
            // ただし、最後の行が continuationOperands に含まれていない場合があるので、フォールバックを用意
            const operandIndex = i - 1;
            const continuationOperand = operandIndex < processedLine.continuationOperands.length 
              ? processedLine.continuationOperands[operandIndex] 
              : "";
            const continuationRawLine = operandIndex < processedLine.continuationRawLines.length 
              ? processedLine.continuationRawLines[operandIndex] 
              : "";
            
            // 継続行のステートメントを作成
            // 継続行はオペランドのみなので、オペコードはなし
            if (continuationRawLine || continuationOperand) {
              const continuationStatement = parseLine(continuationOperand || continuationRawLine.substring(0, 72).trimEnd(), continuationLineNumber, true);
              continuationStatement.isContinuation = true;
              continuationStatement.continuationOf = firstLineNumber;
              continuationStatement.continuationCount = undefined; // 継続行自体なのでカウントは不要
              
              // 継続行のrawTextを設定（元の行の内容を保持）
              if (continuationRawLine) {
                continuationStatement.rawText = continuationRawLine;
              } else {
                // continuationRawLine がない場合、continuationOperand から作成
                continuationStatement.rawText = continuationOperand.padEnd(72, " ") + "+";
              }
              
              statements.push(continuationStatement);
            }
          }
          
          // 最後の行が継続行で、continuationLines に含まれているが continuationOperands に含まれていない場合をチェック
          // continuationLines の数が continuationOperands の数 + 1 より大きい場合、最後の行が処理されていない可能性がある
          // すべての継続行が処理されているか確認
          const processedLineNumbers = new Set(statements
            .filter(s => s.isContinuation && s.continuationOf === firstLineNumber)
            .map(s => s.lineNumber));
          
          // continuationLines に含まれるすべての継続行が処理されているか確認
          for (let i = 1; i < processedLine.continuationLines.length; i++) {
            const continuationLineNumber = processedLine.continuationLines[i];
            
            // まだ処理されていない場合
            if (!processedLineNumbers.has(continuationLineNumber)) {
              // この行の情報を取得
              const operandIndex = i - 1;
              let continuationOperand = "";
              let continuationRawLine = "";
              
              if (operandIndex < processedLine.continuationOperands.length) {
                continuationOperand = processedLine.continuationOperands[operandIndex];
              }
              if (operandIndex < processedLine.continuationRawLines.length) {
                continuationRawLine = processedLine.continuationRawLines[operandIndex];
              }
              
              // continuationRawLine がない場合、continuationOperand から推測
              if (!continuationRawLine && continuationOperand) {
                continuationRawLine = continuationOperand.padEnd(72, " ") + "+";
              }
              
              // continuationOperand がない場合、continuationRawLine から取得
              if (!continuationOperand && continuationRawLine) {
                continuationOperand = continuationRawLine.substring(0, 72).trimEnd();
              }
              
              if (continuationOperand || continuationRawLine) {
                const continuationStatement = parseLine(continuationOperand || continuationRawLine.substring(0, 72).trimEnd(), continuationLineNumber, true);
                continuationStatement.isContinuation = true;
                continuationStatement.continuationOf = firstLineNumber;
                continuationStatement.continuationCount = undefined;
                continuationStatement.rawText = continuationRawLine || (continuationOperand.padEnd(72, " ") + "+");
                
                statements.push(continuationStatement);
              }
            }
          }
        }
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