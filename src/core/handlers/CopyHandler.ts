/**
 * COPY文処理モジュール
 * COPY命令による外部ファイルのインクルードを処理する
 */

import type { AsmStatement, ParseError } from "../Types";
import type { FileManager } from "../FileManager";

/**
 * COPY文処理の結果
 */
export interface CopyResult {
  lines: string[];
  insertedLines: number;
  fileName?: string;
  error?: ParseError;
}

/**
 * COPY文処理クラス
 */
export class CopyHandler {
  private copyStack: Set<string> = new Set(); // COPY文の循環参照チェック用
  private maxCopyDepth: number = 10; // 最大COPY深度
  private currentCopyDepth: number = 0; // 現在のCOPY深度

  /**
   * COPY文を処理してファイルを読み込む
   * 
   * @param statement COPY命令のステートメント
   * @param lineNumber 行番号
   * @param fileManager ファイルマネージャー
   * @returns COPY処理の結果
   */
  processCopyStatement(
    statement: AsmStatement,
    lineNumber: number,
    fileManager: FileManager
  ): CopyResult {
    if (!statement.operandsText) {
      return {
        lines: [],
        insertedLines: 0,
        error: {
          lineNumber,
          column: 0,
          message: "COPY命令にファイル名が指定されていません",
          severity: "error",
        },
      };
    }

    // オペランドからファイル名を抽出
    const fileName = statement.operandsText.split(/\s*,\s*/)[0].trim();
    const normalizedFileName = fileName.toUpperCase();

    // 循環参照チェック
    if (this.copyStack.has(normalizedFileName)) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: 循環参照が検出されました。ファイル "${fileName}" は既に読み込み中です。`,
          severity: "error",
        },
      };
    }

    // 最大深度チェック
    if (this.currentCopyDepth >= this.maxCopyDepth) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: 最大深度（${this.maxCopyDepth}）を超えました。ファイル "${fileName}" の読み込みをスキップします。`,
          severity: "error",
        },
      };
    }

    const file = fileManager.findFile(fileName);

    if (!file) {
      return {
        lines: [],
        insertedLines: 0,
        fileName,
        error: {
          lineNumber,
          column: 0,
          message: `COPY命令: ファイル "${fileName}" が見つかりません`,
          severity: "warning",
        },
      };
    }

    // 循環参照チェック用にスタックに追加
    this.copyStack.add(normalizedFileName);
    this.currentCopyDepth++;

    try {
      // ファイルの内容を行ごとに返す
      const fileLines = file.content.split("\n");
      return {
        lines: fileLines,
        insertedLines: fileLines.length,
        fileName,
      };
    } finally {
      // スタックから削除
      this.copyStack.delete(normalizedFileName);
      this.currentCopyDepth--;
    }
  }

  /**
   * 循環参照チェック用のスタックをリセット
   */
  reset(): void {
    this.copyStack.clear();
    this.currentCopyDepth = 0;
  }
}
