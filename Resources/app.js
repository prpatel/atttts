var w=Ti.UI.createWindow({
    backgroundColor: "#fff"
});

var attAPIs = require('att');
var accessKey = 'YOUR KEY';
var secretKey = 'YOUR KEY';
var scope = 'TTS';
var grantType = 'client_credentials';
var isAndroid = Titanium.Platform.osname === "android";

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);


function getTextToSpeech(text) {
    Ti.API.info('Text entered: ' + text);
    
    if(!text) {
        alert('Enter text to convert to speech');
        return;
    }
    
    /**
     * 
     * @param options.contentType- format in which data is to be sent, either "text/plain" or "application/ssml+xml"
     * @param options.accept - The format of the audio returned, either "audio/amr", "audio/amr-wb", or "audio/wav"
     * @param options.filePath - The path where to save the audio. It will write over any existing file. It appends 
     *                   the proper extension (based on the accept) if one is not added
     * @param options.body- Will contain the plain text or SSML to convert to speech
     * 
     **/
    var fileName = 'tts';
    var filePath = Ti.Filesystem[isAndroid ? 'externalStorageDirectory' : 'applicationDataDirectory'] + fileName;
       
    attAPIs.ATT.Speech.textToSpeech({
        'accept' : 'audio/x-wav',
        'contentType' : 'text/plain',
        'body' : text,
        'filePath': filePath,
        'contentLanguage': 'en-US',
        'xArg': {
            VoiceName: 'crystal'
        }
    }, function(data) {
        Ti.API.log(data);
        createPlaySoundButton(JSON.parse(data).filePath);
    }, function(error) {
        var err=JSON.parse(error);
        alert('Error Callback: ' + err.data.error);
    });
}

var playSoundButton;
function createPlaySoundButton(filePath) {
    var player = Ti.Media.createSound({url:filePath});
    
    playSoundButton = Ti.UI.createButton({
        title : 'Play Sound',
        top : 10,
        height : 40
    });
    
    playSoundButton.addEventListener('click', function() {
        if(!player.playing) player.play();
    });
    
    w.add(playSoundButton);
}

w.addEventListener('open',function(e){
    getTextToSpeech('I Love Titanium...this is very cool!!!');
})

w.open();