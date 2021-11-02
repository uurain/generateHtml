window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        window.playableSDK.openAppStore();
    }
    if(funcType == 1){
        
    }
    if(funcType == 101){
        window.playableSDK.sendEvent('loadMainScene');
    }
    if(funcType == 102){
        window.playableSDK.sendEvent('startPlayPlayable');
    }
    if(funcType == 103){
        window.playableSDK.sendEvent('finishPlayPlayable');
    }
    if(funcType == 104){
        window.playableSDK.sendEvent('clickArea', { section: 'section1', area: 'area1' });        
    }
    if(funcType == 105){
        window.playableSDK.sendEvent('enterSection', { section: 'section1' });
    }
};

window.boot.prepare().then(window.boot);