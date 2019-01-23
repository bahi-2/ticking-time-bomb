pragma solidity ^0.5.3;

/* This smartcontract is used to store hashed messages on the Ethereum blockchain */

contract DocumentStorage {

    /* ---- Public variables: */

    string public author; // contract author
    address public manager; // address which can add a document to the contract
    uint256 public docIndex; // number of documents

    mapping (uint256 => Doc) public indexedDocs; // docIndex => Doc
    mapping (bytes32 => Doc) public sha3Docs; // docHash => Doc


    /* ---- Stored document structure: */

    struct Doc {
        uint256 docIndex; // .............................................0
        string publisher; // publisher's email............................1
        uint256 publishedOnUnixTime; // block timestamp (block.timestamp).2
        uint256 publishedInBlockNumber; // block.number...................3
        bytes32 hash; // Hashed message of the document...................4
    }

    /* ---- Constructor: */

    constructor() public {
        manager = msg.sender;
        author = "blaz.bagic";
    }

    /* ---- Event:  */
    // This generates a public event on the blockchain that will notify clients.
    // In 'Mist' SmartContract page enable 'Watch contract events'
    event DocumentAdded(uint256 docIndex,
                        string publisher,
                        uint256 publishedOnUnixTime);


    /* ----- Main method: */

    function addDoc(
                    string memory _publisher,
                    bytes32 _hash) public returns (bytes32) {
        // authorization
        require(msg.sender == manager);

        // chech if exists
        require(sha3Docs[_hash].docIndex == 0);

        // document number
        docIndex = docIndex + 1;
        // add document data:
        indexedDocs[docIndex] = Doc(docIndex,
                                    _publisher,
                                    now,
                                    block.number,
                                    _hash
                                );
        sha3Docs[_hash] = indexedDocs[docIndex];
        // add event
        emit DocumentAdded(indexedDocs[docIndex].docIndex,
                           indexedDocs[docIndex].publisher,
                           indexedDocs[docIndex].publishedOnUnixTime
                          );
        // return sha3 of the stored document
        // (sha3 is better for web3.js)
        return _hash;
    }

    /* ---- Fallback: */

    function () external {
        // This function gets executed if a
        // transaction with invalid data is sent to
        // the contract or just ether without data.
        // We revert the send so that no-one
        // accidentally loses money when using the
        // contract.
        revert();
    }

}