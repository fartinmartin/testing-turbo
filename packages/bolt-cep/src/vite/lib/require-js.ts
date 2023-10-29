export const injectRequire = `"use strict";window.require=typeof require==="function"?function(require,document){var tmp=document.querySelector("script[data-main]");if(tmp){require(tmp.dataset.main)}return require}(require,document):function(document){var COMMA_DELIMITER=/,[ ]*/gim;var SLASH_DELIMITER=/[\/]+/gim;function loadPrerequisites(){var head=document.head;var tmpScripts=document.querySelector("script[data-scripts]");var tmpStyles=document.querySelector("script[data-styles]");var styles=tmpStyles?tmpStyles.dataset.styles:"";var scripts=tmpScripts?tmpScripts.dataset.scripts:"";var tmpBaseDir=document.querySelector("script[data-base_dir]");var tag;var baseDir=tmpBaseDir&&tmpBaseDir.dataset.base_dir;baseDir=baseDir&&typeof baseDir==="string"?baseDir:"./";baseDir=new URL(baseDir,location.href).href;if(baseDir){tag=document.createElement("base");tag.setAttribute("href",baseDir);head.append(tag)}if(typeof styles==="string"){styles.trim().replace(COMMA_DELIMITER,",").split(",").forEach(function(url){tag=document.createElement("link");tag.setAttribute("rel","stylesheet");tag.setAttribute("type","text/css");tag.setAttribute("href",url.trim());head.append(tag)})}if(typeof scripts==="string"){scripts.trim().replace(COMMA_DELIMITER,",").split(",").forEach(function(url){tag=document.createElement("script");tag.setAttribute("type","text/javascript");tag.setAttribute("src",url.trim());head.append(tag)})}return baseDir}function getSynchXHR(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send();return xhr}function getFileName(filePath){filePath=typeof filePath==="string"?filePath:"";if(filePath.indexOf(".")<0){var xhr=getSynchXHR("".concat(filePath,"/package.json"));if(xhr.status===200){var pack=JSON.parse(xhr.responseText);filePath=filePath+"/"+pack.main}}return filePath}return function(){var modules={};var baseDir=loadPrerequisites();var tmpMain=document.querySelector("script[data-main]");var mainStr=tmpMain?tmpMain.dataset.main:null;function require(dirname,file){file=typeof file==="string"?file.trim():"";var uri=new URL(file,dirname);uri.pathname=getFileName(uri.pathname);dirname=uri.href.substr(0,uri.href.lastIndexOf("/")+1);var filename=uri.pathname.substr(uri.pathname.lastIndexOf("/")+1);if(modules.hasOwnProperty(uri.href)){return modules[uri.href]}else{var xhr=getSynchXHR(uri.href);if(xhr.status===200){var module={};if(/(.json)$/gi.test(filename)){module.exports=JSON.parse(xhr.responseText)}else{module.exports={};new Function("exports","require","module","__filename","__dirname","\n              ".concat(xhr.responseText,"\n              //# sourceURL=").concat(uri.href,"\n            ")).call(this,module.exports,require.bind(this,dirname),module,filename,dirname);modules[uri.href]=module.exports}return module.exports}}return}Object.defineProperty(require,"modules",{set:Function.prototype,get:function get(){return modules}});var req=require.bind(this,baseDir);if(mainStr){window.addEventListener("load",req.bind(this,new URL(mainStr,baseDir).href))}return req}()}(document);`;
