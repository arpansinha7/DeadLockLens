const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section');
const checkDeadlockButton = document.getElementById('check-deadlock');
const recoverVictimButton = document.getElementById('recover-victim');
const deadlockStatus = document.getElementById('deadlock-status');
const activeTransactions = document.getElementById('active-transactions');
const currentVictim = document.getElementById('current-victim');
const deadlockCycle = document.getElementById('deadlock-cycle');
const victimName = document.getElementById('victim-name');
const victimScore = document.getElementById('victim-score');
const deadlockedProcesses = document.getElementById('deadlocked-processes');
const waitForGraph = document.getElementById('wait-for-graph');
const createProcessButton = document.getElementById('create-process');
const processName = document.getElementById('process-name');
const progress = document.getElementById('progress');
const rollbackCost = document.getElementById('rollback-cost');
const retryCount = document.getElementById('retry-count');
const createResourceButton = document.getElementById('create-resource');
const resourceName = document.getElementById('resource-name');
const resourceInstances = document.getElementById('resource-instances');
const allocateResourceButton = document.getElementById('allocate-resource');
const allocationProcessId = document.getElementById('allocation-process-id');
const allocationResourceId = document.getElementById('allocation-resource-id');
const requestResourceButton = document.getElementById('request-resource');
const requestProcessId = document.getElementById('request-process-id');
const requestResourceId = document.getElementById('request-resource-id');
const historyTable = document.getElementById('history-table');
const totalDeadlocks = document.getElementById('total-deadlocks');
const totalRecoveries = document.getElementById('total-recoveries');
const averageScore = document.getElementById('average-score');
const mostVictimized = document.getElementById('most-victimized');
let processCreated = false;
let resourceCreated = false;
let allocationCreated = false;
let requestCreated = false;
checkDeadlockButton.disabled = true;

function checkSimulationButton()
{
    if(processCreated && resourceCreated && allocationCreated && requestCreated)
    {
        checkDeadlockButton.disabled = false;
    }
}
navButtons.forEach(button => {

    button.addEventListener('click', () => {

        const sectionId = button.dataset.section;


        navButtons.forEach(navButton => {
            navButton.classList.remove('active');
        });

        sections.forEach(section => {
            section.classList.remove('active');
        });

        button.classList.add('active');

        document.getElementById(sectionId).classList.add('active');
    });
});

createProcessButton.addEventListener('click', async () => {

    try
    {
        if(processName.value.trim() === '')
        {
            console.error('Process name is required');
            return;
        }

        const progressValue = Number(progress.value);
        const rollbackCostValue = Number(rollbackCost.value);
        const retryCountValue = Number(retryCount.value);

        if(progressValue < 0 || progressValue > 100)
        {
            console.error('Progress must be between 0-100');
            return;
        }

        if(rollbackCostValue < 0 || rollbackCostValue > 100)
        {
            console.error('Rollback cost must be between 0-100');
            return;
        }

        if(retryCountValue < 0 || retryCountValue > 10)
        {
            console.error('Retry count must be between 0-10');
            return;
        }

        const response = await fetch('/processes', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: processName.value,
                progress: progressValue,
                rollback_cost: rollbackCostValue,
                retry_count: retryCountValue
            })
        });

        const data = await response.json();

        if(!response.ok)
        {
            console.log(data.error);
            return;
        }
        
        processCreated = true;
        checkSimulationButton();
        console.log(data);

    }
    catch(error)
    {
        console.error('Error creating process: ', error);
    }
});

createResourceButton.addEventListener('click', async () => {

    try
    {

        if(resourceName.value.trim() === '')
        {
            console.error('Resource name is required');
            return;
        }

        const instances = Number(resourceInstances.value);
        if(instances < 1 || instances > 10)
        {
            console.error('Resource instances must be between 1 - 10');
            return;
        }
        const response = await fetch('/resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: resourceName.value,
                instances: instances
            })
        });

        const data = await response.json();


        if(!response.ok)
        {
            console.error(data.error);
            return;
        }
        resourceCreated = true;
        checkSimulationButton();
        console.log(data);
    }
    catch(error)
    {
        console.error('Error creating resource: ', error);
    }
});

allocateResourceButton.addEventListener('click', async () => {

    try
    {

        const processId = Number(allocationProcessId.value);
        const resourceId = Number(allocationResourceId.value);

        if(processId < 1 || processId > 100)
        {
            console.error('Process ID must be between 1 - 100');
            return;
        }

        if(resourceId < 1 || resourceId > 100)
        {
            console.error('Resource ID must be between 1 - 100');
            return;
        }
        const response = await fetch('/allocations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                process_id: processId,
                resource_id: resourceId
            })
        });

        const data = await response.json();

        if(!response.ok)
        {
            console.error(data.error);
            return;
        }
        allocationCreated = true;
        checkSimulationButton();
        console.log(data);
    }
    catch(error)
    {
        console.error('Error allocating resource: ', error);
    }
});

requestResourceButton.addEventListener('click', async () => {

    try
    {
        const processId = Number(requestProcessId.value);
        const resourceId = Number(requestResourceId.value);

        if(processId < 1 || processId > 100)
        {
            console.error('Process ID must be between 1 - 100');
            return;
        }

        if(resourceId < 1 || resourceId > 100)
        {
            console.error('Resource ID must be between 1 - 100');
            return;
        }

        const response = await fetch('/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                process_id: processId,
                resource_id: resourceId
            })
        });

        const data = await response.json();

        if(!response.ok)
        {
            console.error(data.error);
            return;
        }
        requestCreated = true;
        checkSimulationButton();
        console.log(data);
    }
    catch(error)
    {
        console.error('Error requesting resource: ', error);
    }
});


checkDeadlockButton.addEventListener('click', async () => {

    try
    {
        const response = await fetch('/graph');

        const data = await response.json();

        if(!response.ok)
        {
            console.error(data.error);
            return;
        }

        console.log(data);

        if(data.deadlock)
        {

        }
    }
    catch(error)
    {
        console.log('Failed to check deadlock: ', error);
    }
});