let reports = []
let ids = []
let infos = []
let types = []
let ms = []
let hs = []
let time = []
let typeTxt = ""
let type= 0
let colors = []
let CurId = 0
let msgs = []
let MsgIds = []
let playerNames = []
let repmsgid = 0
let repid = -2
let PlayId = 0
let activeReport = {
    id: 0,
    index: -1
}
window.addEventListener('message', (event) => {
    let data = event.data;
     if (data.action === "setMyId") {
        myId = data.serverId;
        repid = myId;
        for (let i = 0; i < ids.length; i++) {
            if (ids[i] === myId) {
                document.getElementById("menu").style.display = "none"
                document.getElementById("menu2").style.display = "block"
            }
        }
    }
    if (data.action === "openMenu") {
        document.getElementById("menu").style.display = "block"
        fetch(`https://md_report/getMyId`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        for (let i = 0; i<ids.length;i++){
            if (ids[i]==data.serverId){
                document.getElementById("menu").style.display = "none"
                document.getElementById("menu2").style.display = "block"
                for (let i = 0; i<ids.length; i++){
                    if (data.serverId==ids[i]){
                        repid = ids[i]
                    }
                }
            }
        }
        updatemsgs()
    }
    if (data.action=="setsolving"){
        for (let i=0; i<colors.length; i++){
            if (ids[i]===data.plid){
                colors[i] = "grey"
            }
        }

    }
    if (data.action === "openAdminMenu") {
        if (data.allowed==1) {
            document.getElementById("admin").style.display = "block"
            updatemsgs()
            update()

        }
    }
    if (data.action == "getMsg") {
        msgs.push(data.msg);
        MsgIds.push(data.MsgId);
        playerNames.push(data.playerName);

        if (data.MsgId == repid) {
            fetch(`https://md_report/playerNotify`, { 
                method: 'POST', 
                body: JSON.stringify({ msg: data.msg }) 
            });
        }
        updatemsgs();
    }
    if (data.action === "addReport") {
    reports.push(data.head)
    ids.push(data.id)
    infos.push(data.info)
    colors.push("#222222")
    if (data.type == 1) typeTxt = "Reported Player"
    else if (data.type == 2) typeTxt = "Reported Bug"
    else typeTxt = "Reported Other"
    types.push(typeTxt)
    time.push(data.h + ":" + data.m)
    
    if (myId == data.id) {
        CurId = data.id;
        activeReport.id = CurId;
        repid = data.id;
        repmsgid = ids.indexOf(data.id);
        document.getElementById("menu").style.display = "none"
        document.getElementById("menu2").style.display = "block"
    }

    update()
    updatemsgs()
}
    if (data.action=="closeticket"){
        let targetId = data.targetId
        for (let i = msgs.length - 1; i >= 0; i--) {
            if (MsgIds[i] === targetId) {
                msgs.splice(i, 1);
                MsgIds.splice(i, 1);
                playerNames.splice(i, 1);
            }
        }

        let indexToRemove = ids.indexOf(targetId);
        if (indexToRemove !== -1) {
            reports.splice(indexToRemove, 1);
            ids.splice(indexToRemove, 1);
            infos.splice(indexToRemove, 1);
            types.splice(indexToRemove, 1);
            time.splice(indexToRemove, 1);
            colors.splice(indexToRemove, 1);
        }
        CurId = 0;
        update();
        updatemsgs();
        closeadminview();
        document.getElementById("chat").innerHTML = "";
        document.getElementById("chat2").innerHTML = "";
    }
    if (data.close == "close"){
        closeadminview()
    }
});
function updatemsgs() {
    const chatDiv = document.getElementById("chat");
    chatDiv.innerHTML = "";

    for (let i = 0; i < msgs.length; i++) {
        if (MsgIds[i] == activeReport.id) {
            const msgContainer = document.createElement("div");
            msgContainer.className = "chatcont";
            const nameDiv = document.createElement("div");
            nameDiv.textContent = playerNames[i];
            msgContainer.appendChild(nameDiv);

            const msgDiv = document.createElement("div");
            msgDiv.textContent = msgs[i];
            msgContainer.appendChild(msgDiv);

            chatDiv.appendChild(msgContainer);
        }
    }
    chatDiv.scrollTop = chatDiv.scrollHeight;

    const chatDiv2 = document.getElementById("chat2");
    chatDiv2.innerHTML = "";
    for (let i = 0; i < msgs.length; i++) {
        if (MsgIds[i] == activeReport.id) {
            const msgContainer2 = document.createElement("div");
            msgContainer2.className = "chatcont2";
            const nameDiv2 = document.createElement("div");
            nameDiv2.textContent = playerNames[i];
            msgContainer2.appendChild(nameDiv2);

            const msgDiv2 = document.createElement("div");
            msgDiv2.textContent = msgs[i];
            msgContainer2.appendChild(msgDiv2);

            chatDiv2.appendChild(msgContainer2);
        }
    }
    chatDiv2.scrollTop = chatDiv2.scrollHeight;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.getElementById("menu").style.display = "none"
        document.getElementById("admin").style.display = "none"
        document.getElementById("reportmenu").style.display = "none"
        document.getElementById("menu2").style.display = "none"
        CurId = 0
        repmsgid = 0
        fetch(`https://md_report/closeMenu`, {
            method: 'POST',
            body: JSON.stringify({})
        });
    }
});
function update(){
    document.getElementById("reportsMenu").innerHTML = ""
    for (let i=0; i<reports.length; i++){
        if (reports[i]!= ""){
            document.getElementById("reportsMenu").innerHTML += "<div onclick='Respond("+i+")'class='sendbuttonred' style='background-color:"+colors[i]+"'>["+ids[i]+"] - " + reports[i]+ "<div class='txt2'>"+types[i]+" at "+time[i]+"</div></div>";
        }
    }
}
function send(){
    let head = document.getElementById('head').value
    let info = document.getElementById('info').value
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    if (head!=""){
        fetch(`https://md_report/sendReport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ head, type, info, h, m})
        });
        document.getElementById('HEAD2').innerHTML = head
        document.getElementById('INFO2').innerHTML = info
        document.getElementById('head').value = ""
        document.getElementById('info').value = ""
        document.getElementById("menu").style.display = "none"
        document.getElementById("menu2").style.display = "block"
        document.getElementById('head').style.border = "none"
    } else {
        document.getElementById('head').style.border = "2px solid black"
        document.getElementById('head').style.borderColor = "red"
        
    }
}

function action(act) {
    let plId = PlayId
    fetch(`https://md_report/actions`, {
        method: 'POST',
        body: JSON.stringify({ act, plId })
    });

    if (act == 2) {
        let targetId = ids[repmsgid];
        fetch(`https://md_report/actions`, {
            method: 'POST',
            body: JSON.stringify({ act, targetId })
        });
        fetch(`https://md_report/markasdoneAlert`, {
            method: 'POST',
            body: JSON.stringify({repid})
        });
        closeadminview()
    }
    if (act==1){
        fetch(`https://md_report/respondingAlert`, {
            method: 'POST',
            body: JSON.stringify({repid})
        });
    }
}


function Respond(num){
    activeReport.id = ids[num];
    activeReport.index = num;
    PlayId = ids[num]
    document.getElementById("reportmenu").style.display = "block"
    document.getElementById("admin").style.display = "none"
    document.getElementById("ID").innerHTML = ids[num]
    document.getElementById("HEAD").innerHTML = reports[num]
    document.getElementById("INFO").innerHTML = infos[num]
    updatemsgs()
}


function closeadminview(){
    document.getElementById("menu").style.display = "none"
    document.getElementById("admin").style.display = "none"
    document.getElementById("reportmenu").style.display = "none"
    document.getElementById("menu2").style.display = "none"
    CurId = 0
    repmsgid = 0
    fetch(`https://md_report/closeMenu`, {
        method: 'POST',
        body: JSON.stringify({})
    });
}

function setType(tp){
    if (tp==1) {
        document.getElementById("type1").style.backgroundColor = "#2C2C2C"
        document.getElementById("type2").style.backgroundColor = "#222222"
        document.getElementById("type3").style.backgroundColor = "#222222"
        type = 1
    }
    if (tp==2) {
        document.getElementById("type2").style.backgroundColor = "#2C2C2C"
        document.getElementById("type1").style.backgroundColor = "#222222"
        document.getElementById("type3").style.backgroundColor = "#222222"
        type = 2
    }
    if (tp==3) {
        document.getElementById("type3").style.backgroundColor = "#2C2C2C"
        document.getElementById("type1").style.backgroundColor = "#222222"
        document.getElementById("type2").style.backgroundColor = "#222222"
        type = 3
    }

}

function sendMsg(msgty){
    let msgg = "";
    if (msgty==0){
        msgg = document.getElementById("msgInp").value;
        document.getElementById("msgInp").value = "";
    } else {
        msgg = document.getElementById("msgInp2").value;
        document.getElementById("msgInp2").value = "";
    }

    let idmsg = activeReport.id;

    if (msgg !== "" && idmsg !== 0){
        fetch(`https://md_report/sendMsgss`, {
            method: 'POST',
            body: JSON.stringify({msgg, idmsg})
        });
    }
}

function closeReportPlayer() {
    let targetId = CurId || repid;
    fetch(`https://md_report/actions`, {
        method: 'POST',
        body: JSON.stringify({ act: 2, targetId })
    });
    closeadminview();
}