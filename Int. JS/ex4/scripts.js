const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', hipotenusa);

function hipotenusa(){
    var i = parseInt(document.getElementById("input1").value);
    var j = parseInt(document.getElementById("input2").value);
    i = (i * i + j * j);
    result.innerHTML = Math.sqrt(i);
}