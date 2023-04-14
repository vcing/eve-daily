import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipboardJS from "clipboard";
import { Descriptions, message, Radio, RadioChangeEvent, Spin, Statistic } from "antd";

const timeout = 5000


const getMarketOrderName = (inputValue: string) => {
  return inputValue.split("\t")[0]
}

function getName(inputValue: string) {
  return getMarketOrderName(inputValue)
}

function MarketPricer() {
  const [loading, setLoading] = useState(false)
  const [cnMap, setCnMap] = useState<{ [key: string]: string }>({})
  const [enMap, setEnMap] = useState<{ [key: string]: string }>({})
  const [copyMode, setCopyMode] = useState<string>("sell")
  const [highestBuy, setHighestBuy] = useState<number | null>()
  const [lowestSell, setLowestSell] = useState<number | null>()
  const [name, setName] = useState<string>("")
  const [myPrice, setMyPrice] = useState<string>("")
  const inputOnChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {

    const value = e.target.value;
    const target = document.getElementById("target") as HTMLInputElement;
    const button = document.getElementById("button");
    if (!target || !button) return;

    let itemId = null
    const name = getName(value)
    setName(name)
    if (cnMap[name]) {
      itemId = cnMap[name]
    } else if (enMap[name]) {
      itemId = enMap[name]
    }
    if (!itemId) {
      message.error("物品解析失败, 请换个姿势复制粘贴重试.")
    } else {
      setLoading(true)
      try {
        const response = await axios.get(`https://api.evemarketer.com/ec/marketstat/json?typeid=${itemId}&usesystem=30000142`, { timeout })
        setLoading(false)
        const data = response.data?.[0]
        const sell = data?.sell?.min || null
        const buy = data?.buy?.max || null
        setLowestSell(sell)
        setHighestBuy(buy)

        if (buy && sell) {
          const currentPrice = copyMode === "sell" ? sell : buy
          const direction = copyMode === "sell" ? -1 : 1
          let myPrice = "";
          if (currentPrice.toString().indexOf(".") !== -1) {
            switch (currentPrice.toString().split(".")[1].length) {
              case 1:
                myPrice = (currentPrice + 0.1 * direction).toString();
                break;
              case 2:
                myPrice = (currentPrice + 0.01 * direction).toString();
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
            myPrice = parseInt(operateNumbers) + direction + zeros;
            setMyPrice(myPrice)
            target.value = myPrice
          }
        }
      } catch (e) {
        setLowestSell(null)
        setHighestBuy(null)
        setLoading(false)
        message.error("获取价格失败,请重试.")
      }
    }

    button.click();
    target.focus();
    target.value = "";
  }
  useEffect(() => {
    setLoading(true)
    new ClipboardJS("#button");
    Promise.all(
      [axios.get('./cnMap.json', { timeout }).then(response => {
        setCnMap(response.data)
      }),
      axios.get('./enMap.json', { timeout }).then(response => {
        setEnMap(response.data)
      })]).catch(() => {
        message.error("加载基础信息失败,请刷新重试.")
      }).finally(() => {
        setLoading(false)
      })
  }, []);

  const radioOnChange = (e: RadioChangeEvent) => {
    setCopyMode(e.target.value)
  }
  return (
    <div className="App">
      <Spin spinning={loading}>
        <header className="App-header">
          <h2>上架改单小助手</h2>
          <div style={{ margin: "20px" }}>
            <span style={{ fontSize: "16px" }}>自动复制价格: </span>
            <Radio.Group style={{ fontSize: "16px" }} onChange={radioOnChange} value={copyMode}>
              <Radio value={"sell"}>卖价</Radio>
              <Radio value={"buy"}>买价</Radio>
            </Radio.Group>
          </div>
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
          {lowestSell && highestBuy &&
            <>
              <Descriptions title={`查询结果(吉他):${name}`} style={{ width: "50%", textAlign: "center", margin: "20px" }} labelStyle={{ textAlign: "center", display: 'block' }} layout="vertical" bordered>
                <Descriptions.Item label={`最低卖价`} labelStyle={{ color: "rgba(255,0,0, 0.7)" }}><Statistic value={lowestSell} /></Descriptions.Item>
                <Descriptions.Item label={`最高买价`} labelStyle={{ color: "rgba(0,255,0, 0.5)" }}><Statistic value={highestBuy} /></Descriptions.Item>
              </Descriptions>
              {/* <span style={{ fontSize: "20px", color: "yellow" }}><span style={{ color: "white" }}>当前复制价格:</span>{myPrice}</span> */}
              <Statistic title="当前复制价格" value={myPrice} />
            </>}
        </header>
        <footer>
          <p style={{ fontSize: "14px" }}>
            价格数据会存在延迟<br />
            数据来源于 evemarketer.com<br />
          </p>
        </footer>
      </Spin>
    </div>
  )
}

export default MarketPricer