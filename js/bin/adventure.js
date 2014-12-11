var adventureHelp = {
  'quit' : 'Exit adventure!',
  'help' : 'Help menu!'
};

var rooms =
[
  {description: "The starting room..."}
];

var room = rooms[0];

var currentAdventure =
{
  room: -1,
  name: "Player",
  race: "Human"
};

function setRoom(index)
{
  currentAdventure.room = index;
  room = rooms[index];
}

var newAdventure = function(args)
{
  if (args[0].length != 0)
  {
    currentAdventure.name = args[0];
    setRoom(0);
    writeLine(room.description);
    writeNewline();
    programHandle = adventure;
  }
  else
  {
    writeLine("One must have a name", 20);
    writeNewline();
  }
  pushEvent({callback: readyInput, duration: 0});
}

programHandle = function(args)
{
  writeLine("===WELCOME TO ADVENTURE===", 20);
  writeNewline();
  if (currentAdventure.room === -1)
  {
    writeLine("What is your name, hero!?", 20);
    writeNewline();
    programHandle = newAdventure;
  }
  else
  {
    writeLine("Welcome back, " + currentAdventure.name, 20);
    writeNewline();
    programHandle = adventure;
    setRoom(currentAdventure.room);
    writeLine(room.description, 20);
    writeNewline();
  }
  pushEvent({callback: readyInput, duration: 0});
}; 


var adventure = function(args)
{
  switch(args[0])
  {
    case 'quit':
      writeLine("Good bye!");
      writeNewline();
      pushEvent({callback: exitProgram, duration: 0});
      return;
      break;
    case 'help':
      for(var key in adventureHelp)
      {
        writeLine(key + ": " + adventureHelp[key], 20);
        writeNewline();
      }
      break;
    default:
      writeLine("That isn't... you can't.");
      writeNewline();
      break;
  }
  pushEvent({callback: readyInput, duration: 0});
};
