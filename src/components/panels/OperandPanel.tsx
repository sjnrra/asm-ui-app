// src/components/panels/OperandPanel.tsx
import type { AsmStatement, Operand, ParseContext } from "../../core/types";
import { FileManager } from "../../core/fileManager";
import { parseLine } from "../../core/lineParser";
import { AssemblyAnalyzer } from "../../core/analyser";

interface OperandPanelProps {
  statement?: AsmStatement;
  context?: ParseContext;
  fileManager?: FileManager;
  statements?: AsmStatement[]; // すべてのステートメント（定義行を取得するため）
}

interface SymbolReference {
  symbolName: string;
  fileName: string;
  definition: string;
  lineNumber: number;
  type: "equ" | "dc" | "ds" | "label" | "external";
  isInternal: boolean; // 同じファイル内で定義されているか
}

/**
 * シンボル定義を検索（内部→外部の順）
 */
function findSymbolDefinition(
  symbolName: string,
  currentSourceFile: string | undefined,
  context?: ParseContext,
  fileManager?: FileManager,
  statements?: AsmStatement[]
): SymbolReference | null {
  if (!context) {
    return null;
  }

  const symbolNameUpper = symbolName.toUpperCase();
  const symbolDefiningOpcodes = ['EQU', 'DC', 'DS', 'CSECT', 'DSECT', 'ENTRY', 'EXTRN', 'DCB', 'ACB', 'RPL'];

  // ステップ1: アセンブリソース内（context.symbols）で検索
  const symDef = context.symbols?.get(symbolNameUpper);
  if (symDef) {
    // 同じファイル内で定義されているかチェック
    const isInternal = symDef.sourceFile === currentSourceFile || 
                      (!symDef.sourceFile && !currentSourceFile) ||
                      (symDef.sourceFile === undefined && currentSourceFile === undefined);
    
    if (isInternal) {
      // 内部シンボル（同じファイル内で定義）
      let symbolType: "equ" | "dc" | "ds" | "label" | "external" = "external";
      if (symDef.type === "equ") symbolType = 'equ';
      else if (symDef.type === "constant") symbolType = 'dc';
      else if (symDef.type === "variable") symbolType = 'ds';
      else if (symDef.type === "label") symbolType = 'label';

      // 元の行の内容を取得
      let definitionLine = `${symDef.name} ${symDef.type.toUpperCase()}${symDef.dataType ? ` ${symDef.dataType}` : ''}`;
      const sourceFileName = symDef.sourceFile || currentSourceFile;
      
      // 方法1: statements から直接取得（優先）
      if (statements && symDef.definedAt > 0) {
        const definingStatement = statements.find(
          s => s.lineNumber === symDef.definedAt && 
               s.label?.toUpperCase() === symbolNameUpper &&
               (s.sourceFile === sourceFileName || (!s.sourceFile && !sourceFileName))
        );
        if (definingStatement && definingStatement.rawText) {
          definitionLine = definingStatement.rawText.trim();
        }
      }
      
      // 方法2: fileManager から取得（フォールバック）
      if (definitionLine === `${symDef.name} ${symDef.type.toUpperCase()}${symDef.dataType ? ` ${symDef.dataType}` : ''}` && 
          fileManager && sourceFileName && symDef.definedAt > 0) {
        const file = fileManager.findFile(sourceFileName);
        if (file) {
          const lines = file.content.split('\n');
          const lineIndex = symDef.definedAt - 1; // 行番号は1ベース、配列は0ベース
          if (lineIndex >= 0 && lineIndex < lines.length) {
            const originalLine = lines[lineIndex].trim();
            if (originalLine) {
              definitionLine = originalLine;
            }
          }
        }
      }

      return {
        symbolName: symDef.name,
        fileName: sourceFileName || "（現在のファイル）",
        definition: definitionLine,
        lineNumber: symDef.definedAt,
        type: symbolType,
        isInternal: true,
      };
    }
  }

  // ステップ2: 外部ファイルから検索
  if (fileManager) {
    const allFiles = fileManager.getAllFiles();
    for (const file of allFiles) {
      // 現在のファイルはスキップ（既にチェック済み）
      if (file.name === currentSourceFile) {
        continue;
      }

      const lines = file.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        try {
          const stmt = parseLine(line, i + 1);
          if (stmt.label && stmt.opcode) {
            const opcodeUpper = stmt.opcode.toUpperCase();
            if (symbolDefiningOpcodes.includes(opcodeUpper) &&
                stmt.label.toUpperCase() === symbolNameUpper) {
              let symbolType: "equ" | "dc" | "ds" | "label" | "external" = "external";
              if (opcodeUpper === 'EQU') symbolType = 'equ';
              else if (opcodeUpper === 'DC') symbolType = 'dc';
              else if (opcodeUpper === 'DS') symbolType = 'ds';
              else if (opcodeUpper === 'DCB') symbolType = 'label';
              else if (opcodeUpper === 'ACB') symbolType = 'label';
              else if (opcodeUpper === 'RPL') symbolType = 'label';
              else if (opcodeUpper === 'CSECT' || opcodeUpper === 'DSECT' || opcodeUpper === 'ENTRY') symbolType = 'label';

              return {
                symbolName: stmt.label,
                fileName: file.name,
                definition: line.trim(),
                lineNumber: i + 1,
                type: symbolType,
                isInternal: false,
              };
            }
          }
        } catch (error) {
          continue;
        }
      }
    }
  }

  // ステップ3: context.symbolsにあるが、異なるファイルで定義されている場合
  if (symDef && symDef.sourceFile && symDef.sourceFile !== currentSourceFile) {
    let symbolType: "equ" | "dc" | "ds" | "label" | "external" = "external";
    if (symDef.type === "equ") symbolType = 'equ';
    else if (symDef.type === "constant") symbolType = 'dc';
    else if (symDef.type === "variable") symbolType = 'ds';
    else if (symDef.type === "label") symbolType = 'label';

    return {
      symbolName: symDef.name,
      fileName: symDef.sourceFile,
      definition: `${symDef.name} ${symDef.type.toUpperCase()}${symDef.dataType ? ` ${symDef.dataType}` : ''}`,
      lineNumber: symDef.definedAt,
      type: symbolType,
      isInternal: false,
    };
  }

  return null;
}

/**
 * オペランドテキストからシンボル名を抽出
 */
function extractSymbolsFromOperands(operandsText: string): string[] {
  if (!operandsText || operandsText.trim().length === 0) {
    return [];
  }

  // 予約語・キーワードリスト（シンボルとして扱わない）
  const reservedWords = new Set([
    'OUTPUT', 'INPUT', 'UPDATE', 'INOUT', 'EXTEND',
    'MF', 'MCSFLAG', 'HRDCPY', 'NOHRDCPY',
    'AM', 'VSAM', 'DDNAME', 'MACRF', 'DSORG', 'RECFM', 'LRECL',
    'ACB', 'RPL', 'AREA', 'AREALEN', 'OPTCD', 'KEY', 'SEQ', 'LOC',
    'R', 'L', 'E', 'T', 'N', 'S', 'H', 'F', 'D',
    'Y', 'YES', 'N', 'NO',
  ]);

  const symbols: string[] = [];
  const parts = operandsText
    .split(/[,()\s+]+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (const part of parts) {
    const partUpper = part.toUpperCase();
    
    // レジスタ（R0-R15など）は除外
    if (/^R\d+$|^GR\d+$/i.test(part)) {
      continue;
    }
    
    // 予約語は除外
    if (reservedWords.has(partUpper)) {
      continue;
    }
    
    // 数値リテラルは除外
    if (/^[0-9A-F]+H?$/i.test(part) || 
        /^X'[0-9A-F]+'$/i.test(part) || 
        /^=F'/.test(part) ||
        /^[=+*\/\-]/.test(part)) {
      continue;
    }
    
    // シンボル名として扱う（アルファベットまたはアンダースコアで始まる）
    if (/^[A-Z_][A-Z0-9_]*$/i.test(part)) {
      symbols.push(part);
    }
  }

  return symbols;
}

export const OperandPanel = ({ statement, context, fileManager, statements }: OperandPanelProps) => {
  // オペランドがない場合のチェック
  const hasOperands = statement?.instruction?.operands && statement.instruction.operands.length > 0;
  const hasOperandsText = statement?.operandsText && statement.operandsText.trim().length > 0;
  
  // 継続行の場合でもオペランド解析情報を表示する
  const isContinuation = statement?.isContinuation === true;
  const shouldShowOperandInfo = hasOperands || hasOperandsText || isContinuation;

  if (!statement || !shouldShowOperandInfo) {
    return (
      <div className="operand-panel">
        <div className="panel-header">
          <h3>オペランド解析</h3>
        </div>
        <p className="empty-state">オペランドを含む行を選択してください</p>
      </div>
    );
  }

  // 継続行の場合、継続元の行を探してオペランドを解析
  let operands = statement.instruction?.operands || [];
  
  if (isContinuation && hasOperandsText && statement.operandsText && statement.continuationOf && statements) {
    // 継続元の行を探す
    const continuationSource = statements.find(s => s.lineNumber === statement.continuationOf);
    if (continuationSource && continuationSource.opcode) {
      // 継続元の行のオペコードを使ってオペランドを解析
      const analyzer = new AssemblyAnalyzer();
      // 一時的なステートメントを作成してオペランドを解析
      const tempStatement: AsmStatement = {
        lineNumber: statement.lineNumber,
        rawText: statement.rawText,
        opcode: continuationSource.opcode,
        operandsText: statement.operandsText,
        tokens: [],
      };
      // analyzeメソッドを呼び出してオペランドを解析
      const result = analyzer.analyze({
        statements: [tempStatement],
        errors: [],
        symbols: context?.symbols || new Map(),
        context: context || { symbols: new Map(), macros: new Map() },
      });
      if (result.statements.length > 0 && result.statements[0].instruction?.operands) {
        operands = result.statements[0].instruction.operands;
      }
    }
  }

  // シンボル参照を検索（内部→外部の順）
  const internalSymbolRefs: SymbolReference[] = [];
  const externalSymbolRefs: SymbolReference[] = [];
  const foundSymbolNames = new Set<string>();
  
  // 継続行の場合でもオペランド解析情報を表示する
  if (hasOperandsText && !statement.isMacroCall && statement.operandsText) {
    const symbols = extractSymbolsFromOperands(statement.operandsText);
    for (const symbol of symbols) {
      const symbolUpper = symbol.toUpperCase();
      if (foundSymbolNames.has(symbolUpper)) {
        continue;
      }
      
      // シンボル定義を検索（内部→外部の順）
      const symbolRef = findSymbolDefinition(
        symbol,
        statement.sourceFile,
        context,
        fileManager,
        statements
      );
      
      if (symbolRef) {
        if (symbolRef.isInternal) {
          internalSymbolRefs.push(symbolRef);
        } else {
          externalSymbolRefs.push(symbolRef);
        }
        foundSymbolNames.add(symbolUpper);
      }
    }
  }
  

  const renderOperand = (operand: Operand, index: number) => {
    return (
      <div key={index} className="operand-detail">
        <div className="operand-header">
          <span className="operand-index">#{index + 1}</span>
          <span className="operand-type-badge">{operand.type}</span>
        </div>
        <div className="operand-body">
          <div className="operand-value">
            <label>値:</label>
            <code>{operand.value}</code>
          </div>
          {operand.register && (
            <div className="operand-property">
              <label>レジスタ:</label>
              <code>{operand.register}</code>
            </div>
          )}
          {operand.baseRegister && (
            <div className="operand-property">
              <label>ベースレジスタ:</label>
              <code>{operand.baseRegister}</code>
            </div>
          )}
          {operand.indexRegister && (
            <div className="operand-property">
              <label>インデックスレジスタ:</label>
              <code>{operand.indexRegister}</code>
            </div>
          )}
          {operand.displacement !== undefined && (
            <div className="operand-property">
              <label>ディスプレースメント:</label>
              <code>{operand.displacement} (0x{operand.displacement.toString(16)})</code>
            </div>
          )}
          {operand.length !== undefined && (
            <div className="operand-property">
              <label>長さ:</label>
              <code>{operand.length}</code>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="operand-panel">
      <div className="panel-header">
        <h3>オペランド解析</h3>
      </div>
      <div className="operand-content">
        {/* 解析されたオペランドを表示（継続行でも通常の行でも同じスタイル） */}
        {operands.length > 0 && operands.map((op, idx) => renderOperand(op, idx))}
        {/* 解析されたオペランドがない場合のみ、オペランドテキストを表示 */}
        {operands.length === 0 && hasOperandsText && statement.operandsText && (
          <div className="operand-text-section">
            <label>オペランド:</label>
            <code className="operand-text">{statement.operandsText.trim()}</code>
          </div>
        )}
        {(internalSymbolRefs.length > 0 || externalSymbolRefs.length > 0) && (
          <>
            {internalSymbolRefs.length > 0 && (
              <div className="internal-symbols-section">
                <label>内部シンボル参照（同一ファイル内）:</label>
                <div className="symbols-list">
                  {internalSymbolRefs.map((ref, idx) => (
                    <div key={idx} className="symbol-item">
                      <div className="symbol-header">
                        <span className="symbol-name">{ref.symbolName}</span>
                        <span className="symbol-type">({ref.type.toUpperCase()})</span>
                        <span className="symbol-file" title={`定義ファイル: ${ref.fileName}`}>
                          📄 {ref.fileName}
                        </span>
                      </div>
                      <div className="symbol-definition">
                        <code>{ref.definition.trimEnd()}</code>
                        <span className="symbol-line">（行 {ref.lineNumber}）</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {externalSymbolRefs.length > 0 && (
              <div className="external-symbols-section">
                <label>外部シンボル参照:</label>
                <div className="symbols-list">
                  {externalSymbolRefs.map((ref, idx) => (
                    <div key={idx} className="symbol-item">
                      <div className="symbol-header">
                        <span className="symbol-name">{ref.symbolName}</span>
                        <span className="symbol-type">({ref.type.toUpperCase()})</span>
                        <span className="symbol-file" title={`定義ファイル: ${ref.fileName}`}>
                          📄 {ref.fileName}
                        </span>
                      </div>
                      <div className="symbol-definition">
                        <code>{ref.definition.substring(0, 72).trimEnd()}</code>
                        <span className="symbol-line">（行 {ref.lineNumber}）</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
