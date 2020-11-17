var trace = console.log.bind(console);

var wordList=["leon","delfin","amigos", "colegio","familia","amor", "salud", "sapo"];
//var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var alphabet = ["A","B","C","CH","D","E","F","G","H","I","J","K","L","LL","M","N","Ñ","O","P","Q","R","RR","S","T","U","V","W","X","Y","Z"];
var answeredList = [];
var rand1 = 0;
var rand2 = 0;
var wLength = 0;
var writable = false;
var totalWordLength = 0;
var maxWordLength = 0;
var tick = 0;
var allAnswered = true;

function sizeSort(a, b){ //tamaño Ordenar
	if (a.length > b.length){
		return 1;
	}
	else if (a.length == b.length) {
		return 0;
	}
	else {
		return -1;
	}
}

wordList.sort(sizeSort); //orden de palabras

// Pasa ancho + alto y devuelve una matriz 2D
function create2dArray(width, height){
	var x = new Array(height);	
	for (var i = 0; i < height; i++) {
		x[i] = new Array(width);
	}
  return x;
}

// Encuentra la longitud de la palabra más larga
for (var i = 0; i < wordList.length; i++){
	if (wordList[i].length > maxWordLength){
		maxWordLength = wordList[i].length;
	}
	totalWordLength += wordList[i].length;
}

var dimensions = (Math.ceil(Math.sqrt(totalWordLength)) + 2);

if(dimensions < maxWordLength){
	dimensions = (maxWordLength + 1);
}


var wordSearch = create2dArray(dimensions, dimensions);

// Agregue una palabra horizontal a la matriz.
function addH(word, array){
	wLength = word.length;
	rand1 = Math.floor(Math.random()*(wordSearch.length));
	rand2 = Math.floor(Math.random()*((wordSearch.length) - wLength));

	if (rand1 < 0){
		rand1 = 0;
	}
	if (rand2 < 0){
		rand2 = 0;
	}
	if ((rand2+wLength) <= array[rand1].length){
	for(var n = 0; n < wLength; n++){
			if (typeof array[rand1][rand2+n] == 'undefined' || array[rand1][rand2+n] === null || array[rand1][rand2+n] == word.charAt(n)){
				writable = true;
			}
			else {
				writable = false;
				break;
			}
		}
	}

	if (writable && (rand2+wLength) <= array[rand1].length){
		for (var i = 0; i < wLength; i++){
				array[rand1][rand2+i] = word.charAt(i); 
		}
		return true;
	}
	else {
		return false;
	}
}

// Agregue una palabra vertical a la matriz.
function addV(word, array){
	wLength = word.length;
	rand1 = Math.floor(Math.random()*(wordSearch.length - wLength));
	rand2 = Math.floor(Math.random()*wordSearch.length);

	if (rand1 < 0){
		rand1 = 0;
	}
	if (rand2 < 0){
		rand2 = 0;
	}
	if ((rand1+wLength) <= array.length){
		for(var n = 0; n < wLength; n++){
			if (typeof array[rand1+n][rand2] == 'undefined' || array[rand1+n][rand2] === null || array[rand1+n][rand2] == word.charAt(n)){
				writable = true;
			}
			else {
				writable = false;
				break;
			}
		}
	}

	if (writable && (rand1+wLength) <= array.length){
		for (var i = 0; i < wLength; i++){
				array[rand1+i][rand2] = word.charAt(i);
		}
		return true;
	}
	else {
		return false;
	}
}

// Agregue una palabra diagonal a la matriz.
function addD(word, array){
	wLength = word.length;
	rand1 = Math.floor(Math.random()*(wordSearch.length - wLength));
	rand2 = Math.floor(Math.random()*(wordSearch.length - wLength));

	if (rand1 < 0){
		rand1 = 0;
	}
	if (rand2 < 0){
		rand2 = 0;
	}
	if ((rand1+wLength) <= array.length && (rand2+wLength) <= array[rand1].length){
		for(var n = 0; n < wLength; n++){
			if (typeof array[rand1+n][rand2+n] == 'undefined' || array[rand1+n][rand2+n] === null || array[rand1+n][rand2+n] == word.charAt(n)){
				writable = true;
			}
			else {
				writable = false;
				break;
			}
		}
	}

	if (writable && (rand1+wLength) <= array.length && (rand2+wLength) <= array.length){
		for (var i = 0; i < wLength; i++){
				array[rand1+i][rand2+i] = word.charAt(i);
		}
		return true;
	}
	else {
		return false;
	}
}


//seleccion de direccion
function selectDirection(word, array){
	var status = false;
	for (var i = 0; i < 1000; i++){
		status = false;
		if ((Math.floor(Math.random()*3) + 1) == 1) {
			status = addH(word, array);
		}
		else if ((Math.floor(Math.random()*3) + 1) == 2){
			status = addD(word, array);
		}
		else {
			status = addV(word, array);
		}
		if (status){
			break;
		}
	}
	if (!status){
		selectDirection(word, array);
		//wordList.splice(wordList.indexOf(word), 1);
	}
}



for(var l = wordList.length-1; l >= 0; l--){
	wordList[l] = wordList[l].toUpperCase();
	selectDirection(wordList[l], wordSearch);
}


// IMAGEN
function returnImage(letra){
	var urlimage = "";
	
	switch (letra) {
    case "A":
    	urlimage ="imagenes/sopita/a.jpg";
       break
    case "B":
    	urlimage ="imagenes/sopita/b.jpg";
       break
    case "C":
    	urlimage ="imagenes/sopita/c.jpg";
       break
	case "CH":
    	urlimage ="imagenes/sopita/ch.jpg";
       break   
    case "D":
    	urlimage ="imagenes/sopita/d.jpg";
       break
	case "E":
    	urlimage ="imagenes/sopita/e.jpg";
       break
	case "F":
    	urlimage ="imagenes/sopita/f.jpg";
       break
	case "G":
    	urlimage ="imagenes/sopita/g.jpg";
       break
   case "H":
    	urlimage ="imagenes/sopita/h.jpg";
       break
	case "I":
    	urlimage ="imagenes/sopita/i.jpg";
       break
	case "J":
    	urlimage ="imagenes/sopita/j.jpg";
       break
	case "K":
    	urlimage ="imagenes/sopita/k.jpg";
       break   
	case "L":
    	urlimage ="imagenes/sopita/l.jpg";
       break
	case "LL":
    	urlimage ="imagenes/sopita/ll.jpg";
       break   
	case "M":
    	urlimage ="imagenes/sopita/m.jpg";
       break
	case "N":
    	urlimage ="imagenes/sopita/n.jpg";
       break
	case "Ñ":
    	urlimage ="imagenes/sopita/ñ.jpg";
       break
	case "O":
    	urlimage ="imagenes/sopita/o.jpg";
       break
	case "P":
    	urlimage ="imagenes/sopita/p.jpg";
       break   
	case "Q":
    	urlimage ="imagenes/sopita/q.jpg";
       break
	case "R":
    	urlimage ="imagenes/sopita/r.jpg";
       break
	case "RR":
    	urlimage ="imagenes/sopita/rr.jpg";
       break   
	case "S":
    	urlimage ="imagenes/sopita/s.jpg";
       break
	case "T":
    	urlimage ="imagenes/sopita/t.jpg";
       break
	case "U":
    	urlimage ="imagenes/sopita/u.jpg";
       break
	case "V":
    	urlimage ="imagenes/sopita/v.jpg";
       break
	case "W":
    	urlimage ="imagenes/sopita/w.jpg";
       break
	case "X":
    	urlimage ="imagenes/sopita/x.jpg";
       break
	case "Y":
    	urlimage ="imagenes/sopita/y.jpg";
       break
	case "Z":
    	urlimage ="imagenes/sopita/z.jpg";
       break
	default:
       urlimage = "";
	}	 
	urlimage = "<img src='"+urlimage+"'>";
	return urlimage;
}


//Escritura de las palabras de la sopa
function funEscribirPalabra(strPalabra)
{
	var strPalabraAux = strPalabra;
	var mtrLetras = ["CH", "LL", "�", "RR"];
	var res;
	
	for(var i = 1; i<=4; i++)
	{
		res = strPalabraAux.split(i);
		for(var j = 0; j < res.length-1; j++)
		{
			strPalabraAux = res[j] + mtrLetras[i-1];
		}
		if(res.length>1)
		{
			strPalabraAux = strPalabraAux + res[j];
		}
	}
	//alert(strPalabraAux);
	return strPalabraAux;
	
}







// Salida
function output(){
document.writeln("<table><tr><td>");
document.writeln("<table id='wsearch' cellspacing='0px' class='wsearchcss'>");
document.writeln("<tr>");
//var contador = 0;
for(var j = 0; j < wordSearch.length; j++){
	for(var k = 0; k < wordSearch[j].length; k++){
		if (typeof wordSearch[j][k] != 'undefined'){
			if (k != (wordSearch[j].length-1)){
				//document.writeln("<td id='"+j+"-"+k+"'>" + wordSearch[j][k] + "</td>");
				//document.writeln("<td id='"+j+"-"+k+"'>" + returnImage(wordSearch[j][k]) + "</td>");
				var strEscribir = "<td id='"+j+"-"+k+"' letra='"+wordSearch[j][k]+"'>" + returnImage(wordSearch[j][k]) + "</td>";
				document.writeln(strEscribir);

				//alert ("1-"+wordSearch[j][k]);
				//alert(strEscribir);
			}
			else {
				//document.writeln("<td id='"+j+"-"+k+"'>" + wordSearch[j][k] + "</td>");
				//document.writeln("<td id='"+j+"-"+k+"'>" + returnImage(wordSearch[j][k]) + "</td>");
				var strEscribir = "<td id='"+j+"-"+k+"' letra='"+wordSearch[j][k]+"'>" + returnImage(wordSearch[j][k]) + "</td>";
				document.writeln(strEscribir);
				document.writeln("</tr>");
				document.writeln("<tr>");
				//alert ("2-"+wordSearch[j][k]);
				//alert(strEscribir);
			}
		}
		else {
			if (k != (wordSearch[j].length-1)){
				wordSearch[j][k]=alphabet[Math.floor(Math.random()*alphabet.length)].toUpperCase();
				//document.writeln("<td id='"+j+"-"+k+"'>"+wordSearch[j][k]+"</td>");
				//document.writeln("<td id='"+j+"-"+k+"'>"+ wordSearch[j][k] +"</td>");
				var strEscribir = "<td id='"+j+"-"+k+"' letra='"+wordSearch[j][k]+"'>" + returnImage(wordSearch[j][k]) + "</td>";
				document.writeln(strEscribir);
				//alert(strEscribir);
				//alert ("3-"+wordSearch[j][k]);
				/*contador = contador + 1;
				alert ("2-"+returnImage(wordSearch[j][k]));*/
			}
			else {
				wordSearch[j][k]=alphabet[Math.floor(Math.random()*alphabet.length)].toUpperCase();
				//document.writeln("<td id='"+j+"-"+k+"'>"+wordSearch[j][k]+"</td>");
				//document.writeln("<td id='"+j+"-"+k+"'>"+ wordSearch[j][k] +"</td>");
				var strEscribir = "<td id='"+j+"-"+k+"' letra='"+wordSearch[j][k]+"'>" + returnImage(wordSearch[j][k]) + "</td>";
				document.writeln(strEscribir);
				//alert(strEscribir);
				//alert ("4-"+wordSearch[j][k]);
				
				document.writeln("</tr>");
				document.writeln("<tr>");
			}
		}
	}
//alert (contador);
}

document.writeln("</tr>");
document.writeln("</table>");
document.writeln("</td><td>");
document.writeln("<table id='ans' class='anscss'>");
for (var i = 0; i < wordList.length; i++){
	if (i % 2 === 0){
	//document.write("<tr><td class='answers'>");
	document.write("<tr><td class='answers' letra='"+funEscribirPalabra(wordList[i])+"'>");
	//document.write(wordList[i]);
	document.write(funEscribirPalabra(wordList[i]));
	document.writeln("</td>");
	}
	else {
	//document.write("<td class='answers'>");
	document.write("<td class='answers' letra='"+funEscribirPalabra(wordList[i])+"'>");
	//document.write(wordList[i]);
	document.write(funEscribirPalabra(wordList[i]));
	document.writeln("</td></tr>");
}
}
document.writeln("</td></tr></table>");
document.writeln("</table>");
}





output();

function main(){
var selectedArray = [];
var compareString = "";
var reversedString = "";
var comparison = false;
var isMouseDown = false;
var x = 0;
var y = 0;
var r = 0;
var g = 0;
var b = 0;
var prevID = 0;
var touch = 0;



 $(document)
	.mousedown(function () {
		return false;
	});
	$(document)
	.mouseover (function (){
		return false;
	});
      $("#wsearch td")
      .bind("mousedown touchstart", function () {
		if (!allAnswered){
			timerStarted = true;
		}
        isMouseDown = true;
        prevID = $(this).attr('id');
        if (!$(this).hasClass("highlighted")){
			
			//selectedArray.push($(this).text());
			//var strIDElemento = j+"-"+k;
			var atrLetraAux = $(this).getAttribute("letra");
			selectedArray.push(atrLetraAux);
			$(this).addClass("highlighted");
		}
		return false; // prevent text selection
        });
      $("#wsearch")
      .bind("mousemove touchmove", function (e) {
			e.preventDefault();
			if ($(this).attr('id') != prevID){
				addedToArray = false;
			}
			if (isMouseDown){
				if (e.originalEvent.touches || e.originalEvent.changedTouches){
					touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				}
				else {
					touch = e;
				}
				for (var q = 0; q < dimensions; q++){
					for (var a = 0; a < dimensions; a++){
						var offset = $("#"+q+"-"+a).offset();
						var x = touch.pageX - offset.left;
						var y = touch.pageY - offset.top;

						if (x < $("#"+q+"-"+a).outerWidth()-4 && x > 4 && y < $("#"+q+"-"+a).outerHeight()-4 && y > 2 && !addedToArray && !$("#"+q+"-"+a).hasClass("highlighted")){
								//trace('x: ' + x + ' y: ' + y);
								addedToArray = true;
								//selectedArray.push($("#"+q+"-"+a).text());
								var strIDElemento = q+"-"+a;
								var atrLetraAux = document.getElementById(strIDElemento).getAttribute("letra");
								selectedArray.push(atrLetraAux);
								
								prevID = $("#"+q+"-"+a).attr('id');
								$("#"+q+"-"+a).addClass("highlighted");
								break;
						}
					}
				}
			}
        })
		.bind("selectstart", function (e) {
          return false; // prevent text selection in IE
        });

      $(document).bind("mouseup touchend", function () {
			prevID = 0;
			isMouseDown = false;
			comparison = false;
			compareString = "";
			reversedString = "";

			for(var i = 0; i < selectedArray.length; i++){
				compareString = compareString.concat(selectedArray[i]);
			}
			for(var j = 0; j < wordList.length; j++){
					r = (Math.floor(Math.random()*256));
					g = (Math.floor(Math.random()*256));
					b = (Math.floor(Math.random()*256));
				if (compareString == wordList[j]){
					answeredList.push(wordList[j]);
					comparison = true;
					$("table td.highlighted").each(function (i){
						if (!$(this).hasClass("correct")){
						$(this).removeClass("highlighted");
						$(this).addClass("correct");
						$(this).css("background-color", "rgb("+r+","+g+","+b+")");
					}
					});
					$("#ans .answers").each(function (i){
						var strIDElemento = j+"-"+k;
						var atrLetraAux = $(this).getAttribute("letra");
						
						alert("atrLetraAux = "+atrLetraAux);
						alert("compareString = "+compareString);
						if (atrLetraAux == compareString && !$(this).hasClass("correct")){
						//if ($(this).text() == compareString && !$(this).hasClass("correct")){
							$(this).removeClass("answers");
							$(this).addClass("correct");
							$(this).css("background-color", "rgb("+r+","+g+","+b+")");
							return false;
						}
					});
					break;
				}
				reversedString = compareString.split('').reverse().join('');
				if (reversedString == wordList[j]){
					answeredList.push(wordList[j]);
					comparison = true;
					$("table td.highlighted").each(function (i){
						if (!$(this).hasClass("correct")){
						$(this).removeClass("highlighted");
						$(this).addClass("correct");
						$(this).css("background-color", "rgb("+r+","+g+","+b+")");
					}
					});
					$("#ans .answers").each(function (i){
						var strIDElemento = j+"-"+k;
						var atrLetraAux = $(this).getAttribute("letra");
						alert("atrLetraAux = "+atrLetraAux);
						alert("reversedString = "+reversedString);
						if (atrLetraAux == reversedString && !$(this).hasClass("correct")){							  
						//if ($(this).text() == reversedString && !$(this).hasClass("correct")){
							$(this).removeClass("answers");
							$(this).addClass("correct");
							$(this).css("background-color", "rgb("+r+","+g+","+b+")");
							return false;
						}
					});
					break;
				}
			}
				$("table td.highlighted").each(function (i){
						$(this).removeClass("highlighted");
					});
			for(var k = selectedArray.length-1; k >= 0; k--){
					selectedArray.splice(k,1);
				}

        });
    }