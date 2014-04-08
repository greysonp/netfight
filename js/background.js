chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (tab.url.indexOf('netflix.com') > -1)
        chrome.pageAction.show(tabId);
});