*---------------------------------------------------------------------*
*        CONSTANT DEFINITIONS                                         *
*---------------------------------------------------------------------*

DEBBASND EQU   * 
DEBDASD  DSECT
ZERO     EQU   0                        ZERO CONSTANT
ONE      EQU   1                        ONE CONSTANT
MAXLEN   EQU   80                       MAXIMUM LENGTH
BUFSIZE  EQU   4096                     BUFFER SIZE
RETCODE  EQU   0                        RETURN CODE SUCCESS
ERRCODE  EQU   8                        RETURN CODE ERROR
FLAGON   EQU   X'80'                    FLAG ON
FLAGOFF  EQU   X'00'                    FLAG OFF
FLAG     DC    X'00'                    FLAG BYTE

