IMPORT util

PUBLIC TYPE TDataExchange RECORD
	actionName STRING,
	dataValue STRING
END RECORD

PUBLIC FUNCTION (self TDataExchange) toString() RETURNS (STRING)

	RETURN util.JSON.format(util.JSONObject.fromFGL(self).toString())

END FUNCTION #toString