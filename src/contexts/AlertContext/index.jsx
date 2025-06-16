import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  let alertCounter = 0;
 
  const showAlert = ({message, type = 'error'}) => {
    const id = `alert-${Date.now()}-${alertCounter++}`;

    setAlerts((prev) => [...prev, { id, message, type }]);

  };

  const closeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div className='alert-container'>
        {alerts.map(({ id, message, type }) => (
          <div key={id} className={`alert alert-${type}`}>
            {typeof message === 'string' && message && <span>{message}</span>}
            {typeof message === 'object' && message.message && (
              <span>{message.message}</span>
            )}
            <span className='close-alert' onClick={() => closeAlert(id)}>
              ✖
            </span>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
