System.register([], function (_export, _context) {
  "use strict";

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function createApplication(_ref) {
    var loadJsListFile = _ref.loadJsListFile,
      fetchWasm = _ref.fetchWasm;
    // NOTE: before here we shall not import any module!
    var promise = Promise.resolve();
    return promise.then(function () {
      return _defineProperty({
        start: start
      }, 'import', topLevelImport);
    });

    function start(_ref3) {
      var findCanvas = _ref3.findCanvas;
      var settings;
      var cc;
      return Promise.resolve().then(function () {
        return topLevelImport('cc');
      }).then(function (engine) {
        cc = engine;

        registerLoader()

        return loadSettingsJson(cc);
      }).then(function () {
        settings = window._CCSettings;
        return initializeGame(cc, settings, findCanvas).then(function () {
          if (!settings.renderPipeline) return cc.game.run();
        }).then(function () {
          return loadJsList(settings.jsList);
        }).then(function () {
          return loadAssetBundle(settings.hasResourcesBundle, settings.hasStartSceneBundle);
        }).then(function () {
          if (settings.renderPipeline) return cc.game.run();
        }).then(function () {
          cc.game.onStart = onGameStarted.bind(null, cc, settings);
          onGameStarted(cc, settings);
        });
      });
    }

    function topLevelImport(url) {
      return _context["import"]("".concat(url));
    }

    function loadAssetBundle(hasResourcesBundle, hasStartSceneBundle) {
      var promise = Promise.resolve();
      var _cc$AssetManager$Buil = cc.AssetManager.BuiltinBundleName,
        MAIN = _cc$AssetManager$Buil.MAIN,
        RESOURCES = _cc$AssetManager$Buil.RESOURCES,
        START_SCENE = _cc$AssetManager$Buil.START_SCENE;
      var bundleRoot = hasResourcesBundle ? [RESOURCES, MAIN] : [MAIN];

      if (hasStartSceneBundle) {
        bundleRoot.push(START_SCENE);
      }

      return bundleRoot.reduce(function (pre, name) {
        return pre.then(function () {
          return loadBundle(name);
        });
      }, Promise.resolve());
    }

    function loadBundle(name) {
      return new Promise(function (resolve, reject) {
        cc.assetManager.loadBundle(name, function (err, bundle) {
          if (err) {
            return reject(err);
          }

          resolve(bundle);
        });
      });
    }

    function loadModulePacks(packs) {
      return Promise.all(packs.map(function (pack) {
        return topLevelImport(pack);
      }));
    }

    function loadJsList(jsList) {
      var promise = Promise.resolve();
      jsList.forEach(function (jsListFile) {
        promise = promise.then(function () {
          return loadJsListFile("src/".concat(jsListFile));
        });
      });
      return promise;
    }

    function loadSettingsJson(cc) {
      var server = '';
      var settings = 'src/settings.json';
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }

    function registerLoader() {

      const REGEX = /^(?:\w+:\/\/|\.+\/).+/;

      /** 官网范例,反正看不懂
         * - https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_1_%E2%80%93_JavaScript's_UTF-16_%3E_base64
         */
      function b64ToUint6(nChr) {
        return nChr > 64 && nChr < 91
          ? nChr - 65 : nChr > 96 && nChr < 123
            ? nChr - 71 : nChr > 47 && nChr < 58
              ? nChr + 4 : nChr === 43
                ? 62 : nChr === 47
                  ? 63 : 0
      }

      window.b64ToUint6 = b64ToUint6

      /** 官网范例+1,看不懂+1,作用是将base64编码的字符串转为ArrayBuffer */
      function base64DecToArr(sBase64, nBlockSize) {
        var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length
        var nOutLen = nBlockSize ? Math.ceil((nInLen * 3 + 1 >>> 2) / nBlockSize) * nBlockSize : nInLen * 3 + 1 >>> 2
        var aBytes = new Uint8Array(nOutLen)
        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
          nMod4 = nInIdx & 3
          nUint24 |= window.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
          if (nMod4 === 3 || nInLen - nInIdx === 1) {
            for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
              aBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
            }
            nUint24 = 0
          }
        }
        return aBytes
      }

      window.base64DecToArr = base64DecToArr

      function downloadBundleHandler(nameOrUrl, options, onComplete) {
        let bundleName = cc.path.basename(nameOrUrl);
        console.log("downloadBundleHandler", bundleName)
        let url = nameOrUrl;
        if (!REGEX.test(url)) url = 'assets/' + bundleName;
        var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
        var count = 0;
        var config = `${url}/config.${version ? version + '.' : ''}json`;
        let out = null, error = null;
        downloadJson(config, options, function (err, response) {
            if (err) {
                error = err;
            }
            out = response;
            out && (out.base = url + '/');
            count++;
            if (count === 2) {
                onComplete(error, out);
            }
        });
    
        var js = `${url}/index.${version ? version + '.' : ''}js`;
        downloadScript(js, options, function (err) {
            if (err) {
                error = err;
            }
            count++;
            if (count === 2) {
                onComplete(error, out);
            }
        });
      };

      function downloadScript(url, options, onComplete) {
        var d = document, s = document.createElement('script');

        s.type = "text/javascript";
        s.charset = "utf-8";
        s.text = window.resMap[url];

        d.body.appendChild(s);

        onComplete(null);
      }

      function downloadJson(url, options, onComplete) {
        let data = window.resMap[url];
        data = JSON.parse(data);
        onComplete(null, data);
      };

      function downloadText(url, options, onComplete) {
        let data = window.resMap[url];
        onComplete(null, data);
      }

      function downloadPng(url, options, onComplete) {
        var img = new Image()
        img.src = "data:image/png;base64," + window.resMap[url]   // 注意需要给base64编码添加前缀
        img.onload = function (info) {
          onComplete(null, img);
        };
        img.onerror = function (event) {
          onComplete(new Error("load image fail:" + img.src), null);
        };
      }

      function downloadJpg(url, options, onComplete) {
        var img = new Image()
        img.src = "data:image/jpeg;base64," + window.resMap[url]
        img.onload = function (info) {
          onComplete(null, img);
        };
        img.onerror = function (event) {
          onComplete(new Error("load image fail:" + img.src), null);
        };
      }

      function downloadMp3(url, options, onComplete) {
        console.log("downloadMp3", url)
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();

        audioContext.decodeAudioData(
          window.base64DecToArr(window.resMap[url]).buffer,
          // success
          function (buffer) {
            e(buffer)
          },
          // fail
          function (buffer) {
            i(new Error("mp3-res-fail"))
          }
        )
      }

      function downloadBin(url, options, onComplete){
        var arr = base64DecToArr(window.resMap[url])
        onComplete(null, arr)
      }

      function downloadCconb(url, options, onComplete){
        var arr = base64DecToArr(window.resMap[url])
        const ccon = cc.internal.decodeCCONBinary(arr);
        onComplete(null, ccon)
      }

      function downloadCCON(url, options, onComplete){

        downloadJson(config, options, function (err, json) {
          if (err) {
              onComplete(err);
          }
          const cconPreface = cc.internal.parseCCONJson(json);
          const chunkPromises = Promise.all(cconPreface.chunks.map((chunk) => new Promise((resolve, reject) => {
              downloadArrayBuffer(`${cc.path.mainFileName(url)}${chunk}`, {}, (errChunk, chunkBuffer) => {
                  if (errChunk) {
                      reject(errChunk);
                  } else {
                      resolve(new Uint8Array(chunkBuffer));
                  }
              });
          })));
          chunkPromises.then((chunks) => {
              const ccon = new cc.internal.CCON(cconPreface.document, chunks);
              onComplete(null, ccon);
          }).catch((err) => {
              onComplete(err);
          });
      });

        
      }

      cc.assetManager.downloader.register("bundle", downloadBundleHandler);
      cc.assetManager.downloader.register(".json", downloadJson);
      cc.assetManager.downloader.register(".plist", downloadText);
      cc.assetManager.downloader.register(".png", downloadPng);
      cc.assetManager.downloader.register(".jpg", downloadJpg);
      // cc.assetManager.downloader.register(".mp3", downloadMp3);
      cc.assetManager.downloader.register(".bin", downloadBin);
      cc.assetManager.downloader.register(".cconb", downloadCconb);
      cc.assetManager.downloader.register(".ccon", downloadCCON);
    }
  }

  function initializeGame(cc, settings, findCanvas) {
    if (settings.macros) {
      for (var key in settings.macros) {
        cc.macro[key] = settings.macros[key];
      }
    }

    var gameOptions = getGameOptions(cc, settings, findCanvas);
    return Promise.resolve(cc.game.init(gameOptions));
  }

  function onGameStarted(cc, settings) {
    window._CCSettings = undefined;
    cc.view.enableRetina(true);
    cc.view.resizeWithBrowserSize(true);

    if (cc.sys.isMobile) {
      if (settings.orientation === 'landscape') {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
      } else if (settings.orientation === 'portrait') {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
      }
    }

    var launchScene = settings.launchScene; // load scene

    cc.director.loadScene(launchScene, null, function () {
      cc.view.setDesignResolutionSize(960, 640, 4);
      console.log("Success to load scene: ".concat(launchScene));
    });
  }

  function getGameOptions(cc, settings, findCanvas) {
    // asset library options
    var assetOptions = {
      bundleVers: settings.bundleVers,
      remoteBundles: settings.remoteBundles,
      server: settings.server,
      subpackages: settings.subpackages
    };
    var options = {
      debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
      showFPS: !false && settings.debug,
      frameRate: 60,
      groupList: settings.groupList,
      collisionMatrix: settings.collisionMatrix,
      renderPipeline: settings.renderPipeline,
      adapter: findCanvas('GameCanvas'),
      assetOptions: assetOptions,
      customJointTextureLayouts: settings.customJointTextureLayouts || [],
      physics: settings.physics
    };
    return options;
  }

  window.createApplication = createApplication

  _export("createApplication", createApplication);

  return {
    setters: [],
    execute: function () { }
  };
});