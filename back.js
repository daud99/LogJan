"use strict";
var storage = chrome.storage.local;
var iconOpen;

// this will get value of iconopen key from the storage and in case if that's not presence it will set that value to false in the storage or else iconOpen will be assigned with that value
storage.get("iconOpen", function (n) {
    n && n.hasOwnProperty("iconOpen") ? iconOpen = n.iconOpen : (iconOpen = !0, storage.set({
        iconOpen: !0
    }))
});

// basically, this will trigger when there is change for anyvalue in the storage and in case that variable is iconOpen we will set that to the variable iconOpen
chrome.storage.onChanged.addListener(function (n, e) {
    n && n.iconOpen && (iconOpen = n.iconOpen.newValue)
});

// this will open the options page on clicking of the extension icon on the toolbar
chrome.browserAction.onClicked.addListener(function (n) {
    iconOpen && chrome.runtime.openOptionsPage()
});

