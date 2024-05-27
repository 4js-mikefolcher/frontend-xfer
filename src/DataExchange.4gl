IMPORT os

IMPORT FGL DataExchangeInterface
IMPORT FGL DataExchangeType

PRIVATE DEFINE parentApp BOOLEAN = TRUE
PRIVATE DEFINE browserTab BOOLEAN = FALSE

MAIN
	CONSTANT cBrowserTab4ST = "..%1resource%1MultiTabStyleSheet.4st"
	CONSTANT cSAP4ST = "..%1resource%1SPAStyleSheet.4st"

	VAR idx = 0
	FOR idx = 1 TO num_args()
		VAR arg = arg_val(idx)
		CASE arg
			WHEN "--child"
				LET parentApp = FALSE
			WHEN "--browserTab"
				LET browserTab = TRUE
		END CASE
	END FOR

	CALL ui.Interface.loadStyles(
		SFMT(
			IIF(browserTab, cBrowserTab4ST, cSAP4ST),
			os.Path.separator()
		)
	)

	OPEN WINDOW mainWindow WITH FORM "DataExchangeForm"
	CLOSE WINDOW SCREEN

	CALL userInput()

	CLOSE WINDOW mainWindow

END MAIN

PRIVATE FUNCTION userInput() RETURNS ()
	DEFINE dataRec RECORD
		send_data STRING,
		receive_data STRING
	END RECORD
	DEFINE exchangeData DataExchangeType.TDataExchange

	INPUT dataRec.* WITHOUT DEFAULTS FROM s_record.*
		ATTRIBUTES(UNBUFFERED)

		BEFORE INPUT
			INITIALIZE exchangeData.* TO NULL
			IF NOT parentApp THEN
				CALL DIALOG.setActionActive("launch_pgm", FALSE)
			END IF
			#TODO: Add logic here

		ON ACTION CANCEL
			EXIT INPUT

		ON ACTION post_data ATTRIBUTES(TEXT="Post Data")
			LET exchangeData.actionName = "data_listener"
			LET exchangeData.dataValue = dataRec.send_data
			CALL DataExchangeInterface.sendDataToGBC(exchangeData.toString())

		ON ACTION data_listener ATTRIBUTES(DEFAULTVIEW=NO, TEXT="Data Listener")
			LET dataRec.receive_data = DataExchangeInterface.getDataFromGBC()

		ON ACTION launch_pgm ATTRIBUTES(TEXT="Launch Program")
			RUN SFMT(
				"fglrun DataExchange %1 %2",
				"--child",
				IIF(browserTab, "--browserTab", "")
			) WITHOUT WAITING

		AFTER INPUT
			CONTINUE INPUT

	END INPUT

END FUNCTION #userInput