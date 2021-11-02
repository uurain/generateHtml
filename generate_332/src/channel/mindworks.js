window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 0 || funcType == 10){
        window.gameEnd && window.gameEnd();window.install && window.install();
    }
    if(funcType == 1){
        
    }
};
window.gameReady && window.gameReady();
function gameStart() { window.boot.prepare().then(window.boot); }
function gameClose(){}