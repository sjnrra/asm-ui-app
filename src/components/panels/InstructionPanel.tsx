// src/components/panels/InstructionPanel.tsx
import type { AsmStatement } from "../../core/types";

interface InstructionPanelProps {
  statement?: AsmStatement;
}

export const InstructionPanel = ({ statement }: InstructionPanelProps) => {
  if (!statement || !statement.opcode) {
    return (
      <div className="instruction-panel">
        <h3>命令情報</h3>
        <p className="empty-state">命令が含まれる行を選択してください</p>
      </div>
    );
  }

  const instruction = statement.instruction;

  return (
    <div className="instruction-panel">
      <h3>命令情報</h3>
      <div className="instruction-content">
        <div className="instruction-section">
          <label>ニーモニック:</label>
          <span className="mnemonic">{statement.opcode}</span>
        </div>
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
        <div className="instruction-note">
          <small>※ 高度な解析機能は将来の拡張で実装予定</small>
        </div>
      </div>
    </div>
  );
};
