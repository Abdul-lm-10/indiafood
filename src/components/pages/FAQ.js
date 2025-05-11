import React, { useState } from 'react'
import data from '../../json file/faq.json'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted">Find answers to common questions about our services</p>
          </div>

          <div className="faq-container">
            {data.map((faq, index) => (
              <div 
                className={`faq-item mb-4 ${activeIndex === index ? 'active' : ''}`}
                key={index}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="faq-header"
                  onClick={() => handleClick(index)} 
                  style={{ 
                    padding: '1.5rem',
                    cursor: 'pointer',
                    backgroundColor: activeIndex === index ? '#198754' : '#fff',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 
                      className="mb-0" 
                      style={{ 
                        color: activeIndex === index ? '#fff' : '#212529',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {faq.question}
                    </h5>
                    <span 
                      style={{ 
                        color: activeIndex === index ? '#fff' : '#198754',
                        fontSize: '1.5rem',
                        transform: activeIndex === index ? 'rotate(45deg)' : 'rotate(0)',
                        transition: 'all 0.3s ease',
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        textAlign: 'center',
                        lineHeight: '20px'
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div 
                  style={{ 
                    maxHeight: activeIndex === index ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div className="p-4">
                    <p className="mb-0 text-muted" style={{ lineHeight: '1.6' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ