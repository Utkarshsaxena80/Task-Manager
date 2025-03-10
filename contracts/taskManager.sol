//SPDX-License-Identifier:MIT
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/access/Ownable.sol";
contract taskManager is Ownable{
    enum TaskStatus {Pending,Completed}
    struct Task{
        uint id;
        string title;
        string description;
        TaskStatus status;
        address owner;
    }
    uint private taskCounter;
    mapping(uint=>Task) private tasks;

    event TaskCreated(uint taskId,string title,string description,address owner);
    event TaskUpdated(uint taskId,string title,string description,TaskStatus status);
    event TaskDeleted(uint taskId);
    constructor(address initialOwner) Ownable(initialOwner) {
        taskCounter = 0;
    }

    modifier onlyTaskOwner(uint _taskId){
        require(tasks[_taskId].owner==msg.sender,"Not Task Owner");
        _;
    }
    function addTask(string memory _title,
    string memory _description
    )external{
        taskCounter++;
        tasks[taskCounter]=Task(taskCounter,
        _title,
        _description,
        TaskStatus.Pending,
        msg.sender);
        emit TaskCreated(taskCounter, _title, _description, msg.sender);
    }
    function markTaskCompleted(uint _taskId) external onlyTaskOwner(_taskId){
        tasks[_taskId].status=TaskStatus.Completed;
        
        emit TaskUpdated(_taskId,
        tasks[_taskId].title,
        tasks[_taskId].description,
        TaskStatus.Completed
        );
    }
    function editTask(uint _taskId,string memory _title, string memory _description) external onlyTaskOwner(_taskId){
        Task storage task= tasks[_taskId];
        task.title=_title;
        task.description=_description;
        emit TaskUpdated(
            _taskId,
            _title,
            _description,
            task.status
        );

    }
    function deleteTask(uint _taskId) external onlyTaskOwner(_taskId){
        delete tasks[_taskId];
        emit TaskDeleted(_taskId);
    }
    
    function getTask() external  view  returns(Task[] memory){
        uint count=0;

        for(uint i=1;i<=taskCounter;i++){
            if(tasks[i].owner==msg.sender){
                count++;
            }
        }
        Task[] memory finalTasks= new Task[](count);
        uint index=0;

        for(uint i=1;i<=taskCounter;i++){
            if(tasks[i].owner==msg.sender){
                finalTasks[index]=tasks[i];
                index++;
            }
        }
        return finalTasks;

        
    }
    function getTaskCounter() external view returns (uint){
        return taskCounter;
    }

}