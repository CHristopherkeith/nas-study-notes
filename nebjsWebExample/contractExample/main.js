var nebulas = require("nebulas");
var HttpRequest = nebulas.HttpRequest;
var Neb = nebulas.Neb;
var Account = nebulas.Account;
var Transaction = nebulas.Transaction;
var Unit = nebulas.Unit;
Utils = nebulas.Utils;
var myneb = new Neb();
var nasApi = myneb.api;
myneb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));
var account, tx, txhash;

var wallet_address;
var wallet_balance;

var haswallet = false;

const PRICE_EGG = 0.1;
const HATCH_PRICE = 0.99;
const EGG_PRODUCE_RATE = 0.04;
const HATCH_TIME = 1000*24*60*60;

// var dappAddress = "n1kfKd8hqXHdazUrEsBWqDYRfgRPgRvZCkd";  //测试网
var dappAddress = "n1r28W9Di8y7NN8ka4ES8Tkw6YCVeDoqtSJ"; //主网

if (typeof (webExtensionWallet) === "undefined") {

    hui("#wallet_address").html("没有检测到星云钱包，安装钱包后使用(需要用Chrome浏览器)");
    hui("#wallet_url").show();
} else {
    haswallet = true;
}

var farmInfo;
var nebState;

hui("#defaulproduction").html(EGG_PRODUCE_RATE);



hui("#hatchp").hide();

    hui("#buynumdiv").hide();
    hui("#hatchnumdiv").hide();
    hui("#sellnumdiv").hide();


function getWallectInfo() {
    console.log("getWallectInfo");
    window.addEventListener('message', getMessage);

    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");
}

function getMessage(e){
    if (e.data && e.data.data) {
        console.log("e.data.data:", e.data.data)
        if (e.data.data.account) {
            var address = e.data.data.account;
            wallet_address = address;
            console.log("address="+address);
            hui("#wallet_address").html(address);
            refresh();
            nasApi.getAccountState({
                address: address
            }).then(function (resp) {
                var amount = Unit.fromBasic(Utils.toBigNumber(resp.balance), "nas").toNumber()//账号余额
                console.log("余额："+amount);
                this.wallet_balance = amount;
                hui("#wallet_balance").html(amount);
            });
        }
    }
   
}



hui("#getfreechicken").click(function(){
    if(!checkWallet())return;
    adoptChicken();
});

getDataAndRefresh();
setInterval("getDataAndRefresh()",30000);

function getDataAndRefresh() {
    nasApi.getNebState().then(function (state) {
        nebState = state
        getWallectInfo()
    });
}


hui("#refresh").click(function(){
    if(!checkWallet())return;
    uploadData();
});


hui("#hatchbtn").click(function(){
    if(!checkWallet())return;
    hatch();
});

hui("#sellBtn").click(function(){
    if(!checkWallet())return;
    sell();
});

hui("#sellsurebtn").click(function(){
    sellSure();
});


hui("#buyBtn").click(function(){
    if(!checkWallet())return;
    buyEgg();
});

hui("#buysurebtn").click(function(){
    buySure();
});

hui("#hatchsurebtn").click(function(){
    hatchSure();
});


hui("#withdrawBtn").click(function(){
    withdraw();
});


function checkWallet() {
    if(!haswallet){
        alert("请先安装星云钱包");
    }
    return haswallet;
}

function withdraw(params) {
    var num = 0.1;
    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": 0,
            "contract": {
                "function": "withdraw",
                "args": JSON.stringify([num])
            }
        },
        "method": "neb_sendTransaction"
    }, "*");


};

function buyEgg(params) {
    if(this.wallet_balance<PRICE_EGG){
        alert("余额不足，请往钱包充值");
    }else{
        hui("#buynumdiv").show();
    }
}


function sellSure(){
    var num = hui("#sellnumber").val();
    console.log("num="+num);
    if(num<1){
        alert("需要大于0个");
    }else{
        if(num>farmInfo.egg){
            alert("鸡蛋数目不够，可以去购买鸡蛋");
            return;
        }
        window.postMessage({
            "target": "contentscript",
            "data": {
                "to": dappAddress,
                "value": 0,
                "contract": {
                    "function": "sellEgg",
                    "args": JSON.stringify([num])
                }
            },
            "method": "neb_sendTransaction"
        }, "*");

    }
}

function hatchSure(){
    var num = hui("#hatchnumber").val();
    console.log("num="+num);
    if(num<1){
        alert("需要大于0个");
    }else{
        if(num>farmInfo.egg){
            alert("鸡蛋数目不够，可以去购买鸡蛋");
            return;
        }
        window.postMessage({
            "target": "contentscript",
            "data": {
                "to": dappAddress,
                "value": num*HATCH_PRICE,
                "contract": {
                    "function": "hatchEgg",
                    "args": JSON.stringify([num])
                }
            },
            "method": "neb_sendTransaction"
        }, "*");

    }
}

function buySure(){
    var num = hui("#buynumber").val();
    console.log("num="+num);
    if(num<1){
        alert("需要大于0个");
        return;
    }
    if(this.wallet_balance  < num * PRICE_EGG){
        alert("余额不足");
    }else{
        window.postMessage({
            "target": "contentscript",
            "data": {
                "to": dappAddress,
                "value": num*PRICE_EGG,
                "contract": {
                    "function": "buyEgg",
                    "args": JSON.stringify([num])
                }
            },
            "method": "neb_sendTransaction"
        }, "*");
    }
}


function sell(params) {
    if(this.farmInfo){
        if(this.farmInfo.egg<1){
            alert("鸡蛋数不够一枚，可以去购买鸡蛋或等待母鸡下蛋");
        }else{
            hui("#sellnumdiv").show();
        }
    }else{
        alert("养鸡场是空的...");
    }
}


function hatch() {
    if(this.farmInfo){
        if(this.farmInfo.egg<1){
            alert("鸡蛋数不够一枚，可以去购买鸡蛋或等待母鸡下蛋");
        }else{
            if(this.farmInfo.hatching!=0){
                alert("请等待上一窝鸡蛋孵化");
            }else
            hui("#hatchnumdiv").show();
        }
    }else{
        alert("养鸡场是空的...");
    }
}

function adoptChicken(){
    window.postMessage({
            "target": "contentscript",
            "data": {
                "to": dappAddress,
                "value": 0,
                "contract": {
                    "function": "adoptChicken",
                    "args": JSON.stringify([])
                }
            },
            "method": "neb_sendTransaction"
        }, "*");

}

function uploadData(){
    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": 0,
            "contract": {
                "function": "refreshData",
                "args": JSON.stringify([])
            }
        },
        "method": "neb_sendTransaction"
    }, "*");
}

function refresh(){
    console.log("refresh");
    myneb.api.call({
        from:dappAddress,
        to:dappAddress,
        value:0,
        contract:{
            function:"getFarmInfo",
            args:JSON.stringify([wallet_address])
        },
        gasPrice:1000000,
        gasLimit:2000000,
    }).then(function(tx){
        //{"chicken":1,"egg":0,"hatching":0,"hatchingtime":0,
        //"lookingtime":1526625645000,"timenow":1526625673000}
        console.log(tx.result);
        var jj = JSON.parse(tx.result);
        var num = jj.chicken;
        if(num!=0){
            hui("#getfreechicken").hide();
            this.farmInfo = jj;
            refreshPage(jj);
        }
    });
}

function refreshPage(farmInfo){
    console.log("refreshPage");
    hui("#numchicken").html(farmInfo.chicken);
    hui("#hatchnum").html(farmInfo.hatching);
    hui("#production").html(farmInfo.chicken*EGG_PRODUCE_RATE);
    var timelast = farmInfo.timenow - farmInfo.lookingtime;
    var hour = timelast/(1000*3600);
    var eggadd = hour*EGG_PRODUCE_RATE;
    var egg = farmInfo.egg + eggadd;
    hui("#numeggs").html(egg.toFixed(4));
    hui("#hatchnum").html(farmInfo.hatching);



    if(farmInfo.hatching!=0){
        hui("#hatchp").show();
        var hatchtime = farmInfo.timenow - farmInfo.hatchingtime;
        if(hatchtime>HATCH_TIME){
            console.log("鸡蛋孵化完成，快把数据记录到区块链上吧");
            alert("鸡蛋孵化完成，快把数据记录到区块链上吧");

            uploadData();
            return;
        }else{
            hatchtime = hatchtime / (1000*3600);
            hui("#hatchnumtime").html(hatchtime.toFixed(4));
        }

    }else{
        hui("#hatchp").hide();
    }

    this.farmInfo.egg = egg;

    // hui("#buynumdiv").hide();
    // hui("#hatchnumdiv").hide();
    // hui("#sellnumdiv").hide();
}

