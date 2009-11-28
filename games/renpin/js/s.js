
//function $(s){if(document.getElementById){return eval('document.getElementById("' + s + '")');}else{return eval('document.all.' + s);}}
function s(s){if (!$(s)) return; $(s).style.display = "block";}
function h(s){if (!$(s)) return; $(s).style.display = "none";}
function sh(s){if (!$(s)) return; $(s).style.display = $(s).style.display == "none"?"block":"none";}
function hs(s){if (!$(s)) return; $(s).style.display = $(s).style.display == "block"?"none":"block";}
function vv(s){if (!$(s)) return; $(s).style.visibility = "visible";}
function vh(s){if (!$(s)) return; $(s).style.visibility = "hidden";}

var flag = 0;
function hy(){
	for(var i=1;i<=4;i++){
		$("hn"+i).className = "hn_of";
		s("hn_xx"+i);
		h("hn"+i+"_l");
		setflag("hn"+i+"_l");
	}
}
function xs(n){
	hy();
	s("hn"+n+"_l");
	$("hn"+n+"_l").focus();
	h("hn_xx"+n);
	$("hn"+n).className = "hn_on";
	void(0);
}
function setflag(s){
	if (!$(s)) return;
	if (document.all ? true : false){
		$(s).onmouseover = function () { hnmouseover(event); };
		$(s).onmouseout = function () { hnmouseout(event); };
	}
	else{
		$(s).addEventListener("mouseover", function (evnt) { hnmouseover(evnt); }, false);
		$(s).addEventListener("mouseout", function (evnt) { hnmouseout(evnt); }, false);
	}
}
function hnmouseover(event){ flag = 1; }
function hnmouseout(event){ flag = 0; }
function init(){
	if (document.all ? true : false){
		document.onmousedown = function () { mousedown(event); };
	}
	else{
		document.addEventListener("mousedown", function (evnt) { mousedown(evnt); }, false);
	}
}
function mousedown(evnt){
	if(flag == 0){ hy(); }
}

function mes(m,n){
	h("r42"+n);
	s("r42"+m);
	$("ms").src = "http://img1.kaixin001.com.cn/i/ms_"+n+".gif";
	$("es").src = "http://img1.kaixin001.com.cn/i/es_"+m+".gif";
}

function bq_hy(){
	for(var i=1;i<=3;i++){
		$("bq"+i).className = "bq_of";
		$("bq"+i+"_d").style.display = "none";
	}
	$("bq1").className = "bq1_of";
}
function bq_on(bq, n){
	bq_hy();
	if(bq.id == "bq1"){
		bq.className = "bq1_on";
		$("r30").style.display = "block";
	}
	else{
		bq.className = "bq_on";
		$("r30").style.display = "none";
	}
	$("bq"+n+"_d").style.display = "block";
}
function bq_hy5(){
	for(var i=1;i<=5;i++){
		$("bq"+i).className = "bq_of";
		$("bq"+i+"_d").style.display = "none";
	}
	$("bq1").className = "bq1_of";
}
function bq_on5(bq, n){
	bq_hy5();
	if(bq.id == "bq1") bq.className = "bq1_on";
	else bq.className = "bq_on";
	$("bq"+n+"_d").style.display = "block";
}
function zt_hy(){
	for(var i=1;i<=12;i++){
		$("zt"+i).className = "x_zt1";
	}
}
function zt_on(zt){
	if(zt.className == "x_zt3") return false;
	else{
		zt.className = "x_zt2";
	}
}
function zt_of(zt){
	if(zt.className == "x_zt3") return false;
	else{
		zt.className = "x_zt1";
	}
}
function zt_now(zt){
	if(zt.className == "x_zt3") return false;
	else{
		zt_hy();
		zt.className = "x_zt3";
	}
}
function cc1_now(cc){
	for(var i=1;i<=3;i++){
		$("cc1_d"+i).className = "cc_f";
	}
	cc.className = "cc_n";
}
function cc2_now(cc){
	for(var i=1;i<=3;i++){
		$("cc2_d"+i).className = "cc_f";
	}
	cc.className = "cc_n";
}
function fg_hy(){
	for(var i=1;i<=12;i++){
		$("x_fg"+i).className = "x_fg1";
	}
}
function fg_on(fg){
	if(fg.className == "x_fg3") return false;
	else{
		fg.className = "x_fg2";
	}
}
function fg_of(fg){
	if(fg.className == "x_fg3") return false;
	else{
		fg.className = "x_fg1";
	}
}
function fg_now(fg){
	if(fg.className == "x_fg3") return false;
	else{
		fg_hy();
		fg.className = "x_fg3";
	}
}
function z_fl_now(fl){
	for(var i=1;i<=6;i++){
		$("z_fl"+i).className = "r30_f";
	}
	fl.className = "r30_n";
}

function nn_c(){
	nn.style.color = (nn.style.color!="#fff")?"#fff":"#e88f9d";
	setTimeout("nn_c()",1000);
}

function ep_hy(){
	for(var i=1;i<=12;i++){
		$("ep"+i).src = "i/editor/ep"+i+"_1.gif";
	}
}
function ep_cc(p,n){
	ep_hy();
	p.src = "i/editor/ep"+n+"_3.gif";
}
function ep_on(p,n){
	if(/3.gif/g.test(p.src)) return false;
	else p.src = "i/editor/ep"+n+"_2.gif";
}
function ep_of(p,n){
	if(/3.gif/g.test(p.src)) return false;
	else p.src = "i/editor/ep"+n+"_1.gif";
}

function pe_hy(){
	for(var i=1;i<=6;i++){
		$("pe"+i).src = "i/editor/pe"+i+"_1.gif";
	}
}
function pe_cc(p,n){
	pe_hy();
	p.src = "i/editor/pe"+n+"_3.gif";
}
function pe_on(p,n){
	if(/3.gif/g.test(p.src)) return false;
	else p.src = "i/editor/pe"+n+"_2.gif";
}
function pe_of(p,n){
	if(/3.gif/g.test(p.src)) return false;
	else p.src = "i/editor/pe"+n+"_1.gif";
}
