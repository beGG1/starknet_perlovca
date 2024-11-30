import hashlib
import json
import subprocess
from fastapi import FastAPI, HTTPException
from DataInput import DataInput  # Импортируем DataInput из файла DataInput

app = FastAPI()

def run_subprocess():
     subprocess.run(["node", "./circuit_js/generate_witness.js", "./circuit_js/circuit.wasm", "input.json", "output.wtns"], check=True)
     subprocess.run(["snarkjs", "groth16", "prove", "circuit_0000.zkey", "output.wtns", "proof.json", "public.json"], check=True)

@app.post("/data/proofgeneration")
async def create_data(data_input: DataInput):

    hash_object = hashlib.sha256(data_input.message.encode())
    hash_hex = hash_object.hexdigest()

    input_data = {
        "message": data_input.message,
        "secret": data_input.secret
    }
    
    with open("input.json", "w") as f:
        json.dump(input_data, f)
    
    run_subprocess()
    return {"secret": data_input.secret, "hash": hash_hex}