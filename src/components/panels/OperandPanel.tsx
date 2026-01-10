// src/components/panels/OperandPanel.tsx
import type { AsmStatement, Operand } from "../../core/types";

interface OperandPanelProps {
  statement?: AsmStatement;
}

export const OperandPanel = ({ statement }: OperandPanelProps) => {
  if (!statement || !statement.instruction?.operands || statement.instruction.operands.length === 0) {
    return (
      <div className="operand-panel">
        <h3>オペランド解析</h3>
        <p className="empty-state">オペランドを含む行を選択してください</p>
      </div>
    );
  }

  const operands = statement.instruction.operands;

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
      <h3>オペランド解析</h3>
      <div className="operand-content">
        {operands.map((op, idx) => renderOperand(op, idx))}
      </div>
    </div>
  );
};
