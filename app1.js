
// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
var noteTextArea = document.querySelector('.output');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');
var noteContent = '';
// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext('2d');

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }

  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);

      if (key.substring(0, 5) == 'note-') {
        notes.push({
          date: key.replace('note-', ''),
          content: localStorage.getItem(localStorage.key(i))
        });
      }
    }
    return notes;
  }

function renderNotes(notes) {
  var html = '';
  if (notes.length) {
    notes.forEach(function(note) {
      html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
    });
  } else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}
  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
  var speech = new SpeechRecognitionApi({
    output: document.querySelector('.output')
  });

  document.querySelector('.record').addEventListener('click', () => {
    speech.init();
  });
  document.querySelector('.stop').addEventListener('click', () => {
    speech.stop();
  });

    $('#save-note-btn').bind('click', function(e) {
      speech.stop();
      if (!noteContent.length) {
        instructions.text(
          'Could not save empty note. Please add a message to your note.'
        );
      } else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        saveNote(new Date().toLocaleString(), noteContent);
        console.log("yes");
        // Reset variables and update UI.
        noteContent = '';
        renderNotes(getAllNotes());
        noteTextArea.innerHTML='';
        instructions.text('Note saved successfully.');
      }
    });

   /*Just added  */
  speech.onresult = function(event) {
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    var mobileRepeatBug =
      current == 1 && transcript == event.results[0][0].transcript;

    if (!mobileRepeatBug) {
      noteContent += transcript;
      this.output.val(noteContent);
    }
  };
    visualize(stream);

    record.onclick = function() {
      if (noteContent.length) {
        noteContent += ' ';
      }
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log('recorder started');
      record.style.background = 'red';

      stop.disabled = false;
      record.disabled = true;
    };

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log('recorder stopped');
      instructions.text('Voice recognition paused.');
      record.style.background = '';
      record.style.color = '';
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    };

    mediaRecorder.onstop = function(e) {
      console.log('data available after MediaRecorder.stop() called.');

      const clipName = prompt(
        'Enter a name for your sound clip?',
        'My unnamed clip'
      );

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if (clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log('recorder stopped');

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      };

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      };
    };
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };
  };

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  };

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw();

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
};

window.onresize();

 /* just added */
 notesList.on('click', function(e) {
   e.preventDefault();
   var target = $(e.target);

   // Listen to the selected note.
   if (target.hasClass('listen-note')) {
     var content = target
       .closest('.note')
       .find('.content')
       .text();
     readOutLoud(content);
   }

   // Delete note.
   if (target.hasClass('delete-note')) {
     var dateTime = target.siblings('.date').text();
     deleteNote(dateTime);
     target.closest('.note').remove();
   }
 });

function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime);
}

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

class SpeechRecognitionApi {
  constructor(options) {
    const SpeechToText =
      window.speechRecognition || window.webkitSpeechRecognition;
    this.speechApi = new SpeechToText();
    this.output = options.output
      ? options.output
      : document.createElement('div');
    this.speechApi.continuous = true;
    this.speechApi.interimResult = false;
    this.speechApi.onresult = event => {
      var resultIndex = event.resultIndex;
      var transcript = event.results[resultIndex][0].transcript;
      this.output.textContent += transcript;
      console.log(this.output.textContent);
      noteContent +=transcript;
    };
  }
  init() {
    this.speechApi.start();
  }
  stop() {
    this.speechApi.stop();
  }
}

