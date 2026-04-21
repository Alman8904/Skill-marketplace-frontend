import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function WalletBalance() {

  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await authFetch("/payment/wallet-balance");
      setBalance(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load wallet balance");
    }
  };

  return (
    <div>
      <h3>Wallet Balance</h3>
      {balance !== null ? (
        <p>Current Balance: <b>${balance.walletBalance}</b></p>
      ) : (
        <p>{message || "Loading..."}</p>
      )}
    </div>
  );
}