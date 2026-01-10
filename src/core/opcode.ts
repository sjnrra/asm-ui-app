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
  ["AR", { mnemonic: "AR", format: "RR", description: "レジスタ加算命令。第1オペランドのレジスタの値に第2オペランドのレジスタの値を加算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["A", { mnemonic: "A", format: "RX", description: "メモリ加算命令。第1オペランドのレジスタの値にメモリ（ベース・ディスプレースメント）の値を加算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["AH", { mnemonic: "AH", format: "RX", description: "ハーフワード加算命令。第1オペランドのレジスタ（下位16ビット）にメモリのハーフワード（16ビット）を加算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["AFI", { mnemonic: "AFI", format: "RI", description: "即値加算命令。第1オペランドのレジスタの値に即値（32ビット符号付き整数）を加算します。", operands: { count: 2, types: ["register", "immediate"] } }],
  
  ["SR", { mnemonic: "SR", format: "RR", description: "レジスタ減算命令。第1オペランドのレジスタの値から第2オペランドのレジスタの値を減算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["S", { mnemonic: "S", format: "RX", description: "メモリ減算命令。第1オペランドのレジスタの値からメモリ（ベース・ディスプレースメント）の値を減算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  ["MR", { mnemonic: "MR", format: "RR", description: "レジスタ乗算命令。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を第2オペランドのレジスタ値と乗算します。結果は第1オペランドと第1+1レジスタに格納されます。", operands: { count: 2, types: ["register", "register"] } }],
  ["M", { mnemonic: "M", format: "RX", description: "メモリ乗算命令。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値をメモリの値と乗算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  ["DR", { mnemonic: "DR", format: "RR", description: "レジスタ除算命令。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を第2オペランドのレジスタ値で除算します。商は第1オペランド、剰余は第1+1レジスタに格納されます。", operands: { count: 2, types: ["register", "register"] } }],
  ["D", { mnemonic: "D", format: "RX", description: "メモリ除算命令。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値をメモリの値で除算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // ロード/ストア命令
  ["LR", { mnemonic: "LR", format: "RR", description: "レジスタ間ロード命令。第2オペランドのレジスタの値を第1オペランドのレジスタにコピーします。", operands: { count: 2, types: ["register", "register"] } }],
  ["L", { mnemonic: "L", format: "RX", description: "メモリロード命令。メモリ（ベース・ディスプレースメント）から32ビットのフルワードを読み込み、第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LA", { mnemonic: "LA", format: "RX", description: "アドレスロード命令。メモリアドレス（ベース・ディスプレースメント）を計算して、そのアドレス値自体を第1オペランドのレジスタに格納します。メモリの内容ではなく、アドレスをロードする点がL命令と異なります。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LH", { mnemonic: "LH", format: "RX", description: "ハーフワードロード命令。メモリから16ビットのハーフワードを読み込み、符号拡張して32ビットにして第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LLH", { mnemonic: "LLH", format: "RX", description: "ロード論理ハーフワード命令。メモリから16ビットのハーフワードを読み込み、符号拡張せずに32ビットのレジスタに格納します（上位16ビットは0で埋められます）。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LM", { mnemonic: "LM", format: "RS", description: "複数レジスタロード命令。第1オペランドから第2オペランドまでの連続したレジスタに、メモリから順次値を読み込みます。レジスタの保存・復元処理でよく使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["LTR", { mnemonic: "LTR", format: "RR", description: "ロードしてテスト命令。第2オペランドのレジスタの値を第1オペランドのレジスタにコピーし、同時に条件コードを設定します。ゼロ、正、負に応じてCCが設定されます。", operands: { count: 2, types: ["register", "register"] } }],
  ["LNR", { mnemonic: "LNR", format: "RR", description: "ロード符号反転命令。第2オペランドのレジスタの値の符号を反転して第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["LCR", { mnemonic: "LCR", format: "RR", description: "ロード補数命令。第2オペランドのレジスタの値の2の補数を計算して第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  
  ["ST", { mnemonic: "ST", format: "RX", description: "メモリストア命令。第1オペランドのレジスタの32ビット値をメモリ（ベース・ディスプレースメント）に書き込みます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STH", { mnemonic: "STH", format: "RX", description: "ハーフワードストア命令。第1オペランドのレジスタの下位16ビットをメモリに書き込みます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STM", { mnemonic: "STM", format: "RS", description: "複数レジスタストア命令。第1オペランドから第2オペランドまでの連続したレジスタの値を、メモリに順次書き込みます。レジスタの保存処理でよく使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // 比較命令
  ["CR", { mnemonic: "CR", format: "RR", description: "レジスタ比較命令。第1オペランドのレジスタの値と第2オペランドのレジスタの値を符号付き整数として比較し、条件コードを設定します。結果に応じてCC（条件コード）が0（等しい）、2（第1が大きい）、4（第1が小さい）に設定されます。", operands: { count: 2, types: ["register", "register"] } }],
  ["C", { mnemonic: "C", format: "RX", description: "メモリ比較命令。第1オペランドのレジスタの値とメモリ（ベース・ディスプレースメント）の値を符号付き整数として比較し、条件コードを設定します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CH", { mnemonic: "CH", format: "RX", description: "ハーフワード比較命令。第1オペランドのレジスタの下位16ビットとメモリのハーフワードを符号付き整数として比較し、条件コードを設定します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CLR", { mnemonic: "CLR", format: "RR", description: "レジスタ論理比較命令。第1オペランドのレジスタの値と第2オペランドのレジスタの値を符号なし整数として比較し、条件コードを設定します。", operands: { count: 2, types: ["register", "register"] } }],
  ["CL", { mnemonic: "CL", format: "RX", description: "メモリ論理比較命令。第1オペランドのレジスタの値とメモリ（ベース・ディスプレースメント）の値を符号なし整数として比較し、条件コードを設定します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CLI", { mnemonic: "CLI", format: "SI", description: "即値論理比較命令。メモリの1バイトと即値（8ビット符号なし整数）を符号なしとして比較し、条件コードを設定します。文字列比較やフラグチェックに使用されます。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  ["CLC", { mnemonic: "CLC", format: "SS", description: "文字列比較命令。メモリからメモリへ文字列を比較します。第1オペランドと第2オペランドのアドレスから指定された長さのデータを比較し、条件コードを設定します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  
  // 分岐命令
  ["B", { mnemonic: "B", format: "RX", description: "無条件分岐命令。指定されたアドレス（ベース・ディスプレースメント）に無条件で分岐します。サブルーチン呼び出しやループの終了処理で使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BR", { mnemonic: "BR", format: "RR", description: "レジスタ分岐命令。指定されたレジスタに格納されているアドレスに無条件で分岐します。動的な分岐やサブルーチンからの戻りで使用されます。", operands: { count: 1, types: ["register"] } }],
  ["BC", { mnemonic: "BC", format: "RX", description: "条件分岐命令。第1オペランドで指定された条件（マスク）が条件コードと一致する場合、第2オペランドのアドレスに分岐します。条件マスクは1（等しい）、2（大きい）、4（小さい）などを組み合わせて指定します。", operands: { count: 2, types: ["immediate", "base-displacement"] } }],
  ["BCR", { mnemonic: "BCR", format: "RR", description: "レジスタ条件分岐命令。第1オペランドで指定された条件が条件コードと一致する場合、第2オペランドのレジスタに格納されているアドレスに分岐します。", operands: { count: 2, types: ["immediate", "register"] } }],
  ["BE", { mnemonic: "BE", format: "RX", description: "等しい場合に分岐命令（Branch on Equal）。条件コードが0（等しい）の場合に分岐します。BC 8,addr の簡略形です。比較命令（CR, Cなど）の結果が等しい場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNE", { mnemonic: "BNE", format: "RX", description: "等しくない場合に分岐命令（Branch on Not Equal）。条件コードが0以外（等しくない）の場合に分岐します。BC 7,addr の簡略形です。比較命令の結果が等しくない場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BH", { mnemonic: "BH", format: "RX", description: "大きい場合に分岐命令（Branch on High）。条件コードが2（大きい）の場合に分岐します。BC 2,addr の簡略形です。符号付き整数の比較で第1オペランドが第2オペランドより大きい場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BL", { mnemonic: "BL", format: "RX", description: "小さい場合に分岐命令（Branch on Low）。条件コードが4（小さい）の場合に分岐します。BC 4,addr の簡略形です。符号付き整数の比較で第1オペランドが第2オペランドより小さい場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BZ", { mnemonic: "BZ", format: "RX", description: "ゼロの場合に分岐命令（Branch on Zero）。条件コードが0（ゼロ）の場合に分岐します。BC 8,addr の簡略形で、BEと同等です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNZ", { mnemonic: "BNZ", format: "RX", description: "ゼロでない場合に分岐命令（Branch on Not Zero）。条件コードが0以外（ゼロでない）の場合に分岐します。BC 7,addr の簡略形で、BNEと同等です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BP", { mnemonic: "BP", format: "RX", description: "正の場合に分岐命令（Branch on Plus）。条件コードが2（正の値）の場合に分岐します。BC 2,addr の簡略形です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BM", { mnemonic: "BM", format: "RX", description: "負の場合に分岐命令（Branch on Minus）。条件コードが4（負の値）の場合に分岐します。BC 4,addr の簡略形です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNP", { mnemonic: "BNP", format: "RX", description: "正でない場合に分岐命令（Branch on Not Plus）。条件コードが2以外（正でない、すなわち0以下）の場合に分岐します。BC 13,addr の簡略形です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNM", { mnemonic: "BNM", format: "RX", description: "負でない場合に分岐命令（Branch on Not Minus）。条件コードが4以外（負でない、すなわち0以上）の場合に分岐します。BC 11,addr の簡略形です。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNH", { mnemonic: "BNH", format: "RX", description: "大きくない場合に分岐命令（Branch on Not High、以下）。条件コードが0（等しい）または4（小さい）の場合に分岐します。BC 13,addr の簡略形です。符号付き整数の比較で第1オペランドが第2オペランド以下の場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BNL", { mnemonic: "BNL", format: "RX", description: "小さくない場合に分岐命令（Branch on Not Low、以上）。条件コードが0（等しい）または2（大きい）の場合に分岐します。BC 11,addr の簡略形です。符号付き整数の比較で第1オペランドが第2オペランド以上の場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BAL", { mnemonic: "BAL", format: "RX", description: "分岐してリンク命令。指定されたアドレスに分岐し、現在のアドレス+4を第1オペランドのレジスタに保存します。サブルーチン呼び出しで使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["BALR", { mnemonic: "BALR", format: "RR", description: "レジスタ分岐してリンク命令。第2オペランドのレジスタに格納されているアドレスに分岐し、現在のアドレス+4を第1オペランドのレジスタに保存します。サブルーチン呼び出しで使用されます。", operands: { count: 2, types: ["register", "register"] } }],
  
  // 論理演算命令
  ["OR", { mnemonic: "OR", format: "RR", description: "論理OR演算命令（レジスタ）。第1オペランドのレジスタの値と第2オペランドのレジスタの値のビットごとの論理OR演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["O", { mnemonic: "O", format: "RX", description: "論理OR演算命令（メモリ）。第1オペランドのレジスタの値とメモリの値のビットごとの論理OR演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["ORI", { mnemonic: "ORI", format: "SI", description: "即値論理OR演算命令。メモリの値と即値のビットごとの論理OR演算を行い、結果をメモリに書き戻します。フラグの設定に使用されます。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  ["NR", { mnemonic: "NR", format: "RR", description: "論理AND演算命令（レジスタ）。第1オペランドのレジスタの値と第2オペランドのレジスタの値のビットごとの論理AND演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["N", { mnemonic: "N", format: "RX", description: "論理AND演算命令（メモリ）。第1オペランドのレジスタの値とメモリの値のビットごとの論理AND演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["NI", { mnemonic: "NI", format: "SI", description: "即値論理AND演算命令。メモリの値と即値のビットごとの論理AND演算を行い、結果をメモリに書き戻します。フラグのクリアやマスク処理に使用されます。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  ["XR", { mnemonic: "XR", format: "RR", description: "排他的論理和（XOR）演算命令（レジスタ）。第1オペランドのレジスタの値と第2オペランドのレジスタの値のビットごとの排他的論理和演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["X", { mnemonic: "X", format: "RX", description: "排他的論理和（XOR）演算命令（メモリ）。第1オペランドのレジスタの値とメモリの値のビットごとの排他的論理和演算を行い、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // その他の命令
  ["MVI", { mnemonic: "MVI", format: "SI", description: "メモリ即値移動命令。即値（8ビット）をメモリの1バイトに書き込みます。文字列の初期化やフラグの設定に使用されます。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  ["MVC", { mnemonic: "MVC", format: "SS", description: "文字列移動命令。メモリからメモリへ文字列を移動します。第1オペランドのアドレスに第2オペランドのアドレスから指定された長さのデータをコピーします。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["MVCL", { mnemonic: "MVCL", format: "RRE", description: "ロング文字列移動命令。レジスタペアで指定された長さのデータを移動します。最大4GBのデータ移動が可能です。", operands: { count: 2, types: ["register", "register"] } }],
  ["CLCL", { mnemonic: "CLCL", format: "RRE", description: "ロング文字列比較命令。レジスタペアで指定された長さのデータを比較します。最大4GBのデータ比較が可能です。", operands: { count: 2, types: ["register", "register"] } }],
  ["IC", { mnemonic: "IC", format: "RX", description: "文字挿入命令。メモリから1バイトを読み込み、第1オペランドのレジスタの下位8ビットに挿入します。上位24ビットは変更されません。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STC", { mnemonic: "STC", format: "RX", description: "文字ストア命令。第1オペランドのレジスタの下位8ビットをメモリの1バイトに書き込みます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["ICM", { mnemonic: "ICM", format: "RS", description: "文字挿入マスク命令。メモリから1バイトを読み込み、第1オペランドのレジスタの指定された位置に挿入します。マスクビットで挿入位置を指定します。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["STCM", { mnemonic: "STCM", format: "RS", description: "文字ストアマスク命令。第1オペランドのレジスタの指定された位置から1バイトを抽出し、メモリに書き込みます。マスクビットで抽出位置を指定します。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["NOP", { mnemonic: "NOP", format: "RR", description: "無操作命令。何も処理を行いません。デバッグやタイミング調整に使用されます。", operands: { count: 0, types: [] } }],
  ["NOPR", { mnemonic: "NOPR", format: "RR", description: "レジスタ無操作命令。何も処理を行いません。BCR 0,0 の簡略形です。", operands: { count: 0, types: [] } }],
  
  // シフト命令
  ["SLL", { mnemonic: "SLL", format: "RS", description: "単一論理左シフト命令。第1オペランドのレジスタの32ビット値を、第3オペランドで指定されたビット数だけ左に論理シフトします。右側には0が詰められます。乗算の代替やビット操作に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SRL", { mnemonic: "SRL", format: "RS", description: "単一論理右シフト命令。第1オペランドのレジスタの32ビット値を、第3オペランドで指定されたビット数だけ右に論理シフトします。左側には0が詰められます。除算の代替やビット操作に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SLA", { mnemonic: "SLA", format: "RS", description: "単一算術左シフト命令。第1オペランドのレジスタの32ビット値を、第3オペランドで指定されたビット数だけ左に算術シフトします。符号ビットは保持されず、右側には0が詰められます。符号付き整数の乗算に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["SRA", { mnemonic: "SRA", format: "RS", description: "単一算術右シフト命令。第1オペランドのレジスタの32ビット値を、第3オペランドで指定されたビット数だけ右に算術シフトします。符号ビット（最上位ビット）が左側に詰められます。符号付き整数の除算に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // アセンブラ疑似命令
  // アセンブラ疑似命令・ディレクティブ
  ["CSECT", { mnemonic: "CSECT", format: "S", description: "コントロールセクション定義。プログラムやデータの論理的な区切りを定義します。各CSECTには一意の名前を付けることができます。", operands: { count: 0, types: [] } }],
  ["DSECT", { mnemonic: "DSECT", format: "S", description: "ダミーセクション定義。実際のストレージを割り当てずに、データ構造のテンプレートを定義します。マッピングや構造定義に使用されます。", operands: { count: 0, types: [] } }],
  ["AMODE", { mnemonic: "AMODE", format: "S", description: "アドレッシングモード指定。プログラムが使用するアドレス空間のサイズを指定します。24（24ビット、16MB以下）、31（31ビット、2GB以下）、64（64ビット、最大）を指定できます。例: AMODE 31 は31ビットアドレッシングモードを指定します。", operands: { count: 1, types: ["number"] } }],
  ["RMODE", { mnemonic: "RMODE", format: "S", description: "レジデンスモード指定。プログラムが実行されるアドレス空間のサイズを指定します。24（24ビット、16MB以下）、31（31ビット、2GB以下）、ANY（リンカが適切に選択）を指定できます。AMODEと組み合わせて使用され、プログラムの実行環境を制御します。例: RMODE 24 は24ビットレジデンスモードを指定します。", operands: { count: 1, types: ["number"] } }],
  ["USING", { mnemonic: "USING", format: "S", description: "ベースレジスタ指定命令。指定したアドレス値（通常は*またはラベル）をベースレジスタとして使用することをアセンブラに通知します。これにより、その後の命令でベース・ディスプレースメント形式のアドレッシングが可能になります。例: USING *,12 は現在のアドレスをGR12をベースレジスタとして使用することを指定します。", operands: { count: 2, types: ["memory", "register"] } }],
  ["DROP", { mnemonic: "DROP", format: "S", description: "ベースレジスタ解放命令。USING命令で指定したベースレジスタの使用を終了します。レジスタを再利用する際に使用します。", operands: { count: 0, types: [] } }],
  ["EQU", { mnemonic: "EQU", format: "S", description: "等価定義命令。シンボルに定数値を割り当てます。EQUで定義されたシンボルは、その値に置き換えられます。レジスタ番号や定数の定義に使用されます。例: R1 EQU 1 はR1というシンボルに値1を割り当てます。", operands: { count: 1, types: ["immediate"] } }],
  ["DC", { mnemonic: "DC", format: "S", description: "定数定義命令。データ定数をメモリに配置します。型（C（文字）、F（フルワード）、H（ハーフワード）、X（16進数）など）を指定して定数を定義できます。例: DC F'100' は32ビット整数100を定義します。", operands: { count: 1, types: ["immediate"] } }],
  ["DS", { mnemonic: "DS", format: "S", description: "ストレージ定義命令。データ領域を確保しますが、初期値は設定しません。変数やワークエリアの定義に使用されます。型と長さを指定して領域を確保します。例: DS F は32ビット（4バイト）の領域を1つ確保します。", operands: { count: 1, types: ["immediate"] } }],
  ["CCW", { mnemonic: "CCW", format: "S", description: "チャネルコマンドワード定義命令。I/Oチャネルプログラムを構成するCCW（Channel Command Word）を定義します。CCWはI/O操作の種類、データアドレス、データ長、フラグを指定します。低レベルI/O処理で使用されます。", operands: { count: 4, types: ["immediate", "memory", "immediate", "immediate"] } }],
  ["DCB", { mnemonic: "DCB", format: "S", description: "データコントロールブロック定義命令。ファイルやデータセットへのアクセスを制御するDCB（Data Control Block）を定義します。OPEN、READ、WRITE、CLOSEなどのマクロで使用されるデータ構造です。", operands: { count: 1, types: ["string"] } }],
  ["CNOP", { mnemonic: "CNOP", format: "S", description: "条件付きNOP命令。指定された境界に合わせて、必要に応じてNOP（無操作）命令を挿入します。第1オペランドと第2オペランドで境界（2, 4, 8など）を指定します。データのアライメント調整に使用されます。", operands: { count: 2, types: ["immediate", "immediate"] } }],
  ["SAVE", { mnemonic: "SAVE", format: "S", description: "レジスタ保存命令（マクロ）。汎用レジスタを保存エリアに保存します。通常は複数のレジスタ（R14, R12など）を一度に保存するために使用されます。", operands: { count: 0, types: [] } }],
  ["SPACE", { mnemonic: "SPACE", format: "S", description: "空白行挿入命令。リスト出力に空白行を挿入します。ソースコードの可読性向上のために使用されます。", operands: { count: 0, types: [] } }],
  ["EJECT", { mnemonic: "EJECT", format: "S", description: "ページ送出命令。リスト出力で新しいページを開始します。ソースコードの論理的な区切りを示すために使用されます。", operands: { count: 0, types: [] } }],
  ["LTORG", { mnemonic: "LTORG", format: "S", description: "リテラルプール定義命令。命令内で使用されたリテラル（=F'100'など）を配置する領域を定義します。通常はプログラムのコード領域とデータ領域の境界に配置されます。", operands: { count: 0, types: [] } }],
  ["OPEN", { mnemonic: "OPEN", format: "S", description: "データセットオープン命令（マクロ）。ファイルやデータセットをオープンします。DCB（Data Control Block）のアドレスを指定して、そのデータセットへのアクセスを開始します。", operands: { count: 1, types: ["memory"] } }],
  ["CLOSE", { mnemonic: "CLOSE", format: "S", description: "データセットクローズ命令（マクロ）。オープンしたファイルやデータセットをクローズします。DCBのアドレスを指定して、データセットへのアクセスを終了します。", operands: { count: 1, types: ["memory"] } }],
  ["SNAP", { mnemonic: "SNAP", format: "S", description: "スナップショットダンプ命令（マクロ）。デバッグ用にメモリやレジスタの内容をダンプ出力します。プログラムの実行状態を確認するために使用されます。", operands: { count: 1, types: ["string"] } }], // 複数パラメータでも1つのオペランドとして扱う
  ["EXCP", { mnemonic: "EXCP", format: "S", description: "チャネルプログラム実行命令。I/Oチャネルプログラムを実行します。低レベルI/O処理で使用され、CCW（Channel Command Word）チェーンを実行します。", operands: { count: 1, types: ["memory"] } }],
  ["WAIT", { mnemonic: "WAIT", format: "S", description: "I/O待機命令。EXCPで開始したI/O操作の完了を待ちます。ECB（Event Control Block）のアドレスを指定して、I/O完了を待機します。", operands: { count: 1, types: ["string"] } }],
  ["END", { mnemonic: "END", format: "S", description: "プログラム終了命令。アセンブリソースの終わりを定義します。エントリーポイント（プログラムの開始アドレス）を指定することもできます。", operands: { count: 0, types: [] } }],
  ["TITLE", { mnemonic: "TITLE", format: "S", description: "タイトル定義命令。アセンブリリストの各ページに表示するタイトルを定義します。プログラム名や説明文を指定します。", operands: { count: 1, types: ["string"] } }],
  ["YREGS", { mnemonic: "YREGS", format: "S", description: "レジスタ等価定義マクロ。汎用レジスタ（R0～R15）と浮動小数点レジスタ（F0～F15）のEQU定義を生成します。レジスタをシンボル名（R1, R2など）で参照できるようにします。", operands: { count: 0, types: [] } }],
  ["RETURN", { mnemonic: "RETURN", format: "S", description: "戻り命令（マクロ）。サブルーチンから呼び出し元に戻ります。保存したレジスタを復元し、呼び出し元のアドレス（R14）に分岐します。", operands: { count: 0, types: [] } }],
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
