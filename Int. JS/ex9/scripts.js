const button = document.getElementById('button');
var result = document.getElementById("result");

button.addEventListener('click', media);

function media(){
    var i = parseInt(document.getElementById("input1").value);
    var j = parseInt(document.getElementById("input2").value);
    var x = parseInt(document.getElementById("input3").value);
    
    i = ((i * 2) + (j * 3) + (x * 5))/10;
    result.innerHTML = i;
}