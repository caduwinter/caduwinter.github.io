const button = document.getElementById('button');
var res = document.getElementById('res');


button.addEventListener('click', par);

function par(){
    var a = 0;
    for(var i = 0; i<=1000; i++){
        if(i % 2 == 0){
            a=i+a;
        }
    }
    res.innerHTML = a;
}

