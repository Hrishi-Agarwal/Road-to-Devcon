// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentraSignal {

    struct Poll {
        string question;
        string[] options;
        uint256[] voteCounts;
        bool exists;
    }

    uint256 public pollCount;

    mapping(uint256 => Poll) private polls;

    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event PollCreated(uint256 indexed pollId, string question);
    event VoteCast(
        uint256 indexed pollId,
        uint256 indexed optionIndex,
        address indexed voter
    );

    function createPoll(
        string calldata question,
        string[] calldata options
    ) external returns (uint256) {

        require(bytes(question).length > 0, "Question required");
        require(options.length >= 2, "At least 2 options");

        uint256 pollId = pollCount++;

        Poll storage poll = polls[pollId];

        poll.question = question;
        poll.exists = true;

        for (uint256 i = 0; i < options.length; i++) {
            poll.options.push(options[i]);
            poll.voteCounts.push(0);
        }

        emit PollCreated(pollId, question);

        return pollId;
    }

    function vote(
        uint256 pollId,
        uint256 optionIndex
    ) external {

        Poll storage poll = polls[pollId];

        require(poll.exists, "Poll does not exist");
        require(
            optionIndex < poll.options.length,
            "Invalid option"
        );
        require(
            !hasVoted[pollId][msg.sender],
            "Already voted"
        );

        hasVoted[pollId][msg.sender] = true;

        poll.voteCounts[optionIndex]++;

        emit VoteCast(
            pollId,
            optionIndex,
            msg.sender
        );
    }

    function getPoll(
        uint256 pollId
    )
        external
        view
        returns (
            string memory question,
            string[] memory options,
            uint256[] memory voteCounts
        )
    {
        Poll storage poll = polls[pollId];

        require(poll.exists, "Poll does not exist");

        return (
            poll.question,
            poll.options,
            poll.voteCounts
        );
    }
}
