function recreate_waves(){
    // generate wave HTML
    var counter = parseInt(document.getElementById('wave-count').value) - 1;
    var wave_html = '';
    do{
        wave_html += '<div id=' + counter + '></div>';
    }while(counter--);
    document.getElementById('waves').innerHTML = wave_html;

    // set orientation CSS
    counter = parseInt(document.getElementById('wave-count').value) - 1;
    if(document.getElementById('orientation').value == 1){
        // vertical
        do{
            document.getElementById(counter).style.display='inline-block';
            document.getElementById(counter).style.height='420px';
            document.getElementById(counter).style.width='42px';
        }while(counter--);
    }else{
        // horizontal
        do{
            document.getElementById(counter).style.display='block';
            document.getElementById(counter).style.height='42px';
            document.getElementById(counter).style.width='100%';
        }while(counter--);
    }
}

function pause(new_pause_state){
    clearInterval(timer);

    pause_state = new_pause_state;
    if(pause_state){ // if unpaused
        timer = setInterval(
          'update_waves()',
          parseInt(document.getElementById('wave-move-interval').value)
        );
    }
}

function randomize(){
    // set random RGB directions and positions
    var wave_count = parseInt(document.getElementById('wave-count').value);
    color_generators = [
      random_number(wave_count),// R position
      [1, -1][random_number(2)],// R direction
      random_number(wave_count),// G position
      [1, -1][random_number(2)],// G direction
      random_number(wave_count),// B position
      [1, -1][random_number(2)] // B direction
    ];

    update_waves();
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(confirm('Reset?')){
        document.getElementById('orientation').value = 1;
        document.getElementById('wave-count').value = 10;
        document.getElementById('wave-move-interval').value = 100;

        recreate_waves();
        pause(1); // sets project into unpaused state
    }
}

function update_waves(){
    // move RGB color generators
    // change direction on collision with edge
    var counter = 2;
    do{
        color_generators[counter * 2] += color_generators[counter * 2 + 1];
        if(color_generators[counter * 2] > parseInt(document.getElementById('wave-count').value) - 1){
            color_generators[counter * 2 + 1] = -1;

        }else if(color_generators[counter * 2] < 1){
            color_generators[counter * 2 + 1] = 1;
        }
    }while(counter--);

    // update colors
    counter = parseInt(document.getElementById('wave-count').value) - 1;
    var new_colors = [];
    do{
        // color is based on distance from generator
        new_colors = [
          9 - Math.abs(counter - color_generators[0]),
          9 - Math.abs(counter - color_generators[2]),
          9 - Math.abs(counter - color_generators[4])
        ];

        // set color CSS, prevent negative values
        document.getElementById(counter).style.backgroundColor = 
          '#'
          + (new_colors[0] > 0 ? new_colors[0] : 0)
          + (new_colors[1] > 0 ? new_colors[1] : 0)
          + (new_colors[2] > 0 ? new_colors[2] : 0);
    }while(counter--);
}

var color_generators = [0,0,0,0,0,0];
var pause_state = 0;
var timer = 0;

recreate_waves();
randomize();
pause(1); // sets project into unpaused state

document.getElementById('orientation').onchange = recreate_waves;
document.getElementById('wave-count').oninput = recreate_waves;
document.getElementById('wave-move-interval').oninput = function(){
    pause(pause_state);
};

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(key === 82){// R
        randomize();

    }else if(key === 80){// P
        pause(!pause_state);
    }
};

window.onload = recreate_waves;
