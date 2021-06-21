function firstTimeInit() {
    openModal('welcome-modal');
}

function firstTimeSetupLoadDefaults() {
    $('#welcome-setup-username').val('cvmPlusPlus' + (Math.floor(Math.random() * 8999) + 1000).toString());
    $('#welcome-setup-server-list').val(`computernewb.com:6002
computernewb.com:7000
computernewb.com:6004
computernewb.com:6005
computernewb.com:6006
computernewb.com:6007
computernewb.com:6008
computernewb.com:6009
computernewb.com:6010
173.252.197.90:6004
177.159.234.74:6004
darkok.xyz:3037
shitvm.mattx.cloud
vmland.ml:2095
sandvm.cf:6004
cvm.amogus.uk:6004
home.darkok.xyz:6004
naemvm.cf:80
uservm.vmland.cf:2095
40.76.113.125:6004
198.176.57.155:6004
35.225.145.202:6004
35.225.145.202:6005
35.225.145.202:6006
35.225.145.202:6007`);
}

function firstTimeSetupSaveSettings() {
    localStorage.setItem('username', $('#welcome-setup-username').val());
    localStorage.setItem('servers', JSON.stringify($('#welcome-setup-server-list').val().split('\n')));
    localStorage.setItem('chatSound', 'http://computernewb.com/collab-vm/notify.ogg')
    localStorage.setItem('showChatTime', JSON.stringify(true));
    localStorage.setItem('showChatTimeInUTC', JSON.stringify(true));
    localStorage.setItem('vmViewFit', JSON.stringify(false));
}
