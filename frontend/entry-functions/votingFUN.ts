import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { VOTING_MODULE_ADDRESS } from "@/constants";

 type InitializeWithCandidateArgs = {
  option: string;
};

export const initializeWithCandidate = (args: InitializeWithCandidateArgs): InputTransactionData => {
  const { option } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::initialize_with_candidate`,
      functionArguments: [option],
    },
  };
};

 type AddCandidateArgs = {
  option: string;
  storeAddress: string;
};

export const addCandidate = (args: AddCandidateArgs): InputTransactionData => {
  const { option, storeAddress } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::add_candidate`,
      functionArguments: [option, storeAddress],
    },
  };
};

 type VoteArgs = {
  option: string;
  storeAddress: string;
};

export const vote = (args: VoteArgs): InputTransactionData => {
  const { option, storeAddress } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::vote`,
      functionArguments: [option, storeAddress],
    },
  };
};

 type DeclareWinnerArgs = {
  storeAddress: string;
};

export const declareWinner = (args: DeclareWinnerArgs): InputTransactionData => {
  const { storeAddress } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::declare_winner`,
      functionArguments: [storeAddress],
    },
  };
};

 type ViewCurrentScoresArgs = {
  storeAddress: string;
};

export const viewCurrentScores = (args: ViewCurrentScoresArgs): InputTransactionData => {
  const { storeAddress } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::view_current_scores`,
      functionArguments: [storeAddress],
    },
  };
};

 type ViewWinnerArgs = {
  storeAddress: string;
};

export const viewWinner = (args: ViewWinnerArgs): InputTransactionData => {
  const { storeAddress } = args;
  return {
    data: {
      function: `${VOTING_MODULE_ADDRESS}::Voting::view_winner`,
      functionArguments: [storeAddress],
    },
  };
};
