How to run
-- Generating schema
https://dev.to/yagnadeepxo/the-beginners-guide-to-zk-snark-setting-up-your-first-proof-system-3le3

1) install circom
2) npm init -y
3) npm install circomlib
4) circuit.circom file is used for creating a scheme for prove in smart contract
5) circom circuit.circom --r1cs --wasm                      - compilation of new scheme
6) wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
There we are using already generated ptau file, but for the better purpose we need to generate in by our self
This is for groth16 algorithm
7) npm install snarkjs            - better to install it globaly. For some reason in node modules it didn't worked for me
(npm install -g snarkjs) - command to install globaly. May require sudo for Linux
8) npx snarkjs groth16 setup circuit.r1cs powersOfTau28_hez_final_12.ptau circuit_0000.zkey 
installing keys
9) npx snarkjs zkey export verificationkey circuit_0000.zkey vk.json
generating verefication key

10) node ./circuit_js/generate_witness.js ./circuit_js/circuit.wasm input.json output.wtns
creating witness

11) snarkjs groth16 prove circuit_0000.zkey output.wtns proof.json public.json
generating proof and public data