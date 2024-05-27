"use strict";

modulum('CustomSessionManager',
  function(context, cls) {

    /**
     * Session manager for multi window sessions
     * @namespace classes.CustomSessionManager
     */
    context.CustomSessionManager = context.oo.StaticClass(function() {
      return /** @lends classes.CustomSessionManager */ {
        __name: "CustomSessionManager",
        _sessionList: [],

        //Add a session to the session manager
        addSession: function(session) {
         this._sessionList.push(session);
        },

        //Remove a session from the session manager
        removeSession: function(session) {
         const idx = this._sessionList.indexOf(session);
         if (idx > -1) {
            let sess = this._sessionList.splice(idx, 1);
            if (sess.length == 1) this.sessionLogout(sess[0]);
         }
        },

        getSessionList: function() {
         return this._sessionList;
        },

        //Clear out the session manager
        removeAll: function() {
            while (this.hasChildSessions()) {
               let session = this._sessionList[0];
               this.removeSession(session);
            }
            this.cleanup();
        },

        //Does the session manager have any sessions?
        hasChildSessions: function() {
         return (this._sessionList.length > 0);
        },
      
        //Cleanup by nulling out the session list
        cleanup: function() {
         this._sessionList = null;
        }
      };
   });
 });