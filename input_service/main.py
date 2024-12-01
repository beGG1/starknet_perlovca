import hashlib
import json
import subprocess
import shutil
import uvicorn
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

def sha256_to_int32(data: str) -> int:
    # Compute SHA256 hash
    hash_object = hashlib.sha256(data.encode())
    sha256_hash = hash_object.digest()
    
    # Convert the first 4 bytes to an integer (32-bit)
    hash_int32 = int.from_bytes(sha256_hash[:4], byteorder="big") & 0xFFFFFFFF
    return hash_int32

def copy_files_to_garaga():
    source_dir = "/home/beggi_i3/Documents/code/starknet_perlovca/generate_proof"
    target_dir = "/home/beggi_i3/Documents/code/garaga"

    files_to_copy = ["public.json", "proof.json", "vk.json"]

    for file_name in files_to_copy:
        src_file = f"{source_dir}/{file_name}"
        dst_file = f"{target_dir}/{file_name}"
        shutil.copy2(src_file, dst_file)

def verify_onchain():
    copy_files_to_garaga()
    try:
        venv_path = "/home/beggi_i3/Documents/code/garaga/.venv"
        activate_script = os.path.join(venv_path, "bin", "activate")
        working_directory = "/home/beggi_i3/Documents/code/garaga"
        command = [
            "garaga", " verify-onchain",
            " --system", " groth16",
            " --contract-address", " 0x3fc99b264071e4148855abf2f723a38812eadc158eefc93adb822080dfbb60c",
            " --vk", " vk.json",
            " --proof", " proof.json",
            " --public-inputs", " public.json",
            " --env-file", " .secrets",
            " --network", " sepolia",
            " --fee", " eth"
        ]
        shell_command = f"source {activate_script} && {''.join(command)}"
        p = subprocess.Popen(shell_command, cwd=working_directory)
        p.wait()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Subprocess error: {e}")
    

def run_subprocess():
    try:
        working_directory = "/home/beggi_i3/Documents/code/starknet_perlovca/generate_proof"
        p = subprocess.Popen(["node", "./circuit_js/generate_witness.js", "./circuit_js/circuit.wasm", "input.json", "output.wtns"], cwd=working_directory)
        p.wait()
        p = subprocess.Popen(["snarkjs", "groth16", "prove", "circuit_0000.zkey", "output.wtns", "proof.json", "public.json"], cwd=working_directory)
        p.wait()
        copy_files_to_garaga()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Subprocess error: {e}")

@app.post("/data/proofgeneration")
async def create_data(message: str = Body(..., embed=True)):
    hash_as_int = sha256_to_int32(message)
    #hash_object = hashlib.sha256(message.encode()).digest()
    #hash_as_int = int.from_bytes(hash_object, byteorder='big')
    #hash_hex = hash_object.hexdigest() 
    secret = 12345
    input_data = {
        "secret": secret,
        "hashin": hash_as_int
    }
    with open("../generate_proof/input.json", "w") as f:
        json.dump(input_data, f)
    run_subprocess()
    #verify_onchain()

    return {"secret": secret, "hash": hash_as_int}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)