const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', maior);

function maior(){
    var i = parseInt(document.getElementById("input1").value);
    var j = parseInt(document.getElementById("input2").value);
    i = Math.max(i,j);
    result.innerHTML = i;
}