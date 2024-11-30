pragma circom 2.0.0;

template Hasher(){
    signal input hashin;
    signal output hashout;

    hashout <== hashin;
}

component main = Hasher();
