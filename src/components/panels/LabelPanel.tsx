// src/components/panels/LabelPanel.tsx
import type { SymbolDefinition } from "../../core/types";

interface LabelPanelProps {
  symbols: Map<string, SymbolDefinition>;
  selectedLabel?: string;
  onLabelSelect?: (label: string) => void;
}

export const LabelPanel = ({ symbols, selectedLabel, onLabelSelect }: LabelPanelProps) => {
  const symbolArray = Array.from(symbols.values());

  return (
    <div className="label-panel">
      <h3>シンボルテーブル</h3>
      <div className="label-content">
        {symbolArray.length === 0 ? (
          <p className="empty-state">ラベルが定義されていません</p>
        ) : (
          <div className="symbol-list">
            {symbolArray.map((symbol) => (
              <div
                key={symbol.name}
                className={`symbol-item ${selectedLabel === symbol.name ? "selected" : ""}`}
                onClick={() => onLabelSelect?.(symbol.name)}
              >
                <span className="symbol-name">{symbol.name}</span>
                <span className="symbol-type">{symbol.type}</span>
                <span className="symbol-value">
                  {typeof symbol.value === "number" ? `0x${symbol.value.toString(16)}` : symbol.value}
                </span>
                <span className="symbol-line">L{symbol.definedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
