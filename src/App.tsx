import { useState, useMemo, useRef, useEffect } from "react";
import { EditorPane } from "./components/EditorPane/EditorPane";
import { HighlightedView } from "./components/HighlightedView/HighlightedView";
import { DetailPanel } from "./components/panels/DetailPanel";
import { InstructionPanel } from "./components/panels/InstructionPanel";
import { LabelPanel } from "./components/panels/LabelPanel";
import { OperandPanel } from "./components/panels/OperandPanel";
import { FilesPanel } from "./components/panels/FilesPanel";
import { MainLayout } from "./layout/MainLayout";
import { AssemblyParser } from "./core/Parser";
import { analyze } from "./core/analyser";
import { FileManager } from "./core/FileManager";
import type { AssemblyResult } from "./core/Types";
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
*=====================================================================*
ENTRY    EQU   *                        PROGRAM ENTRY POINT
         SAVEREGS                       MACRO: SAVE REGISTERS
         SPACE ,
*=====================================================================*
*        マクロ展開例 2: LOADCONST (パラメータ2つ)                   *
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
*=====================================================================*
EXIT     EQU   *                        EXIT LABEL
         RESTOREREGS                    MACRO: RESTORE REGISTERS
         SPACE ,
*=====================================================================*
*        定数の使用 (EQU定義された定数)                               *
*=====================================================================*
         MVI   FLAG,FLAGON              SET FLAG ON
         C     R6,=F'80'                COMPARE WITH MAXLEN
         BNE   ERROR                    BRANCH IF NOT EQUAL
         SPACE ,
SUCCESS  EQU   *                        SUCCESS LABEL
         LOADCONST R15,RETCODE          MACRO: LOAD RETURN CODE
         B     EXIT                     BRANCH TO EXIT
         SPACE ,
ERROR    EQU   *                        ERROR LABEL
         MVI   FLAG,FLAGOFF             SET FLAG OFF
         LOADCONST R15,ERRCODE          MACRO: LOAD ERROR CODE
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
*=====================================================================*
*======= HERE IS CONTROL CODE, NEVER CHANGE/MODIFY FROM HERE =========*
*=====================================================================*
MAINENTR CSECT ,                        DEFINE CODE SECTION
MAINENTR AMODE 31                       DEFINE DEFAULT AMODE
MAINENTR RMODE 24                       DEFINE DEFAULT RMODE
         USING *,12,11                  DEFINE BASE REGISTER
         STM   14,12,12(13)             SAVE CALLER REGISTERS
         LA    12,0(,15)                GR12 -> OUR 1ST BASE ADDRESS
         LR    11,12
         AHI   11,4096                  GR11 -> OUR 2ND BASE ADDRESS
         LR    15,13                    SAVE CALLER SAVEAREA
         CNOP  0,4                      INSURE FULL WORD BOUNDARY
         BAS   13,*+4+72                AROUND OUR SAVEAREA
         DC    18F'-1'                  OUR GPR SAVEAREA
         ST    15,4(,13)                SAVE CALLER SAVEAREA POINTER
         ST    13,8(,15)                SET BACK CHAIN FOR LINK TRACE
         SPACE ,
***********************************************************************
*        AVAILABLE YOUR ASSEMBLER LANGUAGE CODE AT HERE.              *
*        GR1 -- EXEC PARAMETER PLIST                                  *
*        GR12 - BASE REGISTER                                         *
*        GR13 - OUR REGISTER SAVEAREA                                 *
*---------------------------------------------------------------------*
*        SAMPLE CODE OF 'MVS ADVANCED SKILL Vol-2' CHAPTER 5.7        *
*        =====================================================        *
*        LIST VTOC BY CVAFSEQ, CVAFDIR AND LSPACE.                    *
*        CC=00: ALL PROCESSING DONE.                                  *
*        CC=08: INVALID ENVIRONMENT.                                  *
*               SYSPRINT OR SYSUT1 DD STMT IS NOT DEFINED.            *
*        CC=12: DADSM OR CVAF API ERROR.                              *
*---------------------------------------------------------------------*
*        //GO       EXEC PGM=LOADER,COND=(5,LT,ASM),                  *
*        //SYSUT1   DD   ... ...,VOL=SER=volnam  <===                 *
***********************************************************************
*                                  *----------------------------------*
*                                  *  OPEN VTOC AND GET DSCB4 ADDR    *
*                                  *  ==============================  *
*                                  *                                  *
*                                  *----------------------------------*
         USING DJFCBN,JFCBAREA          ADDRESS TO JFCB READ AREA
         RDJFCB UT1DCB                  READ JFCB OF SYSUT1 DD STMT
         LTR   RF,RF                    DEFINED SYSPRINT DD STMT ?
         BNZ   EOJCC08                  NO, ABORT PROCESSING
         MVC   VOLSER,JFCBVOLS          MOVE DD STMT VOLUME NAME
         MVC   JFCBDSNM,=44X'04'        SET VTOC DSNAME
         LA    RA,UT1DCB                LOAD SYSUT1 DCB
         USING IHADCB,RA                ADDRESS IT
         OPEN  ((10)),TYPE=J            OPEN TARGET VOLUME
         L     R1,DCBDEBAD              LOAD DEB ADDRESS
         ST    R1,ADEB                  SAVE IT FOR LATER
         DROP  RA                       FORGET DCB
         SPACE ,
         USING DEBBASIC,R1              ADDRESS TO DEB
         LA    R1,DEBBASND              LOCATE TO DEB DASD SECTION
         USING DEBDASD,R1               ADDRESS TO DEB DASD SECTION
         MVC   CCHHR(4),DEBSTRCC        SET 1ST DSCB RECORD CCHH
         MVI   CCHHR+4,1                SET 1ST DSCB RECORD R
         ICM   R1,B'0111',DEBUCBA       LOAD UCB ADDRESS
         ST    R1,AUCB                  SAVE IT FOR LATER
         DROP  R1                       FORGET DEB
         SPACE ,
*                                  *----------------------------------*
*                                  *  GET FREE SPACE SUMMARY          *
*                                  *          AND READ FORMAT-4 DSCB  *
*                                  *  ==============================  *
*                                  *                                  *
*                                  *----------------------------------*
         USING DDSCB,DSCBAREA           ADDRESS TO DSCB READ AREA
         USING DLSPDATA,LSPDATA         ADDRESS TO LSPACE DATA AREA
         LSPACE UCB=AUCB,DATA=LSPDATA,  ISSUE LSPACE WITH DATA         +
               F4DSCB=DSCBDATA,           AND RETURN FORMAT-4 DSCB DATA+
               MF=(E,LSPPARM)
         LTR   RF,RF                    SUCCESSFUL ?
         BZ    LSPDONE                  YES, CONTINUE PROCESSING
         STC   RF,DOUBLE                NO, SET LSPACE RETCD = COMPCODE
         LSPACE UCB=AUCB,               ISSUE LSPACE WITH EXPMSG       +
               MSG=ERRMSG1+32,             TO GENERATE LSPACE ERROR MSG+
               MF=(E,LSPPARM)
         LA    R0,1                     LOAD BINARY DATA LENGTH
         LA    RF,DOUBLE                LOAD BINARY DATA ADDRESS
         LA    R1,ERRMSG1+28            LOAD EDIT FIELD IN MSG TEXT
         BAS   RE,CNVBTX                CONVERT BI TO HEX-DECIMAL CHARS
         WTO   MF=(E,ERRMSG1)           INFORM LSPACE ERROR MSG
         B     EOJCC12                  ABORT PROCESSING
LSPDONE  DS    0H
         MVC   DEVDSTRK,DS4DSTRK        GET TRACK#/CYL
         IC    R0,DS4DEVDT              GET DSCB#/TRK
         STC   R0,DEVDEVDT+1
         SPACE ,
*                                  *----------------------------------*
*                                  *  PRINT VOLUME VTOC AND FREE      *
*                                  *                   SPACE SUMMARY  *
*                                  *  ==============================  *
*                                  *                                  *
*                                  *----------------------------------*
         LA    RA,LISTDCB               LOAD LIST DATASET DCB
         USING IHADCB,RA                ADDRESS IT
         DEVTYPE DCBDDNAM,DOUBLE        TEST DD STMT DEFINITION
         DROP  RA                       FORGET DCB
         LTR   RF,RF                    DEFINED SYSPRINT DD STMT ?
         BNZ   EOJCC08                  NO, ABORT PROCESSING
         OPEN  (LISTDCB,OUTPUT)         OPEN SYSPRINT LIST DATASET
         SPACE ,
         MVC   PRTVOLNM,VOLSER          SET VOLUME NAME IN PRINT TITLE
         PUT   LISTDCB,TITLE            PRINT TITLE LINE
         PUT   LISTDCB,SEPLINE          PRINT SEPARATOR LINE
         SPACE ,
         LA    R1,DS4VTOCE              LOAD EXTENT DESCRIPTER
         BAS   RA,GETTRKS               GET NUM OF VTOC TRACKS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRVTSIZE,=XL6'402020202120'
         ED    PRVTSIZE,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         MH    R0,DEVDEVDT              GET NUM OF VTOC DSCBS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRVTDSCB,=XL6'402020202120'
         ED    PRVTDSCB,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDF0S               LOAD NUM OF FREE DSCBS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRVTDSC0,=XL6'402020202120'
         ED    PRVTDSC0,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         LA    R0,8                     LOAD BINARY DATA LENGTH
         LA    RF,DS4VTOCE+2            LOAD BINARY DATA ADDRESS
         LA    R1,DSCBKEY               LOAD WORKAREA ADDRESS
         BAS   RE,CNVBTX                CONVERT BI TO HEX-DECIMAL CHARS
         MVC   PRVTBGNC,DSCBKEY+0       MOVE BEGIN CCCC
         MVC   PRVTBGNH,DSCBKEY+4       MOVE BEGIN HHHH
         MVC   PRVTENDC,DSCBKEY+8       MOVE END CCCC
         MVC   PRVTENDH,DSCBKEY+12      MOVE END HHHH
         TM    DS4VTOCI,DS4IVTOC        INDEX VTOC ?
         BO    *+4+6                    YES,
         MVC   PRVTINDX,=CL3'NO'        NO, INDICATE IT
         TM    DS4SMSFG,DS4SMS          SMS MANAGED VOLUME ?
         BO    *+4+6                    YES,
         MVC   PRVTSMSM,=CL3'NO'        NO, INDICATE IT
         PUT   LISTDCB,VTOCSUM          PRINT VTOC SUMMARY LINE
         SPACE ,
         L     R0,LSPDNEXT              LOAD NUM OF FREE EXTENTS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSEXT#,=XL6'402020202120'
         ED    PRFSEXT#,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDTCYL              LOAD TOTAL FREE CYLINDERS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSCYLT,=XL6'402020202120'
         ED    PRFSCYLT,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDTTRK              LOAD TOTAL ADDITIONAL TRACKS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSTRKT,=XL6'402020202120'
         ED    PRFSTRKT,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDLCYL              LOAD LARGEST FREE CYLINDERS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSCYLL,=XL6'402020202120'
         ED    PRFSCYLL,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDLTRK              LOAD LARGEST ADDITIONAL TRKS
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSTRKL,=XL6'402020202120'
         ED    PRFSTRKL,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         L     R0,LSPDFRAG              LOAD FRAGMENT INDEX
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRFSFRAG,=XL6'402020202120'
         ED    PRFSFRAG,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         PUT   LISTDCB,FREESUM          PRINT FREE SPACE SUMMARY LINE
         PUT   LISTDCB,BLANKS           PRINT BLANK LINE
         PUT   LISTDCB,MIDASHI1         PRINT DSLIST MIDASHI-1 LINE
         PUT   LISTDCB,MIDASHI2         PRINT DSLIST MIDASHI-2 LINE
         SPACE ,
*                                  *----------------------------------*
*                                  *  READ VTOC DSCB RECORD           *
*                                  *  ==============================  *
*                                  *  GR6 --> DSCB1 SEQUENCE NUMBER   *
*                                  *----------------------------------*
         USING CVPL,CVAFPL              ADDRESS TO CVAF PLIST
         MVC   DSCBKEY,BLANKS           INIT 1ST DSNAME FIELD
         SLR   R6,R6                    GR6 --> DSCB1 SEQUENCE NUMBER
READLOOP DS    0H
         L     RA,ADEB                  LOAD DEB ADDRESS
         CVAFSEQ ACCESS=GT,             READ NEXT FORMAT-1 DSCB RECORD +
               DEB=(10),BUFLIST=BUFLIST1,                              +
               DSN=DSCBKEY,DSNONLY=NO,IXRCDS=KEEP,                     +
               MF=(E,CVPL)
         B     *+4(RF)                  INDEX BRANCH BY RETURN CODE
         B     TESTDSCB                  00: CONTINUE PROCESSING
         B     TESTEOD                   04: INFORM CVAF ERROR
         B     CVAFERR                   08:       AND ABORT PROCESSING
         B     CVAFERR                   0C:   I
         B     CVAFERR                   10:   V
TESTEOD  DS    0H
         CLI   CVSTAT,32                ALL FORMAT-1 DSCB DONE ?
         BE    EOJCC00                  YES, PROCESSING DONE
         B     CVAFERR                  NO, CVAF ERROR
         SPACE ,
*                                  *----------------------------------*
*                                  *  EDIT FORMAT-1 DSCB              *
*                                  *  ==============================  *
*                                  *  GR6 --> DSCB1 SEQUENCE NUMBER   *
*                                  *----------------------------------*
TESTDSCB DS    0H
         LA    R6,1(,R6)                INCREMENT DSCB1 SEQ NUMBER
         SPACE ,
         MVC   DSLINE,BLANKS            CLEAR DATASET LINE
         CVD   R6,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSSEQ#,DOUBLE          CONVERT IT TO ZONE DECIMAL
         OI    PRDSSEQ#+3,C'0'          MAKE IT A HUMAN READABLE
         MVC   PRDSNAME,DS1DSNAM        SET DSNAME
         SPACE ,
*                                  *----------------------------------*
*                                  *  EDIT DSORG, RECFM, BLKSZ/LRECL  *
*                                  *----------------------------------*
         TM    DS1DSORG+0,DS1DSGPS      DSORG=PS ?
         BNO   *+4+6+4+4+6              NO,
         MVC   PRDSORG,=CL4'PS'         YES, SET DSORG=PS
         TM    DS1SMSFG,DS1STRP         EXTEND DATASET ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG+2(2),=CL2'-E'    YES, SET DSORG=PS-E
         TM    DS1DSORG+0,DS1DSGPO      DSORG=PO ?
         BNO   *+4+6+4+4+6              NO,
         MVC   PRDSORG,=CL4'PO'         YES, SET DSORG=PO
         TM    DS1SMSFG,DS1PDSE         PDSE DATASET ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG+2(2),=CL2'-E'    YES, SET DSORG=PO-E
         TM    DS1DSORG+0,DS1DSGDA      DSORG=DA ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG,=CL4'DA'         YES, SET DSORG=DA
         TM    DS1DSORG+0,DS1DSGIS      DSORG=IS ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG,=CL4'IS'         YES, SET DSORG=IS
         TM    DS1DSORG+0,DS1DSGU       DSORG=..U ?
         BNO   *+4+4                    NO,
         MVI   PRDSORG+2,C'U'           YES, INDICATE DSORG=..U
         SPACE ,
         TM    DS1DSORG+1,DS1ACBM       DSORG=VS ?
         BNO   *+4+6+4+4+6              NO,
         MVC   PRDSORG,=CL4'VSAM'       YES, SET DSORG=VSAM
         TM    DS1SMSFG,DS1STRP         EXTEND DATASET ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG+2(2),=CL2'-E'    YES, SET DSORG=VS-E
         TM    DS1SMSFG,DS1PDSEX        HFS DATASET ?
         BNO   *+4+6                    NO,
         MVC   PRDSORG,=CL4'HFS'        YES, SET DSORG=HFS
         SPACE ,
         MVC   PRDSREC,=CL3'U'          ASSUME RECFM=U
         TM    DS1RECFM,DS1RECFU        RECFM=U ?
         BO    *+4+6+4+4+6+4+4+6        YES,
         MVC   PRDSREC,=CL3'F'          ASSUME RECFM=F
         TM    DS1RECFM,DS1RECFF        RECFM=F ?
         BO    *+4+6+4+4+6              YES,
         MVC   PRDSREC,=CL3'V'          ASSUME RECFM=V
         TM    DS1RECFM,DS1RECFV        RECFM=V ?
         BO    *+4+6                    YES,
         MVC   PRDSREC,BLANKS           NO, CLEAR RECFM
         TM    DS1RECFM,DS1RECFB        RECFM=.B ?
         BNO   *+4+4                    NO,
         MVI   PRDSREC+1,C'B'           YES, INDICATE RECFM=.B
         TM    DS1RECFM,DS1RECFS        RECFM=..S ?
         BNO   *+4+4                    NO,
         MVI   PRDSREC+2,C'S'           YES, INDICATE RECFM=..S
         TM    DS1RECFM,DS1RECFA        RECFM=..A ?
         BNO   *+4+4                    NO,
         MVI   PRDSREC+2,C'A'           YES, INDICATE RECFM=..A
         TM    DS1RECFM,DS1RECMC        RECFM=..M ?
         BNO   *+4+4                    NO,
         MVI   PRDSREC+2,C'M'           YES, INDICATE RECFM=..M
         CLI   PRDSREC+1,C' '           2ND BYTE IS BLANK ?
         BNE   *+4+4+4+4                NO,
         IC    R0,PRDSREC+2             LOAD 3RD BYTE CHARACTER
         STC   R0,PRDSREC+1             MOVE TO 2ND BYTE
         MVI   PRDSREC+2,C' '           CLEAR 3RD BYTE
         SPACE ,
         SLR   R0,R0                    CLEAR WORKREG
         ICM   R0,B'0011',DS1BLKL       LOAD BLKSIZE
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDSBLKS,=XL6'402020202120'
         ED    PRDSBLKS,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         ICM   R0,B'0011',DS1LRECL      LOAD LRECL
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDSLREC,=XL6'402020202120'
         ED    PRDSLREC,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         SPACE ,
*                                  *----------------------------------*
*                                  *  EDIT 2ND SPACE VALUE            *
*                                  *----------------------------------*
         SLR   R0,R0                    CLEAR WORKREG
         SLR   R1,R1                    CLEAR WORKREG
         ICM   R1,B'0111',DS1SCAL3      LOAD 2ND SPACE ITEM
         TM    DS1SCAL1,DS1EXT          EXTEND SPACE ATTRIBUTES ?
         BNO   EDIT2NDS                 NO, USE DS1SCAL3
         TM    DS1SCXTF,DS1SCMB+DS1SCKB+DS1SCUB  LRECL ALLOCATION ?
         BZ    EDIT2NDS                 NO, USE DS1SCAL3
         SLR   R1,R1                    CLEAR WORKREG AGAIN
         ICM   R1,B'0011',DS1SCXTV      USE EXT 2ND SPACE
         TM    DS1SCXTF,DS1SCCP1        COMP BY 256 ?
         BNO   *+4+4                    NO,
         SLL   R1,8                     YES, 256 = 2^8
         TM    DS1SCXTF,DS1SCCP2        COMP BY 65536 ?
         BNO   *+4+4                    NO,
         SLL   R1,16                    YES, 65536 = 2^16
         LH    RF,DS1LRECL              LOAD LRECL
         TM    DS1SCXTF,DS1SCAVB        USE AVG BLOCK ?
         BNO   *+4+4                    NO,
         LH    RF,DS1BLKL               LOAD BLKSIZE
         DR    R0,RF                    GET EXPAND RECS
EDIT2NDS DS    0H
         C     R1,=F'999'               OVER 3DIGIT ?
         BNH   *+4+4                    NO,
         L     R1,=F'999'               YES, ASSUME=999 2ND ITEMS
         CVD   R1,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDS2ND,=XL4'40202120'
         ED    PRDS2ND,DOUBLE+6         EDIT IT TO ZZ9 FORMAT
         TM    DS1DSORG+1,DS1ACBM       DSORG=VS ?
         BO    *+4+4+4+6                YES,
         TM    DS1SCAL1,DS1CONTG        CONTIG REQUEST ?
         BNO   *+4+6                    NO,
         MVC   PRDS2ND+1(3),=CL3'CNT'   ASSUME 2ND=CONTIG
         SPACE ,
*                                  *----------------------------------*
*                                  *  EDIT CREATED, REFERRED AND      *
*                                  *                    EXPIRED DATE  *
*                                  *----------------------------------*
         CLC   DS1CREDT,=XL3'00'        NO CREATED DATE ?
         BE    NOCREDTE                 YES, IGNORE THIS FIELD
         SLR   R0,R0                    CLEAR WORKREG
         IC    R0,DS1CREDT+0            LOAD CREATED YEAR
         AHI   R0,1900                  ADD 1900
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSCRED(2),DOUBLE       CONVERT IT TO ZONE DECIMAL
         OI    PRDSCRED+1,C'0'          MAKE IT A HUMAN READABLE
         MVI   PRDSCRED+2,C'-'
         ICM   R0,B'0011',DS1CREDT+1    LOAD CREATED DATE
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSCRED+3(3),DOUBLE     CONVERT IT TO ZONE DECIMAL
         OI    PRDSCRED+5,C'0'          MAKE IT A HUMAN READABLE
NOCREDTE DS    0H
         CLC   DS1REFD,=XL3'00'         NO REFERRED DATE ?
         BE    NOREFDTE                 YES, IGNORE THIS FIELD
         SLR   R0,R0                    CLEAR WORKREG
         IC    R0,DS1REFD+0             LOAD REFERRED YEAR
         AHI   R0,1900                  ADD 1900
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSREFD(2),DOUBLE       CONVERT IT TO ZONE DECIMAL
         OI    PRDSREFD+1,C'0'          MAKE IT A HUMAN READABLE
         MVI   PRDSREFD+2,C'-'
         ICM   R0,B'0011',DS1REFD+1     LOAD REFERRED DATE
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSREFD+3(3),DOUBLE     CONVERT IT TO ZONE DECIMAL
         OI    PRDSREFD+5,C'0'          MAKE IT A HUMAN READABLE
NOREFDTE DS    0H
         CLC   DS1EXPDT,=XL3'00'        NO EXPIRED DATE ?
         BE    NOEXPDTE                 YES, IGNORE THIS FIELD
         SLR   R0,R0                    CLEAR WORKREG
         IC    R0,DS1EXPDT+0            LOAD EXPIRED YEAR
         AHI   R0,1900                  ADD 1900
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSEXPD(2),DOUBLE       CONVERT IT TO ZONE DECIMAL
         OI    PRDSEXPD+1,C'0'          MAKE IT A HUMAN READABLE
         MVI   PRDSEXPD+2,C'-'
         ICM   R0,B'0011',DS1EXPDT+1    LOAD EXPIRED DATE
         CVD   R0,DOUBLE                CONVERT SEQ# TO DECIMAL
         UNPK  PRDSEXPD+3(3),DOUBLE     CONVERT IT TO ZONE DECIMAL
         OI    PRDSEXPD+5,C'0'          MAKE IT A HUMAN READABLE
NOEXPDTE DS    0H
         SPACE ,
*                                  *----------------------------------*
*                                  *  GET AND EDIT ALLOCATED SPACES   *
*                                  *  ==============================  *
*                                  *  GR6 --> DSCB1 SEQUENCE NUMBER   *
*                                  *  GR7 --> DATASET ALLOCATED TRKS  *
*                                  *----------------------------------*
         SLR   R0,R0                    CLEAR WORKREG
         IC    R0,DS1NOEPV              LOAD NUM OF EXTENTS ON VOLUME
         CVD   R0,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDSEXT#,=XL4'40202120'
         ED    PRDSEXT#,DOUBLE+6        EDIT IT TO ZZ9 FORMAT
         MVI   PRDSEXT#,C'('
         MVI   PRDSEXT#+4,C')'
         SPACE ,
         MVC   WRKDSORG,DS1DSORG        SAVE FOR LATER
         MVC   WRKSMSFG,DS1SMSFG         I
         MVC   WRKLSTAR,DS1LSTAR         I
         MVC   WRKTRBAL,DS1TRBAL         I
         MVC   WRKSCAL1,DS1SCAL1         I
         MVC   WRKKEYL,DS1KEYL           I
         MVC   WRKBLKL,DS1BLKL           I
         MVC   WRKLRECL,DS1LRECL         I
         MVC   WRKSCEXT,DS1SCEXT         V
         SPACE ,
         LA    R2,3                     GR2 --> LOOP COUNTER
         LA    R3,DS1EXT1               GR3 --> EXTENT DESCRIPTER
         SLR   R7,R7                    GR7 --> ALLOCATED TRACKS
         LR    R1,R3                    LOAD EXTENT DESCRIPTER
         BAS   RA,GETTRKS               GET NUM OF VTOC TRACKS         +
                                        GR0 <-- NUM OF ALLOCATED TRKS
         AR    R7,R0                    ADD TRACKS ON THIS EXTENT
         LA    R3,10(,R3)               LOCATE TO NEXT EXTENT DESC.
         BCT   R2,*-4-2-4-2             LOOP FOR FORMAT-1 DSCB
         MVC   JFCBAREA(44),DSCBKEY     SAVE CURRENT DSN
READSCB3 DS    0H
         CLC   DS1PTRDS,=XL5'00'        CHAINED FORMAT-3 DSCB ?
         BE    ENDDSCB3                 NO, ALL FORMAT-3 DSCB DONE
         MVC   CCHHR,DS1PTRDS           SET FORMAT-3 DSCB ADDRESS
         L     RA,ADEB                  LOAD DEB ADDRESS
         CVAFDIR ACCESS=READ,           READ CHAINED FORMAT-3 DSCB     +
               DEB=(10),                                               +
               BUFLIST=BUFLIST2,DSN=*,                                 +
               MF=(E,CVPL)
         B     *+4(RF)                  INDEX BRANCH BY RETURN CODE
         B     *+4+4+4+4+4               00: CONTINUE PROCESSING
         B     CVAFERR                   04: INFORM CVAF ERROR
         B     CVAFERR                   08:       AND ABORT PROCESSING
         B     CVAFERR                   0C:   I
         B     CVAFERR                   10:   V
         LA    R2,4                     GR2 --> LOOP COUNTER
         LA    R3,DS3EXTNT              GR3 --> EXTENT DESCRIPTER
         LR    R1,R3                    LOAD EXTENT DESCRIPTER
         BAS   RA,GETTRKS               GET NUM OF VTOC TRACKS         +
                                        GR0 <-- NUM OF ALLOCATED TRKS
         AR    R7,R0                    ADD TRACKS ON THIS EXTENT
         LA    R3,10(,R3)               LOCATE TO NEXT EXTENT DESC.
         BCT   R2,*-4-2-4-2             LOOP FOR FORMAT-3 DSCB
         LA    R2,9                     GR2 --> LOOP COUNTER
         LA    R3,DS3ADEXT              GR3 --> EXTENT DESCRIPTER
         LR    R1,R3                    LOAD EXTENT DESCRIPTER
         BAS   RA,GETTRKS               GET NUM OF VTOC TRACKS         +
                                        GR0 <-- NUM OF ALLOCATED TRKS
         AR    R7,R0                    ADD TRACKS ON THIS EXTENT
         LA    R3,10(,R3)               LOCATE TO NEXT EXTENT DESC.
         BCT   R2,*-4-2-4-2             LOOP FOR FORMAT-3 DSCB
         B     READSCB3                 READ NEXT FORMAT-3 DSCB
ENDDSCB3 DS    0H
         MVC   DSCBKEY,JFCBAREA         RESTORE PREVIOUS DSNAME
         CVD   R7,DOUBLE                CONVERT ALLOCED TRKS TO DECIMAL
         MVC   PRDSALOC,=XL6'402020202120'
         ED    PRDSALOC,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         SPACE ,
         TM    WRKDSORG+1,DS1ACBM       DSORG=VS ?
         BO    ENDUSED                  YES, DS1LSTAR IS INVALID
         TM    WRKSMSFG,DS1PDSE         PDSE DATASET ?
         BO    ENDUSED                  YES, DS1LSTAR IS INVALID
         TM    WRKDSORG+0,DS1DSGDA      DSORG=DA ?
         BO    ENDUSED                  YES, DS1LSTAR IS INVALID
         SLR   R1,R1                    CLEAR WORKREG
         ICM   R1,B'0111',WRKLSTAR      LOAD TTR FROM LSTAR
         BZ    *+4+4+4                  IF NO RECORD WRITTEN
         SRL   R1,8                     DROP NUM OF RECS/TRK
         LA    R1,1(,R1)                CORRECT USED TRACKS
         TM    WRKSMSFG,DS1STRP         EXTEND DATASET ?
         BNO   *+4+4                    NO,
         ICM   R1,B'1100',WRKTRBAL      LOAD HI-ORDER TT FROM TRBAL
         MH    R1,=H'1000'              TIMES 1000 FOR %
         LTR   R7,R7                    TEST ALLOCATED TRKS
         BZ    *+4+2+2                  IF ZERO, AVOID S0C9
         SLR   R0,R0                    CLEAR WORKREG
         DR    R0,R7                    CALCULATE USED%(999.9%)
         CVD   R1,DOUBLE                CONVERT IT TO DECIMAL
         MVC   JFCBAREA(7),=XL7'40202021204B20'
         ED    JFCBAREA(7),DOUBLE+5     EDIT IT TO ZZZ9.9 FORMAT
         MVC   PRDSUSED,JFCBAREA+2      SET USED%
ENDUSED  DS    0H
         SPACE ,
         TM    WRKSCAL1,DS1EXT          EXTEND SPACE ATTRIBUTES ?
         BNO   SPTYPTRD                 NO, ITS TRADITIONAL ALLOCATION
         TM    WRKSCEXT,DS1SCMB+DS1SCKB+DS1SCUB  USE AVGREC=M|K|U ?
         BNZ   SPTYPEXT                 YES, ITS LRECL ALLOCATION
SPTYPTRD DS    0H
         TM    WRKSCAL1,DS1CYL          CYLINDER REQUEST ?
         BO    SPTYPCYL                 YES,
         TM    WRKSCAL1,DS1TRK          TRACK REQUEST ?
         BO    SPTYPTRK                 YES,
         TM    WRKSCAL1,DS1AVR          AVG. BLOCK REQUEST ?
         BO    SPTYPBLK                 YES,
         TM    WRKSCAL1,X'D0'           ABS. TRACK REQUEST ?
         BZ    SPTYPABS                 YES,                           +
                                        NO, ASSUME TRK ALLOCATION
SPTYPTRK DS    0H
         MVC   PRDSSTYP,=CL3'TRK'       SET ALLOC=TRK
         B     SPTYPEND
SPTYPABS DS    0H
         MVC   PRDSSTYP,=CL3'ABS'       SET ALLOC=ABS TRK
         B     SPTYPEND
SPTYPCYL DS    0H
         MVC   PRDSSTYP,=CL3'CYL'       SET ALLOC=CYL
         LH    RF,DEVDSTRK              LOAD NUM OF HEADS
         SLR   R0,R0                    CLEAR WORKREG
         LR    R1,R7                    LOAD ALLOCATED TRKS
         DR    R0,RF                    CONVERT TO CYLS
         LR    R7,R1                    LOAD IT INTO GR7
         B     SPTYPEND
SPTYPBLK DS    0H
         MVC   PRDSSTYP,=CL3'BLK'       SET ALLOC=BLK
         SLR   R2,R2                    CLEAR WORKREG
         IC    R2,WRKKEYL               LOAD KEY LENGTH
         LH    R3,WRKBLKL               LOAD BLOCK SIZE
         TRKCALC FUNCTN=TRKCAP,         CALL TRKCALC ROUTINE           +
               UCB=AUCB,R=1,            (CALCULATE NUM OF BLKS/TRK)    +
               K=(2),DD=(3),REGSAVE=YES
         LR    R1,R0                    LOAD NUM OF BLKS/TRK
         SLR   R0,R0                    CLEAR FOR MULTIPLY
         MR    R0,R7                    CONVERT TO BLOCKS
         C     R1,=F'99999'             OVER 5DIGIT ?
         BNH   *+4+4                    NO,
         L     R1,=F'99999'             YES, ASSUME=99999BLKS
         LR    R7,R1                    LOAD IT INTO GR7
         B     SPTYPEND
SPTYPEND DS    0H
         CVD   R7,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDSSIZE,=XL6'402020202120'
         ED    PRDSSIZE,DOUBLE+5        EDIT IT TO ZZZZ9 FORMAT
         B     PRNTLINE                 DO PRINT DATASET LINE
         SPACE ,
SPTYPEXT DS    0H
         SLR   R2,R2                    CLEAR WORKREG
         IC    R2,WRKKEYL               LOAD KEY LENGTH
         LH    R3,WRKBLKL               LOAD BLOCK SIZE
         TRKCALC FUNCTN=TRKCAP,         CALL TRKCALC ROUTINE           +
               UCB=AUCB,R=1,            (CALCULATE NUM OF BLKS/TRK)    +
               K=(2),DD=(3),REGSAVE=YES
         LR    R1,R0                    LOAD NUM OF BLKS/TRK
         SLR   R0,R0                    CLEAR FOR MULTIPLY
         MR    R0,R7                    CONVERT TO BLOCKS
         SLR   RE,RE                    CLEAR FOR DIVIDE
         LH    RF,WRKBLKL               LOAD BLKSIZE
         LH    RA,WRKLRECL              LOAD LRECL
         LTR   RA,RA                    LRECL=0 ?
         BNZ   *+4+4                    NO,
         LA    RA,1                     YES, ADJUST TO 1(AVOID S0C9)
         DR    RE,RA                    GET BLOCKING FACTOR
         MR    R0,RF                    CONVERT TO ALLOCATED RECS
         MVI   PRDSSTYP+2,C'U'          ASSUME ALLOC=UREC
         TM    WRKSCEXT,DS1SCUB         USE AVGREC=U ?
         BO    SPEDTREC                 YES,
         SRL   R1,10                    CONVERT TO KB
         MVI   PRDSSTYP+2,C'K'          ASSUME ALLOC=KREC
         TM    WRKSCEXT,DS1SCKB         USE AVGREC=K ?
         BO    SPEDTREC                 YES,
         SRL   R1,10                    CONVERT TO MB
         MVI   PRDSSTYP+2,C'M'          ASSUME ALLOC=MREC
SPEDTREC DS    0H
         C     R1,=F'9999999'           OVER 7DIGIT ?
         BNH   *+4+4                    NO,
         L     R1,=F'9999999'           YES, ASSUME=9999999RECS
         CVD   R1,DOUBLE                CONVERT IT TO DECIMAL
         MVC   PRDSSIZE(8),=XL8'4020202020202120'
         ED    PRDSSIZE(8),DOUBLE+4     EDIT IT TO ZZZZZZ9 FORMAT
         SPACE ,
*                                  *----------------------------------*
*                                  *  PRINT DATASET LINE              *
*                                  *  ==============================  *
*                                  *                                  *
*                                  *----------------------------------*
PRNTLINE DS    0H
         PUT   LISTDCB,DSLINE           PRINT DATASET LINE
         B     READLOOP                 LOOP FOR NEXT DSCB
         SPACE ,
*                                  *----------------------------------*
*                                  *  ENDING PROCEDURE                *
*                                  *  ==============================  *
*                                  *                                  *
*                                  *----------------------------------*
EOJCC12  DS    0H
         LA    RA,12                    SET COMPLETION CODE = 12
         B     EOJPROC
EOJCC08  DS    0H
         LA    RA,8                     SET COMPLETION CODE = 8
         B     EOJPROC
EOJCC00  DS    0H
         PUT   LISTDCB,SEPLINE          PRINT SEPARATOR LINE
         SLR   RA,RA                    SET COMPLETION CODE = 0
EOJPROC  DS    0H
         CVAFDIR ACCESS=RLSE,           RELEASE CVAF RESOURCES         +
               BUFLIST=0,IXRCDS=NOKEEP,                                +
               MF=(E,CVPL)
         CLOSE UT1DCB                   CLOSE TARGET VOLUME
         CLOSE LISTDCB                  CLOSE LIST DATASET
         LR    RF,RA                    LOAD COMPLETION CODE
         L     RD,4(,RD)                LOAD CALLER SAVEAREA POINTER
         L     RE,12(,RD)               LOAD RETURN ADDRESS
         LM    R0,RC,20(RD)             LOAD CALLER REGISTERS
         B     0(,RE)                   RETURN TO CALLER
******** SVC   3                        RETURN TO OS(END OF PROGRAM)
         SPACE ,
CVAFERR  DS    0H
         STC   RF,DOUBLE                SET RETURN CODE
         LA    R0,1                     LOAD BINARY DATA LENGTH
         LA    RF,DOUBLE                LOAD BINARY DATA ADDRESS
         LA    R1,ERRMSG2+29            LOAD EDIT FIELD IN MSG TEXT
         BAS   RE,CNVBTX                CONVERT BI TO HEX-DECIMAL CHARS
         LA    R0,1                     LOAD BINARY DATA LENGTH
         LA    RF,CVSTAT                LOAD BINARY DATA ADDRESS
         LA    R1,ERRMSG2+39            LOAD EDIT FIELD IN MSG TEXT
         BAS   RE,CNVBTX                CONVERT BI TO HEX-DECIMAL CHARS
         MVC   ERRMSG2+13(4),=CL4'SEQ'  ASSUME CVAFSEQ
         CLI   CVFCTN,CVSEQGT           CVAFSEQ ?
         BNL   *+4+6                    YES,
         MVC   ERRMSG2+13(4),=CL4'DIR'  NO, SET CVAFDIR
         MVC   ERRMSG2+46(6),VOLSER     SET VOLUME NAME
         WTO   MF=(E,ERRMSG2)           INFORM I/O ERROR MESSAGE
         B     EOJCC12                  RETURN TO MAINLINE
********        -+----1----+----2----+----3----+----4----+----5
ERRMSG1  WTO   'DADSM(LSPACE) ERROR, RC=@@ (@@@@@@@@@@@@@@@@@@@@@@@@@@@+
               @@@)',MF=L,                                             +
               MCSFLAG=HRDCPY                                   ZOSv23
ERRMSG2  WTO   'CVAF(CVAF@@@@) ERROR, RC=@@ CVSTAT=@@ VOL=@@@@@@',MF=L,+
               MCSFLAG=HRDCPY                                   ZOSv23
         SPACE ,
***********************************************************************
*        I N T E R N A L  S U B  R O U T I N E S                      *
***********************************************************************
*---------------------------------------------------------------------*
* GETTRKS - CALCULATE ALLOCATED TRACKS ON EXTENT                      *
* CALL INTERFACE -                                                    *
*  GR1:  EXTENT DESCRIPTER(DS1EXT1,2,3,DS3EXT1...)                    *
*  BAS RA,GETTRKS                                                     *
*---------------------------------------------------------------------*
GETTRKS  DS    0H
         SLR   R0,R0                    CLEAR WORKREG
         CLI   0(R1),0                  VALID EXTENT ?
         BER   RA                       NO, 0 EXTENT IN THIS DESCRIPTER
         LR    RE,R1                    GR14 -> EXTENT DESCRIPTER
         SLR   R1,R1                    CLEAR WORKREG
         ICM   R0,B'0011',2(RE)         LOAD BEGIN ADDR(CC)
         MH    R0,DEVDSTRK              CONVERT TO RTA
         ICM   R1,B'0011',4(RE)         LOAD BEGIN ADDR(HH)
         AR    R0,R1                    GET BEGIN RTA
         LR    RF,R0                    SAVE IT
         SLR   R0,R0                    CLEAR WORKREG
         ICM   R0,B'0011',6(RE)         LOAD END ADDR(CC)
         MH    R0,DEVDSTRK              CONVERT TO RTA
         ICM   R1,B'0011',8(RE)         LOAD END ADDR(HH)
         LA    R1,1(,R1)                ADJUST FOR SPACE CALCULATION
         AR    R0,R1                    GET END RTA+1
         SR    R0,RF                    GET NUM OF EXTENT TRACKS       +
                                        GR0 <-- NUM OF TRACKS ON EXTENT
         BR    RA                       RETURN TO MAINLINE
         SPACE ,
*---------------------------------------------------------------------*
* CNVBTX - CONVERT BINARY TO HEX-DECIMAL TEXT (VARIABLE LENGTH TYPE)  *
* CALL INTERFACE -                                                    *
*  GR0:  BINARY VALUE LENGTH                                          *
*  GR1:  OUTPUT-AREA ADDRESS (NEED DOUBLE LENGTH OF BINARY)           *
*  GR15: BINARY VALUE ADDRESS                                         *
*  BAS 14,CNVBTX                                                      *
*---------------------------------------------------------------------*
CNVBTX   DS    0H                       CONVERT BINARY TO HEX-DECIMAL
         MVN   1(1,1),0(15)
         MVO   0(2,1),0(1,15)
         NI    1(1),X'0F'
         TR    0(2,1),CNVTRT2
         LA    15,1(,15)
         LA    1,2(,1)
         BCT   0,*-4-4-6-4-6-6
         BR    14
CNVTRT2  DC    CL16'0123456789ABCDEF'   TRANS TABLE FOR HEX-CHARACTER
         SPACE ,
***********************************************************************
*        D A T A  A R E A                                             *
***********************************************************************
*                                  *----------------------------------*
*                                  *  CVAF PARAMETERS                 *
*                                  *----------------------------------*
CVAFPL   CVAFSEQ MF=L                   CVAF PARAMETER LIST
BUFLIST1 DS    0F                       CVAF BUFFER LIST FOR CVAFSEQ
BUFHEAD1 EQU   *,8                      CVAF BUFFER LIST HEADER
         DC    AL1(1)                    NUM OF BUFFER ENTRIES
         DC    XL1'04'                   INDICATES BUFLIST FOR DSCB
         DS    XL1
         DC    AL1(0)                    SUBPOOL NUMBER
         DC    A(0)                      NEXT BUFLIST POINTER
BUFENTR1 EQU   *,12                     CVAF BUFFER LIST ENTRY-1
         DC    XL1'40'                   ARGUMENT TYPE(CCHHR)
         DS    XL1
         DC    AL1(96)                   BUFFER LENGTH(96 OR 140)
         DC    XL5'0000000000'           ARGUMENT FIELD(CCHHR)
         DC    A(DSCBDATA)               BUFFER POINTER
BUFLIST2 DS    0F                       CVAF BUFFER LIST FOR CVAFDIR
BUFHEAD2 EQU   *,8                      CVAF BUFFER LIST HEADER
         DC    AL1(1)                    NUM OF BUFFER ENTRIES
         DC    XL1'04'                   INDICATES BUFLIST FOR DSCB
         DS    XL1
         DC    AL1(0)                    SUBPOOL NUMBER
         DC    A(0)                      NEXT BUFLIST POINTER
BUFENTR2 EQU   *,12                     CVAF BUFFER LIST ENTRY-1
         DC    XL1'40'                   ARGUMENT TYPE(CCHHR)
         DS    XL1
         DC    AL1(140)                  BUFFER LENGTH(96 OR 140)
CCHHR    DC    XL5'0000000000'           ARGUMENT FIELD(CCHHR)
         DC    A(DSCBAREA)               BUFFER POINTER
         SPACE ,
LSPPARM  LSPACE MF=L                    LSPACE PLIST
LSPDATA  DC    XL36'00'                 LSPACE DATA RETURN AREA
         SPACE ,
*                                  *----------------------------------*
*                                  *  MISCELLANEOUS WORKAREA          *
*                                  *----------------------------------*
DOUBLE   DC    D'0'                     DOUBLE WORD WORKAREA
ADEB     DC    A(0)                     VTOC DEB ADDRESS
AUCB     DC    A(0)                     UCB ADDRESS
DEVDSTRK DC    AL2(0)                   NUM OF TRACKS PER CYLINDER
DEVDEVDT DC    AL2(0)                   NUM OF DSCBS PER TRACK
VOLSER   DC    CL6' '                   TARGET VOLUME NAME
*****    DC    XL5'00'                  TARGET DSCB SEEK ADDRESS(CCHHR)
DSCBAREA DS    0D
DSCBKEY  DC    CL44' '                  DSCB KEY FIELD(DSNAME)
DSCBDATA DC    XL96'00'                 DSCB DATA AREA
         SPACE ,
WRKDSORG DC    AL2(0)                   SAVED DS1DSORG
WRKSMSFG DC    AL1(0)                   SAVED DS1SMSFG
WRKLSTAR DC    AL3(0)                   SAVED DS1LSTAR
WRKTRBAL DC    AL2(0)                   SAVED DS1TRBAL
WRKSCAL1 DC    AL1(0)                   SAVED DS1SCAL1
WRKKEYL  DC    AL1(0)                   SAVED DS1KEYL
WRKBLKL  DC    AL2(0)                   SAVED DS1BLKL
WRKLRECL DC    AL2(0)                   SAVED DS1LRECL
WRKSCEXT DC    AL3(0)                   SAVED DS1SCEXT
         SPACE ,
LISTDCB  DCB   DDNAME=SYSPRINT,         DCB FOR QSAM                   +
               DSORG=PS,MACRF=PM,RECFM=FB,LRECL=132
UT1DCB   DCB   DDNAME=SYSUT1,           DCB FOR EXCP                   +
               MACRF=E,EXLST=UT1EXLST
UT1EXLST DC    X'87'                    (INDICATE TO READ JFCB)
         DC    AL3(JFCBAREA)
JFCBAREA DC    XL176'00'                JFCB READ AREA
         LTORG ,                        USER LITERAL PLACE AT HERE
*                                  *----------------------------------*
*                                  *  VTOC LIST LINE DATA             *
*                                  *----------------------------------*
BLANKS   DC    CL132' '                 BLANK LINE DATA
TITLE    DC    CL132'DISK VOLUME VTOC LIST, VOL=SER=@@@@@@'
PRTVOLNM EQU   TITLE+31,6
SEPLINE  DC    132C'='
VTOCSUM  DC    CL132'VTOC SUMMARY: SIZE= ZZZZ9TRK EXTENT(@@@@-@@@@-->@@+
               @@-@@@@) VTOC DSCB= ZZZZ9( ZZZZ9) INDEX=YES SMS-MANAGE=Y+
               ES'
PRVTSIZE EQU   VTOCSUM+19,6
PRVTBGNC EQU   VTOCSUM+36,4
PRVTBGNH EQU   VTOCSUM+41,4
PRVTENDC EQU   VTOCSUM+48,4
PRVTENDH EQU   VTOCSUM+53,4
PRVTDSCB EQU   VTOCSUM+69,6
PRVTDSC0 EQU   VTOCSUM+76,6
PRVTINDX EQU   VTOCSUM+90,3
PRVTSMSM EQU   VTOCSUM+105,3
FREESUM  DC    CL132'FREE SPACE SUMMARY: EXTENTS= ZZZZ9 TOTAL= ZZZZ9CYL+
               S+ ZZZZ9TRKS LARGEST= ZZZZ9CYLS+ ZZZZ9TRKS FRAGMENTATION+
                INDEX= ZZZZ9'
PRFSEXT# EQU   FREESUM+28,6
PRFSCYLT EQU   FREESUM+41,6
PRFSTRKT EQU   FREESUM+52,6
PRFSCYLL EQU   FREESUM+71,6
PRFSTRKL EQU   FREESUM+82,6
PRFSFRAG EQU   FREESUM+113,6
MIDASHI1 DC    CL132'SEQ  DATASET NAME                                 +
                ALLOC(EXT) USED%     SIZE 2ND ORG  REC BLKSZ LRECL CREA+
               TE  REFER EXPIRE'
MIDASHI2 DC    CL132'---- -------------------------------------------- +
               ----------- ----- -------- --- ---- --- ----- ----- ----+
               -- ------ ------'
DSLINE   DC    CL132'9999 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ +
               ZZZZZ9(ZZ9) ZZ9.9 ZZZZ9TRK ZZ9 XXXX XXX ZZZZ9 ZZZZ9 99-3+
               65 99-365 99-365'
PRDSSEQ# EQU   DSLINE+0,4
PRDSNAME EQU   DSLINE+5,44
PRDSALOC EQU   DSLINE+50,6
PRDSEXT# EQU   DSLINE+56,4
PRDSUSED EQU   DSLINE+62,5
PRDSSIZE EQU   DSLINE+67,6
PRDSSTYP EQU   DSLINE+73,3
PRDS2ND  EQU   DSLINE+76,4
PRDSORG  EQU   DSLINE+81,4
PRDSREC  EQU   DSLINE+86,3
PRDSBLKS EQU   DSLINE+89,6
PRDSLREC EQU   DSLINE+95,6
PRDSCRED EQU   DSLINE+102,6
PRDSREFD EQU   DSLINE+109,6
PRDSEXPD EQU   DSLINE+116,6
         DROP  ,                        DROP ALL BASE REGISTER
***********************************************************************
*        DATA AREA (OUTSIDE OUR BASE)                                 *
***********************************************************************
         SPACE ,
*---------------------------------------------------------------------*
*        OS CONTROL BLOCKS                                            *
*---------------------------------------------------------------------*
         ICVAFPL ,                      CVAF PARAMETER LIST MAP
         ICVFCL ,                       CVAF FILTER CRITERIA LIST MAP
         ICVAFBFL ,                     CVAF BUFFER LIST MAP
DDSCB    DSECT ,                        DSCB KEY+DATA FIELD
         ORG   DDSCB
DS4DSNAM DC    44X'04'                  (VTOC PSEUDO DSNAME)
         IECSDSL1 (4)                   DSCB(FORMAT4)
         ORG   DDSCB
         IECSDSL1 (1)                   DSCB(FORMAT1)
         ORG   DDSCB
         IECSDSL1 (3)                   DSCB(FORMAT3)
         ORG   DDSCB
         IECSDSL1 (5)                   DSCB(FORMAT5)
         ORG   DDSCB
         IECSDSL1 (6)                   DSCB(FORMAT6)
         ORG   ,
LDSCB    EQU   *-DDSCB                  (LENGTH OF DSCB)
DLSPDATA LSPACE MF=(D,DATA)             LSPACE DATA RETURN AREA MAP
DJFCBN   DSECT ,
         IEFJFCBN LIST=YES              JFCB
         DCBD  DEVD=DA                  DCB
         IEZDEB LIST=YES                DEB
DUCB     DSECT ,
         IEFUCBOB PREFIX=NO,DEVCLAS=DA  UCB
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
        // BASE_URLを使用してベースパスを考慮（vite.config.tsのbase設定に対応）
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}dependencies/dependencies.json`);
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
            const fileResponse = await fetch(`${baseUrl}dependencies/${fileName}`);
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
        <h1>z/OS アセンブラ解析支援ツール</h1>
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
              color: "#d4d4d4",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "13px",
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
                  <p style={{ fontSize: "13px", color: "#858585", marginTop: "8px" }}>
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
