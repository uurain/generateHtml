window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        window.playableSDK.openAppStore(window.playableSDK.ConvertType.AD_ITEM_CLICK_1);
    }
    if(funcType == 1){
        window.playableSDK.sendEvent(window.playableSDK.EventType.AD_TRY_PLAY_GAME_START);
    }

    if(funcType == 101){
        window.playableSDK.sendEvent(window.playableSDK.EventType.AD_LANDING_PAGE_ENTERED);
    }
    if(funcType == 102){
        window.playableSDK.sendEvent(window.playableSDK.EventType.AD_LANDING_PAGE_LOADED);
    }
    if(funcType == 103){
        window.playableSDK.sendEvent(window.playableSDK.EventType.AD_TRY_PLAY_GAME_END);
    }
    if(funcType == 104){
               
    }
    if(funcType == 105){
        
    }
};

window.boot.prepare().then(window.boot);