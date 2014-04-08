chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (tab.url.indexOf('netflix.com') > -1)
        chrome.pageAction.show(tabId);
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.action == 'gotoNetfight') {
        chrome.tabs.create({
            url: chrome.extension.getURL('netfight.html')
        });
    }

});