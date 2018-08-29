function loadingTool() {
	this.hasInit=false;
}

loadingTool.prototype.loading = function() {
	if(this.hasInit==false){
		this.loadCssCode(".uk-animation-fade{-webkit-animation-name:uk-fade;animation-name:uk-fade;-webkit-animation-duration:.8s;animation-duration:.8s;-webkit-animation-timing-function:linear!important;animation-timing-function:linear!important}.uk-overlay-panel{position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;padding:20px;color:#fff}.uk-overlay-background{background:rgba(0,0,0,.5)}.sk-spinner-circle.sk-spinner{position:relative;margin-top:79%;margin-right:auto;margin-left:auto;width:50px;height:50px}.sk-spinner-circle .sk-circle{position:absolute;top:0;left:0;width:100%;height:100%}.sk-spinner-circle .sk-circle:before{display:block;margin:0 auto;width:20%;height:20%;border-radius:100%;background-color:#FFF;content:'';-webkit-animation:sk-circleBounceDelay 1.2s infinite ease-in-out;animation:sk-circleBounceDelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.sk-spinner-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg);-ms-transform:rotate(30deg)}.sk-spinner-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg);-ms-transform:rotate(60deg)}.sk-spinner-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg);-ms-transform:rotate(90deg)}.sk-spinner-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg);-ms-transform:rotate(120deg)}.sk-spinner-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg);-ms-transform:rotate(150deg)}.sk-spinner-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg);-ms-transform:rotate(180deg)}.sk-spinner-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg);-ms-transform:rotate(210deg)}.sk-spinner-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg);-ms-transform:rotate(240deg)}.sk-spinner-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg);-ms-transform:rotate(270deg)}.sk-spinner-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg);-ms-transform:rotate(300deg)}.sk-spinner-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg);-ms-transform:rotate(330deg)}.sk-spinner-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-spinner-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-spinner-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-spinner-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-spinner-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-spinner-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-spinner-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-spinner-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-spinner-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-spinner-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-spinner-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleBounceDelay{0%,100%,80%{-webkit-transform:scale(0);transform:scale(0)}40%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes sk-circleBounceDelay{0%,100%,80%{-webkit-transform:scale(0);transform:scale(0)}40%{-webkit-transform:scale(1);transform:scale(1)}}");
		this.hasInit=true;
		console.log("加载loading-css");
	}
	console.log("启动loading");
	if(!!document.getElementsByClassName("loadingAjax")[0]){
		return;
	}
	var icon = "<div class=\"uk-animation-fade sk-spinner sk-spinner-circle\"><div class=\"sk-circle1 sk-circle\"></div><div class=\"sk-circle2 sk-circle\"></div><div class=\"sk-circle3 sk-circle\"></div><div class=\"sk-circle4 sk-circle\"></div><div class=\"sk-circle5 sk-circle\"></div><div class=\"sk-circle6 sk-circle\"></div><div class=\"sk-circle7 sk-circle\"></div><div class=\"sk-circle8 sk-circle\"></div><div class=\"sk-circle9 sk-circle\"></div><div class=\"sk-circle10 sk-circle\"></div><div class=\"sk-circle11 sk-circle\"></div><div class=\"sk-circle12 sk-circle\"></div></div>";
	var div2 = document.createElement("div");
	div2.className = "loadingAjax uk-overlay-panel uk-overlay-background";
	div2.innerHTML = icon;
	document.body.appendChild(div2);
};

loadingTool.prototype.cancelLoading = function() {
	if(!document.getElementsByClassName("loadingAjax")[0]){
		return;
	}
	document.getElementsByClassName("loadingAjax")[0].remove();
};

loadingTool.prototype.loadCssCode = function(code) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.rel = 'stylesheet';
	//for Chrome Firefox Opera Safari
	style.appendChild(document.createTextNode(code));
	//for IE
	//style.styleSheet.cssText = code;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(style);
};

