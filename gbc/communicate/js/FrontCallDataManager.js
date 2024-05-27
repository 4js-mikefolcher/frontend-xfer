"use strict";

modulum('FrontCallService.modules.FrontCallDataManager', ['FrontCallService'],
/**
** @param {gbc} context
** @param {classes} cls
**/
function(context, cls) {
   context.FrontCallService.modules.FrontCallDataManager = {
      dataExchange: function (frontCallName, jsonString) {

         let dataValue = '';
         //Validate the frontCallName Parameter
         if (frontCallName === undefined) {
            this.parametersError();
            console.log("frontcallName is null");
            return;
         }
         try {
            
            const session = context.SessionService.getCurrent();
            if (frontCallName === gbc.constants.communicationEventNames.sendData) {
               //Handle the Send Data frontcall
               
               //Parse jsonString
               var obj = JSON.parse(jsonString);

               //Trigger a session event
               session._registerTimeout(function() {
                  console.debug("Emitting frontcall event", frontCallName, obj);
                  this.emit(frontCallName, obj);
               }.bind(session), 100);

            } else if (frontCallName === gbc.constants.communicationEventNames.receiveData) {
               //Handle the Receive Data frontcall

               //Retrieve the data
               dataValue = session.dataValue;

            }
         } catch (ex) {
            //Error parsing the jsonString
            this.runtimeError("BDLInfo parameter is not a valid JSON string");
            console.log("Exception: " + ex.toString());
            console.log("jsonString: " + jsonString);
            return;
         }
         return [dataValue];
      }
   };
});
