console.log("Sentexa started to run.");

const fileName = window.location.pathname.substr(1);
let sentenceId = 0;

// Create a checkbox and return.
function getCheckbox() {
    let cb = document.createElement("input");
    cb.classList.add('stc-cb');
    cb.type = "checkbox";
    cb.tabIndex = 2;
    cb.value = `stc-${sentenceId++}`;
    return cb;
}

let singleSentences = document.getElementsByClassName("sentences-list-item");

// Iterate sentences and place checkbox.
for (let i = 0; i < singleSentences.length; i++) {
    const cb = getCheckbox();

    // One list item of every five has a different html tree.
    if ((i + 1) % 5 == 0) {
        const cont = singleSentences[i];
        const adv = cont.getElementsByClassName("advertising-container")[0];
        if (!adv) {
            cont.appendChild(cb);
            continue;
        }
        const ct = document.createElement("div");
        ct.classList.add("ssb-adv-cont");

        const ssb = cont.getElementsByClassName("single-sentence-box")[0];
        ssb.remove();
        ct.appendChild(ssb);
        ct.appendChild(cb);

        cont.insertBefore(ct, cont.firstChild);

        adv.classList.add("mx-auto");
        cont.classList.add("sli-adv");
        continue;
    }
    singleSentences[i].appendChild(cb);
}

let sentencesArray = [];

function extractSentence(index) {
    sentencesArray[index] = singleSentences[index].querySelector('.sentence-item__text').innerText;
}

// Listen sentences list and extract only that sentence beside checkbox when checkbox clicked.
document.querySelector('ul.sentences-list').addEventListener('click', (event) => {
    const targetElem = event.target;
    if(targetElem && targetElem.tagName == 'INPUT' && targetElem.classList.contains('stc-cb')){
        const index = parseInt(targetElem.value.split('stc-')[1]);
        if(targetElem.checked == true){
            extractSentence(index);
        }
    }
});

function formFileText() {
    let fileText = fileName + ' sentences:'+ "\n\n";

    checkBoxCollection.forEach((cb, index) => {
        if (cb.value && cb.checked === true){
            const index = parseInt(cb.value.split('stc-')[1]);
            fileText += sentencesArray[index] + '\n';
        }
    });
    return fileText;
}

function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

// Keep track of clicked keys
let isKeyPressed = {
    x: false,
    X: false,
};

let isCheckBoxesExtracted = false;
let checkBoxCollection = [];

let downloadDue = true;
document.addEventListener("keydown", (keyDownEvent) => {
    const pressedKey = keyDownEvent.key;
    if (downloadDue && (pressedKey == 'X' || pressedKey == 'x') && keyDownEvent.ctrlKey && keyDownEvent.shiftKey) {
        console.log('Prepare sentences and file before download.');
        if(!isCheckBoxesExtracted){
            checkBoxCollection = Array.from(document.querySelectorAll('input[type=checkbox].stc-cb'));
            isCheckBoxesExtracted = true;
        }
        const fileText = formFileText();
        download(fileName, fileText);
        downloadDue = false;
        setTimeout(() => {
            downloadDue = true;
        }, 2000);
    }
});