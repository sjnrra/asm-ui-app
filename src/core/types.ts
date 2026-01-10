// トークンタイプ（拡張可能）
export const TokenType = {
  LABEL: "LABEL",
  OPCODE: "OPCODE",
  REGISTER: "REGISTER",      // R0, R1, etc.
  SYMBOL: "SYMBOL",          // 変数名、ラベル参照
  LITERAL: "LITERAL",        // =X'...', =C'...'
  NUMBER: "NUMBER",          // 数値
  OPERATOR: "OPERATOR",      // +, -, *, /, (, )
  STRING: "STRING",          // 文字列定数
  COMMENT: "COMMENT",
  WHITESPACE: "WHITESPACE",
  DELIMITER: "DELIMITER",    // カンマ、括弧など
  ADDRESSING: "ADDRESSING",  // アドレッシングモード（将来的に拡張）
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

export type AsmToken = {
  type: TokenType;
  text: string;
  columnStart: number;
  columnEnd: number;
  // 将来の拡張用メタデータ
  metadata?: {
    value?: string | number;
    resolvedAddress?: number;
    symbolRef?: string;
    [key: string]: unknown;
  };
};

export type AsmStatement = {
  lineNumber: number;
  rawText: string;
  label?: string;
  opcode?: string;
  operandsText?: string;
  comment?: string;
  tokens: AsmToken[];
  // 将来の拡張用フィールド
  instruction?: {
    mnemonic: string;
    format?: string;          // 命令フォーマット（RR, RX, RS, etc.）
    addressingMode?: string;
    operands?: Operand[];
  };
  errors?: ParseError[];
};

export type OperandType = "register" | "memory" | "immediate" | "base-displacement" | "indexed" | "string";

export type Operand = {
  type: OperandType;
  value: string;
  register?: string;
  displacement?: number;
  baseRegister?: string;
  indexRegister?: string;
  length?: number;
};

export type ParseError = {
  lineNumber: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
};

// 解析コンテキスト（将来の高度な解析用）
export type ParseContext = {
  symbols: Map<string, SymbolDefinition>;
  currentSection?: string;
  macros?: Map<string, MacroDefinition>;
  // 将来の拡張用
  [key: string]: unknown;
};

export type SymbolDefinition = {
  name: string;
  value: number | string;
  type: "label" | "variable" | "constant" | "equ";
  definedAt: number;
  scope?: string;
};

export type MacroDefinition = {
  name: string;
  parameters: string[];
  body: AsmStatement[];
  definedAt: number;
};

// 解析結果の全体構造
export type AssemblyResult = {
  statements: AsmStatement[];
  errors: ParseError[];
  symbols: Map<string, SymbolDefinition>;
  context: ParseContext;
};