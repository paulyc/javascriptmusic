import { EQBand } from "../fx/eqband";

import { Snare } from "../instruments/snare.class";
import { SawBass3 } from "../instruments/bass/sawbass3";
import { Eftang } from "../instruments/lead/eftang";
import { StereoSignal } from "../synth/stereosignal.class";
import { Kick } from "../instruments/kick.class";
import { BrassyLead } from "../instruments/lead/brassy";
import { Hihat } from "../instruments/hihat.class";

export const PATTERN_SIZE_SHIFT: usize = 4;
export const BEATS_PER_PATTERN_SHIFT: usize = 2;

const gain: f32 = 0.2;

const bass = new SawBass3();
const lead = new Eftang();
const kick = new Kick();
const snare = new Snare();
const hihat = new Hihat();
const brassylead = new BrassyLead();

export function setChannelValue(channel: usize, value: f32): void {
    switch(channel) {
        case 0:
            bass.note = value;
            break;
        case 1:
            lead.note = value;
            break;
        case 2:
            kick.note = value;
            break;
        case 3:
            snare.note = value;
            break;
        case 4:
            hihat.note = value;
            break;
        case 5:
            brassylead.note = value;
            break;
    }
    
}


const mainline = new StereoSignal();

let eqbandl = new EQBand(20, 19500);
let eqbandr = new EQBand(20, 19500);

export function mixernext(leftSampleBufferPtr: usize, rightSampleBufferPtr: usize): void {  
    let left: f32 = 0;
    let right: f32 = 0;

    // mainline.clear();

    bass.next();
    mainline.addStereoSignal(bass.signal, 0.2, 0.5);

    lead.next();
    mainline.addStereoSignal(lead.signal, 0.2, 0.5);

    kick.next();
    mainline.addStereoSignal(kick.signal, 0.2, 0.5);

    snare.next();
    mainline.addStereoSignal(snare.signal, 0.2, 0.5);    

    hihat.next();
    mainline.addStereoSignal(hihat.signal, 0.2, 0.5);

    brassylead.next();
    mainline.addStereoSignal(brassylead.signal, 0.5, 0.5);

    left = gain * (mainline.left );
    right = gain * (mainline.right );

    left = eqbandl.process(left);
    right = eqbandr.process(right);
    
    store<f32>(leftSampleBufferPtr, left);
    store<f32>(rightSampleBufferPtr, right);    
}