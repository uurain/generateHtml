window.needAudio = true;




window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        cc.sys.os==cc.sys.OS_ANDROID?mraid.open(window.android_jump_url):mraid.open(window.ios_jump_url)
    }
    if(funcType == 1){
        
    }
};

function mraidPlay() {
    console.log(window.res);
    mraid.getMaxSize()
    "use strict";
    if (mraid.getState() === 'loading') {
        mraid.addEventListener('ready', onSdkReady);
    } else {
        onSdkReady();
    }
    function onSdkReady() {
        window.boot.prepare().then(window.boot);
    }
}

if(typeof(mraid) == "undefined"){
    window.boot.prepare().then(window.boot);
}else{
    mraid.getMaxSize();
    mraidPlay();  
}
