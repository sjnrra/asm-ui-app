# z/OS アセンブラ解析支援UI

ReactとTypeScriptで構築されたz/OSアセンブラの解析支援ツールです。構文ハイライト、シンボル解析、エラー検出などの機能を提供します。

## 機能

- **構文ハイライト**: z/OSアセンブラの固定カラム形式に対応したシンタックスハイライト
- **シンボル解析**: ラベル、EQU、DC、DSなどのシンボル定義を解析・表示
- **命令情報表示**: 命令の説明、フォーマット、オペランド情報を表示
- **エラー検出**: 構文エラーやオペランド数の不一致などを検出
- **外部ファイル参照**: COPY文による外部ファイルのインクルードに対応
- **マクロ処理**: MACRO/ENDMによるマクロ定義と展開に対応

## 使用方法

### 基本機能

1. エディタエリアにアセンブラソースコードを入力
2. 自動的に解析が実行され、右側のパネルに結果が表示されます
3. ハイライト表示された行をクリックすると、詳細情報が表示されます

### 外部ファイル参照（COPY文）

#### 依存ファイルの配置方法

依存ファイルは **`public/dependencies/`** ディレクトリに配置してください。

1. **ディレクトリ構造**:
   ```
   public/
   └── dependencies/
       ├── dependencies.json  (必須: 読み込み対象ファイルのリスト)
       ├── REGS.INC          (例: レジスタEQU定義)
       ├── CONSTANTS.INC     (例: 定数定義)
       ├── MACROS.MAC        (例: マクロ定義)
       └── ...               (その他の依存ファイル)
   ```

2. **`dependencies.json` の設定**:
   ```json
   {
     "files": [
       "REGS.INC",
       "CONSTANTS.INC",
       "MACROS.MAC"
     ],
     "description": "依存関係にあるファイルのリスト。このディレクトリにファイルを配置すると、アプリ起動時に自動的に読み込まれます。"
   }
   ```

3. **自動読み込み**:
   - アプリ起動時に `dependencies.json` で指定されたファイルが自動的に読み込まれます
   - 読み込まれたファイルは、右側の「読み込み済みファイル」パネルで確認できます

#### 使用方法

1. メインソースコードに `COPY ファイル名` を記述
2. COPY文が解析され、`public/dependencies/` から該当ファイルを自動的に読み込んで展開されます

#### 手動ファイル読み込み（オプション）

必要に応じて「ファイル読み込み」ボタンから追加のファイルを読み込むこともできます。

#### サンプルファイル

`public/dependencies/` ディレクトリに以下のサンプルファイルが用意されています：

- `REGS.INC`: レジスタEQU定義
- `SAVEMAC.MAC`: SAVEマクロ定義

`public/samples/` ディレクトリには参考用のサンプルコードがあります：

- `MAINPROG.ASM`: COPY文とマクロを使用したメインプログラム

### マクロ定義と展開

#### マクロ定義

```
MACRONAME MACRO &PARM1,&PARM2
          LA    R1,&PARM1
          ST    R1,&PARM2
          ENDM
```

#### マクロ呼び出し

```
          MACRONAME 100,SAVEAREA
```

マクロ呼び出しは自動的に展開され、パラメータが置換されます。

## 開発

### セットアップ

```bash
npm install
npm run dev
```

### ビルド

```bash
npm run build
```

### テスト

サンプルコードでCOPY文とマクロ機能をテストするには：

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:5173` を開く
3. 「ファイル読み込み」ボタンをクリック
4. `public/samples/` ディレクトリから `REGS.INC` と `SAVEMAC.MAC` を選択
5. メインエディタに以下のコードを入力：

```asm
         COPY  REGS
MYPROG   CSECT ,
         SAVEMAC RC,(14,12)
MAIN     EQU   *
         LA    R1,100
         END   MYPROG
```

6. COPY文とマクロが正しく展開されることを確認

## 技術スタック

- React 18
- TypeScript
- Vite
- CSS Modules

## 対応している命令・疑似命令

- 機械語命令: LA, LR, ST, L, C, BNH, BR, BAL, RETURN など
- 疑似命令: CSECT, EQU, DC, DS, USING, SAVE, SPACE, EJECT, LTORG, END
- マクロ命令: MACRO, ENDM
- インクルード: COPY

## 今後の拡張予定

- フロー解析
- データフロー解析
- 最適化提案
- マクロライブラリの自動検索
