import React, { useEffect, useState } from "react";
import ClipboardJS from "clipboard";

function App() {
  // const [message, setMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [myPrice, setMyPrice] = useState("");
  useEffect(() => {
    new ClipboardJS("#button");
  }, []);
  const inputOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const target = document.getElementById("target") as HTMLInputElement;
    const button = document.getElementById("button");
    if (!target || !button) return;

    if (value.indexOf(" ISK\t") !== -1) {
      try {
        const currentPriceString = value
          .split(" ISK\t")[0]
          .split("\t")[2]
          .replaceAll(",", "");
        const currentPrice = parseFloat(currentPriceString);
        setCurrentPrice(currentPrice.toString());
        let myPrice = "";
        if (currentPrice.toString().indexOf(".") !== -1) {
          switch (currentPrice.toString().split(".")[1].length) {
            case 1:
              myPrice = (currentPrice - 0.1).toString();
              break;
            case 2:
              myPrice = (currentPrice - 0.01).toString();
          }
        } else {
          let i = 3;
          while (currentPrice.toString()[i] === "0") i--;
          const numbers = currentPrice.toString().substr(0, i + 1);
          let operateNumbers = numbers.toString();
          let zeros = currentPrice.toString().split(numbers)[1];
          while (operateNumbers.length < 4) {
            operateNumbers += "0";
            zeros = zeros.substring(0, zeros.length - 1);
          }
          myPrice = parseInt(operateNumbers) - 1 + zeros;
          setMyPrice(myPrice.toString());
        }
        target.value = myPrice;
      } catch (e) {}
    }
    button.click();
    target.focus();
    target.value = "";
  };
  return (
    <div className="App">
      <header className="App-header">
        <input
          id="target"
          autoFocus
          onChange={inputOnChange}
          style={{ fontSize: 30 }}
        />
        <button
          id="button"
          type="submit"
          style={{ display: "none" }}
          data-clipboard-target="#target"
        >
          submit
        </button>
        <h3>My Selling Price:{myPrice}</h3>
        <p>current lowest sell price:{currentPrice}</p>
      </header>
    </div>
  );
}

export default App;
