chrome.browserAction.setBadgeText({ text: "" });
chrome.browserAction.onClicked.addListener(function() {
	chrome.runtime.reload();
});

