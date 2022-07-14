// FIXME:  DELETE THIS FILE.  I ONLY COPIED IT HERE FOR EASE OF REFERENCE.

// Refer to gestureHost.css for the different layout CSS classes.

// -- BEGIN:  Code for controlling the layout-simulation elements --

function updateConfig() {
  let layout = document.config.screen;     // Referred to radio-group values on the actual host page.
  let bounds = document.config.bounds;
  let receiver = document.config.receiver;

  let demoContainer = document.getElementById("demo-container");
  demoContainer.className = layout.value + " " + bounds.value + " " + receiver.value;
}

window.addEventListener('load', function(ev) {
  updateConfig();
});

// END: Layout-simulation setup & handling

// START:  Gesture-recognizer integration code!

// This will hold the main gesture-recognizer instance.
// Not great standard practice... but this is a development/debugging page, so we want access to it.
let recognizer;

window.addEventListener('load', function() {
  // The core config.
  let recognizerConfig = {
    mouseEventRoot: document.body,
    targetRoot: document.getElementById('target-root'),
    maxRoamingBounds: document.getElementById('roaming-bounds'),
    safeBounds: document.getElementById('safe-zone'),
    safeBoundPadding: 6
  };

  recognizer = new com.keyman.osk.GestureRecognizer(recognizerConfig);

  let recordingObj = {};

  // DOM-oriented logging setup.
  let logElement = document.getElementById('event-log');
  // Erase any logs from before a page reload.
  logElement.value = '';

  let logClearButton = document.getElementById('log-clear-button');
  logClearButton.onclick = function() {
    logElement.value = '';
    recordingObj = {}; // erase previously-recorded sequences
  }


  recognizer.on('inputstart', function(sequence) {
    recordingObj[sequence.item.identifier] = {sequence: sequence.item, result: null};

    objectPrinter = function() {
      logElement.value = '';

      let arr = [];

      for(let entry in recordingObj) {
        arr.push(recordingObj[entry]);
      }

      logElement.value = JSON.stringify(arr, com.keyman.osk.InputSequence._replacer, 2);
    }

    objectPrinter();

    sequence.on('update', function() {
      objectPrinter();
    });

    sequence.on('cancel', function(seq) {
      recordingObj[seq.item.identifier].result = 'canceled';
      objectPrinter();
    });

    sequence.on('end', function(seq) {
      recordingObj[seq.item.identifier].result = 'ended';
      objectPrinter();
    });
  });
});

// END:  Gesture-recognizer integration code.