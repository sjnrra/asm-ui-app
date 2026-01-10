// src/components/panels/DetailPanel.tsx
import type { AsmStatement, ParseContext } from "../../core/types";

interface DetailPanelProps {
  statement?: AsmStatement;
  context?: ParseContext;
}

export const DetailPanel = ({ statement, context }: DetailPanelProps) => {
  if (!statement) {
    return (
      <div className="detail-panel">
        <div className="panel-header">
          <h3>詳細情報</h3>
        </div>
        <p className="empty-state">行を選択してください</p>
      </div>
    );
  }

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
    <div className="detail-panel">
      <div className="panel-header">
        <h3>詳細情報</h3>
      </div>
      <div className="detail-content">
        <div className="detail-section">
          <label>行番号:</label>
          <span>{statement.lineNumber}</span>
        </div>
        {statement.label && (
          <div className="detail-section">
            <label>ラベル:</label>
            <span className="label-value">{statement.label}</span>
          </div>
        )}
        {statement.opcode && (
          <div className="detail-section">
            <label>オペコード:</label>
            <span className="opcode-value">{statement.opcode}</span>
          </div>
        )}
        {statement.operandsText && statement.operandsText.trim().length > 0 && !statement.isMacroCall && (
          <div className="detail-section">
            <label>オペランド:</label>
            <span className="operands-value">{statement.operandsText.trim()}</span>
          </div>
        )}
        {statement.instruction?.operands && statement.instruction.operands.length > 0 && !statement.isMacroCall && (
          <div className="detail-section">
            <label>オペランド（解析済み）:</label>
            <div className="operands-list">
              {statement.instruction.operands.map((op, idx) => (
                <div key={idx} className="operand-item">
                  <span className="operand-type">[{op.type}]</span>
                  <span className="operand-value">{op.value}</span>
                  {op.baseRegister && (
                    <span className="operand-detail">Base: {op.baseRegister}</span>
                  )}
                  {op.displacement !== undefined && (
                    <span className="operand-detail">Disp: {op.displacement}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {statement.comment && (
          <div className="detail-section">
            <label>コメント:</label>
            <span className="comment-value">{statement.comment}</span>
          </div>
        )}
        {statement.sourceFile && (
          <div className="detail-section">
            <label>外部ファイル:</label>
            <span className="source-file-value" title={`この行は外部ファイル "${statement.sourceFile}" から読み込まれました`}>
              📄 {statement.sourceFile}
            </span>
          </div>
        )}
        {statement.opcode && statement.opcode.toUpperCase() === "COPY" && statement.operandsText && (
          <div className="detail-section">
            <label>COPY文（依存ファイル）:</label>
            <span className="copy-file-value" title={`COPY文で読み込まれるファイル: ${statement.operandsText.trim().split(/\s*,\s*/)[0]}`}>
              📋 {statement.operandsText.trim().split(/\s*,\s*/)[0]}
            </span>
          </div>
        )}
        {statement.isMacroCall && macroDef && macroDef.sourceFile && (
          <div className="detail-section dependency-files-section">
            <label>マクロ定義ファイル（依存ファイル）:</label>
            <div className="dependency-files-list">
              <div className="dependency-file-item" title={`このマクロが定義されているファイル: ${macroDef.sourceFile}`}>
                📄 {macroDef.sourceFile}
              </div>
            </div>
          </div>
        )}
        {statement.isMacroCall && statement.macroName && (
          <div className="detail-section">
            <label>マクロ呼び出し:</label>
            <span className="macro-call-value" title={`この行はマクロ "${statement.macroName}" を呼び出しています`}>
              ⚡ {statement.macroName}
            </span>
          </div>
        )}
        {macroDef && (
          <div className="detail-section macro-definition-section">
            <label>マクロ定義:</label>
            <div className="macro-definition-content">
              <div className="macro-name">
                <strong>{macroDef.name}</strong>
                {macroDef.sourceFile && (
                  <span className="macro-source-file" title={`マクロ定義元: ${macroDef.sourceFile}`}>
                    📄 {macroDef.sourceFile}
                  </span>
                )}
              </div>
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
        )}
        <div className="detail-section">
          <label>トークン数:</label>
          <span>{statement.tokens.length}</span>
        </div>
      </div>
    </div>
  );
};
