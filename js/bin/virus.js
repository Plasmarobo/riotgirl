function virusChar()
{
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!()[]{}-=+@#$%^&*~,.";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

programHandle = function()
{
  virus();
}

function virus()
{
  //pushEvent({callback: fastClear, duration: 10});
  var width  = 36;
  var height = 20;
  for(var y = 0; y < height; ++y)
  {
    for(var x = 0; x < width; ++x)
    {
      writeLine(virusChar(), 5);
    }
    writeNewline();
  }
  pushEvent({callback: exitProgram, duration: 100});
};
