*=====================================================================*
*        LARGE SCALE TEST PROGRAM (2000+ LINES)                      *
*        大規模テストプログラム (2000行以上)                          *
*=====================================================================*
         COPY  REGS                     INCLUDE REGISTER EQUATES
         COPY  CONSTANTS                INCLUDE CONSTANT DEFINITIONS
         COPY  TESTCONST                INCLUDE TEST CONSTANTS
         COPY  MACROS                   INCLUDE MACRO DEFINITIONS
         COPY  TESTMACROS               INCLUDE TEST MACROS
         SPACE ,
***********************************************************************
*        CONTROL SECTION                                              *
***********************************************************************
LARGETEST CSECT ,                        LARGE TEST CONTROL SECTION
LARGETEST AMODE 31                       DEFINE DEFAULT AMODE=31
LARGETEST RMODE 24                       DEFINE DEFAULT RMODE=24
         SPACE ,
         SAVEREGS                       INITIALIZE AND SAVE REGISTERS
         SPACE ,
***********************************************************************
*        MAIN PROCESSING                                              *
***********************************************************************
MAIN     EQU   *                        MAIN ENTRY POINT
         LA    R1,100                   LOAD VALUE 100
         ST    R1,WORKAREA0             STORE TO WORKAREA0
         L     R2,WORKAREA0             LOAD FROM WORKAREA0
         C     R2,=F'100'               COMPARE WITH VALUE
         BNE   ERROR0                   BRANCH IF NOT EQUAL
         LA    R1,101                   LOAD VALUE 101
         ST    R1,WORKAREA1             STORE TO WORKAREA1
         L     R2,WORKAREA1             LOAD FROM WORKAREA1
         C     R2,=F'101'               COMPARE WITH VALUE
         BNE   ERROR1                   BRANCH IF NOT EQUAL
         LA    R1,102                   LOAD VALUE 102
         ST    R1,WORKAREA2             STORE TO WORKAREA2
         L     R2,WORKAREA2             LOAD FROM WORKAREA2
         C     R2,=F'102'               COMPARE WITH VALUE
         BNE   ERROR2                   BRANCH IF NOT EQUAL
         LA    R1,103                   LOAD VALUE 103
         ST    R1,WORKAREA3             STORE TO WORKAREA3
         L     R2,WORKAREA3             LOAD FROM WORKAREA3
         C     R2,=F'103'               COMPARE WITH VALUE
         BNE   ERROR3                   BRANCH IF NOT EQUAL
         LA    R1,104                   LOAD VALUE 104
         ST    R1,WORKAREA4             STORE TO WORKAREA4
         L     R2,WORKAREA4             LOAD FROM WORKAREA4
         C     R2,=F'104'               COMPARE WITH VALUE
         BNE   ERROR4                   BRANCH IF NOT EQUAL
         LA    R1,105                   LOAD VALUE 105
         ST    R1,WORKAREA5             STORE TO WORKAREA5
         L     R2,WORKAREA5             LOAD FROM WORKAREA5
         C     R2,=F'105'               COMPARE WITH VALUE
         BNE   ERROR5                   BRANCH IF NOT EQUAL
         LA    R1,106                   LOAD VALUE 106
         ST    R1,WORKAREA6             STORE TO WORKAREA6
         L     R2,WORKAREA6             LOAD FROM WORKAREA6
         C     R2,=F'106'               COMPARE WITH VALUE
         BNE   ERROR6                   BRANCH IF NOT EQUAL
         LA    R1,107                   LOAD VALUE 107
         ST    R1,WORKAREA7             STORE TO WORKAREA7
         L     R2,WORKAREA7             LOAD FROM WORKAREA7
         C     R2,=F'107'               COMPARE WITH VALUE
         BNE   ERROR7                   BRANCH IF NOT EQUAL
         LA    R1,108                   LOAD VALUE 108
         ST    R1,WORKAREA8             STORE TO WORKAREA8
         L     R2,WORKAREA8             LOAD FROM WORKAREA8
         C     R2,=F'108'               COMPARE WITH VALUE
         BNE   ERROR8                   BRANCH IF NOT EQUAL
         LA    R1,109                   LOAD VALUE 109
         ST    R1,WORKAREA9             STORE TO WORKAREA9
         L     R2,WORKAREA9             LOAD FROM WORKAREA9
         C     R2,=F'109'               COMPARE WITH VALUE
         BNE   ERROR9                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,110                   LOAD VALUE 110
         ST    R1,WORKAREA10             STORE TO WORKAREA10
         L     R2,WORKAREA10             LOAD FROM WORKAREA10
         C     R2,=F'110'               COMPARE WITH VALUE
         BNE   ERROR10                   BRANCH IF NOT EQUAL
         LA    R1,111                   LOAD VALUE 111
         ST    R1,WORKAREA11             STORE TO WORKAREA11
         L     R2,WORKAREA11             LOAD FROM WORKAREA11
         C     R2,=F'111'               COMPARE WITH VALUE
         BNE   ERROR11                   BRANCH IF NOT EQUAL
         LA    R1,112                   LOAD VALUE 112
         ST    R1,WORKAREA12             STORE TO WORKAREA12
         L     R2,WORKAREA12             LOAD FROM WORKAREA12
         C     R2,=F'112'               COMPARE WITH VALUE
         BNE   ERROR12                   BRANCH IF NOT EQUAL
         LA    R1,113                   LOAD VALUE 113
         ST    R1,WORKAREA13             STORE TO WORKAREA13
         L     R2,WORKAREA13             LOAD FROM WORKAREA13
         C     R2,=F'113'               COMPARE WITH VALUE
         BNE   ERROR13                   BRANCH IF NOT EQUAL
         LA    R1,114                   LOAD VALUE 114
         ST    R1,WORKAREA14             STORE TO WORKAREA14
         L     R2,WORKAREA14             LOAD FROM WORKAREA14
         C     R2,=F'114'               COMPARE WITH VALUE
         BNE   ERROR14                   BRANCH IF NOT EQUAL
         LA    R1,115                   LOAD VALUE 115
         ST    R1,WORKAREA15             STORE TO WORKAREA15
         L     R2,WORKAREA15             LOAD FROM WORKAREA15
         C     R2,=F'115'               COMPARE WITH VALUE
         BNE   ERROR15                   BRANCH IF NOT EQUAL
         LA    R1,116                   LOAD VALUE 116
         ST    R1,WORKAREA16             STORE TO WORKAREA16
         L     R2,WORKAREA16             LOAD FROM WORKAREA16
         C     R2,=F'116'               COMPARE WITH VALUE
         BNE   ERROR16                   BRANCH IF NOT EQUAL
         LA    R1,117                   LOAD VALUE 117
         ST    R1,WORKAREA17             STORE TO WORKAREA17
         L     R2,WORKAREA17             LOAD FROM WORKAREA17
         C     R2,=F'117'               COMPARE WITH VALUE
         BNE   ERROR17                   BRANCH IF NOT EQUAL
         LA    R1,118                   LOAD VALUE 118
         ST    R1,WORKAREA18             STORE TO WORKAREA18
         L     R2,WORKAREA18             LOAD FROM WORKAREA18
         C     R2,=F'118'               COMPARE WITH VALUE
         BNE   ERROR18                   BRANCH IF NOT EQUAL
         LA    R1,119                   LOAD VALUE 119
         ST    R1,WORKAREA19             STORE TO WORKAREA19
         L     R2,WORKAREA19             LOAD FROM WORKAREA19
         C     R2,=F'119'               COMPARE WITH VALUE
         BNE   ERROR19                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,120                   LOAD VALUE 120
         ST    R1,WORKAREA20             STORE TO WORKAREA20
         L     R2,WORKAREA20             LOAD FROM WORKAREA20
         C     R2,=F'120'               COMPARE WITH VALUE
         BNE   ERROR20                   BRANCH IF NOT EQUAL
         LA    R1,121                   LOAD VALUE 121
         ST    R1,WORKAREA21             STORE TO WORKAREA21
         L     R2,WORKAREA21             LOAD FROM WORKAREA21
         C     R2,=F'121'               COMPARE WITH VALUE
         BNE   ERROR21                   BRANCH IF NOT EQUAL
         LA    R1,122                   LOAD VALUE 122
         ST    R1,WORKAREA22             STORE TO WORKAREA22
         L     R2,WORKAREA22             LOAD FROM WORKAREA22
         C     R2,=F'122'               COMPARE WITH VALUE
         BNE   ERROR22                   BRANCH IF NOT EQUAL
         LA    R1,123                   LOAD VALUE 123
         ST    R1,WORKAREA23             STORE TO WORKAREA23
         L     R2,WORKAREA23             LOAD FROM WORKAREA23
         C     R2,=F'123'               COMPARE WITH VALUE
         BNE   ERROR23                   BRANCH IF NOT EQUAL
         LA    R1,124                   LOAD VALUE 124
         ST    R1,WORKAREA24             STORE TO WORKAREA24
         L     R2,WORKAREA24             LOAD FROM WORKAREA24
         C     R2,=F'124'               COMPARE WITH VALUE
         BNE   ERROR24                   BRANCH IF NOT EQUAL
         LA    R1,125                   LOAD VALUE 125
         ST    R1,WORKAREA25             STORE TO WORKAREA25
         L     R2,WORKAREA25             LOAD FROM WORKAREA25
         C     R2,=F'125'               COMPARE WITH VALUE
         BNE   ERROR25                   BRANCH IF NOT EQUAL
         LA    R1,126                   LOAD VALUE 126
         ST    R1,WORKAREA26             STORE TO WORKAREA26
         L     R2,WORKAREA26             LOAD FROM WORKAREA26
         C     R2,=F'126'               COMPARE WITH VALUE
         BNE   ERROR26                   BRANCH IF NOT EQUAL
         LA    R1,127                   LOAD VALUE 127
         ST    R1,WORKAREA27             STORE TO WORKAREA27
         L     R2,WORKAREA27             LOAD FROM WORKAREA27
         C     R2,=F'127'               COMPARE WITH VALUE
         BNE   ERROR27                   BRANCH IF NOT EQUAL
         LA    R1,128                   LOAD VALUE 128
         ST    R1,WORKAREA28             STORE TO WORKAREA28
         L     R2,WORKAREA28             LOAD FROM WORKAREA28
         C     R2,=F'128'               COMPARE WITH VALUE
         BNE   ERROR28                   BRANCH IF NOT EQUAL
         LA    R1,129                   LOAD VALUE 129
         ST    R1,WORKAREA29             STORE TO WORKAREA29
         L     R2,WORKAREA29             LOAD FROM WORKAREA29
         C     R2,=F'129'               COMPARE WITH VALUE
         BNE   ERROR29                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,130                   LOAD VALUE 130
         ST    R1,WORKAREA30             STORE TO WORKAREA30
         L     R2,WORKAREA30             LOAD FROM WORKAREA30
         C     R2,=F'130'               COMPARE WITH VALUE
         BNE   ERROR30                   BRANCH IF NOT EQUAL
         LA    R1,131                   LOAD VALUE 131
         ST    R1,WORKAREA31             STORE TO WORKAREA31
         L     R2,WORKAREA31             LOAD FROM WORKAREA31
         C     R2,=F'131'               COMPARE WITH VALUE
         BNE   ERROR31                   BRANCH IF NOT EQUAL
         LA    R1,132                   LOAD VALUE 132
         ST    R1,WORKAREA32             STORE TO WORKAREA32
         L     R2,WORKAREA32             LOAD FROM WORKAREA32
         C     R2,=F'132'               COMPARE WITH VALUE
         BNE   ERROR32                   BRANCH IF NOT EQUAL
         LA    R1,133                   LOAD VALUE 133
         ST    R1,WORKAREA33             STORE TO WORKAREA33
         L     R2,WORKAREA33             LOAD FROM WORKAREA33
         C     R2,=F'133'               COMPARE WITH VALUE
         BNE   ERROR33                   BRANCH IF NOT EQUAL
         LA    R1,134                   LOAD VALUE 134
         ST    R1,WORKAREA34             STORE TO WORKAREA34
         L     R2,WORKAREA34             LOAD FROM WORKAREA34
         C     R2,=F'134'               COMPARE WITH VALUE
         BNE   ERROR34                   BRANCH IF NOT EQUAL
         LA    R1,135                   LOAD VALUE 135
         ST    R1,WORKAREA35             STORE TO WORKAREA35
         L     R2,WORKAREA35             LOAD FROM WORKAREA35
         C     R2,=F'135'               COMPARE WITH VALUE
         BNE   ERROR35                   BRANCH IF NOT EQUAL
         LA    R1,136                   LOAD VALUE 136
         ST    R1,WORKAREA36             STORE TO WORKAREA36
         L     R2,WORKAREA36             LOAD FROM WORKAREA36
         C     R2,=F'136'               COMPARE WITH VALUE
         BNE   ERROR36                   BRANCH IF NOT EQUAL
         LA    R1,137                   LOAD VALUE 137
         ST    R1,WORKAREA37             STORE TO WORKAREA37
         L     R2,WORKAREA37             LOAD FROM WORKAREA37
         C     R2,=F'137'               COMPARE WITH VALUE
         BNE   ERROR37                   BRANCH IF NOT EQUAL
         LA    R1,138                   LOAD VALUE 138
         ST    R1,WORKAREA38             STORE TO WORKAREA38
         L     R2,WORKAREA38             LOAD FROM WORKAREA38
         C     R2,=F'138'               COMPARE WITH VALUE
         BNE   ERROR38                   BRANCH IF NOT EQUAL
         LA    R1,139                   LOAD VALUE 139
         ST    R1,WORKAREA39             STORE TO WORKAREA39
         L     R2,WORKAREA39             LOAD FROM WORKAREA39
         C     R2,=F'139'               COMPARE WITH VALUE
         BNE   ERROR39                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,140                   LOAD VALUE 140
         ST    R1,WORKAREA40             STORE TO WORKAREA40
         L     R2,WORKAREA40             LOAD FROM WORKAREA40
         C     R2,=F'140'               COMPARE WITH VALUE
         BNE   ERROR40                   BRANCH IF NOT EQUAL
         LA    R1,141                   LOAD VALUE 141
         ST    R1,WORKAREA41             STORE TO WORKAREA41
         L     R2,WORKAREA41             LOAD FROM WORKAREA41
         C     R2,=F'141'               COMPARE WITH VALUE
         BNE   ERROR41                   BRANCH IF NOT EQUAL
         LA    R1,142                   LOAD VALUE 142
         ST    R1,WORKAREA42             STORE TO WORKAREA42
         L     R2,WORKAREA42             LOAD FROM WORKAREA42
         C     R2,=F'142'               COMPARE WITH VALUE
         BNE   ERROR42                   BRANCH IF NOT EQUAL
         LA    R1,143                   LOAD VALUE 143
         ST    R1,WORKAREA43             STORE TO WORKAREA43
         L     R2,WORKAREA43             LOAD FROM WORKAREA43
         C     R2,=F'143'               COMPARE WITH VALUE
         BNE   ERROR43                   BRANCH IF NOT EQUAL
         LA    R1,144                   LOAD VALUE 144
         ST    R1,WORKAREA44             STORE TO WORKAREA44
         L     R2,WORKAREA44             LOAD FROM WORKAREA44
         C     R2,=F'144'               COMPARE WITH VALUE
         BNE   ERROR44                   BRANCH IF NOT EQUAL
         LA    R1,145                   LOAD VALUE 145
         ST    R1,WORKAREA45             STORE TO WORKAREA45
         L     R2,WORKAREA45             LOAD FROM WORKAREA45
         C     R2,=F'145'               COMPARE WITH VALUE
         BNE   ERROR45                   BRANCH IF NOT EQUAL
         LA    R1,146                   LOAD VALUE 146
         ST    R1,WORKAREA46             STORE TO WORKAREA46
         L     R2,WORKAREA46             LOAD FROM WORKAREA46
         C     R2,=F'146'               COMPARE WITH VALUE
         BNE   ERROR46                   BRANCH IF NOT EQUAL
         LA    R1,147                   LOAD VALUE 147
         ST    R1,WORKAREA47             STORE TO WORKAREA47
         L     R2,WORKAREA47             LOAD FROM WORKAREA47
         C     R2,=F'147'               COMPARE WITH VALUE
         BNE   ERROR47                   BRANCH IF NOT EQUAL
         LA    R1,148                   LOAD VALUE 148
         ST    R1,WORKAREA48             STORE TO WORKAREA48
         L     R2,WORKAREA48             LOAD FROM WORKAREA48
         C     R2,=F'148'               COMPARE WITH VALUE
         BNE   ERROR48                   BRANCH IF NOT EQUAL
         LA    R1,149                   LOAD VALUE 149
         ST    R1,WORKAREA49             STORE TO WORKAREA49
         L     R2,WORKAREA49             LOAD FROM WORKAREA49
         C     R2,=F'149'               COMPARE WITH VALUE
         BNE   ERROR49                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,150                   LOAD VALUE 150
         ST    R1,WORKAREA50             STORE TO WORKAREA50
         L     R2,WORKAREA50             LOAD FROM WORKAREA50
         C     R2,=F'150'               COMPARE WITH VALUE
         BNE   ERROR50                   BRANCH IF NOT EQUAL
         LA    R1,151                   LOAD VALUE 151
         ST    R1,WORKAREA51             STORE TO WORKAREA51
         L     R2,WORKAREA51             LOAD FROM WORKAREA51
         C     R2,=F'151'               COMPARE WITH VALUE
         BNE   ERROR51                   BRANCH IF NOT EQUAL
         LA    R1,152                   LOAD VALUE 152
         ST    R1,WORKAREA52             STORE TO WORKAREA52
         L     R2,WORKAREA52             LOAD FROM WORKAREA52
         C     R2,=F'152'               COMPARE WITH VALUE
         BNE   ERROR52                   BRANCH IF NOT EQUAL
         LA    R1,153                   LOAD VALUE 153
         ST    R1,WORKAREA53             STORE TO WORKAREA53
         L     R2,WORKAREA53             LOAD FROM WORKAREA53
         C     R2,=F'153'               COMPARE WITH VALUE
         BNE   ERROR53                   BRANCH IF NOT EQUAL
         LA    R1,154                   LOAD VALUE 154
         ST    R1,WORKAREA54             STORE TO WORKAREA54
         L     R2,WORKAREA54             LOAD FROM WORKAREA54
         C     R2,=F'154'               COMPARE WITH VALUE
         BNE   ERROR54                   BRANCH IF NOT EQUAL
         LA    R1,155                   LOAD VALUE 155
         ST    R1,WORKAREA55             STORE TO WORKAREA55
         L     R2,WORKAREA55             LOAD FROM WORKAREA55
         C     R2,=F'155'               COMPARE WITH VALUE
         BNE   ERROR55                   BRANCH IF NOT EQUAL
         LA    R1,156                   LOAD VALUE 156
         ST    R1,WORKAREA56             STORE TO WORKAREA56
         L     R2,WORKAREA56             LOAD FROM WORKAREA56
         C     R2,=F'156'               COMPARE WITH VALUE
         BNE   ERROR56                   BRANCH IF NOT EQUAL
         LA    R1,157                   LOAD VALUE 157
         ST    R1,WORKAREA57             STORE TO WORKAREA57
         L     R2,WORKAREA57             LOAD FROM WORKAREA57
         C     R2,=F'157'               COMPARE WITH VALUE
         BNE   ERROR57                   BRANCH IF NOT EQUAL
         LA    R1,158                   LOAD VALUE 158
         ST    R1,WORKAREA58             STORE TO WORKAREA58
         L     R2,WORKAREA58             LOAD FROM WORKAREA58
         C     R2,=F'158'               COMPARE WITH VALUE
         BNE   ERROR58                   BRANCH IF NOT EQUAL
         LA    R1,159                   LOAD VALUE 159
         ST    R1,WORKAREA59             STORE TO WORKAREA59
         L     R2,WORKAREA59             LOAD FROM WORKAREA59
         C     R2,=F'159'               COMPARE WITH VALUE
         BNE   ERROR59                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,160                   LOAD VALUE 160
         ST    R1,WORKAREA60             STORE TO WORKAREA60
         L     R2,WORKAREA60             LOAD FROM WORKAREA60
         C     R2,=F'160'               COMPARE WITH VALUE
         BNE   ERROR60                   BRANCH IF NOT EQUAL
         LA    R1,161                   LOAD VALUE 161
         ST    R1,WORKAREA61             STORE TO WORKAREA61
         L     R2,WORKAREA61             LOAD FROM WORKAREA61
         C     R2,=F'161'               COMPARE WITH VALUE
         BNE   ERROR61                   BRANCH IF NOT EQUAL
         LA    R1,162                   LOAD VALUE 162
         ST    R1,WORKAREA62             STORE TO WORKAREA62
         L     R2,WORKAREA62             LOAD FROM WORKAREA62
         C     R2,=F'162'               COMPARE WITH VALUE
         BNE   ERROR62                   BRANCH IF NOT EQUAL
         LA    R1,163                   LOAD VALUE 163
         ST    R1,WORKAREA63             STORE TO WORKAREA63
         L     R2,WORKAREA63             LOAD FROM WORKAREA63
         C     R2,=F'163'               COMPARE WITH VALUE
         BNE   ERROR63                   BRANCH IF NOT EQUAL
         LA    R1,164                   LOAD VALUE 164
         ST    R1,WORKAREA64             STORE TO WORKAREA64
         L     R2,WORKAREA64             LOAD FROM WORKAREA64
         C     R2,=F'164'               COMPARE WITH VALUE
         BNE   ERROR64                   BRANCH IF NOT EQUAL
         LA    R1,165                   LOAD VALUE 165
         ST    R1,WORKAREA65             STORE TO WORKAREA65
         L     R2,WORKAREA65             LOAD FROM WORKAREA65
         C     R2,=F'165'               COMPARE WITH VALUE
         BNE   ERROR65                   BRANCH IF NOT EQUAL
         LA    R1,166                   LOAD VALUE 166
         ST    R1,WORKAREA66             STORE TO WORKAREA66
         L     R2,WORKAREA66             LOAD FROM WORKAREA66
         C     R2,=F'166'               COMPARE WITH VALUE
         BNE   ERROR66                   BRANCH IF NOT EQUAL
         LA    R1,167                   LOAD VALUE 167
         ST    R1,WORKAREA67             STORE TO WORKAREA67
         L     R2,WORKAREA67             LOAD FROM WORKAREA67
         C     R2,=F'167'               COMPARE WITH VALUE
         BNE   ERROR67                   BRANCH IF NOT EQUAL
         LA    R1,168                   LOAD VALUE 168
         ST    R1,WORKAREA68             STORE TO WORKAREA68
         L     R2,WORKAREA68             LOAD FROM WORKAREA68
         C     R2,=F'168'               COMPARE WITH VALUE
         BNE   ERROR68                   BRANCH IF NOT EQUAL
         LA    R1,169                   LOAD VALUE 169
         ST    R1,WORKAREA69             STORE TO WORKAREA69
         L     R2,WORKAREA69             LOAD FROM WORKAREA69
         C     R2,=F'169'               COMPARE WITH VALUE
         BNE   ERROR69                   BRANCH IF NOT EQUAL
         SPACE ,
         LA    R1,170                   LOAD VALUE 170
         ST    R1,WORKAREA70             STORE TO WORKAREA70
         L     R2,WORKAREA70             LOAD FROM WORKAREA70
         C     R2,=F'170'               COMPARE WITH VALUE
         BNE   ERROR70                   BRANCH IF NOT EQUAL
         LA    R1,171                   LOAD VALUE 171
         ST    R1,WORKAREA71             STORE TO WORKAREA71
         L     R2,WORKAREA71             LOAD FROM WORKAREA71
         C     R2,=F'171'               COMPARE WITH VALUE
         BNE   ERROR71                   BRANCH IF NOT EQUAL
         LA    R1,172                   LOAD VALUE 172
         ST    R1,WORKAREA72             STORE TO WORKAREA72
         L     R2,WORKAREA72             LOAD FROM WORKAREA72
         C     R2,=F'172'               COMPARE WITH VALUE
         BNE   ERROR72                   BRANCH IF NOT EQUAL
         LA    R1,173                   LOAD VALUE 173
         ST    R1,WORKAREA73             STORE TO WORKAREA73
         L     R2,WORKAREA73             LOAD FROM WORKAREA73
         C     R2,=F'173'               COMPARE WITH VALUE
         BNE   ERROR73                   BRANCH IF NOT EQUAL
         LA    R1,174                   LOAD VALUE 174
         ST    R1,WORKAREA74             STORE TO WORKAREA74
         L     R2,WORKAREA74             LOAD FROM WORKAREA74
         C     R2,=F'174'               COMPARE WITH VALUE
         BNE   ERROR74                   BRANCH IF NOT EQUAL
         LA    R1,175                   LOAD VALUE 175
         ST    R1,WORKAREA75             STORE TO WORKAREA75
         L     R2,WORKAREA75             LOAD FROM WORKAREA75
         C     R2,=F'175'               COMPARE WITH VALUE
         BNE   ERROR75                   BRANCH IF NOT EQUAL
         LA    R1,176                   LOAD VALUE 176
         ST    R1,WORKAREA76             STORE TO WORKAREA76
         L     R2,WORKAREA76             LOAD FROM WORKAREA76
         C     R2,=F'176'               COMPARE WITH VALUE
         BNE   ERROR76                   BRANCH IF NOT EQUAL
         LA    R1,177                   LOAD VALUE 177
         ST    R1,WORKAREA77             STORE TO WORKAREA77
         L     R2,WORKAREA77             LOAD FROM WORKAREA77
         C     R2,=F'177'               COMPARE WITH VALUE
         BNE   ERROR77                   BRANCH IF NOT EQUAL
         LA    R1,178                   LOAD VALUE 178
         ST    R1,WORKAREA78             STORE TO WORKAREA78
         L     R2,WORKAREA78             LOAD FROM WORKAREA78
         C     R2,=F'178'               COMPARE WITH VALUE
         BNE   ERROR78                   BRANCH IF NOT EQUAL
         LA    R1,179                   LOAD VALUE 179
         ST    R1,WORKAREA79             STORE TO WORKAREA79
         L     R2,WORKAREA79             LOAD FROM WORKAREA79
         C     R2,=F'179'               COMPARE WITH VALUE
         BNE   ERROR79                   BRANCH IF NOT EQUAL
         SPACE ,
         SPACE ,
ERROR0   EQU   *                        ERROR HANDLER 0
ERROR1   EQU   *                        ERROR HANDLER 1
ERROR2   EQU   *                        ERROR HANDLER 2
ERROR3   EQU   *                        ERROR HANDLER 3
ERROR4   EQU   *                        ERROR HANDLER 4
ERROR5   EQU   *                        ERROR HANDLER 5
ERROR6   EQU   *                        ERROR HANDLER 6
ERROR7   EQU   *                        ERROR HANDLER 7
ERROR8   EQU   *                        ERROR HANDLER 8
ERROR9   EQU   *                        ERROR HANDLER 9
ERROR10   EQU   *                        ERROR HANDLER 10
ERROR11   EQU   *                        ERROR HANDLER 11
ERROR12   EQU   *                        ERROR HANDLER 12
ERROR13   EQU   *                        ERROR HANDLER 13
ERROR14   EQU   *                        ERROR HANDLER 14
ERROR15   EQU   *                        ERROR HANDLER 15
ERROR16   EQU   *                        ERROR HANDLER 16
ERROR17   EQU   *                        ERROR HANDLER 17
ERROR18   EQU   *                        ERROR HANDLER 18
ERROR19   EQU   *                        ERROR HANDLER 19
ERROR20   EQU   *                        ERROR HANDLER 20
ERROR21   EQU   *                        ERROR HANDLER 21
ERROR22   EQU   *                        ERROR HANDLER 22
ERROR23   EQU   *                        ERROR HANDLER 23
ERROR24   EQU   *                        ERROR HANDLER 24
ERROR25   EQU   *                        ERROR HANDLER 25
ERROR26   EQU   *                        ERROR HANDLER 26
ERROR27   EQU   *                        ERROR HANDLER 27
ERROR28   EQU   *                        ERROR HANDLER 28
ERROR29   EQU   *                        ERROR HANDLER 29
ERROR30   EQU   *                        ERROR HANDLER 30
ERROR31   EQU   *                        ERROR HANDLER 31
ERROR32   EQU   *                        ERROR HANDLER 32
ERROR33   EQU   *                        ERROR HANDLER 33
ERROR34   EQU   *                        ERROR HANDLER 34
ERROR35   EQU   *                        ERROR HANDLER 35
ERROR36   EQU   *                        ERROR HANDLER 36
ERROR37   EQU   *                        ERROR HANDLER 37
ERROR38   EQU   *                        ERROR HANDLER 38
ERROR39   EQU   *                        ERROR HANDLER 39
ERROR40   EQU   *                        ERROR HANDLER 40
ERROR41   EQU   *                        ERROR HANDLER 41
ERROR42   EQU   *                        ERROR HANDLER 42
ERROR43   EQU   *                        ERROR HANDLER 43
ERROR44   EQU   *                        ERROR HANDLER 44
ERROR45   EQU   *                        ERROR HANDLER 45
ERROR46   EQU   *                        ERROR HANDLER 46
ERROR47   EQU   *                        ERROR HANDLER 47
ERROR48   EQU   *                        ERROR HANDLER 48
ERROR49   EQU   *                        ERROR HANDLER 49
ERROR50   EQU   *                        ERROR HANDLER 50
ERROR51   EQU   *                        ERROR HANDLER 51
ERROR52   EQU   *                        ERROR HANDLER 52
ERROR53   EQU   *                        ERROR HANDLER 53
ERROR54   EQU   *                        ERROR HANDLER 54
ERROR55   EQU   *                        ERROR HANDLER 55
ERROR56   EQU   *                        ERROR HANDLER 56
ERROR57   EQU   *                        ERROR HANDLER 57
ERROR58   EQU   *                        ERROR HANDLER 58
ERROR59   EQU   *                        ERROR HANDLER 59
ERROR60   EQU   *                        ERROR HANDLER 60
ERROR61   EQU   *                        ERROR HANDLER 61
ERROR62   EQU   *                        ERROR HANDLER 62
ERROR63   EQU   *                        ERROR HANDLER 63
ERROR64   EQU   *                        ERROR HANDLER 64
ERROR65   EQU   *                        ERROR HANDLER 65
ERROR66   EQU   *                        ERROR HANDLER 66
ERROR67   EQU   *                        ERROR HANDLER 67
ERROR68   EQU   *                        ERROR HANDLER 68
ERROR69   EQU   *                        ERROR HANDLER 69
ERROR70   EQU   *                        ERROR HANDLER 70
ERROR71   EQU   *                        ERROR HANDLER 71
ERROR72   EQU   *                        ERROR HANDLER 72
ERROR73   EQU   *                        ERROR HANDLER 73
ERROR74   EQU   *                        ERROR HANDLER 74
ERROR75   EQU   *                        ERROR HANDLER 75
ERROR76   EQU   *                        ERROR HANDLER 76
ERROR77   EQU   *                        ERROR HANDLER 77
ERROR78   EQU   *                        ERROR HANDLER 78
ERROR79   EQU   *                        ERROR HANDLER 79
         SPACE ,
         LOADCONST R3,0              LOAD CONSTANT VALUE 0
         STOREREG R3,STORAGE0           STORE TO STORAGE0
         LOADCONST R3,10              LOAD CONSTANT VALUE 10
         STOREREG R3,STORAGE1           STORE TO STORAGE1
         LOADCONST R3,20              LOAD CONSTANT VALUE 20
         STOREREG R3,STORAGE2           STORE TO STORAGE2
         LOADCONST R3,30              LOAD CONSTANT VALUE 30
         STOREREG R3,STORAGE3           STORE TO STORAGE3
         LOADCONST R3,40              LOAD CONSTANT VALUE 40
         STOREREG R3,STORAGE4           STORE TO STORAGE4
         LOADCONST R3,50              LOAD CONSTANT VALUE 50
         STOREREG R3,STORAGE5           STORE TO STORAGE5
         LOADCONST R3,60              LOAD CONSTANT VALUE 60
         STOREREG R3,STORAGE6           STORE TO STORAGE6
         LOADCONST R3,70              LOAD CONSTANT VALUE 70
         STOREREG R3,STORAGE7           STORE TO STORAGE7
         LOADCONST R3,80              LOAD CONSTANT VALUE 80
         STOREREG R3,STORAGE8           STORE TO STORAGE8
         LOADCONST R3,90              LOAD CONSTANT VALUE 90
         STOREREG R3,STORAGE9           STORE TO STORAGE9
         LOADCONST R3,100              LOAD CONSTANT VALUE 100
         STOREREG R3,STORAGE10           STORE TO STORAGE10
         LOADCONST R3,110              LOAD CONSTANT VALUE 110
         STOREREG R3,STORAGE11           STORE TO STORAGE11
         LOADCONST R3,120              LOAD CONSTANT VALUE 120
         STOREREG R3,STORAGE12           STORE TO STORAGE12
         LOADCONST R3,130              LOAD CONSTANT VALUE 130
         STOREREG R3,STORAGE13           STORE TO STORAGE13
         LOADCONST R3,140              LOAD CONSTANT VALUE 140
         STOREREG R3,STORAGE14           STORE TO STORAGE14
         LOADCONST R3,150              LOAD CONSTANT VALUE 150
         STOREREG R3,STORAGE15           STORE TO STORAGE15
         LOADCONST R3,160              LOAD CONSTANT VALUE 160
         STOREREG R3,STORAGE16           STORE TO STORAGE16
         LOADCONST R3,170              LOAD CONSTANT VALUE 170
         STOREREG R3,STORAGE17           STORE TO STORAGE17
         LOADCONST R3,180              LOAD CONSTANT VALUE 180
         STOREREG R3,STORAGE18           STORE TO STORAGE18
         LOADCONST R3,190              LOAD CONSTANT VALUE 190
         STOREREG R3,STORAGE19           STORE TO STORAGE19
         SPACE ,
         LOADCONST R3,200              LOAD CONSTANT VALUE 200
         STOREREG R3,STORAGE20           STORE TO STORAGE20
         LOADCONST R3,210              LOAD CONSTANT VALUE 210
         STOREREG R3,STORAGE21           STORE TO STORAGE21
         LOADCONST R3,220              LOAD CONSTANT VALUE 220
         STOREREG R3,STORAGE22           STORE TO STORAGE22
         LOADCONST R3,230              LOAD CONSTANT VALUE 230
         STOREREG R3,STORAGE23           STORE TO STORAGE23
         LOADCONST R3,240              LOAD CONSTANT VALUE 240
         STOREREG R3,STORAGE24           STORE TO STORAGE24
         LOADCONST R3,250              LOAD CONSTANT VALUE 250
         STOREREG R3,STORAGE25           STORE TO STORAGE25
         LOADCONST R3,260              LOAD CONSTANT VALUE 260
         STOREREG R3,STORAGE26           STORE TO STORAGE26
         LOADCONST R3,270              LOAD CONSTANT VALUE 270
         STOREREG R3,STORAGE27           STORE TO STORAGE27
         LOADCONST R3,280              LOAD CONSTANT VALUE 280
         STOREREG R3,STORAGE28           STORE TO STORAGE28
         LOADCONST R3,290              LOAD CONSTANT VALUE 290
         STOREREG R3,STORAGE29           STORE TO STORAGE29
         LOADCONST R3,300              LOAD CONSTANT VALUE 300
         STOREREG R3,STORAGE30           STORE TO STORAGE30
         LOADCONST R3,310              LOAD CONSTANT VALUE 310
         STOREREG R3,STORAGE31           STORE TO STORAGE31
         LOADCONST R3,320              LOAD CONSTANT VALUE 320
         STOREREG R3,STORAGE32           STORE TO STORAGE32
         LOADCONST R3,330              LOAD CONSTANT VALUE 330
         STOREREG R3,STORAGE33           STORE TO STORAGE33
         LOADCONST R3,340              LOAD CONSTANT VALUE 340
         STOREREG R3,STORAGE34           STORE TO STORAGE34
         LOADCONST R3,350              LOAD CONSTANT VALUE 350
         STOREREG R3,STORAGE35           STORE TO STORAGE35
         LOADCONST R3,360              LOAD CONSTANT VALUE 360
         STOREREG R3,STORAGE36           STORE TO STORAGE36
         LOADCONST R3,370              LOAD CONSTANT VALUE 370
         STOREREG R3,STORAGE37           STORE TO STORAGE37
         LOADCONST R3,380              LOAD CONSTANT VALUE 380
         STOREREG R3,STORAGE38           STORE TO STORAGE38
         LOADCONST R3,390              LOAD CONSTANT VALUE 390
         STOREREG R3,STORAGE39           STORE TO STORAGE39
         SPACE ,
         LOADCONST R3,400              LOAD CONSTANT VALUE 400
         STOREREG R3,STORAGE40           STORE TO STORAGE40
         LOADCONST R3,410              LOAD CONSTANT VALUE 410
         STOREREG R3,STORAGE41           STORE TO STORAGE41
         LOADCONST R3,420              LOAD CONSTANT VALUE 420
         STOREREG R3,STORAGE42           STORE TO STORAGE42
         LOADCONST R3,430              LOAD CONSTANT VALUE 430
         STOREREG R3,STORAGE43           STORE TO STORAGE43
         LOADCONST R3,440              LOAD CONSTANT VALUE 440
         STOREREG R3,STORAGE44           STORE TO STORAGE44
         LOADCONST R3,450              LOAD CONSTANT VALUE 450
         STOREREG R3,STORAGE45           STORE TO STORAGE45
         LOADCONST R3,460              LOAD CONSTANT VALUE 460
         STOREREG R3,STORAGE46           STORE TO STORAGE46
         LOADCONST R3,470              LOAD CONSTANT VALUE 470
         STOREREG R3,STORAGE47           STORE TO STORAGE47
         LOADCONST R3,480              LOAD CONSTANT VALUE 480
         STOREREG R3,STORAGE48           STORE TO STORAGE48
         LOADCONST R3,490              LOAD CONSTANT VALUE 490
         STOREREG R3,STORAGE49           STORE TO STORAGE49
         LOADCONST R3,500              LOAD CONSTANT VALUE 500
         STOREREG R3,STORAGE50           STORE TO STORAGE50
         LOADCONST R3,510              LOAD CONSTANT VALUE 510
         STOREREG R3,STORAGE51           STORE TO STORAGE51
         LOADCONST R3,520              LOAD CONSTANT VALUE 520
         STOREREG R3,STORAGE52           STORE TO STORAGE52
         LOADCONST R3,530              LOAD CONSTANT VALUE 530
         STOREREG R3,STORAGE53           STORE TO STORAGE53
         LOADCONST R3,540              LOAD CONSTANT VALUE 540
         STOREREG R3,STORAGE54           STORE TO STORAGE54
         LOADCONST R3,550              LOAD CONSTANT VALUE 550
         STOREREG R3,STORAGE55           STORE TO STORAGE55
         LOADCONST R3,560              LOAD CONSTANT VALUE 560
         STOREREG R3,STORAGE56           STORE TO STORAGE56
         LOADCONST R3,570              LOAD CONSTANT VALUE 570
         STOREREG R3,STORAGE57           STORE TO STORAGE57
         LOADCONST R3,580              LOAD CONSTANT VALUE 580
         STOREREG R3,STORAGE58           STORE TO STORAGE58
         LOADCONST R3,590              LOAD CONSTANT VALUE 590
         STOREREG R3,STORAGE59           STORE TO STORAGE59
         SPACE ,
         LOADCONST R3,600              LOAD CONSTANT VALUE 600
         STOREREG R3,STORAGE60           STORE TO STORAGE60
         LOADCONST R3,610              LOAD CONSTANT VALUE 610
         STOREREG R3,STORAGE61           STORE TO STORAGE61
         LOADCONST R3,620              LOAD CONSTANT VALUE 620
         STOREREG R3,STORAGE62           STORE TO STORAGE62
         LOADCONST R3,630              LOAD CONSTANT VALUE 630
         STOREREG R3,STORAGE63           STORE TO STORAGE63
         LOADCONST R3,640              LOAD CONSTANT VALUE 640
         STOREREG R3,STORAGE64           STORE TO STORAGE64
         LOADCONST R3,650              LOAD CONSTANT VALUE 650
         STOREREG R3,STORAGE65           STORE TO STORAGE65
         LOADCONST R3,660              LOAD CONSTANT VALUE 660
         STOREREG R3,STORAGE66           STORE TO STORAGE66
         LOADCONST R3,670              LOAD CONSTANT VALUE 670
         STOREREG R3,STORAGE67           STORE TO STORAGE67
         LOADCONST R3,680              LOAD CONSTANT VALUE 680
         STOREREG R3,STORAGE68           STORE TO STORAGE68
         LOADCONST R3,690              LOAD CONSTANT VALUE 690
         STOREREG R3,STORAGE69           STORE TO STORAGE69
         LOADCONST R3,700              LOAD CONSTANT VALUE 700
         STOREREG R3,STORAGE70           STORE TO STORAGE70
         LOADCONST R3,710              LOAD CONSTANT VALUE 710
         STOREREG R3,STORAGE71           STORE TO STORAGE71
         LOADCONST R3,720              LOAD CONSTANT VALUE 720
         STOREREG R3,STORAGE72           STORE TO STORAGE72
         LOADCONST R3,730              LOAD CONSTANT VALUE 730
         STOREREG R3,STORAGE73           STORE TO STORAGE73
         LOADCONST R3,740              LOAD CONSTANT VALUE 740
         STOREREG R3,STORAGE74           STORE TO STORAGE74
         LOADCONST R3,750              LOAD CONSTANT VALUE 750
         STOREREG R3,STORAGE75           STORE TO STORAGE75
         LOADCONST R3,760              LOAD CONSTANT VALUE 760
         STOREREG R3,STORAGE76           STORE TO STORAGE76
         LOADCONST R3,770              LOAD CONSTANT VALUE 770
         STOREREG R3,STORAGE77           STORE TO STORAGE77
         LOADCONST R3,780              LOAD CONSTANT VALUE 780
         STOREREG R3,STORAGE78           STORE TO STORAGE78
         LOADCONST R3,790              LOAD CONSTANT VALUE 790
         STOREREG R3,STORAGE79           STORE TO STORAGE79
         SPACE ,
         LOADCONST R3,800              LOAD CONSTANT VALUE 800
         STOREREG R3,STORAGE80           STORE TO STORAGE80
         LOADCONST R3,810              LOAD CONSTANT VALUE 810
         STOREREG R3,STORAGE81           STORE TO STORAGE81
         LOADCONST R3,820              LOAD CONSTANT VALUE 820
         STOREREG R3,STORAGE82           STORE TO STORAGE82
         LOADCONST R3,830              LOAD CONSTANT VALUE 830
         STOREREG R3,STORAGE83           STORE TO STORAGE83
         LOADCONST R3,840              LOAD CONSTANT VALUE 840
         STOREREG R3,STORAGE84           STORE TO STORAGE84
         LOADCONST R3,850              LOAD CONSTANT VALUE 850
         STOREREG R3,STORAGE85           STORE TO STORAGE85
         LOADCONST R3,860              LOAD CONSTANT VALUE 860
         STOREREG R3,STORAGE86           STORE TO STORAGE86
         LOADCONST R3,870              LOAD CONSTANT VALUE 870
         STOREREG R3,STORAGE87           STORE TO STORAGE87
         LOADCONST R3,880              LOAD CONSTANT VALUE 880
         STOREREG R3,STORAGE88           STORE TO STORAGE88
         LOADCONST R3,890              LOAD CONSTANT VALUE 890
         STOREREG R3,STORAGE89           STORE TO STORAGE89
         LOADCONST R3,900              LOAD CONSTANT VALUE 900
         STOREREG R3,STORAGE90           STORE TO STORAGE90
         LOADCONST R3,910              LOAD CONSTANT VALUE 910
         STOREREG R3,STORAGE91           STORE TO STORAGE91
         LOADCONST R3,920              LOAD CONSTANT VALUE 920
         STOREREG R3,STORAGE92           STORE TO STORAGE92
         LOADCONST R3,930              LOAD CONSTANT VALUE 930
         STOREREG R3,STORAGE93           STORE TO STORAGE93
         LOADCONST R3,940              LOAD CONSTANT VALUE 940
         STOREREG R3,STORAGE94           STORE TO STORAGE94
         LOADCONST R3,950              LOAD CONSTANT VALUE 950
         STOREREG R3,STORAGE95           STORE TO STORAGE95
         LOADCONST R3,960              LOAD CONSTANT VALUE 960
         STOREREG R3,STORAGE96           STORE TO STORAGE96
         LOADCONST R3,970              LOAD CONSTANT VALUE 970
         STOREREG R3,STORAGE97           STORE TO STORAGE97
         LOADCONST R3,980              LOAD CONSTANT VALUE 980
         STOREREG R3,STORAGE98           STORE TO STORAGE98
         LOADCONST R3,990              LOAD CONSTANT VALUE 990
         STOREREG R3,STORAGE99           STORE TO STORAGE99
         SPACE ,
         LOADCONST R3,1000              LOAD CONSTANT VALUE 1000
         STOREREG R3,STORAGE100           STORE TO STORAGE100
         LOADCONST R3,1010              LOAD CONSTANT VALUE 1010
         STOREREG R3,STORAGE101           STORE TO STORAGE101
         LOADCONST R3,1020              LOAD CONSTANT VALUE 1020
         STOREREG R3,STORAGE102           STORE TO STORAGE102
         LOADCONST R3,1030              LOAD CONSTANT VALUE 1030
         STOREREG R3,STORAGE103           STORE TO STORAGE103
         LOADCONST R3,1040              LOAD CONSTANT VALUE 1040
         STOREREG R3,STORAGE104           STORE TO STORAGE104
         LOADCONST R3,1050              LOAD CONSTANT VALUE 1050
         STOREREG R3,STORAGE105           STORE TO STORAGE105
         LOADCONST R3,1060              LOAD CONSTANT VALUE 1060
         STOREREG R3,STORAGE106           STORE TO STORAGE106
         LOADCONST R3,1070              LOAD CONSTANT VALUE 1070
         STOREREG R3,STORAGE107           STORE TO STORAGE107
         LOADCONST R3,1080              LOAD CONSTANT VALUE 1080
         STOREREG R3,STORAGE108           STORE TO STORAGE108
         LOADCONST R3,1090              LOAD CONSTANT VALUE 1090
         STOREREG R3,STORAGE109           STORE TO STORAGE109
         LOADCONST R3,1100              LOAD CONSTANT VALUE 1100
         STOREREG R3,STORAGE110           STORE TO STORAGE110
         LOADCONST R3,1110              LOAD CONSTANT VALUE 1110
         STOREREG R3,STORAGE111           STORE TO STORAGE111
         LOADCONST R3,1120              LOAD CONSTANT VALUE 1120
         STOREREG R3,STORAGE112           STORE TO STORAGE112
         LOADCONST R3,1130              LOAD CONSTANT VALUE 1130
         STOREREG R3,STORAGE113           STORE TO STORAGE113
         LOADCONST R3,1140              LOAD CONSTANT VALUE 1140
         STOREREG R3,STORAGE114           STORE TO STORAGE114
         LOADCONST R3,1150              LOAD CONSTANT VALUE 1150
         STOREREG R3,STORAGE115           STORE TO STORAGE115
         LOADCONST R3,1160              LOAD CONSTANT VALUE 1160
         STOREREG R3,STORAGE116           STORE TO STORAGE116
         LOADCONST R3,1170              LOAD CONSTANT VALUE 1170
         STOREREG R3,STORAGE117           STORE TO STORAGE117
         LOADCONST R3,1180              LOAD CONSTANT VALUE 1180
         STOREREG R3,STORAGE118           STORE TO STORAGE118
         LOADCONST R3,1190              LOAD CONSTANT VALUE 1190
         STOREREG R3,STORAGE119           STORE TO STORAGE119
         SPACE ,
         LOADCONST R3,1200              LOAD CONSTANT VALUE 1200
         STOREREG R3,STORAGE120           STORE TO STORAGE120
         LOADCONST R3,1210              LOAD CONSTANT VALUE 1210
         STOREREG R3,STORAGE121           STORE TO STORAGE121
         LOADCONST R3,1220              LOAD CONSTANT VALUE 1220
         STOREREG R3,STORAGE122           STORE TO STORAGE122
         LOADCONST R3,1230              LOAD CONSTANT VALUE 1230
         STOREREG R3,STORAGE123           STORE TO STORAGE123
         LOADCONST R3,1240              LOAD CONSTANT VALUE 1240
         STOREREG R3,STORAGE124           STORE TO STORAGE124
         LOADCONST R3,1250              LOAD CONSTANT VALUE 1250
         STOREREG R3,STORAGE125           STORE TO STORAGE125
         LOADCONST R3,1260              LOAD CONSTANT VALUE 1260
         STOREREG R3,STORAGE126           STORE TO STORAGE126
         LOADCONST R3,1270              LOAD CONSTANT VALUE 1270
         STOREREG R3,STORAGE127           STORE TO STORAGE127
         LOADCONST R3,1280              LOAD CONSTANT VALUE 1280
         STOREREG R3,STORAGE128           STORE TO STORAGE128
         LOADCONST R3,1290              LOAD CONSTANT VALUE 1290
         STOREREG R3,STORAGE129           STORE TO STORAGE129
         LOADCONST R3,1300              LOAD CONSTANT VALUE 1300
         STOREREG R3,STORAGE130           STORE TO STORAGE130
         LOADCONST R3,1310              LOAD CONSTANT VALUE 1310
         STOREREG R3,STORAGE131           STORE TO STORAGE131
         LOADCONST R3,1320              LOAD CONSTANT VALUE 1320
         STOREREG R3,STORAGE132           STORE TO STORAGE132
         LOADCONST R3,1330              LOAD CONSTANT VALUE 1330
         STOREREG R3,STORAGE133           STORE TO STORAGE133
         LOADCONST R3,1340              LOAD CONSTANT VALUE 1340
         STOREREG R3,STORAGE134           STORE TO STORAGE134
         LOADCONST R3,1350              LOAD CONSTANT VALUE 1350
         STOREREG R3,STORAGE135           STORE TO STORAGE135
         LOADCONST R3,1360              LOAD CONSTANT VALUE 1360
         STOREREG R3,STORAGE136           STORE TO STORAGE136
         LOADCONST R3,1370              LOAD CONSTANT VALUE 1370
         STOREREG R3,STORAGE137           STORE TO STORAGE137
         LOADCONST R3,1380              LOAD CONSTANT VALUE 1380
         STOREREG R3,STORAGE138           STORE TO STORAGE138
         LOADCONST R3,1390              LOAD CONSTANT VALUE 1390
         STOREREG R3,STORAGE139           STORE TO STORAGE139
         SPACE ,
         LOADCONST R3,1400              LOAD CONSTANT VALUE 1400
         STOREREG R3,STORAGE140           STORE TO STORAGE140
         LOADCONST R3,1410              LOAD CONSTANT VALUE 1410
         STOREREG R3,STORAGE141           STORE TO STORAGE141
         LOADCONST R3,1420              LOAD CONSTANT VALUE 1420
         STOREREG R3,STORAGE142           STORE TO STORAGE142
         LOADCONST R3,1430              LOAD CONSTANT VALUE 1430
         STOREREG R3,STORAGE143           STORE TO STORAGE143
         LOADCONST R3,1440              LOAD CONSTANT VALUE 1440
         STOREREG R3,STORAGE144           STORE TO STORAGE144
         LOADCONST R3,1450              LOAD CONSTANT VALUE 1450
         STOREREG R3,STORAGE145           STORE TO STORAGE145
         LOADCONST R3,1460              LOAD CONSTANT VALUE 1460
         STOREREG R3,STORAGE146           STORE TO STORAGE146
         LOADCONST R3,1470              LOAD CONSTANT VALUE 1470
         STOREREG R3,STORAGE147           STORE TO STORAGE147
         LOADCONST R3,1480              LOAD CONSTANT VALUE 1480
         STOREREG R3,STORAGE148           STORE TO STORAGE148
         LOADCONST R3,1490              LOAD CONSTANT VALUE 1490
         STOREREG R3,STORAGE149           STORE TO STORAGE149
         LOADCONST R3,1500              LOAD CONSTANT VALUE 1500
         STOREREG R3,STORAGE150           STORE TO STORAGE150
         LOADCONST R3,1510              LOAD CONSTANT VALUE 1510
         STOREREG R3,STORAGE151           STORE TO STORAGE151
         LOADCONST R3,1520              LOAD CONSTANT VALUE 1520
         STOREREG R3,STORAGE152           STORE TO STORAGE152
         LOADCONST R3,1530              LOAD CONSTANT VALUE 1530
         STOREREG R3,STORAGE153           STORE TO STORAGE153
         LOADCONST R3,1540              LOAD CONSTANT VALUE 1540
         STOREREG R3,STORAGE154           STORE TO STORAGE154
         LOADCONST R3,1550              LOAD CONSTANT VALUE 1550
         STOREREG R3,STORAGE155           STORE TO STORAGE155
         LOADCONST R3,1560              LOAD CONSTANT VALUE 1560
         STOREREG R3,STORAGE156           STORE TO STORAGE156
         LOADCONST R3,1570              LOAD CONSTANT VALUE 1570
         STOREREG R3,STORAGE157           STORE TO STORAGE157
         LOADCONST R3,1580              LOAD CONSTANT VALUE 1580
         STOREREG R3,STORAGE158           STORE TO STORAGE158
         LOADCONST R3,1590              LOAD CONSTANT VALUE 1590
         STOREREG R3,STORAGE159           STORE TO STORAGE159
         SPACE ,
         LOADCONST R3,1600              LOAD CONSTANT VALUE 1600
         STOREREG R3,STORAGE160           STORE TO STORAGE160
         LOADCONST R3,1610              LOAD CONSTANT VALUE 1610
         STOREREG R3,STORAGE161           STORE TO STORAGE161
         LOADCONST R3,1620              LOAD CONSTANT VALUE 1620
         STOREREG R3,STORAGE162           STORE TO STORAGE162
         LOADCONST R3,1630              LOAD CONSTANT VALUE 1630
         STOREREG R3,STORAGE163           STORE TO STORAGE163
         LOADCONST R3,1640              LOAD CONSTANT VALUE 1640
         STOREREG R3,STORAGE164           STORE TO STORAGE164
         LOADCONST R3,1650              LOAD CONSTANT VALUE 1650
         STOREREG R3,STORAGE165           STORE TO STORAGE165
         LOADCONST R3,1660              LOAD CONSTANT VALUE 1660
         STOREREG R3,STORAGE166           STORE TO STORAGE166
         LOADCONST R3,1670              LOAD CONSTANT VALUE 1670
         STOREREG R3,STORAGE167           STORE TO STORAGE167
         LOADCONST R3,1680              LOAD CONSTANT VALUE 1680
         STOREREG R3,STORAGE168           STORE TO STORAGE168
         LOADCONST R3,1690              LOAD CONSTANT VALUE 1690
         STOREREG R3,STORAGE169           STORE TO STORAGE169
         LOADCONST R3,1700              LOAD CONSTANT VALUE 1700
         STOREREG R3,STORAGE170           STORE TO STORAGE170
         LOADCONST R3,1710              LOAD CONSTANT VALUE 1710
         STOREREG R3,STORAGE171           STORE TO STORAGE171
         LOADCONST R3,1720              LOAD CONSTANT VALUE 1720
         STOREREG R3,STORAGE172           STORE TO STORAGE172
         LOADCONST R3,1730              LOAD CONSTANT VALUE 1730
         STOREREG R3,STORAGE173           STORE TO STORAGE173
         LOADCONST R3,1740              LOAD CONSTANT VALUE 1740
         STOREREG R3,STORAGE174           STORE TO STORAGE174
         LOADCONST R3,1750              LOAD CONSTANT VALUE 1750
         STOREREG R3,STORAGE175           STORE TO STORAGE175
         LOADCONST R3,1760              LOAD CONSTANT VALUE 1760
         STOREREG R3,STORAGE176           STORE TO STORAGE176
         LOADCONST R3,1770              LOAD CONSTANT VALUE 1770
         STOREREG R3,STORAGE177           STORE TO STORAGE177
         LOADCONST R3,1780              LOAD CONSTANT VALUE 1780
         STOREREG R3,STORAGE178           STORE TO STORAGE178
         LOADCONST R3,1790              LOAD CONSTANT VALUE 1790
         STOREREG R3,STORAGE179           STORE TO STORAGE179
         SPACE ,
         LOADCONST R3,1800              LOAD CONSTANT VALUE 1800
         STOREREG R3,STORAGE180           STORE TO STORAGE180
         LOADCONST R3,1810              LOAD CONSTANT VALUE 1810
         STOREREG R3,STORAGE181           STORE TO STORAGE181
         LOADCONST R3,1820              LOAD CONSTANT VALUE 1820
         STOREREG R3,STORAGE182           STORE TO STORAGE182
         LOADCONST R3,1830              LOAD CONSTANT VALUE 1830
         STOREREG R3,STORAGE183           STORE TO STORAGE183
         LOADCONST R3,1840              LOAD CONSTANT VALUE 1840
         STOREREG R3,STORAGE184           STORE TO STORAGE184
         LOADCONST R3,1850              LOAD CONSTANT VALUE 1850
         STOREREG R3,STORAGE185           STORE TO STORAGE185
         LOADCONST R3,1860              LOAD CONSTANT VALUE 1860
         STOREREG R3,STORAGE186           STORE TO STORAGE186
         LOADCONST R3,1870              LOAD CONSTANT VALUE 1870
         STOREREG R3,STORAGE187           STORE TO STORAGE187
         LOADCONST R3,1880              LOAD CONSTANT VALUE 1880
         STOREREG R3,STORAGE188           STORE TO STORAGE188
         LOADCONST R3,1890              LOAD CONSTANT VALUE 1890
         STOREREG R3,STORAGE189           STORE TO STORAGE189
         LOADCONST R3,1900              LOAD CONSTANT VALUE 1900
         STOREREG R3,STORAGE190           STORE TO STORAGE190
         LOADCONST R3,1910              LOAD CONSTANT VALUE 1910
         STOREREG R3,STORAGE191           STORE TO STORAGE191
         LOADCONST R3,1920              LOAD CONSTANT VALUE 1920
         STOREREG R3,STORAGE192           STORE TO STORAGE192
         LOADCONST R3,1930              LOAD CONSTANT VALUE 1930
         STOREREG R3,STORAGE193           STORE TO STORAGE193
         LOADCONST R3,1940              LOAD CONSTANT VALUE 1940
         STOREREG R3,STORAGE194           STORE TO STORAGE194
         LOADCONST R3,1950              LOAD CONSTANT VALUE 1950
         STOREREG R3,STORAGE195           STORE TO STORAGE195
         LOADCONST R3,1960              LOAD CONSTANT VALUE 1960
         STOREREG R3,STORAGE196           STORE TO STORAGE196
         LOADCONST R3,1970              LOAD CONSTANT VALUE 1970
         STOREREG R3,STORAGE197           STORE TO STORAGE197
         LOADCONST R3,1980              LOAD CONSTANT VALUE 1980
         STOREREG R3,STORAGE198           STORE TO STORAGE198
         LOADCONST R3,1990              LOAD CONSTANT VALUE 1990
         STOREREG R3,STORAGE199           STORE TO STORAGE199
         SPACE ,
         SPACE ,
         INITREG R4,0                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG0,X'00'                    SET FLAG 0
         CLI   FLAG0,X'00'                    CHECK FLAG 0
         BNE   FLAGERR0                   BRANCH IF FLAG ERROR
         INITREG R4,1                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG1,X'01'                    SET FLAG 1
         CLI   FLAG1,X'01'                    CHECK FLAG 1
         BNE   FLAGERR1                   BRANCH IF FLAG ERROR
         INITREG R4,2                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG2,X'02'                    SET FLAG 2
         CLI   FLAG2,X'02'                    CHECK FLAG 2
         BNE   FLAGERR2                   BRANCH IF FLAG ERROR
         INITREG R4,3                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG3,X'03'                    SET FLAG 3
         CLI   FLAG3,X'03'                    CHECK FLAG 3
         BNE   FLAGERR3                   BRANCH IF FLAG ERROR
         INITREG R4,4                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG4,X'04'                    SET FLAG 4
         CLI   FLAG4,X'04'                    CHECK FLAG 4
         BNE   FLAGERR4                   BRANCH IF FLAG ERROR
         INITREG R4,5                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG5,X'05'                    SET FLAG 5
         CLI   FLAG5,X'05'                    CHECK FLAG 5
         BNE   FLAGERR5                   BRANCH IF FLAG ERROR
         INITREG R4,6                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG6,X'06'                    SET FLAG 6
         CLI   FLAG6,X'06'                    CHECK FLAG 6
         BNE   FLAGERR6                   BRANCH IF FLAG ERROR
         INITREG R4,7                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG7,X'07'                    SET FLAG 7
         CLI   FLAG7,X'07'                    CHECK FLAG 7
         BNE   FLAGERR7                   BRANCH IF FLAG ERROR
         INITREG R4,8                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG8,X'08'                    SET FLAG 8
         CLI   FLAG8,X'08'                    CHECK FLAG 8
         BNE   FLAGERR8                   BRANCH IF FLAG ERROR
         INITREG R4,9                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG9,X'09'                    SET FLAG 9
         CLI   FLAG9,X'09'                    CHECK FLAG 9
         BNE   FLAGERR9                   BRANCH IF FLAG ERROR
         INITREG R4,10                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG10,X'0A'                    SET FLAG 10
         CLI   FLAG10,X'0A'                    CHECK FLAG 10
         BNE   FLAGERR10                   BRANCH IF FLAG ERROR
         INITREG R4,11                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG11,X'0B'                    SET FLAG 11
         CLI   FLAG11,X'0B'                    CHECK FLAG 11
         BNE   FLAGERR11                   BRANCH IF FLAG ERROR
         INITREG R4,12                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG12,X'0C'                    SET FLAG 12
         CLI   FLAG12,X'0C'                    CHECK FLAG 12
         BNE   FLAGERR12                   BRANCH IF FLAG ERROR
         INITREG R4,13                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG13,X'0D'                    SET FLAG 13
         CLI   FLAG13,X'0D'                    CHECK FLAG 13
         BNE   FLAGERR13                   BRANCH IF FLAG ERROR
         INITREG R4,14                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG14,X'0E'                    SET FLAG 14
         CLI   FLAG14,X'0E'                    CHECK FLAG 14
         BNE   FLAGERR14                   BRANCH IF FLAG ERROR
         INITREG R4,15                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG15,X'0F'                    SET FLAG 15
         CLI   FLAG15,X'0F'                    CHECK FLAG 15
         BNE   FLAGERR15                   BRANCH IF FLAG ERROR
         INITREG R4,16                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG16,X'10'                    SET FLAG 16
         CLI   FLAG16,X'10'                    CHECK FLAG 16
         BNE   FLAGERR16                   BRANCH IF FLAG ERROR
         INITREG R4,17                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG17,X'11'                    SET FLAG 17
         CLI   FLAG17,X'11'                    CHECK FLAG 17
         BNE   FLAGERR17                   BRANCH IF FLAG ERROR
         INITREG R4,18                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG18,X'12'                    SET FLAG 18
         CLI   FLAG18,X'12'                    CHECK FLAG 18
         BNE   FLAGERR18                   BRANCH IF FLAG ERROR
         INITREG R4,19                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG19,X'13'                    SET FLAG 19
         CLI   FLAG19,X'13'                    CHECK FLAG 19
         BNE   FLAGERR19                   BRANCH IF FLAG ERROR
         SPACE ,
         INITREG R4,20                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG20,X'14'                    SET FLAG 20
         CLI   FLAG20,X'14'                    CHECK FLAG 20
         BNE   FLAGERR20                   BRANCH IF FLAG ERROR
         INITREG R4,21                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG21,X'15'                    SET FLAG 21
         CLI   FLAG21,X'15'                    CHECK FLAG 21
         BNE   FLAGERR21                   BRANCH IF FLAG ERROR
         INITREG R4,22                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG22,X'16'                    SET FLAG 22
         CLI   FLAG22,X'16'                    CHECK FLAG 22
         BNE   FLAGERR22                   BRANCH IF FLAG ERROR
         INITREG R4,23                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG23,X'17'                    SET FLAG 23
         CLI   FLAG23,X'17'                    CHECK FLAG 23
         BNE   FLAGERR23                   BRANCH IF FLAG ERROR
         INITREG R4,24                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG24,X'18'                    SET FLAG 24
         CLI   FLAG24,X'18'                    CHECK FLAG 24
         BNE   FLAGERR24                   BRANCH IF FLAG ERROR
         INITREG R4,25                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG25,X'19'                    SET FLAG 25
         CLI   FLAG25,X'19'                    CHECK FLAG 25
         BNE   FLAGERR25                   BRANCH IF FLAG ERROR
         INITREG R4,26                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG26,X'1A'                    SET FLAG 26
         CLI   FLAG26,X'1A'                    CHECK FLAG 26
         BNE   FLAGERR26                   BRANCH IF FLAG ERROR
         INITREG R4,27                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG27,X'1B'                    SET FLAG 27
         CLI   FLAG27,X'1B'                    CHECK FLAG 27
         BNE   FLAGERR27                   BRANCH IF FLAG ERROR
         INITREG R4,28                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG28,X'1C'                    SET FLAG 28
         CLI   FLAG28,X'1C'                    CHECK FLAG 28
         BNE   FLAGERR28                   BRANCH IF FLAG ERROR
         INITREG R4,29                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG29,X'1D'                    SET FLAG 29
         CLI   FLAG29,X'1D'                    CHECK FLAG 29
         BNE   FLAGERR29                   BRANCH IF FLAG ERROR
         INITREG R4,30                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG30,X'1E'                    SET FLAG 30
         CLI   FLAG30,X'1E'                    CHECK FLAG 30
         BNE   FLAGERR30                   BRANCH IF FLAG ERROR
         INITREG R4,31                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG31,X'1F'                    SET FLAG 31
         CLI   FLAG31,X'1F'                    CHECK FLAG 31
         BNE   FLAGERR31                   BRANCH IF FLAG ERROR
         INITREG R4,32                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG32,X'20'                    SET FLAG 32
         CLI   FLAG32,X'20'                    CHECK FLAG 32
         BNE   FLAGERR32                   BRANCH IF FLAG ERROR
         INITREG R4,33                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG33,X'21'                    SET FLAG 33
         CLI   FLAG33,X'21'                    CHECK FLAG 33
         BNE   FLAGERR33                   BRANCH IF FLAG ERROR
         INITREG R4,34                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG34,X'22'                    SET FLAG 34
         CLI   FLAG34,X'22'                    CHECK FLAG 34
         BNE   FLAGERR34                   BRANCH IF FLAG ERROR
         INITREG R4,35                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG35,X'23'                    SET FLAG 35
         CLI   FLAG35,X'23'                    CHECK FLAG 35
         BNE   FLAGERR35                   BRANCH IF FLAG ERROR
         INITREG R4,36                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG36,X'24'                    SET FLAG 36
         CLI   FLAG36,X'24'                    CHECK FLAG 36
         BNE   FLAGERR36                   BRANCH IF FLAG ERROR
         INITREG R4,37                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG37,X'25'                    SET FLAG 37
         CLI   FLAG37,X'25'                    CHECK FLAG 37
         BNE   FLAGERR37                   BRANCH IF FLAG ERROR
         INITREG R4,38                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG38,X'26'                    SET FLAG 38
         CLI   FLAG38,X'26'                    CHECK FLAG 38
         BNE   FLAGERR38                   BRANCH IF FLAG ERROR
         INITREG R4,39                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG39,X'27'                    SET FLAG 39
         CLI   FLAG39,X'27'                    CHECK FLAG 39
         BNE   FLAGERR39                   BRANCH IF FLAG ERROR
         SPACE ,
         INITREG R4,40                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG40,X'28'                    SET FLAG 40
         CLI   FLAG40,X'28'                    CHECK FLAG 40
         BNE   FLAGERR40                   BRANCH IF FLAG ERROR
         INITREG R4,41                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG41,X'29'                    SET FLAG 41
         CLI   FLAG41,X'29'                    CHECK FLAG 41
         BNE   FLAGERR41                   BRANCH IF FLAG ERROR
         INITREG R4,42                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG42,X'2A'                    SET FLAG 42
         CLI   FLAG42,X'2A'                    CHECK FLAG 42
         BNE   FLAGERR42                   BRANCH IF FLAG ERROR
         INITREG R4,43                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG43,X'2B'                    SET FLAG 43
         CLI   FLAG43,X'2B'                    CHECK FLAG 43
         BNE   FLAGERR43                   BRANCH IF FLAG ERROR
         INITREG R4,44                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG44,X'2C'                    SET FLAG 44
         CLI   FLAG44,X'2C'                    CHECK FLAG 44
         BNE   FLAGERR44                   BRANCH IF FLAG ERROR
         INITREG R4,45                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG45,X'2D'                    SET FLAG 45
         CLI   FLAG45,X'2D'                    CHECK FLAG 45
         BNE   FLAGERR45                   BRANCH IF FLAG ERROR
         INITREG R4,46                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG46,X'2E'                    SET FLAG 46
         CLI   FLAG46,X'2E'                    CHECK FLAG 46
         BNE   FLAGERR46                   BRANCH IF FLAG ERROR
         INITREG R4,47                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG47,X'2F'                    SET FLAG 47
         CLI   FLAG47,X'2F'                    CHECK FLAG 47
         BNE   FLAGERR47                   BRANCH IF FLAG ERROR
         INITREG R4,48                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG48,X'30'                    SET FLAG 48
         CLI   FLAG48,X'30'                    CHECK FLAG 48
         BNE   FLAGERR48                   BRANCH IF FLAG ERROR
         INITREG R4,49                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG49,X'31'                    SET FLAG 49
         CLI   FLAG49,X'31'                    CHECK FLAG 49
         BNE   FLAGERR49                   BRANCH IF FLAG ERROR
         INITREG R4,50                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG50,X'32'                    SET FLAG 50
         CLI   FLAG50,X'32'                    CHECK FLAG 50
         BNE   FLAGERR50                   BRANCH IF FLAG ERROR
         INITREG R4,51                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG51,X'33'                    SET FLAG 51
         CLI   FLAG51,X'33'                    CHECK FLAG 51
         BNE   FLAGERR51                   BRANCH IF FLAG ERROR
         INITREG R4,52                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG52,X'34'                    SET FLAG 52
         CLI   FLAG52,X'34'                    CHECK FLAG 52
         BNE   FLAGERR52                   BRANCH IF FLAG ERROR
         INITREG R4,53                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG53,X'35'                    SET FLAG 53
         CLI   FLAG53,X'35'                    CHECK FLAG 53
         BNE   FLAGERR53                   BRANCH IF FLAG ERROR
         INITREG R4,54                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG54,X'36'                    SET FLAG 54
         CLI   FLAG54,X'36'                    CHECK FLAG 54
         BNE   FLAGERR54                   BRANCH IF FLAG ERROR
         INITREG R4,55                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG55,X'37'                    SET FLAG 55
         CLI   FLAG55,X'37'                    CHECK FLAG 55
         BNE   FLAGERR55                   BRANCH IF FLAG ERROR
         INITREG R4,56                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG56,X'38'                    SET FLAG 56
         CLI   FLAG56,X'38'                    CHECK FLAG 56
         BNE   FLAGERR56                   BRANCH IF FLAG ERROR
         INITREG R4,57                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG57,X'39'                    SET FLAG 57
         CLI   FLAG57,X'39'                    CHECK FLAG 57
         BNE   FLAGERR57                   BRANCH IF FLAG ERROR
         INITREG R4,58                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG58,X'3A'                    SET FLAG 58
         CLI   FLAG58,X'3A'                    CHECK FLAG 58
         BNE   FLAGERR58                   BRANCH IF FLAG ERROR
         INITREG R4,59                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG59,X'3B'                    SET FLAG 59
         CLI   FLAG59,X'3B'                    CHECK FLAG 59
         BNE   FLAGERR59                   BRANCH IF FLAG ERROR
         SPACE ,
         INITREG R4,60                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG60,X'3C'                    SET FLAG 60
         CLI   FLAG60,X'3C'                    CHECK FLAG 60
         BNE   FLAGERR60                   BRANCH IF FLAG ERROR
         INITREG R4,61                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG61,X'3D'                    SET FLAG 61
         CLI   FLAG61,X'3D'                    CHECK FLAG 61
         BNE   FLAGERR61                   BRANCH IF FLAG ERROR
         INITREG R4,62                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG62,X'3E'                    SET FLAG 62
         CLI   FLAG62,X'3E'                    CHECK FLAG 62
         BNE   FLAGERR62                   BRANCH IF FLAG ERROR
         INITREG R4,63                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG63,X'3F'                    SET FLAG 63
         CLI   FLAG63,X'3F'                    CHECK FLAG 63
         BNE   FLAGERR63                   BRANCH IF FLAG ERROR
         INITREG R4,64                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG64,X'40'                    SET FLAG 64
         CLI   FLAG64,X'40'                    CHECK FLAG 64
         BNE   FLAGERR64                   BRANCH IF FLAG ERROR
         INITREG R4,65                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG65,X'41'                    SET FLAG 65
         CLI   FLAG65,X'41'                    CHECK FLAG 65
         BNE   FLAGERR65                   BRANCH IF FLAG ERROR
         INITREG R4,66                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG66,X'42'                    SET FLAG 66
         CLI   FLAG66,X'42'                    CHECK FLAG 66
         BNE   FLAGERR66                   BRANCH IF FLAG ERROR
         INITREG R4,67                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG67,X'43'                    SET FLAG 67
         CLI   FLAG67,X'43'                    CHECK FLAG 67
         BNE   FLAGERR67                   BRANCH IF FLAG ERROR
         INITREG R4,68                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG68,X'44'                    SET FLAG 68
         CLI   FLAG68,X'44'                    CHECK FLAG 68
         BNE   FLAGERR68                   BRANCH IF FLAG ERROR
         INITREG R4,69                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG69,X'45'                    SET FLAG 69
         CLI   FLAG69,X'45'                    CHECK FLAG 69
         BNE   FLAGERR69                   BRANCH IF FLAG ERROR
         INITREG R4,70                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG70,X'46'                    SET FLAG 70
         CLI   FLAG70,X'46'                    CHECK FLAG 70
         BNE   FLAGERR70                   BRANCH IF FLAG ERROR
         INITREG R4,71                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG71,X'47'                    SET FLAG 71
         CLI   FLAG71,X'47'                    CHECK FLAG 71
         BNE   FLAGERR71                   BRANCH IF FLAG ERROR
         INITREG R4,72                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG72,X'48'                    SET FLAG 72
         CLI   FLAG72,X'48'                    CHECK FLAG 72
         BNE   FLAGERR72                   BRANCH IF FLAG ERROR
         INITREG R4,73                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG73,X'49'                    SET FLAG 73
         CLI   FLAG73,X'49'                    CHECK FLAG 73
         BNE   FLAGERR73                   BRANCH IF FLAG ERROR
         INITREG R4,74                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG74,X'4A'                    SET FLAG 74
         CLI   FLAG74,X'4A'                    CHECK FLAG 74
         BNE   FLAGERR74                   BRANCH IF FLAG ERROR
         INITREG R4,75                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG75,X'4B'                    SET FLAG 75
         CLI   FLAG75,X'4B'                    CHECK FLAG 75
         BNE   FLAGERR75                   BRANCH IF FLAG ERROR
         INITREG R4,76                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG76,X'4C'                    SET FLAG 76
         CLI   FLAG76,X'4C'                    CHECK FLAG 76
         BNE   FLAGERR76                   BRANCH IF FLAG ERROR
         INITREG R4,77                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG77,X'4D'                    SET FLAG 77
         CLI   FLAG77,X'4D'                    CHECK FLAG 77
         BNE   FLAGERR77                   BRANCH IF FLAG ERROR
         INITREG R4,78                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG78,X'4E'                    SET FLAG 78
         CLI   FLAG78,X'4E'                    CHECK FLAG 78
         BNE   FLAGERR78                   BRANCH IF FLAG ERROR
         INITREG R4,79                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG79,X'4F'                    SET FLAG 79
         CLI   FLAG79,X'4F'                    CHECK FLAG 79
         BNE   FLAGERR79                   BRANCH IF FLAG ERROR
         SPACE ,
         INITREG R4,80                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG80,X'50'                    SET FLAG 80
         CLI   FLAG80,X'50'                    CHECK FLAG 80
         BNE   FLAGERR80                   BRANCH IF FLAG ERROR
         INITREG R4,81                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG81,X'51'                    SET FLAG 81
         CLI   FLAG81,X'51'                    CHECK FLAG 81
         BNE   FLAGERR81                   BRANCH IF FLAG ERROR
         INITREG R4,82                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG82,X'52'                    SET FLAG 82
         CLI   FLAG82,X'52'                    CHECK FLAG 82
         BNE   FLAGERR82                   BRANCH IF FLAG ERROR
         INITREG R4,83                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG83,X'53'                    SET FLAG 83
         CLI   FLAG83,X'53'                    CHECK FLAG 83
         BNE   FLAGERR83                   BRANCH IF FLAG ERROR
         INITREG R4,84                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG84,X'54'                    SET FLAG 84
         CLI   FLAG84,X'54'                    CHECK FLAG 84
         BNE   FLAGERR84                   BRANCH IF FLAG ERROR
         INITREG R4,85                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG85,X'55'                    SET FLAG 85
         CLI   FLAG85,X'55'                    CHECK FLAG 85
         BNE   FLAGERR85                   BRANCH IF FLAG ERROR
         INITREG R4,86                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG86,X'56'                    SET FLAG 86
         CLI   FLAG86,X'56'                    CHECK FLAG 86
         BNE   FLAGERR86                   BRANCH IF FLAG ERROR
         INITREG R4,87                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG87,X'57'                    SET FLAG 87
         CLI   FLAG87,X'57'                    CHECK FLAG 87
         BNE   FLAGERR87                   BRANCH IF FLAG ERROR
         INITREG R4,88                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG88,X'58'                    SET FLAG 88
         CLI   FLAG88,X'58'                    CHECK FLAG 88
         BNE   FLAGERR88                   BRANCH IF FLAG ERROR
         INITREG R4,89                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG89,X'59'                    SET FLAG 89
         CLI   FLAG89,X'59'                    CHECK FLAG 89
         BNE   FLAGERR89                   BRANCH IF FLAG ERROR
         INITREG R4,90                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG90,X'5A'                    SET FLAG 90
         CLI   FLAG90,X'5A'                    CHECK FLAG 90
         BNE   FLAGERR90                   BRANCH IF FLAG ERROR
         INITREG R4,91                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG91,X'5B'                    SET FLAG 91
         CLI   FLAG91,X'5B'                    CHECK FLAG 91
         BNE   FLAGERR91                   BRANCH IF FLAG ERROR
         INITREG R4,92                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG92,X'5C'                    SET FLAG 92
         CLI   FLAG92,X'5C'                    CHECK FLAG 92
         BNE   FLAGERR92                   BRANCH IF FLAG ERROR
         INITREG R4,93                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG93,X'5D'                    SET FLAG 93
         CLI   FLAG93,X'5D'                    CHECK FLAG 93
         BNE   FLAGERR93                   BRANCH IF FLAG ERROR
         INITREG R4,94                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG94,X'5E'                    SET FLAG 94
         CLI   FLAG94,X'5E'                    CHECK FLAG 94
         BNE   FLAGERR94                   BRANCH IF FLAG ERROR
         INITREG R4,95                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG95,X'5F'                    SET FLAG 95
         CLI   FLAG95,X'5F'                    CHECK FLAG 95
         BNE   FLAGERR95                   BRANCH IF FLAG ERROR
         INITREG R4,96                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG96,X'60'                    SET FLAG 96
         CLI   FLAG96,X'60'                    CHECK FLAG 96
         BNE   FLAGERR96                   BRANCH IF FLAG ERROR
         INITREG R4,97                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG97,X'61'                    SET FLAG 97
         CLI   FLAG97,X'61'                    CHECK FLAG 97
         BNE   FLAGERR97                   BRANCH IF FLAG ERROR
         INITREG R4,98                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG98,X'62'                    SET FLAG 98
         CLI   FLAG98,X'62'                    CHECK FLAG 98
         BNE   FLAGERR98                   BRANCH IF FLAG ERROR
         INITREG R4,99                    INITIALIZE REGISTER R4
         CLEARREG R5                        CLEAR REGISTER R5
         MVI   FLAG99,X'63'                    SET FLAG 99
         CLI   FLAG99,X'63'                    CHECK FLAG 99
         BNE   FLAGERR99                   BRANCH IF FLAG ERROR
         SPACE ,
FLAGERR0   EQU   *                        FLAG ERROR HANDLER 0
FLAGERR1   EQU   *                        FLAG ERROR HANDLER 1
FLAGERR2   EQU   *                        FLAG ERROR HANDLER 2
FLAGERR3   EQU   *                        FLAG ERROR HANDLER 3
FLAGERR4   EQU   *                        FLAG ERROR HANDLER 4
FLAGERR5   EQU   *                        FLAG ERROR HANDLER 5
FLAGERR6   EQU   *                        FLAG ERROR HANDLER 6
FLAGERR7   EQU   *                        FLAG ERROR HANDLER 7
FLAGERR8   EQU   *                        FLAG ERROR HANDLER 8
FLAGERR9   EQU   *                        FLAG ERROR HANDLER 9
FLAGERR10   EQU   *                        FLAG ERROR HANDLER 10
FLAGERR11   EQU   *                        FLAG ERROR HANDLER 11
FLAGERR12   EQU   *                        FLAG ERROR HANDLER 12
FLAGERR13   EQU   *                        FLAG ERROR HANDLER 13
FLAGERR14   EQU   *                        FLAG ERROR HANDLER 14
FLAGERR15   EQU   *                        FLAG ERROR HANDLER 15
FLAGERR16   EQU   *                        FLAG ERROR HANDLER 16
FLAGERR17   EQU   *                        FLAG ERROR HANDLER 17
FLAGERR18   EQU   *                        FLAG ERROR HANDLER 18
FLAGERR19   EQU   *                        FLAG ERROR HANDLER 19
FLAGERR20   EQU   *                        FLAG ERROR HANDLER 20
FLAGERR21   EQU   *                        FLAG ERROR HANDLER 21
FLAGERR22   EQU   *                        FLAG ERROR HANDLER 22
FLAGERR23   EQU   *                        FLAG ERROR HANDLER 23
FLAGERR24   EQU   *                        FLAG ERROR HANDLER 24
FLAGERR25   EQU   *                        FLAG ERROR HANDLER 25
FLAGERR26   EQU   *                        FLAG ERROR HANDLER 26
FLAGERR27   EQU   *                        FLAG ERROR HANDLER 27
FLAGERR28   EQU   *                        FLAG ERROR HANDLER 28
FLAGERR29   EQU   *                        FLAG ERROR HANDLER 29
FLAGERR30   EQU   *                        FLAG ERROR HANDLER 30
FLAGERR31   EQU   *                        FLAG ERROR HANDLER 31
FLAGERR32   EQU   *                        FLAG ERROR HANDLER 32
FLAGERR33   EQU   *                        FLAG ERROR HANDLER 33
FLAGERR34   EQU   *                        FLAG ERROR HANDLER 34
FLAGERR35   EQU   *                        FLAG ERROR HANDLER 35
FLAGERR36   EQU   *                        FLAG ERROR HANDLER 36
FLAGERR37   EQU   *                        FLAG ERROR HANDLER 37
FLAGERR38   EQU   *                        FLAG ERROR HANDLER 38
FLAGERR39   EQU   *                        FLAG ERROR HANDLER 39
FLAGERR40   EQU   *                        FLAG ERROR HANDLER 40
FLAGERR41   EQU   *                        FLAG ERROR HANDLER 41
FLAGERR42   EQU   *                        FLAG ERROR HANDLER 42
FLAGERR43   EQU   *                        FLAG ERROR HANDLER 43
FLAGERR44   EQU   *                        FLAG ERROR HANDLER 44
FLAGERR45   EQU   *                        FLAG ERROR HANDLER 45
FLAGERR46   EQU   *                        FLAG ERROR HANDLER 46
FLAGERR47   EQU   *                        FLAG ERROR HANDLER 47
FLAGERR48   EQU   *                        FLAG ERROR HANDLER 48
FLAGERR49   EQU   *                        FLAG ERROR HANDLER 49
FLAGERR50   EQU   *                        FLAG ERROR HANDLER 50
FLAGERR51   EQU   *                        FLAG ERROR HANDLER 51
FLAGERR52   EQU   *                        FLAG ERROR HANDLER 52
FLAGERR53   EQU   *                        FLAG ERROR HANDLER 53
FLAGERR54   EQU   *                        FLAG ERROR HANDLER 54
FLAGERR55   EQU   *                        FLAG ERROR HANDLER 55
FLAGERR56   EQU   *                        FLAG ERROR HANDLER 56
FLAGERR57   EQU   *                        FLAG ERROR HANDLER 57
FLAGERR58   EQU   *                        FLAG ERROR HANDLER 58
FLAGERR59   EQU   *                        FLAG ERROR HANDLER 59
FLAGERR60   EQU   *                        FLAG ERROR HANDLER 60
FLAGERR61   EQU   *                        FLAG ERROR HANDLER 61
FLAGERR62   EQU   *                        FLAG ERROR HANDLER 62
FLAGERR63   EQU   *                        FLAG ERROR HANDLER 63
FLAGERR64   EQU   *                        FLAG ERROR HANDLER 64
FLAGERR65   EQU   *                        FLAG ERROR HANDLER 65
FLAGERR66   EQU   *                        FLAG ERROR HANDLER 66
FLAGERR67   EQU   *                        FLAG ERROR HANDLER 67
FLAGERR68   EQU   *                        FLAG ERROR HANDLER 68
FLAGERR69   EQU   *                        FLAG ERROR HANDLER 69
FLAGERR70   EQU   *                        FLAG ERROR HANDLER 70
FLAGERR71   EQU   *                        FLAG ERROR HANDLER 71
FLAGERR72   EQU   *                        FLAG ERROR HANDLER 72
FLAGERR73   EQU   *                        FLAG ERROR HANDLER 73
FLAGERR74   EQU   *                        FLAG ERROR HANDLER 74
FLAGERR75   EQU   *                        FLAG ERROR HANDLER 75
FLAGERR76   EQU   *                        FLAG ERROR HANDLER 76
FLAGERR77   EQU   *                        FLAG ERROR HANDLER 77
FLAGERR78   EQU   *                        FLAG ERROR HANDLER 78
FLAGERR79   EQU   *                        FLAG ERROR HANDLER 79
FLAGERR80   EQU   *                        FLAG ERROR HANDLER 80
FLAGERR81   EQU   *                        FLAG ERROR HANDLER 81
FLAGERR82   EQU   *                        FLAG ERROR HANDLER 82
FLAGERR83   EQU   *                        FLAG ERROR HANDLER 83
FLAGERR84   EQU   *                        FLAG ERROR HANDLER 84
FLAGERR85   EQU   *                        FLAG ERROR HANDLER 85
FLAGERR86   EQU   *                        FLAG ERROR HANDLER 86
FLAGERR87   EQU   *                        FLAG ERROR HANDLER 87
FLAGERR88   EQU   *                        FLAG ERROR HANDLER 88
FLAGERR89   EQU   *                        FLAG ERROR HANDLER 89
FLAGERR90   EQU   *                        FLAG ERROR HANDLER 90
FLAGERR91   EQU   *                        FLAG ERROR HANDLER 91
FLAGERR92   EQU   *                        FLAG ERROR HANDLER 92
FLAGERR93   EQU   *                        FLAG ERROR HANDLER 93
FLAGERR94   EQU   *                        FLAG ERROR HANDLER 94
FLAGERR95   EQU   *                        FLAG ERROR HANDLER 95
FLAGERR96   EQU   *                        FLAG ERROR HANDLER 96
FLAGERR97   EQU   *                        FLAG ERROR HANDLER 97
FLAGERR98   EQU   *                        FLAG ERROR HANDLER 98
FLAGERR99   EQU   *                        FLAG ERROR HANDLER 99
         SPACE ,
         LA    R6,TABLE0                 LOAD TABLE0 ADDRESS
         L     R7,0(R6)                     LOAD TABLE0 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT0                STORE RESULT0
         LA    R6,TABLE1                 LOAD TABLE1 ADDRESS
         L     R7,0(R6)                     LOAD TABLE1 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT1                STORE RESULT1
         LA    R6,TABLE2                 LOAD TABLE2 ADDRESS
         L     R7,0(R6)                     LOAD TABLE2 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT2                STORE RESULT2
         LA    R6,TABLE3                 LOAD TABLE3 ADDRESS
         L     R7,0(R6)                     LOAD TABLE3 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT3                STORE RESULT3
         LA    R6,TABLE4                 LOAD TABLE4 ADDRESS
         L     R7,0(R6)                     LOAD TABLE4 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT4                STORE RESULT4
         LA    R6,TABLE5                 LOAD TABLE5 ADDRESS
         L     R7,0(R6)                     LOAD TABLE5 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT5                STORE RESULT5
         LA    R6,TABLE6                 LOAD TABLE6 ADDRESS
         L     R7,0(R6)                     LOAD TABLE6 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT6                STORE RESULT6
         LA    R6,TABLE7                 LOAD TABLE7 ADDRESS
         L     R7,0(R6)                     LOAD TABLE7 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT7                STORE RESULT7
         LA    R6,TABLE8                 LOAD TABLE8 ADDRESS
         L     R7,0(R6)                     LOAD TABLE8 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT8                STORE RESULT8
         LA    R6,TABLE9                 LOAD TABLE9 ADDRESS
         L     R7,0(R6)                     LOAD TABLE9 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT9                STORE RESULT9
         LA    R6,TABLE10                 LOAD TABLE10 ADDRESS
         L     R7,0(R6)                     LOAD TABLE10 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT10                STORE RESULT10
         LA    R6,TABLE11                 LOAD TABLE11 ADDRESS
         L     R7,0(R6)                     LOAD TABLE11 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT11                STORE RESULT11
         LA    R6,TABLE12                 LOAD TABLE12 ADDRESS
         L     R7,0(R6)                     LOAD TABLE12 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT12                STORE RESULT12
         LA    R6,TABLE13                 LOAD TABLE13 ADDRESS
         L     R7,0(R6)                     LOAD TABLE13 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT13                STORE RESULT13
         LA    R6,TABLE14                 LOAD TABLE14 ADDRESS
         L     R7,0(R6)                     LOAD TABLE14 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT14                STORE RESULT14
         LA    R6,TABLE15                 LOAD TABLE15 ADDRESS
         L     R7,0(R6)                     LOAD TABLE15 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT15                STORE RESULT15
         LA    R6,TABLE16                 LOAD TABLE16 ADDRESS
         L     R7,0(R6)                     LOAD TABLE16 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT16                STORE RESULT16
         LA    R6,TABLE17                 LOAD TABLE17 ADDRESS
         L     R7,0(R6)                     LOAD TABLE17 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT17                STORE RESULT17
         LA    R6,TABLE18                 LOAD TABLE18 ADDRESS
         L     R7,0(R6)                     LOAD TABLE18 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT18                STORE RESULT18
         LA    R6,TABLE19                 LOAD TABLE19 ADDRESS
         L     R7,0(R6)                     LOAD TABLE19 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT19                STORE RESULT19
         LA    R6,TABLE20                 LOAD TABLE20 ADDRESS
         L     R7,0(R6)                     LOAD TABLE20 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT20                STORE RESULT20
         LA    R6,TABLE21                 LOAD TABLE21 ADDRESS
         L     R7,0(R6)                     LOAD TABLE21 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT21                STORE RESULT21
         LA    R6,TABLE22                 LOAD TABLE22 ADDRESS
         L     R7,0(R6)                     LOAD TABLE22 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT22                STORE RESULT22
         LA    R6,TABLE23                 LOAD TABLE23 ADDRESS
         L     R7,0(R6)                     LOAD TABLE23 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT23                STORE RESULT23
         LA    R6,TABLE24                 LOAD TABLE24 ADDRESS
         L     R7,0(R6)                     LOAD TABLE24 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT24                STORE RESULT24
         SPACE ,
         LA    R6,TABLE25                 LOAD TABLE25 ADDRESS
         L     R7,0(R6)                     LOAD TABLE25 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT25                STORE RESULT25
         LA    R6,TABLE26                 LOAD TABLE26 ADDRESS
         L     R7,0(R6)                     LOAD TABLE26 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT26                STORE RESULT26
         LA    R6,TABLE27                 LOAD TABLE27 ADDRESS
         L     R7,0(R6)                     LOAD TABLE27 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT27                STORE RESULT27
         LA    R6,TABLE28                 LOAD TABLE28 ADDRESS
         L     R7,0(R6)                     LOAD TABLE28 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT28                STORE RESULT28
         LA    R6,TABLE29                 LOAD TABLE29 ADDRESS
         L     R7,0(R6)                     LOAD TABLE29 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT29                STORE RESULT29
         LA    R6,TABLE30                 LOAD TABLE30 ADDRESS
         L     R7,0(R6)                     LOAD TABLE30 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT30                STORE RESULT30
         LA    R6,TABLE31                 LOAD TABLE31 ADDRESS
         L     R7,0(R6)                     LOAD TABLE31 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT31                STORE RESULT31
         LA    R6,TABLE32                 LOAD TABLE32 ADDRESS
         L     R7,0(R6)                     LOAD TABLE32 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT32                STORE RESULT32
         LA    R6,TABLE33                 LOAD TABLE33 ADDRESS
         L     R7,0(R6)                     LOAD TABLE33 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT33                STORE RESULT33
         LA    R6,TABLE34                 LOAD TABLE34 ADDRESS
         L     R7,0(R6)                     LOAD TABLE34 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT34                STORE RESULT34
         LA    R6,TABLE35                 LOAD TABLE35 ADDRESS
         L     R7,0(R6)                     LOAD TABLE35 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT35                STORE RESULT35
         LA    R6,TABLE36                 LOAD TABLE36 ADDRESS
         L     R7,0(R6)                     LOAD TABLE36 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT36                STORE RESULT36
         LA    R6,TABLE37                 LOAD TABLE37 ADDRESS
         L     R7,0(R6)                     LOAD TABLE37 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT37                STORE RESULT37
         LA    R6,TABLE38                 LOAD TABLE38 ADDRESS
         L     R7,0(R6)                     LOAD TABLE38 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT38                STORE RESULT38
         LA    R6,TABLE39                 LOAD TABLE39 ADDRESS
         L     R7,0(R6)                     LOAD TABLE39 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT39                STORE RESULT39
         LA    R6,TABLE40                 LOAD TABLE40 ADDRESS
         L     R7,0(R6)                     LOAD TABLE40 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT40                STORE RESULT40
         LA    R6,TABLE41                 LOAD TABLE41 ADDRESS
         L     R7,0(R6)                     LOAD TABLE41 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT41                STORE RESULT41
         LA    R6,TABLE42                 LOAD TABLE42 ADDRESS
         L     R7,0(R6)                     LOAD TABLE42 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT42                STORE RESULT42
         LA    R6,TABLE43                 LOAD TABLE43 ADDRESS
         L     R7,0(R6)                     LOAD TABLE43 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT43                STORE RESULT43
         LA    R6,TABLE44                 LOAD TABLE44 ADDRESS
         L     R7,0(R6)                     LOAD TABLE44 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT44                STORE RESULT44
         LA    R6,TABLE45                 LOAD TABLE45 ADDRESS
         L     R7,0(R6)                     LOAD TABLE45 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT45                STORE RESULT45
         LA    R6,TABLE46                 LOAD TABLE46 ADDRESS
         L     R7,0(R6)                     LOAD TABLE46 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT46                STORE RESULT46
         LA    R6,TABLE47                 LOAD TABLE47 ADDRESS
         L     R7,0(R6)                     LOAD TABLE47 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT47                STORE RESULT47
         LA    R6,TABLE48                 LOAD TABLE48 ADDRESS
         L     R7,0(R6)                     LOAD TABLE48 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT48                STORE RESULT48
         LA    R6,TABLE49                 LOAD TABLE49 ADDRESS
         L     R7,0(R6)                     LOAD TABLE49 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT49                STORE RESULT49
         SPACE ,
         LA    R6,TABLE50                 LOAD TABLE50 ADDRESS
         L     R7,0(R6)                     LOAD TABLE50 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT50                STORE RESULT50
         LA    R6,TABLE51                 LOAD TABLE51 ADDRESS
         L     R7,0(R6)                     LOAD TABLE51 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT51                STORE RESULT51
         LA    R6,TABLE52                 LOAD TABLE52 ADDRESS
         L     R7,0(R6)                     LOAD TABLE52 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT52                STORE RESULT52
         LA    R6,TABLE53                 LOAD TABLE53 ADDRESS
         L     R7,0(R6)                     LOAD TABLE53 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT53                STORE RESULT53
         LA    R6,TABLE54                 LOAD TABLE54 ADDRESS
         L     R7,0(R6)                     LOAD TABLE54 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT54                STORE RESULT54
         LA    R6,TABLE55                 LOAD TABLE55 ADDRESS
         L     R7,0(R6)                     LOAD TABLE55 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT55                STORE RESULT55
         LA    R6,TABLE56                 LOAD TABLE56 ADDRESS
         L     R7,0(R6)                     LOAD TABLE56 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT56                STORE RESULT56
         LA    R6,TABLE57                 LOAD TABLE57 ADDRESS
         L     R7,0(R6)                     LOAD TABLE57 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT57                STORE RESULT57
         LA    R6,TABLE58                 LOAD TABLE58 ADDRESS
         L     R7,0(R6)                     LOAD TABLE58 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT58                STORE RESULT58
         LA    R6,TABLE59                 LOAD TABLE59 ADDRESS
         L     R7,0(R6)                     LOAD TABLE59 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT59                STORE RESULT59
         LA    R6,TABLE60                 LOAD TABLE60 ADDRESS
         L     R7,0(R6)                     LOAD TABLE60 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT60                STORE RESULT60
         LA    R6,TABLE61                 LOAD TABLE61 ADDRESS
         L     R7,0(R6)                     LOAD TABLE61 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT61                STORE RESULT61
         LA    R6,TABLE62                 LOAD TABLE62 ADDRESS
         L     R7,0(R6)                     LOAD TABLE62 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT62                STORE RESULT62
         LA    R6,TABLE63                 LOAD TABLE63 ADDRESS
         L     R7,0(R6)                     LOAD TABLE63 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT63                STORE RESULT63
         LA    R6,TABLE64                 LOAD TABLE64 ADDRESS
         L     R7,0(R6)                     LOAD TABLE64 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT64                STORE RESULT64
         LA    R6,TABLE65                 LOAD TABLE65 ADDRESS
         L     R7,0(R6)                     LOAD TABLE65 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT65                STORE RESULT65
         LA    R6,TABLE66                 LOAD TABLE66 ADDRESS
         L     R7,0(R6)                     LOAD TABLE66 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT66                STORE RESULT66
         LA    R6,TABLE67                 LOAD TABLE67 ADDRESS
         L     R7,0(R6)                     LOAD TABLE67 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT67                STORE RESULT67
         LA    R6,TABLE68                 LOAD TABLE68 ADDRESS
         L     R7,0(R6)                     LOAD TABLE68 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT68                STORE RESULT68
         LA    R6,TABLE69                 LOAD TABLE69 ADDRESS
         L     R7,0(R6)                     LOAD TABLE69 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT69                STORE RESULT69
         LA    R6,TABLE70                 LOAD TABLE70 ADDRESS
         L     R7,0(R6)                     LOAD TABLE70 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT70                STORE RESULT70
         LA    R6,TABLE71                 LOAD TABLE71 ADDRESS
         L     R7,0(R6)                     LOAD TABLE71 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT71                STORE RESULT71
         LA    R6,TABLE72                 LOAD TABLE72 ADDRESS
         L     R7,0(R6)                     LOAD TABLE72 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT72                STORE RESULT72
         LA    R6,TABLE73                 LOAD TABLE73 ADDRESS
         L     R7,0(R6)                     LOAD TABLE73 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT73                STORE RESULT73
         LA    R6,TABLE74                 LOAD TABLE74 ADDRESS
         L     R7,0(R6)                     LOAD TABLE74 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT74                STORE RESULT74
         SPACE ,
         LA    R6,TABLE75                 LOAD TABLE75 ADDRESS
         L     R7,0(R6)                     LOAD TABLE75 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT75                STORE RESULT75
         LA    R6,TABLE76                 LOAD TABLE76 ADDRESS
         L     R7,0(R6)                     LOAD TABLE76 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT76                STORE RESULT76
         LA    R6,TABLE77                 LOAD TABLE77 ADDRESS
         L     R7,0(R6)                     LOAD TABLE77 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT77                STORE RESULT77
         LA    R6,TABLE78                 LOAD TABLE78 ADDRESS
         L     R7,0(R6)                     LOAD TABLE78 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT78                STORE RESULT78
         LA    R6,TABLE79                 LOAD TABLE79 ADDRESS
         L     R7,0(R6)                     LOAD TABLE79 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT79                STORE RESULT79
         LA    R6,TABLE80                 LOAD TABLE80 ADDRESS
         L     R7,0(R6)                     LOAD TABLE80 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT80                STORE RESULT80
         LA    R6,TABLE81                 LOAD TABLE81 ADDRESS
         L     R7,0(R6)                     LOAD TABLE81 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT81                STORE RESULT81
         LA    R6,TABLE82                 LOAD TABLE82 ADDRESS
         L     R7,0(R6)                     LOAD TABLE82 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT82                STORE RESULT82
         LA    R6,TABLE83                 LOAD TABLE83 ADDRESS
         L     R7,0(R6)                     LOAD TABLE83 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT83                STORE RESULT83
         LA    R6,TABLE84                 LOAD TABLE84 ADDRESS
         L     R7,0(R6)                     LOAD TABLE84 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT84                STORE RESULT84
         LA    R6,TABLE85                 LOAD TABLE85 ADDRESS
         L     R7,0(R6)                     LOAD TABLE85 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT85                STORE RESULT85
         LA    R6,TABLE86                 LOAD TABLE86 ADDRESS
         L     R7,0(R6)                     LOAD TABLE86 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT86                STORE RESULT86
         LA    R6,TABLE87                 LOAD TABLE87 ADDRESS
         L     R7,0(R6)                     LOAD TABLE87 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT87                STORE RESULT87
         LA    R6,TABLE88                 LOAD TABLE88 ADDRESS
         L     R7,0(R6)                     LOAD TABLE88 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT88                STORE RESULT88
         LA    R6,TABLE89                 LOAD TABLE89 ADDRESS
         L     R7,0(R6)                     LOAD TABLE89 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT89                STORE RESULT89
         LA    R6,TABLE90                 LOAD TABLE90 ADDRESS
         L     R7,0(R6)                     LOAD TABLE90 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT90                STORE RESULT90
         LA    R6,TABLE91                 LOAD TABLE91 ADDRESS
         L     R7,0(R6)                     LOAD TABLE91 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT91                STORE RESULT91
         LA    R6,TABLE92                 LOAD TABLE92 ADDRESS
         L     R7,0(R6)                     LOAD TABLE92 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT92                STORE RESULT92
         LA    R6,TABLE93                 LOAD TABLE93 ADDRESS
         L     R7,0(R6)                     LOAD TABLE93 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT93                STORE RESULT93
         LA    R6,TABLE94                 LOAD TABLE94 ADDRESS
         L     R7,0(R6)                     LOAD TABLE94 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT94                STORE RESULT94
         LA    R6,TABLE95                 LOAD TABLE95 ADDRESS
         L     R7,0(R6)                     LOAD TABLE95 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT95                STORE RESULT95
         LA    R6,TABLE96                 LOAD TABLE96 ADDRESS
         L     R7,0(R6)                     LOAD TABLE96 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT96                STORE RESULT96
         LA    R6,TABLE97                 LOAD TABLE97 ADDRESS
         L     R7,0(R6)                     LOAD TABLE97 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT97                STORE RESULT97
         LA    R6,TABLE98                 LOAD TABLE98 ADDRESS
         L     R7,0(R6)                     LOAD TABLE98 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT98                STORE RESULT98
         LA    R6,TABLE99                 LOAD TABLE99 ADDRESS
         L     R7,0(R6)                     LOAD TABLE99 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT99                STORE RESULT99
         SPACE ,
         LA    R6,TABLE100                 LOAD TABLE100 ADDRESS
         L     R7,0(R6)                     LOAD TABLE100 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT100                STORE RESULT100
         LA    R6,TABLE101                 LOAD TABLE101 ADDRESS
         L     R7,0(R6)                     LOAD TABLE101 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT101                STORE RESULT101
         LA    R6,TABLE102                 LOAD TABLE102 ADDRESS
         L     R7,0(R6)                     LOAD TABLE102 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT102                STORE RESULT102
         LA    R6,TABLE103                 LOAD TABLE103 ADDRESS
         L     R7,0(R6)                     LOAD TABLE103 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT103                STORE RESULT103
         LA    R6,TABLE104                 LOAD TABLE104 ADDRESS
         L     R7,0(R6)                     LOAD TABLE104 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT104                STORE RESULT104
         LA    R6,TABLE105                 LOAD TABLE105 ADDRESS
         L     R7,0(R6)                     LOAD TABLE105 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT105                STORE RESULT105
         LA    R6,TABLE106                 LOAD TABLE106 ADDRESS
         L     R7,0(R6)                     LOAD TABLE106 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT106                STORE RESULT106
         LA    R6,TABLE107                 LOAD TABLE107 ADDRESS
         L     R7,0(R6)                     LOAD TABLE107 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT107                STORE RESULT107
         LA    R6,TABLE108                 LOAD TABLE108 ADDRESS
         L     R7,0(R6)                     LOAD TABLE108 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT108                STORE RESULT108
         LA    R6,TABLE109                 LOAD TABLE109 ADDRESS
         L     R7,0(R6)                     LOAD TABLE109 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT109                STORE RESULT109
         LA    R6,TABLE110                 LOAD TABLE110 ADDRESS
         L     R7,0(R6)                     LOAD TABLE110 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT110                STORE RESULT110
         LA    R6,TABLE111                 LOAD TABLE111 ADDRESS
         L     R7,0(R6)                     LOAD TABLE111 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT111                STORE RESULT111
         LA    R6,TABLE112                 LOAD TABLE112 ADDRESS
         L     R7,0(R6)                     LOAD TABLE112 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT112                STORE RESULT112
         LA    R6,TABLE113                 LOAD TABLE113 ADDRESS
         L     R7,0(R6)                     LOAD TABLE113 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT113                STORE RESULT113
         LA    R6,TABLE114                 LOAD TABLE114 ADDRESS
         L     R7,0(R6)                     LOAD TABLE114 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT114                STORE RESULT114
         LA    R6,TABLE115                 LOAD TABLE115 ADDRESS
         L     R7,0(R6)                     LOAD TABLE115 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT115                STORE RESULT115
         LA    R6,TABLE116                 LOAD TABLE116 ADDRESS
         L     R7,0(R6)                     LOAD TABLE116 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT116                STORE RESULT116
         LA    R6,TABLE117                 LOAD TABLE117 ADDRESS
         L     R7,0(R6)                     LOAD TABLE117 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT117                STORE RESULT117
         LA    R6,TABLE118                 LOAD TABLE118 ADDRESS
         L     R7,0(R6)                     LOAD TABLE118 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT118                STORE RESULT118
         LA    R6,TABLE119                 LOAD TABLE119 ADDRESS
         L     R7,0(R6)                     LOAD TABLE119 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT119                STORE RESULT119
         LA    R6,TABLE120                 LOAD TABLE120 ADDRESS
         L     R7,0(R6)                     LOAD TABLE120 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT120                STORE RESULT120
         LA    R6,TABLE121                 LOAD TABLE121 ADDRESS
         L     R7,0(R6)                     LOAD TABLE121 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT121                STORE RESULT121
         LA    R6,TABLE122                 LOAD TABLE122 ADDRESS
         L     R7,0(R6)                     LOAD TABLE122 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT122                STORE RESULT122
         LA    R6,TABLE123                 LOAD TABLE123 ADDRESS
         L     R7,0(R6)                     LOAD TABLE123 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT123                STORE RESULT123
         LA    R6,TABLE124                 LOAD TABLE124 ADDRESS
         L     R7,0(R6)                     LOAD TABLE124 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT124                STORE RESULT124
         SPACE ,
         LA    R6,TABLE125                 LOAD TABLE125 ADDRESS
         L     R7,0(R6)                     LOAD TABLE125 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT125                STORE RESULT125
         LA    R6,TABLE126                 LOAD TABLE126 ADDRESS
         L     R7,0(R6)                     LOAD TABLE126 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT126                STORE RESULT126
         LA    R6,TABLE127                 LOAD TABLE127 ADDRESS
         L     R7,0(R6)                     LOAD TABLE127 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT127                STORE RESULT127
         LA    R6,TABLE128                 LOAD TABLE128 ADDRESS
         L     R7,0(R6)                     LOAD TABLE128 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT128                STORE RESULT128
         LA    R6,TABLE129                 LOAD TABLE129 ADDRESS
         L     R7,0(R6)                     LOAD TABLE129 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT129                STORE RESULT129
         LA    R6,TABLE130                 LOAD TABLE130 ADDRESS
         L     R7,0(R6)                     LOAD TABLE130 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT130                STORE RESULT130
         LA    R6,TABLE131                 LOAD TABLE131 ADDRESS
         L     R7,0(R6)                     LOAD TABLE131 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT131                STORE RESULT131
         LA    R6,TABLE132                 LOAD TABLE132 ADDRESS
         L     R7,0(R6)                     LOAD TABLE132 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT132                STORE RESULT132
         LA    R6,TABLE133                 LOAD TABLE133 ADDRESS
         L     R7,0(R6)                     LOAD TABLE133 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT133                STORE RESULT133
         LA    R6,TABLE134                 LOAD TABLE134 ADDRESS
         L     R7,0(R6)                     LOAD TABLE134 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT134                STORE RESULT134
         LA    R6,TABLE135                 LOAD TABLE135 ADDRESS
         L     R7,0(R6)                     LOAD TABLE135 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT135                STORE RESULT135
         LA    R6,TABLE136                 LOAD TABLE136 ADDRESS
         L     R7,0(R6)                     LOAD TABLE136 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT136                STORE RESULT136
         LA    R6,TABLE137                 LOAD TABLE137 ADDRESS
         L     R7,0(R6)                     LOAD TABLE137 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT137                STORE RESULT137
         LA    R6,TABLE138                 LOAD TABLE138 ADDRESS
         L     R7,0(R6)                     LOAD TABLE138 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT138                STORE RESULT138
         LA    R6,TABLE139                 LOAD TABLE139 ADDRESS
         L     R7,0(R6)                     LOAD TABLE139 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT139                STORE RESULT139
         LA    R6,TABLE140                 LOAD TABLE140 ADDRESS
         L     R7,0(R6)                     LOAD TABLE140 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT140                STORE RESULT140
         LA    R6,TABLE141                 LOAD TABLE141 ADDRESS
         L     R7,0(R6)                     LOAD TABLE141 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT141                STORE RESULT141
         LA    R6,TABLE142                 LOAD TABLE142 ADDRESS
         L     R7,0(R6)                     LOAD TABLE142 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT142                STORE RESULT142
         LA    R6,TABLE143                 LOAD TABLE143 ADDRESS
         L     R7,0(R6)                     LOAD TABLE143 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT143                STORE RESULT143
         LA    R6,TABLE144                 LOAD TABLE144 ADDRESS
         L     R7,0(R6)                     LOAD TABLE144 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT144                STORE RESULT144
         LA    R6,TABLE145                 LOAD TABLE145 ADDRESS
         L     R7,0(R6)                     LOAD TABLE145 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT145                STORE RESULT145
         LA    R6,TABLE146                 LOAD TABLE146 ADDRESS
         L     R7,0(R6)                     LOAD TABLE146 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT146                STORE RESULT146
         LA    R6,TABLE147                 LOAD TABLE147 ADDRESS
         L     R7,0(R6)                     LOAD TABLE147 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT147                STORE RESULT147
         LA    R6,TABLE148                 LOAD TABLE148 ADDRESS
         L     R7,0(R6)                     LOAD TABLE148 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT148                STORE RESULT148
         LA    R6,TABLE149                 LOAD TABLE149 ADDRESS
         L     R7,0(R6)                     LOAD TABLE149 VALUE
         AR    R7,R6                        ADD TABLE ADDRESS
         ST    R7,RESULT149                STORE RESULT149
         SPACE ,
         SPACE ,
         BAL   R14,SUBROUT0             CALL SUBROUTINE 0
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR0                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT1             CALL SUBROUTINE 1
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR1                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT2             CALL SUBROUTINE 2
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR2                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT3             CALL SUBROUTINE 3
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR3                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT4             CALL SUBROUTINE 4
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR4                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT5             CALL SUBROUTINE 5
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR5                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT6             CALL SUBROUTINE 6
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR6                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT7             CALL SUBROUTINE 7
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR7                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT8             CALL SUBROUTINE 8
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR8                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT9             CALL SUBROUTINE 9
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR9                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT10             CALL SUBROUTINE 10
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR10                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT11             CALL SUBROUTINE 11
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR11                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT12             CALL SUBROUTINE 12
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR12                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT13             CALL SUBROUTINE 13
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR13                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT14             CALL SUBROUTINE 14
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR14                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT15             CALL SUBROUTINE 15
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR15                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT16             CALL SUBROUTINE 16
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR16                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT17             CALL SUBROUTINE 17
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR17                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT18             CALL SUBROUTINE 18
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR18                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT19             CALL SUBROUTINE 19
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR19                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT20             CALL SUBROUTINE 20
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR20                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT21             CALL SUBROUTINE 21
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR21                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT22             CALL SUBROUTINE 22
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR22                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT23             CALL SUBROUTINE 23
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR23                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT24             CALL SUBROUTINE 24
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR24                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT25             CALL SUBROUTINE 25
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR25                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT26             CALL SUBROUTINE 26
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR26                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT27             CALL SUBROUTINE 27
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR27                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT28             CALL SUBROUTINE 28
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR28                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT29             CALL SUBROUTINE 29
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR29                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT30             CALL SUBROUTINE 30
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR30                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT31             CALL SUBROUTINE 31
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR31                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT32             CALL SUBROUTINE 32
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR32                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT33             CALL SUBROUTINE 33
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR33                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT34             CALL SUBROUTINE 34
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR34                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT35             CALL SUBROUTINE 35
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR35                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT36             CALL SUBROUTINE 36
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR36                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT37             CALL SUBROUTINE 37
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR37                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT38             CALL SUBROUTINE 38
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR38                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT39             CALL SUBROUTINE 39
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR39                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT40             CALL SUBROUTINE 40
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR40                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT41             CALL SUBROUTINE 41
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR41                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT42             CALL SUBROUTINE 42
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR42                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT43             CALL SUBROUTINE 43
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR43                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT44             CALL SUBROUTINE 44
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR44                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT45             CALL SUBROUTINE 45
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR45                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT46             CALL SUBROUTINE 46
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR46                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT47             CALL SUBROUTINE 47
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR47                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT48             CALL SUBROUTINE 48
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR48                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
         BAL   R14,SUBROUT49             CALL SUBROUTINE 49
         C     R15,=F'0'                   CHECK RETURN CODE
         BNE   SUBERR49                   BRANCH IF SUBROUTINE ERROR
         SPACE ,
SUBROUT0 EQU   *                        SUBROUTINE 0
         ST    R14,SAVER140             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER140             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT1 EQU   *                        SUBROUTINE 1
         ST    R14,SAVER141             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER141             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT2 EQU   *                        SUBROUTINE 2
         ST    R14,SAVER142             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER142             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT3 EQU   *                        SUBROUTINE 3
         ST    R14,SAVER143             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER143             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT4 EQU   *                        SUBROUTINE 4
         ST    R14,SAVER144             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER144             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT5 EQU   *                        SUBROUTINE 5
         ST    R14,SAVER145             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER145             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT6 EQU   *                        SUBROUTINE 6
         ST    R14,SAVER146             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER146             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT7 EQU   *                        SUBROUTINE 7
         ST    R14,SAVER147             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER147             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT8 EQU   *                        SUBROUTINE 8
         ST    R14,SAVER148             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER148             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT9 EQU   *                        SUBROUTINE 9
         ST    R14,SAVER149             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER149             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT10 EQU   *                        SUBROUTINE 10
         ST    R14,SAVER1410             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1410             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT11 EQU   *                        SUBROUTINE 11
         ST    R14,SAVER1411             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1411             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT12 EQU   *                        SUBROUTINE 12
         ST    R14,SAVER1412             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1412             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT13 EQU   *                        SUBROUTINE 13
         ST    R14,SAVER1413             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1413             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT14 EQU   *                        SUBROUTINE 14
         ST    R14,SAVER1414             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1414             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT15 EQU   *                        SUBROUTINE 15
         ST    R14,SAVER1415             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1415             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT16 EQU   *                        SUBROUTINE 16
         ST    R14,SAVER1416             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1416             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT17 EQU   *                        SUBROUTINE 17
         ST    R14,SAVER1417             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1417             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT18 EQU   *                        SUBROUTINE 18
         ST    R14,SAVER1418             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1418             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT19 EQU   *                        SUBROUTINE 19
         ST    R14,SAVER1419             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1419             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT20 EQU   *                        SUBROUTINE 20
         ST    R14,SAVER1420             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1420             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT21 EQU   *                        SUBROUTINE 21
         ST    R14,SAVER1421             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1421             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT22 EQU   *                        SUBROUTINE 22
         ST    R14,SAVER1422             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1422             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT23 EQU   *                        SUBROUTINE 23
         ST    R14,SAVER1423             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1423             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT24 EQU   *                        SUBROUTINE 24
         ST    R14,SAVER1424             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1424             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT25 EQU   *                        SUBROUTINE 25
         ST    R14,SAVER1425             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1425             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT26 EQU   *                        SUBROUTINE 26
         ST    R14,SAVER1426             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1426             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT27 EQU   *                        SUBROUTINE 27
         ST    R14,SAVER1427             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1427             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT28 EQU   *                        SUBROUTINE 28
         ST    R14,SAVER1428             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1428             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT29 EQU   *                        SUBROUTINE 29
         ST    R14,SAVER1429             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1429             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT30 EQU   *                        SUBROUTINE 30
         ST    R14,SAVER1430             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1430             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT31 EQU   *                        SUBROUTINE 31
         ST    R14,SAVER1431             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1431             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT32 EQU   *                        SUBROUTINE 32
         ST    R14,SAVER1432             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1432             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT33 EQU   *                        SUBROUTINE 33
         ST    R14,SAVER1433             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1433             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT34 EQU   *                        SUBROUTINE 34
         ST    R14,SAVER1434             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1434             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT35 EQU   *                        SUBROUTINE 35
         ST    R14,SAVER1435             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1435             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT36 EQU   *                        SUBROUTINE 36
         ST    R14,SAVER1436             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1436             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT37 EQU   *                        SUBROUTINE 37
         ST    R14,SAVER1437             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1437             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT38 EQU   *                        SUBROUTINE 38
         ST    R14,SAVER1438             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1438             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT39 EQU   *                        SUBROUTINE 39
         ST    R14,SAVER1439             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1439             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT40 EQU   *                        SUBROUTINE 40
         ST    R14,SAVER1440             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1440             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT41 EQU   *                        SUBROUTINE 41
         ST    R14,SAVER1441             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1441             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT42 EQU   *                        SUBROUTINE 42
         ST    R14,SAVER1442             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1442             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT43 EQU   *                        SUBROUTINE 43
         ST    R14,SAVER1443             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1443             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT44 EQU   *                        SUBROUTINE 44
         ST    R14,SAVER1444             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1444             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT45 EQU   *                        SUBROUTINE 45
         ST    R14,SAVER1445             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1445             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT46 EQU   *                        SUBROUTINE 46
         ST    R14,SAVER1446             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1446             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT47 EQU   *                        SUBROUTINE 47
         ST    R14,SAVER1447             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1447             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT48 EQU   *                        SUBROUTINE 48
         ST    R14,SAVER1448             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1448             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBROUT49 EQU   *                        SUBROUTINE 49
         ST    R14,SAVER1449             SAVE RETURN ADDRESS
         LA    R15,0                        SET RETURN CODE
         L     R14,SAVER1449             RESTORE RETURN ADDRESS
         BR    R14                         RETURN
         SPACE ,
SUBERR0   EQU   *                        SUBROUTINE ERROR HANDLER 0
SUBERR1   EQU   *                        SUBROUTINE ERROR HANDLER 1
SUBERR2   EQU   *                        SUBROUTINE ERROR HANDLER 2
SUBERR3   EQU   *                        SUBROUTINE ERROR HANDLER 3
SUBERR4   EQU   *                        SUBROUTINE ERROR HANDLER 4
SUBERR5   EQU   *                        SUBROUTINE ERROR HANDLER 5
SUBERR6   EQU   *                        SUBROUTINE ERROR HANDLER 6
SUBERR7   EQU   *                        SUBROUTINE ERROR HANDLER 7
SUBERR8   EQU   *                        SUBROUTINE ERROR HANDLER 8
SUBERR9   EQU   *                        SUBROUTINE ERROR HANDLER 9
SUBERR10   EQU   *                        SUBROUTINE ERROR HANDLER 10
SUBERR11   EQU   *                        SUBROUTINE ERROR HANDLER 11
SUBERR12   EQU   *                        SUBROUTINE ERROR HANDLER 12
SUBERR13   EQU   *                        SUBROUTINE ERROR HANDLER 13
SUBERR14   EQU   *                        SUBROUTINE ERROR HANDLER 14
SUBERR15   EQU   *                        SUBROUTINE ERROR HANDLER 15
SUBERR16   EQU   *                        SUBROUTINE ERROR HANDLER 16
SUBERR17   EQU   *                        SUBROUTINE ERROR HANDLER 17
SUBERR18   EQU   *                        SUBROUTINE ERROR HANDLER 18
SUBERR19   EQU   *                        SUBROUTINE ERROR HANDLER 19
SUBERR20   EQU   *                        SUBROUTINE ERROR HANDLER 20
SUBERR21   EQU   *                        SUBROUTINE ERROR HANDLER 21
SUBERR22   EQU   *                        SUBROUTINE ERROR HANDLER 22
SUBERR23   EQU   *                        SUBROUTINE ERROR HANDLER 23
SUBERR24   EQU   *                        SUBROUTINE ERROR HANDLER 24
SUBERR25   EQU   *                        SUBROUTINE ERROR HANDLER 25
SUBERR26   EQU   *                        SUBROUTINE ERROR HANDLER 26
SUBERR27   EQU   *                        SUBROUTINE ERROR HANDLER 27
SUBERR28   EQU   *                        SUBROUTINE ERROR HANDLER 28
SUBERR29   EQU   *                        SUBROUTINE ERROR HANDLER 29
SUBERR30   EQU   *                        SUBROUTINE ERROR HANDLER 30
SUBERR31   EQU   *                        SUBROUTINE ERROR HANDLER 31
SUBERR32   EQU   *                        SUBROUTINE ERROR HANDLER 32
SUBERR33   EQU   *                        SUBROUTINE ERROR HANDLER 33
SUBERR34   EQU   *                        SUBROUTINE ERROR HANDLER 34
SUBERR35   EQU   *                        SUBROUTINE ERROR HANDLER 35
SUBERR36   EQU   *                        SUBROUTINE ERROR HANDLER 36
SUBERR37   EQU   *                        SUBROUTINE ERROR HANDLER 37
SUBERR38   EQU   *                        SUBROUTINE ERROR HANDLER 38
SUBERR39   EQU   *                        SUBROUTINE ERROR HANDLER 39
SUBERR40   EQU   *                        SUBROUTINE ERROR HANDLER 40
SUBERR41   EQU   *                        SUBROUTINE ERROR HANDLER 41
SUBERR42   EQU   *                        SUBROUTINE ERROR HANDLER 42
SUBERR43   EQU   *                        SUBROUTINE ERROR HANDLER 43
SUBERR44   EQU   *                        SUBROUTINE ERROR HANDLER 44
SUBERR45   EQU   *                        SUBROUTINE ERROR HANDLER 45
SUBERR46   EQU   *                        SUBROUTINE ERROR HANDLER 46
SUBERR47   EQU   *                        SUBROUTINE ERROR HANDLER 47
SUBERR48   EQU   *                        SUBROUTINE ERROR HANDLER 48
SUBERR49   EQU   *                        SUBROUTINE ERROR HANDLER 49
         SPACE ,
***********************************************************************
*        DATA AREA                                                    *
***********************************************************************
SAVEAREA DS    18F                      SAVE AREA
WORKAREA0 DS    F                       WORK AREA 0
WORKAREA1 DS    F                       WORK AREA 1
WORKAREA2 DS    F                       WORK AREA 2
WORKAREA3 DS    F                       WORK AREA 3
WORKAREA4 DS    F                       WORK AREA 4
WORKAREA5 DS    F                       WORK AREA 5
WORKAREA6 DS    F                       WORK AREA 6
WORKAREA7 DS    F                       WORK AREA 7
WORKAREA8 DS    F                       WORK AREA 8
WORKAREA9 DS    F                       WORK AREA 9
WORKAREA10 DS    F                       WORK AREA 10
WORKAREA11 DS    F                       WORK AREA 11
WORKAREA12 DS    F                       WORK AREA 12
WORKAREA13 DS    F                       WORK AREA 13
WORKAREA14 DS    F                       WORK AREA 14
WORKAREA15 DS    F                       WORK AREA 15
WORKAREA16 DS    F                       WORK AREA 16
WORKAREA17 DS    F                       WORK AREA 17
WORKAREA18 DS    F                       WORK AREA 18
WORKAREA19 DS    F                       WORK AREA 19
WORKAREA20 DS    F                       WORK AREA 20
WORKAREA21 DS    F                       WORK AREA 21
WORKAREA22 DS    F                       WORK AREA 22
WORKAREA23 DS    F                       WORK AREA 23
WORKAREA24 DS    F                       WORK AREA 24
WORKAREA25 DS    F                       WORK AREA 25
WORKAREA26 DS    F                       WORK AREA 26
WORKAREA27 DS    F                       WORK AREA 27
WORKAREA28 DS    F                       WORK AREA 28
WORKAREA29 DS    F                       WORK AREA 29
WORKAREA30 DS    F                       WORK AREA 30
WORKAREA31 DS    F                       WORK AREA 31
WORKAREA32 DS    F                       WORK AREA 32
WORKAREA33 DS    F                       WORK AREA 33
WORKAREA34 DS    F                       WORK AREA 34
WORKAREA35 DS    F                       WORK AREA 35
WORKAREA36 DS    F                       WORK AREA 36
WORKAREA37 DS    F                       WORK AREA 37
WORKAREA38 DS    F                       WORK AREA 38
WORKAREA39 DS    F                       WORK AREA 39
WORKAREA40 DS    F                       WORK AREA 40
WORKAREA41 DS    F                       WORK AREA 41
WORKAREA42 DS    F                       WORK AREA 42
WORKAREA43 DS    F                       WORK AREA 43
WORKAREA44 DS    F                       WORK AREA 44
WORKAREA45 DS    F                       WORK AREA 45
WORKAREA46 DS    F                       WORK AREA 46
WORKAREA47 DS    F                       WORK AREA 47
WORKAREA48 DS    F                       WORK AREA 48
WORKAREA49 DS    F                       WORK AREA 49
WORKAREA50 DS    F                       WORK AREA 50
WORKAREA51 DS    F                       WORK AREA 51
WORKAREA52 DS    F                       WORK AREA 52
WORKAREA53 DS    F                       WORK AREA 53
WORKAREA54 DS    F                       WORK AREA 54
WORKAREA55 DS    F                       WORK AREA 55
WORKAREA56 DS    F                       WORK AREA 56
WORKAREA57 DS    F                       WORK AREA 57
WORKAREA58 DS    F                       WORK AREA 58
WORKAREA59 DS    F                       WORK AREA 59
WORKAREA60 DS    F                       WORK AREA 60
WORKAREA61 DS    F                       WORK AREA 61
WORKAREA62 DS    F                       WORK AREA 62
WORKAREA63 DS    F                       WORK AREA 63
WORKAREA64 DS    F                       WORK AREA 64
WORKAREA65 DS    F                       WORK AREA 65
WORKAREA66 DS    F                       WORK AREA 66
WORKAREA67 DS    F                       WORK AREA 67
WORKAREA68 DS    F                       WORK AREA 68
WORKAREA69 DS    F                       WORK AREA 69
WORKAREA70 DS    F                       WORK AREA 70
WORKAREA71 DS    F                       WORK AREA 71
WORKAREA72 DS    F                       WORK AREA 72
WORKAREA73 DS    F                       WORK AREA 73
WORKAREA74 DS    F                       WORK AREA 74
WORKAREA75 DS    F                       WORK AREA 75
WORKAREA76 DS    F                       WORK AREA 76
WORKAREA77 DS    F                       WORK AREA 77
WORKAREA78 DS    F                       WORK AREA 78
WORKAREA79 DS    F                       WORK AREA 79
         DS    0F                       ALIGN TO FULLWORD
STORAGE0  DC    F'0'                 STORAGE 0 (VALUE 0)
STORAGE1  DC    F'10'                 STORAGE 1 (VALUE 10)
STORAGE2  DC    F'20'                 STORAGE 2 (VALUE 20)
STORAGE3  DC    F'30'                 STORAGE 3 (VALUE 30)
STORAGE4  DC    F'40'                 STORAGE 4 (VALUE 40)
STORAGE5  DC    F'50'                 STORAGE 5 (VALUE 50)
STORAGE6  DC    F'60'                 STORAGE 6 (VALUE 60)
STORAGE7  DC    F'70'                 STORAGE 7 (VALUE 70)
STORAGE8  DC    F'80'                 STORAGE 8 (VALUE 80)
STORAGE9  DC    F'90'                 STORAGE 9 (VALUE 90)
STORAGE10  DC    F'100'                 STORAGE 10 (VALUE 100)
STORAGE11  DC    F'110'                 STORAGE 11 (VALUE 110)
STORAGE12  DC    F'120'                 STORAGE 12 (VALUE 120)
STORAGE13  DC    F'130'                 STORAGE 13 (VALUE 130)
STORAGE14  DC    F'140'                 STORAGE 14 (VALUE 140)
STORAGE15  DC    F'150'                 STORAGE 15 (VALUE 150)
STORAGE16  DC    F'160'                 STORAGE 16 (VALUE 160)
STORAGE17  DC    F'170'                 STORAGE 17 (VALUE 170)
STORAGE18  DC    F'180'                 STORAGE 18 (VALUE 180)
STORAGE19  DC    F'190'                 STORAGE 19 (VALUE 190)
STORAGE20  DC    F'200'                 STORAGE 20 (VALUE 200)
STORAGE21  DC    F'210'                 STORAGE 21 (VALUE 210)
STORAGE22  DC    F'220'                 STORAGE 22 (VALUE 220)
STORAGE23  DC    F'230'                 STORAGE 23 (VALUE 230)
STORAGE24  DC    F'240'                 STORAGE 24 (VALUE 240)
STORAGE25  DC    F'250'                 STORAGE 25 (VALUE 250)
STORAGE26  DC    F'260'                 STORAGE 26 (VALUE 260)
STORAGE27  DC    F'270'                 STORAGE 27 (VALUE 270)
STORAGE28  DC    F'280'                 STORAGE 28 (VALUE 280)
STORAGE29  DC    F'290'                 STORAGE 29 (VALUE 290)
STORAGE30  DC    F'300'                 STORAGE 30 (VALUE 300)
STORAGE31  DC    F'310'                 STORAGE 31 (VALUE 310)
STORAGE32  DC    F'320'                 STORAGE 32 (VALUE 320)
STORAGE33  DC    F'330'                 STORAGE 33 (VALUE 330)
STORAGE34  DC    F'340'                 STORAGE 34 (VALUE 340)
STORAGE35  DC    F'350'                 STORAGE 35 (VALUE 350)
STORAGE36  DC    F'360'                 STORAGE 36 (VALUE 360)
STORAGE37  DC    F'370'                 STORAGE 37 (VALUE 370)
STORAGE38  DC    F'380'                 STORAGE 38 (VALUE 380)
STORAGE39  DC    F'390'                 STORAGE 39 (VALUE 390)
STORAGE40  DC    F'400'                 STORAGE 40 (VALUE 400)
STORAGE41  DC    F'410'                 STORAGE 41 (VALUE 410)
STORAGE42  DC    F'420'                 STORAGE 42 (VALUE 420)
STORAGE43  DC    F'430'                 STORAGE 43 (VALUE 430)
STORAGE44  DC    F'440'                 STORAGE 44 (VALUE 440)
STORAGE45  DC    F'450'                 STORAGE 45 (VALUE 450)
STORAGE46  DC    F'460'                 STORAGE 46 (VALUE 460)
STORAGE47  DC    F'470'                 STORAGE 47 (VALUE 470)
STORAGE48  DC    F'480'                 STORAGE 48 (VALUE 480)
STORAGE49  DC    F'490'                 STORAGE 49 (VALUE 490)
STORAGE50  DC    F'500'                 STORAGE 50 (VALUE 500)
STORAGE51  DC    F'510'                 STORAGE 51 (VALUE 510)
STORAGE52  DC    F'520'                 STORAGE 52 (VALUE 520)
STORAGE53  DC    F'530'                 STORAGE 53 (VALUE 530)
STORAGE54  DC    F'540'                 STORAGE 54 (VALUE 540)
STORAGE55  DC    F'550'                 STORAGE 55 (VALUE 550)
STORAGE56  DC    F'560'                 STORAGE 56 (VALUE 560)
STORAGE57  DC    F'570'                 STORAGE 57 (VALUE 570)
STORAGE58  DC    F'580'                 STORAGE 58 (VALUE 580)
STORAGE59  DC    F'590'                 STORAGE 59 (VALUE 590)
STORAGE60  DC    F'600'                 STORAGE 60 (VALUE 600)
STORAGE61  DC    F'610'                 STORAGE 61 (VALUE 610)
STORAGE62  DC    F'620'                 STORAGE 62 (VALUE 620)
STORAGE63  DC    F'630'                 STORAGE 63 (VALUE 630)
STORAGE64  DC    F'640'                 STORAGE 64 (VALUE 640)
STORAGE65  DC    F'650'                 STORAGE 65 (VALUE 650)
STORAGE66  DC    F'660'                 STORAGE 66 (VALUE 660)
STORAGE67  DC    F'670'                 STORAGE 67 (VALUE 670)
STORAGE68  DC    F'680'                 STORAGE 68 (VALUE 680)
STORAGE69  DC    F'690'                 STORAGE 69 (VALUE 690)
STORAGE70  DC    F'700'                 STORAGE 70 (VALUE 700)
STORAGE71  DC    F'710'                 STORAGE 71 (VALUE 710)
STORAGE72  DC    F'720'                 STORAGE 72 (VALUE 720)
STORAGE73  DC    F'730'                 STORAGE 73 (VALUE 730)
STORAGE74  DC    F'740'                 STORAGE 74 (VALUE 740)
STORAGE75  DC    F'750'                 STORAGE 75 (VALUE 750)
STORAGE76  DC    F'760'                 STORAGE 76 (VALUE 760)
STORAGE77  DC    F'770'                 STORAGE 77 (VALUE 770)
STORAGE78  DC    F'780'                 STORAGE 78 (VALUE 780)
STORAGE79  DC    F'790'                 STORAGE 79 (VALUE 790)
STORAGE80  DC    F'800'                 STORAGE 80 (VALUE 800)
STORAGE81  DC    F'810'                 STORAGE 81 (VALUE 810)
STORAGE82  DC    F'820'                 STORAGE 82 (VALUE 820)
STORAGE83  DC    F'830'                 STORAGE 83 (VALUE 830)
STORAGE84  DC    F'840'                 STORAGE 84 (VALUE 840)
STORAGE85  DC    F'850'                 STORAGE 85 (VALUE 850)
STORAGE86  DC    F'860'                 STORAGE 86 (VALUE 860)
STORAGE87  DC    F'870'                 STORAGE 87 (VALUE 870)
STORAGE88  DC    F'880'                 STORAGE 88 (VALUE 880)
STORAGE89  DC    F'890'                 STORAGE 89 (VALUE 890)
STORAGE90  DC    F'900'                 STORAGE 90 (VALUE 900)
STORAGE91  DC    F'910'                 STORAGE 91 (VALUE 910)
STORAGE92  DC    F'920'                 STORAGE 92 (VALUE 920)
STORAGE93  DC    F'930'                 STORAGE 93 (VALUE 930)
STORAGE94  DC    F'940'                 STORAGE 94 (VALUE 940)
STORAGE95  DC    F'950'                 STORAGE 95 (VALUE 950)
STORAGE96  DC    F'960'                 STORAGE 96 (VALUE 960)
STORAGE97  DC    F'970'                 STORAGE 97 (VALUE 970)
STORAGE98  DC    F'980'                 STORAGE 98 (VALUE 980)
STORAGE99  DC    F'990'                 STORAGE 99 (VALUE 990)
STORAGE100  DC    F'1000'                 STORAGE 100 (VALUE 1000)
STORAGE101  DC    F'1010'                 STORAGE 101 (VALUE 1010)
STORAGE102  DC    F'1020'                 STORAGE 102 (VALUE 1020)
STORAGE103  DC    F'1030'                 STORAGE 103 (VALUE 1030)
STORAGE104  DC    F'1040'                 STORAGE 104 (VALUE 1040)
STORAGE105  DC    F'1050'                 STORAGE 105 (VALUE 1050)
STORAGE106  DC    F'1060'                 STORAGE 106 (VALUE 1060)
STORAGE107  DC    F'1070'                 STORAGE 107 (VALUE 1070)
STORAGE108  DC    F'1080'                 STORAGE 108 (VALUE 1080)
STORAGE109  DC    F'1090'                 STORAGE 109 (VALUE 1090)
STORAGE110  DC    F'1100'                 STORAGE 110 (VALUE 1100)
STORAGE111  DC    F'1110'                 STORAGE 111 (VALUE 1110)
STORAGE112  DC    F'1120'                 STORAGE 112 (VALUE 1120)
STORAGE113  DC    F'1130'                 STORAGE 113 (VALUE 1130)
STORAGE114  DC    F'1140'                 STORAGE 114 (VALUE 1140)
STORAGE115  DC    F'1150'                 STORAGE 115 (VALUE 1150)
STORAGE116  DC    F'1160'                 STORAGE 116 (VALUE 1160)
STORAGE117  DC    F'1170'                 STORAGE 117 (VALUE 1170)
STORAGE118  DC    F'1180'                 STORAGE 118 (VALUE 1180)
STORAGE119  DC    F'1190'                 STORAGE 119 (VALUE 1190)
STORAGE120  DC    F'1200'                 STORAGE 120 (VALUE 1200)
STORAGE121  DC    F'1210'                 STORAGE 121 (VALUE 1210)
STORAGE122  DC    F'1220'                 STORAGE 122 (VALUE 1220)
STORAGE123  DC    F'1230'                 STORAGE 123 (VALUE 1230)
STORAGE124  DC    F'1240'                 STORAGE 124 (VALUE 1240)
STORAGE125  DC    F'1250'                 STORAGE 125 (VALUE 1250)
STORAGE126  DC    F'1260'                 STORAGE 126 (VALUE 1260)
STORAGE127  DC    F'1270'                 STORAGE 127 (VALUE 1270)
STORAGE128  DC    F'1280'                 STORAGE 128 (VALUE 1280)
STORAGE129  DC    F'1290'                 STORAGE 129 (VALUE 1290)
STORAGE130  DC    F'1300'                 STORAGE 130 (VALUE 1300)
STORAGE131  DC    F'1310'                 STORAGE 131 (VALUE 1310)
STORAGE132  DC    F'1320'                 STORAGE 132 (VALUE 1320)
STORAGE133  DC    F'1330'                 STORAGE 133 (VALUE 1330)
STORAGE134  DC    F'1340'                 STORAGE 134 (VALUE 1340)
STORAGE135  DC    F'1350'                 STORAGE 135 (VALUE 1350)
STORAGE136  DC    F'1360'                 STORAGE 136 (VALUE 1360)
STORAGE137  DC    F'1370'                 STORAGE 137 (VALUE 1370)
STORAGE138  DC    F'1380'                 STORAGE 138 (VALUE 1380)
STORAGE139  DC    F'1390'                 STORAGE 139 (VALUE 1390)
STORAGE140  DC    F'1400'                 STORAGE 140 (VALUE 1400)
STORAGE141  DC    F'1410'                 STORAGE 141 (VALUE 1410)
STORAGE142  DC    F'1420'                 STORAGE 142 (VALUE 1420)
STORAGE143  DC    F'1430'                 STORAGE 143 (VALUE 1430)
STORAGE144  DC    F'1440'                 STORAGE 144 (VALUE 1440)
STORAGE145  DC    F'1450'                 STORAGE 145 (VALUE 1450)
STORAGE146  DC    F'1460'                 STORAGE 146 (VALUE 1460)
STORAGE147  DC    F'1470'                 STORAGE 147 (VALUE 1470)
STORAGE148  DC    F'1480'                 STORAGE 148 (VALUE 1480)
STORAGE149  DC    F'1490'                 STORAGE 149 (VALUE 1490)
STORAGE150  DC    F'1500'                 STORAGE 150 (VALUE 1500)
STORAGE151  DC    F'1510'                 STORAGE 151 (VALUE 1510)
STORAGE152  DC    F'1520'                 STORAGE 152 (VALUE 1520)
STORAGE153  DC    F'1530'                 STORAGE 153 (VALUE 1530)
STORAGE154  DC    F'1540'                 STORAGE 154 (VALUE 1540)
STORAGE155  DC    F'1550'                 STORAGE 155 (VALUE 1550)
STORAGE156  DC    F'1560'                 STORAGE 156 (VALUE 1560)
STORAGE157  DC    F'1570'                 STORAGE 157 (VALUE 1570)
STORAGE158  DC    F'1580'                 STORAGE 158 (VALUE 1580)
STORAGE159  DC    F'1590'                 STORAGE 159 (VALUE 1590)
STORAGE160  DC    F'1600'                 STORAGE 160 (VALUE 1600)
STORAGE161  DC    F'1610'                 STORAGE 161 (VALUE 1610)
STORAGE162  DC    F'1620'                 STORAGE 162 (VALUE 1620)
STORAGE163  DC    F'1630'                 STORAGE 163 (VALUE 1630)
STORAGE164  DC    F'1640'                 STORAGE 164 (VALUE 1640)
STORAGE165  DC    F'1650'                 STORAGE 165 (VALUE 1650)
STORAGE166  DC    F'1660'                 STORAGE 166 (VALUE 1660)
STORAGE167  DC    F'1670'                 STORAGE 167 (VALUE 1670)
STORAGE168  DC    F'1680'                 STORAGE 168 (VALUE 1680)
STORAGE169  DC    F'1690'                 STORAGE 169 (VALUE 1690)
STORAGE170  DC    F'1700'                 STORAGE 170 (VALUE 1700)
STORAGE171  DC    F'1710'                 STORAGE 171 (VALUE 1710)
STORAGE172  DC    F'1720'                 STORAGE 172 (VALUE 1720)
STORAGE173  DC    F'1730'                 STORAGE 173 (VALUE 1730)
STORAGE174  DC    F'1740'                 STORAGE 174 (VALUE 1740)
STORAGE175  DC    F'1750'                 STORAGE 175 (VALUE 1750)
STORAGE176  DC    F'1760'                 STORAGE 176 (VALUE 1760)
STORAGE177  DC    F'1770'                 STORAGE 177 (VALUE 1770)
STORAGE178  DC    F'1780'                 STORAGE 178 (VALUE 1780)
STORAGE179  DC    F'1790'                 STORAGE 179 (VALUE 1790)
STORAGE180  DC    F'1800'                 STORAGE 180 (VALUE 1800)
STORAGE181  DC    F'1810'                 STORAGE 181 (VALUE 1810)
STORAGE182  DC    F'1820'                 STORAGE 182 (VALUE 1820)
STORAGE183  DC    F'1830'                 STORAGE 183 (VALUE 1830)
STORAGE184  DC    F'1840'                 STORAGE 184 (VALUE 1840)
STORAGE185  DC    F'1850'                 STORAGE 185 (VALUE 1850)
STORAGE186  DC    F'1860'                 STORAGE 186 (VALUE 1860)
STORAGE187  DC    F'1870'                 STORAGE 187 (VALUE 1870)
STORAGE188  DC    F'1880'                 STORAGE 188 (VALUE 1880)
STORAGE189  DC    F'1890'                 STORAGE 189 (VALUE 1890)
STORAGE190  DC    F'1900'                 STORAGE 190 (VALUE 1900)
STORAGE191  DC    F'1910'                 STORAGE 191 (VALUE 1910)
STORAGE192  DC    F'1920'                 STORAGE 192 (VALUE 1920)
STORAGE193  DC    F'1930'                 STORAGE 193 (VALUE 1930)
STORAGE194  DC    F'1940'                 STORAGE 194 (VALUE 1940)
STORAGE195  DC    F'1950'                 STORAGE 195 (VALUE 1950)
STORAGE196  DC    F'1960'                 STORAGE 196 (VALUE 1960)
STORAGE197  DC    F'1970'                 STORAGE 197 (VALUE 1970)
STORAGE198  DC    F'1980'                 STORAGE 198 (VALUE 1980)
STORAGE199  DC    F'1990'                 STORAGE 199 (VALUE 1990)
FLAG0     DC    X'00'                    FLAG BYTE 0
FLAG1     DC    X'00'                    FLAG BYTE 1
FLAG2     DC    X'00'                    FLAG BYTE 2
FLAG3     DC    X'00'                    FLAG BYTE 3
FLAG4     DC    X'00'                    FLAG BYTE 4
FLAG5     DC    X'00'                    FLAG BYTE 5
FLAG6     DC    X'00'                    FLAG BYTE 6
FLAG7     DC    X'00'                    FLAG BYTE 7
FLAG8     DC    X'00'                    FLAG BYTE 8
FLAG9     DC    X'00'                    FLAG BYTE 9
FLAG10     DC    X'00'                    FLAG BYTE 10
FLAG11     DC    X'00'                    FLAG BYTE 11
FLAG12     DC    X'00'                    FLAG BYTE 12
FLAG13     DC    X'00'                    FLAG BYTE 13
FLAG14     DC    X'00'                    FLAG BYTE 14
FLAG15     DC    X'00'                    FLAG BYTE 15
FLAG16     DC    X'00'                    FLAG BYTE 16
FLAG17     DC    X'00'                    FLAG BYTE 17
FLAG18     DC    X'00'                    FLAG BYTE 18
FLAG19     DC    X'00'                    FLAG BYTE 19
FLAG20     DC    X'00'                    FLAG BYTE 20
FLAG21     DC    X'00'                    FLAG BYTE 21
FLAG22     DC    X'00'                    FLAG BYTE 22
FLAG23     DC    X'00'                    FLAG BYTE 23
FLAG24     DC    X'00'                    FLAG BYTE 24
FLAG25     DC    X'00'                    FLAG BYTE 25
FLAG26     DC    X'00'                    FLAG BYTE 26
FLAG27     DC    X'00'                    FLAG BYTE 27
FLAG28     DC    X'00'                    FLAG BYTE 28
FLAG29     DC    X'00'                    FLAG BYTE 29
FLAG30     DC    X'00'                    FLAG BYTE 30
FLAG31     DC    X'00'                    FLAG BYTE 31
FLAG32     DC    X'00'                    FLAG BYTE 32
FLAG33     DC    X'00'                    FLAG BYTE 33
FLAG34     DC    X'00'                    FLAG BYTE 34
FLAG35     DC    X'00'                    FLAG BYTE 35
FLAG36     DC    X'00'                    FLAG BYTE 36
FLAG37     DC    X'00'                    FLAG BYTE 37
FLAG38     DC    X'00'                    FLAG BYTE 38
FLAG39     DC    X'00'                    FLAG BYTE 39
FLAG40     DC    X'00'                    FLAG BYTE 40
FLAG41     DC    X'00'                    FLAG BYTE 41
FLAG42     DC    X'00'                    FLAG BYTE 42
FLAG43     DC    X'00'                    FLAG BYTE 43
FLAG44     DC    X'00'                    FLAG BYTE 44
FLAG45     DC    X'00'                    FLAG BYTE 45
FLAG46     DC    X'00'                    FLAG BYTE 46
FLAG47     DC    X'00'                    FLAG BYTE 47
FLAG48     DC    X'00'                    FLAG BYTE 48
FLAG49     DC    X'00'                    FLAG BYTE 49
FLAG50     DC    X'00'                    FLAG BYTE 50
FLAG51     DC    X'00'                    FLAG BYTE 51
FLAG52     DC    X'00'                    FLAG BYTE 52
FLAG53     DC    X'00'                    FLAG BYTE 53
FLAG54     DC    X'00'                    FLAG BYTE 54
FLAG55     DC    X'00'                    FLAG BYTE 55
FLAG56     DC    X'00'                    FLAG BYTE 56
FLAG57     DC    X'00'                    FLAG BYTE 57
FLAG58     DC    X'00'                    FLAG BYTE 58
FLAG59     DC    X'00'                    FLAG BYTE 59
FLAG60     DC    X'00'                    FLAG BYTE 60
FLAG61     DC    X'00'                    FLAG BYTE 61
FLAG62     DC    X'00'                    FLAG BYTE 62
FLAG63     DC    X'00'                    FLAG BYTE 63
FLAG64     DC    X'00'                    FLAG BYTE 64
FLAG65     DC    X'00'                    FLAG BYTE 65
FLAG66     DC    X'00'                    FLAG BYTE 66
FLAG67     DC    X'00'                    FLAG BYTE 67
FLAG68     DC    X'00'                    FLAG BYTE 68
FLAG69     DC    X'00'                    FLAG BYTE 69
FLAG70     DC    X'00'                    FLAG BYTE 70
FLAG71     DC    X'00'                    FLAG BYTE 71
FLAG72     DC    X'00'                    FLAG BYTE 72
FLAG73     DC    X'00'                    FLAG BYTE 73
FLAG74     DC    X'00'                    FLAG BYTE 74
FLAG75     DC    X'00'                    FLAG BYTE 75
FLAG76     DC    X'00'                    FLAG BYTE 76
FLAG77     DC    X'00'                    FLAG BYTE 77
FLAG78     DC    X'00'                    FLAG BYTE 78
FLAG79     DC    X'00'                    FLAG BYTE 79
FLAG80     DC    X'00'                    FLAG BYTE 80
FLAG81     DC    X'00'                    FLAG BYTE 81
FLAG82     DC    X'00'                    FLAG BYTE 82
FLAG83     DC    X'00'                    FLAG BYTE 83
FLAG84     DC    X'00'                    FLAG BYTE 84
FLAG85     DC    X'00'                    FLAG BYTE 85
FLAG86     DC    X'00'                    FLAG BYTE 86
FLAG87     DC    X'00'                    FLAG BYTE 87
FLAG88     DC    X'00'                    FLAG BYTE 88
FLAG89     DC    X'00'                    FLAG BYTE 89
FLAG90     DC    X'00'                    FLAG BYTE 90
FLAG91     DC    X'00'                    FLAG BYTE 91
FLAG92     DC    X'00'                    FLAG BYTE 92
FLAG93     DC    X'00'                    FLAG BYTE 93
FLAG94     DC    X'00'                    FLAG BYTE 94
FLAG95     DC    X'00'                    FLAG BYTE 95
FLAG96     DC    X'00'                    FLAG BYTE 96
FLAG97     DC    X'00'                    FLAG BYTE 97
FLAG98     DC    X'00'                    FLAG BYTE 98
FLAG99     DC    X'00'                    FLAG BYTE 99
TABLE0    DC    F'0'                   TABLE ENTRY 0
TABLE1    DC    F'1'                   TABLE ENTRY 1
TABLE2    DC    F'2'                   TABLE ENTRY 2
TABLE3    DC    F'3'                   TABLE ENTRY 3
TABLE4    DC    F'4'                   TABLE ENTRY 4
TABLE5    DC    F'5'                   TABLE ENTRY 5
TABLE6    DC    F'6'                   TABLE ENTRY 6
TABLE7    DC    F'7'                   TABLE ENTRY 7
TABLE8    DC    F'8'                   TABLE ENTRY 8
TABLE9    DC    F'9'                   TABLE ENTRY 9
TABLE10    DC    F'10'                   TABLE ENTRY 10
TABLE11    DC    F'11'                   TABLE ENTRY 11
TABLE12    DC    F'12'                   TABLE ENTRY 12
TABLE13    DC    F'13'                   TABLE ENTRY 13
TABLE14    DC    F'14'                   TABLE ENTRY 14
TABLE15    DC    F'15'                   TABLE ENTRY 15
TABLE16    DC    F'16'                   TABLE ENTRY 16
TABLE17    DC    F'17'                   TABLE ENTRY 17
TABLE18    DC    F'18'                   TABLE ENTRY 18
TABLE19    DC    F'19'                   TABLE ENTRY 19
TABLE20    DC    F'20'                   TABLE ENTRY 20
TABLE21    DC    F'21'                   TABLE ENTRY 21
TABLE22    DC    F'22'                   TABLE ENTRY 22
TABLE23    DC    F'23'                   TABLE ENTRY 23
TABLE24    DC    F'24'                   TABLE ENTRY 24
TABLE25    DC    F'25'                   TABLE ENTRY 25
TABLE26    DC    F'26'                   TABLE ENTRY 26
TABLE27    DC    F'27'                   TABLE ENTRY 27
TABLE28    DC    F'28'                   TABLE ENTRY 28
TABLE29    DC    F'29'                   TABLE ENTRY 29
TABLE30    DC    F'30'                   TABLE ENTRY 30
TABLE31    DC    F'31'                   TABLE ENTRY 31
TABLE32    DC    F'32'                   TABLE ENTRY 32
TABLE33    DC    F'33'                   TABLE ENTRY 33
TABLE34    DC    F'34'                   TABLE ENTRY 34
TABLE35    DC    F'35'                   TABLE ENTRY 35
TABLE36    DC    F'36'                   TABLE ENTRY 36
TABLE37    DC    F'37'                   TABLE ENTRY 37
TABLE38    DC    F'38'                   TABLE ENTRY 38
TABLE39    DC    F'39'                   TABLE ENTRY 39
TABLE40    DC    F'40'                   TABLE ENTRY 40
TABLE41    DC    F'41'                   TABLE ENTRY 41
TABLE42    DC    F'42'                   TABLE ENTRY 42
TABLE43    DC    F'43'                   TABLE ENTRY 43
TABLE44    DC    F'44'                   TABLE ENTRY 44
TABLE45    DC    F'45'                   TABLE ENTRY 45
TABLE46    DC    F'46'                   TABLE ENTRY 46
TABLE47    DC    F'47'                   TABLE ENTRY 47
TABLE48    DC    F'48'                   TABLE ENTRY 48
TABLE49    DC    F'49'                   TABLE ENTRY 49
TABLE50    DC    F'50'                   TABLE ENTRY 50
TABLE51    DC    F'51'                   TABLE ENTRY 51
TABLE52    DC    F'52'                   TABLE ENTRY 52
TABLE53    DC    F'53'                   TABLE ENTRY 53
TABLE54    DC    F'54'                   TABLE ENTRY 54
TABLE55    DC    F'55'                   TABLE ENTRY 55
TABLE56    DC    F'56'                   TABLE ENTRY 56
TABLE57    DC    F'57'                   TABLE ENTRY 57
TABLE58    DC    F'58'                   TABLE ENTRY 58
TABLE59    DC    F'59'                   TABLE ENTRY 59
TABLE60    DC    F'60'                   TABLE ENTRY 60
TABLE61    DC    F'61'                   TABLE ENTRY 61
TABLE62    DC    F'62'                   TABLE ENTRY 62
TABLE63    DC    F'63'                   TABLE ENTRY 63
TABLE64    DC    F'64'                   TABLE ENTRY 64
TABLE65    DC    F'65'                   TABLE ENTRY 65
TABLE66    DC    F'66'                   TABLE ENTRY 66
TABLE67    DC    F'67'                   TABLE ENTRY 67
TABLE68    DC    F'68'                   TABLE ENTRY 68
TABLE69    DC    F'69'                   TABLE ENTRY 69
TABLE70    DC    F'70'                   TABLE ENTRY 70
TABLE71    DC    F'71'                   TABLE ENTRY 71
TABLE72    DC    F'72'                   TABLE ENTRY 72
TABLE73    DC    F'73'                   TABLE ENTRY 73
TABLE74    DC    F'74'                   TABLE ENTRY 74
TABLE75    DC    F'75'                   TABLE ENTRY 75
TABLE76    DC    F'76'                   TABLE ENTRY 76
TABLE77    DC    F'77'                   TABLE ENTRY 77
TABLE78    DC    F'78'                   TABLE ENTRY 78
TABLE79    DC    F'79'                   TABLE ENTRY 79
TABLE80    DC    F'80'                   TABLE ENTRY 80
TABLE81    DC    F'81'                   TABLE ENTRY 81
TABLE82    DC    F'82'                   TABLE ENTRY 82
TABLE83    DC    F'83'                   TABLE ENTRY 83
TABLE84    DC    F'84'                   TABLE ENTRY 84
TABLE85    DC    F'85'                   TABLE ENTRY 85
TABLE86    DC    F'86'                   TABLE ENTRY 86
TABLE87    DC    F'87'                   TABLE ENTRY 87
TABLE88    DC    F'88'                   TABLE ENTRY 88
TABLE89    DC    F'89'                   TABLE ENTRY 89
TABLE90    DC    F'90'                   TABLE ENTRY 90
TABLE91    DC    F'91'                   TABLE ENTRY 91
TABLE92    DC    F'92'                   TABLE ENTRY 92
TABLE93    DC    F'93'                   TABLE ENTRY 93
TABLE94    DC    F'94'                   TABLE ENTRY 94
TABLE95    DC    F'95'                   TABLE ENTRY 95
TABLE96    DC    F'96'                   TABLE ENTRY 96
TABLE97    DC    F'97'                   TABLE ENTRY 97
TABLE98    DC    F'98'                   TABLE ENTRY 98
TABLE99    DC    F'99'                   TABLE ENTRY 99
TABLE100    DC    F'100'                   TABLE ENTRY 100
TABLE101    DC    F'101'                   TABLE ENTRY 101
TABLE102    DC    F'102'                   TABLE ENTRY 102
TABLE103    DC    F'103'                   TABLE ENTRY 103
TABLE104    DC    F'104'                   TABLE ENTRY 104
TABLE105    DC    F'105'                   TABLE ENTRY 105
TABLE106    DC    F'106'                   TABLE ENTRY 106
TABLE107    DC    F'107'                   TABLE ENTRY 107
TABLE108    DC    F'108'                   TABLE ENTRY 108
TABLE109    DC    F'109'                   TABLE ENTRY 109
TABLE110    DC    F'110'                   TABLE ENTRY 110
TABLE111    DC    F'111'                   TABLE ENTRY 111
TABLE112    DC    F'112'                   TABLE ENTRY 112
TABLE113    DC    F'113'                   TABLE ENTRY 113
TABLE114    DC    F'114'                   TABLE ENTRY 114
TABLE115    DC    F'115'                   TABLE ENTRY 115
TABLE116    DC    F'116'                   TABLE ENTRY 116
TABLE117    DC    F'117'                   TABLE ENTRY 117
TABLE118    DC    F'118'                   TABLE ENTRY 118
TABLE119    DC    F'119'                   TABLE ENTRY 119
TABLE120    DC    F'120'                   TABLE ENTRY 120
TABLE121    DC    F'121'                   TABLE ENTRY 121
TABLE122    DC    F'122'                   TABLE ENTRY 122
TABLE123    DC    F'123'                   TABLE ENTRY 123
TABLE124    DC    F'124'                   TABLE ENTRY 124
TABLE125    DC    F'125'                   TABLE ENTRY 125
TABLE126    DC    F'126'                   TABLE ENTRY 126
TABLE127    DC    F'127'                   TABLE ENTRY 127
TABLE128    DC    F'128'                   TABLE ENTRY 128
TABLE129    DC    F'129'                   TABLE ENTRY 129
TABLE130    DC    F'130'                   TABLE ENTRY 130
TABLE131    DC    F'131'                   TABLE ENTRY 131
TABLE132    DC    F'132'                   TABLE ENTRY 132
TABLE133    DC    F'133'                   TABLE ENTRY 133
TABLE134    DC    F'134'                   TABLE ENTRY 134
TABLE135    DC    F'135'                   TABLE ENTRY 135
TABLE136    DC    F'136'                   TABLE ENTRY 136
TABLE137    DC    F'137'                   TABLE ENTRY 137
TABLE138    DC    F'138'                   TABLE ENTRY 138
TABLE139    DC    F'139'                   TABLE ENTRY 139
TABLE140    DC    F'140'                   TABLE ENTRY 140
TABLE141    DC    F'141'                   TABLE ENTRY 141
TABLE142    DC    F'142'                   TABLE ENTRY 142
TABLE143    DC    F'143'                   TABLE ENTRY 143
TABLE144    DC    F'144'                   TABLE ENTRY 144
TABLE145    DC    F'145'                   TABLE ENTRY 145
TABLE146    DC    F'146'                   TABLE ENTRY 146
TABLE147    DC    F'147'                   TABLE ENTRY 147
TABLE148    DC    F'148'                   TABLE ENTRY 148
TABLE149    DC    F'149'                   TABLE ENTRY 149
RESULT0   DC    F'0'                    RESULT 0
RESULT1   DC    F'0'                    RESULT 1
RESULT2   DC    F'0'                    RESULT 2
RESULT3   DC    F'0'                    RESULT 3
RESULT4   DC    F'0'                    RESULT 4
RESULT5   DC    F'0'                    RESULT 5
RESULT6   DC    F'0'                    RESULT 6
RESULT7   DC    F'0'                    RESULT 7
RESULT8   DC    F'0'                    RESULT 8
RESULT9   DC    F'0'                    RESULT 9
RESULT10   DC    F'0'                    RESULT 10
RESULT11   DC    F'0'                    RESULT 11
RESULT12   DC    F'0'                    RESULT 12
RESULT13   DC    F'0'                    RESULT 13
RESULT14   DC    F'0'                    RESULT 14
RESULT15   DC    F'0'                    RESULT 15
RESULT16   DC    F'0'                    RESULT 16
RESULT17   DC    F'0'                    RESULT 17
RESULT18   DC    F'0'                    RESULT 18
RESULT19   DC    F'0'                    RESULT 19
RESULT20   DC    F'0'                    RESULT 20
RESULT21   DC    F'0'                    RESULT 21
RESULT22   DC    F'0'                    RESULT 22
RESULT23   DC    F'0'                    RESULT 23
RESULT24   DC    F'0'                    RESULT 24
RESULT25   DC    F'0'                    RESULT 25
RESULT26   DC    F'0'                    RESULT 26
RESULT27   DC    F'0'                    RESULT 27
RESULT28   DC    F'0'                    RESULT 28
RESULT29   DC    F'0'                    RESULT 29
RESULT30   DC    F'0'                    RESULT 30
RESULT31   DC    F'0'                    RESULT 31
RESULT32   DC    F'0'                    RESULT 32
RESULT33   DC    F'0'                    RESULT 33
RESULT34   DC    F'0'                    RESULT 34
RESULT35   DC    F'0'                    RESULT 35
RESULT36   DC    F'0'                    RESULT 36
RESULT37   DC    F'0'                    RESULT 37
RESULT38   DC    F'0'                    RESULT 38
RESULT39   DC    F'0'                    RESULT 39
RESULT40   DC    F'0'                    RESULT 40
RESULT41   DC    F'0'                    RESULT 41
RESULT42   DC    F'0'                    RESULT 42
RESULT43   DC    F'0'                    RESULT 43
RESULT44   DC    F'0'                    RESULT 44
RESULT45   DC    F'0'                    RESULT 45
RESULT46   DC    F'0'                    RESULT 46
RESULT47   DC    F'0'                    RESULT 47
RESULT48   DC    F'0'                    RESULT 48
RESULT49   DC    F'0'                    RESULT 49
RESULT50   DC    F'0'                    RESULT 50
RESULT51   DC    F'0'                    RESULT 51
RESULT52   DC    F'0'                    RESULT 52
RESULT53   DC    F'0'                    RESULT 53
RESULT54   DC    F'0'                    RESULT 54
RESULT55   DC    F'0'                    RESULT 55
RESULT56   DC    F'0'                    RESULT 56
RESULT57   DC    F'0'                    RESULT 57
RESULT58   DC    F'0'                    RESULT 58
RESULT59   DC    F'0'                    RESULT 59
RESULT60   DC    F'0'                    RESULT 60
RESULT61   DC    F'0'                    RESULT 61
RESULT62   DC    F'0'                    RESULT 62
RESULT63   DC    F'0'                    RESULT 63
RESULT64   DC    F'0'                    RESULT 64
RESULT65   DC    F'0'                    RESULT 65
RESULT66   DC    F'0'                    RESULT 66
RESULT67   DC    F'0'                    RESULT 67
RESULT68   DC    F'0'                    RESULT 68
RESULT69   DC    F'0'                    RESULT 69
RESULT70   DC    F'0'                    RESULT 70
RESULT71   DC    F'0'                    RESULT 71
RESULT72   DC    F'0'                    RESULT 72
RESULT73   DC    F'0'                    RESULT 73
RESULT74   DC    F'0'                    RESULT 74
RESULT75   DC    F'0'                    RESULT 75
RESULT76   DC    F'0'                    RESULT 76
RESULT77   DC    F'0'                    RESULT 77
RESULT78   DC    F'0'                    RESULT 78
RESULT79   DC    F'0'                    RESULT 79
RESULT80   DC    F'0'                    RESULT 80
RESULT81   DC    F'0'                    RESULT 81
RESULT82   DC    F'0'                    RESULT 82
RESULT83   DC    F'0'                    RESULT 83
RESULT84   DC    F'0'                    RESULT 84
RESULT85   DC    F'0'                    RESULT 85
RESULT86   DC    F'0'                    RESULT 86
RESULT87   DC    F'0'                    RESULT 87
RESULT88   DC    F'0'                    RESULT 88
RESULT89   DC    F'0'                    RESULT 89
RESULT90   DC    F'0'                    RESULT 90
RESULT91   DC    F'0'                    RESULT 91
RESULT92   DC    F'0'                    RESULT 92
RESULT93   DC    F'0'                    RESULT 93
RESULT94   DC    F'0'                    RESULT 94
RESULT95   DC    F'0'                    RESULT 95
RESULT96   DC    F'0'                    RESULT 96
RESULT97   DC    F'0'                    RESULT 97
RESULT98   DC    F'0'                    RESULT 98
RESULT99   DC    F'0'                    RESULT 99
RESULT100   DC    F'0'                    RESULT 100
RESULT101   DC    F'0'                    RESULT 101
RESULT102   DC    F'0'                    RESULT 102
RESULT103   DC    F'0'                    RESULT 103
RESULT104   DC    F'0'                    RESULT 104
RESULT105   DC    F'0'                    RESULT 105
RESULT106   DC    F'0'                    RESULT 106
RESULT107   DC    F'0'                    RESULT 107
RESULT108   DC    F'0'                    RESULT 108
RESULT109   DC    F'0'                    RESULT 109
RESULT110   DC    F'0'                    RESULT 110
RESULT111   DC    F'0'                    RESULT 111
RESULT112   DC    F'0'                    RESULT 112
RESULT113   DC    F'0'                    RESULT 113
RESULT114   DC    F'0'                    RESULT 114
RESULT115   DC    F'0'                    RESULT 115
RESULT116   DC    F'0'                    RESULT 116
RESULT117   DC    F'0'                    RESULT 117
RESULT118   DC    F'0'                    RESULT 118
RESULT119   DC    F'0'                    RESULT 119
RESULT120   DC    F'0'                    RESULT 120
RESULT121   DC    F'0'                    RESULT 121
RESULT122   DC    F'0'                    RESULT 122
RESULT123   DC    F'0'                    RESULT 123
RESULT124   DC    F'0'                    RESULT 124
RESULT125   DC    F'0'                    RESULT 125
RESULT126   DC    F'0'                    RESULT 126
RESULT127   DC    F'0'                    RESULT 127
RESULT128   DC    F'0'                    RESULT 128
RESULT129   DC    F'0'                    RESULT 129
RESULT130   DC    F'0'                    RESULT 130
RESULT131   DC    F'0'                    RESULT 131
RESULT132   DC    F'0'                    RESULT 132
RESULT133   DC    F'0'                    RESULT 133
RESULT134   DC    F'0'                    RESULT 134
RESULT135   DC    F'0'                    RESULT 135
RESULT136   DC    F'0'                    RESULT 136
RESULT137   DC    F'0'                    RESULT 137
RESULT138   DC    F'0'                    RESULT 138
RESULT139   DC    F'0'                    RESULT 139
RESULT140   DC    F'0'                    RESULT 140
RESULT141   DC    F'0'                    RESULT 141
RESULT142   DC    F'0'                    RESULT 142
RESULT143   DC    F'0'                    RESULT 143
RESULT144   DC    F'0'                    RESULT 144
RESULT145   DC    F'0'                    RESULT 145
RESULT146   DC    F'0'                    RESULT 146
RESULT147   DC    F'0'                    RESULT 147
RESULT148   DC    F'0'                    RESULT 148
RESULT149   DC    F'0'                    RESULT 149
SAVER140  DC    F'0'                    SAVED RETURN ADDRESS 0
SAVER141  DC    F'0'                    SAVED RETURN ADDRESS 1
SAVER142  DC    F'0'                    SAVED RETURN ADDRESS 2
SAVER143  DC    F'0'                    SAVED RETURN ADDRESS 3
SAVER144  DC    F'0'                    SAVED RETURN ADDRESS 4
SAVER145  DC    F'0'                    SAVED RETURN ADDRESS 5
SAVER146  DC    F'0'                    SAVED RETURN ADDRESS 6
SAVER147  DC    F'0'                    SAVED RETURN ADDRESS 7
SAVER148  DC    F'0'                    SAVED RETURN ADDRESS 8
SAVER149  DC    F'0'                    SAVED RETURN ADDRESS 9
SAVER1410  DC    F'0'                    SAVED RETURN ADDRESS 10
SAVER1411  DC    F'0'                    SAVED RETURN ADDRESS 11
SAVER1412  DC    F'0'                    SAVED RETURN ADDRESS 12
SAVER1413  DC    F'0'                    SAVED RETURN ADDRESS 13
SAVER1414  DC    F'0'                    SAVED RETURN ADDRESS 14
SAVER1415  DC    F'0'                    SAVED RETURN ADDRESS 15
SAVER1416  DC    F'0'                    SAVED RETURN ADDRESS 16
SAVER1417  DC    F'0'                    SAVED RETURN ADDRESS 17
SAVER1418  DC    F'0'                    SAVED RETURN ADDRESS 18
SAVER1419  DC    F'0'                    SAVED RETURN ADDRESS 19
SAVER1420  DC    F'0'                    SAVED RETURN ADDRESS 20
SAVER1421  DC    F'0'                    SAVED RETURN ADDRESS 21
SAVER1422  DC    F'0'                    SAVED RETURN ADDRESS 22
SAVER1423  DC    F'0'                    SAVED RETURN ADDRESS 23
SAVER1424  DC    F'0'                    SAVED RETURN ADDRESS 24
SAVER1425  DC    F'0'                    SAVED RETURN ADDRESS 25
SAVER1426  DC    F'0'                    SAVED RETURN ADDRESS 26
SAVER1427  DC    F'0'                    SAVED RETURN ADDRESS 27
SAVER1428  DC    F'0'                    SAVED RETURN ADDRESS 28
SAVER1429  DC    F'0'                    SAVED RETURN ADDRESS 29
SAVER1430  DC    F'0'                    SAVED RETURN ADDRESS 30
SAVER1431  DC    F'0'                    SAVED RETURN ADDRESS 31
SAVER1432  DC    F'0'                    SAVED RETURN ADDRESS 32
SAVER1433  DC    F'0'                    SAVED RETURN ADDRESS 33
SAVER1434  DC    F'0'                    SAVED RETURN ADDRESS 34
SAVER1435  DC    F'0'                    SAVED RETURN ADDRESS 35
SAVER1436  DC    F'0'                    SAVED RETURN ADDRESS 36
SAVER1437  DC    F'0'                    SAVED RETURN ADDRESS 37
SAVER1438  DC    F'0'                    SAVED RETURN ADDRESS 38
SAVER1439  DC    F'0'                    SAVED RETURN ADDRESS 39
SAVER1440  DC    F'0'                    SAVED RETURN ADDRESS 40
SAVER1441  DC    F'0'                    SAVED RETURN ADDRESS 41
SAVER1442  DC    F'0'                    SAVED RETURN ADDRESS 42
SAVER1443  DC    F'0'                    SAVED RETURN ADDRESS 43
SAVER1444  DC    F'0'                    SAVED RETURN ADDRESS 44
SAVER1445  DC    F'0'                    SAVED RETURN ADDRESS 45
SAVER1446  DC    F'0'                    SAVED RETURN ADDRESS 46
SAVER1447  DC    F'0'                    SAVED RETURN ADDRESS 47
SAVER1448  DC    F'0'                    SAVED RETURN ADDRESS 48
SAVER1449  DC    F'0'                    SAVED RETURN ADDRESS 49
         SPACE ,
*---------------------------------------------------------------------*
*        LITERAL POOL                                                 *
*---------------------------------------------------------------------*
         LTORG ,                        LITERAL POOL
         SPACE ,
*---------------------------------------------------------------------*
*        END OF PROGRAM                                               *
*---------------------------------------------------------------------*
         END   LARGETEST                END OF PROGRAM