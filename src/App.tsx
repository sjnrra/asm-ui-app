import { useState, useMemo } from "react";
import { EditorPane } from "./components/EditorPane/EditorPane";
import { HighlightedView } from "./components/HighlightedView/HighlightedView";
import { DetailPanel } from "./components/panels/DetailPanel";
import { InstructionPanel } from "./components/panels/InstructionPanel";
import { LabelPanel } from "./components/panels/LabelPanel";
import { OperandPanel } from "./components/panels/OperandPanel";
import { MainLayout } from "./layout/MainLayout";
import { parse } from "./core/parser";
import { analyze } from "./core/analyser";
import "./App.css";
import "./styles/layout.css";
import "./styles/highlight.css";

const SAMPLE_CODE = `*=====================================================================*
*        MVS STANDARD HOUSE KEEPING PROCEDURE                         *
*=====================================================================*
*                                  *----------------------------------*
*                                  *  ENTRY PROCESSING                *
*                                  *----------------------------------*
MYASMPGM CSECT ,                        DEFINE CONTROL SECTION
MYASMPGM AMODE 31                       DEFINE DEFAULT AMODE=31
MYASMPGM RMODE 24                       DEFINE DEFAULT RMODE=24
         USING *,12                     DEFINE BASE REGISTER
         SAVE  (14,12),,*               SAVE CALLER REGISTERS
         LA    12,0(,15)                GR12 --> OUR 1ST BASE ADDRESS
         LR    15,13                    SAVE CALLER SAVEAREA
         CNOP  0,4                      INSURE FULL WORD BOUNDARY
         BAS   13,*+4+72                AROUND OUR SAVEAREA
         DC    18F'-1'                  OUR GPR SAVEAREA
         ST    15,4(,13)                SAVE CALLER SAVEAREA POINTER
         ST    13,8(,15)                SET BACK CHAIN FOR LINK TRACE
         SPACE ,
***********************************************************************
*        MAIN LINE PROCESSING.                                        *
*        =====================================================        *
*        GR1 -- EXEC PARAMETER PLIST                                  *
*        GR12 - BASE REGISTER                                         *
*        GR13 - OUR REGISTER SAVEAREA                                 *
*---------------------------------------------------------------------*
*        SAMPLE CODE OF 'MVS ADVANCED SKILL Vol-2' CHAPTER 5.5        *
*        =====================================================        *
*        EXCP PROGRAMMING EXERCISE:                                   *
*        READ DEVICE CHARACTERISTICS.                                 *
*---------------------------------------------------------------------*
*        //GO       EXEC PGM=LOADER,COND=(5,LT,ASM),                  *
*        //SYSUT1   DD   ... ...,VOL=SER=volnam  <===                 *
***********************************************************************
         USING IHADCB,UT1DCB            ADDRESS TO SYSUT1 DCB
         USING IOBSTDRD,IOBAREA         ADDRESS TO IOB STD SECTION
*                                  *----------------------------------*
*                                  *  OPEN TARGET DATASET/DEVICE      *
*                                  *----------------------------------*
         OPEN  (UT1DCB)                 OPEN TARGET VOLUME
         L     R1,DCBDEBAD              LOAD DEB ADDRESS
         LA    R1,DEBBASND-DEBBASIC(,R1)   LOCATE TO DASD SECTION
         MVC   IOBCC,DEBSTRCC-DEBDASD(R1)  SET DATASET EXTENT(CCCC)
         MVC   IOBHH,DEBSTRHH-DEBDASD(R1)  SET DATASET EXTENT(HHHH)
         SPACE ,
*                                  *----------------------------------*
*                                  *  BUILD IOB                       *
*                                  *----------------------------------*
         OI    IOBFLAG1,IOBUNREL        INDICATE UNRELATED I/O
         LA    R0,EXCPECB
         ST    R0,IOBECBPT              SET ECB ADDRESS
         LA    R0,UT1DCB
         STCM  R0,B'0111',IOBDCBPB      SET DCB ADDRESS
         LA    R0,CCW
         ST    R0,IOBSTART              SET CCW ADDRESS
         SPACE ,
*                                  *----------------------------------*
*                                  *  DO PHYSICAL I/O PROCESSING      *
*                                  *----------------------------------*
         MVI   EXCPECB,0                CLEAR ECB
         EXCP  IOBAREA                  ISSUE EXCP I/O
         WAIT  ECB=EXCPECB              WAIT FOR I/O COMPLETION
         SPACE ,
*                                  *----------------------------------*
*                                  *  ENDING PROCESSING               *
*                                  *----------------------------------*
         OPEN  (SNAPDCB,OUTPUT)         OPEN SNAPDUMP DATASET
         SNAP  DCB=SNAPDCB,SDATA=DM,    PRINT DATA MANAGEMENT AREA     +
               STORAGE=(DATAAREA,DATAEND-1)               AND USER DATA
         CLOSE SNAPDCB                  CLOSE SNAPDUMP DATASET
         SPACE ,
         CLOSE UT1DCB                   CLOSE TARGET VOLUME
         IC    RF,IOBECBCC              LOAD EXCP COMPLETION CODE
         SVC   3                        RETURN TO OS(END OF PROGRAM)
         EJECT ,
***********************************************************************
*        DATA AREA                                                    *
***********************************************************************
         DS    ((((*-MYASMPGM)/32+1)*32)-(*-MYASMPGM))X  (ADJUST TO    +
                                   32BYTE BOUNDARY ACCORDING TO THE STOR
                                   AGE DUMP BEGINNING ADDRESS BOUNDARY)
DATAAREA DS    0D                       BEGIN OF DATA AREA
*---------------------------------------------------------------------*
*                                  *----------------------------------*
*                                  *  CHANNEL PROGRAM                 *
*                                  *----------------------------------*
CCW      DS    0D
         CCW   X'64',DEVCHAR,X'00',64   READ DEVICE CHARACTERISTICS
         SPACE ,
*                                  *----------------------------------*
*                                  *  EXCP INTERFACE PARAMETERS       *
*                                  *----------------------------------*
         DC    A(C'IOB.')               EYE-CATCHER
IOBAREA  DC    10F'0'                   IOB(40BYTES)
EXCPECB  DC    F'0'                     ECB FOR I/O SYNCHRONIZE
UT1DCB   DCB   DDNAME=SYSUT1,MACRF=E    DCB FOR EXCP
         SPACE ,
*                                  *----------------------------------*
*                                  *  WORKING DATA                    *
*                                  *----------------------------------*
         DS    0D
         DS    XL8       ADJUST TO 32BYTE BOUNDARY ACCORDING TO THE STOR
                                   AGE DUMP BEGINNING ADDRESS BOUNDARY)
         DC    CL8'DEVCHAR'             EYE-CATCHER
DEVCHAR  DC    XL64'00'                 DEV.CHAR DATA READ AREA
         SPACE ,
DATAEND  DS    0D                       END OF DATA AREA(SNAP AREA)
SNAPDCB  DCB   DDNAME=SNAPDUMP,         DCB FOR SNAP DUMP DATASET      +
               DSORG=PS,MACRF=W,RECFM=VBA,BLKSIZE=1632,LRECL=125
*---------------------------------------------------------------------*
         LTORG ,                        LITERAL POOL AT HERE
         DROP  ,                        FORGET ALL BASE REGISTERS
         EJECT ,
***********************************************************************
*        DATA AREA (OUTSIDE OUR BASE)                                 *
***********************************************************************
*---------------------------------------------------------------------*
*        LOCAL WORKAREA                                               *
*---------------------------------------------------------------------*
*---------------------------------------------------------------------*
*        DSECTS                                                       *
*---------------------------------------------------------------------*
         IEZIOB DSECT=YES               IOB
         DCBD  DEVD=DA                  DCB
         IEZDEB                         DEB
*---------------------------------------------------------------------*
*        S/370, ESA/390 REGISTER EQUATES                              *
*---------------------------------------------------------------------*
         YREGS ,                        OS: REGISTER EQUATES
RA       EQU   10                       ADD EQUATION FOR GR10
RB       EQU   11                       ADD EQUATION FOR GR11
RC       EQU   12                       ADD EQUATION FOR GR12
RD       EQU   13                       ADD EQUATION FOR GR13
RE       EQU   14                       ADD EQUATION FOR GR14
RF       EQU   15                       ADD EQUATION FOR GR15
         END
`;

function App() {
  const [sourceText, setSourceText] = useState(SAMPLE_CODE);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | undefined>();

  // ソースコードを解析
  const parseResult = useMemo(() => {
    try {
      const result = parse(sourceText);
      const analyzed = analyze(result);
      console.log("Parse result:", {
        statementsCount: analyzed.statements.length,
        errorsCount: analyzed.errors.length,
        symbolsCount: analyzed.symbols.size,
        firstStatement: analyzed.statements[0],
      });
      return analyzed;
    } catch (error) {
      console.error("Parse error:", error);
      return {
        statements: [],
        errors: [],
        symbols: new Map(),
        context: { symbols: new Map(), macros: new Map() },
      };
    }
  }, [sourceText]);

  const selectedStatement = useMemo(() => {
    if (selectedLineNumber === undefined) return undefined;
    return parseResult.statements.find((s) => s.lineNumber === selectedLineNumber);
  }, [selectedLineNumber, parseResult.statements]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>z/OS アセンブラ解析支援UI</h1>
        <div className="app-info">
          <span>ステートメント数: {parseResult.statements.length}</span>
          <span>シンボル数: {parseResult.symbols.size}</span>
          {parseResult.errors.length > 0 && (
            <span className="error-count">エラー: {parseResult.errors.length}</span>
          )}
        </div>
        {parseResult.errors.length > 0 && (
          <div className="error-list">
            {parseResult.errors.slice(0, 5).map((err, idx) => (
              <div key={idx} className="error-item">
                L{err.lineNumber}: {err.message}
              </div>
            ))}
          </div>
        )}
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
              <DetailPanel statement={selectedStatement} />
              <InstructionPanel statement={selectedStatement} />
              <OperandPanel statement={selectedStatement} />
              <LabelPanel symbols={parseResult.symbols} />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default App;
