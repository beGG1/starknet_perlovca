import hashlib
import json
import subprocess
from fastapi import FastAPI, HTTPException
from fastapi import Body

app = FastAPI()

def run_subprocess():
    try:
        subprocess.run(["node", "./circuit_js/generate_witness.js", "./circuit_js/circuit.wasm", "input.json", "output.wtns"], check=True)
        subprocess.run(["snarkjs", "groth16", "prove", "circuit_0000.zkey", "output.wtns", "proof.json", "public.json"], check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Subprocess error: {e}")

@app.post("/data/proofgeneration")
async def create_data(message: str = Body(..., embed=True)):
    hash_object = hashlib.sha256(message.encode())
    hash_hex = hash_object.hexdigest() 
    input_data = {
        "message": message,
        "secret": "101"
    }
    with open("input.json", "w") as f:
        json.dump(input_data, f)
    run_subprocess()
    return {"secret": "101", "hash": hash_hex}