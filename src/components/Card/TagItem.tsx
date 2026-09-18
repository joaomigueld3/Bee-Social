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
          <img src={statistcIcon} alt="" />
          <p>{type}</p>
        </div>
        <div className="tagsItem">
          <img src={statistcIcon} alt="" />
          <p>{startTime}</p>
        </div>
        <div className="tagsItem">
          <img src={locationIcon} alt="" />
          <p>{venue}</p>
        </div>
      </div>

      <div className="tags">
        {phone && (
          <div className="tagsItem">
            <img src={phoneIcon} alt="" />
            <p>{phone}</p>
          </div>
        )}
        {link && (
          <div className="tagsItem">
            <img src={CheckIcon} alt="" />
            <a href={link} target="_blank" rel="noopener noreferrer">
              Ver ingresso ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
