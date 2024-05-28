"use strict";

modulum('CustomMainContainerWidget', ['MainContainerWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class CustomMainContainerWidget
     * @memberOf classes
     * @extends classes.MainContainerWidget
     */
    cls.CustomMainContainerWidget = context.oo.Class(cls.MainContainerWidget, function($super) {
      return /** @lends classes.CustomMainContainerWidget.prototype */ {
        __name: "MainContainerWidget",
        _sessionHandler: null,
        _sendDataHandler: null,

        constructor: function(opts) {
          //Call the super constructor to initialize the object
          $super.constructor.call(this, opts);

          //When the session is added, initialize
          this._sessionHandler = context.SessionService.onSessionAdded(this.sessionAdded.bind(this));

        },

        //When the session initialization is over, this method will be called
        sessionAdded: function(event, sender, session) {

          if (window.opener) {
            //This is a child window, add the session to the parent session manager
            const parentGbc = window.opener.gbc;
            if (parentGbc) parentGbc.CustomSessionManager.addSession(session);
          }

          //Register the session to listen for postCommunication requests
          this._sendDataHandler = session.when(
            gbc.constants.communicationEventNames.sendData,
            this.onSendData.bind(this)
          );

       },

       //This function handles the send data event triggered from the frontcall manager
       onSendData: function(event, session, dataObj) {

          //In multiBrowserTab get a reference to the opener context/gbc
          let parentGbc = context;
          let parentSession = null;
          if (window.opener) {
            //Set parentGbc to the window opener gbc
            parentGbc = window.opener.gbc;
            parentSession = parentGbc?.SessionService.getCurrent();

          }

          //To support both multiBrowserTab and SPA modes
          const currentApp = session.getCurrentApplication();
          const sessionList = [session].concat(parentGbc.CustomSessionManager.getSessionList());
          if (parentSession != null && parentSession !== session) {
            sessionList.push(parentSession); 
          }
          for (const sess of sessionList) {
            for (const app of sess.getApplications()) {
                if (currentApp != app) {
                  console.debug("Running application ...", app, dataObj);
                  this._sendAction(sess, app, dataObj);
                }
            }
          }

       },

       //Update data value and send the action
       _sendAction: function(session, app, dataObj) {
          let actionService = app.getActionApplicationService();
          session.dataValue = dataObj.dataValue;
          if (actionService?.hasAction(dataObj.actionName)) {
            console.debug("Sending action", app, dataObj);
            actionService.executeByName(dataObj.actionName);
          }
       },

        //Cleanup memory before removing from AUI
        destroy: function() { 
            //Cleanup class variables
            this._sessionHandler = null;
            this._sendDataHandler = null;

            // Call the super destroy at the end to cleanup properly
            $super.destroy.call(this);
        }
      };
    });

    /*
     *  This is a sample widget that would replace the default one in GBC
     *  To activate it, please uncomment the line below. This will override
     *  the original widget registration to this one.
     */

    cls.WidgetFactory.registerBuilder('MainContainer', cls.CustomMainContainerWidget);
  });
