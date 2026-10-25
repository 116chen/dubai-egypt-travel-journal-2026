import{c as d,a as p,A as v,s as M,t as b}from"./index-0jLSmIFP.js";import{r as t,j as n}from"./react-DhK6i0qw.js";import{u as z,e as A,L,A as y,G as E,T as h,B as I}from"./mantine-BlxYUAoA.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=d("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=d("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=d("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=d("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=d("Map",[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]]);function S({state:e,onClose:g}){const u=z("(max-width: 760px)",!1,{getInitialValueInEffect:!1}),[x,f]=t.useState({owner:null,index:0}),[k,w]=t.useState(""),s=t.useRef(null),c=x.owner===e?x.index:(e==null?void 0:e.index)??0,a=e==null?void 0:e.items[c],l=t.useCallback(i=>{!e||e.items.length<2||f(r=>({owner:e,index:((r.owner===e?r.index:e.index)+i+e.items.length)%e.items.length}))},[e]);return t.useEffect(()=>{if(!e)return;const i=r=>{var o;(o=r.target)!=null&&o.closest('input, textarea, [contenteditable="true"]')||(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),l(r.key==="ArrowRight"?1:-1))};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[e,l]),t.useEffect(()=>{if(!e||e.items.length<2)return;const i=new Image;i.src=p(e.items[(c+1)%e.items.length].src)},[e,c]),n.jsx(A,{opened:!!e,onClose:g,size:"min(1150px, 95vw)",zIndex:300,fullScreen:u,title:n.jsxs(h,{size:"sm",children:[c+1," / ",(e==null?void 0:e.items.length)??0," · 旅行照片"]}),classNames:{body:"viewer-body",content:"viewer-content",header:"viewer-header"},"data-testid":"photo-viewer",closeButtonProps:{"aria-label":"关闭照片"},children:a&&n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"viewer-stage",onPointerDown:i=>{var r;if(i.pointerType==="touch"){if(!i.isPrimary||(((r=window.visualViewport)==null?void 0:r.scale)??1)>1){s.current=null;return}s.current={id:i.pointerId,x:i.clientX,y:i.clientY},i.currentTarget.setPointerCapture(i.pointerId)}},onPointerCancel:()=>{s.current=null},onPointerUp:i=>{var m;const r=s.current;if(s.current=null,!r||r.id!==i.pointerId||(((m=window.visualViewport)==null?void 0:m.scale)??1)>1)return;const o=i.clientX-r.x,j=i.clientY-r.y;Math.abs(o)>=56&&Math.abs(j)<Math.abs(o)*.65&&l(o<0?1:-1)},children:[k!==a.id&&n.jsx(L,{size:"sm",color:"gray",className:"viewer-loading","aria-label":"正在加载照片"}),n.jsx(y,{variant:"light",disabled:e.items.length<2,"aria-label":"上一张照片",onClick:()=>l(-1),children:n.jsx(v,{size:19,"aria-hidden":"true"})}),n.jsx("img",{src:p(a.src),alt:a.caption,width:a.width,height:a.height,onLoad:()=>w(a.id),onError:()=>w(a.id),"data-testid":"viewer-image"}),n.jsx(y,{variant:"light",disabled:e.items.length<2,"aria-label":"下一张照片",onClick:()=>l(1),children:n.jsx(P,{size:19,"aria-hidden":"true"})})]}),n.jsxs(E,{justify:"space-between",mt:"lg",align:"flex-start",className:"viewer-caption",children:[n.jsxs("div",{children:[n.jsx(h,{fw:500,"aria-live":"polite",children:a.caption}),n.jsxs(h,{size:"xs",c:"dimmed",mt:5,children:[M(a.date)," · ",b(a)," · ",a.place]})]}),n.jsx(I,{component:"a",href:p(a.src),target:"_blank",rel:"noopener noreferrer",variant:"subtle",rightSection:n.jsx(B,{size:14,"aria-hidden":"true"}),children:"高清照片"})]}),u&&e.items.length>1&&n.jsx(h,{className:"swipe-hint",size:"xs",children:"左右滑动翻照片，也可以点箭头。"})]})})}export{P as A,q as B,C as D,B as E,N as M,S as P};
