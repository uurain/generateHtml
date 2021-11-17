NUC.init("pa", "pro4Able", "RPG", "1.0");
window.GlobalCustomFunc = function(typeVal, funcParam){
    if(typeVal == 0){
        NUC.trigger.convert();
    }
    if(typeVal == 1){
        NUC.trigger.interaction();
    }
    if(typeVal == 2){
    	NUC.trigger.endGame(funcParam == 1 ? "win":"lose");
    }
    if(typeVal == 3){
    	NUC.trigger.tryAgain()
    }
};
NUC.callback.onStart((width, height, isMuted) => {
    NUC.trigger.autoplay()
    window.onGameStarted(cc, window._CCSettings)
});

window.starGame = function(){    
    NUC.trigger.ready()
}