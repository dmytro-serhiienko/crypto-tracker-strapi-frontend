System.register(["./index-legacy-BFBOeCqG.js"],function(e,t){"use strict";var n,r,s,o,a;return{setters:[e=>{n=e.a5,r=e.a6,s=e.a7,o=e.a8,a=e.a9}],execute:function(){
/*!
			 * (C) Ionic http://ionicframework.com - MIT License
			 */
e("startStatusTap",()=>{const e=window;e.addEventListener("statusTap",()=>{n(()=>{const t=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!t)return;const n=r(t);n&&new Promise(e=>s(n,e)).then(()=>{o(async()=>{n.style.setProperty("--overflow","hidden"),await a(n,300),n.style.removeProperty("--overflow")})})})})})}}});
