$(document).ready(function(){
  keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
          'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
          'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
          'Ctl', 'Alt', 'Space', 'Alt', 'Ctl'
	 ]
  $.each(keys, function(index, value){
		div = $('<div class="key"></div>');
		if (value === 'Space')
		{
		  div.addClass('spacekey');
		}
		lab = $('<div class="keylabel"></div>');
		lab.text(value);
		div.append(lab);
		$('.board').append(div);
	});
});
