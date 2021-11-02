window.GlobalCustomFunc = function(funcType, funcParam){
    console.log("GlobalCustomFunc", funcType, funcParam);
    if(funcType == 0 || funcType == 10){
        cc.sys.os==cc.sys.OS_ANDROID?window.open(window.android_jump_url):window.open(window.ios_jump_url)
    }
    if(funcType == 1){
        
    }
};
window.boot.prepare().then(window.boot);