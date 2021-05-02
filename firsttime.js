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
sandvm.cf:6004`);
}

function firstTimeSetupSaveSettings() {
    localStorage.setItem('username', $('#welcome-setup-username').val());
    localStorage.setItem('servers', JSON.stringify($('#welcome-setup-server-list').val().split('\n')));
    localStorage.setItem('chatSound', 'http://computernewb.com/collab-vm/notify.ogg')
    localStorage.setItem('showChatTime', JSON.stringify(true));
    localStorage.setItem('showChatTimeInUTC', JSON.stringify(true));
}
