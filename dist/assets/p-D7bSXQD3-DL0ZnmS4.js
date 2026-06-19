import{a5 as o,a6 as s,a7 as r,a8 as i,a9 as m}from"./index-DL-VqMAM.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const d=()=>{const e=window;e.addEventListener("statusTap",()=>{o(()=>{const a=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!a)return;const t=s(a);t&&new Promise(n=>r(t,n)).then(()=>{i(async()=>{t.style.setProperty("--overflow","hidden"),await m(t,300),t.style.removeProperty("--overflow")})})})})};export{d as startStatusTap};
