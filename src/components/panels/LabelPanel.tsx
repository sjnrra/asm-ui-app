// src/components/panels/LabelPanel.tsx
import type { SymbolDefinition } from "../../core/types";

interface LabelPanelProps {
  symbols: Map<string, SymbolDefinition>;
  selectedLabel?: string;
  onLabelSelect?: (label: string) => void;
}

export const LabelPanel = ({ symbols, selectedLabel, onLabelSelect }: LabelPanelProps) => {
  const symbolArray = Array.from(symbols.values()).sort((a, b) => a.definedAt - b.definedAt);

  const getTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      label: "ラベル",
      equ: "EQU",
      constant: "定数(DC)",
      variable: "変数(DS)",
    };
    return typeMap[type] || type;
  };

  const formatValue = (value: number | string): string => {
    if (typeof value === "number") {
      return `${value} (0x${value.toString(16).toUpperCase()})`;
    }
    if (typeof value === "string" && value.length > 30) {
      return value.substring(0, 30) + "...";
    }
    return value || "(なし)";
  };

  return (
    <div className="label-panel">
      <div className="panel-header">
        <h3>シンボルテーブル ({symbolArray.length})</h3>
      </div>
      <div className="label-content">
        {symbolArray.length === 0 ? (
          <p className="empty-state">シンボルが定義されていません</p>
        ) : (
          <div className="symbol-list">
            {symbolArray.map((symbol) => (
              <div
                key={symbol.name}
                className={`symbol-item ${selectedLabel === symbol.name ? "selected" : ""}`}
                onClick={() => onLabelSelect?.(symbol.name)}
              >
                <div className="symbol-header">
                  <span className="symbol-name">{symbol.name}</span>
                  <span className={`symbol-type-badge type-${symbol.type}`}>
                    {getTypeLabel(symbol.type)}
                  </span>
                </div>
                <div className="symbol-details">
                  <div className="symbol-value-label">値:</div>
                  <div className="symbol-value">{formatValue(symbol.value)}</div>
                </div>
                <div className="symbol-footer">
                  <span className="symbol-line">定義場所: L{symbol.definedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
