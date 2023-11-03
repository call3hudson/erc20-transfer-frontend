enum Actions {
  CA_UPDATE = "CA_UPDATE",
  EOA_UPDATE = "EOA_UPDATE",
  AMOUNT_UPDATE = "AMOUNT_UPDATE",
  GAS_UPDATE = "GAS_UPDATE",
  TX_UPDATE = "TX_UPDATE",
  RESET = "RESET_UPDATE",
}

type Action = {
  type: Actions;
  payload: any;
};

type State = {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimal: number;
    valid: boolean;
    loading: boolean;
    error: string;
  };
  user: {
    address: string;
    holdings: string;
    formatted: string;
    valid: boolean;
    loading: boolean;
    error: string;
  };
  transferAmount: {
    amount: number;
    valid: boolean;
    error: string;
  };
  gasFee: {
    amount: number;
    baseFee: number;
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;
  };
  tx: {
    txHash: string;
    status: string;
    nonce: number;
    statusCode: number;
    estimatedGas: number;
    estimatedTime: number;
    loading: boolean;
  };
};

const defaultState: State = {
  token: {
    address: "",
    name: "-",
    symbol: "-",
    decimal: 0,
    valid: true,
    loading: false,
    error: "",
  },
  user: {
    address: "",
    holdings: "0",
    formatted: "0",
    valid: true,
    loading: false,
    error: "",
  },
  transferAmount: {
    amount: 0,
    valid: true,
    error: "",
  },
  gasFee: {
    amount: 0,
    baseFee: 0,
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
  },
  tx: {
    txHash: "",
    status: "",
    nonce: 0,
    statusCode: 0,
    estimatedGas: 0,
    estimatedTime: 0,
    loading: false,
  },
};

const load = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const store = (state: State) => {
  try {
    const serializedState = JSON.stringify(state);
    if (localStorage.getItem("state") != serializedState) {
      window.dispatchEvent(new Event("storage"));
      localStorage.setItem("state", serializedState);
    }
  } catch (e) {}
};

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  let updatedState: State = state;

  switch (type) {
    case Actions.RESET:
      updatedState = loadFromStorage();
      break;
    case Actions.CA_UPDATE:
      updatedState = {
        ...state,
        token: payload,
      };
      break;
    case Actions.EOA_UPDATE:
      updatedState = {
        ...state,
        user: payload,
      };
      break;
    case Actions.AMOUNT_UPDATE:
      updatedState = {
        ...state,
        transferAmount: payload,
      };
      break;
    case Actions.GAS_UPDATE:
      updatedState = {
        ...state,
        gasFee: payload,
      };
      break;
    case Actions.TX_UPDATE:
      updatedState = {
        ...state,
        tx: payload,
      };
      break;
    default:
      updatedState = state;
      break;
  }

  store(updatedState);
  return updatedState;
};

const loadFromStorage = (): State => {
  const state: State | undefined = load();
  if (state !== undefined) return state;
  return defaultState;
};

export { Actions, reducer, defaultState, loadFromStorage };
