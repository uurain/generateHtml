System.register("chunks:///_virtual/entry.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var n,r,e,o;return{setters:[function(t){n=t.inheritsLoose},function(t){r=t.cclegacy,e=t._decorator,o=t.Component}],execute:function(){var c;r._RF.push({},"ba103WsaoBHgbSLe3LCKmg8","entry",void 0);var s=e.ccclass;e.property,t("Entry",s("Entry")(c=function(t){function r(){return t.apply(this,arguments)||this}n(r,t);var e=r.prototype;return e.start=function(){console.log("Entry start")},e.update=function(t){console.log("Entry update")},r}(o))||c);r._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./entry.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});