import { useState } from 'react';
import '../styles/MainPage.css';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';

interface MainPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
}

export default function MainPage({ setIsLoggedIn, username }: MainPageProps) {
  const [location, setLocation] = useState('Recife');

  const saoPauloEvents = [
    {
      id: '4',
      name: 'Nando Reis - Turnê Nando Hits - Show especial',
      link: 'https://funbuynet.com.br/ingressos-show/ingressos-mpb/ingressos-nando-reis/E-1515',
      street: 'Av. das Nações Unidas, 17955',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '10/06/2022',
      phone: '(34) 99422-6112',
      startTime: '19:00',
      eventPlace: 'Vibra São Paulo'
    },
    {
      id: '5',
      name: 'Guns n Roses South American Tour 2022',
      link: 'https://www.viagogo.com/br/Ingressos-Shows/Hard-Rock-Metal/Guns-N-Roses-Ingressos',
      street: 'Av. Francisco Matarazzo, 1705',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '24/09/2022',
      phone: '(34) 99422-6112',
      startTime: '21:00',
      eventPlace: 'Allianz Parque'
    },
    {
      id: '6',
      name: 'Roupa Nova Especial Dia dos Namorados',
      link: 'https://m.facebook.com/events/817389148685993/',
      street: 'R. Tagipuru, 795',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '11/06/2022',
      phone: '(63) 99264-5401',
      startTime: '20:30',
      eventPlace: 'Espaço Unimed'
    },
    {
      id: '16',
      name: 'KHALID',
      link: 'https://www.eventim.com.br/event/khalid-espaco-unimed-14573679/',
      street: 'R. Tagipuru, 795',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '23/06/2022',
      phone: '1188-1188',
      startTime: '21:00',
      eventPlace: 'Espaço Unimed'
    },
    {
      id: '17',
      name: 'DUA LIPA',
      link: 'https://www.eventim.com.br/event/dua-lipa-distrito-anhembi-15305543/',
      street: 'Av. Olavo Fontoura, 1209',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '08/09/2022',
      phone: '2299-2299',
      startTime: '21:00',
      eventPlace: 'Centro de Convenções - Anhembi'
    },
    {
      id: '18',
      name: 'Matuê',
      link: 'https://espacoleste.com/matue-e-convidados23-de-janeiro-de-2022-domingo/',
      street: 'Avenida Aricanduva, 12011',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '10/06/2022',
      phone: '1100-1100',
      startTime: '22:00',
      eventPlace: 'Espaço Leste'
    }
  ];

  const rioEvents = [
    {
      id: '7',
      name: 'COLDPLAY - RIO DE JANEIRO',
      link: 'https://www.eventim.com.br/campaign/coldplay',
      street: 'R. José dos Reis, 425',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '11/10/2022',
      phone: '(92) 98933-0590',
      startTime: '20:00',
      eventPlace: 'Estádio Nilton Santos'
    },
    {
      id: '8',
      name: 'Zeca Pagodinho',
      link: 'https://jeunessearena.com.br/eventos/409',
      street: 'Av. Embaixador Abelardo Bueno, 3401',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '17/09/2022',
      phone: '(89) 96915-6134',
      startTime: '21:00',
      eventPlace: 'Jeunesse Arena'
    },
    {
      id: '9',
      name: 'Baianasystem no Circo Voador',
      link: 'https://www.eventim.com.br/event/baianasystem-no-circo-voador-circo-voador-15185236/',
      street: 'R. dos Arcos, s/n',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '04/06/2022',
      phone: '(88) 98154-6236',
      startTime: '22:00',
      eventPlace: 'Circo Voador'
    },
    {
      id: '13',
      name: 'Harry Styles: Love On Tour',
      link: 'https://www.livenation.lat/show/1360006/harry-styles-love-on-tour/rio%20de%20janeiro/2022-12-08/pt',
      street: 'Av. Embaixador Abelardo Bueno, 3401',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '08/12/2022',
      phone: '4488-4488',
      startTime: '17:00',
      eventPlace: 'Classic Hall'
    },
    {
      id: '14',
      name: 'Avril Lavigne @ Rock in Rio',
      link: 'https://www.festicket.com/pt/festivals/rock-in-rio-global-experience/2022/shop/',
      street: 'Av. Salvador Allende, 6500',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '09/09/2022',
      phone: '2211-2211',
      startTime: '19:00',
      eventPlace: 'Parque dos Atletas'
    },
    {
      id: '15',
      name: 'Irmãos - Alexandre Pires e Seu Jorge',
      link: 'https://www.eventoon.com.br/evento/alexandre-pires-e-seu-jorge-rio-de-janeiro-23-07-2022',
      street: 'Av. Infante Dom Henrique, S/N',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '23/07/2022',
      phone: '1155-1155',
      startTime: '19:00',
      eventPlace: 'BR Marinas - Marina da Glória'
    }
  ];

  const recifeEvents = [
    {
      id: '1',
      name: 'Unite Recife',
      link: 'https://recifeingressos.com/unite-recife',
      street: 'Av. Alfredo Lisboa, s/n',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '01/07/2022',
      phone: '(61) 98468-3416',
      startTime: '13:00',
      eventPlace: 'Armazém 14 Itaipava'
    },
    {
      id: '2',
      name: 'Whindersson Nunes em Recife',
      link: 'https://www.ingressodigital.com/evento/3878/Whindersson_Nunes__Isso_No__um_Culto',
      street: 'Av. Mal. Mascarenhas de Morais, 7787',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '10/07/2022',
      phone: '(62) 99626-8845',
      startTime: '20:00',
      eventPlace: 'Ginásio de Esportes Geraldo Magalhães'
    },
    {
      id: '3',
      name: 'Lulu Santos em Recife',
      link: 'https://recifeingressos.com/lulu-santos-em-recife',
      street: 'Av. Gov. Agamenon Magalhães, S/N',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '22/07/2022',
      phone: '(27) 97463-1217',
      startTime: '21:00',
      eventPlace: 'Classic Hall'
    },
    {
      id: '10',
      name: 'A-HA',
      link: 'https://www.livepass.com.br/event/a-ha-classic-hall-14043234/',
      street: 'Av. Gov. Agamenon Magalhães, S/N',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '13/07/2022',
      phone: '9988-9988',
      startTime: '20:00',
      eventPlace: 'Classic Hall'
    },
    {
      id: '11',
      name: 'ANAVITÓRIA | RECIFE | PE',
      link: 'https://www.esfera.com.vc/p/anavitoria-turne-cor/e101075975',
      street: 'Av. Prof. Andrade Bezerra, S/N',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '12/10/2022',
      phone: '2233-2233',
      startTime: '21:00',
      eventPlace: 'Teatro Guararapes'
    },
    {
      id: '12',
      name: 'Fresno no Recife | Clube Internacional do Recife',
      link: 'https://www.sympla.com.br/evento/fresno-no-recife-clube-internacional-do-recife-turne-vou-ter-que-me-virar/806938',
      street: 'R. Benfica, 505',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: '14/08/2022',
      phone: '4455-4455',
      startTime: '01:00',
      eventPlace: 'Clube Internacional do Recife'
    }
  ];

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const eventsByLocation: Record<string, typeof recifeEvents> = {
    Recife: recifeEvents,
    'São Paulo': saoPauloEvents,
    'Rio de Janeiro': rioEvents
  };

  return (
    <div className="mainContainer">
      <Header setIsLoggedIn={setIsLoggedIn} username={username} />
      <div>
        <div className="selectWrapper">
          <label className="selectTitle" htmlFor="select">
            Selecione a cidade:{' '}
          </label>
          <select
            className="select"
            id="select"
            name="select"
            defaultValue="Recife"
            onChange={handleLocationChange}
          >
            <option value="Recife">Recife</option>
            <option value="São Paulo">São Paulo</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
          </select>
        </div>
      </div>
      <main className="main">
        {(eventsByLocation[location] ?? []).map(item => (
          <Card key={item.id} allInformation={item} />
        ))}
      </main>
    </div>
  );
}
