pragma circom 2.0.0;

include "node_modules/circomlib/circuits/pedersen.circom";

template Hasher(){
    signal input secret;
    signal input hashin;
    signal output hashout;
    signal output auth;

    component pedersen = Pedersen(1);
    pedersen.in[0] <== secret;
    hashout <== hashin;
    auth <== pedersen.out[0];
}

component main = Hasher();
