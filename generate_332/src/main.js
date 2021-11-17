var fs = require("fs")
var path = require("path")
var uglify = require("uglify-js")
var CleanCSS = require("clean-css")
var compressing = require("compressing");
var os = require('os')
const { execFileSync } = require('child_process');
const { spawn } = require('child_process');


var extParam = ""

let C = {
    CHANNEL: "test",
    URL_TYPE: "",
    BASE_PATH: "web-mobile",            // web-mobile包基础路径
    RES_BASE64_EXTNAME_SET: new Set([       // 需要使用base64编码的资源后缀(根据项目自行扩充)
        ".png", ".jpg", ".webp", ".mp3", ".bin", ".cconb"
    ]),
    OUTPUT_PATH: "dist",
    OUTPUT_RES_JS: "res.js",           // 输出文件res.js
    OUTPUT_INDEX_HTML: "index.html",   // 输出文件index.html的路径
}

/**
 * 读取文件内容
 * - 特定后缀返回base64编码后字符串,否则直接返回文件内容字符串
 * @param filepath
 */
function get_file_content(filepath) {
    let file = fs.readFileSync(filepath)
    return C.RES_BASE64_EXTNAME_SET.has(path.extname(filepath)) ? file.toString("base64") : file.toString()
}

/**
 * 获取路径下的所有子文件路径(深度遍历)
 * @param filepath
 */
function get_all_child_file(filepath){
    let children = [filepath]
    for (; ;) {
        // 如果都是file类型的,则跳出循环
        if (children.every(v => fs.statSync(v).isFile())) { break }
        // 如果至少有1个directroy类型,则删除这一项,并加入其子项
        children.forEach((child, i) => {
            if (fs.statSync(child).isDirectory()) {
                delete children[i]
                let child_children = fs.readdirSync(child).map(v => `${child}/${v}`)
                children.push(...child_children)
            }
        })
    }
    return children
}

/**
 * 将所有res路径下的资源转化为res.js
 * - 存储方式为:res-url(注意是相对的),res文件内容字符串或编码
 */
function write_resjs() {
    // 读取并写入到一个对象中
    let res_object = {};
    let resPath = C.BASE_PATH + "/" + "assets/main/"
    get_all_child_file(resPath).forEach(path => {
        // 注意,存储时删除BASE_PATH前置
        
        let store_path = path.replace(new RegExp(`^${C.BASE_PATH}/`), "")
        store_path = store_path.replace("main//", "main/")
        // console.log("write_resjs:", store_path)
        res_object[store_path] = get_file_content(path)
    })

    // 写入文件
    fs.writeFileSync(C.OUTPUT_PATH + "/" + C.OUTPUT_RES_JS, `window.resMap=${JSON.stringify(res_object)}`)
}

function del_resjs(){
    fs.unlinkSync(C.OUTPUT_PATH + "/" + C.OUTPUT_RES_JS)
}

/** 将js文件转化为html文件内容(包括压缩过程) */
function get_html_code_by_js_file(js_filepath) {
    let js = get_file_content(js_filepath)
    // let min_js = uglify.minify(js).code
    return `<script type="text/javascript"  name = "//${js_filepath}">${js}</script>`
}

function get_html_code_by_js_file_content(jsContent) {
    return `<script type="text/javascript">${jsContent}</script>`
}

/** 将css文件转化为html文件内容(包括压缩过程) */
function get_html_code_by_css_file(css_filepath) {
    let css = get_file_content(css_filepath)
    let min_css = new CleanCSS().minify(css).styles
    return `<style>${min_css}</style>`
}

function mkdirPath(pathStr) {
    var projectPath=path.join(process.cwd());
    var tempDirArray=pathStr.split('/');
    for (var i = 0; i < tempDirArray.length; i++) {
        projectPath = projectPath+'/'+tempDirArray[i];
        if (fs.existsSync(projectPath)) {
            var tempstats = fs.statSync(projectPath);
            if (!(tempstats.isDirectory())) {
                fs.unlinkSync(projectPath);
                fs.mkdirSync(projectPath);
            }
        }
        else{
            fs.mkdirSync(projectPath);
        }
    }
    return projectPath;
}


function do_task(argProjectPath, argChannel, argTargetPath, urlType, qianzhui) {
    if(argProjectPath != null && argProjectPath != "0"){
        C.BASE_PATH = argProjectPath
    }
    if(argChannel != null && argChannel != "0"){
        C.CHANNEL = argChannel
    }
    if(argTargetPath != null && argTargetPath != "0"){
        C.OUTPUT_PATH = argTargetPath
    }
    if(urlType != null && urlType != "0"){
        C.URL_TYPE = urlType
    }
    if(qianzhui == null || qianzhui == "0"){
        qianzhui = ""
    }
    C.OUTPUT_PATH += "/" + C.CHANNEL + qianzhui
    mkdirPath(C.OUTPUT_PATH)
    console.log(C.BASE_PATH, C.CHANNEL, C.OUTPUT_PATH)

    // 前置:将res资源写成res.js
    console.time("写入res.js")
    write_resjs()
    console.timeEnd("写入res.js")

    
    // 清理html
    console.time("清理html")
    let html = get_file_content(C.BASE_PATH + "/index.html")
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    html = html.replace(/<link rel="stylesheet".*\/>/gi, "")
    html = html.replace(/<link rel="icon".*\/>/gi, "")
    console.timeEnd("清理html")

    // 写入css
    console.log("写入所有css文件")
    let cssPath = C.BASE_PATH + "/style.css";
    console.time(`---${path.basename(cssPath)}`)
    html = html.replace(/<\/head>/, `${get_html_code_by_css_file(cssPath)}\n</head>`)
    console.timeEnd(`---${path.basename(cssPath)}`)


    //重写
    var min3dJs = C.BASE_PATH + "/cocos-js/cc.js";
    var min3dJsContent = get_file_content(min3dJs);
    min3dJsContent = min3dJsContent.replace("System.register([]", `System.register("cc",[]`)
    min3dJsContent = min3dJsContent.replace(`,r="load audio failed: "+t+", status: "`, `;let audioContext=new(window.AudioContext||window.webkitAudioContext)();audioContext.decodeAudioData(window.base64DecToArr(window.resMap[t]).buffer,function(buffer){e(buffer)},function(buffer){i(new Error("mp3-res-fail"))});return;`)
    fs.writeFileSync(min3dJs, min3dJsContent)

    var settingJsonPath = C.BASE_PATH + "/src/settings.json";
    var settingJsonContent = get_file_content(settingJsonPath);
    fs.writeFileSync(C.BASE_PATH+"/settings.js", "window._CCSettings ="+settingJsonContent)

    // 写入js
    console.log("写入所有js到html")
    
    let jsArry = [C.OUTPUT_PATH + "/res.js", C.BASE_PATH + "/src/polyfills.bundle.js", "src/system.js", "src/named-register.js"
    , C.BASE_PATH+"/cocos-js/cc.js", C.BASE_PATH+"/settings.js", C.BASE_PATH+"/src/chunks/bundle.js", C.BASE_PATH+"/application.js", C.BASE_PATH+"/index.js"]
    for (let i = 0; i < jsArry.length; i++) {
        let v = jsArry[i];
        console.time(`---${path.basename(v)}`)
        html = html.replace("</body>", () => `${get_html_code_by_js_file(v)}\n</body>`)
        console.timeEnd(`---${path.basename(v)}`)
    }

    // let indexJs = get_html_code_by_js_file_content("window.indexStr=\""+get_file_content(C.BASE_PATH+"/index.js")+"\"")
    // html = html.replace("</body>", () => `${indexJs}\n</body>`)
    // html = html.replace("</body>", () => `window.createIndexJs=function(){var d=document,s=document.createElement("script");s.type="text/javascript";s.text=window.indexStr;d.body.appendChild(s)};\n</body>`)

    // 写入ironSource文件
    if(C.CHANNEL == "ironSource"){
        html = html.replace("</body>", () => `${get_html_code_by_js_file("src/channel/ironSource_func.js")}\n</body>`)
        html = html.replace("</body>", () => `${get_html_code_by_js_file("src/channel/ironSource.js")}\n</body>`)
        let headContent = '<script>\nfunction getScript(e,i){var n=document.createElement("script");n.type="text/javascript",n.async=!0,i&&(n.onload=i),n.src=e,document.head.appendChild(n)}function parseMessage(e){var i=e.data,n=i.indexOf(DOLLAR_PREFIX+RECEIVE_MSG_PREFIX);if(-1!==n){var t=i.slice(n+2);return getMessageParams(t)}return{}}function getMessageParams(e){var i,n=[],t=e.split("/"),a=t.length;if(-1===e.indexOf(RECEIVE_MSG_PREFIX)){if(a>=2&&a%2===0)for(i=0;a>i;i+=2)n[t[i]]=t.length<i+1?null:decodeURIComponent(t[i+1])}else{var o=e.split(RECEIVE_MSG_PREFIX);void 0!==o[1]&&(n=JSON&&JSON.parse(o[1]))}return n}function getDapi(e){var i=parseMessage(e);if(!i||i.name===GET_DAPI_URL_MSG_NAME){var n=i.data;getScript(n,onDapiReceived)}}function invokeDapiListeners(){for(var e in dapiEventsPool)dapiEventsPool.hasOwnProperty(e)&&dapi.addEventListener(e,dapiEventsPool[e])}function onDapiReceived(){dapi=window.dapi,window.removeEventListener("message",getDapi),invokeDapiListeners()}function init(){window.dapi.isDemoDapi&&(window.parent.postMessage(DOLLAR_PREFIX+SEND_MSG_PREFIX+JSON.stringify({state:"getDapiUrl"}),"*"),window.addEventListener("message",getDapi,!1))}var DOLLAR_PREFIX="$$$$",RECEIVE_MSG_PREFIX="DAPI_SERVICE:",SEND_MSG_PREFIX="DAPI_AD:",GET_DAPI_URL_MSG_NAME="connection.getDapiUrl",dapiEventsPool={},dapi=window.dapi||{isReady:function(){return!1},addEventListener:function(e,i){dapiEventsPool[e]=i},removeEventListener:function(e){delete dapiEventsPool[e]},isDemoDapi:!0};init();\n</script>'    
        html = html.replace("</head>", () => `${headContent}\n</head>`)
    }else{
        html = html.replace("</body>", () => `${get_html_code_by_js_file("src/channel/test.js")}\n</body>`)
    }




    let htmName = C.OUTPUT_INDEX_HTML

    // 写入文件并提示成功
    console.time("输出html文件")
    var outPutFilePath = C.OUTPUT_PATH + "/" + htmName
    fs.writeFileSync(outPutFilePath, html)
    console.timeEnd("输出html文件")

    del_resjs();
}

const args = process.argv.slice(2)
if(args[5] != null && args[5] != "0"){
    extParam = args[5]
}
do_task(args[0], args[1], args[2], args[3], args[4]);

