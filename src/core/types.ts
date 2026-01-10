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
  sourceFile?: string;        // 外部ファイルから読み込まれた場合のファイル名
  isExpanded?: boolean;       // マクロ展開された行かどうか（非推奨: 展開行を表示しないため）
  expandedFrom?: string;      // 展開元のマクロ名（非推奨: 展開行を表示しないため）
  isMacroCall?: boolean;      // マクロ呼び出し行かどうか
  macroName?: string;         // 呼び出されたマクロ名
  isContinuation?: boolean;   // この行が継続行かどうか（カラム72に+などがある場合）
  continuationOf?: number;    // この行がどの行の継続か（行番号）
  continuationCount?: number; // 継続行が何行続いているか（最初の行から数えた継続行の数、最初の行は0）
  // 将来の拡張用フィールド
  instruction?: {
    mnemonic: string;
    format?: string;          // 命令フォーマット（RR, RX, RS, etc.）
    addressingMode?: string;
    description?: string;     // 命令の説明
    operands?: Operand[];
  };
  errors?: ParseError[];
};

export type OperandType = "register" | "memory" | "immediate" | "base-displacement" | "indexed" | "string" | "number";

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
  sourceFile?: string;  // シンボルが定義されたソースファイル
  dataType?: string;    // データ型（F, H, X, C, CL10, DS F など）
  length?: number;      // データ長（バイト数）
};

export type MacroDefinition = {
  name: string;
  parameters: string[];
  body: AsmStatement[];  // 解析済みのステートメント
  bodyLines?: string[];  // 元の行テキスト（展開用、パラメータ置換用）
  definedAt: number;
  sourceFile?: string;  // マクロ定義が定義されたソースファイル
};

// 解析結果の全体構造
export type AssemblyResult = {
  statements: AsmStatement[];
  errors: ParseError[];
  symbols: Map<string, SymbolDefinition>;
  context: ParseContext;
};