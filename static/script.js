const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
 
form.addEventListener('submit', async function (e) {
  e.preventDefault();
 
  const userMessage = input.value.trim();
  if (!userMessage) return;
 
  appendMessage('user', userMessage);
  input.value = '';
 
  // Show a temporary "Thinking..." bot message and get a reference to it.
  const botMessageElement = appendMessage('bot', 'Thinking...');
 
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [
          {
            role: 'user',
            message: userMessage,
          },
        ],
      }),
    });
 
    if (!response.ok) {
      // Throw an error to be caught by the catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    const result = await response.json();
 
    // The backend is expected to return a JSON with a 'data' property as per the example.
    if (result && result.data) {
      botMessageElement.textContent = result.data;
    } else {
      // Handle cases where response is ok, but data is missing.
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Failed to get response:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  }
});
 
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  // Return the message element so it can be updated later.
  return msg;
}
