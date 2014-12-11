var inputReady = false;
var keycodes = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
};

var inBuffer = [];
var cursorPointer = 0;

function readyInput()
{
  inputReady = true;
  insertAtCursor(">");
  if (!$('#inBuffer').length)
  {
    insertAtCursor($('<span id="inBuffer"></span>'));
  }
  $('#inBuffer').append($('.cursor').detach());
};

function sendCommand(string)
{
  inputReady = false;
  
  $('.content').append($('.cursor').detach());
  var buffer = $('#inBuffer').html();
  $('#inBuffer').remove();
  insertAtCursor(buffer);
  writeNewline();
  writeLine("Echo: " + string, 20);
  writeNewline();
  pushEvent({callback: function(){readyInput();}, duration: 0});
};

function bufferToString()
{
  var str = "";
  for( var i = 0; i < inBuffer.length; ++i)
  {
    str += inBuffer[i];
  }
  return str;
};

function validCursor()
{
  return ((cursorPointer <= inBuffer.length) && (cursorPointer >= 0));
};

function bufferInput(char)
{
  if (validCursor() && (cursorPointer < inBuffer.length))
  {
    inBuffer.splice(cursorPointer, 0, char);
  }
  else
  {
    inBuffer.push(char);
  }
  insertAtCursor(char);
  advanceCursor();
};

function deleteAtCursor()
{
  if (validCursor())
  {
    inBuffer.splice(cursorPointer, 1);
    renderInputBuffer();
  }
  else
  {
    inBuffer.pop();
    renderInputBuffer();
  }
};

function renderInputBuffer()
{
  var before = "";
  var selected = "";
  var after = "";
  var cursor = $('.cursor').detach();
  if (validCursor() && (cursorPointer < inBuffer.length))
  {
    for(var i = 0; i < cursorPointer; ++i)
    {
      before += inBuffer[i];
    }
    selected = inBuffer[cursorPointer];
    for(var i = cursorPointer + 1; i < inBuffer.length; ++i)
    {
      after += inBuffer[i];
    }
  }
  else
  {
    before = bufferToString();
  }
  $("#inBuffer").html(before);
  cursor.html(selected);
  $("#inBuffer").append(cursor);
  if (after.length)
  {
    $("#inBuffer").append(after);
  }
};

function advanceCursor()
{
  ++cursorPointer;
  if (!validCursor())
  {
    cursorPointer = inBuffer.length;
  }
};

function regressCursor()
{
  --cursorPointer;
  if (!validCursor())
  {
    cursorPointer = 0;
  }
};

function handleInput(event)
{
  event.preventDefault();
  //defaultPrevented = true;
  switch(event.which)
  {
    case keycodes.backspace:
      if(cursorPointer == 0)
      {
        break;
      }
      regressCursor();
    case keycodes.delete:
      deleteAtCursor();
      renderInputBuffer();
      break;
    case keycodes.right:
      advanceCursor();
      renderInputBuffer();
      break;
    case keycodes.left:
      regressCursor();
      renderInputBuffer();
      break;
    case keycodes.enter:
      inputReady = false;
      sendCommand(bufferToString());
      inBuffer = [];
      break;
    case keycodes.shift:
    case keycodes.control:
    case keycodes.alt:
    case keycodes.up:
    case keycodes.down:
      break;
    default:
      if (inputReady === true)
      {
        bufferInput(String.fromCharCode(event.which));
      }
      break;
  }
  return false;
};


function startOS()
{
  readyInput();
  $(document).keyup(handleInput);
};

