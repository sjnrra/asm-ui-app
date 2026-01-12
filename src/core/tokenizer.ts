// tokenizer.ts は lineParser.ts に統合されました
// このファイルは将来の拡張用に保持します

import type { AsmToken } from "./Types";

/**
 * より詳細なトークン化が必要な場合の拡張用関数
 * 現時点では lineParser.ts の実装で十分ですが、
 * 将来的に高度なトークン化（マクロ展開、条件付きコンパイルなど）が必要になった場合に使用
 */
export function tokenizeAdvanced(_text: string, _startColumn: number): AsmToken[] {
  // 将来の拡張用のプレースホルダー
  // より高度なトークン化ロジックを実装可能
  return [];
}