"use strict";

function updateStorage() {
    var t = {};
    t[visitTime.toString()] = thisVisit, storage.set(t)
}

function newInput(t) {
    t.ID = inputElemTracker.length, inputElemTracker.push(t), ipts[t.ID] = {
        initValue: "",
        endValue: "",
        segments: []
    };
    var e = getInputValue(t);
    "" != e.trim && (ipts[t.ID].initValue = e)
}

function getInputValue(t) {
    var e = ~watchedElements.indexOf(t.nodeName) || "true" === t.contentEditable;
    if (-1 === e) {
        if (!~dontLog.indexOf(t.type)) return t.value
    } else {
        if (-2 === e) return t.value;
        if (!0 === e) return t.innerText.trim().replace(/(\n|\r)+/g, " \n")
    }
    return null
}

function FocusIn(t) {
    var e = t.path[0],
        n = getInputValue(e);
    null !== n && n.match(aNonBlankChar) && (e.ID || ~inputElemTracker.indexOf(e) || newInput(e))
}

function FocusOut(t) {
    var e = t.path[0],
        n = getInputValue(e);
    null !== n && n.match(aNonBlankChar) && (e.ID || ~inputElemTracker.indexOf(e) || newInput(e), ~[ipts[e.ID].initValue, ipts[e.ID].endValue].indexOf(n) || ("" == n.trim() ? ipts[e.ID].segments.push(ipts[e.ID].endValue) : ipts[e.ID].endValue = n, updateStorage()))
}

function KeyDown(t) {
    var e = t.path[0],
        n = getInputValue(e);
    null !== n && (e.ID || ~inputElemTracker.indexOf(e) || newInput(e), 13 === (t.which || t.keyCode || 0) && "" !== n && (ipts[e.ID].endValue = n, updateStorage()), n !== ipts[e.ID].endValue && "" == n.trim() && (ipts[e.ID].segments.push(ipts[e.ID].endValue), updateStorage()))
}

function KeyUp(t) {
    var e = t.path[0],
        n = getInputValue(e);
    null !== n && ipts[e.ID] && n !== ipts[e.ID].endValue && ("" == n.trim() && ipts[e.ID] && "" !== ipts[e.ID].endValue && ipts[e.ID].segments.push(ipts[e.ID].endValue), ipts[e.ID].endValue = n, updateStorage())
}
var storage = chrome.storage.local,
    visitTime = (new Date).getTime(),
    url = window.location,
    thisVisit = {
        url: {
            proto: url.protocol,
            www: "",
            domain: url.host,
            tld: "",
            path: url.pathname,
            frag: url.href.replace(url.origin + url.pathname, "")
        },
        inputs: []
    },
    hasDot = url.host.lastIndexOf(".");
~hasDot && (thisVisit.url.domain = url.host.slice(0, hasDot), thisVisit.url.tld = url.hostname.substr(hasDot));
var u = thisVisit.url;
u.domain.match(/^w(?:ww|ww?[0-9]{1,3})\w{0,5}\./) && (u.www = u.domain.substring(0, u.domain.indexOf(".") + 1), u.domain = u.domain.substring(u.domain.indexOf(".") + 1)), chrome.extension.inIncognitoContext && (thisVisit.incog = !0), document.body.addEventListener("focusin", FocusIn, !0), document.body.addEventListener("focusout", FocusOut, !0), document.body.addEventListener("keydown", KeyDown, !0), document.body.addEventListener("keyup", KeyUp, !0);
var ipts = thisVisit.inputs,
    inputElemTracker = [],
    watchedElements = ["INPUT", "TEXTAREA"],
    dontLog = ["button", "image", "reset", "submit", "radio", "checkbox", "color", "range"],
    aNonBlankChar = /[^\x00-\x20\x7F]/;