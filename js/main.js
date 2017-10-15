'use strict';

function repo_init(){
    core_repo_init({
      'info': '<input id=randomize type=button value=Randomize>',
      'storage': {
        'orientation': 1,
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select><td>Orientation<tr><td><input id=wave-count><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    recreate_waves();
    randomize();

    document.getElementById('randomize').onclick = function(){
        randomize();
        core_escape();
    };

    window.setInterval(
      update_waves,
      core_storage_data['frame-ms']
    );
}
