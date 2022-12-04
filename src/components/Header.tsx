import { Fragment, useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AppContext } from "../context/AppContext";
import { getSigner } from "../helpers/getSigner";
import { getTokenBalances } from "../helpers/getTokenBalances";
import { TRANSACTION_TYPE } from "../types/enum";
import { TokenBalanceInterface } from "../types/interface";
import { toRound } from "../utils/toRoundNumber";

import { getUserStakedPositions } from "../helpers/getUserStakedPositions";

export const Header = () => {
  const {
    signer,
    setSignerAddress,
    setSigner,
    provider,
    bankContract,
    tokenSymbols,
    setTokenBalances,
    tokenBalances,
    setShowTransactionModal,
    setShowStakingModal,
    setTransactionType,
    setUserStakedPositions,
  } = useContext(AppContext);

  const connect = async () => {
    const signer = await getSigner(provider);
    const signerAddress = await signer?.getAddress();
    setSignerAddress(signerAddress);
    setSigner(signer);
    const allBalances = await getTokenBalances(
      signer,
      bankContract,
      tokenSymbols
    );
    setTokenBalances(allBalances);

    const userStakedPositions = await getUserStakedPositions(
      bankContract,
      signer
    );
    setUserStakedPositions(userStakedPositions!);
  };

  const isConnected = () => signer !== undefined;

  const handleDepositClicked = () => {
    setShowTransactionModal(true);
    setTransactionType(TRANSACTION_TYPE.DEPOSIT);
  };

  const handleWithdrawalClicked = () => {
    setShowTransactionModal(true);
    setTransactionType(TRANSACTION_TYPE.WITHDRAW);
  };

  return (
    <Fragment>
      {isConnected() ? (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">SHELL Bank</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link
                  href="#pricing"
                  onClick={() => setShowStakingModal(true)}
                >
                  Stake Token
                </Nav.Link>
                <NavDropdown title="Balances" id="collasible-nav-dropdown">
                  {tokenBalances &&
                    tokenBalances.map(
                      (token: TokenBalanceInterface, idx: number) => (
                        <NavDropdown.Item href={`#action/3.${idx}`} key={idx}>
                          {token.symbol.toUpperCase()}:{" "}
                          {toRound(Number(token.balance))}
                        </NavDropdown.Item>
                      )
                    )}
                </NavDropdown>
              </Nav>
              <Nav>
                <Nav.Link href="#deets">
                  <Button variant="primary" onClick={handleDepositClicked}>
                    Deposit
                  </Button>
                </Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  <Button variant="primary" onClick={handleWithdrawalClicked}>
                    Withdraw
                  </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">SHELL Bank</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                <Nav.Link href="#deets">
                  <Button variant="primary" onClick={connect}>
                    Connect Wallet
                  </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </Fragment>
  );
};
