import './Card.css';
import TagItem from './TagItem';

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
  eventPlace: string;
}

interface CardProps {
  allInformation: AllInformation;
}

export default function Card({ allInformation }: CardProps) {
  return (
    <div className="cardItem">
      <div>
        <h3 className="cardTitle">{allInformation.name}</h3>
        <p className="cardAddress">
          {allInformation.street && (
            <>
              {allInformation.street} <br />
            </>
          )}
          {allInformation.city}, {allInformation.state}
        </p>
      </div>
      <TagItem
        phone={allInformation.phone}
        venue={allInformation.eventPlace}
        type={allInformation.eventDate}
        link={allInformation.link}
        startTime={allInformation.startTime}
      />
    </div>
  );
}
