'use strict';

function recreate_waves(){
    // Generate and display wave HTML.
    var wave_count = parseInt(
      document.getElementById('wave-count').value,
      10
    ) - 1;
    var loop_counter = wave_count;
    var wave_html = '';
    do{
        wave_html += '<div id=' + loop_counter + '></div>';
    }while(loop_counter--);
    document.getElementById('waves').innerHTML = wave_html;

    // Set orientation CSS to vertical by default...
    var display = 'inline-block';
    var height = '420px';
    var width = '42px';
    // ...or horizontal, if selected.
    if(document.getElementById('orientation').value == 0){
        display = 'block';
        height = '42px';
        width = '100%';
    }
    loop_counter = wave_count;
    do{
        document.getElementById(loop_counter).style.display = display;
        document.getElementById(loop_counter).style.height = height;
        document.getElementById(loop_counter).style.width = width;
    }while(loop_counter--);

    // Update waves.
    update_waves();
}

function pause(new_pause_state){
    window.clearInterval(timer);

    pause_state = new_pause_state;
    // If unpaused, update waves periodically.
    if(!pause_state){
        timer = window.setInterval(
          update_waves,
          parseInt(
            document.getElementById('wave-move-interval').value,
            10
          )
        );
    }
}

function randomize(){
    // Set random wave RGB colors, directions, and positions.
    var wave_count = parseInt(
      document.getElementById('wave-count').value,
      10
    );
    color_generators = [
      Math.floor(Math.random() * wave_count),// R position
      [1, -1][Math.floor(Math.random() * 2)],// R direction
      Math.floor(Math.random() * wave_count),// G position
      [1, -1][Math.floor(Math.random() * 2)],// G direction
      Math.floor(Math.random() * wave_count),// B position
      [1, -1][Math.floor(Math.random() * 2)] // B direction
    ];

    update_waves();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    var ids = {
      'orientation': 1,
      'wave-count': 10,
      'wave-move-interval': 100,
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

    randomize();
    recreate_waves();
    pause(false);
}

function update_waves(){
    // Move RGB color generators and change direction on collision with edge.
    var loop_counter = 2;
    var wave_count = parseInt(
      document.getElementById('wave-count').value,
      10
    ) - 1;
    do{
        color_generators[loop_counter * 2] += color_generators[loop_counter * 2 + 1];
        if(color_generators[loop_counter * 2] > wave_count){
            color_generators[loop_counter * 2 + 1] = -1;

        }else if(color_generators[loop_counter * 2] < 1){
            color_generators[loop_counter * 2 + 1] = 1;
        }
    }while(loop_counter--);

    // Update wave colors colors.
    loop_counter = wave_count;
    var new_colors = [];
    do{
        // Color is based on distance from generator.
        new_colors = [
          9 - Math.abs(loop_counter - color_generators[0]),
          9 - Math.abs(loop_counter - color_generators[2]),
          9 - Math.abs(loop_counter - color_generators[4]),
        ];

        // Set color CSS and prevent negative values.
        document.getElementById(loop_counter).style.backgroundColor =
          '#'
          + (new_colors[0] > 0
            ? new_colors[0]
            : 0
          )
          + (new_colors[1] > 0
            ? new_colors[1]
            : 0
          )
          + (new_colors[2] > 0
            ? new_colors[2]
            : 0
          );
    }while(loop_counter--);
}

var color_generators = [0, 0, 0, 0, 0, 0];
var pause_state = false;
var timer = 0;

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // R: randomize wave color positions.
    if(key === 82){
        randomize();

    // P: pause or unpause.
    }else if(key === 80){
        pause(!pause_state);
    }
};

window.onload = function(){
    document.getElementById('wave-move-interval').oninput = function(e){
        pause(pause_state);
    };

    recreate_waves();
    randomize();

    pause(false);

    document.getElementById('orientation').onchange = recreate_waves;
    document.getElementById('wave-count').oninput = recreate_waves;
};
