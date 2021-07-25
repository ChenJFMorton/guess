export default  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "vote",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "voteGuess",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_voteId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_periodNum",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_vote",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_result",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_winAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct GuessVote.Voter[]",
        "name": "voters",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "queryVoteListByAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_voteId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_periodNum",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_vote",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_result",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_winAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct GuessVote.Voter[]",
        "name": "voters",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "generateVoteResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_periodNum",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_voteResult",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "_isHandled",
            "type": "bool"
          }
        ],
        "internalType": "struct GuessVote.PeriodVoteResult",
        "name": "periodVoteResult",
        "type": "tuple"
      }
    ],
    "name": "sendAwards",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]