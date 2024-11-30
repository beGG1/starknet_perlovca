const snarkjs = require('snarkjs')
const fs = require("fs");

async function verify(){
// const { proof, publicSignals } = await snarkjs.groth16.fullProve(
//     { secret: 1234 }, 
//     "circuit_js/circuit.wasm", 
//     "circuit_0000.zkey");

    const data = await fs.readFile("circuit_0000.zkey", "utf8");
    const sig = await fs.readFile("signals", "utf8");

    const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, { secret: 12345 }, data);
      if (res === true) {
        console.log("Verification OK");
      } else {
        console.log("Invalid proof");
      }
}
verify()

verify().then(() => {
    process.exit(0);
});
