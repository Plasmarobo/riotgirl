programHandle = function(args)
{
  var string = "";
  for(var i = 1; i < args.length; ++i)
  {
    if (i > 1)
    {
      string += (args[i] + " ");
    }
    else
    {
      string = args[i];
    }
  }
  writeLine("Echo: " + string, 20);
  writeNewline();
  pushEvent({callback: exitProgram, duration: 0});
};
