function writeEcho(string)
{
  writeLine("Echo: " + string, 20);
  writeNewline();
  exitProgram();
};

function executeEcho(arguments)
{
  var string = "";
  for(var i = 1; i < arguments.length; ++i)
  {
    if (i > 1)
    {
      string += (arguments[i] + " ");
    }
    else
    {
      string = argument[i];
    }
  }
  writeEcho(string);
};

programHandle = executeEcho;
