import { useState, useMemo, useRef, useEffect } from "react";
import { EditorPane } from "./components/EditorPane/EditorPane";
import { HighlightedView } from "./components/HighlightedView/HighlightedView";
import { DetailPanel } from "./components/panels/DetailPanel";
import { InstructionPanel } from "./components/panels/InstructionPanel";
import { LabelPanel } from "./components/panels/LabelPanel";
import { OperandPanel } from "./components/panels/OperandPanel";
import { FilesPanel } from "./components/panels/FilesPanel";
import { MainLayout } from "./layout/MainLayout";
import { AssemblyParser } from "./core/parser";
import { analyze } from "./core/analyser";
import { FileManager } from "./core/fileManager";
import type { AssemblyResult } from "./core/types";
import "./App.css";
import "./styles/layout.css";
import "./styles/highlight.css";

const SAMPLE_CODE = `*=====================================================================*
*        MACRO EXPANSION DEMONSTRATION                                *
*        マクロ展開確認用サンプルプログラム                            *
*        =============================================================*
*        このサンプルでは、外部ファイルから読み込んだマクロ命令が      *
*        どのように展開されるかを確認できます。                      *
*=====================================================================*
*        Step 1: レジスタEQU定義を読み込み (REGS.INC)
*---------------------------------------------------------------------*
         COPY  REGS                     INCLUDE REGISTER EQUATES
         SPACE ,
*---------------------------------------------------------------------*
*        Step 2: 定数定義を読み込み (CONSTANTS.INC)
*---------------------------------------------------------------------*
         COPY  CONSTANTS                INCLUDE CONSTANT DEFINITIONS
         SPACE ,
*---------------------------------------------------------------------*
*        Step 3: マクロ定義を読み込み (MACROS.MAC)
*        ⚠️ この行をクリックすると、マクロ定義の内容が表示されます   *
*---------------------------------------------------------------------*
         COPY  MACROS                   INCLUDE MACRO DEFINITIONS
         SPACE ,
***********************************************************************
*        CONTROL SECTION                                              *
***********************************************************************
MYPROG   CSECT ,                        DEFINE CONTROL SECTION
MYPROG   AMODE 31                       DEFINE DEFAULT AMODE=31
MYPROG   RMODE 24                       DEFINE DEFAULT RMODE=24
         SPACE ,
*=====================================================================*
*        マクロ展開例 1: SAVEREGS (パラメータ付き)                   *
*        ⚠️ この行をクリックすると、マクロ展開後の内容が確認できます *
*=====================================================================*
ENTRY    EQU   *                        PROGRAM ENTRY POINT
         SAVEREGS                       MACRO: SAVE REGISTERS
         SPACE ,
*=====================================================================*
*        マクロ展開例 2: LOADCONST (パラメータ2つ)                   *
*        ⚠️ これらの行をクリックすると、マクロ展開を確認できます     *
*=====================================================================*
         LOADCONST R1,MAXLEN            MACRO: LOAD CONST
         LOADCONST R2,BUFSIZE           MACRO: LOAD CONST
         LOADCONST R3,4096              MACRO: LOAD CONST VALUE 4096
         SPACE ,
*=====================================================================*
*        マクロ展開例 3: STOREREG (パラメータ2つ)                    *
*=====================================================================*
         STOREREG R1,BUFFERLEN          MACRO: STORE REGISTER
         STOREREG R2,BUFFERSIZE         MACRO: STORE REGISTER
         SPACE ,
*=====================================================================*
*        通常の命令 (マクロではない)                                  *
*=====================================================================*
         LA    R4,WORKAREA              LOAD WORKAREA ADDRESS
         LA    R5,COUNT                 LOAD COUNT ADDRESS
         ST    R1,0(R4)                 STORE TO WORKAREA
         L     R6,0(R4)                 LOAD FROM WORKAREA
         SPACE ,
*=====================================================================*
*        マクロ展開例 4: RESTOREREGS (パラメータなし)                *
*        ⚠️ この行をクリックすると、マクロ展開を確認できます         *
*=====================================================================*
EXIT     EQU   *                        EXIT LABEL
         RESTOREREGS                    MACRO: RESTORE REGISTERS (⚡展開)
         SPACE ,
*=====================================================================*
*        定数の使用 (EQU定義された定数)                               *
*        ⚠️ これらの定数は CONSTANTS.INC から読み込まれています      *
*=====================================================================*
         MVI   FLAG,FLAGON              SET FLAG ON (📄 CONSTANTS.INC)
         C     R6,=F'80'                COMPARE WITH MAXLEN (📄 CONSTANTS.INC)
         BNE   ERROR                    BRANCH IF NOT EQUAL
         SPACE ,
SUCCESS  EQU   *                        SUCCESS LABEL
         LOADCONST R15,RETCODE          MACRO: LOAD RETURN CODE (⚡展開)
         B     EXIT                     BRANCH TO EXIT
         SPACE ,
ERROR    EQU   *                        ERROR LABEL
         MVI   FLAG,FLAGOFF             SET FLAG OFF (📄 CONSTANTS.INC)
         LOADCONST R15,ERRCODE          MACRO: LOAD ERROR CODE (⚡展開)
         SPACE ,
***********************************************************************
*        DATA AREA                                                    *
***********************************************************************
SAVEAREA DS    18F                      SAVE AREA (for SAVEREGS macro)
         DS    0F                       ALIGN TO FULLWORD
WORKAREA DS    18F                      WORK AREA (72 BYTES)
COUNT    DC    F'0'                     COUNT VARIABLE (FULLWORD)
BUFFERLEN DC   F'0'                     BUFFER LENGTH
BUFFERSIZE DC  F'0'                     BUFFER SIZE
FLAG     DC    X'00'                    FLAG BYTE
MSG      DC    CL10'HELLO'              MESSAGE CONSTANT
BUFFER   DS    CL80                     BUFFER AREA (80 BYTES)
         SPACE ,
*---------------------------------------------------------------------*
*        LITERAL POOL                                                 *
*---------------------------------------------------------------------*
         LTORG ,                        LITERAL POOL
         SPACE ,
*---------------------------------------------------------------------*
*        END OF PROGRAM                                               *
*---------------------------------------------------------------------*
         END   MYPROG                   END OF PROGRAM
`;

function App() {
  const [sourceText, setSourceText] = useState(SAMPLE_CODE);
  const [parsedSourceText, setParsedSourceText] = useState(SAMPLE_CODE); // パース対象のソーステキスト
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | undefined>();
  const [fileUpdateTrigger, setFileUpdateTrigger] = useState(0); // ファイル更新を追跡
  const [isParsing, setIsParsing] = useState(false); // パース中フラグ
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parseTimeoutRef = useRef<number | null>(null);
  
  // FileManagerを保持（useMemoでインスタンスを保持）
  const fileManager = useMemo(() => new FileManager(), []);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

  // アプリ起動時に依存ファイルを自動読み込み
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        // dependencies.jsonからファイルリストを取得
        const response = await fetch("/dependencies/dependencies.json");
        if (!response.ok) {
          console.log("dependencies.jsonが見つかりません。依存ファイルの自動読み込みをスキップします。");
          setDependenciesLoaded(true);
          return;
        }

        const data = await response.json();
        const files = data.files || [];

        // 各ファイルを読み込む
        const loadPromises = files.map(async (fileName: string) => {
          try {
            const fileResponse = await fetch(`/dependencies/${fileName}`);
            if (fileResponse.ok) {
              const content = await fileResponse.text();
              fileManager.addFile(fileName, content);
              console.log(`依存ファイル "${fileName}" を自動読み込みしました`);
            } else {
              console.warn(`依存ファイル "${fileName}" が見つかりません`);
            }
          } catch (error) {
            console.error(`依存ファイル "${fileName}" の読み込みに失敗しました:`, error);
          }
        });

        await Promise.all(loadPromises);
        setDependenciesLoaded(true);
        setFileUpdateTrigger((prev) => prev + 1); // 読み込み完了後に再解析を促す
      } catch (error) {
        console.error("依存ファイルの自動読み込みに失敗しました:", error);
        setDependenciesLoaded(true);
      }
    };

    loadDependencies();
  }, [fileManager]); // fileManagerが初期化されたら実行

  // デバウンス: 入力が完了してから500ms後にパースを実行
  useEffect(() => {
    if (parseTimeoutRef.current) {
      clearTimeout(parseTimeoutRef.current);
    }

    setIsParsing(true);
    parseTimeoutRef.current = window.setTimeout(() => {
      setParsedSourceText(sourceText);
      setIsParsing(false);
    }, 500); // 500ms待機

    return () => {
      if (parseTimeoutRef.current !== null) {
        window.clearTimeout(parseTimeoutRef.current);
      }
    };
  }, [sourceText]);

  // ファイルアップロード処理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const content = e.target?.result as string;
          fileManager.addFile(file.name, content);
          console.log(`ファイル "${file.name}" を読み込みました (${content.length} バイト)`);
          resolve();
        };
        
        reader.onerror = () => {
          console.error(`ファイル "${file.name}" の読み込みに失敗しました`);
          reject(new Error(`Failed to read ${file.name}`));
        };
        
        reader.readAsText(file);
      });

      filePromises.push(promise);
    }

    // すべてのファイルの読み込みが完了したら再解析を促す
    await Promise.all(filePromises);
    setFileUpdateTrigger((prev) => prev + 1); // トリガーを更新して再解析を促す
  };

  // ソースコードを解析（デバウンスされたテキストを使用）
  const parseResult = useMemo(() => {
    if (isParsing) {
      // パース中の場合は前回の結果を返す（または空の結果）
      return {
        statements: [],
        errors: [],
        symbols: new Map(),
        context: { symbols: new Map(), macros: new Map() },
      } as AssemblyResult;
    }

    try {
      const parser = new AssemblyParser(fileManager);
      const result = parser.parse(parsedSourceText);
      const analyzed = analyze(result);
      console.log("Parse result:", {
        statementsCount: analyzed.statements.length,
        errorsCount: analyzed.errors.length,
        symbolsCount: analyzed.symbols.size,
        macrosCount: analyzed.context.macros?.size || 0,
        loadedFiles: fileManager.getAllFiles().map(f => f.name),
      });
      return analyzed;
    } catch (error) {
      console.error("Parse error:", error);
      return {
        statements: [],
        errors: [],
        symbols: new Map(),
        context: { symbols: new Map(), macros: new Map() },
      } as AssemblyResult;
    }
  }, [parsedSourceText, fileManager, fileUpdateTrigger, isParsing]);

  const selectedStatement = useMemo(() => {
    if (selectedLineNumber === undefined) return undefined;
    return parseResult.statements.find((s) => s.lineNumber === selectedLineNumber);
  }, [selectedLineNumber, parseResult.statements]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>z/OS アセンブラ解析支援UI</h1>
        <div className="app-info">
          {isParsing && <span style={{ color: "#ffa500" }}>解析中...</span>}
          {!isParsing && (
            <>
              <span>ステートメント数: {parseResult.statements.length}</span>
              <span>シンボル数: {parseResult.symbols.size}</span>
              <span>マクロ数: {parseResult.context.macros?.size || 0}</span>
              <span>読み込み済みファイル: {fileManager.getAllFiles().length}</span>
              {!dependenciesLoaded && <span style={{ color: "#ffa500" }}>依存ファイル読み込み中...</span>}
              {/* {parseResult.errors.length > 0 && (
                <span className="error-count">エラー: {parseResult.errors.length}</span>
              )} */}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".asm,.mac,.inc,.maclib,.txt"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "4px 12px",
              background: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ファイル読み込み
          </button>
        </div>
        {/* {parseResult.errors.length > 0 && (
          <div className="error-list">
            {parseResult.errors.slice(0, 5).map((err, idx) => (
              <div key={idx} className="error-item">
                L{err.lineNumber}: {err.message}
              </div>
            ))}
          </div>
        )} */}
      </header>
      <MainLayout
        editor={
          <div className="editor-section">
            <EditorPane
              text={sourceText}
              setText={setSourceText}
              onCursorChange={(_pos) => {
                // カーソル位置に基づいて行を選択（将来の拡張）
              }}
            />
          </div>
        }
        panels={
          <div className="panels-section">
            <div className="panels-container">
              {parseResult.statements.length > 0 ? (
                <HighlightedView
                  statements={parseResult.statements}
                  selectedLineNumber={selectedLineNumber}
                  onLineClick={setSelectedLineNumber}
                  context={parseResult.context}
                />
              ) : (
                <div className="empty-message">
                  <p>解析結果がありません。ソースコードを入力してください。</p>
                  <p style={{ fontSize: "12px", color: "#858585", marginTop: "8px" }}>
                    デバッグ: ソース行数 = {sourceText.split("\n").length}
                  </p>
                </div>
              )}
            </div>
            <div className="right-panels">
              <DetailPanel 
                statement={selectedStatement}
              />
              <InstructionPanel statement={selectedStatement} context={parseResult.context} />
              <OperandPanel 
                statement={selectedStatement} 
                context={parseResult.context}
                fileManager={fileManager}
                statements={parseResult.statements}
              />
              <LabelPanel symbols={parseResult.symbols} />
              <FilesPanel files={fileManager.getAllFiles()} />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default App;
