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
const monitorNavButton = document.querySelector('[data-section="monitor"]');
const monitorSection = document.getElementById('monitor');
const processStatus = document.getElementById('process-status');
const resourceStatus = document.getElementById('resource-status');
const allocationStatus = document.getElementById('allocation-status');
const requestStatus = document.getElementById('request-status');
const detectionMessage = document.getElementById('detection-message');
const graphMode = document.getElementById('graph-mode');
let processCreated = false;
let resourceCreated = false;
let allocationCreated = false;
let requestCreated = false;
checkDeadlockButton.disabled = true;

async function populateDropdown()
{
    try
    {
        const processResponse = await fetch('/processes');
        const resourceResponse = await fetch('/resources');

        if(!processResponse.ok || !resourceResponse.ok)
        {
            throw new Error('Failed to fetch processes or resources.');
        }

        const processes = await processResponse.json();
        const resources = await resourceResponse.json();

        const processDropdown = [
            allocationProcessId,
            requestProcessId
        ];

        const resourceDropdown = [
            allocationResourceId,
            requestResourceId
        ];

        processDropdown.forEach(dropdown => {
            dropdown.replaceChildren(
                new Option('Select a processs', '')
            );

            processes.forEach(process => {
                dropdown.add(
                    new Option(
                        `${process.name} (PID: ${process.id})`, process.id
                    )
                );
            });
        });



        resourceDropdown.forEach(dropdown => {
            dropdown.replaceChildren(
                new Option('Select a resource','')
            );

            resources.forEach(resource => {
                dropdown.add(
                    new Option(
                        `${resource.name} (RID: ${resource.id})`, resource.id
                    )
                );
            });            
        });
    }
    catch(error)
    {
        console.error('Error populating dropdowns: ', error);
    }
}
function showStatus(element, message, type)
{
    element.textContent = message;
    element.className = `form-status ${type}`;
}
function checkSimulationButton()
{
    if(processCreated && resourceCreated && allocationCreated && requestCreated)
    {
        checkDeadlockButton.disabled = false;
    }
    else
    {
        checkDeadlockButton.disabled = true;
    }
}

async function updateMonitor()
{
    try
    {
        const endpoint = graphMode.value === 'simulation' ? '/graph' : '/db/waits';
        const response = await fetch(endpoint);

        const data = await response.json();

        if(!response.ok)
        {
            console.error(data.error);
            return;
        }

        console.log(data);
        
        if(data.nodes)
        {
            renderWaitForGraph(data.nodes, data.edges || [], data.cycle);
        }
        else
        {
            renderWaitForGraph([], data.edges || [], Array.isArray(data.cycle) ? data.cycle : []);
        }
 
        if(data.deadlock)
        {
            deadlockStatus.textContent = 'Deadlock Detected';
            deadlockStatus.style.color = '#dc2626';
        }
        else
        {
            deadlockStatus.textContent = 'No Deadlock';
            deadlockStatus.style.color = '#15803d';
        }       
        
        if(data.victim)
        {
            currentVictim.textContent = data.victim.name ?? data.victim.pid ?? 'Unknown';

            victimName.textContent = data.victim.name?? data.victim.pid ?? 'Unknown';

            victimScore.textContent = data.victim.protectionScore ??  data.victim.protection_score ??'Unknown';
        }
        else
        {
            currentVictim.textContent = 'None';
            victimName.textContent = 'None';
            victimScore.textContent = 'N/A';
        }
    }
    catch(error)
    {
        console.error('Failed to update monitor: ', error);
    }
}
function renderWaitForGraph(nodes, edges, cycle)
{
    const elements = [];

    nodes.forEach(node => {
        elements.push({
            data: { id: String(node.id), label: `PID: ${node.id}`, type: node.type }
        });
    });

    edges.forEach(edge => {
        elements.push({
            data: {
                id: `${edge.from}-${edge.to}`,
                source: String(edge.from),
                target: String(edge.to)
            }
        });
    });

    const cycleNodes = new Set(
        cycle ? cycle.map(String) : []
    );

    const cycleEdges = new Set();

    if(cycle && cycle.length > 1)
    {
        for(let i=0;i<cycle.length;i++)
        {
            const from = String(cycle[i]);
            const to = String(cycle[(i+1) % cycle.length]);

            cycleEdges.add(`${from}-${to}`);
        }
    }

    cytoscape({
        container: waitForGraph,
        elements,
        style: [
            {
                selector: 'node[type = "process"]',
                style: {
                    'label': 'data(label)',
                    'background-color': '#2563eb',
                    'color': '#1f2937',
                    'text-valign': 'bottom',
                    'text-margin-y': 8
                }
            },
            {
                selector: 'node[type = "resource"]',
                style: {
                    'label': 'data(label)',
                    'background-color': '#0d9488',
                    'color': '#1f2937',
                    'text-valign': 'bottom',
                    'text-margin-y': 8
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#9ca3af',
                    'target-arrow-color': '#9ca3af',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],
        layout: {
            name: 'circle'
        }
    });
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

        if(sectionId === 'monitor')
        {
            updateMonitor();
        }
    });
});
graphMode.addEventListener('change', () => {
    updateMonitor();
});
createProcessButton.addEventListener('click', async () => {

    try
    {
        if(processName.value.trim() === '')
        {
            showStatus(processStatus, 'Process name is required.', 'error');
            return;
        }

        const progressValue = Number(progress.value);
        const rollbackCostValue = Number(rollbackCost.value);
        const retryCountValue = Number(retryCount.value);

        if(progressValue < 0 || progressValue > 100)
        {
            console.error('Progress must be between 0-100');
            showStatus(processStatus, 'Progress must be between 0-100.', 'error');
            return;
        }

        if(rollbackCostValue < 0 || rollbackCostValue > 100)
        {
            console.error('Rollback cost must be between 0-100');
            showStatus(processStatus, 'Rollback cost must be between 0-100.', 'error');
            return;
        }

        if(retryCountValue < 0 || retryCountValue > 10)
        {
            console.error('Retry count must be between 0-10');
            showStatus(processStatus, 'Retry count must be between 0-10.', 'error');
            return;
        }

        const existingProcesses = await fetch('/processes');

        if(!existingProcesses.ok)
        {
            throw new Error('Failed to fetch existing processes.');
        }
        const processes = await existingProcesses.json();

        const processNameValue = processName.value.trim();

        const processExists = processes.some(
            process => process.name === processNameValue
        );

        if(processExists)
        {
            showStatus(processStatus, `Process with name ${processNameValue} is already created.`, 'error');

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
            showStatus(processStatus, data.error || 'Failed to create process.', 'error');
            return;
        }

        showStatus(processStatus, `Process ${data.name} created successfully! PID: ${data.id}`, 'success');
        processCreated = true;
        checkSimulationButton();
        console.log(data);
        await populateDropdown();

    }
    catch(error)
    {
        console.error('Error creating process: ', error);
        showStatus(processStatus, 'Error creating process.', 'error');
    }
});

createResourceButton.addEventListener('click', async () => {

    try
    {

        if(resourceName.value.trim() === '')
        {
            console.error('Resource name is required');
            showStatus(resourceStatus, 'Resource name is required.', 'error');
            return;
        }

        const instances = Number(resourceInstances.value);
        if(instances < 1 || instances > 10)
        {
            console.error('Resource instances must be between 1 - 10');
            showStatus(resourceStatus, 'Resource instances must be between 1 - 10.', 'error');
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
            showStatus(resourceStatus, data.error || 'Failed to create resource', 'error');
            return;
        }

        showStatus(resourceStatus, `Resource ${data.name} created successfully! RID:  ${data.id}`, 'success');
        resourceCreated = true;
        checkSimulationButton();
        console.log(data);
        await populateDropdown();
    }
    catch(error)
    {
        console.error('Error creating resource: ', error);
        showStatus(resourceStatus, 'Error creating resource.', 'error');
    }
});

allocateResourceButton.addEventListener('click', async () => {

    try
    {

        const processId = Number(allocationProcessId.value);
        const resourceId = Number(allocationResourceId.value);

        if(!Number.isInteger(processId) || processId <= 0)
        {
            console.error('Enter a valid Process ID.');
            showStatus(allocationStatus, 'Enter a valid Process ID.', 'error');
            return;
        }

        if(!Number.isInteger(resourceId) || resourceId <= 0)
        {
            console.error('Enter a valid Resource ID.');
            showStatus(allocationStatus, 'Enter a valid Resource ID.', 'error');
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
            showStatus(allocationStatus, data.error || 'Failed to create resource.', 'error');
            return;
        }
        showStatus(allocationStatus, 'Resource allocated successfully!', 'success');
        allocationCreated = true;
        checkSimulationButton();
        console.log(data);
    }
    catch(error)
    {
        console.error('Error allocating resource: ', error);
        showStatus(allocationStatus, 'Error allocating resource.', 'error');
    }
});

requestResourceButton.addEventListener('click', async () => {

    try
    {
        const processId = Number(requestProcessId.value);
        const resourceId = Number(requestResourceId.value);

        if(!Number.isInteger(processId) || processId <= 0)
        {
            console.error('Enter a valid Process ID.');
            showStatus(requestStatus, 'Enter a valid Process ID.', 'error');
            return;
        }

        if(!Number.isInteger(resourceId) || resourceId <= 0)
        {
            console.error('Enter a valid Resource ID.');
            showStatus(requestStatus, 'Enter a valid Resource ID.', 'error');
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
            showStatus(requestStatus, 'Failed to request resource.', 'error');
            return;
        }
        showStatus(requestStatus, data.error || 'Resource requested successfully!', 'success');
        requestCreated = true;
        checkSimulationButton();
        console.log(data);
    }
    catch(error)
    {
        console.error('Error requesting resource: ', error);
        showStatus(requestStatus, 'Error requesting resource', 'error');
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
            showStatus(detectionMessage, data.error || 'Failed to check deadlock.', 'error');
            return;
        }

        console.log(data);

        if(data.deadlock)
        {
            showStatus(detectionMessage, 'Deadlock detected. Redirecting to Monitor...', 'error');

            setTimeout(() => {
                monitorNavButton.click();
            }, 1500);
        }
        else
        {
            showStatus(detectionMessage, 'No deadlock detected.', 'success');
        }
    }
    catch(error)
    {
        console.log('Failed to check deadlock: ', error);
        showStatus(detectionMessage, 'Failed to check deadlock. Please try again.', 'error');
    }
});

