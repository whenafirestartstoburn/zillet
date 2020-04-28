import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto';
function getImages(name) {
  try {
    return `https://raw.githubusercontent.com/zillet/zrc2-tokens/master/images/${name.toLowerCase()}.png`;
  } catch (error) {
    console.log(error);
  }
}

function formatTransaction(tx, zrc2, nodeId) {
  if (tx.events.length) {
    tx.type = 'contract';
    let contractTransfer = {};
    // find event by transfer
    let transferEvent = tx.events.find(el => {
      return el.name && el.name.toLowerCase() === 'transfer';
    });
    if (transferEvent) {
      const contractKey = nodeId == 1 ? 'address' : 'testnetAddress';
      let contract = zrc2.find(el => {
        return el[contractKey] == tx.to;
      });
      contractTransfer = {
        amount: transferEvent.params.amount
      };
      if (contract) {
        contractTransfer = { ...contract, ...contractTransfer };
        if (tx.direction == 'in') {
          tx.from = toBech32Address(transferEvent.params.sender);
        } else {
          tx.to = toBech32Address(transferEvent.params.recipient);
        }
        tx.contractTransfer = contractTransfer;
        tx.eventType = 'transfer';
      }
    }
  }
  return tx;
}
function formatLocalTransaction(txn, data) {
  txn.type = 'contract';
  txn.contractTransfer = {
    ...data.rawTx.token,
    amount: data.rawTx.tokenAmount
  };
  txn.to = data.rawTx.address;
  txn.eventType = 'transfer';
  return txn;
}
function tokenTransfer(address, amount) {
  return [
    {
      vname: 'to',
      type: 'ByStr20',
      value: address
    },
    {
      vname: 'amount',
      type: 'Uint128',
      value: `${amount}`
    }
  ];
}
export { getImages, formatTransaction, tokenTransfer, formatLocalTransaction };
