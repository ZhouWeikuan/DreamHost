function showDivNavTips(curDiv){
    var divTips=document.getElementById('divNavTips');
    var html;
    if (curDiv == "home"){
        html = '见贤思齐,见不贤而内自省,快回家反省吧'; 
    } else if (curDiv=="tool"){
        html = '光靠朋友是不行的哦,偶尔也要耍耍赖'; 
    } else if (curDiv=="rank"){
        html = '不比不知道,一比吓一跳,看看你在好友心目中排第几';
    } else if (curDiv=="help"){
        html = '熟悉规则可是利用规则的前提条件';
    } else {
        html = '';
    }
    divTips.innerHTML = html;
    divTips.style.display="block";
}

function closeDivNavTips(){
    var divTips=document.getElementById('divNavTips');
    divTips.innerHTML = "";
    divTips.style.display="none";
}

function showDivRPTips(user){
    var divTips=document.getElementById('divRPTips');
    divTips.innerHTML = "点击分数查看" + user + "在游戏中的总排名!";
    divTips.style.display="block";
}

function closeDivRPTips(){
    var divTips=document.getElementById('divRPTips');
    divTips.innerHTML = "";
    divTips.style.display="none";
}

function showDivSettingTips(){
    var divTips=document.getElementById('divSettingTips');
    divTips.innerHTML = "丢人不能丢阵,撂下几句狠话充充场子";
    divTips.style.display="block";
}

function closeDivSettingTips(){
    var divTips=document.getElementById('divSettingTips');
    divTips.innerHTML = "";
    divTips.style.display="none";
}

function showDivHelpTips(){
    var divTips=document.getElementById('divHelpTips');
    divTips.innerHTML = "助人就是助己,亲爱的朋友,我来帮助你!";
    divTips.style.display="block";
}

function closeDivHelpTips(){
    var divTips=document.getElementById('divHelpTips');
    divTips.innerHTML = "";
    divTips.style.display="none";
}

function showDivHarmTips(user){
    var divTips=document.getElementById('divHarmTips');
    divTips.innerHTML = "嘿嘿嘿,有仇来报仇,没仇也要结成冤家!";
    divTips.style.display="block";
}

function closeDivHarmTips(){
    var divTips=document.getElementById('divHarmTips');
    divTips.innerHTML = "";
    divTips.style.display="none";
}

