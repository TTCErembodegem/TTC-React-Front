import { getUrl } from './utils/httpClient.js';

import $ from 'jquery';
window.jQuery = $;
require('ms-signalr-client');

/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Generate this file:
 * Install-Package Microsoft.AspNet.SignalR.Utils
 * In: packages\Microsoft.AspNet.SignalR.Utils.2.2.0\tools
 * Run: .\signalr.exe ghp /path:C:\path\to\SignalR.Project\bin\
 */
function makeProxyCallback(hub, callback) {
  return function() {
    // Call the client hub method
    callback.apply(hub, $.makeArray(arguments));
  };
}

function registerHubProxies(instance, shouldSubscribe) {
  var key, hub, memberKey, memberValue, subscriptionMethod;

  for (key in instance) {
    if (instance.hasOwnProperty(key)) {
      hub = instance[key];

      if (!(hub.hubName)) {
        // Not a client hub
        continue;
      }

      if (shouldSubscribe) {
        // We want to subscribe to the hub events
        subscriptionMethod = hub.on;
      } else {
        // We want to unsubscribe from the hub events
        subscriptionMethod = hub.off;
      }

      // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
      for (memberKey in hub.client) {
        if (hub.client.hasOwnProperty(memberKey)) {
          memberValue = hub.client[memberKey];

          if (!$.isFunction(memberValue)) {
            // Not a client hub function
            continue;
          }

          subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
        }
      }
    }
  }
}

$.hubConnection.prototype.createHubProxies = function() {
  var proxies = {};
  this.starting(function() {
    // Register the hub proxies as subscribed
    // (instance, shouldSubscribe)
    registerHubProxies(proxies, true);

    this._registerSubscribedHubs();
  }).disconnected(function() {
    // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
    // (instance, shouldSubscribe)
    registerHubProxies(proxies, false);
  });

  proxies['ttcHub'] = this.createHubProxy('ttcHub');
  proxies['ttcHub'].client = {};
  proxies['ttcHub'].server = {
    send: function(name, message) {
      /// <summary>Calls the Send method on the server-side TtcHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
      /// <param name=\"name\" type=\"String\">Server side type is System.String</param>
      /// <param name=\"message\" type=\"String\">Server side type is System.String</param>
      return proxies['ttcHub'].invoke.apply(proxies['ttcHub'], $.merge(['Send'], $.makeArray(arguments)));
    }
  };

  return proxies;
};

var signalR = $.signalR;
signalR.hub = $.hubConnection(getUrl('/', false), {useDefaultPath: true});
$.extend(signalR, signalR.hub.createHubProxies());

var chat = $.connection.ttcHub;
chat.client.broadcastMessage = function(name, message) {
  console.log('broadcastMessage', name, message);
};

$.connection.hub.logging = true;
$.connection.hub.start().done(function() {
  chat.server.send('name', 'essage');
});