import $ from 'jquery';

window.jQuery = $;
require('ms-signalr-client');

export default $;

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
  return function () {
    // Call the client hub method
    callback.apply(hub, $.makeArray(arguments));
  };
}

function registerHubProxies(instance, shouldSubscribe) {
  let key; let hub; let memberKey; let memberValue; let
    subscriptionMethod;

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

export function setHubPrototype(serverMethods) {
  $.hubConnection.prototype.createHubProxies = function () {
    const proxies = {};
    this.starting(function () {
      // Register the hub proxies as subscribed
      // (instance, shouldSubscribe)
      registerHubProxies(proxies, true);

      this._registerSubscribedHubs();
    }).disconnected(() => {
      // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
      // (instance, shouldSubscribe)
      registerHubProxies(proxies, false);
    });

    proxies.ttcHub = this.createHubProxy('ttcHub');
    proxies.ttcHub.client = {};

    proxies.ttcHub.server = {};
    serverMethods.forEach(method => {
      proxies.ttcHub.server[method] = function () {
        return proxies.ttcHub.invoke.apply(proxies.ttcHub, $.merge([method], $.makeArray(arguments)));
      };
    });

    return proxies;
  };
}
