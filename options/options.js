var storage = chrome.storage.local;

storage.get(null, function(obj) {
    console.log(obj);
    console.log(obj.t);
});