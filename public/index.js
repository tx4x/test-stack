var debugFieldCreation = false;
var formFields = null;
var sessionName = null;

function getCSSPath(el, callback) {

  var fullPath = '';

  var cssPathFn = function (el, callback) {

    var elPath = '';

    elPath = $(el).prop('tagName').toLowerCase();

    if (typeof $(el).attr('id') !== 'undefined') {

      elPath = elPath + '#' + $(el).attr('id');
    }

    if (typeof $(el).attr('class') !== 'undefined') {

      elPath = elPath + '.' + $(el).attr('class').split(' ').join('.');
    }

    fullPath = elPath + ' ' + fullPath;

    if (typeof $(el).parent().prop('tagName') !== 'undefined') {
      cssPathFn($(el).parent(), callback);
    } else {
      callback(fullPath);
    }
  };
  cssPathFn(el, callback);
}

window.debugMaskingSelectors = true;
window.maskingSettingsFields = ['input[type="search"]'];
window.maskingSettingsContentNodes = ['input[type="search"]', '.masked'];

function createFormFields(whereSel) {

  const types = [
    "text",
    "password",
    "hidden",
    "checkbox",
    "radio",
    "date",
    "month",
    "week",
    "datetime-local",
    "time",
    "number",
    "range",
    "file",
    "email",
    "url",
    "tel",
    "search",
  ];
  const style = "";
  const where = $(whereSel);
  const els = [];
  const val = '';
  const content = 'content';
  types.forEach((type) => {
    const id = `id-${type}`;
    const cssClass = `form-field-type-${type}`;
    const el = $(`<div class="formFieldRow">
      <label for="${id}" style="">${type}</label>
      <input id="${id}" class="inputField ${cssClass}" style="${style}" type="${type}" value="${val}"></input>
      </div>`);
    els.push($)
    where.append(el);
    getCSSPath(el, (sel) => {
      debugFieldCreation && console.log(` add form field with type of ${type} | Id = ${id} | class = ${cssClass} | path = ${sel} input.${cssClass}`);
    });

  });
  formFields = els;
}

$('#animate').click(() => {
  console.log('animate clicked');
  return animateRoot();
});

$('#resize').click(() => {
  console.log('resize clicked');
  $('body').css('width', '300px');
  $('body').css('height', '800px');
  //return animateRootReverse();
});


// test message
console.log('say hello from test-application at ', location.href);

$('#dbgOn').click(() => {
  dbg(true);
});
$('#dbgOff').click(() => {
  dbg(false);
});
// does nothing
function siteReady() {

}

function animateRoot() {
  return $('#animate').velocity({
    height: 20
  }, 3000);
}

function animateRootReverse() {
  return $('#root').velocity({
    top: 0
  }, 3000);
}

function loop() {
  return animateRoot().then(animateRootReverse);
}

function mutateSimple() {
  $('#root').append('<p style="background-color:black">test<p>');
}

function timedAddContent(root, content) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const el = $(content);
      root.append(el);
      el.get(0).scrollIntoView();
      lastAddedElement = el;
      resolve();
    }, 0)
  });
}

function createNElements(whereSelector, nb, tag, value) {
  console.log(`create ${nb} items of tag ${tag} at ${whereSelector}`);
  const root = $(whereSelector || '#mutationsRoot');
  for (let i = 0; i < nb; i++) {
    adds.push(timedAddContent(root, `<${tag} value="${value||i}" style="float:left;">&nbsp;${i}&nbsp;</${tag}>`));
  }
  return true;
}
var lastAddedElement = null;

function timedAdd(root, i) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const el = $('<div style="float:left;">&nbsp;' + i + '&nbsp;</div>');
      root.append(el);
      el.get(0).scrollIntoView();
      lastAddedElement = el;
      resolve();
    }, 0)
  });
}

function createMutations() {
  const root = $('#mutationsRoot');
  const nb = $('#nbOfMutations').val();
  console.log('create ' + nb + ' mutations');
  const adds = [];
  for (let i = 0; i < nb; i++) {
    adds.push(timedAdd(root, i));
  }
  return Promise.all(adds);
}



function createOptions(nb) {
  createNElements('#select', parseInt(nb || $('#nbOfOptions').val()), 'option');
  return true;
}

createFormFields('#fieldsRoot');

$(document).ready(function () {

  console.info('ready !');

  setTimeout(function () {
    $('body').css('width', '400px');
    $('body').css('height', '800px');
    if (!sessionName) {
      var d = new Date();
      sessionName = d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '_' + dT_.version.substr(dT_.version.length - 4);
      $('body').append(`<span style="font-size:18">${sessionName}</span>`);
    }
  }, 1000);
});





function dbg(on) {
  console.log('debug ! ' + on);
  //window['dbgCollect'];
  window.dbgMSL = on;
  // window.dbgChannel = on;
  window.dbgMQuery = on;
  //window.dbgTransmit = on;
  window.dbgCollect = on;
}

function stopRecording(name) {
  var name = $('#sessionName').val();
  var user = name || sessionName;
  if (!user) {
    const d = new Date();
    user = d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '_' + dT_.version.substr(dT_.version.length - 4);
  }
  dtrum.identifyUser(user);
  dtrum.endSession();
  console.log('Stopped recording, session name = ' + user);
  return true;
}
$('#stop').click(() => {
  // alert('jQuery works!');
  //stopRecording();
});
window['stopRecording'] = stopRecording;