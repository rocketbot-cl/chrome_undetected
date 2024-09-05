/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
import{dcLocalStorage as e,dcSessionStorage as t}from"../../../common/local-storage.js";import{dcTabStorage as a}from"../tab-storage.js";import{util as n}from"../content-util.js";import{signInUtil as r}from"./signInUtils.js";import{privateApi as i}from"../content-privateApi.js";import{COOLDOWN_FOR_LFT_PROMPT as o,OptionPageActions as s,LOCAL_FILE_PERMISSION_URL as c,LOCAL_FTE_WINDOW as l}from"../../../common/constant.js";import{indexedDBScript as d}from"../../../common/indexDB.js";import{loggingApi as m}from"../../../common/loggingApi.js";import{updateExtUserState as g,isNewUser as u}from"../../../common/util.js";import p from"./ResponseHeaders.js";import f from"./BookmarkUtils.js";import I from"./LruUtil.js";import{analytics as h,events as w}from"../../../common/analytics.js";await e.init(),await t.init();const b=e.getItem("appLocale");let v=!1;!function(){let S,_,y,L,T,E,P,D,U,k,R,C,B,A,F,M,x,O,V,N,$,H,G,W="";const j=chrome.runtime.getURL("viewer.html"),q=chrome.runtime.getURL("signInHandler.html"),z="file:",J=["https:","http:",z],Y=e=>{if(!e)return!1;try{const t=new URL(e),a=t.protocol;let n=-1!==J.indexOf(a);return n=a===z?t.pathname.toLowerCase().endsWith(".pdf"):n,n}catch(e){return!1}};function K(e){const t=a.getItem("search");return new URLSearchParams(t).get(e)}function X(e,t){return A?(F=F||1,e.tabId=F,e.mimeHandled=!0,chrome.runtime.sendMessage(e,t)):chrome.runtime.sendMessage(e,t)}function Z(e,t){return new URLSearchParams(e).get(t)||""}function Q(){if(L=Z(document.location.search,"pdfurl"),H=Z(document.location.search,"tabId"),!Y(L))return void(T=!1);!function(){const e=new URLSearchParams(document.location.search),n=t.getItem("rtParams");if(n){const a=n.split(",").map((t=>e.has(t)?`&${t}=${e.get(t)}`:null)).join("")||"";t.setItem("payPalUrl",a),t.removeItem("rtParams")}e.has("dialog!dropin")&&a.setItem("dialog!dropin",e.get("dialog!dropin")),e.has("load!dropin")&&a.setItem("load!dropin",e.get("load!dropin"))}();const e=a.getItem("search");(!e||Z(e,"pdfurl")!==L||e.length<document.location.search)&&a.setItem("search",document.location.search),y=Z(document.location.search,"pdffilename")||Z(e,"pdffilename")||be(L),document.title=y;const n="/"+L+location.hash;history.replaceState({},y,n)}function ee(t=!1){if(A)try{t||X({main_op:"viewer-type",viewer:"mime-native"}),setTimeout((()=>{i.reloadWithNativeViewer({contentLength:parseInt(S)||0})}),100)}catch(e){ae("DCBrowserExt:Viewer:FallbackToNative:Failed")}else try{setTimeout((()=>{chrome.tabs.getCurrent((function(t){e.setItem(`reloadurl-${t.id}`,L),window.location.href=L}))}),500)}catch(e){ae("DCBrowserExt:Viewer:FallbackToNative:Failed")}}const te=t=>{try{const a=new URL(e.getItem("cdnUrl")),n=[/^https:\/\/([a-zA-Z\d-]+\.){0,}(adobe|acrobat)\.com(:[0-9]*)?$/];return t===a.origin&&!!n.find((e=>e.test(t)))}catch(e){return!1}};function ae(e){const t={main_op:"analytics"};t.analytics=[[e]],X(t)}function ne(){let e,t=j;return A?(e="?mimePdfUrl="+encodeURIComponent(L),t=q):(e=a.getItem("search"),e||(e="?pdfurl="+L)),new URL(t+e)}const re=["AdobeID","openid","DCAPI","sign_user_read","sign_user_write","sign_user_login","sign_library_read","sign_library_write","agreement_send","agreement_read","agreement_write","ab.manage","additional_info.account_type","sao.ACOM_ESIGN_TRIAL","widget_read","widget_write","workflow_read","workflow_write"];function ie(t={}){if(e.getItem("csi")){const e={...t,pdfUrl:L};return void r.cdnSignIn(e)}const a=ne(),i=e.getItem("cdnUrl"),o=t.sign_up?1:0,s=n.generateStateCSRF(),c=e.getItem("enableCSRF"),l=JSON.stringify({touchp:t.touchpoint||"",signIn:!0,...c&&{state:s}}),d=e.getItem("theme")||"auto",m=`${i}?la=true&locale=${b||e.getItem("locale")}&theme=${d}&ru=${encodeURIComponent(a.href)}&rp=${l}&su=${o}#/susi`;chrome.tabs.update({url:m,active:!0})}function oe(){let e;e=A?ne().href:window.location.href,r.sign_out(e)}function se(t={}){if(e.getItem("csi")){const e={...t,pdfUrl:L};return void r.cdnSignIn(e)}let n=new URL(q);const i=t.idp_token;return n.searchParams.append("socialSignIn","true"),n.searchParams.append("mimePdfUrl",encodeURIComponent(L)),a.setItem("idp_token",i),n.href}function ce(e={}){A?chrome.tabs.update({url:se(e),active:!0}):r.socialSignIn(e,ne(),L)}function le(t={}){if(e.getItem("csi")){try{const e=new URL(JSON.parse(t.url));delete t.url;const a={...t,pdfUrl:L},n=r.getCDNSignURL(a);e.searchParams.append("redirect_uri",n),chrome.tabs.update({url:e.href,active:!0})}catch(e){chrome.tabs.update({url:L})}return}const i=t.application||"google",o=e.getItem("viewerImsClientIdSocial"),s=e.getItem("imsURL"),c=n.uuid(),l=ne();l.hash=l.hash+"signIn=true";const d=new URL(s+"/ims/authorize/v1"),m={ac:n.getAppCode(),csrf:c};a.setItem("csrf",c),d.searchParams.append("response_type","token"),d.searchParams.append("idp_flow","social.deep_link.web"),d.searchParams.append("client_id",o),d.searchParams.append("provider_id",i),d.searchParams.append("redirect_uri",l),d.searchParams.append("scope",re.join(",")),d.searchParams.append("locale",b||e.getItem("locale")),d.searchParams.append("state",JSON.stringify(m)),d.searchParams.append("xApiClientId",o),d.searchParams.append("xApiClientLocation ",i),chrome.tabs.update({url:d.href,active:!0})}const de={isSharePointURL:!1,isSharePointFeatureEnabled:!1,isFrictionlessEnabled:!0,featureFlags:[],isFillAndSignRegisteryEnabled:!1};class me{constructor(e){this.iframeElement=void 0,this.parentDiv=e}createIframe=t=>{const a=window.document,n=(e.getItem("cdnUrl"),a.createElement("iframe"));n.setAttribute("src",t),n.setAttribute("id","dc-view-frame"),n.setAttribute("allowfullscreen","allowfullscreen"),n.setAttribute("allow","clipboard-read; clipboard-write;"),n.style.width="100vw",n.style.height="100vh",n.style.border="none",n.style.overflow="hidden",this.parentDiv.appendChild(n),m.info({message:"Viewer Iframe created"}),this.iframeElement=a.getElementById("dc-view-frame")};_sendMessage=(e,t)=>{this.iframeElement&&te(t)&&function(e){let t=Date.now();return new Promise((function a(n,r){E&&(T||A)?n(T||A):e&&Date.now()-t>=e?r(new Error("timeout")):setTimeout(a.bind(this,n,r),30)}))}(1e6).then((a=>a&&this.iframeElement.contentWindow.postMessage(e,t)))};sendStartupConfigs=(e,a)=>{this._sendMessage({type:"nativeConfigs",nativeConfigs:de,extUrl:encodeURI(e),returnParamsUrl:t.getItem("payPalUrl"),isInstallTypeUpsell:v},a)};sendFileMetaData=(e,t,a,n,r,i,o,s)=>{this._sendMessage({fileUrl:r,fileName:i,fileSize:a,acceptRanges:n,handShakeTime:t,type:e,isFrictionlessEnabled:de.isFrictionlessEnabled,isReloadOrBackForward:s,isMimeHandled:A},o)};sendSubmitFormResponse=(e,t)=>{this._sendMessage({type:"submitForm",response:e},t)};sendRecentUrl=async(e,t,a,n=!1)=>{await chrome.extension.isAllowedFileSchemeAccess()||(t=t?.filter((e=>!e.url.startsWith("file://")))),this._sendMessage({type:"RecentUrls",permission:e,showOverlay:n,recentUrls:t},a)};sendProgress=(e,t,a,n)=>{this._sendMessage({total:t,loaded:a,type:e},n)};sendInitialBuffer=(e,t,a,n,r)=>{this._sendMessage({type:e,downLoadstartTime:t,downLoadEndTime:a,buffer:n},r)};sendBufferRanges=(e,t,a,n)=>{this._sendMessage({type:e,range:t,buffer:a},n)};preview=(e,t,n,r,i,o,s)=>{const c="true"===a.getItem("bufferFromIndexedDB");a.removeItem("bufferFromIndexedDB"),this._sendMessage({fileSize:n,type:e,fileBuffer:t,fileName:r,downLoadstartTime:i,downLoadEndTime:o,fromIndexedDB:c},s)};openInAcrobatResponse=(e,t,a)=>{this._sendMessage({type:e,res:t},a)};postLog=(e,t,a,n,r)=>{this._sendMessage({type:e,reqId:t,message:a,error:n},r)};sendCertificateValidationResponse=(e,t)=>{this._sendMessage({type:"certificateValidationResponse",response:e},t)}}function ge(t,a){try{R=void 0!==R?R:"false"!==e.getItem("logAnalytics")&&"false"!==e.getItem("ANALYTICS_OPT_IN_ADMIN"),R&&(U&&_?U.postLog("log",k,t,a,_.origin):setTimeout((()=>{U&&_&&U.postLog("log",k,t,a,_.origin)}),500))}catch(e){}}function ue(){let e;return e=A?L:window.location.href,e}function pe(){const t=ue(),n=(t.split("#")||[]).pop();if(n.indexOf("access_token=")>-1)try{const i=new URLSearchParams(n).get("access_token"),{client_id:o}=JSON.parse(window.atob(i.split(".")[1]))||{},s=e.getItem("viewerImsClientId");if([s,e.getItem("viewerImsClientIdSocial")].includes(o)){const e=a.getItem("csrf");a.removeItem("csrf");const n=r.parseCSRF(new URL(t));(!e||!n||n!==e)&&(ae("DCBrowserExt:Viewer:User:Error:NonMatchingCsrfToken:FailedToLogin"),oe())}}catch{}}function fe(t,a,n,r,i){i&&t.forEach((e=>{n.has(e)&&a.searchParams.append(e,n.get(e))})),r&&t.forEach((t=>{""!==e.getItem(t)&&a.searchParams.append(t,e.getItem(t))}))}const Ie=()=>{try{const r=e.getItem("cdnUrl"),i=new URL(r);if(!te(i.origin))return ge("Invalid CDN URL detected","Invalid Origin"),void ee();_||(_=i);let o=e.getItem("viewer-locale");o||(o=e.getItem("locale"));const s="false"!==e.getItem("logAnalytics"),c="false"!==e.getItem("ANALYTICS_OPT_IN_ADMIN"),l=s&&c?"true":c?"optinOff":"gpoOff",d="true"===e.getItem("betaOptOut");i.searchParams.append("locale",b||o),i.searchParams.append("logAnalytics",l),i.searchParams.append("callingApp",chrome.runtime.id),i.searchParams.append("betaOptOut",d),i.searchParams.append("lfa",e.getItem("isAllowedLocalFileAccess")||"false"),i.searchParams.append("enableCaretMode",O),t.getItem("signInTp")&&i.searchParams.append("touchp",t.getItem("signInTp")),i.searchParams.append("rvu",e.getItem("userState")?.rvu??null);const m=e.getItem("installType")||"update",g=e.getItem("installSource");i.searchParams.append("version",`${chrome.runtime.getManifest().version}:${m}`),i.searchParams.append("installSource",g),i.searchParams.append("storage",JSON.stringify(e.getItem("viewerStorage")||{})),i.searchParams.append("tabId",H),"false"===e.getItem("staticFteCoachmarkShown")&&i.searchParams.append("showFTECoachmark","true"),"true"!==K("googlePrint")&&!0!==M||"false"===a.getItem("googleAppsPrint")||i.searchParams.append("googleAppsPrint","true"),i.searchParams.append("sdp",e.getItem("sdp")?"1":"0"),i.searchParams.append("sds",e.getItem("sds")?"1":"0");const p=$.read(L);p&&(delete p.filename,delete p.lastVisited,i.searchParams.append("docState",JSON.stringify(p))),i.searchParams.append("nu",u()),i.searchParams.append("rs",e.getItem("rs")?"1":"0"),i.searchParams.append("nm",e.getItem("supportNightMode")?"1":"0"),i.searchParams.append("dpt",e.getItem("isDarkPageThemeEnabled")?"1":"0"),i.searchParams.append("adminDisableGenAI","true"===e.getItem("DISABLE_GENAI_BY_ADMIN")?"1":"0");const f=["dropin!","provider!","app!","forceDisableGenAI"],I=["analytics","logToConsole","enableLogging","frictionless","sessionId","linearization","ev","ao"],h=["rrv","isDeskTop","isAcrobat","theme","defaultOwnerShipExperiment","sessionId","ev","ao","ip","rate","genAI","mv","pi","ks","edd","tpt","lft","fsu","dcs","egal","ots","egaf","gga","pnb","subv2"];let w=a.getItem("signinTouchPointData");w=JSON.parse(w||"{}"),w&&"object"==typeof w&&Object.keys(w).length&&(i.searchParams.append("tp",w.touchpoint),i.searchParams.append("acmt",w.allowCommentsInShare?"1":"0")),a.removeItem("signinTouchPointData");e.getItem("env");let v;v=A?new URLSearchParams(new URL(L).search):new URLSearchParams(window.location.search);n=i,["dialog!dropin","load!dropin"].forEach((e=>{""!==(a.getItem(e)||"")&&n.searchParams.append(e,a.getItem(e))})),fe(I,i,v,!1,!0),fe(h,i,v,!0,!1);let S=i.href;f.forEach((e=>{v.forEach(((t,a)=>{a.startsWith(e)&&(S=S+"&"+a+"="+t)}))})),""===t.getItem("payPalUrl")||""===a.getItem("dialog!dropin")&&""===a.getItem("load!dropin")||(S+=t.getItem("payPalUrl"));const y=a.getItem("access_token");return a.removeItem("access_token"),`${S}${y?`/#${y}`:""}`}catch(e){ae("DCBrowserExt:Viewer:Iframe:Creation:Failed"),ee()}var n},he=(a,n,r="localStorage")=>{if(n){const i="localStorage"===r?e.getItem(a):t.getItem(a);let o;i&&i.tabsInfo?(o=i.tabsInfo,o.includes(n)||o.push(n)):o=[n],"localStorage"===r?e.setItem(a,{tabsInfo:o}):t.setItem(a,{tabsInfo:o})}},we=()=>{try{!function(){try{let e=ue();e&&e.indexOf("#")>-1&&(r.saveAccessToken(e),r.signInAnalyticsLogging(e),r.checkSignInFromEditVerbPaywall(e),e=e.split("#")[0],A?L=e:(window.location.hash=e,history.replaceState(null,document.title,e)))}catch(e){}}(),A&&(H=F);const a=window.document.getElementById("Adobe-dc-view");A||(S=K("clen")||-1),U=new me(a);const n=Ie();U.createIframe(n),g(),window.addEventListener("message",(a=>{!a.data||!te(a.origin)||P||"hsready"!==a.data.type&&"ready"!==a.data.type||(P=!0,D=(new Date).getTime(),k=a.data.requestId,"on"===a.data.killSwitch?(ae("DCBrowserExt:Viewer:KillSwitch:Turned:On"),e.setItem("pdfViewer","false"),i.setViewerState("disabled"),e.setItem("killSwitch","on"),A?ee(!0):setTimeout((()=>{window.location.href=L}),200)):e.getItem("killSwitch")&&(ae("DCBrowserExt:Viewer:KillSwitch:Turned:Off"),e.removeItem("killSwitch")),t.getItem("signInTp")&&t.removeItem("signInTp"))}))}catch(e){ge("Error create Iframe",e)}};function be(e){if(y)return y;let t=e;try{const a=e.split("?")[0].split("/").filter((e=>e.length>0)),n=a.length>0?a[a.length-1]:"untitled";t=n;const r=n.length-4;(n.length<4||n.toLowerCase().indexOf(".pdf")!==r)&&(t+=".pdf")}catch(e){ge("Error in getFileNameFromURL",e)}return t}function ve(e,t){return new Promise(((a,n)=>{const r=(new Date).getTime(),i=new XMLHttpRequest;i.open("GET",e.url),i.responseType="arraybuffer",i.setRequestHeader("Range",`bytes=${t.start}-${t.end}`),i.onload=()=>{if(4===i.readyState&&206===i.status)a({buffer:i.response,startTime:r,endTime:(new Date).getTime()});else if(200===i.status){const e={status:i.status,statusText:i.statusText,fileSize:S,rangeBufferSize:i.response.byteLength,range:t};n({message:"Unexpected response to get file buffer range",error:e})}else{const e={status:i.status,statusText:i.statusText,fileSize:S,range:t};n({message:"Invalid response to get file buffer ranger",error:e})}},i.onerror=e=>{n({message:"Error to get file buffer range",error:e})},i.ontimeout=e=>{n({message:"Timeout to get file buffer range due to timeout",error:e})},i.send()}))}function Se(e,t){"PDF"===function(e){if(e)try{let t=new URL(e).pathname;return t.substr(t.lastIndexOf(".")+1).toUpperCase()}catch(e){return""}return""}(e)&&(T=!0);const a=new XMLHttpRequest;a.open("GET",e),a.responseType="arraybuffer",a.onreadystatechange=function(){4===a.readyState&&(200!==a.status&&0!=a.status||(t({buffer:a.response,mimeType:a.getResponseHeader("content-type")}),ye(a.response)))},a.send(null)}async function _e(){try{const t=a.getItem("bufferTabId");if(t){const e=await d.getDataFromIndexedDB(t);if(e&&e.fileBuffer)return a.setItem("bufferFromIndexedDB",!0),T=!0,{buffer:e.fileBuffer}}else{const t=e.getItem("tabIdMap");if(t){const n=(A?await chrome.tabs.query({active:!0,currentWindow:!0}):[await chrome.tabs.getCurrent()])[0];if(n&&t[n.id]){a.setItem("bufferTabId",t[n.id]);const r=await d.getDataFromIndexedDB(t[n.id]);if(Object.keys(t).length>1?(delete t[n.id],e.setItem("tabIdMap",t)):e.removeItem("tabIdMap"),r&&r.fileBuffer)return a.setItem("bufferFromIndexedDB",!0),T=!0,{buffer:r.fileBuffer}}}}}catch(e){}return a.setItem("bufferFromIndexedDB",!1),{}}function ye(e){const t=$.read(L)||{},a=new Blob([e],{type:"application/pdf"}),n={main_op:"getFileBuffer",fileBufferBlob:URL.createObjectURL(a),tabId:H,docLastOpenState:t,target:"offscreen"};chrome.runtime.sendMessage(n)}function Le(e,t,a){return new Promise(((n,r)=>{const i=L;if(i.startsWith("file://"))return void Se(i,n);const o=new XMLHttpRequest;var s;o.open("GET",i),o.responseType="arraybuffer",t&&o.setRequestHeader("If-Range","randomrange"),o.onreadystatechange=(s=o,function(e){if(this.readyState==this.HEADERS_RECEIVED){if(!function(e,t){const a=e.getResponseHeader("content-type"),n=e.getResponseHeader("content-disposition");if(a){const e=a.toLowerCase().split(";",1)[0].trim();if(n&&/^\s*attachment[;]?/i.test(n))return!1;if("application/pdf"===e)return!0;if("application/octet-stream"===e&&n&&/\.pdf(["']|$)/i.test(n))return!0}return!1}(s))return ge("Fall back to native - not pdf from headers"),ee();T=!0}}),o.onprogress=function(e,t){return function(a){a.lengthComputable&&(S=a.total,e.sendProgress("progress",a.total,a.loaded,t))}}(e,a),o.onload=()=>{if(o.status>=200&&o.status<400)n({buffer:o.response,mimeType:o.getResponseHeader("content-type"),downLoadEndTime:(new Date).getTime()}),ye(o.response);else{const e={status:o.status,statusText:o.statusText};r({message:"Invalid response fetching content",error:e})}},o.onerror=e=>{r({message:"Error to download file contents",error:e})},o.ontimeout=e=>{r({message:"Timeout to download file contents",error:e})},o.send()}))}function Te(e,t){ae(`DCBrowserExt:Viewer:SignIn:AdobeYolo:${e}:clicked`),chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=e[0]&&e[0].id;he("adobeYoloTabsInfo",t,"sessionStorage")})),X({main_op:"launchJumpUrl",details:{source:e,userGuid:t}},(t=>{U._sendMessage({type:"adobeYoloJumpResponse",response:t,source:e},_.origin)}))}function Ee(e,t,...a){A?d.storeBufferAndCall(e,t,F,...a):chrome.tabs.getCurrent((function(n){d.storeBufferAndCall(e,t,n.id,...a)}))}function Pe(e){U._sendMessage({type:"redirectToAcrobatWeb",response:e},_.origin)}function De(){A?chrome.tabs.reload(F):chrome.tabs.getCurrent((e=>{chrome.tabs.reload(e.id)}))}function Ue(r,m){switch(m.data.main_op){case"open_in_acrobat":case"fillsign":!async function(t,a){const r={main_op:"open_in_acrobat"};if("fillsign"===a.data.main_op&&(r.paramName="FillnSign"),r.url=a.data.url,r.click_context="pdfviewer",r.timeStamp=Date.now(),r.filename=a.data&&a.data.filename,a.data.fileBuffer){const e=new Blob([a.data.fileBuffer],{type:"application/pdf"});r.dataURL=URL.createObjectURL(e)}if(x=function(e){"fillsign"===a.data.main_op?t.openInAcrobatResponse("FILLSIGN_IN_DESKTOP_APP",e,a.origin):t.openInAcrobatResponse("OPEN_IN_DESKTOP_APP",e,a.origin),ge(`Open In Acrobat - (${a.data.main_op}) response- ${e}`)},e.getItem("isSharepointFeatureEnabled"))if(de.isSharePointURL)r.workflow_name="SharePoint",r.isSharePointURL=!0,X(r,x);else{const e=await n.checkForSharePointURL(r.url);r.isSharePointURL=e,e&&(r.workflow_name="SharePoint"),X(r,x)}else X(r,x)}(r,m);break;case"complete_conversion":ae("DCBrowserExt:Viewer:Verbs:Conversion:Redirection"),function(e){const t={};t.main_op=e.data.main_op,t.conversion_url=decodeURIComponent(e.data.conversion_url),t.timeStamp=Date.now(),X(t)}(m);break;case"updateLocale":ae("DCBrowserExt:Viewer:User:Locale:Updated"),e.setItem("viewer-locale",m.data.locale),X({main_op:"localeChange",locale:m.data.locale}),chrome.tabs.reload();break;case"setInitialLocale":let u=!1;e.getItem("viewer-locale")||(u=!0,e.setItem("viewer-locale",m.data.locale),ae("DCBrowserExt:Viewer:User:Locale:Initial")),m.data.reloadReq&&u&&chrome.tabs.reload();break;case"error-sign-in":!function(e){const t=n.uuid();a.setItem("csrf",t);const r=new URL(e),i=ne();i.hash=i.hash+`state=${t}&signInError=true`,r.searchParams.set("redirect_uri",i),chrome.tabs.update({url:r.href,active:!0})}(m.data.url);break;case"deleteViewerLocale":e.getItem("viewer-locale")&&(e.removeItem("viewer-locale"),chrome.tabs.reload());break;case"signin":ae("DCBrowserExt:Viewer:Ims:Sign:In"),a.setItem("signInSource",m.data.source),a.setItem("signinTouchPointData",JSON.stringify({touchpoint:m.data.tp,allowCommentsInShare:m.data.allowCommentsInShare})),ae(`DCBrowserExt:Viewer:Ims:Sign:In:${m.data.source}`),Ee(m.data.fileBuffer,ie,m.data);break;case"googleSignIn":ae("DCBrowserExt:Viewer:Ims:Sign:In"),ae(`DCBrowserExt:Viewer:Ims:Sign:In:${m.data.source}`),a.setItem("signInSource",m.data.source),Ee(m.data.fileBuffer,le,m.data);break;case"signup":ae("DCBrowserExt:Viewer:Ims:Sign:Up"),a.setItem("signUpSource",m.data.source),ae(`DCBrowserExt:Viewer:Ims:Sign:Up:${m.data.source}`),Ee(m.data.fileBuffer,ie,m.data);break;case"reload_viewer":chrome.tabs.reload();break;case"reload_current_tab":De();case"upsell_event":!function(e){if(e&&e.url){const a=new URL(decodeURIComponent(e.url));e.returnUrlParams&&t.setItem("rtParams",e.returnUrlParams.toString()),"_blank"===e.target?chrome.tabs.create({url:a.href,active:!0}):chrome.tabs.update({url:a.href,active:!0})}}(m.data);break;case"upsell_remove_urlParams":t.removeItem("rtParams"),t.removeItem("payPalUrl"),a.removeItem("dialog!dropin"),a.removeItem("load!dropin");break;case"fetchLocalRecents":const p=new URL(e.getItem("cdnUrl")).origin;if(m.data.fetchRecents){const e=m.data.showOverlay;!async function(e,t,a=!1){const n=$.getAllItems();e.sendRecentUrl(!0,n,t,a)}(U,p,e)}else U.sendRecentUrl(!0,null,p);break;case"socialSignIn":ae("DCBrowserExt:Viewer:Ims:Sign:In"),ae(`DCBrowserExt:Viewer:Ims:Sign:In:${m.data.source}`),a.setItem("signInSource",m.data.source),Ee(m.data.fileBuffer,ce,m.data);break;case"openRecentFileLink":const I={};I.main_op=m.data.main_op,I.recent_file_url=decodeURIComponent(m.data.recent_file_url),X(I);break;case"updateCurrentURL":!async function(e){const t=A?F:(await chrome.tabs.getCurrent())?.id;chrome.tabs.update(t,{url:e})}(m.data.redirectURL);break;case"saveFileBufferAndReload":Ee(m.data.fileBuffer,De);break;case"userSubscriptionData":if(A){const e={};e.eventType=m.data.main_op,e.userSubscriptionData=m.data.userSubscriptionData,e.data=m.data,e.main_op=m.data.main_op;X(e,(function(e){e&&"showUninstallPopUp"===e.main_op&&U._sendMessage({type:"showUninstallPopUp"},_.origin)}))}break;case"uninstall":A&&X({main_op:"uninstall",defaultUrl:L});break;case"submit_form":fetch(m.data.resource,m.data.options).then((e=>{U.sendSubmitFormResponse(e.ok,m.origin)})).catch((()=>{U.sendSubmitFormResponse(!1,m.origin)}));break;case"ownerShipExperimentShown":e.removeItem("defaultOwnerShipExperiment");break;case"openAcrobatOptions":chrome.runtime.openOptionsPage(),ae(`DCBrowserExt:Viewer:ManagePref:clicked:${m.data.source}`);break;case"openExtensionSettings":const b=e.getItem("openSettingsInWindow");b?chrome.tabs.query({active:!0,currentWindow:!0},(function(t){const a=t[0];e.setItem("lastOpenTabId",a.id),chrome.windows.get(a.windowId,(function(t){const{height:a}=l,n=Math.round(1.2*l.width),r=Math.round(.5*(t.height-a)+t.top),i=Math.round(.5*(t.width-n)+t.left);chrome.windows.create({height:a,width:n,left:i,top:r,focused:!0,type:"popup",url:c},(t=>{e.setItem("settingsWindow",t)}))}))})):chrome.tabs.create({url:c,active:!0}),h.event(w.LOCAL_FILE_ACCESS_TOUCHPOINT_SETTINGS_OPENED,{VARIANT:b?"InWindow":"InTab"}),e.setItem("LocalFileAccessTouchpointsFromViewer",!0),setTimeout((()=>{e.removeItem("LocalFileAccessTouchpointsFromViewer")}),o),X({main_op:"triggerBufferSave"});break;case"encryptedWriteFile":({secureString:W}=m.data),Be(document.title);break;case"launchJump":Ee(m.data.fileBuffer,Te,m.data.source,m.data.userGuid);break;case"saveAsEvent":!async function(e){try{if(ae("DCBrowserExt:Viewer:SaveToMyComputer:"+(N?"fileHandlerExist":"fileHandlerNotExist")),N)G=!1;else{const t={suggestedName:`${e.fileName}.pdf`,types:[{description:"PDF file",accept:{"application/pdf":[".pdf"]}}]};N=await window.showSaveFilePicker(t),G=!0,Be(N?.name)}U._sendMessage({type:"newSaveToLocalResponse",newAsset:G,updatedFileName:N?.name},_.origin)}catch(e){N=null,ge("Save As Handler Error",e),U._sendMessage({type:"newSaveToLocalResponse",error:e},_.origin)}}(m.data);break;case"downloadFile":!async function(e){try{let t=e.fileUrl;if(!t){const a=new Blob([e.fileBuffer],{type:"application/pdf"});t=URL.createObjectURL(a)}await chrome.downloads.download({url:t,conflictAction:"uniquify",saveAs:!0,...e.fileName&&{filename:`${e.fileName}.pdf`}})}catch(e){ge("downloadFile error",e),U._sendMessage({type:"downloadFileError"},_.origin)}}(m.data);break;case"rememberSaveLocationPreference":!function(t){let a="";t.cloudStorage&&!e.getItem("selectedSaveLocationPreference")?a="PreferenceMigrationSuccess":t.cloudStorage||(a="SaveDialogRememberMe");a&&ae(`DCBrowserExt:Viewer:ChangeSaveLocationPreference:${a}`);(!t.cloudStorage||t.cloudStorage&&!e.getItem("selectedSaveLocationPreference"))&&(e.setItem("saveLocation",t.saveLocation),e.setItem("selectedSaveLocationPreference",!0),X({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"saveLocationPreferenceTitle",toggleVal:t.saveLocation}))}(m.data);break;case"appRenderingDone":We();break;case"saveFileBuffer":Ee(m.data.fileBuffer);break;case"deleteFileBuffer":const v=a.getItem("bufferTabId");v&&d.deleteDataFromIndexedDB(v),a.removeItem("bufferTabId");case"appRenderingDone":We();break;case"writeToLocalSavedFile":!async function(e){try{const t=await N.createWritable();await t.write(e.fileBuffer),await t.close(),U._sendMessage({type:"newSaveToLocalResponse",newAsset:G,updatedFileName:N?.name,isFileWriteStage:!0},_.origin)}catch(e){N=null,ge("Write to Local File Error",e),U._sendMessage({type:"newSaveToLocalResponse",error:e,isFileWriteStage:!0},_.origin)}}(m.data);break;case"bookmarkWeb":f(m.data.url,Pe,ae);break;case"updateDocumentViewState":!function(e){const{documentViewState:t}=e;$.writeAndSyncWithHistory(L,t)}(m.data);break;case"validateEdgeCertificateForDigitalSignature":i.validateCertificate(m.data).then((e=>U.sendCertificateValidationResponse(e,m.origin)));break;case"documentViewThemeChange":!function(t){e.getItem("theme")!==t.data&&(e.setItem("theme",t.theme),X({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"appearancePrefTitle",toggleVal:t.theme}));e.getItem("isDarkPageThemeEnabled")!==t.isDarkPageThemeEnabled&&e.setItem("isDarkPageThemeEnabled",t.isDarkPageThemeEnabled)}(m.data);break;case"enableGenAIFeaturesToggledFromViewer":g=m.data,e.getItem("egaf")!==g.isEnabled&&(e.setItem("egaf",g.isEnabled.toString()),X({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"enableGenAIFeaturesTitle",toggleVal:g.isEnabled}));break;case"genAIEligible":!function(t){e.setItem("genAIEligible",t.isEligible.toString())}(m.data)}var g}function ke(e){try{const t=new TextDecoder("utf-8").decode(e.buffer);let a=!1;-1!=t.indexOf("Linearized 1")?a=!0:-1!=t.indexOf("Linearized")&&ae("DCBrowserExt:Viewer:Linearization:Linearized:Version:Other"),U._sendMessage({type:"Linearization",linearized:a},_.origin)}catch(e){ae("DCBrowserExt:Viewer:Linearization:Linearized:Detection:Failed"),ge("Linearization Detection failed",e)}}function Re(t,a,n,r){n.then((n=>{const i=n.downLoadEndTime,o=n.buffer;n.buffer.byteLength;t.preview("preview",o,S,y,r,i,a.origin),U._sendMessage({type:"NavigationStartTime",time:window.performance&&window.performance.timing&&window.performance.timing.navigationStart},_.origin),!0===e.getItem("isSaveLocationPrefEnabled")&&U._sendMessage({type:"changeSaveLocationPreference",saveLocation:e.getItem("saveLocation"),onLoad:!0},_.origin)})).catch((e=>(ae("DCBrowserExt:Viewer:Error:FallbackToNative:FileDownload:Failed"),ee()))).finally((()=>{e.removeItem("sessionStarted")}))}class Ce{constructor(){this.request={main_op:"analytics"}}analytics=e=>{this.request.analytics||(this.request.analytics=[]),this.request.analytics.push([e])};sendAnalytics=()=>{X(this.request)}}function Be(e){e&&(document.title=e+W)}const Ae=(t,a,n)=>{const r=n?"viewerStorage":"viewerStorageAsync",i=e.getItem(r)||{};i[t]=a,e.setItem(r,i)},Fe=t=>{const a=e.getItem("viewerStorage")||{},n=e.getItem("viewerStorageAsync")||{};delete a[t],delete n[t],e.setItem("viewerStorage",a),e.setItem("viewerStorageAsync",n)};function Me(t,n,r,i){return o=>{try{if(o.data&&o.origin&&te(o.origin)&&(e=>{try{return e&&e.source&&e.source.top.location.origin==="chrome-extension://"+chrome.runtime.id}catch(e){return!1}})(o)){if(o.data.main_op)return Ue(t,o);switch(o.data.type){case"ready":if(A?async function(t,n,r,i){let o=new Ce;E=!0;const s=L;document.title=y;const c=V.getHeaderValue("accept-ranges"),l=!a.getItem("bufferTabId")&&c&&"bytes"===c.toLowerCase()?"true":"false";t.sendFileMetaData("metadata",D,S,l,s,y,n.origin,!1),Ne(),r&&r.then((e=>{t.sendInitialBuffer("initialBuffer",e.startTime,e.endTime,e.buffer,n.origin),ke(e)})).catch((e=>{t.sendInitialBuffer("initialBuffer",0,0,-1,n.origin),o.analytics("DCBrowserExt:Viewer:Error:Linearization:InitialBufiled")})),e.removeItem("isReload"),e.removeItem("isBackForward");const d=window.performance&&window.performance.timing&&window.performance.timing.navigationStart,m=_e();(await m).buffer?Re(t,n,m,d):(fetch(i.streamUrl).then((e=>{let a=0;return new Response(new ReadableStream({start(r){const i=e.body.getReader();!function e(){i.read().then((({done:i,value:o})=>{i?r.close():(a+=o.byteLength,t.sendProgress("progress",S,a,n.origin),r.enqueue(o),e())})).catch((e=>{r.error(e)}))}()}}))})).then((e=>e.arrayBuffer())).then((a=>{S=a.byteLength,ye(a),t.preview("preview",a,a.byteLength,y,d,(new Date).getTime(),n.origin),U._sendMessage({type:"NavigationStartTime",time:window.performance&&window.performance.timing&&window.performance.timing.navigationStart},n.origin),!0===e.getItem("isSaveLocationPrefEnabled")&&U._sendMessage({type:"changeSaveLocationPreference",saveLocation:e.getItem("saveLocation"),onLoad:!0},n.origin)})).catch((e=>(o.analytics("DCBrowserExt:Viewer:Error:FallbackToNative:FileDownload:Failed"),ee()))),o.sendAnalytics()),ge("Viewer loaded")}(t,o,r,n):function(e,t,n,r,i){E=!0;const o=L,s=!a.getItem("bufferTabId")&&K("chunk")||"false",c=window.performance.getEntriesByType("navigation").map((e=>e.type)).includes("reload"),l=window.performance.getEntriesByType("navigation").map((e=>e.type)).includes("back_forward");e.sendFileMetaData("metadata",D,S,s,encodeURI(o),y,t.origin,c||l),Ne(),n?n.then((a=>{e.sendInitialBuffer("initialBuffer",a.startTime,a.endTime,a.buffer,t.origin),ke(a)})).catch((a=>{e.sendInitialBuffer("initialBuffer",0,0,-1,t.origin),m.error("Linearization InitialBuffer Failed")})):e.sendInitialBuffer("initialBuffer",0,0,-1,t.origin),Re(e,t,r,i),ge("Viewer loaded")}(t,o,r,n,i),X({main_op:"getUserInfoFromAcrobat"},(e=>{U._sendMessage({type:"adobeYoloUserData",...e},_.origin)})),o.data.visitorID){const t=e.getItem("viewerVisitorID");e.setItem("viewerVisitorID",o.data.visitorID),t&&t!==o.data.visitorID&&ae("DCBrowserExt:Analytics:viewerVisitorID:MCMID:Changed")}break;case"getFileBufferRange":!function(e,t){ve({url:L},e.data.range).then((a=>{B||(B=!0),t.sendBufferRanges("bufferRanges",`${e.data.range.start}-${e.data.range.end}`,a.buffer,e.origin)})).catch((a=>{ae("DCBrowserExt:Viewer:Error:Linearization:Range:Failed"),t.sendBufferRanges("bufferRanges",`${e.data.range.start}-${e.data.range.end}`,-1,e.origin)}))}(o,t);break;case"previewFailed":C||(ae("DCBrowserExt:Viewer:Error:FallbackToNative:Preview:Failed"),C=!0,ee());break;case"lastUserGuid":e.setItem("lastUserGuid",o.data.value);break;case"signin":ae("DCBrowserExt:Viewer:Ims:Sign:In"),ie();break;case"signout":ae("DCBrowserExt:Viewer:Ims:Sign:Out"),e.removeItem("viewer-locale"),e.removeItem("userDetailsFetchedTimeStamp"),e.removeItem("discoveryExpiryTime"),e.removeItem("viewer-locale"),Ee(o.data.fileBuffer,oe);break;case"googleAppsPrintShown":a.setItem("googleAppsPrint","false"),ae("DCBrowserExt:Viewer:GoogleApps:Print:Shown");break;case"signInExperimentShown":chrome.tabs.query({active:!0,currentWindow:!0},(function(t){const a=t[0],n=(new Date).getTime();e.setItem("signInExperimentShown",JSON.stringify({currTabId:a.id,timestamp:n}))}));break;case"disableViewer":e.setItem("pdfViewer","false"),chrome.tabs.reload();break;case"signInExperimentClosed":case"signInExperimentSkipped":e.setItem("signInExperimentSuppressed","true");break;case"enableBeta":e.setItem("betaOptOut","false"),chrome.tabs.reload();break;case"disableBeta":e.setItem("betaOptOut","true"),chrome.tabs.reload();break;case"updateTitle":Be(o.data.title);break;case"viewer_set_item":Ae(o.data.key,o.data.value,o.data.startup);break;case"viewer_remove_item":Fe(o.data.key)}}}catch(e){ae("DCBrowserExt:Viewer:Error:MessageHandler:Unknown")}}}function xe(){if(!P)return ae("DCBrowserExt:Viewer:Error:Handshake:TimedOut"),ee(),!1}const Oe=t=>{try{e.getItem("enableCSRF")&&pe();const n=V.getHeaderValue("content-length");S=n;const r=V.getHeaderValue("accept-ranges"),i=r&&"bytes"===r.toLowerCase();L=t.originalUrl,we(),y=function(){let e;const t=V.getHeaderValue("content-disposition");if(t&&/\.pdf(["']|$)/i.test(t)){const a=/filename[^;=\n\*]?=((['"]).*?\2|[^;\n]*)/.exec(t);null!=a&&a.length>1&&(e=a[1].replace(/['"]/g,""))}return e||(e=be(L)),decodeURIComponent(e)}();const o={url:L},s=new URL(e.getItem("cdnUrl"));_||(_=s);let c=null;const l="false"!==K("linearization")&&!a.getItem("bufferTabId");l&&i&&n>0&&(c=ve(o,{start:0,end:1024})),window.addEventListener("message",Me(U,t,c)),$e(),setTimeout(xe,25e3)}catch(e){ge("InitMimeHandlerScript failed",e),ee()}},Ve=async()=>{try{if(e.getItem("enableCSRF")&&pe(),!Y(L))return void(T=!1);we();const t=K("clen")||-1,n=K("chunk")||!1,r="false"!==K("linearization")&&!a.getItem("bufferTabId"),i={url:L},o=(new Date).getTime(),s=new URL(e.getItem("cdnUrl"));y=K("pdffilename")||be(L),document.title=decodeURIComponent(y),_||(_=s);let c=null;const l=r&&n&&t>0;l&&(c=ve(i,{start:0,end:1024}));const d=_e(),m=(await d).buffer?d:Le(U,l,s.origin);window.addEventListener("message",Me(U,m,c,o)),setTimeout(xe,25e3),(()=>{try{L&&(e=L,e?.includes("acrobatPromotionSource"))&&ae(`DCBrowserExt:Viewer:ExtnViewerPdfOpened:${Z(new URL(L)?.search,"acrobatPromotionSource")}`)}catch(e){}var e})()}catch(e){ge("InitScript failed",e),ee()}};function Ne(){if(a.getItem("signInAction")){const e=a.getItem("signInAction");U._sendMessage({type:"signInInformation",action:e,source:"signIn"===e?a.getItem("signInSource"):a.getItem("signUpSource")},_.origin),a.removeItem("signInSource"),a.removeItem("signUpSource"),a.removeItem("signInAction")}}async function $e(){chrome.storage.onChanged.addListener(((t,a)=>{"local"===a&&Object.entries(t).forEach((([t,{newValue:a}])=>{switch(t){case"theme":U._sendMessage({type:"themeChange",theme:a},_.origin);break;case"ANALYTICS_OPT_IN_ADMIN":{const t="false"!==e.getItem("logAnalytics"),n="false"!==a;U._sendMessage({type:"analyticsTrackingChange",value:t&&n},_.origin);break}case"saveLocation":U._sendMessage({type:"changeSaveLocationPreference",saveLocation:a},_.origin);break;case"isDarkPageThemeEnabled":U._sendMessage({type:"darkPageThemeChange",isDarkPageThemeEnabled:a},_.origin);break;case"egaf":U._sendMessage({type:"enableGenAIFeaturesToggled",enableGenAIFeatures:a},_.origin);break;case"akamai":X({main_op:"reRegisterUninstallUrl"})}}))})),await async function(){return v=await i.isInstalledViaUpsell(),v}(),U._sendMessage({type:"setAsyncStorage",storage:e.getItem("viewerStorageAsync")},_.origin),X({main_op:"viewer-startup",url:L,startup_time:Date.now(),viewer:!0},(e=>{de.isSharePointURL=!!e.isSharePointURL,de.isSharePointFeatureEnabled=!!e.isSharePointEnabled,de.isFrictionlessEnabled=!!e.isFrictionlessEnabled,de.featureFlags=e.featureFlags,de.isFillAndSignRegisteryEnabled=e.isFillnSignEnabled;const t=ne().href;U.sendStartupConfigs(t,_.origin)})),X({main_op:"get-features&groups",cachePurge:"LAZY"},(e=>{U._sendMessage({type:"featureGroups",featureGroups:e.featureGroups,featureFlags:e.featureFlags,ffResponse:e.ffResponse},_.origin)})),A?setTimeout((()=>he("loadedTabsInfo",F)),2e3):X({main_op:"updateLoadedTabsInfo"}),$.writeAndSyncWithHistory(L,{filename:y,lastVisited:Date.now()})}function He(e){X({main_op:"caret_mode_toggle_handler",toggleCaretModeValue:e})}function Ge(t){if(t.panel_op&&!0===t.reload_in_native&&(delete t.is_viewer,chrome.tabs.reload(t.tabId)),"relay_to_content"!==t.main_op||"dismiss"!==t.content_op)return"relay_to_content"===t.main_op&&"caret_mode_toggle_handler"===t.content_op?U._sendMessage({type:"toggleCaretMode",toggleCaretModeValue:t.status},_.origin):"reset"===t.main_op?U._sendMessage({type:"toggleAnalytics",logAnalytics:t.analytics_on},_.origin):"showUninstallPopUp"===t.main_op?U._sendMessage({type:"showUninstallPopUp"},_.origin):"jumpUrlSuccess"===t.main_op?(!A||t.tabInfo&&t.tabInfo.includes(F))&&U._sendMessage({type:"adobeYoloJumpUrlSuccess"},_.origin):"triggerBufferSave"===t.main_op?U._sendMessage({type:"triggerBufferSave"},_.origin):"showLocalFileAccessToast"===t.content_op?t.tabId&&t.tabId!==e.getItem("lastOpenTabId")||U._sendMessage({type:"showLocalFileAccessToast"},_.origin):"downloadFileSuccess"===t.main_op&&U._sendMessage({type:"downloadFileSuccess"},_.origin),!1;{delete t.content_op,delete t.reload_in_native;let e=document.getElementById("__acrobatDialog__");e&&(e.remove(),e=null)}}function We(){const t=e.getItem("userState");let a=!1;if(void 0!==t?.rvu&&(a=!0),!0!==t.rvu){const t={rvu:a};e.setItem("userState",t)}}document.addEventListener("DOMContentLoaded",function(e){const t=(new Date).getTime();let a=window.setInterval((function(){(function(){const e=document.getElementById("dc-view-frame");return e&&e.contentWindow&&1===e.contentWindow.length}()||(new Date).getTime()-t>15e3)&&(window.clearInterval(a),e.call(this))}),200)}((function(){const e=document.getElementById("dc-view-frame");e&&e.contentWindow&&e.contentWindow.focus()}))),void 0!==chrome.runtime&&($=new I,i.isMimeHandlerAvailable().then((async function(t){if(chrome.runtime.onMessage.addListener(Ge),t){if(A=!0,!window.navigator.onLine&&e.getItem("offlineSupportDisable"))return void ee();e.getItem("sessionStarted")||(e.setItem("sessionId",n.uuid()),e.setItem("sessionStarted",!0));const t=await i.getStreamInfo()||{};V=new p(t.responseHeaders),F=t.tabId;let a=await X({main_op:"check-is-google-print"});M=a&&a.isGooglePrint,O=await i.caretModeStatus(),i.addCaretModeListener(He),X({main_op:"viewer-preview",startup_time:Date.now(),viewer:!0},(()=>Oe(t))),X({main_op:"setupWorkerOffscreen"});e.getItem("firstOpenedTabId")||e.setItem("firstOpenedTabId",F)}else Q(),Ve(),$e()})))}();