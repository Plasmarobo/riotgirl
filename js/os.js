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
  delete: 46,
  space: 32
};

var binUrl = '/~plasmarobo/js/bin/';

var arguments = [];
var programIndex = {
  'echo' : 'echo.js',
  'adventure' : 'adventure.js',
  'ls' : 'ls.js',
  'mkdir' : 'mkdir.js',
  'rm' : 'rm.js',
  'edit' : 'edit.js',
  'virus' : 'virus.js'
};
var shift_on = false;
var inBuffer = [];
var cursorPointer = 0;
var programHandle = null;

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
  // Parse arguments
  arguments = [];
  arguments = parseCommand();
  if (arguments.length == 0)
  {
    arguments.push("NULL");
  }
  if (programHandle != null)
  {
    programHandle(arguments);
  }
  else if ((typeof programIndex[arguments[0]] != 'undefined') && (programIndex[arguments[0]].length))
  {
    loadProgram(arguments[0], arguments);
  }
  else
  {
    writeLine("Could not find program: " + arguments[0], 20);
    writeNewline();
    pushEvent({callback: function(){readyInput();}, duration: 0});
  }
};

function parseCommand()
{
  var args = [];
  var collector = "";
  for(var i = 0; i < inBuffer.length; ++i)
  {
    if (inBuffer[i] == " ")
    {
      args.push(collector);
      collector = "";
    }
    else
    {
      collector += inBuffer[i];
    }
  }
  args.push(collector);
  return args;
}

function loadProgram(name, args)
{
  writeLine("Loading "+name);
  writeNewline();
  var wrapper = function(args)
  {
    pushEvent({callback: function(){
      $.getScript(binUrl + name + ".js").done(function()
        {
          pushEvent({callback: function(){
            programHandle(args);
         }, duration: 0});
        }).fail(function(jqxhr, settings, exception) {
          writeLine("Critical Failure!", 20);
          writeNewline();
          pushEvent({callback: readyInput, duration: 0});
        });
    }, duration: 0});
 };
 wrapper(args);
};

function exitProgram()
{
  programHandle = null;
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
      shift_on = true;
      break;
    case keycodes.control:
    case keycodes.alt:
    case keycodes.up:
    case keycodes.down:
      break;
    default:
      if (inputReady === true)
      {
        var char = String.fromCharCode(event.which);
        if (!shift_on)
        {
          char = char.toLowerCase();
        }
        bufferInput(char);
      }
      break;
  }
  event.preventDefault();
  return false;
};

function handleRelease(event)
{
  if (event.which == keycodes.shift)
  {
    shift_on = false;
  }
};


function startOS()
{
  readyInput();
  $(document).keydown(handleInput); 
  $(document).keyup(handleRelease);
};

