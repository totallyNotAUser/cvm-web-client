const sleep = ms => new Promise(r => setTimeout(r, ms));

const _autotyperKeysToCVM = {
    'alt_r':     [65027],
    'backspace': [65288],
    'tab':       [65289],
    'enter':     [65293],
    'return':    [65293],
    'esc':       [65307],
    'shift':     [65505],
    'ctrl':      [65507],
    'ctrl_r':    [65508],
    'alt':       [65513],
    'win':       [65515],
    'delete':    [65535],
    'del':       [65535],
    'pause':     [0xFF13],
    'caps':      [0xFFE5],
    'space':     [0x0020],
    'pageup':    [0xFF55],
    'pagedown':  [0xFF56],
    'end':       [0xFF57],
    'home':      [0xFF50],
    'left':      [0xFF51],
    'up':        [0xFF52],
    'right':     [0xFF53],
    'down':      [0xFF54],
    'insert':    [0xFF63],
    'f1':        [0xFFBE],
    'f2':        [0xFFBF],
    'f3':        [0xFFC0],
    'f4':        [0xFFC1],
    'f5':        [0xFFC2],
    'f6':        [0xFFC3],
    'f7':        [0xFFC4],
    'f8':        [0xFFC5],
    'f9':        [0xFFC6],
    'f10':       [0xFFC7],
    'f11':       [0xFFC8],
    'f12':       [0xFFC9],
    'numlock':   [0xFF7F],
    'scrolllock':[0xFF14],
    // these are the keys that need to be translated (for example, '!' -> shift+1)
    '~':         [65505, 96],
    '!':         [65505, 49],
    '@':         [65505, 50],
    '#':         [65505, 51],
    '$':         [65505, 52],
    '%':         [65505, 53],
    '^':         [65505, 54],
    '&':         [65505, 55],
    '*':         [65505, 56],
    '(':         [65505, 57],
    ')':         [65505, 48],
    '_':         [65505, 45],
    '+':         [65505, 61],
    '{':         [65505, 91],
    '}':         [65505, 93],
    ':':         [65505, 59],
    '"':         [65505, 39],
    '|':         [65505, 92],
    '<':         [65505, 44],
    '>':         [65505, 46],
    '?':         [65505, 47],
}

async function _handlerKey(line) {
    const codes = line.split(' ').slice(1);
    for (let i = 0; i < codes.length; i++) {
        let keys = _autotyperKeysToCVM[codes[i]] || [codes[i]];
        for (let j = 0; j < keys.length; j++) {
            currentConn.sendGuac(['key', keys[j].toString(), '1']);
            await sleep(3);
        };
        for (let j = 0; j < keys.length; j++) {
            currentConn.sendGuac(['key', keys[j].toString(), '0']);
            await sleep(3);
        };
    }
}

async function _handlerKeydown(line) {
    const codes = line.split(' ').slice(1);
    for (let i = 0; i < codes.length; i++) {
        let keys = _autotyperKeysToCVM[codes[i]] || [codes[i]];
        for (let j = 0; j < keys.length; j++) {
            currentConn.sendGuac(['key', keys[j].toString(), '1']);
            await sleep(3);
        };
    }
}

async function _handlerKeyup(line) {
    const codes = line.split(' ').slice(1);
    for (let i = 0; i < codes.length; i++) {
        let keys = _autotyperKeysToCVM[codes[i]] || [codes[i]];
        for (let j = 0; j < keys.length; j++) {
            currentConn.sendGuac(['key', keys[j].toString(), '0']);
            await sleep(3);
        };
    }
}

async function _handlerEnter(line) {
    currentConn.sendGuac(['key', '65293', '1']);
    await sleep(3);
    currentConn.sendGuac(['key', '65293', '0']);
}

async function _handlerSleep(line) {
    let ms = parseInt(line.split(' ')[1]);
    await sleep(ms);
}

function _handlerComment(line) {}

const _autotyperCmdHandlers = {
    ':key': _handlerKey,
    ':keydown': _handlerKeydown,
    ':keyup': _handlerKeyup,
    ':newline': _handlerEnter,
    ':enter': _handlerEnter,
    ':sleep': _handlerSleep,
    ':#': _handlerComment,
}

async function _autotyperExecCommand(line) {
    const cmd = line.split(' ')[0];
    await _autotyperCmdHandlers[cmd](line);
}

async function _autotyperRunScript(s) {
    const cmds = s.split('\n').slice(1);
    for (let i = 0; i < cmds.length; i++) {
        if (!cmds[i].startsWith(':')) {
            await _autotyperType(cmds[i]);
        } else {
            await _autotyperExecCommand(cmds[i]);
        }
    }
}

async function _autotyperType(text) {
    for (let i = 0; i < text.length; i++) {
        let _key = text[i];
        let key = _autotyperKeysToCVM[_key] || [_key.charCodeAt(0)];
        console.log(key == _key, key, _key);
        for (let j = 0; j < key.length; j++) {
            currentConn.sendGuac(['key', key[j].toString(), '1']);
            await sleep(3);
        }
        for (let j = 0; j < key.length; j++) {
            currentConn.sendGuac(['key', key[j].toString(), '0']);
            await sleep(3);
        }
    }
}

function _autotype(clipboard) {
    if (clipboard.startsWith('#!cvm++/autotyper\n')) _autotyperRunScript(clipboard);
    else _autotyperType(clipboard);
}

async function autotypeFromClipboard() {
    let clip = null;
    makeSimpleModal('autotyper-modal', 'Autotyper', `
        Please press Ctrl-V (i haven't found a way to read clipboard that works cross-browser)<br>
        <textarea id="autotyper-textarea"></textarea>
        `, [], true);
    $('#autotyper-textarea').focus().on('keyup', e => {
        if ($('#autotyper-textarea').val().length < 2) return; // if the user did not paste yet
        closeCurrentModal();
        clip = $('#autotyper-textarea').val();
        destroyModal('autotyper-modal');
        _autotype(clip);
    })
    openModal('autotyper-modal');
}
