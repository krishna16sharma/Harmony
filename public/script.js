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

function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

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
    statusbar.value = "Status: Recording"
    //songName = null
    playButton.classList.remove('show')
    //saveButton.classList.remove('show')
    modalButton.classList.remove('show')
}

function stopRecording(){
    playSong()
    statusbar.value = "Status: Idle"
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
        recordNote(key.dataset.note)
    } 
    const noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.play()
    statusbar.value = "Status: Playing Note(s)"
    key.classList.add('active')
    noteAudio.addEventListener('ended', () =>{
        if (isRecording()){
            statusbar.value = "Status: Recording"
        } else{
            statusbar.value = "Status: Idle"
        }
        
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

var modal = document.getElementById("myModal");
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