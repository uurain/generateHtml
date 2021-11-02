window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        cc.sys.os==cc.sys.OS_ANDROID?mraid.open(window.android_jump_url):mraid.open(window.ios_jump_url)
    }
    if(funcType == 1){
        
    }
};
window.boot.prepare().then(window.boot);