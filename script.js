// Check if the browser supports SpeechRecognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
    let recognition = new SpeechRecognition();
    recognition.interimResults = true; // Show results in real-time
    recognition.lang = 'en-US'; // Set language
    let isRecording = false;
    
    const startButton = document.getElementById('start-recognition');
    const downloadButton = document.getElementById('download-transcription');
    const transcriptionDisplay = document.getElementById('transcription');
    const organizedTextDisplay = document.getElementById('organized-text');
    
    // Hide the download button initially
    downloadButton.style.display = 'none';
    
    let transcription = '';

    // Function to start or stop speech recognition
    startButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            startButton.textContent = 'Stop Recognition';
            isRecording = true;
            // Clear previous transcription
            transcription = '';
            transcriptionDisplay.textContent = 'Listening...';
            organizedTextDisplay.textContent = '';
        } else {
            recognition.stop();
            startButton.textContent = 'Start Recognition';
            isRecording = false;
            // Show the download button when transcription has content
            if (transcription.trim().length > 0) {
                downloadButton.style.display = 'block';
            }
        }
    });

    // Organize the text (simple version)
    function organizeText(text) {
        // Example: organize by sentences for simplicity
        // You can replace this with your organization logic
        return text.split('.').map(sentence => sentence.trim()).join('\n');
    }

    // Event for speech recognition result
    recognition.addEventListener('result', (e) => {
        let tempTranscription = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (e.results[0].isFinal) {
            transcription += tempTranscription + '. ';
            let organizedText = organizeText(transcription);
            transcriptionDisplay.textContent = transcription;
            organizedTextDisplay.textContent = organizedText;
        }
    });

    downloadButton.addEventListener('click', () => {
        let organizedText = organizeText(transcription);
        let blob = new Blob([organizedText], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = 'notes.txt';
        a.href = url;
        a.click();
        URL.revokeObjectURL(url); // Clean up
    });

    recognition.addEventListener('end', () => {
        if (isRecording) recognition.start(); // Automatically restart recognition if still in recording mode
    });

} else {
    alert('Your browser does not support speech recognition. Please try Google Chrome or Firefox.');
}

// Add this function to script.js to call the backend
async function organizeNotesWithOpenAI(text) {
    try {
      const response = await fetch('/organize-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to organize notes');
      const data = await response.json();
      return data.organizedText;
    } catch (error) {
      console.error('Error organizing notes with OpenAI:', error);
      return text; // Fallback to original text if there's an error
    }
  }
  
  // Modify the download button event listener to use the new function
  downloadButton.addEventListener('click', async () => {
      const organizedText = await organizeNotesWithOpenAI(transcription);
      let blob = new Blob([organizedText], { type: 'text/plain' });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = 'organized-notes.txt';
      a.href = url;
      a.click();
      URL.revokeObjectURL(url); // Clean up
  });
  