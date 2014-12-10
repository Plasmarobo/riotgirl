var eventQueue = [];
var startEventProc = true;

function eventProc()
{
  if ((eventQueue.length > 0))
  {
    startEventProc = false;
    event = eventQueue.shift();
    event.callback(event);
    setTimeout(eventProc, event.duration);
  }
  else
  {
    startEventProc = true;
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




