(function (document, $, wordfind) {

    'use strict';
  
    
  
    /**
    * inicializar el objeto wordfingame.
    * @api private
    */
    var WordFindGame = function() {
  
      // lista de palabras de la sopa
      var wordList;
  
      /**
      * dibujar la sopa insertando filas de botones dentro de ella.
      * @param {String} el: el elemento jQuery para seleccionar en la sopa
      * @param {[[String]]} puzzle: la sopa a dibujar
      */
      var drawPuzzle = function (el, puzzle) {
        
        var output = '';
        // para cada fila en la sopa
        for (var i = 0, height = puzzle.length; i < height; i++) {
          // anexar un div para represnetar las filas de la sopa t
          var row = puzzle[i];
          output += '<div>';
          // para cada elemento de la fila
          for (var j = 0, width = row.length; j < width; j++) {
              //anezar un boton con lo apropiado de la clase
              output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
              output += row[j] || '&nbsp;';
              output += '</button>';
          }
          // cerrar el div que representa las filas
          output += '</div>';
        }
        $(el).html(output);
      };
  
      /**
      * dibujar las palabras insertando no ordenadamente en la sopa.
      *
      * @param {String} el: el elemento jQuery para escribir las palabras
      * @param {[String]} words: las palabras a dibujar
      */
      var drawWords = function (el, words) {
        
        var output = '<ul>';
        for (var i = 0, len = words.length; i < len; i++) {
          var word = words[i];
          output += '<li class="word ' + word + '">' + word;
        }
        output += '</ul>';
  
        $(el).html(output);
      };
  
  
      /**
      * eventos del juego
      * siguiendo las indicaciones, palabra seleccionada, palabra encontrada, y
      * fin del juego.
      */
  
      // estado del juego
      var startSquare, selectedSquares = [], curOrientation, curWord = '';
  
      /**
      * seleccion desde el mouse para iniciar el juego. 
      */
      var startTurn = function () {
        $(this).addClass('selected');
        startSquare = this;
        selectedSquares.push(this);
        curWord = $(this).text();
      };
  
  
  
      /**
      * Evento de escoger con el mouse. 
      */
      var select = function (target) {
        // si el usuario no acierta en la palabra, solo retorna
        if (!startSquare) {
          return;
        }
  
        // si el nuevo cuadro is actualmente el mismo de antes, retornar.
        var lastSquare = selectedSquares[selectedSquares.length-1];
        if (lastSquare == target) {
          return;
        }
  
        // mirar si el usuario retrocede y corrige su eleccion
        var backTo;
        for (var i = 0, len = selectedSquares.length; i < len; i++) {
          if (selectedSquares[i] == target) {
            backTo = i+1;
            break;
          }
        }
  
        while (backTo < selectedSquares.length) {
          $(selectedSquares[selectedSquares.length-1]).removeClass('selected');
          selectedSquares.splice(backTo,1);
          curWord = curWord.substr(0, curWord.length-1);
        }
  
  
        // mirar si esto es solo una nueva orientacion del primer cuadrado 
        // esto es necesario para facilitar la selección de palabras diagonales
        var newOrientation = calcOrientation(
            $(startSquare).attr('x')-0,
            $(startSquare).attr('y')-0,
            $(target).attr('x')-0,
            $(target).attr('y')-0
            );
  
        if (newOrientation) {
          selectedSquares = [startSquare];
          curWord = $(startSquare).text();
          if (lastSquare !== startSquare) {
            $(lastSquare).removeClass('selected');
            lastSquare = startSquare;
          }
          curOrientation = newOrientation;
        }
  
        // ver si el movimiento tiene la misma orientación que el último movimiento
        var orientation = calcOrientation(
            $(lastSquare).attr('x')-0,
            $(lastSquare).attr('y')-0,
            $(target).attr('x')-0,
            $(target).attr('y')-0
            );
  
       // si el nuevo cuadrado no tiene una orientación válida, simplemente ignóralo.
       // esto hace que la selección de palabras diagonales sea menos frustrante
        if (!orientation) {
          return;
        }
  
        // finalmente, si no hubo orientación previa o si este movimiento es a lo largo
        // la misma orientación que el último movimiento, luego juega el movimiento
        if (!curOrientation || curOrientation === orientation) {
          curOrientation = orientation;
          playTurn(target);
        }
  
      };
      
      var touchMove = function(e) {
        var xPos = e.originalEvent.touches[0].pageX;
        var yPos = e.originalEvent.touches[0].pageY;
        var targetElement = document.elementFromPoint(xPos, yPos);
        select(targetElement)
      };
      
      var mouseMove = function() { 
        select(this);
      };
  
      var playTurn = function (square) {
  
       // formando una palabra válida
        for (var i = 0, len = wordList.length; i < len; i++) {
          if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
            $(square).addClass('selected');
            selectedSquares.push(square);
            curWord += $(square).text();
            break;
          }
        }
      };
  
      /**
      * Evento que maneja el mouse hacia arriba en un cuadrado. Comprueba si una palabra válida
      * fue creado y actualiza la clase de las letras y la palabra si lo fue. Entonces
      * restablece el estado del juego para comenzar una nueva palabra.
      * *
      */
      var endTurn = function () {
  
        // ver si formamos una palabra válida
        for (var i = 0, len = wordList.length; i < len; i++) {
          
          if (wordList[i] === curWord) {
            $('.selected').addClass('found');
            wordList.splice(i,1);
            $('.' + curWord).addClass('wordFound');
          }
  
          if (wordList.length === 0) {
            $('.puzzleSquare').addClass('complete');
          }
        }
  
       // restablecer el turno
        $('.selected').removeClass('selected');
        startSquare = null;
        selectedSquares = [];
        curWord = '';
        curOrientation = null;
      };
  
      /**
       * Dado dos puntos, asegúrese de que sean adyacentes y determine qué
       * orientación el segundo punto es relativo al primero
       * @param {int} x1: la coordenada x del primer punto
       * @param {int} y1: la coordenada y del primer punto
       * @param {int} x2: la coordenada x del segundo punto
       * @param {int} y2: la coordenada y del segundo punto
       */
      var calcOrientation = function (x1, y1, x2, y2) {
  
        for (var orientation in wordfind.orientations) {
          var nextFn = wordfind.orientations[orientation];
          var nextPos = nextFn(x1, y1, 1);
  
          if (nextPos.x === x2 && nextPos.y === y2) {
            return orientation;
          }
        }
  
        return null;
      };
  
      return {
  
        /**
        * Crea un nuevo juego de búsqueda de palabras y dibuja el tablero y las palabras.
        * *
        * Devuelve el rompecabezas que se creó.
        * *
        * @param {[String]} words: las palabras para agregar al rompecabezas
        * @param {String} puzzleEl: Selector para usar al insertar el rompecabezas
        * @param {String} wordsEl: Selector para usar al insertar la lista de palabras
        * @param {Opciones} options: opciones de WordFind para usar al crear el rompecabezas
        */
        create: function(words, puzzleEl, wordsEl, options) {
          
          wordList = words.slice(0).sort();
  
          var puzzle = wordfind.newPuzzle(words, options);
  
          // dibuja todas las palabras
          drawPuzzle(puzzleEl, puzzle);
          drawWords(wordsEl, wordList);
  
          // adjunta eventos a los botones
          // agrega eventos de forma optimista para windows 8 touch
          if (window.navigator.msPointerEnabled) {
            $('.puzzleSquare').on('MSPointerDown', startTurn);
            $('.puzzleSquare').on('MSPointerOver', select);
            $('.puzzleSquare').on('MSPointerUp', endTurn);
          }
          else {
            $('.puzzleSquare').mousedown(startTurn);
            $('.puzzleSquare').mouseenter(mouseMove);
            $('.puzzleSquare').mouseup(endTurn);
            $('.puzzleSquare').on("touchstart", startTurn);
            $('.puzzleSquare').on("touchmove", touchMove);
            $('.puzzleSquare').on("touchend", endTurn);
          }
  
          return puzzle;
        },
  
      };
    };
  
  
    /**
    * Permitir que el juego se use dentro del navegador
    */
    window.wordfindgame = WordFindGame();
  
  }(document, jQuery, wordfind));
  
  