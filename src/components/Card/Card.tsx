import './Card.css';
import trashIcon from '../../assets/trash.svg';
import TagItem from './TagItem';

interface CardProps {
  allInformation: AllInformation;
  handleDelete: (id: string) => void;
}

interface AllInformation {
  id: string;
  name: string;
  link: string;
  street: string;
  city: string;
  state: string;
  eventDate: string;
  phone: string;
  startTime: string;
  evetplace: string;
}

export default function Card({ allInformation, handleDelete }: CardProps) {
  return (
    <div className="cardItem">
      <div>
        {/* <button onClick={() => handleDelete(allInformation.id)} title="Delete">
          <img
            src={trashIcon}
            alt="Ícone de lixeira para excluir o card"
            className="trashIcon"
          />
        </button> */}

        <h3 className="cardTitle">{allInformation.name}</h3>
        <p className="cardAddress">
          {allInformation.street && (
            <>
              {allInformation.street} <br />
            </>
          )}
          {allInformation.city}, {allInformation.state} -{' '}
        </p>
      </div>
      <TagItem
        phone={allInformation.phone}
        zip={allInformation.evetplace}
        type={allInformation.eventDate}
        link={allInformation.link}
        startTime={allInformation.startTime}
      />
    </div>
  );
}
