import React, { useState } from 'react';
import Message from './Message';
import ProgressBar from './ProgressBar';
import ProgressConvertBar from './ProgressConvertBar';
import axios from 'axios';
import Tesseract from 'tesseract.js';

import logo from '../logo.svg';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [convertPercentage, setConvertPercentage] = useState(0);

  const [ocrText, setOcrText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      });

      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 5000);

      const { fileName, filePath } = res.data;
      console.log(filePath)

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  };


  const ConvertFile = () => {
    Tesseract.recognize(
      'uploads/' + `${uploadedFile.fileName}`,
      'eng',
      // { logger: m => console.log(m.progress)}
      {
        logger: e => {
          setConvertPercentage(
            parseInt(
              Math.round(e.progress * 100)
            )
          );
        }
      }
    )

      .then(({ data: { text } }) => {
        setOcrText((oldarray) => [...oldarray, text]);
      });
    setIsLoading(true);
  };

  return (
    <div className="FileUploadPage">

      <div className="SectionTop">
        {message ? <Message msg={message} /> : null}
        <form onSubmit={onSubmit}>
          <div>
            <input
              className='BtnFile'
              type='file'
              id='customFile'
              onChange={onChange}
            />
          </div>

          <ProgressBar percentage={uploadPercentage} />

          <button className="BtnInfo">Upload</button>

        </form>

        <ProgressConvertBar percentageConvert={convertPercentage} />


        <button onClick={ConvertFile} className="BtnInfo">Convert</button>

      </div>



      <div className="SectionBottom">
      
        <div className="SectionA">
          {uploadedFile ? (
            <div>
              <h4>{uploadedFile.fileName}</h4>
              <img className="ImageSize" src={`http://localhost:3001${uploadedFile.filePath}`} alt='' />
            </div>
          ) : <div></div>}
        </div>
       



        {/* //////////////////////////////CONVERTED FILE TO TEXT - DISPLAY /////////////////////////////////////////*/}

        <div className="SectionB">
          {ocrText.length > 0 ? (
            <div className="ConvertedImage">
              {ocrText.map((ot) => (
                <h6 key={ocrText.indexOf(ot)}>
                  <strong>{ocrText.indexOf(ot) + 1}-) </strong>
                  {ot}
                </h6>
              ))}
            </div>
          ) : (
            <div></div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FileUpload;