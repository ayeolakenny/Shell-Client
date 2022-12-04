import { Contract, providers, Signer } from "ethers";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { TRANSACTION_TYPE } from "../types/enum";
import {
  TokenBalanceInterface,
  AppContextProviderProps,
  TokenContractInterface,
  UserStakedPositions,
} from "../types/interface";

interface AppContextProps {
  provider: providers.Web3Provider | undefined;
  setProvider: Dispatch<SetStateAction<providers.Web3Provider | undefined>>;
  bankContract: Contract | undefined;
  setBankContrat: Dispatch<SetStateAction<Contract | undefined>>;
  bankWebsocketContract: Contract | undefined;
  setBankWebsocketContract: Dispatch<SetStateAction<Contract | undefined>>;
  tokenSymbols: string[];
  setTokenSymbols: Dispatch<SetStateAction<string[]>>;
  signer: Signer | undefined;
  setSigner: Dispatch<SetStateAction<Signer | undefined>>;
  signerAddress: string;
  setSignerAddress: Dispatch<SetStateAction<string>>;
  tokenBalances: TokenBalanceInterface[];
  setTokenBalances: Dispatch<SetStateAction<TokenBalanceInterface[]>>;
  showTransactionModal: boolean;
  setShowTransactionModal: Dispatch<SetStateAction<boolean>>;
  transactionType: TRANSACTION_TYPE;
  setTransactionType: Dispatch<SetStateAction<TRANSACTION_TYPE>>;
  tokenContracts: TokenContractInterface[];
  setTokenContracts: Dispatch<SetStateAction<TokenContractInterface[]>>;
  showStakingModal: boolean;
  setShowStakingModal: Dispatch<SetStateAction<boolean>>;
  userStakedPositions: UserStakedPositions[];
  setUserStakedPositions: Dispatch<SetStateAction<UserStakedPositions[]>>;
  showAllStakedTokens: boolean;
  setShowAllStakedTokens: Dispatch<SetStateAction<boolean>>;
}

const initialValues: AppContextProps = {
  provider: undefined,
  setProvider: () => {},
  bankContract: undefined,
  setBankContrat: () => {},
  bankWebsocketContract: undefined,
  setBankWebsocketContract: () => {},
  tokenSymbols: [],
  setTokenSymbols: () => {},
  signer: undefined,
  setSigner: () => {},
  signerAddress: "",
  setSignerAddress: () => {},
  tokenBalances: [],
  setTokenBalances: () => {},
  showTransactionModal: false,
  setShowTransactionModal: () => {},
  transactionType: TRANSACTION_TYPE.DEPOSIT,
  setTransactionType: () => {},
  tokenContracts: [],
  setTokenContracts: () => {},
  showStakingModal: false,
  setShowStakingModal: () => {},
  userStakedPositions: [],
  setUserStakedPositions: () => {},
  setShowAllStakedTokens: () => {},
  showAllStakedTokens: false,
};

const AppContext = createContext<AppContextProps>(initialValues);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>(
    undefined
  );
  const [bankContract, setBankContrat] = useState<Contract | undefined>(
    undefined
  );
  const [bankWebsocketContract, setBankWebsocketContract] = useState<
    Contract | undefined
  >(undefined);
  const [tokenSymbols, setTokenSymbols] = useState<string[]>([]);
  const [signer, setSigner] = useState<Signer | undefined>();
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [tokenBalances, setTokenBalances] = useState<TokenBalanceInterface[]>(
    []
  );
  const [showTransactionModal, setShowTransactionModal] =
    useState<boolean>(false);
  const [showStakingModal, setShowStakingModal] = useState<boolean>(false);

  const [tokenContracts, setTokenContracts] = useState<
    TokenContractInterface[]
  >([]);

  const [transactionType, setTransactionType] = useState<TRANSACTION_TYPE>(
    TRANSACTION_TYPE.DEPOSIT
  );

  const [userStakedPositions, setUserStakedPositions] = useState<
    UserStakedPositions[]
  >([]);

  const [showAllStakedTokens, setShowAllStakedTokens] =
    useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        provider,
        setProvider,
        bankContract,
        setBankContrat,
        bankWebsocketContract,
        setBankWebsocketContract,
        setTokenSymbols,
        tokenSymbols,
        setSigner,
        signer,
        signerAddress,
        setSignerAddress,
        setTokenBalances,
        tokenBalances,
        showTransactionModal,
        setShowTransactionModal,
        transactionType,
        setTransactionType,
        tokenContracts,
        setTokenContracts,
        showStakingModal,
        setShowStakingModal,
        userStakedPositions,
        setUserStakedPositions,
        setShowAllStakedTokens,
        showAllStakedTokens,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
