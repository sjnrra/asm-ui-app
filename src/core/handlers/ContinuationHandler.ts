/**
 * 継続行処理モジュール
 * z/OSアセンブラの継続行（72桁目に非空白文字がある場合）を処理する
 */

/**
 * 継続行バッファの型定義
 */
export interface ContinuationBuffer {
  firstLine: string; // 最初の行の内容（カラム1-71、72桁目は除外）
  firstLineNumber: number; // 最初の行の行番号（継続行開始行の行番号）
  continuationLines: number[]; // 継続行の行番号リスト（最初の行を含む）
  continuationOperands: string[]; // 継続行のオペランド部分（カラム1-71の内容のみ）
  continuationRawLines: string[]; // 継続行の元の行の内容（完全な行、カラム72以降も含む、表示用）
}

/**
 * 処理済み行の型定義
 */
export interface ProcessedLine {
  content: string;
  originalLineNumber: number; // 元のソースコードでの行番号（1始まり）
  sourceFile?: string; // ソースファイル名（COPY展開用）
  expandedFrom?: string; // マクロ展開元のマクロ名
  isContinuation?: boolean; // この行が継続行かどうか
  continuationLines?: number[]; // 継続行の行番号リスト（最初の行を含む）
  continuationOperands?: string[]; // 継続行のオペランド部分
  continuationRawLines?: string[]; // 継続行の元の行の内容（完全な行）
}

/**
 * 継続行を結合して処理済み行リストを作成
 * 
 * @param lines ソースコードの行配列
 * @param baseLineNumber ベース行番号（デフォルト: 1）
 * @returns 処理済み行の配列
 */
export function processContinuations(
  lines: string[],
  baseLineNumber: number = 1
): ProcessedLine[] {
  const processedLines: ProcessedLine[] = [];
  let continuationBuffer: ContinuationBuffer | null = null;

  /**
   * 継続行の判定:
   * - 前の行の72桁目に文字がある
   */
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const originalLineNumber = baseLineNumber + i;

    // 現在の行の72桁目（インデックス71）に非空白文字があるかチェック
    const currentLineHasContinuation =
      line.length > 71 &&
      line[71] !== " " &&
      line[71] !== "\t" &&
      line[71] !== "" &&
      line[71] !== undefined;

    // 前の行の72桁目に非空白文字があるかチェック
    const prevLine = i > 0 ? lines[i - 1] : null;
    const prevLineHasContinuation =
      prevLine &&
      prevLine.length > 71 &&
      prevLine[71] !== " " &&
      prevLine[71] !== "\t" &&
      prevLine[71] !== "" &&
      prevLine[71] !== undefined;

    // 継続行開始: 現在の行の72桁目に文字があり、前の行の72桁目に文字がない場合
    const isContinuationStart = currentLineHasContinuation && !prevLineHasContinuation;

    // 継続行: 前の行の72桁目に文字がある場合、この行は継続行
    const isContinuation = prevLineHasContinuation;

    /**
     * 継続行バッファがある場合の処理
     */
    if (continuationBuffer) {
      if (isContinuation) {
        /**
         * 継続行の処理: 現在の行を継続行バッファに追加
         */
        const continuationContent = line.substring(0, 72).trimEnd();
        continuationBuffer.continuationOperands.push(continuationContent);
        continuationBuffer.continuationLines.push(originalLineNumber);
        continuationBuffer.continuationRawLines.push(line);
      } else {
        /**
         * 継続終了: バッファを確定してprocessedLinesに追加
         */
        const allContinuationOperands = continuationBuffer.continuationOperands.join(" ");
        let fullContent = continuationBuffer.firstLine;
        if (allContinuationOperands) {
          fullContent = continuationBuffer.firstLine + " " + allContinuationOperands;
        }

        processedLines.push({
          content: fullContent,
          originalLineNumber: continuationBuffer.firstLineNumber,
          continuationLines: continuationBuffer.continuationLines,
          continuationOperands: continuationBuffer.continuationOperands,
          continuationRawLines: continuationBuffer.continuationRawLines,
          isContinuation: false,
        });
        continuationBuffer = null;

        /**
         * 継続終了後、現在の行が新しい継続行開始かどうかをチェック
         */
        if (isContinuationStart) {
          const mainContent = line.substring(0, 72).trimEnd();
          continuationBuffer = {
            firstLine: mainContent,
            firstLineNumber: originalLineNumber,
            continuationLines: [originalLineNumber],
            continuationOperands: [],
            continuationRawLines: [],
          };
        } else {
          processedLines.push({
            content: line,
            originalLineNumber,
            isContinuation: false,
          });
        }
      }
    } else {
      /**
       * 継続行バッファがない場合の処理
       */
      if (isContinuationStart) {
        /**
         * 継続開始: 新しい継続行バッファを作成
         */
        const mainContent = line.substring(0, 72).trimEnd();
        continuationBuffer = {
          firstLine: mainContent,
          firstLineNumber: originalLineNumber,
          continuationLines: [originalLineNumber],
          continuationOperands: [],
          continuationRawLines: [],
        };
      } else {
        processedLines.push({
          content: line,
          originalLineNumber,
          isContinuation: false,
        });
      }
    }
  }

  /**
   * 最後に継続バッファが残っている場合の処理
   */
  if (continuationBuffer) {
    const allContinuationOperands = continuationBuffer.continuationOperands.join(" ");
    let fullContent = continuationBuffer.firstLine;
    if (allContinuationOperands) {
      fullContent = continuationBuffer.firstLine + " " + allContinuationOperands;
    }

    processedLines.push({
      content: fullContent,
      originalLineNumber: continuationBuffer.firstLineNumber,
      continuationLines: continuationBuffer.continuationLines,
      continuationOperands: continuationBuffer.continuationOperands,
      continuationRawLines: continuationBuffer.continuationRawLines,
      isContinuation: false,
    });
  }

  return processedLines;
}
