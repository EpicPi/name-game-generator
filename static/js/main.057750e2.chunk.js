(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{130:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(59),s=n.n(i),c=(n(70),n(9)),l=n.n(c),u=n(19),o=n(28),p=n(60),f=n(61),m=n(63),h=n(62),b=n(64),d=n(2),g=(n(74),n(29)),v=n.n(g),O=(n(128),function(e){function t(e){var n;return Object(p.a)(this,t),(n=Object(m.a)(this,Object(h.a)(t).call(this,e))).state={clubName:"",mFile:"",fFile:"",out:null,mNames:[],step:0},n.fileUpload=n.fileUpload.bind(Object(d.a)(Object(d.a)(n))),n.textInput=n.textInput.bind(Object(d.a)(Object(d.a)(n))),n.getForm=n.getForm.bind(Object(d.a)(Object(d.a)(n))),n.onSubmit=n.onSubmit.bind(Object(d.a)(Object(d.a)(n))),n.getLoading=n.getLoading.bind(Object(d.a)(Object(d.a)(n))),n.getOutput=n.getOutput.bind(Object(d.a)(Object(d.a)(n))),n.processData=n.processData.bind(Object(d.a)(Object(d.a)(n))),n.getNames=n.getNames.bind(Object(d.a)(Object(d.a)(n))),n}return Object(b.a)(t,e),Object(f.a)(t,[{key:"fileUpload",value:function(e){"application/zip"!==e.target.files[0].type?(alert("please upload only zip files of the images"),e.target.value=""):this.setState(Object(o.a)({},e.target.name,e.target.files[0]))}},{key:"textInput",value:function(e){this.setState(Object(o.a)({},e.target.name,e.target.value))}},{key:"onSubmit",value:function(){var e=Object(u.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log(this.state.mFile),t.preventDefault(),this.setState({step:1}),this.processData();case 4:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"processData",value:function(){var e=Object(u.a)(l.a.mark(function e(){var t,n,a,r,i,s,c,u,o=this;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=[],n=[],e.next=4,v.a.loadAsync(this.state.mFile);case 4:return a=e.sent,e.next=7,v.a.loadAsync(this.state.fFile);case 7:r=e.sent,i=this.getNames(a),this.addSingles(i,"Male",t),i=i.filter(function(e){return e.includes("&")}),s=this.getNames(r),this.addSingles(s,"Female",t),s=s.filter(function(e){return e.includes("&")}),console.log(t),console.log(i),console.log(s),c=[],i.forEach(function(e){try{var t=o.removeEnd(e).split(",")[1].split("&");c.push(t)}catch(a){n.push(e)}}),console.log(c),u=[],this.getGenders(c,u);case 22:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"removeEnd",value:function(e){var t=e.split("-");return t.pop(),t.join("")}},{key:"addSingles",value:function(e,t,n){var a=this;(e=e.filter(function(e){return!e.includes("&")})).forEach(function(e){var r=a.removeEnd(e),i=r.split(",")[1],s=r.split(",")[0];n.push({file:e,first:i,last:s,gender:t})})}},{key:"getNames",value:function(e){var t=[];try{e.forEach(function(e,n){n.dir||n.name.startsWith("__MACOSX")||t.push(n.name)})}catch(n){alert(n.message),this.setState({step:0})}return t}},{key:"getGenders",value:function(){var e=Object(u.a)(l.a.mark(function e(t,n){var a,r,i,s,c,u,o;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=!0,r=!1,i=void 0,e.prev=3,s=t[Symbol.iterator]();case 5:if(a=(c=s.next()).done){e.next=19;break}if(u=c.value,this.contains(n,u)){e.next=16;break}return console.log(u[0]),e.next=11,fetch("https://api.genderize.io/?name="+"Albert".split(" ")[0]);case 11:return e.next=13,e.sent.json();case 13:o=e.sent,console.log(o.json);case 16:a=!0,e.next=5;break;case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(3),r=!0,i=e.t0;case 25:e.prev=25,e.prev=26,a||null==s.return||s.return();case 28:if(e.prev=28,!r){e.next=31;break}throw i;case 31:return e.finish(28);case 32:return e.finish(25);case 33:case"end":return e.stop()}},e,this,[[3,21,25,33],[26,,28,32]])}));return function(t,n){return e.apply(this,arguments)}}()},{key:"contains",value:function(e,t){return e.filter(function(e){return e.names===t}).length}},{key:"getForm",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("form",null,"Club Name: ",r.a.createElement("input",{type:"text",value:this.state.clubName,name:"clubName",onChange:this.textInput}),r.a.createElement("br",null),r.a.createElement("br",null),"Male zip file: ",r.a.createElement("input",{type:"file",name:"mFile",onChange:this.fileUpload}),r.a.createElement("br",null),r.a.createElement("br",null),"Female zip file: ",r.a.createElement("input",{type:"file",name:"fFile",onChange:this.fileUpload}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("input",{type:"submit",value:"Process",onClick:this.onSubmit})))}},{key:"getLoading",value:function(){return r.a.createElement("div",null,"Loading")}},{key:"getOutput",value:function(){return r.a.createElement("div",null,"Output")}},{key:"render",value:function(){return 0===this.state.step?this.getForm():1===this.state.step?this.getLoading():this.getOutput()}}]),t}(a.Component));s.a.render(r.a.createElement(O,null),document.getElementById("root"))},65:function(e,t,n){e.exports=n(130)},70:function(e,t,n){},74:function(e,t,n){},80:function(e,t){},82:function(e,t){}},[[65,2,1]]]);
//# sourceMappingURL=main.057750e2.chunk.js.map