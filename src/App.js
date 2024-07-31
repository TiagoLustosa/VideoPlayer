import React, { useState, useRef, useEffect } from 'react';
import './App.css'
function App() {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef(null);
  const [fileName, setFileName] = useState("")
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rewindAmount, setRewindAmount] = useState(0);

  useEffect(() => {   
    const handleKeyPress = (event) => {
      if (event.keyCode === 37) { // Left arrow key
        audioRef.current.currentTime -= rewindAmount;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [rewindAmount]);

  const handleSetVideoResolution = (resolution) => {
    let width, height;
    switch (resolution) {      
      case '480p':
        width = '320px';
        height = '480px';
        break;
      case '720p':
        width = '1280px';
        height = '720px';
        break;
      case '1080p':
        width = '1920px';
        height = '1080px';
        break;
      default:
        width = 'auto';
        height = 'auto';
        break;
    }
    audioRef.current.style.width = width;
    audioRef.current.style.height = height;
  };

  const timeToSeconds = (time) => {
    const parts = time.split(':');
    return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
  };

  const handlePlaySelectedSegment = () => {
    const startSeconds = timeToSeconds(startTime);
    const endSeconds = timeToSeconds(endTime);    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    if(startTime === '' || endTime === '' || startSeconds >= endSeconds || audioRef == null || fileName === "" ){
      return
    } else {      
      setTimeout(() => setIsLooping(true), 100)
      audioRef.current.loop = true;
      audioRef.current.currentTime = startSeconds;
      audioRef.current.play();           
    }
  };

  const handleTimeUpdate = () => {
    const startSeconds = timeToSeconds(startTime);
    const endSeconds = timeToSeconds(endTime);
    if (audioRef.current.currentTime >= endSeconds && isLooping) {
      audioRef.current.currentTime = startSeconds;
    } else {
      return 
    }
  };


  const handleRewind = (seconds) => {
    setRewindAmount(seconds);
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();      
    }
  };

  const handleStop = () => {
    setTimeout(() => {
      setStartTime('')
      setEndTime('')
      setIsLooping(false)
    }, 100)
    audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.loop = false;
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
  };

  const handleFaster = (speedRate) => {
    setPlaybackRate(playbackRate + speedRate);
    audioRef.current.playbackRate = playbackRate + speedRate;
  };

  const handleSlower = (speedRate) => {
    setPlaybackRate(playbackRate - speedRate);
    audioRef.current.playbackRate = playbackRate - speedRate;
  };

  const handleNormalSpeed = () => {
    setPlaybackRate(1);
    audioRef.current.playbackRate = 1;
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    audioRef.current.loop = !isLooping;
  };
  const timeMask = (inputValue) => {
    return inputValue
     .replace(/\D/g, '') 
     .replace(/(\d{2})(\d)/, '$1:$2')
     .replace(/(\d{2})(\d)/, '$1:$2')
     .replace(/(\d{2})(\d)/, '$1:$2') 
  
      } 
  const handleStartTimeChange = (event) => {
    const inputTime = event.target.value;
   const formattedTime = timeMask(inputTime)
   setStartTime(formattedTime);
      };
  const handleEndTimeChange = (event) => {
    const inputTime = event.target.value;
    const formattedTime = timeMask(inputTime)
      setEndTime(formattedTime);
      };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      audioRef.current.src = URL.createObjectURL(file);
      audioRef.current.load();
      setFileName(file.name)
    }
  };

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
      
    <div className='column'>
      <h1 className='controls'>Audio Speed Controller</h1>
      <button className=" controls button-10" onClick={handleClick}>
        Upload a file
      </button>
      <input  className='controls' onChange={handleFileChange} ref={hiddenFileInput} style={{ display: "none" }} type="file"  />
           <div className='controls'>
     <video ref={audioRef} controls controlsList='nodownload noplaybackrate'>
        Your browser does not support the audio element.
      </video>
     </div> 
     <div className="controls">
  <button className="button-10" onClick={() => handleSetVideoResolution('480p')}>
    Size 480p
  </button>
  <button className="button-10" onClick={() => handleSetVideoResolution('720p')}>
    Size 720p
  </button>
  <button className="button-10" onClick={() => handleSetVideoResolution('1080p')}>
    Size 1080p
  </button>

</div>
     <div className='text'>
      {fileName ? <h3>File Name: {fileName}</h3> : null}
    <h3>Playback Rate: {playbackRate.toFixed(2)}</h3>      
     <h3>{isLooping ? 'Looping ON' : 'Looping OFF'}</h3>
      </div>
      <div className="controls">
        <div className="verticalCenter">
        <h3>        
          Start Time:</h3>
          <input
          className="input"
          type="text"
          value={startTime}
          placeholder="HH:mm:ss"
          maxLength={8}
          onChange={(e) => handleStartTimeChange(e)}
        />
        </div>
        <div className="verticalCenter">
        <h3>
          End Time:
          </h3>  <input
            type="text"
            value={endTime}
            placeholder="HH:mm:ss"
            maxLength={8}
            onChange={(e) => handleEndTimeChange(e)}
          />
        </div>
      </div>

      <div className="controls">
      <button className='button-10' onClick={handlePlaySelectedSegment}>Play Selected Segment</button>
        </div>      
      <div className="controls">
        <button className='button-10' onClick={handlePlayPause}>Play/Pause</button>
        <button className='button-10' onClick={handleStop}>Stop</button></div>
        <div className="controls">
        <button className='button-10' onClick={handleNormalSpeed}>Normal Speed</button>
        <button className='button-10' onClick={handleLoop}>{isLooping ? 'Disable Loop' : 'Enable Loop'}</button>
      </div>
      <div className='controls'>
      <button className='button-10' onClick={()=> handleSlower(0.01)}>Slower - 0.01</button>
      <button className='button-10' onClick={()=> handleFaster(0.01)}>Faster + 0.01</button>
      </div>
      <div className='controls'>
      <button className='button-10' onClick={()=> handleSlower(0.05)}>Slower - 0.05</button>
      <button className='button-10' onClick={()=> handleFaster(0.05)}>Faster + 0.05</button>
      </div>
      <div className='controls'>
      <button className='button-10' onClick={()=> handleSlower(0.1)}>Slower - 0.10</button>
      <button className='button-10' onClick={()=> handleFaster(0.1)}>Faster + 0.10</button>
      </div>
      <div className="controls">
        <button className="button-10" onClick={() => handleRewind(1)}>
          Set Rewind 1 Second
        </button>
        <button className="button-10" onClick={() => handleRewind(3)}>
        Set Rewind 3 Seconds
        </button>
        <button className="button-10" onClick={() => handleRewind(5)}>
        Set Rewind 5 Seconds
        </button>
      </div>
    </div>

  );
}

export default App;
