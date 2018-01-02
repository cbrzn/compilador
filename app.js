//Funcion pa la consola:
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

    
    const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);

    const Num = Symbol('num');

    const parse = tokens => {
    let c = 0;
    const peek = () => tokens[c++];

    const parseExpr = () => /\d/.test(peek()) ? console.log("Its a number") : console.log("Not a number")
    return parseExpr();
}

    function validation(input){
        var input = document.getElementById("input").value;
        console.log("string of text area: "+input);
        parse(lex(input));
    }




    console.log("fuck this shit");

    //hablale papi
    