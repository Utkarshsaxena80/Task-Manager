const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskManager", function () {
    let TaskManager, taskManager, owner, addr1, addr2;

    beforeEach(async function () {
        // Deploy the contract
        TaskManager = await ethers.getContractFactory("taskManager");
        [owner, addr1, addr2] = await ethers.getSigners();
        taskManager = await TaskManager.deploy(owner);
        await taskManager.waitForDeployment();
    });

    it("Should allow a user to add a task", async function () {
        const tx = await taskManager.connect(addr1).addTask("Task 1", "Description 1");
        await tx.wait();

        const task = await taskManager.connect(addr1).getTask();
        expect(task.length).to.equal(1);
        expect(task[0].title).to.equal("Task 1");
        expect(task[0].description).to.equal("Description 1");
        expect(task[0].status).to.equal(0); // Pending
        expect(task[0].owner).to.equal(addr1.address);
    });

    it("Should allow a user to mark a task as completed", async function () {
        await taskManager.connect(addr1).addTask("Task 2", "Description 2");
        
        const tasksBefore = await taskManager.connect(addr1).getTask();
        const taskId = tasksBefore[0].id;

        await taskManager.connect(addr1).markTaskCompleted(taskId);
        const tasksAfter = await taskManager.connect(addr1).getTask();

        expect(tasksAfter[0].status).to.equal(1); 
    });

    it("Should allow a user to edit their task", async function () {
        await taskManager.connect(addr1).addTask("Old Task", "Old Description");
        const tasks = await taskManager.connect(addr1).getTask();
        const taskId = tasks[0].id;

        await taskManager.connect(addr1).editTask(taskId, "Updated Task", "Updated Description");

        const updatedTasks = await taskManager.connect(addr1).getTask();
        expect(updatedTasks[0].title).to.equal("Updated Task");
        expect(updatedTasks[0].description).to.equal("Updated Description");
    });

    it("Should allow a user to delete their task", async function () {
        await taskManager.connect(addr1).addTask("Task to Delete", "Description");
        const tasksBefore = await taskManager.connect(addr1).getTask();
        const taskId = tasksBefore[0].id;

        await taskManager.connect(addr1).deleteTask(taskId);
        const tasksAfter = await taskManager.connect(addr1).getTask();

        expect(tasksAfter.length).to.equal(0);
    });

    it("Should not allow a non-owner to modify a task", async function () {
        await taskManager.connect(addr1).addTask("Task by Addr1", "Description");

        const tasks = await taskManager.connect(addr1).getTask();
        const taskId = tasks[0].id;

        await expect(
            taskManager.connect(addr2).markTaskCompleted(taskId)
        ).to.be.revertedWith("Not Task Owner");

        await expect(
            taskManager.connect(addr2).editTask(taskId, "Hack Task", "Hacked Description")
        ).to.be.revertedWith("Not Task Owner");

        await expect(
            taskManager.connect(addr2).deleteTask(taskId)
        ).to.be.revertedWith("Not Task Owner");
    });

    it("Should retrieve tasks only for the caller", async function () {
        await taskManager.connect(addr1).addTask("Addr1 Task", "Description");
        await taskManager.connect(addr2).addTask("Addr2 Task", "Description");

        const tasksAddr1 = await taskManager.connect(addr1).getTask();
        const tasksAddr2 = await taskManager.connect(addr2).getTask();

        expect(tasksAddr1.length).to.equal(1);
        expect(tasksAddr1[0].title).to.equal("Addr1 Task");

        expect(tasksAddr2.length).to.equal(1);
        expect(tasksAddr2[0].title).to.equal("Addr2 Task");
    });

});
