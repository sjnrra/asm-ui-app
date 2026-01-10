// src/components/panels/DetailPanel.tsx
import type { AsmStatement } from "../../core/types";

interface DetailPanelProps {
  statement?: AsmStatement;
}

export const DetailPanel = ({ statement }: DetailPanelProps) => {
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
        {(statement.isContinuation === true || (statement.continuationCount !== undefined && statement.continuationCount > 0)) && (
          <div className="detail-section">
            <label>継続行:</label>
            <span className="continuation-value">
              {statement.isContinuation ? (
                <span title={`この行は継続行です（行${statement.continuationOf || '?'}の続き）`}>
                  ✓ 継続行（行{statement.continuationOf || '?'}の続き）
                </span>
              ) : statement.continuationCount !== undefined && statement.continuationCount > 0 ? (
                <span title={`この行は${statement.continuationCount}行の継続行を持っています`}>
                  ✓ 継続行あり（{statement.continuationCount}行続く）
                </span>
              ) : null}
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
        <div className="detail-section">
          <label>トークン数:</label>
          <span>{statement.tokens.length}</span>
        </div>
      </div>
    </div>
  );
};
