import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AppContext } from "../context/AppContext";
import Form from "react-bootstrap/Form";
import { TRANSACTION_TYPE } from "../types/enum";
import { toEther, toWei } from "../utils/etherConversion";
import { depositTokens } from "../helpers/depositToken";
import { withdrawTokens } from "../helpers/withdrawToken";
import { getTokenBalances } from "../helpers/getTokenBalances";
import { errorToast } from "../lib/toast";

export const TransactionModal = () => {
  const {
    showTransactionModal,
    setShowTransactionModal,
    tokenSymbols,
    transactionType,
    signer,
    signerAddress,
    bankContract,
    tokenContracts,
    setTokenBalances,
    tokenBalances,
    bankWebsocketContract,
  } = useContext(AppContext);
  const [amount, setAmount] = useState<string>("0");
  const [chosenSymbol, setChosenSymbol] = useState<string>("Matic");

  const handleClose = () => setShowTransactionModal(false);

  const handleDepositOrWithdrawalOfTokens = async () => {
    if (!amount || Number(amount) <= 0) {
      errorToast("Please pass a valid amount");
      return;
    }
    if (!chosenSymbol || tokenSymbols.indexOf(chosenSymbol) === -1) {
      errorToast("Plase select a token");
      return;
    }
    const wei = toWei(amount);

    if (transactionType === TRANSACTION_TYPE.DEPOSIT) {
      await depositTokens(
        wei,
        chosenSymbol,
        signer!,
        bankContract,
        tokenContracts,
        signerAddress
      );

      bankWebsocketContract!.on("DepositToken", async (_symbol, _amount) => {
        let resetTokenBalances = tokenBalances;
        for (let balances of resetTokenBalances) {
          if (balances.symbol === _symbol) {
            balances.balance += Number(toEther(_amount));
          }
        }
        setTokenBalances(resetTokenBalances);
      });

      const allBalances = await getTokenBalances(
        signer!,
        bankContract,
        tokenSymbols
      );
      setTokenBalances(allBalances);

      setShowTransactionModal(false);
    } else {
      await withdrawTokens(wei, chosenSymbol, bankContract, signer!);

      bankWebsocketContract!.on("WithdrawToken", async (_symbol, _amount) => {
        let resetTokenBalances = tokenBalances;
        for (let balances of resetTokenBalances) {
          if (balances.symbol === _symbol) {
            balances.balance -= Number(toEther(_amount));
          }
        }
        setTokenBalances(resetTokenBalances);
      });

      const allBalances = await getTokenBalances(
        signer!,
        bankContract,
        tokenSymbols
      );
      setTokenBalances(allBalances);

      setShowTransactionModal(false);
    }
  };

  return (
    <Modal
      show={showTransactionModal}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {transactionType === TRANSACTION_TYPE.DEPOSIT
            ? "Deposit"
            : "Withdraw"}
          Tokens
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>Select Token</Form.Label>
          <Form.Select
            value={chosenSymbol}
            onChange={(e) => {
              setChosenSymbol(e.target.value);
            }}
          >
            {tokenSymbols &&
              tokenSymbols.map((symbol, idx) => (
                <option value={symbol} key={idx}>
                  {symbol.toUpperCase()}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicNumber">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <Form.Text className="text-muted">
            Amount to
            {transactionType === TRANSACTION_TYPE.DEPOSIT
              ? " deposit"
              : " withdraw"}
          </Form.Text>
        </Form.Group>
        {/* 
        <Button variant="primary" type="submit">
          Submit
        </Button> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDepositOrWithdrawalOfTokens}>
          {transactionType === TRANSACTION_TYPE.DEPOSIT
            ? "Deposit"
            : "Withdraw"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
