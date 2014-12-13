var adventureHelp = {
  'quit': 'Exit adventure',
  'help': 'This menu',
  'go': 'Move in a direction (go north)',
  'take': 'Take an item (take bucket)',
  'drop': 'Drop an item (drop bucket)',
  'examine': 'Examine an item, list interactions (examine bucket)',
  'save': 'Save the game',
  'load': 'Load the game',
  'newgame': 'Start a new game, will overwrite save'
};

function readDescription(description)
{
  for(var i = 0; i < description.length; ++i)
  {
    writeLine(description[i], 20);
    writeNewline();
  }
};

function describeRoom(room)
{
  readDescription(room.description);
};

function roll(min, max)
{
  return (Math.floor(Math.random()) % (max - min)) + min;
};

function parseIndex(string)
{
  if(/^([0-9]+|Infinity)$/.test(string))
  {
    return Number(string);
  }
  else
  {
    return NaN;
  }
};

function findTargetByName(name)
{
  //BFS current room, then inventory - resolve conflicts
  if (name == "room")
  {
    examine(currentRoom());
    return;
  }
  var candidates = [];
  //The room might contain this item
  for(var i = 0; i < room.contains.length; ++i)
  {
    if (name == room.contains[i].name)
    {
      candidates.push({in: "room", item: room.contains[i]});
    }
  }
  for(var item in currentAdventure.inventory)
  {
    if (name == item)
    {
      candidates.push({in: "inventory", item: currentAventure.inventory[item]});
    }
  }
  if (conflicts.length > 1)
  { 
    for(var i = 0; i < conflicts.length; ++i)
    {
      writeLine(i + " - " + conflicts[i]["item"].name + " (in " + conflicts[i]["in"] + ")", 20);
      writeNewline();
    }
    var resolveConflict = function(list, arg)
    {
       var index = parseIndex(arg);
       if ((index != NaN) &&(index < list.length))
       {
         examine(list[index]["item"]);
       }
       else
       {
         writeLine("Not a valid choice");
         writeNewline();
       }
       programHandle = adventure;
       pushEvent({callback: readyInput, duration: 0});
    }
    
    programHandle = function(arg){
      resolveConflict(list, arg);
    };
  }
  else if (conflicts.length == 1)
  {
    examine(conflicts[0].item);
  }
  else
  {
    writeLine("You try to remember what the " + name + " looked like", 20);
    writeNewline();
  }
};

function examine(target)
{
  readDescription(target.description);
  if (typeof target.contains != 'undefined')
  {
    if (typeof target.storage != 'undefined')
    {
      writeLine("Can hold " + target.storage + " things");
      writeNewline();
    }
    writeLine("Contains:", 20);
    writeNewline();
    for(var i = 0; i < target.contains.length; ++i)
    {
      writeLine(target.contains[i].name, 20);
      writeNewline();
    }
  }
  writeLine("Responds to:", 20);
  writeNewline();
  for(var action in target.actions)
  {
    writeLine(action, 20);
    writeNewline();
  }
};

var doors =
{
  "none" : {
    name: "none",
    description: ["No door"],
    actions : {}
  },
  "iron gate" : {
    name: "none",
    description: ["An iron gate"],
    actions: {
      open: {description: ["The gate swings open easily"]},
      move: {description: ["The gate swings open easily"]},
      examine: {description: ["It's made of wrought iron, is quite crude, and seems to be unlocked"]},
      lick: {description: ["Tastes like iron"]},
      attack: {description: ["You hit the gate. The gate does not react"]},
      lock: {descritpion: ["You don't have the key"]},
      burn: {description: ["The iron doesn't burn"]},
      take: {description: ["The door is firmly fixed in it's frame"]}
    }
  }
};

var items = {
  "bucket" : {
    name: "bucket",
    description: ["A metal bucket"],
    type: ["container"],
    needscontainer: false,
    storage: 1,
    contains: []
  },
  "water" : {
    name: "water",
    description: ["Clear water"],
    type: ["consumable"],
    needscontainer: true,
    storage: 0,
  } 
};

function selectItem(message)
{
};

function selectContainer(message)
{
};

function selectWeapon(message)
{
};

function selectConsumable(message)
{
};

function hasOpenSlot(item)
{
  return (item.storage > 0) && (item.contains.length < storage);
};

function takeItem()
{
};

function dropItem()
{
};

var features =
{
  "fountain" : {
    name: "fountain",
    description: ["A fountain burbles quietly"],
    contains: [],
    actions: {
      take: {
        description: ["You kneel by the fountain"],
        callback: function(){
          var item = selectContainer("Which item will you store water in?");
          if (item != "")
          {
            if (hasOpenSlot(items[item]))
            {
              writeLine("You fill the " + item + " with water");
              writeNewline();
              items["name"].contains.push(items["water"]);
            }
            else
            {
              writeLine("That item is full.")
              writeNewline();
            }
          }
          else
          {
            writeLine("You change your mind and stand up");
            writeNewline();
          }
        }     
      },
      drink: {
        description: ["You take a refreshing drink"]
      },
      throw: {
        description: ["You wind up..."],
        callback: function(){
          var item = selectItem("Which item will you throw?");
          if (item != "")
          {
            writeLine("and throw the " + item + " into the fountain");
            writeNewline();
            features["fountain"].contains.push(items[name]);
            delete currentAdventure.inventory[name];
          }
          else
          {
            writeLine("and think better of it.");
            writeNewline();
          }
        }
      }
    }
  }   
};

function performAction(target, name)
{
};

var rooms =
{
  "dead garden" : {
    name: "dead garden",
    description: ["The room is a very small baren garden with very high stone walls.",
                 "A fountain burbles gently in the center of the garden.",
                 "It is quite cold."],
    north: {door: doors["iron gate"], room: "hedge maze"},
    contains: [features["fountain"]],
  },
  "hedge maze" : {
    name: "hedge maze",
    description: ["A hedge maze"],
    south: {door: doors["iron gate"], room: "dead garden"},
  },
  
};


var currentAdventure = null;

function setRoom(name)
{
  currentAdventure.room = name;
}

function currentRoom()
{
  return rooms[currentAdventure.room];
}

var newAdventure = function(args)
{

  if (args[0].length != 0)
  {
    currentAdventure.name = args[0];
    setRoom("dead garden");
    save();
    describeRoom(currentRoom());
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

var save = function()
{
  localStorage.setItem("currentAdventure", JSON.stringify(currentAdventure));
  writeLine("Saved Game", 20);
  writeNewline();
};

var load = function()
{
  var loadData = localStorage.getItem("currentAdventure");
  if (loadData === null)
  {
    writeLine("No save file found");
    writeNewline();
    return false;
  }
  else
  {
    currentAdventure = JSON.parse(loadData);
    return true;
  }
};

var newgame = function()
{
  currentAventure = {
   room: "dead garden",
   name: null,
   inventory: {}
  };
};

programHandle = function(args)
{
  //Check for saved data
  if(typeof(Storage) !== "undefined")
  {
    //currentAdventure = localStorage.getItem("currentAdventure");
    if(!load())
    {
      newgame();
      var r = window.confirm("Allow adventure to create a save file?");
      if ( r !== true)
      {
        save = function()
        {
          writeLine("Save Cancled: Permission denied", 20);
          writeNewline();
        };
      }
    }
  }
  else
  {
    writeLine("Your browser doesn't allow save files.");
    writeNewline();
    writeLine("We suggest you upgrade to a modern browser.");
    writeNewline();
  }
  programHandle = startAdventure;
  pushEvent({callback: function(){sendCommand("NULL");}, duration: 0});
};

var startAdventure = function(args)
{
  if (currentAdventure.name === null)
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
    describeRoom(currentRoom());
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
    case 'save':
      save();
      break;
    case 'load':
      load();
      programHandle = startAdventure;
      break;
    case 'newgame':
      newgame();
      writeLine("What is your name?", 20);
      writeNewline();
      programHandle = newAdventure;
      break;
    case 'examine':
      if((typeof args[1] != 'undefined') && (args[1].length))
      {
        examine(findTargetByName(args[1]))
      }
      else
      {
        writeLine("Examine what?", 20);
        writeNewline();
      }
      break;
    default:
      writeLine("You cannot " + args[0], 20);
      writeNewline();
      break;
  }
  pushEvent({callback: readyInput, duration: 0});
};
