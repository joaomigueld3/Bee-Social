import './Card.css';
import statistcIcon from '../../assets/statistc.svg';
import locationIcon from '../../assets/location.svg';
import phoneIcon from '../../assets/phone.svg';
import btnAddIcon from '../../assets/btnAdd.svg';
import CheckIcon from '../../assets/check-circle.svg';
import { useState } from 'react';

interface TagItemProps {
  type: string;
  zip: string;
  phone: string;
  link: string;
  startTime: string;
}

export default function TagItem({
  type,
  zip,
  phone,
  link,
  startTime
}: TagItemProps) {
  const [inputAdd, setInputAdd] = useState('');
  const [inputActive, setInputActive] = useState(true);
  const [typedInput, setTypedInput] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [error, setError] = useState(false);

  function handleClick() {
    setInputActive(false);
  }

  function handleClickInput() {
    if (!inputAdd.trim()) {
      setError(true);
      setInputMsg('Campo em branco, por favor, digite algo.');
      return;
    }
    if (inputAdd.length > 20) {
      setError(true);
      setInputMsg('Tamanho máximo de 20 caracteres.');
      return;
    }
    // INPUT aceitar apenas números
    // if (isNaN(inputAdd)) {
    //   setError(true);
    //   setInputMsg('Por favor, digite um número.');
    //   return;
    // }
    setTypedInput(true);
    setError(false);
  }
  return (
    <div>
      <div className="tags">
        <div className="tagsItem">
          <img src={statistcIcon} alt="Ícone" />
          <p>{type}</p>
        </div>

        <div className="tagsItem">
          <img src={statistcIcon} alt="Ícone" />
          <p>{startTime}</p>
        </div>
        <div className="tagsItem">
          <img src={locationIcon} alt="Ícone" />
          <p>{zip}</p>
        </div>
      </div>

      <div className="tags">
        {phone && (
          <div className="tagsItem">
            <img src={phoneIcon} alt="Ícone" />
            <p>{phone}</p>
          </div>
        )}

        {link && (
          <div className="tagsItem">
            <img src={CheckIcon} alt="Ícone" />
            <a target="_blank" href={link}>
              Visit the website!
            </a>
          </div>
        )}

        {/* {inputActive ? (
          <div className="tagsItem">
            <img
              src={btnAddIcon}
              alt="Add icon"
              className="feature"
              onClick={() => handleClick()}
            />
            <p className="feature" onClick={() => handleClick()}>
              add more
            </p>
          </div>
        ) : (
          <div className="tagsItem">
            {!inputActive && !typedInput && (
              <>
                <img
                  src={CheckIcon}
                  alt="Check icon"
                  className="feature"
                  onClick={handleClickInput}
                />
                <input
                  type="text"
                  value={inputAdd}
                  onChange={e => setInputAdd(e.target.value)}
                />
              </>
            )}
            {typedInput && <p>{inputAdd}</p>}
          </div>
        )}
        {error && <span style={{ color: 'red' }}>{inputMsg}</span>} */}
      </div>
    </div>
  );
}
