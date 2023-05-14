import React, { useState, useRef,useEffect } from 'react';
import './featuresecondary.css';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Featurethird from './featurethird';

const Featuresecondary = () => {

  const sliderRef = useRef(null);
  const [institutesData, setinstitutesData] = useState([]);
  const [showConfirmation, setConfirmation] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setuserData] = useState(null);
  let visibleData = institutesData;
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/university/recent-programs')
    .then((response) => {
      console.log('Universities:', response.data);
      setinstitutesData(response.data);
     
    })
      .catch((error) => console.error('Failed to retrieve universities:', error));
  }, []);

  const handleUpArrowClick = () => {
    sliderRef.current.slickPrev();
  };

  const handleDownArrowClick = () => {
    sliderRef.current.slickNext();
  };

  useEffect(() => {
    // Get sessionId and email from sessionStorage
    const sessionId = sessionStorage.getItem('sessionId');
    const email = sessionStorage.getItem('email');
    console.log(email)
   
    if(email === null) {  
      console.error('User is not logged in.'); // Log error message
      return;
    }
    setEmail(email);
  }, []);

  const handleApplyConfirm = async (index) => {

    const selectedInstitute = institutesData[index];
    console.log(selectedInstitute.program)
    
    try {
      const response = await axios.post('http://localhost:8000/application', {
        email: email,
        status: 'Pending',
        appliedDate: new Date(),
        additionalRequirements: [],
        appliedFor: selectedInstitute.program,
        otherInfo: '',
        uniID: selectedInstitute.uniID,
        
      });
      setConfirmation(false);
      console.log(response.data); // Log success message
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const sortByDeadline = () => {
    const sortedData = institutesData.sort((a, b) => {
      const dateA = new Date(a.lastDate);
      const dateB = new Date(b.lastDate);
      return dateA - dateB;
    });
    // Update the institutesData state with the sorted data
   visibleData = sortedData;
  };
  const [elapsed, setElapsed] = useState('');
  const sortByMostRecent = () => {
    const sortedData = institutesData.sort((a, b) => {
      const dateA = new Date(a.updated);
      const dateB = new Date(b.updated);
      return dateB - dateA;
    });
    // Update the institutesData state with the sorted data
    visibleData = sortedData;
  };

  const sortByMostPopular = () => {
    // const sortedData = institutesData.sort((a, b) => b.id - a.id);
    // // Update the institutesData state with the sorted data
    // setInstitutesData(sortedData);
  };


  const settings = {
    vertical: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    draggable: false,
    swipe: true,
    touchMove: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {

          slidesToShow: 1,
        },
      },
    ],
  };

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newData = institutesData.map(institute => {
        const updated = new Date(institute.updated);
        const elapsedMs = now - updated;
        let elapsed;
        if (elapsedMs < 60 * 1000) {
          elapsed = `${Math.floor(elapsedMs / 1000)} seconds`;
        } else if (elapsedMs < 60 * 60 * 1000) {
          elapsed = `${Math.floor(elapsedMs / (60 * 1000))} minutes`;
        } else if (elapsedMs < 24 * 60 * 60 * 1000) {
          elapsed = `${Math.floor(elapsedMs / (60 * 60 * 1000))} hours`;
        } else {
          elapsed = `${Math.floor(elapsedMs / (24 * 60 * 60 * 1000))} days`;
        }
        setElapsed(`Updated: ${elapsed} ago`);
        return {
          ...institute,
          elapsed: `Updated: ${elapsed} ago`
          
        };
      });
      setinstitutesData(newData);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [institutesData]);
  
  return (



    <div className='edulink__featuresecondary'>
        <div className="edulink__featuresecondary-box1">
        <div className='edulink__featuresecondary-box1-header'>
              <div>
                <h2>Recent Programs</h2>
              </div>
              <div className='edutemper' onClick={toggleFilterMenu}>
                  <h3>Sort By</h3>
                  <div  className='edutemper2'>
                    <svg id="down-arrow-2" fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
                      <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
                      l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
                      C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/>
                    </svg>
                  </div>
                  {filterMenuOpen && (
                <div className='filter-menu'>
                  <div className='filter-menu__header'>
                      <h3 onClick={sortByMostPopular}>By Most Popular</h3>
                      <h3 onClick={sortByDeadline}>By Deadline</h3>
                      <h3 onClick={sortByMostRecent}>By Most Recent</h3>

                    </div>
                </div>
              )}
              </div>

          </div>

          <hr></hr>
          <div className='edulink__featuresecondary-institutes'>
            <div onClick={handleUpArrowClick}>
               <svg fill="#000000" version="1.1" id="up-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
                <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
                l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
                C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/>
              </svg>
            </div>


            <Slider {...settings} ref={sliderRef}>
  {visibleData.map((institute, index) => (
    <div key={institute.id} className="edulink__featuresecondary-instituteBox-info">
      <div className="edulink__featuresecondary-instituteBox">
        <div className="edulink__featuresecondary-institute-details">
          <div>
          <img src={"http://localhost:8000/images/"+institute.logo} alt={`${institute.name} logo`} />
          </div>
          <div>
            <h3>{institute.uniName}</h3>
            <h4>{institute.program}</h4>
          </div>
        </div>
        <div className="edulink__featuresecondary-institute-apply">
          {!showConfirmation[index] ? (
            <div>
              <button onClick={() => setConfirmation(prevState => ({ ...prevState, [index]: true }))}>Apply Now!</button>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: '10px' ,color:'green' }}>
                Are you sure you want to apply to {institute.instituteName} for {institute.program} program?
               
              </p>
              <button onClick={() => handleApplyConfirm(index)}>Confirm</button>
              <button style={{ border: '0px', marginLeft: '10px', backgroundColor: 'red' }} onClick={() => setConfirmation(prevState => ({ ...prevState, [index]: false }))}>Cancel</button>
            </div>
          )}
          <div>
            <h3>Last Date to Apply: {new Date(institute.lastApplyDate).toLocaleDateString('en-GB')}</h3>
          </div>
        </div>
      </div>
      <p>{institute.elapsed}</p>
    </div>
  ))}
</Slider>



             <div onClick={handleDownArrowClick}>
               <svg id="down-arrow" fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
                <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
                l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
                C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/>
              </svg>
            </div>
            </div>


        </div>
        <div className="edulink__featuresecondary-box2">
            <Featurethird />
        </div>
    </div>
  );
};

export default Featuresecondary;
