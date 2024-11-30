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


-- Creating testnet account from docs https://github.com/m-kus/cairo-quickstart?tab=readme-ov-file#create-testnet-account
1) export STARKNET_RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
export url
2) sncast account create --url $STARKNET_RPC --name test
creating account
3) https://blastapi.io/faucets/starknet-sepolia-eth
get test money
Use the faucet https://blastapi.io/faucets/starknet-sepolia-eth

Warning

Some faucets do not correctly handle addresses with leading zeros stripped, if you see "Invalid address" error, just add a zero after '0x'

4) sncast account deploy --url $STARKNET_RPC --name test --fee-token eth
deploy account

-- Set up garaga
1) Go throu the docs https://github.com/keep-starknet-strange/garaga
From the docs!!!! not readme. Readme is incorrect

2) pip install git+https://github.com/keep-starknet-strange/garaga.git@adb5c4f386ac70959a65dbf78f14ea9390b74dff       (instead of pip install garaga)
2.5) Don't forget to fill up the .secret file with 
3) garaga gen --system groth16 --vk vk.json 
Generating smart contract

