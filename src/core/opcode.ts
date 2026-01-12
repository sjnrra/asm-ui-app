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

import type { OperandType } from "./Types";

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
  
  // 算術演算・論理演算命令（追加）
  ["SLR", { mnemonic: "SLR", format: "RR", description: "論理減算命令（レジスタ）。第1オペランドのレジスタの値から第2オペランドのレジスタの値を符号なし整数として減算し、結果を第1オペランドのレジスタに格納します。SRと異なり、オーバーフロー条件は設定されません。", operands: { count: 2, types: ["register", "register"] } }],
  
  // データ変換命令
  ["CVD", { mnemonic: "CVD", format: "RX", description: "2進数から10進数への変換命令。第1オペランドのレジスタに格納されている32ビットの2進数をパック10進数（Packed Decimal）形式に変換し、メモリ（8バイト）に格納します。第2オペランドは変換結果を格納する8バイト領域のアドレスです。数値の出力処理で使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["UNPK", { mnemonic: "UNPK", format: "SS", description: "パック10進数からゾーン10進数へのアンパック命令。第1オペランドのアドレスから第2オペランドのアドレスへ、パック10進数をゾーン10進数（文字形式）に変換してコピーします。パック10進数の各桁を個別のバイト（ゾーン付き）に展開します。数値の表示用変換に使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  
  // 論理演算命令（追加）
  ["OI", { mnemonic: "OI", format: "SI", description: "即値論理OR演算命令（メモリ）。メモリの1バイトと即値（8ビット符号なし整数）のビットごとの論理OR演算を行い、結果をメモリに書き戻します。フラグの設定やビットのONに使用されます。例: OI FLAG,X'80' はFLAGの最上位ビットを1に設定します。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  // 分岐命令（追加）
  ["BAS", { mnemonic: "BAS", format: "RX", description: "分岐してアドレス保存命令。指定されたアドレスに分岐し、現在のアドレス+4を第1オペランドのレジスタに保存します。BALと同様ですが、形式が異なります。サブルーチン呼び出しや動的な分岐先の設定に使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // VSAM関連マクロ・マクロ命令
  ["GET", { mnemonic: "GET", format: "S", description: "VSAM/QSAM レコード読み込み命令（マクロ）。RPL（Request Parameter List）またはDCBを指定して、データセットから次のレコードを読み込みます。VSAMのキー順アクセスや順次アクセス、QSAMの順次読み込みで使用されます。例: GET RPL=UT1RPL はVSAMデータセットから次のレコードを読み込みます。", operands: { count: 1, types: ["string"] } }],
  ["PUT", { mnemonic: "PUT", format: "S", description: "VSAM/QSAM レコード書き込み命令（マクロ）。DCBを指定して、データセットにレコードを書き込みます。QSAMの順次書き込みで使用されます。例: PUT OUTLIST,(10) はOUTLISTデータセットにGR10が指すレコードを書き込みます。", operands: { count: 2, types: ["memory", "memory"] } }],
  ["ACB", { mnemonic: "ACB", format: "S", description: "VSAM Access Control Block定義マクロ。VSAMデータセットへのアクセスを制御するACB構造を定義します。AM（アクセス方式）、DDNAME、MACRF（マクロ形式）などを指定します。例: ACB AM=VSAM,DDNAME=SYSUT1,MACRF=IN は入力専用のVSAM ACBを定義します。", operands: { count: 1, types: ["string"] } }],
  ["RPL", { mnemonic: "RPL", format: "S", description: "VSAM Request Parameter List定義マクロ。VSAM操作の詳細を指定するRPL構造を定義します。ACB、AREA（バッファアドレス）、AREALEN（バッファ長）、OPTCD（オプションコード）などを指定します。GET、PUTなどのVSAM操作で使用されます。", operands: { count: 1, types: ["string"] } }],
  ["IFGACB", { mnemonic: "IFGACB", format: "S", description: "VSAM ACB DSECT定義マクロ。VSAM Access Control Blockの構造（DSECT）を定義します。ACBの各フィールドにアクセスするために使用します。USING命令と組み合わせて、ACBフィールド（ACBERFLGなど）を参照できます。", operands: { count: 1, types: ["string"] } }],
  ["IFGRPL", { mnemonic: "IFGRPL", format: "S", description: "VSAM RPL DSECT定義マクロ。VSAM Request Parameter Listの構造（DSECT）を定義します。RPLの各フィールドにアクセスするために使用します。USING命令と組み合わせて、RPLフィールド（RPLERRCDなど）を参照できます。", operands: { count: 1, types: ["string"] } }],
  
  // システムサービス・マクロ命令
  ["WTO", { mnemonic: "WTO", format: "S", description: "Write To Operator命令（マクロ）。オペレーターコンソールにメッセージを出力します。プログラムの実行状態やエラーメッセージを通知するために使用されます。MCSFLAGでメッセージの属性（HRDCPY（ハードコピー）など）を指定できます。例: WTO 'ERROR MESSAGE',MF=L はエラーメッセージを定義します。", operands: { count: 1, types: ["string"] } }],
  
  // 算術演算命令（追加）
  ["AHI", { mnemonic: "AHI", format: "RI", description: "32ビット即値加算命令（Add Halfword Immediate Extended）。第1オペランドのレジスタの値に16ビット符号拡張された即値（-32768～32767）を加算し、結果を第1オペランドのレジスタに格納します。AI命令よりも短いコードで即値加算が可能です。例: AHI R11,4096 はGR11に4096を加算します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["MH", { mnemonic: "MH", format: "RX", description: "ハーフワード乗算命令（Multiply Halfword）。第1オペランドのレジスタの値（下位16ビット）とメモリのハーフワード（16ビット符号付き整数）を乗算し、結果を32ビットに拡張して第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // 分岐命令（追加）
  ["BO", { mnemonic: "BO", format: "RX", description: "オーバーフローの場合に分岐命令（Branch on Overflow）。オーバーフロー条件が設定されている場合（条件コードが1）に分岐します。BC 1,addr の簡略形です。算術演算命令でオーバーフローが発生した場合に使用されます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["BCT", { mnemonic: "BCT", format: "RS", description: "レジスタ減算と条件分岐命令（Branch on Count）。第1オペランドのレジスタから1を減算し、結果が0でない場合に第3オペランドのアドレスに分岐します。ループカウンタの減算とループ継続の判定を同時に行います。例: BCT R2,LOOP はGR2を減算し、0でなければLOOPに分岐します。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // テスト・編集命令
  ["TM", { mnemonic: "TM", format: "SI", description: "テストアンダーマスク命令（Test Under Mask）。メモリの1バイトと即値（マスク）のビットごとの論理AND演算を行い、結果に応じて条件コードを設定します。フラグのチェックやビットパターンの判定に使用されます。条件コードは0（すべて0）、1（混在）、2（すべて1）に設定されます。例: TM FLAG,X'80' はFLAGの最上位ビットが1かどうかをチェックします。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  ["ED", { mnemonic: "ED", format: "SS", description: "編集命令（Edit）。パック10進数を編集マスクに従って文字列形式に変換します。数値の出力処理で使用され、Z（先頭ゼロ抑制）、9（数字）、.（小数点）、,（カンマ）などの編集文字を指定できます。第1オペランドは編集マスク、第2オペランドはパック10進数です。例: ED PRTAREA,DOUBLE はDOUBLEのパック10進数をPRTAREAの編集マスクに従って文字列に変換します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  
  // アセンブラ疑似命令（追加）
  ["ORG", { mnemonic: "ORG", format: "S", description: "ロケーションカウンタ設定命令（Origin）。現在のロケーションカウンタ（アセンブル中のアドレス）を指定された値に設定します。データ領域やコード領域の配置を制御するために使用されます。例: ORG *+100 は現在のアドレスから100バイト先にロケーションカウンタを設定します。", operands: { count: 1, types: ["immediate"] } }],
  
  // I/O・システムサービスマクロ（追加）
  ["RDJFCB", { mnemonic: "RDJFCB", format: "S", description: "JFCB読み込みマクロ（Read Job File Control Block）。指定されたDD名のJFCB（Job File Control Block）を読み込みます。JFCBにはデータセット名、ボリュームシリアル、ディスポジションなどの情報が含まれています。例: RDJFCB UT1DCB はUT1DCBのJFCBを読み込みます。", operands: { count: 1, types: ["memory"] } }],
  ["LSPACE", { mnemonic: "LSPACE", format: "S", description: "論理スペース取得マクロ（Logical Space）。指定されたUCB（Unit Control Block）のボリュームの空き領域情報を取得します。空きエクステント数、総空きシリンダ数、最大空きエクステントなどの情報を取得できます。オプションでFormat-4 DSCB（VTOCの基本情報）も取得できます。例: LSPACE UCB=AUCB,DATA=LSPDATA,F4DSCB=DSCBDATA はボリュームの空き領域情報とFormat-4 DSCBを取得します。", operands: { count: 1, types: ["string"] } }],
  ["DEVTYPE", { mnemonic: "DEVTYPE", format: "S", description: "デバイスタイプ取得マクロ（Device Type）。指定されたDD名のデバイスタイプとユニットタイプ情報を取得します。デバイスが存在するかどうかの確認や、デバイスの種類（DASD、TAPEなど）の判定に使用されます。例: DEVTYPE DCBDDNAM,DOUBLE はDCBのDD名のデバイスタイプをDOUBLEに取得します。", operands: { count: 2, types: ["memory", "memory"] } }],
  ["CVAFSEQ", { mnemonic: "CVAFSEQ", format: "S", description: "CVAFシーケンシャルアクセスマクロ（Catalog and Volume Access Facility Sequential）。VTOCのFormat-1 DSCBをシーケンシャルに読み込みます。ACCESS=GT（Get）を指定すると、前回読み込んだDSCBの次のFormat-1 DSCBを読み込みます。VTOCの全データセットを順次処理するために使用されます。例: CVAFSEQ ACCESS=GT,DEB=(10),BUFLIST=BUFLIST1,DSN=DSCBKEY は次のFormat-1 DSCBを読み込みます。", operands: { count: 1, types: ["string"] } }],
  ["CVAFDIR", { mnemonic: "CVAFDIR", format: "S", description: "CVAFダイレクトアクセスマクロ（Catalog and Volume Access Facility Direct）。VTOCのDSCBを直接読み込みます。ACCESS=READを指定すると、CCHHR（シリンダ・ヘッド・レコード）で指定されたDSCBを読み込みます。Format-3 DSCBなどの連鎖されたDSCBの読み込みに使用されます。例: CVAFDIR ACCESS=READ,DEB=(10),BUFLIST=BUFLIST2 は指定されたCCHHRのDSCBを読み込みます。", operands: { count: 1, types: ["string"] } }],
  ["TRKCALC", { mnemonic: "TRKCALC", format: "S", description: "トラック容量計算マクロ（Track Capacity Calculation）。指定されたデバイス上の1トラックに収まるブロック数を計算します。FUNCTN=TRKCAPを指定すると、キー長とデータ長から1トラック当たりのブロック数を計算します。データセットの容量見積もりやブロックサイズの最適化に使用されます。例: TRKCALC FUNCTN=TRKCAP,UCB=AUCB,R=1,K=(2),DD=(3) はキー長R2、データ長R3で1トラック当たりのブロック数を計算します。", operands: { count: 1, types: ["string"] } }],
  
  // 算術演算命令（追加）
  ["AL", { mnemonic: "AL", format: "RX", description: "論理加算命令（Add Logical）。第1オペランドのレジスタの値にメモリの値を符号なし整数として加算し、結果を第1オペランドのレジスタに格納します。符号付き加算（A命令）とは異なり、オーバーフロー条件は設定されません。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["ALR", { mnemonic: "ALR", format: "RR", description: "レジスタ論理加算命令（Add Logical Register）。第1オペランドのレジスタの値に第2オペランドのレジスタの値を符号なし整数として加算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  ["ALC", { mnemonic: "ALC", format: "RX", description: "キャリー付き論理加算命令（Add Logical with Carry）。第1オペランドのレジスタの値にメモリの値とキャリービットを加算します。多倍長加算に使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["ALCR", { mnemonic: "ALCR", format: "RR", description: "レジスタキャリー付き論理加算命令（Add Logical with Carry Register）。第1オペランドのレジスタの値に第2オペランドのレジスタの値とキャリービットを加算します。", operands: { count: 2, types: ["register", "register"] } }],
  ["SH", { mnemonic: "SH", format: "RX", description: "ハーフワード減算命令（Subtract Halfword）。第1オペランドのレジスタ（下位16ビット）からメモリのハーフワード（16ビット）を減算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["SL", { mnemonic: "SL", format: "RX", description: "論理減算命令（Subtract Logical）。第1オペランドのレジスタの値からメモリの値を符号なし整数として減算し、結果を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["SLB", { mnemonic: "SLB", format: "RX", description: "ボロー付き論理減算命令（Subtract Logical with Borrow）。第1オペランドのレジスタの値からメモリの値とボロービットを減算します。多倍長減算に使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["DL", { mnemonic: "DL", format: "RX", description: "論理除算命令（Divide Logical）。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を符号なし整数としてメモリの値で除算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["DLR", { mnemonic: "DLR", format: "RR", description: "レジスタ論理除算命令（Divide Logical Register）。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を符号なし整数として第2オペランドのレジスタ値で除算します。", operands: { count: 2, types: ["register", "register"] } }],
  ["ML", { mnemonic: "ML", format: "RX", description: "論理乗算命令（Multiply Logical）。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を符号なし整数としてメモリの値と乗算します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["MLR", { mnemonic: "MLR", format: "RR", description: "レジスタ論理乗算命令（Multiply Logical Register）。第1オペランド（偶数レジスタ）と第1+1レジスタの64ビット値を符号なし整数として第2オペランドのレジスタ値と乗算します。", operands: { count: 2, types: ["register", "register"] } }],
  ["MHI", { mnemonic: "MHI", format: "RI", description: "ハーフワード即値乗算命令（Multiply Halfword Immediate）。第1オペランドのレジスタの値（下位16ビット）に16ビット符号拡張された即値を乗算し、結果を32ビットに拡張して第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "immediate"] } }],
  
  // 分岐命令（追加）
  ["BXH", { mnemonic: "BXH", format: "RS", description: "インデックス大きい場合に分岐命令（Branch on Index High）。第1オペランドのレジスタの値を第3オペランドで指定された値だけ増分し、第2オペランドのレジスタの値より大きい場合に分岐します。ループ制御に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["BXLE", { mnemonic: "BXLE", format: "RS", description: "インデックス小さいか等しい場合に分岐命令（Branch on Index Low or Equal）。第1オペランドのレジスタの値を第3オペランドで指定された値だけ増分し、第2オペランドのレジスタの値以下である場合に分岐します。ループ制御に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["BRAS", { mnemonic: "BRAS", format: "RIL", description: "相対分岐してアドレス保存命令（Branch Relative and Save）。現在のアドレスからの相対オフセットに分岐し、現在のアドレス+4を第1オペランドのレジスタに保存します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["BRASL", { mnemonic: "BRASL", format: "RIL", description: "相対分岐してアドレス保存ロング命令（Branch Relative and Save Long）。現在のアドレスからの相対オフセット（32ビット）に分岐し、現在のアドレス+4を第1オペランドのレジスタに保存します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["BRC", { mnemonic: "BRC", format: "RIL", description: "相対条件分岐命令（Branch Relative on Condition）。第1オペランドで指定された条件が条件コードと一致する場合、現在のアドレスからの相対オフセットに分岐します。", operands: { count: 2, types: ["immediate", "immediate"] } }],
  ["BRCL", { mnemonic: "BRCL", format: "RIL", description: "相対条件分岐ロング命令（Branch Relative on Condition Long）。第1オペランドで指定された条件が条件コードと一致する場合、現在のアドレスからの相対オフセット（32ビット）に分岐します。", operands: { count: 2, types: ["immediate", "immediate"] } }],
  ["BRCT", { mnemonic: "BRCT", format: "RIL", description: "相対カウント分岐命令（Branch Relative on Count）。第1オペランドのレジスタから1を減算し、結果が0でない場合に現在のアドレスからの相対オフセットに分岐します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["BRXH", { mnemonic: "BRXH", format: "RSY", description: "相対インデックス大きい場合に分岐命令（Branch Relative on Index High）。第1オペランドのレジスタの値を増分し、第2オペランドのレジスタの値より大きい場合に現在のアドレスからの相対オフセットに分岐します。", operands: { count: 3, types: ["register", "register", "immediate"] } }],
  ["BRXLE", { mnemonic: "BRXLE", format: "RSY", description: "相対インデックス小さいか等しい場合に分岐命令（Branch Relative on Index Low or Equal）。第1オペランドのレジスタの値を増分し、第2オペランドのレジスタの値以下である場合に現在のアドレスからの相対オフセットに分岐します。", operands: { count: 3, types: ["register", "register", "immediate"] } }],
  ["BASSM", { mnemonic: "BASSM", format: "RR", description: "分岐してアドレス保存しモード設定命令（Branch and Save and Set Mode）。第2オペランドのレジスタに格納されているアドレスに分岐し、現在のアドレス+4を第1オペランドのレジスタに保存し、アドレッシングモードを設定します。", operands: { count: 2, types: ["register", "register"] } }],
  ["BSM", { mnemonic: "BSM", format: "RR", description: "分岐してモード設定命令（Branch and Set Mode）。第2オペランドのレジスタに格納されているアドレスに分岐し、アドレッシングモードを設定します。", operands: { count: 2, types: ["register", "register"] } }],
  ["SVC", { mnemonic: "SVC", format: "SI", description: "スーパーバイザーコール命令（Supervisor Call）。オペレーティングシステムのサービスを呼び出します。第2オペランドの即値（0～255）でサービス番号を指定します。特権命令です。", operands: { count: 1, types: ["immediate"] } }],
  
  // ロード/ストア命令（追加）
  ["LHI", { mnemonic: "LHI", format: "RI", description: "ハーフワード即値ロード命令（Load Halfword Immediate）。16ビット符号拡張された即値を第1オペランドのレジスタに格納します。例: LHI R1,100 はGR1に100を格納します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["LL", { mnemonic: "LL", format: "RX", description: "論理ロード命令（Load Logical）。メモリから32ビットのフルワードを符号なし整数として読み込み、第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LLC", { mnemonic: "LLC", format: "RXY", description: "論理文字ロード命令（Load Logical Character）。メモリから1バイトを読み込み、符号拡張せずに第1オペランドのレジスタの下位8ビットに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LPR", { mnemonic: "LPR", format: "RR", description: "ロード正数命令（Load Positive）。第2オペランドのレジスタの値の絶対値を第1オペランドのレジスタに格納します。負の値の場合は符号を反転します。", operands: { count: 2, types: ["register", "register"] } }],
  ["LRV", { mnemonic: "LRV", format: "RXY", description: "ロード反転命令（Load Reversed）。メモリから32ビットのフルワードを読み込み、バイト順を反転して第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["LARL", { mnemonic: "LARL", format: "RIL", description: "相対アドレスロードロング命令（Load Address Relative Long）。現在のアドレスからの相対オフセット（32ビット）を計算して、そのアドレス値を第1オペランドのレジスタに格納します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["LAE", { mnemonic: "LAE", format: "RX", description: "アドレスロード拡張命令（Load Address Extended）。メモリアドレスを計算して、そのアドレス値自体を第1オペランドのレジスタに格納します。LA命令と同様ですが、拡張形式です。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STRV", { mnemonic: "STRV", format: "RXY", description: "ストア反転命令（Store Reversed）。第1オペランドのレジスタの32ビット値をバイト順を反転してメモリに書き込みます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["STCK", { mnemonic: "STCK", format: "S", description: "ストアクロック命令（Store Clock）。現在のCPUタイムスタンプ（TODクロック）をメモリに書き込みます。8バイトのタイムスタンプが書き込まれます。", operands: { count: 1, types: ["base-displacement"] } }],
  ["STCKE", { mnemonic: "STCKE", format: "S", description: "ストアクロック拡張命令（Store Clock Extended）。現在のCPUタイムスタンプ（拡張形式）をメモリに書き込みます。16バイトのタイムスタンプが書き込まれます。", operands: { count: 1, types: ["base-displacement"] } }],
  
  // 比較命令（追加）
  ["CHI", { mnemonic: "CHI", format: "RI", description: "ハーフワード即値比較命令（Compare Halfword Immediate）。第1オペランドのレジスタの下位16ビットと16ビット符号拡張された即値を符号付き整数として比較し、条件コードを設定します。", operands: { count: 2, types: ["register", "immediate"] } }],
  ["CLM", { mnemonic: "CLM", format: "RS", description: "マスク付き論理文字比較命令（Compare Logical Characters Under Mask）。第1オペランドのレジスタの指定された位置（マスクで指定）とメモリの1バイトを符号なしとして比較し、条件コードを設定します。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["CS", { mnemonic: "CS", format: "RS", description: "比較してスワップ命令（Compare and Swap）。第2オペランドのレジスタの値とメモリの値を比較し、等しい場合に第1オペランドのレジスタの値をメモリに書き込みます。アトミック操作に使用されます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  ["CDS", { mnemonic: "CDS", format: "RS", description: "ダブル比較してスワップ命令（Compare Double and Swap）。第2オペランドと第2+1オペランドのレジスタペアの値とメモリのダブルワードを比較し、等しい場合に第1オペランドと第1+1オペランドのレジスタペアの値をメモリに書き込みます。", operands: { count: 3, types: ["register", "register", "base-displacement"] } }],
  
  // データ変換命令（追加）
  ["CVB", { mnemonic: "CVB", format: "RX", description: "10進数から2進数への変換命令（Convert to Binary）。メモリのパック10進数（8バイト）を2進数に変換し、第1オペランドのレジスタに格納します。数値の入力処理で使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  
  // 文字列操作命令（追加）
  ["MVN", { mnemonic: "MVN", format: "SS", description: "文字列反転移動命令（Move Inverse）。メモリからメモリへ文字列を移動しますが、各バイトのビットパターンを反転（NOT演算）してコピーします。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["MVZ", { mnemonic: "MVZ", format: "SS", description: "ゾーン移動命令（Move Zones）。メモリからメモリへ文字列を移動しますが、ゾーンビット（上位4ビット）のみをコピーし、数字ビット（下位4ビット）は変更しません。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["MVO", { mnemonic: "MVO", format: "SS", description: "オフセット移動命令（Move with Offset）。パック10進数をオフセットを指定して移動します。パック10進数の桁位置を調整するために使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["MVST", { mnemonic: "MVST", format: "RRE", description: "文字列移動命令（Move String）。レジスタペアで指定された長さの文字列を移動します。終端文字（通常はX'00'）を検出すると停止します。", operands: { count: 2, types: ["register", "register"] } }],
  ["TR", { mnemonic: "TR", format: "SS", description: "変換命令（Translate）。メモリの文字列を変換テーブルに従って変換します。各バイトを変換テーブルのインデックスとして使用し、対応する値を書き込みます。文字コード変換に使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["TRT", { mnemonic: "TRT", format: "SS", description: "変換してテスト命令（Translate and Test）。メモリの文字列を変換テーブルに従って変換し、最初に非ゼロの変換結果が見つかった位置をレジスタに格納します。文字列検索に使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["SRST", { mnemonic: "SRST", format: "RRE", description: "文字列検索命令（Search String）。レジスタペアで指定された文字列内で指定された文字を検索します。見つかった位置をレジスタに格納します。", operands: { count: 2, types: ["register", "register"] } }],
  
  // パック/アンパック命令
  ["PACK", { mnemonic: "PACK", format: "SS", description: "パック命令（Pack）。ゾーン10進数（文字形式）をパック10進数に変換します。第1オペランドのアドレスに第2オペランドのアドレスから指定された長さのゾーン10進数をパック10進数に変換してコピーします。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  
  // その他の命令
  ["EX", { mnemonic: "EX", format: "RX", description: "実行命令（Execute）。第2オペランドのアドレスに格納されている命令を実行します。命令の動的な変更や条件付き実行に使用されます。", operands: { count: 2, types: ["register", "base-displacement"] } }],
  ["CKSM", { mnemonic: "CKSM", format: "RRE", description: "チェックサム命令（Checksum）。レジスタペアで指定された長さのデータのチェックサムを計算します。データの整合性チェックに使用されます。", operands: { count: 2, types: ["register", "register"] } }],
  ["MC", { mnemonic: "MC", format: "SI", description: "モニターコール命令（Monitor Call）。モニタリング機能を呼び出します。デバッグやトレースに使用されます。", operands: { count: 2, types: ["base-displacement", "immediate"] } }],
  
  // 10進数命令
  ["AP", { mnemonic: "AP", format: "SS", description: "10進数加算命令（Add Decimal）。パック10進数を加算します。第1オペランドのパック10進数に第2オペランドのパック10進数を加算し、結果を第1オペランドに格納します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["SP", { mnemonic: "SP", format: "SS", description: "10進数減算命令（Subtract Decimal）。パック10進数を減算します。第1オペランドのパック10進数から第2オペランドのパック10進数を減算し、結果を第1オペランドに格納します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["MP", { mnemonic: "MP", format: "SS", description: "10進数乗算命令（Multiply Decimal）。パック10進数を乗算します。第1オペランドのパック10進数に第2オペランドのパック10進数を乗算し、結果を第1オペランドに格納します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["DP", { mnemonic: "DP", format: "SS", description: "10進数除算命令（Divide Decimal）。パック10進数を除算します。第1オペランドのパック10進数を第2オペランドのパック10進数で除算し、商を第1オペランドに格納します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["CP", { mnemonic: "CP", format: "SS", description: "10進数比較命令（Compare Decimal）。パック10進数を比較します。第1オペランドのパック10進数と第2オペランドのパック10進数を比較し、条件コードを設定します。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["ZAP", { mnemonic: "ZAP", format: "SS", description: "ゼロにして加算命令（Zero and Add）。第1オペランドのパック10進数をゼロにしてから、第2オペランドのパック10進数を加算します。パック10進数のコピーに使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["TP", { mnemonic: "TP", format: "SS", description: "10進数テスト命令（Test Decimal）。パック10進数の値が有効かどうかをテストします。不正な桁（0-9以外）が含まれている場合に例外が発生します。", operands: { count: 1, types: ["base-displacement"] } }],
  ["SRP", { mnemonic: "SRP", format: "SS", description: "シフトして丸め10進数命令（Shift and Round Decimal）。パック10進数をシフトし、必要に応じて丸めます。小数点位置の調整に使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
  ["EDMK", { mnemonic: "EDMK", format: "SS", description: "編集してマーク命令（Edit and Mark）。パック10進数を編集マスクに従って文字列形式に変換し、最初の非ゼロ桁の位置をレジスタに格納します。数値の出力処理で先頭ゼロの位置を記録するために使用されます。", operands: { count: 2, types: ["base-displacement", "base-displacement"] } }],
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
