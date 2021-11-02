window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        FbPlayableAd.onCTAClick()
    }
    if(funcType == 1){
        
    }
};
window.boot.prepare().then(window.boot);