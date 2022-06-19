const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

var modal_open = false;

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')
const titleTF = document.getElementById('song_title')
const modalButton = document.getElementById('modalBtn')
const songLink = document.querySelector('.song-link')
const songList = document.querySelector('.song-list')
const keys = document.querySelectorAll('.key')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')
const statusbar = document.getElementById('statusbar')

const keyMap = [...keys].reduce((map, key) =>{      // Destructure 'keys' into an array and reduce
    map[key.dataset.note] = key
    return map
}, {})

let recordingStartTime
let songNotes = currentSong ? currentSong.notes : null
//let songName

keys.forEach(key =>{
    key.addEventListener('click', ()=> playnote(key))
})

if(recordButton){
    recordButton.addEventListener('click', toggleRecording)
}
if( saveButton){
    console.log("True!")
    saveButton.addEventListener('click', saveSong)
}

playButton.addEventListener('click', playSong)

if(songList){
    songList.addEventListener('click', listSongs)
}

function toggleRecording(){
    recordButton.classList.toggle('active')
    if(isRecording()){
        startRecording()
    }
    else{
        stopRecording()
    }
}

function isRecording(){
    return recordButton!=null && recordButton.classList.contains('active')
}

function startRecording(){
    recordingStartTime = Date.now()
    songNotes = []
    //songName = null
    playButton.classList.remove('show')
    //saveButton.classList.remove('show')
    modalButton.classList.remove('show')
}

function stopRecording(){
    playSong()
    playButton.classList.add('show')
    //saveButton.classList.add('show')
    modalButton.classList.add('show')
}

function playSong(){
    if(songNotes.length == 0) return
    songNotes.forEach(note=>{
        setTimeout(()=>{
            playnote(keyMap[note.key])
        }, note.startTime)
    })
}

function keyHandler(e){
    if (e.repeat) return 
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if(whiteKeyIndex > -1){
        playnote(whiteKeys[whiteKeyIndex])
    }
    if(blackKeyIndex > -1){
        playnote(blackKeys[blackKeyIndex])
    }
}
document.addEventListener('keydown' , keyHandler)

function playnote(key){
    if (isRecording()){
        statusbar.value = "Status: Recording"
        recordNote(key.dataset.note)
    } 
    const noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.play()
    statusbar.value = "Status: Playing Song"
    key.classList.add('active')
    noteAudio.addEventListener('ended', () =>{
        statusbar.value = "Status: Idle"
        key.classList.remove('active')
    })
}

function recordNote(note){
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime
    })
}

function saveSong(){
    console.log("Saving...")

    //songNotes[0]['title'] = titleTF.value
    axios.post('/songs', { songNotes: songNotes, title: titleTF.value }).then(res => {
        songLink.classList.add('show')
        songLink.href = `/songs/${res.data._id}`
        console.log(res.data)
      })
}

function listSongs(){
    // Add a way to get songName
    // display the list
}


// Try to mute all video and audio elements on the page
function mutePage() {
    document.removeEventListener('keydown' , keyHandler)
}

function unmutePage() {
    document.addEventListener('keydown' , keyHandler)
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("modalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = async function() {
  await mutePage();
  modal.style.display = "block";
  
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  unmutePage();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    unmutePage();
  }
}