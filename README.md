# generateHtml 
生成后的文件可以直接预览，
支持png jpg plist animation plist 模型 声音的demo

1.站在巨人的肩膀上https://github.com/fkworld/cocos-to-playable-ad
2.引擎版本是最新的creator 3.3.2版本
3.test3_3_2是测试工程
4.generate_332是生成工程
5.生成后的文件在dist/test/index.html
6.修改了system.js文件，加了一些特殊的写法用来支持register方法
7.增加build-templates模板，物理引擎选择了内置的版本，理论上用啥版本都可以，需要自己动手解决
8.因为mp3的播放用loader复写不了 所以用了一个很恶心的办法去 直接替换读取，参考main.js 166行，有啥比较好的方法 欢迎联系我
