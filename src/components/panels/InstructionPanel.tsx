// src/components/panels/InstructionPanel.tsx
import type { AsmStatement, ParseContext } from "../../core/types";

interface InstructionPanelProps {
  statement?: AsmStatement;
  context?: ParseContext;
}

export const InstructionPanel = ({ statement, context }: InstructionPanelProps) => {
  // 継続行の場合、継続元の行のオペコード情報を表示する必要がある
  // しかし、現在の実装では継続元の行の情報を直接取得できないため、
  // 継続行の場合は継続元の行を探す必要がある
  // ただし、今回は継続行の場合でも何も表示しない（将来的に拡張可能）
  
  if (!statement) {
    return (
      <div className="instruction-panel">
        <div className="panel-header">
          <h3>命令情報</h3>
        </div>
        <p className="empty-state">命令が含まれる行を選択してください</p>
      </div>
    );
  }
  
  // 継続行の場合
  if (statement.isContinuation && statement.continuationOf) {
    return (
      <div className="instruction-panel">
        <div className="panel-header">
          <h3>命令情報</h3>
        </div>
        <div className="instruction-content">
          <p className="instruction-note">
            この行は継続行です。命令情報は行{statement.continuationOf}を参照してください。
          </p>
        </div>
      </div>
    );
  }
  
  // オペコードがない場合（継続行ではないが、オペコードがない行）
  if (!statement.opcode) {
    return (
      <div className="instruction-panel">
        <div className="panel-header">
          <h3>命令情報</h3>
        </div>
        <p className="empty-state">命令が含まれる行を選択してください</p>
      </div>
    );
  }

  const instruction = statement.instruction;
  
  // マクロ定義をチェック（マクロ呼び出しの場合はmacroNameまたはopcodeから取得）
  let macroDef = undefined;
  if (statement.isMacroCall) {
    // マクロ呼び出しの場合、まずmacroNameから取得を試みる
    if (statement.macroName) {
      macroDef = context?.macros?.get(statement.macroName.toUpperCase());
    }
    // macroNameから取得できなかった場合、opcodeから取得を試みる
    if (!macroDef && statement.opcode) {
      macroDef = context?.macros?.get(statement.opcode.toUpperCase());
    }
  } else if (statement.opcode) {
    // 通常のステートメントの場合、opcodeから取得
    macroDef = context?.macros?.get(statement.opcode.toUpperCase());
  }

  return (
    <div className="instruction-panel">
      <div className="panel-header">
        <h3>命令情報</h3>
      </div>
      <div className="instruction-content">
        <div className="instruction-section">
          <label>ニーモニック:</label>
          <span className="mnemonic">
            {statement.opcode}
            {macroDef && <span className="macro-badge" title="マクロ定義">[MACRO]</span>}
          </span>
        </div>
        {macroDef ? (
          <>
            {macroDef.sourceFile && (
              <div className="instruction-section dependency-files-section">
                <label>マクロ定義ファイル（依存ファイル）:</label>
                <div className="dependency-files-list">
                  <div className="dependency-file-item" title={`このマクロが定義されているファイル: ${macroDef.sourceFile}`}>
                    {macroDef.sourceFile}
                  </div>
                </div>
              </div>
            )}
            <div className="instruction-section macro-definition-section">
              <div className="macro-definition-content">
  
                {macroDef.parameters.length > 0 && (
                  <div className="macro-parameters">
                    <label>パラメータ:</label>
                    <div className="macro-params-list">
                      {macroDef.parameters.map((param, idx) => (
                        <span key={idx} className="macro-param">
                          &{param}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="macro-body">
                  <label>マクロ本体（定義）:</label>
                  <div className="macro-body-content">
                    {macroDef.bodyLines && macroDef.bodyLines.length > 0 ? (
                      macroDef.bodyLines.map((line, idx) => (
                        <div key={idx} className="macro-body-line">
                          <code>{line.substring(0, 72).trimEnd()}</code>
                        </div>
                      ))
                    ) : (
                      macroDef.body.map((stmt, idx) => (
                        <div key={idx} className="macro-body-line">
                          <code>{stmt.rawText.substring(0, 72).trimEnd()}</code>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {statement.isMacroCall && macroDef && (() => {
                  // パラメータ置換を行って展開後の内容を生成
                  const actualParams: string[] = (statement.operandsText || "")
                    .split(/\s*,\s*/)
                    .map(p => p.trim())
                    .filter(p => p.length > 0);
                  const paramMap = new Map<string, string>();
                  for (let i = 0; i < macroDef.parameters.length; i++) {
                    const formalParam = macroDef.parameters[i];
                    const actualParam = i < actualParams.length ? actualParams[i] : "";
                    paramMap.set(formalParam.toUpperCase().replace(/^&/, ""), actualParam);
                  }
                  const bodyLines = macroDef.bodyLines || macroDef.body.map(stmt => stmt.rawText);
                  const expandedLines = bodyLines.map(line => {
                    let expandedLine = line;
                    for (const [formal, actual] of paramMap.entries()) {
                      // &パラメータ名を実際の値に置換（単語境界を考慮）
                      const regex = new RegExp(`&${formal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
                      expandedLine = expandedLine.replace(regex, actual || "");
                    }
                    return expandedLine;
                  });
                  
                  // 展開後の内容が定義と同じかどうかをチェック
                  const isExpandedSameAsDefinition = bodyLines.length === expandedLines.length &&
                    bodyLines.every((line, idx) => line.trim() === expandedLines[idx].trim());
                  
                  // 展開後の内容が定義と異なる場合のみ表示
                  if (!isExpandedSameAsDefinition) {
                    return (
                      <div className="macro-expansion">
                        <label>マクロ展開後（この呼び出し）:</label>
                        <div className="macro-expansion-content">
                          {expandedLines.map((line, idx) => (
                            <div key={idx} className="macro-expansion-line">
                              <code>{line.substring(0, 72).trimEnd()}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                <div className="macro-meta">
                  <small>定義位置: 行 {macroDef.definedAt}</small>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {instruction?.description && (
              <div className="instruction-section">
                <label>説明:</label>
                <div className="description-text">{instruction.description}</div>
              </div>
            )}
            {instruction?.format && (
              <div className="instruction-section">
                <label>フォーマット:</label>
                <span className="format">{instruction.format}</span>
              </div>
            )}
            {instruction?.addressingMode && (
              <div className="instruction-section">
                <label>アドレッシングモード:</label>
                <span className="addressing-mode">{instruction.addressingMode}</span>
              </div>
            )}
            {/* 将来的に、命令の詳細情報（レジスタ使用、サイクル数など）を表示 */}
            {!instruction?.description && (
              <div className="instruction-note">
                <small>※ 高度な解析機能は将来の拡張で実装予定</small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
