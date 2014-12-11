var stdout;
var cursor;
var blinkHandle;
var cursorBlinkRate = 500; //ms
var bufferWriteDelay = 0; //ms
var startEventProc = true;
var eventProcLocks = 0;
var eventQueue = [];

function eventProc()
{
  if (eventQueue.length > 0)
  {
    startEventProc = false;
    var duration = 10;
    if (eventProcLocks === 0)
    {
      event = eventQueue.shift();
      event.callback(event.content);
      duration = event.duration;
    }
    setTimeout(function(){eventProc();}, duration);
  }
  else
  {
    startEventProc = true;
  }
};

function lockEventProc()
{
  ++eventProcLocks;
};

function unlockEventProc()
{
  --eventProcLocks;
};

function unshiftEvent(event)
{
  eventQueue.unshift(event);
  if(startEventProc === true)
  {
    eventProc();
  }
};

function pushEvent(event)
{
  eventQueue.push(event);
  if (startEventProc === true)
  {
    eventProc();
  }
};

function enqueueWriteEvent(callback, time)
{
  pushEvent({callback: callback, duration: time, content: ""});
};

function enqueueWriteDelay(time)
{
  pushEvent({callback: function(){}, duration: time, content: ""});
};

function insertAtCursor(text)
{
  cursor.before(text);
};

function addNamedContent(name, content)
{
  var node = $('<span id="' + name + '"></span>');
  node.html(content);
  cursor.before(node);
};

function setNamedContent(name, content)
{
  var field = $('#' + name);
  if (field.length)
  {
    field.html(content);
  }
  else
  {
    addNamedContent(name, content);
  }
};

function writeLine(msg, rate)
{
  //If the mutex is locked
  //Schedule a timeout for each letter at rate
  for(var i = 0; i < msg.length; ++i)
  {
    pushEvent({content: msg.substr(i,1), duration: rate, callback: insertAtCursor});
  }
};

function writeHeading(msg, rate)
{
  writeLine(msg, rate);
};

function writeNewline()
{
  var callback = function(){
    cursor.before($('<br></br>'));
  };
  enqueueWriteEvent(callback, 0);
};

function writeField(name, content, rate)
{
  for(i = 0; i < content.length; ++i)
  {
    updateField(name, content.substr(0,i+1), rate);
  }
};

function updateField(name, content, rate)
{
  pushEvent({content: content, duration: rate, callback: function(content){
    setNamedContent(name, content);
  }});
};

function clearChildren(index, element, rate, remove_parent, eventList)
{
  
  if (typeof element === 'undefined')
  {
    return;
  }
  lockEventProc(); 
  switch(element.nodeType)
  {
    case 1: //Element node
      var subnodes = $(element).contents();
      $.each(subnodes, function(index, subelement){
        clearChildren(index, subelement, rate, true, eventList);
        if (!$(subelement).hasClass("cursor"))
        {
          eventList.push({callback: function(){$(subelement).remove();}, duration: rate});
        }    
      });
      if ((remove_parent === true) && (!$(element).hasClass("cursor")))
      {
        (function(element){
          eventList.push({callback: function(){$(element).remove();}, duration: rate});
        })(element);
      }
      break;
    case 2: //Attribute node
      //Ignore
      break;
    case 3: //Text node
      var callback = function(){
        element.nodeValue = element.nodeValue.substr(1);
        if (element.nodeValue.length === 0)
        {
          $(element).remove();
        }
        else
        {
          eventList.push({callback: this, duration: rate});
        }
      };
      eventList.push({callback: callback, duration: rate});
      break;
    case 8: //Comment node
      element.remove();
        break;
    default:
      break;
  }
  unlockEventProc();
};

function clearConsole(rate)
{
  enqueueWriteEvent(function(){
    var eventList = [];
    clearChildren(0, $('.content')[0], rate, false, eventList);
    eventQueue = eventList.concat(eventQueue);
  }, rate);
};

function blinkCursor(on, rate)
{
  if (on === true)
  {
    blinkHandle = setInterval(function(){
      if (cursor.hasClass("blink"))
      {
        cursor.removeClass("blink");
      }
      else
      {
        cursor.addClass("blink");
      }
    }, cursorBlinkRate);
  }
  else
  {
    cursor.removeClass("blink");
    clearInterval(blinkHandle);
  }
};

$(document).ready(function(){
  stdout = $('.content');
  cursor = $('<div class="cursor"></div>');
  stdout.append(cursor);
  blinkCursor(true, cursorBlinkRate);
  setTimeout(function(){
    writeLine("Memory 64K . . . OK", 50);
    writeNewline();
    writeLine("==Booting OS 3.0.1==", 50);
    writeNewline();
    $.each([
      "krnel.exe", 
      "logon.exe", 
      "virus.exe", 
      ], function(i, txt){
      writeLine(txt, 50);
      writeLine(" . . . ", 50);
      writeLine("OK", 50);
      writeNewline();
    });
    enqueueWriteDelay(1000);
    clearConsole(2);
    enqueueWriteDelay(1000);
    writeHeading("Welcome to CmdOS", 10);
    writeNewline();
    pushEvent({callback:function(){startOS();}, duration: 0});
  }, 500);
});
