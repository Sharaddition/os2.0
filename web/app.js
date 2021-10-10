function alertMessage(text) {
  alert(text)
}


async function getAccount() {
  await window.solana.connect();
  if (window.solana.isConnected) {
      console.log("conected");
  } else {
      await window.solana.request({ method: "connect" });
  }

  var finalAddress = await getAddress();
  
  console.log(finalAddress);
  return finalAddress;
}

async function getAddress(){
  tempWallet = await window.solana.publicKey;
  finalAdr = String(tempWallet);

  return finalAdr;
}


async function walletStatus() {
  return window.solana.isConnected;
}



async function disconnectAccount() {
  await window.solana.disconnect();
  if (window.solana.isConnected) {
    window.solana.request({ method: "disconnect" });
  }
  window.solana.on('disconnect', () => console.log("disconnected!"))
}

