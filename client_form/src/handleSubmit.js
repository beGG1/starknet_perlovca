import CryptoJS from 'crypto-js';

const sha256ToInt32 = async (data) => {
  // Encode string as a Uint8Array
  const encoder = new TextEncoder();
  const dataArray = encoder.encode(data);

  // Compute SHA256 hash using SubtleCrypto
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataArray);

  // Convert the first 4 bytes of the hash to a 32-bit integer
  const hashArray = new Uint8Array(hashBuffer);
  const hashInt32 = (hashArray[0] << 24) | (hashArray[1] << 16) | (hashArray[2] << 8) | hashArray[3];

  return hashInt32 >>> 0; // Convert to unsigned 32-bit integer
};

// const sha256ToInt32 = (data) => {
//   // Compute SHA256 hash using crypto-js
//   const hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

//   // Take the first 8 characters (4 bytes) of the hash (since it's in hex format)
//   const hashPart = hash.substring(0, 8);

//   // Convert the hex string to a 32-bit integer
//   const hashInt32 = parseInt(hashPart, 16) >>> 0; // Convert to unsigned 32-bit integer
//   return hashInt32;
// };

const handleSubmit = async (e, text, setMessages, messages) => {
  e.preventDefault();
  // const hashedText = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
  const hash32 = await sha256ToInt32(text);
  const hashedText = hash32.toString(16);
  // const halfLength = Math.ceil(hashedText.length / 2);
  // const firstHalf = `0x${hashedText.slice(0, halfLength)}`;
  // const secondHalf = `0x${hashedText.slice(halfLength)}`;
  let firstHalf, secondHalf;
  if (hashedText.length > 32) {
    firstHalf = `0x${hashedText.slice(0, hashedText.length - 32)}`;
    secondHalf = `0x${hashedText.slice(hashedText.length - 32)}`;
  } else {
    firstHalf = '0x0';
    secondHalf = `0x${hashedText}`;
  }

  console.log("Hash32:", hash32);
  console.log('Hashed text:', hashedText);
  console.log('First half:', firstHalf);
  console.log('Second half:', secondHalf);
  const endpoint = 'https://starknet-sepolia.public.blastapi.io/';

  const payload = {
    id: 1,
    jsonrpc: "2.0",
    method: "starknet_call",
    params: {
      request: {
        contract_address: "0x03fc99b264071e4148855abf2f723a38812eadc158eefc93adb822080dfbb60c",
        entry_point_selector: "0x3687481a2be4c4e50cdf6e33eaa197a076f361ecc372efa25ff39a424b108f7",
        calldata: [secondHalf, firstHalf],
      },
      block_id: "pending",
    },
  };

  console.log('Payload:', payload);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Response:', data);

    const result = data.result[0];
    const newMessage = { message: text, result, time: new Date().toLocaleString() };
    const updatedMessages = [...messages, newMessage].slice(-5);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleSubmit;