window.GlobalCustomFunc = function(funcType, funcParam){
    if(funcType == 103){
        if(window.isJumpComplete == null){
            window.isJumpComplete = true;
            parent.postMessage("complete","*")
          }
    }
    if(funcType == 0 || funcType == 11){
        // parent.postMessage("download","*")
       if(window.isJumpComplete == null){
          window.isJumpComplete = true;
          parent.postMessage("complete","*")
        }else{
            parent.postMessage("download","*")
        }
    }
    if(funcType == 1){
        // if(window.isGameComplete == null){
        //     window.isGameComplete = true;
        //     parent.postMessage("complete","*")
        // }
    }
    if(funcType == 10 || funcType == 12){
        // parent.postMessage("complete","*")
        parent.postMessage("download","*")
    }
};

window.boot.prepare().then(window.boot);