// src/components/panels/InstructionPanel.tsx
import type { AsmStatement, ParseContext } from "../../core/types";

interface InstructionPanelProps {
  statement?: AsmStatement;
  context?: ParseContext;
}

export const InstructionPanel = ({ statement, context }: InstructionPanelProps) => {
  if (!statement || !statement.opcode) {
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
  const macroDef = context?.macros?.get(statement.opcode.toUpperCase());

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
          <div className="instruction-section">
            <label>マクロ定義:</label>
            <div className="macro-info">
              <div className="macro-summary">
                {macroDef.parameters.length > 0 ? (
                  <span>パラメータ数: {macroDef.parameters.length} ({macroDef.parameters.map((p: string) => `&${p}`).join(", ")})</span>
                ) : (
                  <span>パラメータなし</span>
                )}
                {macroDef.sourceFile && (
                  <span className="macro-source"> 📄 {macroDef.sourceFile}</span>
                )}
              </div>
              <div className="macro-body-preview">
                <small>マクロ本体（{macroDef.bodyLines?.length || macroDef.body.length}行）:</small>
                <div className="macro-preview-content">
                  {(macroDef.bodyLines || macroDef.body.map((s) => s.rawText)).slice(0, 3).map((line: string, idx: number) => (
                    <div key={idx} className="macro-preview-line">
                      <code>{line.substring(0, 50).trimEnd()}</code>
                    </div>
                  ))}
                  {(macroDef.bodyLines?.length || macroDef.body.length) > 3 && (
                    <div className="macro-preview-more">
                      <small>... 他 {(macroDef.bodyLines?.length || macroDef.body.length) - 3} 行</small>
                    </div>
                  )}
                </div>
              </div>
              <div className="macro-link">
                <small>詳細は「詳細情報」パネルを参照してください</small>
              </div>
            </div>
          </div>
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
