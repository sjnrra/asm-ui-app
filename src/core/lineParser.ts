import type { AsmStatement, AsmToken } from "./types";
import { TokenType } from "./types";

/**
 * z/OSアセンブラの固定カラム形式を解析
 * カラム1-8: ラベル（オプション）
 * カラム9: 空白（必須）
 * カラム10-71: 命令とオペランド
 * カラム72以降: コメント（継続行の場合はカラム72に'X'など）
 */
export function parseLine(line: string, lineNumber: number, hasContinuationOperands?: boolean): AsmStatement {
  const rawText = line;
  const trimmed = line.trimEnd();
  
  // 空行または空白のみの行
  if (!trimmed || trimmed.trim().length === 0) {
    return {
      lineNumber,
      rawText,
      tokens: [
        {
          type: TokenType.WHITESPACE,
          text: line,
          columnStart: 0,
          columnEnd: line.length,
        },
      ],
    };
  }

  const tokens: AsmToken[] = [];
  let label: string | undefined;
  let opcode: string | undefined;
  let operandsText: string | undefined;
  let comment: string | undefined;

  // 元の行での最初の非空白文字の位置を取得
  const firstNonSpaceInLine = line.search(/\S/);
  
  // コメント行のチェック（カラム1に*がある場合）
  if (firstNonSpaceInLine >= 0 && line[firstNonSpaceInLine] === "*") {
    // コメント行全体
    return {
      lineNumber,
      rawText,
      comment: trimmed.substring(trimmed.search(/\S/)),
      tokens: [
        {
          type: TokenType.COMMENT,
          text: line,
          columnStart: 0,
          columnEnd: line.length,
        },
      ],
    };
  }

  // 継続行のチェック（カラム72に非空白文字がある場合）
  const isContinuation = line.length > 71 && line[71] !== " " && line[71] !== "\t" && line[71] !== "";

  // カラム1-8: ラベル
  // z/OSアセンブラの固定カラム形式では、ラベルはカラム1-8に収まる必要がある
  // ただし、実際のファイルでは、ラベルが8文字を超える場合もある（例: RESTOREREGS, LOADCONST, BUFFERLEN）
  // その場合、実際の行のラベル全体を認識し、ハイライト表示で正確に表示するため、
  // ラベルが8文字を超える場合でも、実際のラベル全体をトークンとして扱う
  const labelArea = line.substring(0, Math.min(8, line.length));
  const labelTrimmed = labelArea.trim();
  
  // ラベルの条件: カラム1-8に非空白文字がある場合
  // カラム9が空白でない場合、ラベルが8文字を超えている可能性がある
  if (labelTrimmed.length > 0) {
    // カラム1-8の最初の非空白文字の位置を取得
    const labelStartInArea = labelArea.length - labelArea.trimStart().length;
    
    // ラベルが8文字を超えるかどうかを確認（カラム9が空白でない場合）
    let actualLabelEnd = labelStartInArea + labelTrimmed.length;
    let actualLabelText = labelTrimmed;
    
    if (line.length > 8 && line[8] !== " " && line[8] !== "\t") {
      // カラム9が空白でない場合、ラベルが8文字を超えている
      // カラム9以降もラベルの一部として扱う（表示のため）
      // 実際のラベルの終了位置を探す（空白または命令開始まで）
      for (let i = 8; i < line.length && i < 72; i++) {
        if (/\s/.test(line[i])) {
          actualLabelEnd = i;
          break;
        }
        actualLabelText += line[i];
        actualLabelEnd = i + 1;
      }
    } else {
      // ラベルは8文字以内
      const maxLabelLength = Math.min(8 - labelStartInArea, labelTrimmed.length);
      actualLabelText = labelTrimmed.substring(0, maxLabelLength);
      actualLabelEnd = labelStartInArea + actualLabelText.length;
    }
    
    if (actualLabelText.length > 0) {
      // 有効なラベル名は最初の8文字（z/OSの仕様に従う）
      label = actualLabelText.substring(0, Math.min(8, actualLabelText.length));
      
      // ラベル前の空白
      if (labelStartInArea > 0) {
        tokens.push({
          type: TokenType.WHITESPACE,
          text: line.substring(0, labelStartInArea),
          columnStart: 0,
          columnEnd: labelStartInArea,
        });
      }
      
      // ラベル全体をトークンとして追加（8文字を超える場合も含む）
      tokens.push({
        type: TokenType.LABEL,
        text: line.substring(labelStartInArea, actualLabelEnd),
        columnStart: labelStartInArea,
        columnEnd: actualLabelEnd,
      });
      
      // ラベルの後の空白（命令部分の開始まで）
      if (actualLabelEnd < line.length) {
        // 命令部分の開始位置を探す
        let instructionStartPos = actualLabelEnd;
        for (let i = actualLabelEnd; i < line.length && i < 72; i++) {
          if (!/\s/.test(line[i])) {
            instructionStartPos = i;
            break;
          }
        }
        
        if (instructionStartPos > actualLabelEnd) {
          tokens.push({
            type: TokenType.WHITESPACE,
            text: line.substring(actualLabelEnd, instructionStartPos),
            columnStart: actualLabelEnd,
            columnEnd: instructionStartPos,
          });
        }
      }
    }
  }

  // カラム10-71: 命令とオペランド
  // z/OSアセンブラでは、ラベルがない場合でも命令はカラム10（インデックス9）から始まる
  // ただし、カラム1-8が完全に空白で、カラム9以前から命令が始まる場合は柔軟に対応
  // ラベルがある場合、命令はラベルの後の空白の後から始まる
  let instructionStart = 9; // デフォルトはカラム10
  if (label) {
    // ラベルがある場合、ラベルトークンの終了位置の後に空白があるので、その後の最初の非空白文字を探す
    const labelToken = tokens.find(t => t.type === TokenType.LABEL);
    if (labelToken) {
      // ラベルトークンの後に空白トークンがある場合、その後の位置から命令開始
      const whitespaceAfterLabel = tokens.find(t => 
        t.type === TokenType.WHITESPACE && t.columnStart === labelToken.columnEnd
      );
      if (whitespaceAfterLabel) {
        instructionStart = whitespaceAfterLabel.columnEnd;
      } else {
        // 空白トークンがない場合、ラベル終了位置の後から最初の非空白文字を探す
        for (let i = labelToken.columnEnd; i < line.length && i < 72; i++) {
          if (!/\s/.test(line[i])) {
            instructionStart = i;
            break;
          }
        }
      }
    } else {
      // ラベルトークンが見つからない場合、カラム9以降から探す
      for (let i = 9; i < line.length && i < 72; i++) {
        if (!/\s/.test(line[i])) {
          instructionStart = i;
          break;
        }
      }
    }
  } else {
    // ラベルがない場合、カラム9以前から命令が始まる場合は柔軟に対応
    instructionStart = firstNonSpaceInLine < 9 && firstNonSpaceInLine >= 0 ? firstNonSpaceInLine : 9;
  }
  const instructionEnd = isContinuation ? 71 : Math.min(line.length, 72);
  
  // ラベルがない場合、カラム1-9の空白を追加（固定カラム形式を維持）
  // 元の行の実際の空白を保持
  if (!label && instructionStart === 9) {
    // 元の行のカラム1-9部分を確認
    const prefixLength = Math.min(9, line.length);
    if (prefixLength > 0) {
      const prefix = line.substring(0, prefixLength);
      // 実際の空白文字を保持（タブは空白に変換）
      const whitespaceText = prefix.replace(/\t/g, " ");
      // 9文字に満たない場合は空白で埋める
      const finalWhitespace = whitespaceText.length >= 9 
        ? whitespaceText.substring(0, 9)
        : whitespaceText + " ".repeat(9 - whitespaceText.length);
      
      tokens.push({
        type: TokenType.WHITESPACE,
        text: finalWhitespace,
        columnStart: 0,
        columnEnd: 9,
      });
    } else {
      // 行が9文字未満の場合は9文字の空白を追加
      tokens.push({
        type: TokenType.WHITESPACE,
        text: " ".repeat(9),
        columnStart: 0,
        columnEnd: 9,
      });
    }
  }
  
  let instructionPart = "";
  if (instructionStart < instructionEnd) {
    // trim()せずに、元の行の命令部分を取得（先頭の空白は既にトークンとして追加済み）
    const rawInstruction = line.substring(instructionStart, instructionEnd);
    // 先頭と末尾の空白を削除（トークン化のため）
    instructionPart = rawInstruction.trim();
    // ただし、先頭の空白は既にトークンとして追加されているので、ここではtrimで問題なし
  }

  if (instructionPart) {
    // コメント開始位置を探す（"*"が現れる位置、ただしオペランド内の*は除外）
    // オペランド内の*（例: "*,12", "(,15)", "BAS 13,*+4+72"など）はコメントではない
    let commentStartIndex = -1;
    const originalPart = line.substring(instructionStart, instructionEnd);
    
    // まず、オペコードとオペランドを分離
    // シングルクォーテーションまたはダブルクォーテーションで囲まれた部分内の空白は無視する
    // 継続行がある場合、最初の行のオペコードのみを抽出し、残りをすべてオペランドとして扱う
    let opcodePart = "";
    let operandsPart = "";
    let inString = false;
    let stringChar = "";
    let opcodeEndPos = -1;
    
    // 継続行がある場合、最初の行のオペコードを特定する必要がある
    // 継続行の内容が結合されている場合、最初の行のオペコード以降をすべてオペランドとして扱う
    if (hasContinuationOperands) {
      // 継続行が結合された行を処理する場合と、個別の継続行を処理する場合を区別する必要がある
      // 個別の継続行の場合、内容全体がオペランドとして扱われる（オペコードは存在しない）
      // 結合された行の場合、最初の行のオペコードを特定する必要がある
      
      // 継続行が結合された後の行は、最初の行のオペコードとオペランド、そして継続行のオペランドが結合されている
      // 最初の行のオペコードを特定するために、最初の空白で区切られた最初の単語をオペコードと仮定
      // ただし、これはラベルの後の最初の単語（命令部分の最初の単語）
      
      // 文字列内の空白を考慮して最初の空白を探す
      let firstSpaceIndex = -1;
      inString = false;
      stringChar = "";
      
      for (let i = 0; i < instructionPart.length; i++) {
        const char = instructionPart[i];
        
        // 文字列開始/終了のチェック
        if ((char === "'" || char === '"') && (i === 0 || instructionPart[i - 1] !== "\\")) {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            if (i + 1 >= instructionPart.length || instructionPart[i + 1] !== stringChar) {
              inString = false;
              stringChar = "";
            } else {
              i++; // エスケープされたクォート
            }
          }
          continue;
        }
        
        // 文字列内の空白は無視
        if (inString) {
          continue;
        }
        
        // 文字列外の空白を見つけた場合
        if (/\s/.test(char)) {
          firstSpaceIndex = i;
          break;
        }
      }
      
      // 継続行の場合、最初の空白が見つかっても、それがオペコードかどうかを判定する必要がある
      // 継続行は通常、オペランドから始まるので、最初の空白までの部分がオペコードとして認識される可能性がある
      // しかし、継続行の内容のみが渡されている場合（個別の継続行を処理する場合）、すべてがオペランドとして扱われるべき
      
      // 個別の継続行かどうかを判定
      // 継続行の内容は通常：
      // 1. 先頭が空白でインデントされている
      // 2. =、,、( などのオペランド文字で始まる
      // 3. または、内容が短く、オペコードとして認識される可能性が低い（例: DDNAME=SYSUT1,MACRF=IN）
      
      const trimmedInstruction = instructionPart.trim();
      const startsWithOperand = trimmedInstruction.startsWith("=") || 
                                 trimmedInstruction.startsWith(",") || 
                                 trimmedInstruction.startsWith("(") ||
                                 /^\s/.test(instructionPart); // 先頭が空白
      
      // 最初の空白までの部分がオペコードとして認識される可能性があるかチェック
      // オペコードは通常、短い英字の単語（例: ACB, RPL, WTOなど）
      // 継続行の内容（例: DDNAME=SYSUT1,MACRF=IN）は、オペコードとしては長すぎる
      const firstWord = firstSpaceIndex > 0 ? instructionPart.substring(0, firstSpaceIndex).trim() : trimmedInstruction;
      const looksLikeOpcode = /^[A-Z]{1,8}$/i.test(firstWord); // 1-8文字の英字のみ
      
      // 個別の継続行を処理する場合、hasContinuationOperands が true で、
      // 内容がオペランドから始まるか、オペコードとして認識されない場合は、すべてをオペランドとして扱う
      // 継続行の場合、オペコードは存在しない（最初の行でのみオペコードが存在）
      if (startsWithOperand || !looksLikeOpcode || trimmedInstruction.length === 0) {
        // 個別の継続行の場合：すべてをオペランドとして扱う
        operandsPart = instructionPart.trim();
        opcodePart = "";
        opcodeEndPos = 0;
      } else {
        // 結合された行全体の場合：最初の行のオペコードを抽出する
        // ただし、hasContinuationOperands が true の場合、これは結合された行全体を処理する場合のみ
        // 個別の継続行を処理する場合、ここには来ないはず
        if (firstSpaceIndex > 0) {
          // 最初の空白までの部分がオペコード
          opcodePart = instructionPart.substring(0, firstSpaceIndex).trim();
          operandsPart = instructionPart.substring(firstSpaceIndex).trim();
          opcodeEndPos = firstSpaceIndex;
        } else {
          // 空白がない場合、すべてをオペランドとして扱う
          operandsPart = instructionPart.trim();
          opcodePart = "";
          opcodeEndPos = 0;
        }
      }
    }
    
    // 継続行がない場合、通常の処理を行う
    if (!hasContinuationOperands) {
      for (let i = 0; i < instructionPart.length; i++) {
      const char = instructionPart[i];
      
      // 文字列開始/終了のチェック
      if ((char === "'" || char === '"') && (i === 0 || instructionPart[i - 1] !== "\\")) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          // 文字列終了（エスケープされたクォートのチェック）
          if (i + 1 >= instructionPart.length || instructionPart[i + 1] !== stringChar) {
            inString = false;
            stringChar = "";
          } else {
            // エスケープされたクォート
            i++; // 次の文字もスキップ
          }
        }
        // オペコードが見つかっていない場合、オペコードに追加
        if (opcodeEndPos < 0) {
          opcodePart += char;
        } else {
          operandsPart += char;
        }
        continue;
      }
      
      // 文字列内の場合は空白を無視（文字列の一部として扱う）
      if (inString) {
        if (opcodeEndPos < 0) {
          opcodePart += char;
        } else {
          operandsPart += char;
        }
        continue;
      }
      
      // 文字列外の空白でオペコードとオペランドを分離
      if (/\s/.test(char)) {
        if (opcodeEndPos < 0 && opcodePart.length > 0) {
          // オペコードの終了位置を記録
          opcodeEndPos = i;
        }
        // オペコードが見つかった後の空白はオペランドに含めない（オペランド開始の空白は除外）
        if (opcodeEndPos >= 0 && operandsPart.length > 0) {
          // 既にオペランドが始まっている場合は空白を追加（複数のオペランド間の空白）
          operandsPart += char;
        }
        continue;
      }
      
      // 非空白文字
      if (opcodeEndPos < 0) {
        opcodePart += char;
      } else {
        operandsPart += char;
      }
    }
    }
    
    // 前後の空白を削除（継続行がある場合は既に処理済み）
    if (!hasContinuationOperands) {
      opcodePart = opcodePart.trim();
      operandsPart = operandsPart.trim();
    }
    
    // オペコードの位置を元の行で特定
    const opcodeIndex = originalPart.indexOf(opcodePart);
    
    // オペコードの終了位置を取得
    const opcodeEndInOriginal = opcodeIndex >= 0 ? opcodeIndex + opcodePart.length : -1;
    
    // オペコードの直後に空白が10個以上連続する場合、以降をコメントとして扱う
    let skipNormalOperandParsing = false;
    if (opcodeEndInOriginal >= 0 && opcodeEndInOriginal < originalPart.length) {
      let spaceCount = 0;
      let firstNonSpaceAfterOpcode = -1;
      // オペコードの直後から空白をカウント
      for (let i = opcodeEndInOriginal; i < originalPart.length; i++) {
        if (/\s/.test(originalPart[i])) {
          spaceCount++;
        } else {
          firstNonSpaceAfterOpcode = i;
          break;
        }
      }
      
      // 空白が10個以上連続する場合、最初の非空白文字以降をコメントとして扱う
      if (spaceCount >= 10 && firstNonSpaceAfterOpcode >= 0) {
        // オペランド部分は空
        operandsPart = "";
        // コメント開始位置を設定（originalPart内の相対位置）
        commentStartIndex = firstNonSpaceAfterOpcode;
        skipNormalOperandParsing = true;
      }
    }
    
    // オペランド部分が存在する場合、オペランドとコメントを分離
    // オペランドは空白1つで区切られるが、コメントは空白2つ以上で区切られる
    if (operandsPart && !skipNormalOperandParsing) {
      
      if (opcodeEndInOriginal >= 0) {
        // オペコードの終了位置から、最初の非空白文字（オペランドの開始）を探す
        let operandStartInOriginal = -1;
        for (let i = opcodeEndInOriginal; i < originalPart.length; i++) {
          if (!/\s/.test(originalPart[i])) {
            operandStartInOriginal = i;
            break;
          }
        }
        
        if (operandStartInOriginal >= 0) {
          // オペランドの終了位置を特定
          // オペランドは、空白が1つのみで区切られるが、空白が2つ以上続いた後はコメント
          // シングルクォーテーションまたはダブルクォーテーションで囲まれた部分内の空白は無視する
          let operandEndInOriginal = operandStartInOriginal;
          let lastNonSpacePos = operandStartInOriginal;
          let consecutiveSpaces = 0;
          let inString = false;
          let stringChar = "";
          
          for (let i = operandStartInOriginal; i < originalPart.length; i++) {
            const char = originalPart[i];
            
            // 文字列開始/終了のチェック
            if ((char === "'" || char === '"') && (i === 0 || originalPart[i - 1] !== "\\")) {
              if (!inString) {
                // 文字列開始
                inString = true;
                stringChar = char;
              } else if (char === stringChar) {
                // 文字列終了（エスケープされたクォートのチェック）
                // 次の文字も同じクォートの場合はエスケープされたクォート
                if (i + 1 >= originalPart.length || originalPart[i + 1] !== stringChar) {
                  inString = false;
                  stringChar = "";
                } else {
                  // エスケープされたクォートなのでスキップ
                  i++; // 次の文字もスキップ
                }
              }
              // 文字列内の非空白文字として扱う
              consecutiveSpaces = 0;
              lastNonSpacePos = i + 1;
              operandEndInOriginal = i + 1;
              continue;
            }
            
            // 文字列内の場合は空白を無視
            if (inString) {
              lastNonSpacePos = i + 1;
              operandEndInOriginal = i + 1;
              continue;
            }
            
            if (/\s/.test(char)) {
              consecutiveSpaces++;
              // 空白が2つ以上続いた場合、オペランドの終了とみなす
              if (consecutiveSpaces >= 2) {
                // オペランドの終了位置は最後の非空白文字の位置+1
                operandEndInOriginal = lastNonSpacePos;
                break;
              }
            } else {
              // 非空白文字が見つかった
              consecutiveSpaces = 0;
              lastNonSpacePos = i + 1;
              operandEndInOriginal = i + 1;
            }
          }
          
          // オペランド部分を抽出（元の行から直接取得）
          if (operandEndInOriginal > operandStartInOriginal) {
            operandsPart = originalPart.substring(operandStartInOriginal, operandEndInOriginal).trim();
            
            // オペランド終了後に空白が2つ以上続いてテキストがある場合、コメントとして設定
            let commentStartCandidate = -1;
            let consecutiveSpaces = 0;
            for (let i = operandEndInOriginal; i < originalPart.length; i++) {
              if (/\s/.test(originalPart[i])) {
                consecutiveSpaces++;
                if (consecutiveSpaces >= 2 && commentStartCandidate < 0) {
                  commentStartCandidate = i - consecutiveSpaces + 1;
                }
              } else {
                // 非空白文字が見つかった
                if (consecutiveSpaces >= 2 && commentStartCandidate >= 0) {
                  // 空白が2つ以上続いた後にテキストがある = コメント
                  commentStartIndex = commentStartCandidate;
                  break;
                }
                // 空白が1つ以下の場合はオペランドの一部とみなす（これは起こらないはず）
                consecutiveSpaces = 0;
                commentStartCandidate = -1;
              }
            }
          }
        }
      }
    }
    
    // オペランド部分が存在する場合、オペランド内の*を除外
    if (operandsPart && operandsPart.trim() && commentStartIndex < 0) {
      // オペランド部分を解析して、オペランドの終了位置を特定
      // オペランドは括弧、カンマ、空白で区切られる
      const trimmedOperands = operandsPart.trim();
      
      // オペランド部分内の*の位置をすべてチェック
      // オペランド内の*のパターン: *,12, (,15), *+4, など
      // オペランド内の*は、カンマ、括弧、演算子（+, -, *, /）の前後に現れる
      
      // より簡単な方法: オペランド部分全体を解析し、オペランドが終了した位置を特定
      // オペランドの終了は、最後の非空白文字（*以外）の後、またはオペランドが*のみの場合
      
      // オペランド部分の最後の有効な文字（*以外の非空白文字）を探す
      let lastValidCharIndex = -1;
      for (let i = trimmedOperands.length - 1; i >= 0; i--) {
        const char = trimmedOperands[i];
        if (!/\s/.test(char) && char !== "*") {
          lastValidCharIndex = i;
          break;
        }
      }
      
      if (lastValidCharIndex >= 0) {
        // オペランド部分の後に*がある場合をチェック
        const afterOperand = trimmedOperands.substring(lastValidCharIndex + 1).trim();
        if (afterOperand.startsWith("*")) {
          // これはオペランドの後のコメント
          // 元の行での位置を計算
          const opcodeInOriginal = originalPart.indexOf(opcodePart);
          if (opcodeInOriginal >= 0) {
            const operandStartInOriginal = originalPart.indexOf(trimmedOperands, opcodeInOriginal + opcodePart.length);
            if (operandStartInOriginal >= 0) {
              commentStartIndex = operandStartInOriginal + lastValidCharIndex + 1 + (trimmedOperands.substring(lastValidCharIndex + 1).indexOf("*"));
            }
          }
        }
      } else {
        // オペランドが*のみ、または*で構成されている場合
        // これはオペランドとして扱う（コメントではない）
      }
    }
    
    // 上記の方法で見つからない場合、元の行から直接探す
    if (commentStartIndex < 0) {
      // オペランド部分の終了を特定する
      // 元の行から、オペコード+オペランドの後に現れる*を探す
      const opcodeIndex = originalPart.indexOf(opcodePart);
      if (opcodeIndex >= 0) {
        let searchStart = opcodeIndex + opcodePart.length;
        
        if (operandsPart) {
          const trimmedOperands = operandsPart.trim();
          // オペランド部分の位置を元の行で特定
          const operandStart = originalPart.indexOf(trimmedOperands, searchStart);
          if (operandStart >= 0) {
            // オペランド部分の最後の非空白文字（*以外）を探す
            let lastNonSpacePos = -1;
            for (let i = trimmedOperands.length - 1; i >= 0; i--) {
              if (!/\s/.test(trimmedOperands[i]) && trimmedOperands[i] !== "*") {
                lastNonSpacePos = operandStart + i + 1;
                break;
              }
            }
            
            if (lastNonSpacePos >= 0) {
              searchStart = lastNonSpacePos;
            } else {
              // オペランドが*のみ、または*で終わる場合
              // オペランド全体が*の場合は、その後の*を探さない（すべてオペランド）
              // ただし、オペランド部分の後に空白+*がある場合はコメント
              const operandEnd = operandStart + trimmedOperands.length;
              searchStart = operandEnd;
            }
          }
        }
        
        // オペランドの後に現れる*を探す（コメント）
        let foundAsterisk = false;
        for (let i = searchStart; i < originalPart.length; i++) {
          if (/\s/.test(originalPart[i])) {
            continue; // 空白はスキップ
          }
          if (originalPart[i] === "*") {
            // *の前が空白で、*の後も空白または行末の場合、コメントとみなす
            const beforeChar = i > 0 ? originalPart[i - 1] : "";
            const afterChar = i < originalPart.length - 1 ? originalPart[i + 1] : "";
            
            if ((beforeChar === " " || beforeChar === "\t") && 
                (afterChar === " " || afterChar === "\t" || afterChar === "" || i === originalPart.length - 1)) {
              commentStartIndex = i;
              foundAsterisk = true;
              break;
            }
          } else {
            // 非空白の非*文字が見つかった場合、コメントではない
            break;
          }
        }
        
        // *が見つからない場合、オペランド終了後に空白が2つ以上続いた後にテキストがある場合はコメント
        if (!foundAsterisk && commentStartIndex < 0) {
          // オペコード+オペランドの終了位置を特定（searchStartは既にオペランド終了位置を指している）
          let instructionEndPos = searchStart;
          
          // オペランド部分が存在する場合、オペランドの終了位置をより正確に計算
          if (operandsPart && operandsPart.trim()) {
            const trimmedOperands = operandsPart.trim();
            // オペランド部分の位置を元の行で特定
            const operandStart = originalPart.indexOf(trimmedOperands, opcodeIndex + opcodePart.length);
            if (operandStart >= 0) {
              // オペランド部分の終了位置を計算（括弧やカンマを考慮）
              let operandEnd = operandStart + trimmedOperands.length;
              
              // 開き括弧がある場合、対応する閉じ括弧まで含める
              let openParens = 0;
              for (let i = 0; i < trimmedOperands.length; i++) {
                if (trimmedOperands[i] === "(") openParens++;
                else if (trimmedOperands[i] === ")") openParens--;
              }
              
              // 開き括弧が閉じられていない場合、元の行で閉じ括弧を探す
              if (openParens > 0) {
                for (let j = operandEnd; j < originalPart.length && j < operandEnd + 20; j++) {
                  if (originalPart[j] === ")") {
                    operandEnd = j + 1;
                    break;
                  }
                  if (!/\s/.test(originalPart[j]) && originalPart[j] !== ")") {
                    break;
                  }
                }
              }
              
              // オペランドの最後の有効文字の位置を探す
              let lastValidPos = operandStart;
              for (let i = trimmedOperands.length - 1; i >= 0; i--) {
                const char = trimmedOperands[i];
                if (!/\s/.test(char)) {
                  lastValidPos = operandStart + i + 1;
                  break;
                }
              }
              
              instructionEndPos = Math.max(operandEnd, lastValidPos);
            }
          }
          
          // 命令の終了位置から、空白が2つ以上続いた後に非空白文字があるかチェック
          let consecutiveSpaces = 0;
          let commentCandidateStart = -1;
          for (let i = instructionEndPos; i < originalPart.length; i++) {
            if (/\s/.test(originalPart[i])) {
              consecutiveSpaces++;
              if (consecutiveSpaces >= 2 && commentCandidateStart < 0) {
                commentCandidateStart = i - consecutiveSpaces + 1;
              }
            } else {
              // 非空白文字が見つかった
              if (consecutiveSpaces >= 2 && commentCandidateStart >= 0) {
                // 空白が2つ以上続いた後にテキストがある = コメント
                commentStartIndex = commentCandidateStart;
                break;
              }
              // 空白が1つ以下の場合はオペランドの一部とみなす（コメントではない）
              consecutiveSpaces = 0;
              commentCandidateStart = -1;
            }
          }
        }
      }
    }

    if (commentStartIndex >= 0) {
      // コメントがある場合
      const instruction = originalPart.substring(0, commentStartIndex).trim();
      comment = originalPart.substring(commentStartIndex).trim();
      
      if (instruction) {
        // 命令部分をトークン化（オペランド内の*を含む）
        const instTokens = tokenizeInstructionPart(instruction, instructionStart);
        tokens.push(...instTokens);
        
        // オペコードとオペランドを抽出（文字列内の空白を考慮）
        // 既に設定された operandsPart がある場合はそれを使用、ない場合は分割する
        // ただし、hasContinuationOperands が true の場合、継続行なのでオペコードは存在しない
        if (hasContinuationOperands) {
          // 継続行の場合、すべてをオペランドとして扱う
          opcode = undefined;
          operandsText = instruction.trim();
        } else if (operandsPart) {
          // operandsPart が instruction に含まれているか確認
          const operandsInInstruction = instruction.indexOf(operandsPart);
          if (operandsInInstruction >= 0) {
            // operandsPart の開始位置からオペコードを抽出
            const beforeOperands = instruction.substring(0, operandsInInstruction).trim();
            const opcodeParts = beforeOperands.split(/\s+/);
            opcode = opcodeParts[opcodeParts.length - 1] || opcodePart;
            operandsText = operandsPart;
          } else {
            // operandsPart が instruction に含まれていない場合、文字列内の空白を考慮して分割
            const splitResult = splitOpcodeAndOperands(instruction);
            opcode = splitResult.opcode;
            operandsText = splitResult.operands;
          }
        } else {
          // operandsPart が設定されていない場合、文字列内の空白を考慮して分割
          const splitResult = splitOpcodeAndOperands(instruction);
          opcode = splitResult.opcode;
          operandsText = splitResult.operands;
        }
      }
      
      // コメントトークン（元の文字列位置を使用）
      const commentStartPos = instructionStart + commentStartIndex;
      tokens.push({
        type: TokenType.COMMENT,
        text: originalPart.substring(commentStartIndex),
        columnStart: commentStartPos,
        columnEnd: instructionEnd,
      });
    } else {
      // コメントなし - オペランド内の*を含む命令全体をトークン化
      const instTokens = tokenizeInstructionPart(instructionPart, instructionStart);
      tokens.push(...instTokens);
      
      // オペコードとオペランドを抽出（文字列内の空白を考慮）
      // 既に設定された operandsPart がある場合はそれを使用
      if (operandsPart) {
        // opcodePart は既に設定されているのでそれを使用
        // ただし、hasContinuationOperands が true の場合、継続行なのでオペコードは存在しない
        opcode = hasContinuationOperands ? undefined : opcodePart;
        operandsText = operandsPart;
      } else {
        // operandsPart が設定されていない場合、文字列内の空白を考慮して分割
        // ただし、hasContinuationOperands が true の場合、継続行なのでオペコードは存在しない
        if (hasContinuationOperands) {
          // 継続行の場合、すべてをオペランドとして扱う
          opcode = undefined;
          operandsText = instructionPart.trim();
        } else {
          const splitResult = splitOpcodeAndOperands(instructionPart);
          opcode = splitResult.opcode;
          operandsText = splitResult.operands;
        }
      }
    }
  } else if (isContinuation && line.length > 72) {
    // 継続行のみ（カラム72以降）
    comment = line.substring(72).trim();
    if (comment) {
      tokens.push({
        type: TokenType.COMMENT,
        text: line.substring(72),
        columnStart: 72,
        columnEnd: line.length,
      });
    }
  } else if (!label && trimmed.length > 0) {
    // ラベルもなく、命令部分も空の場合（インデントされたコメントなど）
    // 既にコメント行として処理されているはずなので、ここには来ない
  }

  return {
    lineNumber,
    rawText,
    label,
    opcode,
    operandsText,
    comment,
    tokens,
  };
}

/**
 * 文字列内の空白を考慮してオペコードとオペランドを分割
 */
function splitOpcodeAndOperands(text: string): { opcode: string; operands: string } {
  let opcode = "";
  let operands = "";
  let inString = false;
  let stringChar = "";
  let opcodeEndPos = -1;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // 文字列開始/終了のチェック
    if ((char === "'" || char === '"') && (i === 0 || text[i - 1] !== "\\")) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        // 文字列終了（エスケープされたクォートのチェック）
        if (i + 1 >= text.length || text[i + 1] !== stringChar) {
          inString = false;
          stringChar = "";
        } else {
          // エスケープされたクォート
          i++; // 次の文字もスキップ
        }
      }
      // オペコードが見つかっていない場合、オペコードに追加
      if (opcodeEndPos < 0) {
        opcode += char;
      } else {
        operands += char;
      }
      continue;
    }
    
    // 文字列内の場合は空白を無視（文字列の一部として扱う）
    if (inString) {
      if (opcodeEndPos < 0) {
        opcode += char;
      } else {
        operands += char;
      }
      continue;
    }
    
    // 文字列外の空白でオペコードとオペランドを分離
    if (/\s/.test(char)) {
      if (opcodeEndPos < 0 && opcode.length > 0) {
        // オペコードの終了位置を記録
        opcodeEndPos = i;
      }
      // オペコードが見つかった後の空白はオペランドに含めない（オペランド開始の空白は除外）
      if (opcodeEndPos >= 0 && operands.length > 0) {
        // 既にオペランドが始まっている場合は空白を追加（複数のオペランド間の空白）
        operands += char;
      }
      continue;
    }
    
    // 非空白文字
    if (opcodeEndPos < 0) {
      opcode += char;
    } else {
      operands += char;
    }
  }
  
  // 前後の空白を削除
  return {
    opcode: opcode.trim(),
    operands: operands.trim(),
  };
}

/**
 * 命令部分（オペコードとオペランド）をトークン化
 */
function tokenizeInstructionPart(text: string, columnOffset: number): AsmToken[] {
  const tokens: AsmToken[] = [];
  let currentPos = 0;
  let inString = false;
  let stringChar = "";
  let currentToken = "";
  let tokenStart = 0;

  while (currentPos < text.length) {
    const char = text[currentPos];
    const isWhitespace = /\s/.test(char);

    if (inString) {
      currentToken += char;
      // 文字列終了チェック（アポストロフィが2つ続く場合はエスケープ、単独の場合は終了）
      if (char === stringChar) {
        // 次の文字もアポストロフィの場合はエスケープされたアポストロフィ
        if (currentPos < text.length - 1 && text[currentPos + 1] === stringChar) {
          currentToken += stringChar; // エスケープされたアポストロフィを追加
          currentPos += 2;
          continue;
        } else {
          // 文字列終了 - トークンタイプを判定
          // X'...'形式は数値として扱う
          if (/^X'[0-9A-F]+'$/i.test(currentToken) || /^XL'[0-9A-F]+'$/i.test(currentToken)) {
            tokens.push({
              type: TokenType.NUMBER,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
              metadata: { value: parseNumber(currentToken) },
            });
          }
          // B'...'形式も数値として扱う
          else if (/^B'[01]+'$/i.test(currentToken)) {
            tokens.push({
              type: TokenType.NUMBER,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
              metadata: { value: parseNumber(currentToken) },
            });
          }
          // C'...', CL8'...'などは文字列
          else {
            tokens.push({
              type: TokenType.STRING,
              text: currentToken,
              columnStart: tokenStart,
              columnEnd: columnOffset + currentPos + 1,
            });
          }
          currentToken = "";
          inString = false;
          currentPos++;
          continue;
        }
      }
      currentPos++;
      continue;
    }

    // 文字列開始チェック（C'...', X'...', B'...'など）
    if ((char === "'" || char === '"') && !inString) {
      // 現在のトークンが文字列型指定子（C, X, B, CL8, XL, etc.）または空の場合
      if (currentToken === "" || /^[CXBFDL]L?\d*$/i.test(currentToken)) {
        if (currentToken && /^[CXBFDL]L?\d*$/i.test(currentToken)) {
          // 文字列型指定子を含めて文字列トークンとして扱う
          // tokenStartは既に設定されているはず
          // トークンに文字列開始のアポストロフィを含める
        } else {
          // 文字列型指定子がない場合（単独のアポストロフィ）
          tokenStart = currentPos;
        }
        inString = true;
        stringChar = char;
        currentToken = currentToken + char;
        currentPos++;
        continue;
      }
    }

    if (isWhitespace) {
      if (currentToken) {
        // トークンを確定
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      // 連続する空白を1つのトークンにまとめる
      const whitespaceStart = currentPos;
      while (currentPos < text.length && /\s/.test(text[currentPos])) {
        currentPos++;
      }
      if (whitespaceStart < currentPos) {
        tokens.push({
          type: TokenType.WHITESPACE,
          text: text.substring(whitespaceStart, currentPos),
          columnStart: columnOffset + whitespaceStart,
          columnEnd: columnOffset + currentPos,
        });
      }
      continue;
    }

    // デリミタのチェック
    if (/[,()]/.test(char)) {
      if (currentToken) {
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      tokens.push({
        type: TokenType.DELIMITER,
        text: char,
        columnStart: columnOffset + currentPos,
        columnEnd: columnOffset + currentPos + 1,
      });
      currentPos++;
      continue;
    }

    // 演算子のチェック（ただし、文字列内でない場合のみ）
    if (/[+\-*/=]/.test(char) && !inString) {
      // マイナス記号が数値の一部である可能性をチェック
      if (char === "-" && currentToken && /^\d+$/.test(currentToken)) {
        // 数値の一部として扱う（負の数の可能性、ただし演算子の可能性もある）
        // ここでは単純に演算子として処理
      }
      
      if (currentToken) {
        tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
        currentToken = "";
      }
      
      // 演算子を単独のトークンとして追加
      tokens.push({
        type: TokenType.OPERATOR,
        text: char,
        columnStart: columnOffset + currentPos,
        columnEnd: columnOffset + currentPos + 1,
      });
      currentPos++;
      continue;
    }

    // 通常の文字
    if (!currentToken) {
      tokenStart = currentPos;
    }
    currentToken += char;
    currentPos++;
  }

  // 残りのトークンを処理
  if (currentToken) {
    tokens.push(createToken(currentToken, columnOffset + tokenStart, columnOffset + currentPos));
  }

  return tokens;
}

/**
 * トークンタイプを判定してトークンを作成
 */
function createToken(text: string, start: number, end: number): AsmToken {
  // レジスタ（R0-R15, GR0-GR15など、または単独のR1, R2など）
  if (/^R\d+$|^GR\d+$/i.test(text)) {
    return {
      type: TokenType.REGISTER,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // リテラル（=X'...', =C'...', =CL8'...'など）
  if (/^=([XCFHDB]|CL\d+|XL\d+|FL\d+|FD\d+|ED\d+|E\d+)/i.test(text)) {
    return {
      type: TokenType.LITERAL,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // 16進数リテラル（X'...', XL'...'など）
  if (/^X'[0-9A-F]+'$/i.test(text) || /^XL'[0-9A-F]+'$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseNumber(text),
      },
    };
  }

  // 文字列リテラル（C'...', CL8'...'など）
  if (/^C'[^']*'$/i.test(text) || /^CL\d+'[^']*'$/i.test(text)) {
    return {
      type: TokenType.STRING,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // ビット文字列（B'...'）
  if (/^B'[01]+'$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseInt(text.slice(2, -1), 2),
      },
    };
  }

  // 数値（16進Hサフィックス、10進数、符号付き）
  if (/^-?\d+$|^[0-9A-F]+H$/i.test(text)) {
    return {
      type: TokenType.NUMBER,
      text,
      columnStart: start,
      columnEnd: end,
      metadata: {
        value: parseNumber(text),
      },
    };
  }

  // 演算子（+, -, *, /, =）
  if (/^[+\-*/=]+$/.test(text)) {
    return {
      type: TokenType.OPERATOR,
      text,
      columnStart: start,
      columnEnd: end,
    };
  }

  // デフォルトはシンボルまたはオペコード（後で区別する）
  return {
    type: TokenType.SYMBOL,
    text,
    columnStart: start,
    columnEnd: end,
  };
}

/**
 * 数値をパース
 */
function parseNumber(text: string): number {
  // 16進数（Hサフィックス）
  if (/^\d+[Hh]$/.test(text)) {
    return parseInt(text.slice(0, -1), 16);
  }
  // X'...'形式
  if (/^X'[0-9A-F]+'$/i.test(text)) {
    return parseInt(text.slice(2, -1), 16);
  }
  // XL'...'形式
  if (/^XL'[0-9A-F]+'$/i.test(text)) {
    return parseInt(text.slice(3, -1), 16);
  }
  // B'...'形式（2進数）
  if (/^B'[01]+'$/i.test(text)) {
    return parseInt(text.slice(2, -1), 2);
  }
  // 10進数（符号付きを含む）
  if (/^-?\d+$/.test(text)) {
    return parseInt(text, 10);
  }
  return 0;
}