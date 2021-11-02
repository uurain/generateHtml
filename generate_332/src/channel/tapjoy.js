window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        window.TJ_API && window.TJ_API.objectiveComplete();window.TJ_API && window.TJ_API.gameplayFinished();window.TJ_API && window.TJ_API.click();
    }
    if(funcType == 1){
        
    }
};

(window.TJ_API && window.TJ_API.setPlayableAPI({ skipAd: function() { /* go to the end card */ } }));
window.boot.prepare().then(window.boot);
