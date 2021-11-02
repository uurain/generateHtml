window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        window.parent.postMessage("click_go", "*");
    }
};
window.onerror = function(msg, url, line, col, error) {
    window.parent.postMessage('IFRAME ERROR -- ' + error, '*');
};
window.boot.prepare().then(window.boot);