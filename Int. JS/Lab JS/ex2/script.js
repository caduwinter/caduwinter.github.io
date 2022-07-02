const button = document.getElementById('button');
var res = document.getElementById('res');


button.addEventListener('click', exp);

function exp(){
    var input = document.getElementById('input1').value;
    var x = parseInt(input);
    var text = ' ';
    var y;
    for(var i = 1; i<31; i++){
        y = Math.pow(x,i);
        text = text + y.toString() + ' ';
        
        res.innerHTML = text;
    }
}

