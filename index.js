class VMWebsocket {
    constructor(ip, { onOpen = null, onMessage = null, onClose = null, onError = null }, reconnectOnDisconnect = false) {
        this.connIP = ip;
        this.reconnectOnDisconnect = reconnectOnDisconnect;
        this.eventCallbacks = { onOpen, onMessage, onClose, onError };
        this.makeAndConnectWS();
    }
    makeAndConnectWS() {
        this.ws = new WebSocket(`ws://${this.connIP}/`, ['guacamole']);
        if (this.eventCallbacks.onMessage !== null) {
            this.onMessage = this.eventCallbacks.onMessage.bind(this);
            this.ws.onmessage = this.onMessageWrapper.bind(this);
        }
        if (this.eventCallbacks.onOpen !== null) this.ws.onopen = this.eventCallbacks.onOpen.bind(this);
        if (this.eventCallbacks.onClose !== null) this.ws.onclose = this.reconnectOnDisconnect ? this.callOnCloseAndReconnect : this.eventCallbacks.onClose.bind(this);
        if (this.eventCallbacks.onError !== null) this.ws.onerror = this.eventCallbacks.onError.bind(this);
    }
    callOnCloseAndReconnect(ev) {
        this.eventCallbacks.onClose.bind(this);
        makeAndConnectWS();
    }
    onMessageWrapper(ev) {
        this.onMessage(this.decodeGuac(ev.data));
    }
    sendGuac(arr) {
        this.ws.send(this.encodeGuac(arr));
    }
    encodeGuac(arr) {
        let result = [];
        arr.forEach(v => { if (v !== undefined) result.push(v.length.toString() + '.' + v) });
        return result.join(',') + ';';
    }
    decodeGuac(str) {
        let result = [];
        for (let i = 0; i < str.length; i++) {
            let sectionLengthStr = [];
            for (; str[i] !== '.'; i++) {
                sectionLengthStr.push(str[i]);
            }
            i++;
            const sectionLength = parseInt(sectionLengthStr.join(''));
            if (sectionLength === NaN) throw new Error('sectionLength is NaN while decoding guacamole string' + str);
            result.push(str.substring(i, i + sectionLength));
            i += sectionLength;
            if (str[i] === ';') break;
        }
        return result;
    }
    disconnect() {
        this.sendGuac(['disconnect']);
        this.ws.close();
    }
}

let currentConn = null;
let currentUsername = null;

class VMDisplay {
    constructor() {
        this.size = { x: null, y: null };
        this.canvas = $('#vm-canvas').get(0);
        this.context = this.canvas.getContext('2d');
    }
    setSize(x, y) {
        this.size.x = parseInt(x);
        this.size.y = parseInt(y);
        this.canvas.width = parseInt(x);
        this.canvas.height = parseInt(y);
    }
    drawPng(png, x, y) {
        let img = new Image();
        img.onload = () => this.context.drawImage(img, parseInt(x), parseInt(y));
        img.src = 'data:image/png;base64,' + png;
    }
    handleMsg(msg) {
        if (msg[0] == 'size' && msg[1] == '0') this.setSize(msg[2], msg[3]);
        else if (msg[0] == 'png' && msg[2] == '0') this.drawPng(msg[5], msg[3], msg[4]);
    }
}

class VMVoting {
    constructor() {

    }
    handleMsg(msg) {

    }
}

class VMUserList {
    constructor() {

    }
    handleMsg(msg) {

    }
}

class VMChat {
    constructor() {

    }
    handleMsg(msg) {

    }
}

function takeTurn() {
    currentConn.sendGuac(['turn']);
}
function endTurn() {
    currentConn.sendGuac(['turn', '0']);
}
function toggleKeyboard() {
    alert('Sorry, visual keyboard is not implemented yet');
}
function voteYes() {
    currentConn.sendGuac(['vote', '1']);
}
function voteNo() {
    currentConn.sendGuac(['vote', '0']);
}

async function enterVM(ip, name, title) {
    $('#vm-list').hide();
    $('#vm-view').show();
    $('#navbar-back').show();
    $('#loading').show();
    let display = new VMDisplay();
    let voting = new VMVoting();
    let userList = new VMUserList();
    let chat = new VMChat();
    currentConn = new VMWebsocket(ip, {
        onOpen: () => {
            currentConn.sendGuac(['rename', localStorage.getItem('username')]);
            currentConn.sendGuac(['connect', name]);
            $('#loading').hide();
        },
        onMessage: msg => {
            if (msg[0] == 'nop') {
                currentConn.sendGuac(['nop']);
            } else if (msg[0] == 'rename' && msg[1] == '0') {
                currentUsername = msg[3];
                $('#chat-username').text(msg[3]);
            } else {
                display.handleMsg(msg);
                voting.handleMsg(msg);
                userList.handleMsg(msg);
                chat.handleMsg(msg);
            }
        }
    }, true);
}

function exitVM() {
    $('#navbar-back').hide();
    $('#vm-view').hide();
    $('#loading').show();
    currentConn.disconnect();
    currentConn = null;
    refreshVMList();
    $('#vm-list').show();
    $('#loading').hide();
}

function refreshVMList() {
    $('#vm-list').empty();
    loadVMList();
}

function showVM(imageData, title, onClick) {
    $('<span>')
        .addClass('vm-list-entry')
        .append(
            $('<img>').prop('src', 'data:image/png;base64,'+imageData),
            $('<h4>').html(title)
        )
        .click(onClick)
        .appendTo($('#vm-list'));
}

if (localStorage.getItem('cvmClientUsed') == null) {
    firstTimeInit();
}

function loadVMList() {
    let servers = JSON.parse(localStorage.getItem('servers'));

    for (let i = 0; i < servers.length; i++) {
        let ws = new VMWebsocket(servers[i], {
            onOpen: () => {
                ws.sendGuac(['connect']);
                ws.sendGuac(['list']);
            },
            onMessage: m => {
                if (m[0] == 'nop') {
                    ws.sendGuac(['nop']);
                    return;
                }
                if (m[0] != 'list') return;
                for (let j = 1; j < m.length; j+=3) {
                    let currentVm = {
                        name: m[j],
                        title: m[j+1],
                        image: m[j+2]
                    };
                    showVM(currentVm.image, currentVm.title, () => enterVM(servers[i], currentVm.name, currentVm.title))
                }
            }
        }, false);
    }
}

loadVMList();

$('#loading').hide();
