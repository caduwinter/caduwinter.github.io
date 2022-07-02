const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', primo);

function primo(){
    var i = document.getElementById("input1").value;
    i = parseInt(i);
    result.innerHTML = "Não é primo.";
    if(i == 2){
        result.innerHTML = "Primo.";
    }
    for(var j=2; i > j && i % 2 != 0; j++){
        console.log("oi");
        if(i % j != 0){
            result.innerHTML = "Primo.";
        }
        else if(i % j == 0){
        result.innerHTML = "Não é primo.";
        break;
        }
    }
}