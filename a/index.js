
const snarkjs = require('snarkjs')

async function generateProof(){
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      hashin: 12345
    }, 
    "circuit_js/circuit.wasm", 
    "circuit_0000.zkey");
  console.log(publicSignals);
  console.log(proof);

}

generateProof()

generateProof().then(() => {
    process.exit(0);
});

