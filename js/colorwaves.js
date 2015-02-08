function recreate_waves(){
    // Generate and display wave HTML.
    var loop_counter = parseInt(document.getElementById('wave-count').value) - 1;
    var wave_html = '';
    do{
        wave_html += '<div id=' + loop_counter + '></div>';
    }while(loop_counter--);
    document.getElementById('waves').innerHTML = wave_html;

    // Set orientation CSS.
    loop_counter = parseInt(document.getElementById('wave-count').value) - 1;
    if(document.getElementById('orientation').value == 1){
        // Vertical orientation.
        do{
            document.getElementById(loop_counter).style.display = 'inline-block';
            document.getElementById(loop_counter).style.height = '420px';
            document.getElementById(loop_counter).style.width = '42px';
        }while(loop_counter--);

    }else{
        // Horizontal orientation.
        do{
            document.getElementById(loop_counter).style.display = 'block';
            document.getElementById(loop_counter).style.height = '42px';
            document.getElementById(loop_counter).style.width = '100%';
        }while(loop_counter--);
    }

    // Update waves.
    update_waves();
}

function pause(new_pause_state){
    window.clearInterval(timer);

    pause_state = new_pause_state;
    // If unpaused, update waves periodically.
    if(!pause_state){
        timer = window.setInterval(
          'update_waves()',
          parseInt(document.getElementById('wave-move-interval').value)
        );
    }
}

function randomize(){
    // Set random wave RGB colors, directions, and positions.
    var wave_count = parseInt(document.getElementById('wave-count').value);
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
    if(!confirm('Reset settings?')){
        return;
    }

    document.getElementById('orientation').value = 1;
    document.getElementById('wave-count').value = 10;
    document.getElementById('wave-move-interval').value = 100;

    randomize();
    recreate_waves();
    pause(false); 
}

function update_waves(){
    // Move RGB color generators and change direction on collision with edge.
    var loop_counter = 2;
    do{
        color_generators[loop_counter * 2] += color_generators[loop_counter * 2 + 1];
        if(color_generators[loop_counter * 2] > parseInt(document.getElementById('wave-count').value) - 1){
            color_generators[loop_counter * 2 + 1] = -1;

        }else if(color_generators[loop_counter * 2] < 1){
            color_generators[loop_counter * 2 + 1] = 1;
        }
    }while(loop_counter--);

    // Update wave colors colors.
    loop_counter = parseInt(document.getElementById('wave-count').value) - 1;
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

document.getElementById('wave-move-interval').oninput = function(e){
    pause(pause_state);
};

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
    recreate_waves();
    randomize();

    pause(false);

    document.getElementById('orientation').onchange = recreate_waves;
    document.getElementById('wave-count').oninput = recreate_waves;
};
