    function startLogger() {
        if (!console) {
            console = {};
        }
        var old = console.log;
        var logger = document.getElementById('log');
       console.log = function (message) {
            if (typeof message == 'object') {
                logger.innerHTML +="> " + (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
            } else {
                logger.innerHTML +="> " +  message + '<br />';
            }
        }
        } startLogger();


  var tokenizeCharacter = (type, value, input, current) =>
	  (value === input[current]) ? [1, {type, value}] : [0, null]

  var tokenizeParenOpen = (input, current) => tokenizeCharacter('paren', '(', input, current)

  var tokenizeParenClose = (input, current) => tokenizeCharacter('paren', ')', input, current)

  var tokenizeSum = (input, current) =>
    tokenizeCharacter('sum', '+', input, current)

  var tokenizeSub = (input, current) =>
    tokenizeCharacter('sum', '+', input, current)

  var tokenizeMul = (input, current) =>
    tokenizeCharacter('mul', '*', input, current)

  var tokenizeDiv = (input, current) =>
    tokenizeCharacter('div', '/', input, current)

var tokenizeDot = (input, current) =>
		tokenizeCharacter('dot', ';', input, current)

  var tokenizeEqual = (input, current) =>
    tokenizeCharacter('equals', '=', input, current)

	var tokenizePattern = (type, pattern, input, current) => {
	  let char = input[current];
	  let consumedChars = 0;
	  if (pattern.test(char)) {
	    let value = '';
	    while (char && pattern.test(char)) {
	      value += char;
	      consumedChars ++;
	      char = input[current + consumedChars];
	    }
	    return [consumedChars , { type, value }];
	  }
	  return [0, null]
	}

  var tokenizeVar = (input ,current) => tokenizePattern("var", /[var]/i, input, current)

  var tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)

	var tokenizeNumber = (input, current) => tokenizePattern("number", /[0-9]/, input, current)

  var tokenizeString = (input, current) => {
  if (input[current] === '"') {
    let value = '';
    let consumedChars = 0;
    consumedChars ++;
    char = input[current + consumedChars];
    while (char !== '"') {
      if(char === undefined) {
        throw new TypeError("unterminated string ");
      }
      value += char;
      consumedChars ++;
      char = input[current + consumedChars];
    }
    return [consumedChars + 1, { type: 'string', value }];
  }
  return [0, null]
}

  var skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null]

  var tokenizers = [tokenizeSum, tokenizeSub, tokenizeMul, tokenizeDiv, tokenizeParenOpen, tokenizeParenClose, tokenizeDot, tokenizeVar, tokenizeEqual, skipWhiteSpace,  tokenizeString, tokenizeNumber, tokenizeName];

  var tokenizer = (input) => {
    let current = 0;
    let tokens = [];
    while (current < input.length) {
      let tokenized = false;
      tokenizers.forEach(tokenizer_fn => {
        if (tokenized) {return;}
        let [consumedChars, token] = tokenizer_fn(input, current);
        if(consumedChars !== 0) {
          tokenized = true;
          current += consumedChars;
        }
        if(token) {
            tokens.push(token);
        }
      });
      if (tokens[0].type != "var") {
        console.log(tokens[0].type);
        throw new TypeError('No var defined');
      }
      if (!tokenized) {
        throw new TypeError('I dont know what this character is: ' + input);
      }
    }
    return tokens;
  }

  var parseNumber = (tokens, current) => [current + 1,
                                    {type: 'NumberLiteral',
                                     value: tokens[current].value,
                                    }]

  var parseName = (tokens, current) => [current + 1,
                                        {type: 'Name',
                                         value: tokens[current].value,
                                        }]

  var parseString = (tokens, current) => [current + 1,
                                      {type: 'StringLiteral',
                                       value: tokens[current].value,
                                      }]

  var parseVar = (tokens, current) => [current + 1,
                                       {type: 'Variable',
                                       value: tokens[current].value,
                                      }]
  var parseSum = (tokens, current) => [current + 1,
                                       {type: 'Sum',
                                        value: tokens[current].value,
                                      }]
  var parseMul = (tokens, current) => [current + 1,
                                       {type: 'Mul',
                                        value: tokens[current].value,
                                      }]
  var parseSub = (tokens, current) => [current + 1,
                                       {type: 'Sub',
                                        value: tokens[current].value,
                                      }]
  var parseDiv = (tokens, current) => [current + 1,
                                       {type: 'Div',
                                        value: tokens[current].value,
                                      }]


  var parseEqual = (tokens, current) =>  {
    let token = tokens[current];
    let node = {
      type: 'Equal',
      name: token.value,
      params: []
    };
    token = tokens[++current];
    while (!(token.type === 'dot' && token.value ===';')) {
      [current, param] = parseToken(tokens, current);
      node.params.push(param);
      token = tokens[current];
    }
    current++;
    return [current, node];
  }

  var parseExpression =  (tokens, current)  => {
    let token = tokens[current];
    let node = {
      type: 'Parenthesis',
      name: token.value,
      params: [],
    };
    token = tokens[++current];
    while (!(token.type === 'paren' && token.value ===')')) {
      [current, param] = parseToken(tokens, current);
      node.params.push(param);
      token = tokens[current];
    }
    current++;
    return [current, node];
  }

  var parseToken = (tokens, current) => {
    let token = tokens[current];
    if (token.type === 'name') {
      return parseName(tokens, current);
    }
    if (token.type === 'sum') {
      return parseSum(tokens, current);
    }
    if (token.type === 'sub') {
      return parseSub(tokens, current);
    }
    if (token.type === 'mul') {
      return parseMul(tokens, current);
    }
    if (token.type === 'div') {
      return parseDiv(tokens, current);
    }
    if (token.type === 'equals') {
      return parseEqual(tokens, current);
    }
    if (token.type === 'number') {
      return parseNumber(tokens, current);
    }
    if (token.type === 'string') {
      return parseString(tokens, current);
    }
    if (token.type === 'paren' && token.value === '(') {
      return parseExpression(tokens, current);
    }
    if (token.type === 'var') {
      return parseVar(tokens, current);
    }
    throw new TypeError(token.type);
  }

  function parseProgram(tokens) {
    let current = 0;
    let ast = {
      type: 'Program',
      body: [],
    };
    let node = null;
    while (current < tokens.length) {
      [current, node] = parseToken(tokens, current);
      ast.body.push(node);
    }
    return ast;
  }

  emitNumber = node => node.value

  emitString = node => `"${node.value}"`

  emitProgram = node =>  node.body.map(exp => emitter(exp)).join('\n');

  emitExpression = node =>
  `${node.name}(${node.params.map(emitter)})`

  emitVar = node =>  "01     ";

  emitEqual = node =>  `VALUE "${node.params.map(emitter).join(" ")}"`;

  emitName = node => node.value.toUpperCase();

  emitSum = node => node.value;

  emitter = node => {
    switch (node.type) {
      case 'Program': return emitProgram(node);
      case 'CallExpression': return emitExpression(node);
      case 'NumberLiteral': return emitNumber(node);
      case 'StringLiteral': return emitString(node);
      case 'Variable':return emitVar(node)
      case 'Equal':return emitEqual(node)
      case 'Name':return emitName(node)
      case 'Sum':return emitSum(node)
      default:
        throw new TypeError(node.type);
                     }
}




      document.getElementById("compileButton").addEventListener("click", function() {
                var input = document.getElementById("input").value;

          console.log(emitter(parseProgram(tokenizer(input))));
    });
