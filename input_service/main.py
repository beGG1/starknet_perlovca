import hashlib
import json
import subprocess
from fastapi import FastAPI, HTTPException
from fastapi import Body
import uvicorn

app = FastAPI()

def run_subprocess():
    try:
        working_directory = "/home/beggi_i3/Documents/code/starknet_perlovca/generate_proof"
        p = subprocess.Popen(["node", "./circuit_js/generate_witness.js", "./circuit_js/circuit.wasm", "input.json", "output.wtns"], cwd=working_directory)
        p.wait()
        p = subprocess.Popen(["snarkjs", "groth16", "prove", "circuit_0000.zkey", "output.wtns", "proof.json", "public.json"], cwd=working_directory)
        p.wait()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Subprocess error: {e}")

@app.post("/data/proofgeneration")
async def create_data(message: str = Body(..., embed=True)):
    hash_object = hashlib.sha256(message.encode())
    hash_hex = hash_object.hexdigest() 
    input_data = {
        "secret": 12345,
        "message": message
    }
    with open("input.json", "w") as f:
        json.dump(input_data, f)
    run_subprocess()
    return {"secret": "101", "hash": hash_hex}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8002)