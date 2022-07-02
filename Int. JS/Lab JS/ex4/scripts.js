const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', fibonacci);

function fibonacci(){
    var all = "1 1 2";
    var x = 1;
    var y = 1;
    var z = 2;
    var aux = 0;
    for(var i = 0; i <= 96; i++){
        aux = z;
        x = y;
        y = aux;
        z = x + y;
        all = all + ' ' + z.toString();
        }
    result.innerHTML = all;
}