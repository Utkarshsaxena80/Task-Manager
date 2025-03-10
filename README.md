
# Task Manager Smart Contract

## contract address on sepolia testnet 
0x34504D647138A33dfa9a8a7540454d3998177F00

## Overview
The **Task Manager** project is a Solidity-based smart contract that enables users to create, update, and manage tasks on the Ethereum blockchain. The contract ensures that only the task owner can edit, delete, or mark tasks as completed. It leverages OpenZeppelin's `Ownable` contract for ownership management.

## Features
- Create new tasks with a title and description.
- Edit existing tasks (only by the task owner).
- Mark tasks as completed.
- Delete tasks (only by the task owner).
- Retrieve all tasks owned by the caller.
- Get the total number of tasks created.

## Deployment
The contract is deployed using Hardhat with the following deployment script:



## Smart Contract Details

### Contract Name: `taskManager`


## Installation & Setup

1. Clone the repository:
   ```sh
   git clone <https://github.com/Utkarshsaxena80/Task-Manager>
   cd task-manager
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Compile the contract:
   ```sh
   npx hardhat compile
   ```
4. Deploy the contract to a local Hardhat network:
   ```sh
   npx hardhat node
   npx hardhat deploy --network localhost/sepolia
   ```

## Usage
- Use `addTask` to create a new task.
- Call `markTaskCompleted` to complete a task.
- Call `editTask` to modify a task.
- Use `deleteTask` to remove a task.
- Retrieve all owned tasks using `getTask`.

## License
This project is licensed under the **MIT License**.

