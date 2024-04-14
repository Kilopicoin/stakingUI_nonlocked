import React, { useEffect, useState } from "react";
import { ethers } from "ethers"; // Import ethers.js library
import StakingA from "./abis/StakingA.json";
import Token from "./abis/Token.json";
import "./App.css";
import Swal from "sweetalert2";

// Smart Contract Address (replace with your own)
const StakingAAddress = "0xf1e683838aB750Afb0762cf28593378DC4C5997a";
const TokenAddress = "0x09e6E20FF399c2134C14232E172ce8ba2b03017E";

const App = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [isMetaMaskLoggedIn, setIsMetaMaskLoggedIn] = useState(true);
  const [walletAddress, setWalletAddress] = useState(StakingAAddress);
  const [walletAddressS, setWalletAddressS] = useState('');
  const [TotalStaked, setTotalStaked] = useState("0");
  const [KendiStakelerimG, setKendiStakelerimG] = useState([]);
  const [stakeAmount, setstakeAmount] = useState(0);
  const [TXH, setTXH] = useState(1);
  const [LoadBalanceD, setLoadBalanceD] = useState(1);
  const [Loading, setLoading] = useState(0);
  const [HowTo, setHowTo] = useState(0);
  const [Rules, setRules] = useState(0);
  const [ONEbalance, setONEbalance] = useState(0);
  const [tokenMiktari, settokenMiktari] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          let ONEbalance = await provider.getBalance(address);
          ONEbalance = parseInt(ONEbalance);
          ONEbalance = ONEbalance / 10 ** 18;

          let addressS = address.toString();
          addressS =
            ethers.utils.getAddress(addressS).slice(0, 6) +
            "..." +
            ethers.utils.getAddress(addressS).slice(-4);

          setWalletAddress(address);
          setWalletAddressS(addressS);
          setONEbalance(ONEbalance);
        } catch (error) {
          console.error("Error loading balance:", error);
        }
      } else {
        console.log("Please install MetaMask to use this application.");
        setIsMetaMaskInstalled(false);
      }
    };

    loadBalance();
  }, [LoadBalanceD]);

  useEffect(() => {
    const handleContractFunction = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create an instance of the smart contract
        const contract = new ethers.Contract(
          StakingAAddress,
          StakingA.abi,
          signer
        );

        const TokenContract = new ethers.Contract(
          TokenAddress,
          Token.abi,
          signer
        );

        let tokenMiktari = await TokenContract.balanceOf(walletAddress);
        tokenMiktari = parseInt(tokenMiktari);
        let tokenMiktariK = tokenMiktari / ( 10 ** 6);

        tokenMiktariK = tokenMiktariK.toLocaleString('en-US', {
          style: 'decimal',
          maximumFractionDigits: 2,
        });
        settokenMiktari(tokenMiktariK);


        // Call a function on the smart contract

        // const mappingData = await contract.stakes('<address>', '<uint256>');

        let KisiStakeAdedi = await contract.stakeNos(walletAddress);
        KisiStakeAdedi = parseInt(KisiStakeAdedi);

        const kendiStakelerim = [];
        let toplamstakeim = 0;

        for (var i = 1; i <= KisiStakeAdedi; i++) {
          let kendiStakelerimTekil = await contract.stakes(walletAddress, i);

          let Currentprize = await contract.unstakePrizeCalc(i);
          Currentprize = parseInt(Currentprize);

          const stakinDurumu = kendiStakelerimTekil.Active.toString();

          let shortenedAddressA = kendiStakelerimTekil.adres.toString();
          shortenedAddressA =
            ethers.utils.getAddress(shortenedAddressA).slice(0, 6) +
            "..." +
            ethers.utils.getAddress(shortenedAddressA).slice(-4);

          let StartDateX = parseInt(kendiStakelerimTekil.dateStart);
          StartDateX = StartDateX * 1000;
          let StartDateXZ = new Intl.DateTimeFormat(["ban", "id"], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(StartDateX);

          let LastPrizeDateX = parseInt(kendiStakelerimTekil.LastPrizeGet);
          LastPrizeDateX = LastPrizeDateX * 1000;
          let LastPrizeDateXZ = new Intl.DateTimeFormat(["ban", "id"], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(LastPrizeDateX);

          let amountC = parseInt(kendiStakelerimTekil.amount) / (10 ** 6);
          let amount = amountC.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          let prizeC = Currentprize / (10 ** 6);
          let prize = prizeC.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 3,
          });

          if (stakinDurumu === "1") {
            kendiStakelerim.push({
              id: parseInt(kendiStakelerimTekil.stakeid),
              adres: shortenedAddressA,
              amountC: amountC,
              amount: amount,
              datestart: StartDateXZ,
              prizeC: prizeC,
              prize: prize,
              lastprizeget: LastPrizeDateXZ,
              amountUnstake: 0,
            });
          }

          toplamstakeim =
            toplamstakeim + parseInt(kendiStakelerimTekil.amount) / 10 ** 6;
        }

        setKendiStakelerimG(kendiStakelerim);

        toplamstakeim = toplamstakeim.toLocaleString('en-US', {
          style: 'decimal',
          maximumFractionDigits: 2,
        });
        setTotalStaked(toplamstakeim);

        // Handle the result
        console.log("Smart contract function result:");
      } catch (error) {
        console.error("Error calling contract function:", error);
      }
    };

    handleContractFunction();
  }, [walletAddress, TXH]);


    const checkMetaMaskLogin = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setIsMetaMaskLoggedIn(accounts.length > 0);

          window.ethereum.on("accountsChanged", (Newaccounts) => {
            // Handle wallet change
            setIsMetaMaskLoggedIn(Newaccounts.length > 0);
            setLoadBalanceD(LoadBalanceD + 1);
            console.log("cüzdan değişti");
          });


          

          
        } catch (error) {
          console.error("Error checking MetaMask login status:", error);


        }
      }
    };

    checkMetaMaskLogin();


  const loadingOn = async () => {
    setLoading(1);
  };

  const loadingOff = async () => {
    setLoading(0);
  };

  const updateStakeAmount = async (evt) => {
    setstakeAmount(evt.target.value);
  };

  const updateUNStakeAmount = (evt, id) => {
    const newValue = evt.target.value;

    setKendiStakelerimG((prevArray) => {
      const newArray = [...prevArray]; // Mevcut diziyi kopyala

      // amountUnstake değeri 40 olan satırın indeksini bul
      const rowIndex = newArray.findIndex((item) => item.id === id);

      if (rowIndex !== -1) {
        newArray[rowIndex].amountUnstake = newValue; // Belirli satıra yeni değeri ata
      }

      return newArray; // Yeni diziyi döndür
    });
  };

  const stakeX = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create an instance of the smart contract
      const contract = new ethers.Contract(
        StakingAAddress,
        StakingA.abi,
        signer
      );

      const TokenContract = new ethers.Contract(
        TokenAddress,
        Token.abi,
        signer
      );

      let tokenMiktariK = await TokenContract.balanceOf(walletAddress);
      tokenMiktariK = parseInt(tokenMiktariK);

      let status = await contract.status();
      status = parseInt(status);

      let kullanimS = await contract.KullanimS(walletAddress);
      kullanimS = parseInt(kullanimS);

      let simdi = await contract.simdi();
      simdi = parseInt(simdi);
      kullanimS = kullanimS + 3600; // 3600 bir saatlik saniye

      

      const stakeAmountK = stakeAmount * 10 ** 6 ;

      if (simdi < kullanimS) {
        let fark = kullanimS - simdi;
        fark = fark / 60;
        fark = parseInt(fark, 10);
        Swal.fire({
          text: 'You need to wait for ' + fark + ' minutes for your next transaction',
          width: 300,
         
      });
      } else if (status === 0) {
        Swal.fire({
          text: 'New staking entrance is not active at this time',
          width: 300,
         
      });
      } else if (ONEbalance < 0.1) {
        Swal.fire({
          text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
          width: 300,
         
      });
      } else if (stakeAmount < 1) {
        Swal.fire({
          text: 'Stake amount can not be less than 1',
          width: 300,
         
      });
      } else if (tokenMiktariK < stakeAmountK) {
        Swal.fire({
          text: 'You do not have enough LOP tokens in your wallet',
          width: 300,
         
      });
      } else {
        let Verilmisizin = await TokenContract.allowance(
          walletAddress,
          StakingAAddress
        );
        Verilmisizin = parseInt(Verilmisizin);


        if (Verilmisizin === 0) {
          const transactionizin = await TokenContract.increaseAllowance(
            StakingAAddress,
            stakeAmountK,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const stakeAmountC = stakeAmount * 10 ** 6;
          const transaction = await contract.stake(stakeAmountC, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else if (Verilmisizin < stakeAmountK) {
          const fark = stakeAmountK - Verilmisizin;

          const transactionizin = await TokenContract.increaseAllowance(
            StakingAAddress,
            fark,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const stakeAmountC = stakeAmount * 10 ** 6;
          const transaction = await contract.stake(stakeAmountC, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else {
          const stakeAmountC = stakeAmount * 10 ** 6;
          const transaction = await contract.stake(stakeAmountC, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        }
      }
    } catch (err) {
      // Error handling code
      console.error(err);

      setTXH(TXH + 1);
    }
  };

  const UnstakeX = async (UNid, UNamount, UnPrize, AmountC) => {
    if (UnPrize > 0) {
      Swal.fire({
        text: 'You need to get the prize of this stake before unstaking',
        width: 300,
       
    });
    } else if (UNamount > AmountC) {
      Swal.fire({
        text: 'Unstake amount can not be more than Staked',
        width: 300,
       
    });
    } else if (ONEbalance < 0.1) {
      Swal.fire({
        text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
        width: 300,
       
    });
    } else if (UNamount < 1) {
      Swal.fire({
        text: 'Unstake amount can not be less than 1',
        width: 300,
       
    });
    } else {
      try {

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create an instance of the smart contract
        const contract = new ethers.Contract(
          StakingAAddress,
          StakingA.abi,
          signer
        );

        const TokenContract = new ethers.Contract(
          TokenAddress,
          Token.abi,
          signer
        );

        let tokenMiktariK = await TokenContract.balanceOf(StakingAAddress);
      tokenMiktariK = parseInt(tokenMiktariK);
      const UNstakeAmountK = UNamount * 10 ** 6;


        let kullanimS = await contract.KullanimS(walletAddress);
       kullanimS = parseInt(kullanimS);

      let simdi = await contract.simdi();
      simdi = parseInt(simdi);
      kullanimS = kullanimS + 3600; // 3600 bir saatlik saniye

      if (UNstakeAmountK > tokenMiktariK) {

        Swal.fire({
          text: 'Contract is out of balance. Code 422. Please tell this problem to the team via Telegram or Twitter',
          width: 300,
         
      });

      } else if (simdi < kullanimS) {
        let fark = kullanimS - simdi;
        fark = fark / 60;
        fark = parseInt(fark, 10);
        Swal.fire({
          text: 'You need to wait for ' + fark + ' minutes for your next transaction',
          width: 300,
         
      });
      } else {

        const UNstakeAmountC = UNamount * 10 ** 6;
        const transaction = await contract.unstake(UNid, UNstakeAmountC, {
          from: walletAddress,
          gasPrice: 101000000000,
        });

        loadingOn();
        await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();

        // Transaction confirmed, execute the success handling code

        setTXH(TXH + 1);


      }







      } catch (err) {
        // Error handling code
        setTXH(TXH + 1);
        console.error(err);
      }
    }
  };

  const GetPrize = async (Prizeid, Prizeamount) => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (Prizeamount < 0.001) {
        Swal.fire({
          text: 'Prize amount should be more than 0.001 LOP token to receive',
          width: 300,
         
      });
      } else if (ONEbalance < 0.1) {
        Swal.fire({
          text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
          width: 300,
         
      });
      } else {
        // Create an instance of the smart contract
        const contract = new ethers.Contract(
          StakingAAddress,
          StakingA.abi,
          signer
        );

        const TokenContract = new ethers.Contract(
          TokenAddress,
          Token.abi,
          signer
        );

        let tokenMiktariK = await TokenContract.balanceOf(StakingAAddress);
      tokenMiktariK = parseInt(tokenMiktariK);
      const PrizeamountK = Prizeamount * 10 ** 6;

        let kullanimS = await contract.KullanimS(walletAddress);
       kullanimS = parseInt(kullanimS);

      let simdi = await contract.simdi();
      simdi = parseInt(simdi);
      kullanimS = kullanimS + 3600; // 3600 bir saatlik saniye


      if (PrizeamountK > tokenMiktariK) {

        Swal.fire({
          text: 'Contract is out of balance. Code 422. Please tell this problem to the team via Telegram or Twitter',
          width: 300,
         
      });

      } else if (simdi < kullanimS) {
        let fark = kullanimS - simdi;
        fark = fark / 60;
        fark = parseInt(fark, 10);
        Swal.fire({
          text: 'You need to wait for ' + fark + ' minutes for your next transaction',
          width: 300,
         
      });
      } else {


        const transaction = await contract.unstakePrize(Prizeid, {
          from: walletAddress,
          gasPrice: 101000000000,
        });

        loadingOn();
        await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();
        // Transaction confirmed, execute the success handling code

        setTXH(TXH + 1);



      }






      }
    } catch (err) {
      // Error handling code
      setTXH(TXH + 1);
      console.error(err);
    }
  };

  return (
    <div className="ilkDiv">
      <div className="topSide">
        <div className="topSidekutu">
          <div className="topSidebutton">
            <button
              className="button-64"
              onClick={(event) => {
                event.preventDefault();

                if (HowTo === 0) {
                  setHowTo(1);
                } else {
                  setHowTo(0);
                }
              }}
            >
              How to use
            </button>
          </div>

          {HowTo === 1 && (
            <div className="top">
              <p>
                You need to have LOP tokens on Harmony Chain(Metamask) to use
                this Staking System
              </p>
              <p>
                If you do not have any LOP tokens and do not know how to use
                Metamask
              </p>
              <p>
              <a href="https://youtu.be/YetARTZl8yo?si=0QM3_u89bbQ78yD0" target="_blank" rel="noreferrer noopener">Click Here</a> to learn how to buy LOP tokens and use Metamask
              </p>
            </div>
          )}
        </div>
        <div className="topSidekutu">
          <div className="topSidebutton">
            <button
              className="button-64"
              onClick={(event) => {
                event.preventDefault();

                if (Rules === 0) {
                  setRules(1);
                } else {
                  setRules(0);
                }
              }}
            >
              Rules
            </button>
          </div>
          {Rules === 1 && (
            <div className="top">
              <p>There is only 1 Staking Option in this Staking system</p>
              <p>
                There is no Lock Rule in this staking system. You can unstake
                your tokens anytime you want
              </p>
              <p>
                APY increases in time in this staking system. First year has
                1,5% APY, Second year has 2,4% APY, Third year and the rest have
                3,0% APY
              </p>
              <p>Rewards (Prizes) release every month, like a salary</p>
              <p>
                You can unstake all of your tokens, some portion of your tokens
                or you can get your prizes only
              </p>
              <p>
                Unstaking has a 0,1% penalty, getting prizes does not have a
                penalty
              </p>
            </div>
          )}
        </div>
      </div>

      {Loading === 1 && (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      <div className="motherDiv">
        <h1>Kilopi Non-Locked Staking (Harmony)</h1>

        {isMetaMaskInstalled ? (
          <>
            {isMetaMaskLoggedIn ? (
              <>
                <div className="top">
                  <p>Your Address: {walletAddressS} </p>

                  <p>Your LOP tokens: {tokenMiktari} </p>

                  <p>Your Total Staked: {TotalStaked} </p>
                </div>
                <div className="putStake">
                  <input
                    id="stakeInput"
                    type="number"
                    value={stakeAmount}
                    onChange={updateStakeAmount}
                  />

                  <button
                    className="button-64"
                    onClick={(event) => {
                      event.preventDefault();
                      stakeX();
                    }}
                  >
                    Stake
                  </button>
                </div>
                <table className="table">
                  <thead className="tableTop">
                    <tr>

                      <th className="td" id="amount">
                        Amount
                      </th>
                      <th className="td" id="unstake">
                        Unstake
                      </th>
                      <th className="td" id="startDate">
                        Start Date
                      </th>
                      <th className="td" id="cPrize">
                        Current Prize
                      </th>

                      <th className="td" id="LPR">
                        Last Prize Received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="stacksDiv">
                    {KendiStakelerimG.map((A) => {
                      return (
                        <tr key={A.id} className="stacks">
                          <td className="td" id="amountC">{A.amount}</td>
                          <td className="td" id="unstakeC">
                            <input
                              className="input"
                              type="number"
                              value={A.amountUnstake}
                              onChange={(event) =>
                                updateUNStakeAmount(event, A.id)
                              }
                            />

                            <button
                              className="button-64"
                              onClick={(event) => {
                                event.preventDefault();
                                UnstakeX(A.id, A.amountUnstake, A.prizeC, A.amountC);
                              }}
                            >
                              <span className="text">Unstake</span>
                            </button>
                          </td>
                          <td className="td" id="startDateC">{A.datestart}</td>


                          <td className="td" id="cPrizeB">{A.prize}
                          
                            <button
                              className="button-64"
                              onClick={(event) => {
                                event.preventDefault();
                                GetPrize(A.id, A.prizeC);
                              }}
                            >
                              <span className="text">Get Prize</span>
                            </button>
                          </td>



                          <td className="td" id="LPRB">{A.lastprizeget}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <p>Please log in to your MetaMask wallet.</p>
            )}
          </>
        ) : (
          <p>Please install MetaMask to use this application.</p>
        )}
      </div>
    </div>
  );
};

export default App;
