(function () {
    'use strict';
    /* Generar las dimensiones de la sopa dependiendo de la longitud mas grande (palabra).*/

    var WordFind = function () {  /*inicializa el objeto wordfind*/
      var letters = 'abcdefghijklmnoprstuvwyz'; /*Letras que rellenan la sopa de letras*/
      /*orientaciones posibles*/
      var allOrientations = ['horizontal','horizontalBack','vertical','verticalUp',
                             'diagonal','diagonalUp','diagonalBack','diagonalUpBack'];
      /*calcula el siguiente cuadrado dando un cuadrado inicial (x, y) y distancia (i) desde ese cuadrado.*/
      var orientations = {
        horizontal:     function(x,y,i) { return {x: x+i, y: y  }; },
        horizontalBack: function(x,y,i) { return {x: x-i, y: y  }; },
        vertical:       function(x,y,i) { return {x: x,   y: y+i}; },
        verticalUp:     function(x,y,i) { return {x: x,   y: y-i}; },
        diagonal:       function(x,y,i) { return {x: x+i, y: y+i}; },
        diagonalBack:   function(x,y,i) { return {x: x-i, y: y+i}; },
        diagonalUp:     function(x,y,i) { return {x: x+i, y: y-i}; },
        diagonalUpBack: function(x,y,i) { return {x: x-i, y: y-i}; }
      };
  
     /* posibles orientaciones dado la altura y el ancho de la sopa, dependiendo de la longitud de la palabra.*/
      var checkOrientations = {
        horizontal:     function(x,y,h,w,l) { return w >= x + l; },
        horizontalBack: function(x,y,h,w,l) { return x + 1 >= l; },
        vertical:       function(x,y,h,w,l) { return h >= y + l; },
        verticalUp:     function(x,y,h,w,l) { return y + 1 >= l; },
        diagonal:       function(x,y,h,w,l) { return (w >= x + l) && (h >= y + l); },
        diagonalBack:   function(x,y,h,w,l) { return (x + 1 >= l) && (h >= y + l); },
        diagonalUp:     function(x,y,h,w,l) { return (w >= x + l) && (y + 1 >= l); },
        diagonalUpBack: function(x,y,h,w,l) { return (x + 1 >= l) && (y + 1 >= l); }
      };
  
      /*cuadrado válido posible para la longitud de la palabra */ 
      var skipOrientations = {
        horizontal:     function(x,y,l) { return {x: 0,   y: y+1  }; },
        horizontalBack: function(x,y,l) { return {x: l-1, y: y    }; },
        vertical:       function(x,y,l) { return {x: 0,   y: y+100}; },
        verticalUp:     function(x,y,l) { return {x: 0,   y: l-1  }; },
        diagonal:       function(x,y,l) { return {x: 0,   y: y+1  }; },
        diagonalBack:   function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y    }; },
        diagonalUp:     function(x,y,l) { return {x: 0,   y: y<l-1?l-1:y+1  }; },
        diagonalUpBack: function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y  }; }
      };
  
      /**
       * agregar las palabras automaticamente una a una.
       * muestra la sopa de letra con todas sus palabras
       * @param {[String]} words: lista de palabras de la sopa
       * @param {[Options]} options: opciones usadas de relleno en la sopa
       */
      var fillPuzzle = function (words, options) {
        var puzzle = [], i, j, len;       
        for (i = 0; i < options.height; i++) { // inicializa la sopa en blanco
          puzzle.push([]);
          for (j = 0; j < options.width; j++) {
            puzzle[i].push('');
          }
        } 
        for (i = 0, len = words.length; i < len; i++) {// agrega cada palabra dentro de la sopa
          if (!placeWordInPuzzle(puzzle, options, words[i])) { 
            return null; // si la palabra no cabe en la sopa, abandona 
          }
        }       
        return puzzle;// retorno
      };
  
      /**
       * agrega la palabra correcta para ser encontra
       * ubicacion donde estara la palabra, opcion al azar.
       * control de maximacion de la palbra
       * retorna verdad si la palabra fue encontrada, falso de lo contrario
       * @param {[[String]]} puzzle: estado actual de la sopa
       */
      var placeWordInPuzzle = function (puzzle, options, word) { 
        var locations = findBestLocations(puzzle, options, word);// encuentra el mejor lugar para agregar la palabra
        if (locations.length === 0) {
          return false;
        }  
        var sel = locations[Math.floor(Math.random() * locations.length)];// escoge un lugar aleatoriamente para poner la palabra
        placeWord(puzzle, word, sel.x, sel.y, orientations[sel.orientation]);
        return true;
      };
  
      
      var findBestLocations = function (puzzle, options, word) {
  
        var locations = [],
            height = options.height,
            width = options.width,
            wordLength = word.length,
            maxOverlap = 0; // comienza la superposicion = 0
  
        // lazos durante todas las posibles posiciones
        for (var k = 0, len = options.orientations.length; k < len; k++) {   
          var orientation = options.orientations[k],
              check = checkOrientations[orientation],
              next = orientations[orientation],
              skipTo = skipOrientations[orientation],
              x = 0, y = 0;
  
          // lazos durante cada posicion en el tablero 
          while( y < height ) {
            // mirar si la orientacion es posible en ese lugar
            if (check(x, y, height, width, wordLength)) {
              // determinar si la palabra agregada esta en una posicion
              var overlap = calcOverlap(word, puzzle, x, y, next);
              // si la sobrecarga es mas grande que la superposiciones
              if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
                maxOverlap = overlap;
                locations.push({x: x, y: y, orientation: orientation, overlap: overlap});
              }
              x++;
              if (x >= width) {
                x = 0;
                y++;
              }
            }
            else {
              // si la celda actual no es posible, salte a la siguiente, donde si es posible.
              var nextPossible = skipTo(x,y,wordLength);
              x = nextPossible.x;
              y = nextPossible.y;
            }
          }
        }
  
        //  bajar todas las ubicaciones posibles, usando los que tienen la superposición máxima 
        return options.preferOverlap ?
               pruneLocations(locations, maxOverlap) :
               locations;
      };
  
   /** Determinar si una palabra en particular encaja o no
    * Orientación dentro de la sopa
    * Devuelve el número de letras superpuestas con palabras existentes si la palabra encaja en la posición especificada
    * @param {String} word: la palabra para encajar en el rompecabezas.
    * @param {[[String]]} puzzle: el estado actual del rompecabezas
    * @param {int} x: La posición x para verificar
    * @param {int} y: La posición y para verificar
    * @param {function} fnGetSquare: función que devuelve el siguiente cuadrado
   */
      var calcOverlap = function (word, puzzle, x, y, fnGetSquare) {
        var overlap = 0;
  
        // atraviesa los cuadrados para determinar si la palabra encaja
        for (var i = 0, len = word.length; i < len; i++) { 
          var next = fnGetSquare(x, y, i),
              square = puzzle[next.y][next.x];
          
        //si el cuadrado de la sopa ya contiene la letra, cuenta como un cuadrado superpuesto
          if (square === word[i]) {
            overlap++;
          }
          // if it contains a different letter, than our word doesn't fit
          // here, return -1
          else if (square !== '' ) {
            return -1;
          }
        }
        // si contiene una letra diferente,  palabra no cabe
        return overlap;
      };
  
      /**
      * Si se indicó la maximización de superposición, esta función se utiliza para podar la
      * lista de ubicaciones válidas hasta las que contienen la superposición máxima
      * Devuelve el conjunto de ubicaciones podado.
      * @param {[Ubicación]} Location: el conjunto de ubicaciones para podar
      * @param {int} overlay: el nivel requerido de superposición
      */
      var pruneLocations = function (locations, overlap) {
        var pruned = [];
        for(var i = 0, len = locations.length; i < len; i++) {
          if (locations[i].overlap >= overlap) {
            pruned.push(locations[i]);
          }
        }
        return pruned;
      };
  
      /**
      * Coloca una palabra en la sopa dada una posición inicial y orientación.
      * @param {[[String]]} puzzle: El estado actual de la sopa
      * @param {String} word: La palabra para encajar en la sopa.
      * @param {int} x: La posición x para verificar
      * @param {int} y: La posición y para verificar
      * @param {function} fnGetSquare: funcion que retorna al sgte escuadon
      */
      var placeWord = function (puzzle, word, x, y, fnGetSquare) {
        for (var i = 0, len = word.length; i < len; i++) {
          var next = fnGetSquare(x, y, i);
          puzzle[next.y][next.x] = word[i];
        }
      };
  
      return {
  
        /**
        * retorna a la lista de todas las posibles orientacaciones
        * @api public
        */
        validOrientations: allOrientations,
  
        /**
        * retorna las orientaciones de las funciones
        * @api public
        */
        orientations: orientations,
  
        
        newPuzzle: function(words, settings) {
          var wordList, puzzle, attempts = 0, opts = settings || {};
  
          // copia y ordena las palabras por longitud,insertando palabras en la sopa
          wordList = words.slice(0).sort( function (a,b) {
            return (a.length < b.length) ? 1 : 0;
          });
          
          // inicializa las opciones
          var options = {
            height:       opts.height || wordList[0].length,
            width:        opts.width || wordList[0].length,
            orientations: opts.orientations || allOrientations,
            fillBlanks:   opts.fillBlanks !== undefined ? opts.fillBlanks : true,
            maxAttempts:  opts.maxAttempts || 3,
            preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true
          };
  
          // agrega las palabras en la sopa
          // como la sopa es aleatoria, debe aumentar el tamaño segun cuando se modifique 
          while (!puzzle) {
            while (!puzzle && attempts++ < options.maxAttempts) {
              puzzle = fillPuzzle(wordList, options);
            } 
            if (!puzzle) {
              options.height++;
              options.width++;
              attempts = 0;
            }
          }
  
          // rellena los espacios vacios con letras
          if (options.fillBlanks) {
            this.fillBlanks(puzzle, options);
          }
          return puzzle;
        },
  
        fillBlanks: function (puzzle) {
          for (var i = 0, height = puzzle.length; i < height; i++) {
            var row = puzzle[i];
            for (var j = 0, width = row.length; j < width; j++) {
  
              if (!puzzle[i][j]) {
                var randomLetter = Math.floor(Math.random() * letters.length);
                puzzle[i][j] = letters[randomLetter];
              }
            }
          }
        },
  
        /**
        * salidas de la sopa a la consola, util para depurar.
        * retorna al formateado string representando la sopa.
        *
        * @param {[[String]]} puzzle: estado actual de la sopa
        * @api public
        */
        print: function (puzzle) {
          var puzzleString = '';
          for (var i = 0, height = puzzle.length; i < height; i++) {
            var row = puzzle[i];
            for (var j = 0, width = row.length; j < width; j++) {
              puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
            }
            puzzleString += '\n';
          }
  
          console.log(puzzleString);
          return puzzleString;
        }
      };
    };
  
    /**
    * permite que la biblioteca se use dentro del navegador y el nodo.js
    */
    var root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.wordfind = WordFind();
  
  }).call(this);
  
  