CONSTANT cFrontCallModule = "FrontCallDataManager"
CONSTANT cFrontCallFunc = "dataExchange"

PUBLIC FUNCTION sendDataToGBC(jsonString STRING) RETURNS ()
	CONSTANT cFrontCallName = "SendData"

	TRY

		CALL ui.Interface.frontCall(
			cFrontCallModule,
			cFrontCallFunc,
			[cFrontCallName, jsonString],
			[]
		)

	CATCH

		DISPLAY "FrontCall Error occurred"

	END TRY

END FUNCTION #sendDataToGBC

PUBLIC FUNCTION getDataFromGBC() RETURNS (STRING)
	CONSTANT cFrontCallName = "ReceiveData"

	VAR dataValue = ""

	TRY

		CALL ui.Interface.frontCall(
			cFrontCallModule,
			cFrontCallFunc,
			[cFrontCallName, "{}"],
			[dataValue]
		)

	CATCH

		DISPLAY "FrontCall Error occurred"

	END TRY

	RETURN dataValue

END FUNCTION #getDataFromGBC