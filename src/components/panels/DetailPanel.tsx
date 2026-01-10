// src/components/panels/DetailPanel.tsx
import type { AsmStatement } from "../../core/types";

interface DetailPanelProps {
  statement?: AsmStatement;
}

export const DetailPanel = ({ statement }: DetailPanelProps) => {
  if (!statement) {
    return (
      <div className="detail-panel">
        <h3>詳細情報</h3>
        <p className="empty-state">行を選択してください</p>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <h3>詳細情報</h3>
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
        {statement.operandsText && (
          <div className="detail-section">
            <label>オペランド:</label>
            <span className="operands-value">{statement.operandsText}</span>
          </div>
        )}
        {statement.instruction?.operands && statement.instruction.operands.length > 0 && (
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
        <div className="detail-section">
          <label>トークン数:</label>
          <span>{statement.tokens.length}</span>
        </div>
      </div>
    </div>
  );
};
