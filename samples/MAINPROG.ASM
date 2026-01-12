*=====================================================================*
*        MAIN PROGRAM USING COPY AND MACRO                           *
*=====================================================================*
         COPY  REGS                     INCLUDE REGISTER EQUATES
         SPACE ,
***********************************************************************
*        CONTROL SECTION                                              *
***********************************************************************
MYPROG   CSECT ,                        DEFINE CONTROL SECTION
MYPROG   AMODE 31                       DEFINE DEFAULT AMODE=31
MYPROG   RMODE 24                       DEFINE DEFAULT RMODE=24
         SPACE ,
         SAVEMAC RC,                    INVOKE SAVE MACRO              +
                (14,12)
         SPACE ,
***********************************************************************
*        MAIN PROCESSING                                              *
***********************************************************************
MAIN     EQU   *                        MAIN ENTRY POINT
         LA    R1,100                   LOAD VALUE 100
         LA    R2,WORKAREA              LOAD WORKAREA ADDRESS
         BAL   RE,PROCESS               BRANCH TO PROCESS ROUTINE
         SPACE ,
*---------------------------------------------------------------------*
*        PROCESS ROUTINE                                              *
*---------------------------------------------------------------------*
PROCESS  EQU   *                        PROCESS ROUTINE ENTRY
         ST    R1,COUNT                 STORE COUNT VALUE
         L     R3,COUNT                 LOAD COUNT VALUE
         C     R3,=F'100'               COMPARE WITH LITERAL
         BNH   CONTINUE                 BRANCH IF NOT HIGH
         SPACE ,
CONTINUE EQU   *                        CONTINUE LABEL
         L     R13,SAVEAREA+4           RESTORE CALLER SAVEAREA
         RETURN (14,12)                 RETURN TO CALLER
         SPACE ,
***********************************************************************
*        DATA AREA                                                    *
***********************************************************************
SAVEAREA DS    18F                      SAVE AREA
         DS    0F                       ALIGN TO FULLWORD
WORKAREA DS    18F                      WORK AREA (72 BYTES)
COUNT    DC    F'0'                     COUNT VARIABLE (FULLWORD)
RESULT   DC    H'0'                     RESULT VARIABLE (HALFWORD)
FLAG     DC    X'00'                    FLAG BYTE
MSG      DC    CL10'HELLO'              MESSAGE CONSTANT
BUFFER   DS    CL80                     BUFFER AREA (80 BYTES)
TABLEST  DS    0D                       TABLE START (ALIGNED)
TABLE    DC    F'1'                     TABLE ENTRY 1
         DC    F'2'                     TABLE ENTRY 2
         DC    F'3'                     TABLE ENTRY 3
TABLEEND EQU   *                        TABLE END
TABLELEN EQU   TABLEEND-TABLEST         TABLE LENGTH
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
