const cp = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
  
let livereloadchild = null;

function enableLiveRestart() {        
    if(process.argv.findIndex(arg => arg === '--livereloadchild') > -1) {            
        return false;
    } else {
        rl.question('Press enter to restart at next beat', () => {
            const nextBeat = Math.floor(global.currentBeat()) + 1;
            const nextBeatStartTime = global.beatToTime(nextBeat);
            
            if(livereloadchild) {
                const previousLiveReloadChild = livereloadchild;                                   
                setTimeout(() => {
                    previousLiveReloadChild.kill('SIGINT');
                    console.log('\nReload');
                }, nextBeatStartTime - new Date().getTime());
            }
            livereloadchild = cp.fork(process.argv[1], ['--livereloadchild', '--starttime', nextBeatStartTime],
                {
                    silent: true
                }
            );
            setTimeout(() => enableLiveRestart(), 0);
        });
        return true;
    }
}

module.exports = {
    enableLiveRestart: enableLiveRestart
}