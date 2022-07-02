const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', salario);

function salario(){
    var i = parseInt(document.getElementById("input1").value);
    var j = parseInt(document.getElementById("input2").value);
    result.innerHTML = i * (1 + (j / 100));
}