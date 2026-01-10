// src/components/panels/OperandPanel.tsx
import type { AsmStatement, Operand, ParseContext } from "../../core/types";
import { FileManager } from "../../core/fileManager";
import { parseLine } from "../../core/lineParser";

interface OperandPanelProps {
  statement?: AsmStatement;
  context?: ParseContext;
  fileManager?: FileManager;
}

interface ExternalSymbolReference {
  symbolName: string;
  fileName: string;
  definition: string;
  lineNumber: number;
  type: "equ" | "dc" | "ds" | "label" | "external";
}

/**
 * 外部ファイルからシンボル定義を検索
 */
function findSymbolInExternalFiles(
  symbolName: string,
  fileManager?: FileManager
): ExternalSymbolReference | null {
  if (!fileManager) {
    return null;
  }

  const symbolNameUpper = symbolName.toUpperCase();
  const allFiles = fileManager.getAllFiles();

  const symbolDefiningOpcodes = ['EQU', 'DC', 'DS', 'CSECT', 'DSECT', 'ENTRY', 'EXTRN'];

  for (const file of allFiles) {
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
            else if (opcodeUpper === 'CSECT' || opcodeUpper === 'DSECT' || opcodeUpper === 'ENTRY') symbolType = 'label';

            return {
              symbolName: stmt.label,
              fileName: file.name,
              definition: line.trim(),
              lineNumber: i + 1,
              type: symbolType,
            };
          }
        }
      } catch (error) {
        continue;
      }
    }
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

  const symbols: string[] = [];
  const parts = operandsText
    .split(/[,()\s+]+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (const part of parts) {
    // レジスタ（R0-R15など）は除外
    if (!/^R\d+$|^GR\d+$/i.test(part)) {
      // 数値リテラルは除外
      if (!/^[0-9A-F]+H?$/i.test(part) && 
          !/^X'[0-9A-F]+'$/i.test(part) && 
          !/^=F'/.test(part) &&
          !/^[=+*\/\-]/.test(part)) {
        symbols.push(part);
      }
    }
  }

  return symbols;
}

export const OperandPanel = ({ statement, context, fileManager }: OperandPanelProps) => {
  // オペランドがない場合のチェック
  const hasOperands = statement?.instruction?.operands && statement.instruction.operands.length > 0;
  const hasOperandsText = statement?.operandsText && statement.operandsText.trim().length > 0;

  if (!statement || (!hasOperands && !hasOperandsText)) {
    return (
      <div className="operand-panel">
        <div className="panel-header">
          <h3>オペランド解析</h3>
        </div>
        <p className="empty-state">オペランドを含む行を選択してください</p>
      </div>
    );
  }

  const operands = statement.instruction?.operands || [];

  // 外部シンボル参照を検索
  const externalSymbolRefs: ExternalSymbolReference[] = [];
  const foundSymbolNames = new Set<string>();
  
  if (hasOperandsText && !statement.isMacroCall && statement.operandsText) {
    const symbols = extractSymbolsFromOperands(statement.operandsText);
    for (const symbol of symbols) {
      const symbolUpper = symbol.toUpperCase();
      if (foundSymbolNames.has(symbolUpper)) {
        continue;
      }
      
      let externalRef: ExternalSymbolReference | null = null;
      if (fileManager) {
        externalRef = findSymbolInExternalFiles(symbol, fileManager);
      }
      
      const symDef = context?.symbols?.get(symbolUpper);
      let shouldDisplayAsExternal = false;
      
      if (externalRef) {
        if (!statement.sourceFile || statement.sourceFile !== externalRef.fileName) {
          shouldDisplayAsExternal = true;
        } else if (symDef && symDef.sourceFile && symDef.sourceFile !== externalRef.fileName) {
          shouldDisplayAsExternal = true;
        }
      } else if (symDef) {
        if (symDef.sourceFile && symDef.sourceFile !== statement.sourceFile) {
          shouldDisplayAsExternal = true;
        } else if (!symDef.sourceFile && statement.sourceFile) {
          shouldDisplayAsExternal = true;
        }
      }
      
      if (shouldDisplayAsExternal) {
        if (externalRef) {
          externalSymbolRefs.push(externalRef);
          foundSymbolNames.add(symbolUpper);
        } else if (symDef && symDef.sourceFile) {
          externalSymbolRefs.push({
            symbolName: symbol,
            fileName: symDef.sourceFile,
            definition: `${symDef.name} ${symDef.type.toUpperCase()}`,
            lineNumber: symDef.definedAt,
            type: symDef.type === "equ" ? "equ" : symDef.type === "constant" ? "dc" : symDef.type === "variable" ? "ds" : "label",
          });
          foundSymbolNames.add(symbolUpper);
        }
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
        {hasOperands && operands.map((op, idx) => renderOperand(op, idx))}
        {externalSymbolRefs.length > 0 && (
          <div className="external-symbols-section">
            <label>外部シンボル参照:</label>
            <div className="external-symbols-list">
              {externalSymbolRefs.map((ref, idx) => (
                <div key={idx} className="external-symbol-item">
                  <div className="external-symbol-header">
                    <span className="external-symbol-name">{ref.symbolName}</span>
                    <span className="external-symbol-type">({ref.type.toUpperCase()})</span>
                    <span className="external-symbol-file" title={`定義ファイル: ${ref.fileName}`}>
                      📄 {ref.fileName}
                    </span>
                  </div>
                  <div className="external-symbol-definition">
                    <code>{ref.definition.substring(0, 72).trimEnd()}</code>
                    <span className="external-symbol-line">（行 {ref.lineNumber}）</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
