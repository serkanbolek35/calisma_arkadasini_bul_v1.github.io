import{c as r}from"./PublicLayout-D-U2DQrY.js";/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=r("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),a=e=>typeof e=="string"&&e.toLowerCase().endsWith(".edu.tr"),n=e=>{const t=[];return e.length<8&&t.push("En az 8 karakter olmalıdır"),/[A-Z]/.test(e)||t.push("En az bir büyük harf içermelidir"),/[a-z]/.test(e)||t.push("En az bir küçük harf içermelidir"),/[0-9]/.test(e)||t.push("En az bir rakam içermelidir"),/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(e)||t.push("En az bir özel karakter içermelidir"),t},c=e=>{let t=0;return e.length>=8&&t++,e.length>=12&&t++,/[A-Z]/.test(e)&&t++,/[a-z]/.test(e)&&t++,/[0-9]/.test(e)&&t++,/[^A-Za-z0-9]/.test(e)&&t++,t<=2?{level:"weak",label:"Zayıf",color:"#C84040"}:t<=4?{level:"medium",label:"Orta",color:"#E8A020"}:{level:"strong",label:"Güçlü",color:"#3A8A5A"}};export{l as C,c as g,a as i,n as v};
