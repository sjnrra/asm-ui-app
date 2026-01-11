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
      label: "LABEL",
      equ: "EQU",
      constant: "定数(DC)",
      variable: "変数(DS)",
    };
    return typeMap[type] || type;
  };

  /**
   * データ型の日本語名称を取得
   */
  const getDataTypeLabel = (dataType?: string): string => {
    if (!dataType) return "";
    
    const typeMap: Record<string, string> = {
      F: "フルワード (Fullword)",
      H: "ハーフワード (Halfword)",
      D: "ダブルワード (Doubleword)",
      A: "アドレス (Address)",
      S: "アドレス短形式 (Address Short)",
      Y: "アドレス超短形式 (Address Y-type)",
      V: "可変アドレス (Variable Address)",
      X: "16進数 (Hexadecimal)",
      C: "文字 (Character)",
      CL: "文字長指定 (Character Length)",
      P: "パック10進数 (Packed Decimal)",
      Z: "ゾーン10進数 (Zoned Decimal)",
      E: "浮動小数点 (Floating Point)",
    };
    
    // CL10形式の場合
    if (/^CL\d+$/i.test(dataType)) {
      const match = dataType.match(/^CL(\d+)$/i);
      const length = match ? match[1] : "";
      return `文字長指定 (Character Length ${length})`;
    }
    
    // Z10形式の場合
    if (/^Z\d+$/i.test(dataType)) {
      const match = dataType.match(/^Z(\d+)$/i);
      const length = match ? match[1] : "";
      return `ゾーン10進数長指定 (Zoned Decimal Length ${length})`;
    }
    
    return typeMap[dataType.toUpperCase()] || dataType;
  };

  /**
   * 値をフォーマット（10進数、16進数、2進数を含む）
   */
  const formatValue = (value: number | string, dataType?: string, length?: number): string => {
    if (typeof value === "number") {
      const dec = value.toString();
      // 負の値の場合、符号なし32ビット整数として16進数表示
      const hexValue = value < 0 ? (value >>> 0) : value;
      const hex = `0x${hexValue.toString(16).toUpperCase()}`;
      let bin = "";
      
      // 値が0以上65535以下の場合は2進数も表示
      if (value >= 0 && value <= 65535) {
        bin = `0b${value.toString(2)}`;
      } else if (value < 0) {
        // 負の値の場合、2の補数表現を表示（32ビット符号付き整数として）
        const unsignedValue = value >>> 0; // 符号なし32ビット整数に変換
        bin = `0b${unsignedValue.toString(2).padStart(32, '0')} (2の補数)`;
      }
      
      // データ型に応じた表示
      if (dataType && dataType === "X") {
        // 16進数の場合は16進数を強調
        return `${hex} (10進数: ${dec}${bin ? `, 2進数: ${bin}` : ""})`;
      } else if (dataType && /^CL?\d*$/i.test(dataType)) {
        // 文字型の場合は文字列として表示（値が数値の場合は文字コード変換）
        if (typeof value === "string") {
          return value;
        } else {
          return String.fromCharCode(value);
        }
      } else {
        // デフォルトは10進数と16進数、可能なら2進数も
        return `${dec} (${hex}${bin ? `, ${bin}` : ""})`;
      }
    }
    
    if (typeof value === "string") {
      // 文字列の場合、長さ情報を追加
      if (length !== undefined) {
        return `${value} [長さ: ${length}バイト]`;
      }
      if (value.length > 50) {
        return value.substring(0, 50) + "...";
      }
      return value || "(なし)";
    }
    
    return "(なし)";
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
                {symbol.dataType && (
                  <div className="symbol-data-type">
                    <span className="symbol-data-type-label">データ型:</span>
                    <span className="symbol-data-type-value">
                      {symbol.dataType} - {getDataTypeLabel(symbol.dataType)}
                    </span>
                  </div>
                )}
                {symbol.length !== undefined && (
                  <div className="symbol-length">
                    <span className="symbol-length-label">長さ:</span>
                    <span className="symbol-length-value">{symbol.length}バイト</span>
                  </div>
                )}
                <div className="symbol-details">
                  <div className="symbol-value-label">値:</div>
                  <div className="symbol-value">{formatValue(symbol.value, symbol.dataType, symbol.length)}</div>
                </div>
                <div className="symbol-footer">
                  <span className="symbol-line">定義場所: L{symbol.definedAt}</span>
                  {symbol.sourceFile && (
                    <span className="symbol-source-file">📄 {symbol.sourceFile}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
