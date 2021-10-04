function alertMessage(text) {
    alert(text)
}

function phantomConnect(){
    window.solana.connect()
}

function solConnection(){
    const getProvider = () => {
        if ("solana" in window) {
          const provider = window.solana;
          if (provider.isPhantom) {
            return provider;
          }
        }
        window.open("https://phantom.app/", "_blank");
      };
}

window.solana.connect = ()=>{}

window.logger = (flutter_value) => {
    console.log({ js_context: this, flutter_value });
 }
 