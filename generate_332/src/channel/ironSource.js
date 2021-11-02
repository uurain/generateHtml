NUC.init("pa", "pro4Able", "RPG", "1.0");
window.GlobalCustomFunc = function(typeVal, param){
    if(typeVal == 0 || typeVal == 10){
        NUC.trigger.convert();
    }
    if(typeVal == 1){
        NUC.trigger.interaction();
    }
};
NUC.callback.onStart((width, height, isMuted) => {
    NUC.trigger.autoplay()
    window.boot.prepare().then(window.boot);
    
});
NUC.trigger.ready()