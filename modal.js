let currentModals = [];

function makeSimpleModal(id, title, html, buttons, closeBtn = true) {
    let modal = $('<div>').attr('id', id).addClass('modal-wrapper').append(
        $('<div>').addClass('modal-content').append(
            $('<div>').addClass('modal-header').append(
                $('<span>').addClass('modal-title').html(title), 
                closeBtn? $('<span>').addClass('modal-close').html('&times;') : null
            ),
            $('<div>').addClass('modal-body').html(html),
            $('<div>').addClass('modal-footer').append(
                buttons.map(x => $('<button>').addClass(x.classes).html(x.html).click(x.click))
            )
        )
    );
    modal.prependTo('body');
    return modal;
}
function destroyModal(id) {
    $('#' + id).remove();
}

function closeCurrentModal(after = null) {
    if (currentModals.length == 0) {
        console.error('Tried to close current modal, but no modal is open');
        return;
    }
    let modal = currentModals.pop();
    modal.children().animate({
        'top': '-10%', 'opacity': '0%'
    }, 300, 'swing', () => {
        modal.css('z-index', 'unset')
        modal.hide();
        if (typeof after == 'function') after();
    });
}

function openModal(id) {
    let modal = $('#' + id);
    modal.css('z-index', 100 + currentModals.length);
    modal.children().animate({
        'top': '-10%', 'opacity': '0%'
    }, 0, 'swing', () => modal.show());
    modal.children().animate({
        'top': '50%', 'opacity': '100%'
    }, 300, 'swing');
    currentModals.push(modal);
}

$('.modal-close').click(closeCurrentModal);

function modalPageForward(a, b) {
    $(a).animate({
        'margin-left': '-100%', 'margin-right': '100%', 'opacity': '0%', 'height': '0%'
    }, 400, 'swing', () => $(a).hide());
    $(b).animate({
        'margin-left': '100%', 'margin-right': '-100%', 'opacity': '0%', 'height': '0%'
    }, 0, 'swing', () => $(b).show());
    $(b).animate({
        'margin-left': '0%', 'margin-right': '0%', 'opacity': '100%', 'height': '100%'
    }, 400, 'swing');
}

function modalPageBack(a, b) {
    $(a).animate({
        'margin-left': '100%', 'margin-right': '-100%', 'opacity': '0%', 'height': '0%'
    }, 400, 'swing', () => $(a).hide());
    $(b).animate({
        'margin-left': '-100%', 'margin-right': '100%', 'opacity': '0%', 'height': '0%'
    }, 0, 'swing', () => $(b).show());
    $(b).animate({
        'margin-left': '0%', 'margin-right': '0%', 'opacity': '100%', 'height': '100%'
    }, 400, 'swing');
}
