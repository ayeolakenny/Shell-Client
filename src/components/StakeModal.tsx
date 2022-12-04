import React, { Fragment, useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AppContext } from "../context/AppContext";
import Form from "react-bootstrap/Form";
import { toEther, toWei } from "../utils/etherConversion";
import { stakeToken } from "../helpers/stakeToken";
import { STAKE_DEDUCT_MODE } from "../types/enum";
import { stakeOptions } from "../constants/stakeOptions";
import { getTokenBalance } from "../helpers/getTokenBalance";
import { errorToast } from "../lib/toast";

export const StakeModal = () => {
  const {
    showStakingModal,
    setShowStakingModal,
    tokenSymbols,
    bankContract,
    signer,
    tokenContracts,
    setUserStakedPositions,
    signerAddress,
    bankWebsocketContract,
  } = useContext(AppContext);
  const [amount, setAmount] = useState<string>("0");
  const [chosenSymbol, setChosenSymbol] = useState<string>("Matic");
  const [stakeDeductMode, setStakeDeductMode] = useState<string>("balance");
  const [stakeDurationPercentage, setStakeDurationPercentage] =
    useState<number>(2);
  const [stakeDuration, setStakeDuration] = useState<string>(
    stakeOptions[0].title
  );
  const [stakeDurationDays, setStakeDurationDays] = useState<number>(10);

  const handleClose = () => setShowStakingModal(false);

  const handleTokenStake = async () => {
    if (!amount || Number(amount) <= 0) {
      errorToast("Please pass a valid amount");
      return;
    }
    if (stakeDeductMode.toLowerCase() === STAKE_DEDUCT_MODE.BALANCE) {
      const initialTokenBalance = await getTokenBalance(
        chosenSymbol,
        signer!,
        bankContract
      );
      if (Number(amount) > Number(initialTokenBalance)) {
        errorToast("Insufficient funds in your balance");
        return;
      }
    }

    if (!chosenSymbol || tokenSymbols.indexOf(chosenSymbol) === -1) {
      errorToast("Please select a token");
      return;
    }

    if (!stakeDuration || !stakeDurationPercentage) {
      errorToast("Please select duration");
      return;
    }

    const wei = toWei(amount);
    await stakeToken(
      chosenSymbol,
      wei,
      bankContract,
      signer!,
      stakeDeductMode,
      tokenContracts,
      stakeDurationPercentage,
      stakeDurationDays!,
      signerAddress
    );

    bankWebsocketContract!.on(
      "StakeToken",
      async (
        _positionId,
        _symbol,
        _amount,
        _percentagePerAnnum,
        _walletAddress,
        _createdDate,
        _expire,
        _open
      ) => {
        let data = {
          amount: toEther(_amount),
          createdDate: Number(_createdDate),
          expire: Number(_expire),
          open: _open,
          percentagePerAnnum: Number(_percentagePerAnnum),
          positionId: Number(_positionId),
          tokenName: _symbol,
        };
        setUserStakedPositions((prevStakedPositions) => [
          data,
          ...prevStakedPositions,
        ]);
      }
    );

    setShowStakingModal(false);
  };

  return (
    <Modal
      show={showStakingModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Stake Tokens</Modal.Title>
          <Form.Text className="text-muted">
            Interest is paid immediately to your wallet in Shell Token (SHT)
          </Form.Text>
        </div>
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
        <Form.Group className="mb-2" controlId="formBasicNumber">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <Form.Text className="text-muted">Amount to stake</Form.Text>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Deduct From</Form.Label>
          <Form.Select
            value={stakeDeductMode}
            onChange={(e) => {
              setStakeDeductMode(e.target.value);
            }}
          >
            <option value="balance">BALANCE</option>
            <option value="wallet">WALLET (metamask)</option>
          </Form.Select>
          <Form.Text className="text-muted">
            default is set to balance
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Duration</Form.Label>
          <Form.Select
            value={stakeDuration}
            onChange={(e) => {
              setStakeDuration(e.target.value);
            }}
          >
            {stakeOptions.map((options, idx) => (
              <option value={options.title} key={idx}>
                {options.title} at {options.percentagePerAnnum}% per annum
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {stakeDuration && (
          <Form.Group className="mb-2">
            <Form.Label>Days</Form.Label>
            <Form.Select
              value={stakeDurationPercentage}
              onChange={(e) => {
                setStakeDurationPercentage(Number(e.target.value));
                e.target.value === "2"
                  ? setStakeDurationDays(10)
                  : e.target.value === "4"
                  ? setStakeDurationDays(20)
                  : e.target.value === "6"
                  ? setStakeDurationDays(30)
                  : e.target.value === "8"
                  ? setStakeDurationDays(40)
                  : e.target.value === "10"
                  ? setStakeDurationDays(50)
                  : e.target.value === "12"
                  ? setStakeDurationDays(60)
                  : e.target.value === "14"
                  ? setStakeDurationDays(70)
                  : e.target.value === "16"
                  ? setStakeDurationDays(80)
                  : e.target.value === "18"
                  ? setStakeDurationDays(90)
                  : null;
              }}
            >
              {stakeDuration === stakeOptions[0].title ? (
                <Fragment>
                  <option value="2">10 days at 2% per annum</option>
                  <option value="4">20 days at 4% per annum</option>
                  <option value="6">30 days at 6% per annum</option>
                </Fragment>
              ) : stakeDuration === stakeOptions[1].title ? (
                <Fragment>
                  <option value="8">40 days at 8% per annum</option>
                  <option value="10">50 days at 10% per annum</option>
                  <option value="12">60 days at 12% per annum</option>
                </Fragment>
              ) : stakeDuration === stakeOptions[2].title ? (
                <Fragment>
                  <option value="14">70 days at 14% per annum</option>
                  <option value="16">80 days at 16% per annum</option>
                  <option value="18">90 days at 18% per annum</option>
                </Fragment>
              ) : null}
            </Form.Select>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleTokenStake}>
          Stake
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
