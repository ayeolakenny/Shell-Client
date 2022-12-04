import { ethers } from "ethers";
import { Fragment, useContext, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { AppContext } from "../context/AppContext";
import { BANK_CONTRACT_MUMBAI_ADDRESS } from "../constants";
import { UserAddressNav } from "../components/UserAddressNav";
import { TransactionModal } from "../components/TransactionModal";
import { getTokenContracts } from "../helpers/getTokenContracts";

import { Navigation, Pagination, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { StakeModal } from "../components/StakeModal";

import bankArtifact from "../artifacts/contracts/Bank.sol/Bank.json";

import { calculateInterest } from "../utils/calculateInterest";
import { withdrawStakedTokens } from "../helpers/withdrawStakedToken";
import { getSigner } from "../helpers/getSigner";
import { getTokenBalances } from "../helpers/getTokenBalances";
import { getUserStakedPositions } from "../helpers/getUserStakedPositions";
import { errorToast } from "../lib/toast";

dayjs.extend(relativeTime);

const Home = () => {
  const {
    setProvider,
    provider,
    setBankContrat,
    bankContract,
    setTokenSymbols,
    signerAddress,
    setSignerAddress,
    signer,
    setTokenContracts,
    userStakedPositions,
    showAllStakedTokens,
    setUserStakedPositions,
    setTokenBalances,
    setSigner,
    setBankWebsocketContract,
    setShowStakingModal,
    tokenSymbols,
  } = useContext(AppContext);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const bankContract = new ethers.Contract(
        BANK_CONTRACT_MUMBAI_ADDRESS,
        bankArtifact.abi
      );
      setBankContrat(bankContract);

      const bankWebsocketContractProvider =
        new ethers.providers.WebSocketProvider(
          "wss://polygon-mumbai.g.alchemy.com/v2/Ep6Vz5nDFnjk1L6XbV1Ef1qJAgp-RsyK"
        );

      const bankWebsocketContract = new ethers.Contract(
        BANK_CONTRACT_MUMBAI_ADDRESS,
        bankArtifact.abi,
        bankWebsocketContractProvider
      );
      setBankWebsocketContract(bankWebsocketContract);

      const whiteListedSymbols = await bankContract
        .connect(provider)
        .getWhitelistedSymbols();
      setTokenSymbols(whiteListedSymbols);
      const allTokenContracts = await getTokenContracts(
        whiteListedSymbols,
        bankContract,
        provider
      );
      setTokenContracts(allTokenContracts);

      const addresses = await provider.listAccounts();
      if (addresses.length) {
        const currentSigner = await getSigner(provider);
        const signerAddress = await currentSigner?.getAddress();
        setSignerAddress(signerAddress);
        setSigner(currentSigner);
        const userStakedPositions = await getUserStakedPositions(
          bankContract,
          currentSigner
        );
        setUserStakedPositions(userStakedPositions!);
        const allBalances = await getTokenBalances(
          currentSigner,
          bankContract,
          whiteListedSymbols
        );
        setTokenBalances(allBalances);
      }
    };
    init();
  }, []);

  const handleWithdrawStakedToken = async (stakingPositionId: number) => {
    const response = confirm(
      "You ara about to withdraw your token to your wallet?"
    );
    if (response) {
      await withdrawStakedTokens(bankContract, signer!, stakingPositionId);
    } else {
      errorToast("Transaction canceled");
    }
  };

  const isConnected = () => signer !== undefined;

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

  return (
    <Fragment>
      {signerAddress && <UserAddressNav address={signerAddress} />}
      <TransactionModal />
      <StakeModal />
      <div className="m-5">
        {userStakedPositions.length > 0 ? (
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={25}
            slidesPerView="auto"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            navigation
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {userStakedPositions &&
              userStakedPositions
                .filter((position) =>
                  !showAllStakedTokens ? position.open === true : true
                )
                .map((position, idx) => (
                  <SwiperSlide key={idx}>
                    <Card>
                      <Card.Header className="text-center">
                        {position.tokenName.toUpperCase()}
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>
                          Staked{" "}
                          {dayjs(position.createdDate * 1000).format(
                            "MMMM DD YYYY"
                          )}
                          {/* "h:mma, MMMM DD YYYY" */}
                        </Card.Title>
                        <Card.Text>
                          <ListGroup variant="flush">
                            <ListGroup.Item>
                              Amount Staked: {position.amount}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Interest:{" "}
                              {calculateInterest(
                                Number(position.amount),
                                position.percentagePerAnnum
                              )}{" "}
                              SHT
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Status: {position.open ? "ongoing" : "inactive"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Due Date:{" "}
                              {dayjs(position.expire * 1000).fromNow()}
                            </ListGroup.Item>
                          </ListGroup>
                        </Card.Text>
                        <div className="text-center">
                          <div className="text-center">
                            {Math.floor(Date.now() / 1000) > position.expire ? (
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleWithdrawStakedToken(position.positionId)
                                }
                                disabled={!position.open}
                              >
                                {position.open ? "Withdraw" : "Paid"}
                              </Button>
                            ) : (
                              <Button variant="primary" disabled>
                                Not Mature
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        staked {dayjs(position.createdDate * 1000).fromNow()}
                      </Card.Footer>
                    </Card>
                  </SwiperSlide>
                ))}
          </Swiper>
        ) : isConnected() ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: "2px" }}>
              Loading your staked tokens, click the button below if you have no
              staked tokens yet
            </div>
            <Button variant="primary" onClick={() => setShowStakingModal(true)}>
              Stake Your First Token
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="primary" onClick={connect}>
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
