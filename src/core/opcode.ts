// z/OSアセンブラ オペコード定義
// 将来の拡張を考慮した構造

export type OpcodeFormat = 
  | "RR"   // Register-Register (2バイト)
  | "RX"   // Register-Indexed (4バイト)
  | "RS"   // Register-Storage (4バイト)
  | "SI"   // Storage-Immediate (4バイト)
  | "SS"   // Storage-Storage (6バイト)
  | "S"    // Storage (4バイト)
  | "E"    // Extended (8バイト)
  | "RRE"  // Register-Register Extended (4バイト)
  | "RXY"  // Register-Indexed Extended (4バイト)
  | "SIL"  // Storage-Immediate Long (6バイト)
  | "RI"   // Register-Immediate (4バイト)
  | "RIL"  // Register-Immediate Long (6バイト)
  | "RSI"  // Register-Storage-Immediate (4バイト)
  | "RIS"  // Register-Immediate-Storage (6バイト)
  | "RIE"  // Register-Immediate Extended (6バイト)
  | "RRS"  // Register-Register-Storage (4バイト)
  | "RSE"  // Register-Storage Extended (6バイト)
  | "RSY"  // Register-Storage Extended (6バイト)
  | "RSY-A" // Register-Storage Extended A (6バイト)
  | "SIL"   // Storage-Immediate Long (6バイト)
  | "SILY"  // Storage-Immediate Long Extended (6バイト)
  | "SIY"   // Storage-Immediate Extended (6バイト)
  | "SSE"   // Storage-Storage Extended (6バイト)
  | "SSF"   // Storage-Storage Format (6バイト)
  | "SSY"   // Storage-Storage Extended (6バイト);

import type { OperandType } from "./types";

export interface OpcodeInfo {
  mnemonic: string;
  format: OpcodeFormat;
  description?: string;
  operands: {
    count: number;
    types: OperandType[];
  };
  // 将来の拡張用フィールド
  cycles?: number;
  privileged?: boolean;
  conditional?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * z/OSアセンブラの主要オペコード定義
 * 将来、より詳細なデータベースに拡張可能
 */
export const OPCODE_DATABASE: Map<string, OpcodeInfo> = new Map([
  // 算術演算命令
  ["AR", { mnemonic: "AR", format: "RR", description: "Add Register", operands: { count: 2, types: ["register", "register"] } }],
  ["A", { mnemonic: "A", format: "RX", description: "Add", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["AH", { mnemonic: "AH", format: "RX", description: "Add Halfword", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["AFI", { mnemonic: "AFI", format: "RI", description: "Add Immediate", operands: { count: 2, types: ["register", "immediate"] } }],
  
  ["SR", { mnemonic: "SR", format: "RR", description: "Subtract Register", operands: { count: 2, types: ["register", "register"] } }],
  ["S", { mnemonic: "S", format: "RX", description: "Subtract", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  ["MR", { mnemonic: "MR", format: "RR", description: "Multiply Register", operands: { count: 2, types: ["register", "register"] } }],
  ["M", { mnemonic: "M", format: "RX", description: "Multiply", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  ["DR", { mnemonic: "DR", format: "RR", description: "Divide Register", operands: { count: 2, types: ["register", "register"] } }],
  ["D", { mnemonic: "D", format: "RX", description: "Divide", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // ロード/ストア命令
  ["LR", { mnemonic: "LR", format: "RR", description: "Load Register", operands: { count: 2, types: ["register", "register"] } }],
  ["L", { mnemonic: "L", format: "RX", description: "Load", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LA", { mnemonic: "LA", format: "RX", description: "Load Address", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LH", { mnemonic: "LH", format: "RX", description: "Load Halfword", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LM", { mnemonic: "LM", format: "RS", description: "Load Multiple", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  ["ST", { mnemonic: "ST", format: "RX", description: "Store", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STH", { mnemonic: "STH", format: "RX", description: "Store Halfword", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STM", { mnemonic: "STM", format: "RS", description: "Store Multiple", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // 比較命令
  ["CR", { mnemonic: "CR", format: "RR", description: "Compare Register", operands: { count: 2, types: ["register", "register"] } }],
  ["C", { mnemonic: "C", format: "RX", description: "Compare", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CH", { mnemonic: "CH", format: "RX", description: "Compare Halfword", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CLI", { mnemonic: "CLI", format: "SI", description: "Compare Logical Immediate", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  // 分岐命令
  ["B", { mnemonic: "B", format: "RX", description: "Branch", operands: { count: 1, types: ["base-displacement"] } }],
  ["BR", { mnemonic: "BR", format: "RR", description: "Branch on Register", operands: { count: 1, types: ["register"] } }],
  ["BC", { mnemonic: "BC", format: "RX", description: "Branch on Condition", operands: { count: 2, types: ["immediate", "base-displacement"] } }],
  ["BCR", { mnemonic: "BCR", format: "RR", description: "Branch on Condition Register", operands: { count: 2, types: ["immediate", "register"] } }],
  
  // 論理演算命令
  ["OR", { mnemonic: "OR", format: "RR", description: "OR", operands: { count: 2, types: ["register", "register"] } }],
  ["O", { mnemonic: "O", format: "RX", description: "OR", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["ORI", { mnemonic: "ORI", format: "SI", description: "OR Immediate", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  ["NR", { mnemonic: "NR", format: "RR", description: "AND", operands: { count: 2, types: ["register", "register"] } }],
  ["N", { mnemonic: "N", format: "RX", description: "AND", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["NI", { mnemonic: "NI", format: "SI", description: "AND Immediate", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  ["XR", { mnemonic: "XR", format: "RR", description: "XOR", operands: { count: 2, types: ["register", "register"] } }],
  ["X", { mnemonic: "X", format: "RX", description: "XOR", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // シフト命令
  ["SLL", { mnemonic: "SLL", format: "RS", description: "Shift Left Single Logical", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SRL", { mnemonic: "SRL", format: "RS", description: "Shift Right Single Logical", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SLA", { mnemonic: "SLA", format: "RS", description: "Shift Left Single Arithmetic", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SRA", { mnemonic: "SRA", format: "RS", description: "Shift Right Single Arithmetic", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // アセンブラ疑似命令
  ["CSECT", { mnemonic: "CSECT", format: "S", description: "Control Section", operands: { count: 0, types: [] } }],
  ["DSECT", { mnemonic: "DSECT", format: "S", description: "Dummy Section", operands: { count: 0, types: [] } }],
  ["USING", { mnemonic: "USING", format: "S", description: "Using Base Register", operands: { count: 2, types: ["memory", "register"] } }],
  ["DROP", { mnemonic: "DROP", format: "S", description: "Drop Base Register", operands: { count: 1, types: ["register"] } }],
  ["EQU", { mnemonic: "EQU", format: "S", description: "Equate", operands: { count: 1, types: ["immediate"] } }],
  ["DC", { mnemonic: "DC", format: "S", description: "Define Constant", operands: { count: 1, types: ["immediate"] } }],
  ["DS", { mnemonic: "DS", format: "S", description: "Define Storage", operands: { count: 1, types: ["immediate"] } }],
  ["END", { mnemonic: "END", format: "S", description: "End Program", operands: { count: 0, types: [] } }],
  ["TITLE", { mnemonic: "TITLE", format: "S", description: "Title", operands: { count: 1, types: ["string"] } }],
]);

/**
 * オペコード情報を取得
 */
export function getOpcodeInfo(mnemonic: string): OpcodeInfo | undefined {
  return OPCODE_DATABASE.get(mnemonic.toUpperCase());
}

/**
 * すべてのオペコードを取得（将来の拡張用）
 */
export function getAllOpcodes(): OpcodeInfo[] {
  return Array.from(OPCODE_DATABASE.values());
}
