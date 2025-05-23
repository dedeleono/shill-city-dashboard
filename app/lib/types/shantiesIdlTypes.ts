export type ShantiesIdlTypes = {
  "version": "0.1.0",
  "name": "nft_staker",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "jollyBump",
          "type": "u8"
        },
        {
          "name": "splBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "fundRanch",
      "accounts": [
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stake",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "splBump",
          "type": "u8"
        },
        {
          "name": "lockup",
          "type": "u8"
        },
        {
          "name": "rarity",
          "type": "u8"
        }
      ]
    },
    {
      "name": "redeemRewards",
      "accounts": [
        {
          "name": "stake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemNft",
      "accounts": [
        {
          "name": "stake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jollyranch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "jollyRanch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "splBump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "stake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "splBump",
            "type": "u8"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          },
          {
            "name": "amountOwed",
            "type": "u64"
          },
          {
            "name": "withdrawn",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNftTime",
      "msg": "NFT can't be unlocked yet, not enough time has passed."
    },
    {
      "code": 6001,
      "name": "InvalidNftWithdrawl",
      "msg": "NFT has already been un-staked"
    },
    {
      "code": 6002,
      "name": "InvalidLockupPeriod",
      "msg": "Lockup period invalid"
    },
    {
      "code": 6003,
      "name": "InvalidRarity",
      "msg": "Rarity invalid"
    }
  ]
};

export const IDL: ShantiesIdlTypes = {
  "version": "0.1.0",
  "name": "nft_staker",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "jollyBump",
          "type": "u8"
        },
        {
          "name": "splBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "fundRanch",
      "accounts": [
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stake",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "splBump",
          "type": "u8"
        },
        {
          "name": "lockup",
          "type": "u8"
        },
        {
          "name": "rarity",
          "type": "u8"
        }
      ]
    },
    {
      "name": "redeemRewards",
      "accounts": [
        {
          "name": "stake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jollyranch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemNft",
      "accounts": [
        {
          "name": "stake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jollyranch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "senderSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recieverSplAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "jollyRanch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "splBump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "stake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "splBump",
            "type": "u8"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          },
          {
            "name": "amountOwed",
            "type": "u64"
          },
          {
            "name": "withdrawn",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNftTime",
      "msg": "NFT can't be unlocked yet, not enough time has passed."
    },
    {
      "code": 6001,
      "name": "InvalidNftWithdrawl",
      "msg": "NFT has already been un-staked"
    },
    {
      "code": 6002,
      "name": "InvalidLockupPeriod",
      "msg": "Lockup period invalid"
    },
    {
      "code": 6003,
      "name": "InvalidRarity",
      "msg": "Rarity invalid"
    }
  ]
};
