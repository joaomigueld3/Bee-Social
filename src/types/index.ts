export type EventCategory =
  | 'Rock'
  | 'Pop'
  | 'MPB'
  | 'Eletrônica'
  | 'Pagode'
  | 'Sertanejo'
  | 'Rap'
  | 'R&B'
  | 'Samba'
  | 'Stand-up'
  | 'Funk'
  | 'Jazz';

export type EventPrice =
  | 'Gratuito'
  | 'Até R$ 100'
  | 'R$ 100 a 200'
  | 'Acima de R$ 200';

export interface Event {
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
  category: EventCategory;
  price: EventPrice;
  imageUrl?: string;
}
