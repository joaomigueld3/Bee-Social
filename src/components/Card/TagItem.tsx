import './Card.css';
import statistcIcon from '../../assets/statistc.svg';
import locationIcon from '../../assets/location.svg';
import phoneIcon from '../../assets/phone.svg';
import CheckIcon from '../../assets/check-circle.svg';

interface TagItemProps {
  type: string;
  venue: string;
  phone: string;
  link: string;
  startTime: string;
}

export default function TagItem({ type, venue, phone, link, startTime }: TagItemProps) {
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
          <p>{venue}</p>
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
            <a target="_blank" rel="noopener noreferrer" href={link}>
              Visit the website!
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
