import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MainPage.css';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Error from '../assets/error.svg';

interface MainPageProps {
  setCondicional: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
}

interface DataProps {
  id: string;
  name: string;
  brewery_type: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

export default function MainPage({ setCondicional, username }: MainPageProps) {
  const [data, setData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('Recife');

  const saoPauloEvents = [
    {
      id: '4',
      name: 'Nando Reis - Turnê Nando Hits - Show especial',
      link: 'https://funbuynet.com.br/ingressos-show/ingressos-mpb/ingressos-nando-reis/E-1515',
      street: 'Av. das Nações Unidas, 17955',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: ' 10/06/2022',
      phone: '(34) 99422-6112',
      startTime: '19:00',
      evetplace: 'Vibra São Paulo'
    },
    {
      id: '5',
      name: 'Guns n Roses South American Tour 2022',
      link: 'https://www.viagogo.com/br/Ingressos-Shows/Hard-Rock-Metal/Guns-N-Roses-Ingressos?AffiliateID=49&adposition=&PCID=PSBRGOOSHOGUNS2C9DEE86144&AdID=575802091097&MetroRegionID=&psc=%2c&ps=%2c&ps_p=0&ps_c=12775818929&ps_ag=126677832208&ps_tg=kwd-161576545697&ps_ad=575802091097&ps_adp=%2c&ps_fi=%2c&ps_li=%2c&ps_lp=1001625&ps_n=g&ps_d=c&gclid=Cj0KCQjwheyUBhD-ARIsAHJNM-M-mNfJhfK7m5-_KCPxSS6cKyrtyDOc0z3eI2qInB6ZzSqMiEgG1FQaAqVcEALw_wcB',
      street: ' Av. Francisco Matarazzo, 1705',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '24/9/22',
      phone: '(34) 99422-6112',
      startTime: '21:00',
      evetplace: 'Allianz Parque'
    },
    {
      id: '6',
      name: 'Roupa Nova Especial Dia dos Namorados',
      link: ' https://m.facebook.com/events/817389148685993/',
      street: ' R. Tagipuru, 795',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: '11/06/2022',
      phone: '(63) 99264-5401',
      startTime: '20:30',
      evetplace: ' Espaço Unimed'
    },
    {
      id: '16',
      name: 'KHALID',
      link: 'https://www.eventim.com.br/event/khalid-espaco-unimed-14573679/?affiliate=GG1',
      street: 'R. Tagipuru, 795',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: ' 23/06/2022',
      phone: '1188 - 1188',
      startTime: '21:00',
      evetplace: 'Espaço Unimed'
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
      evetplace: 'Centro de Convenções - Anhembi'
    },
    {
      id: '18',
      name: 'Matuê',
      link: 'https://espacoleste.com/matue-e-convidados23-de-janeiro-de-2022-domingo/',
      street: 'Avenida Aricanduva, 12011',
      city: 'São Paulo',
      state: 'São Paulo',
      eventDate: ' 10/06/2022',
      phone: '1100-1100',
      startTime: '22:00',
      evetplace: 'Espaço Leste'
    }
  ];

  const rioEvents = [
    {
      id: '7',
      name: 'COLDPLAY - RIO DE JANEIRO',
      link: 'https://www.eventim.com.br/campaign/coldplay',
      street: ' R. José dos Reis, 425',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: ' 11/10/2022',
      phone: '(92) 98933-0590',
      startTime: '20:00',
      evetplace: 'Estádio Nilton Santos'
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
      evetplace: 'Jeunesse Arena'
    },
    {
      id: '9',
      name: 'Baianasystem no Circo Voador',
      link: 'https://www.eventim.com.br/event/baianasystem-no-circo-voador-circo-voador-15185236/',
      street: ' R. dos Arcos, s/n',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: ' 4/06/2022',
      phone: '(88) 98154-6236',
      startTime: '22:00',
      evetplace: 'Circo Voador'
    },
    {
      id: '13',
      name: 'Harry Styles: Love On Tour',
      link: 'https://www.livenation.lat/show/1360006/harry-styles-love-on-tour/rio%20de%20janeiro/2022-12-08/pt',
      street: 'Av. Embaixador Abelardo Bueno, 3401',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: ' 08/12/2022',
      phone: '4488 - 4488',
      startTime: '17:00',
      evetplace: 'Classic Hall'
    },
    {
      id: '14',
      name: 'Avril Lavigne @ Rock in Rio',
      link: 'https://www.festicket.com/pt/festivals/rock-in-rio-global-experience/2022/shop/?referrer=bandsintown&shared_from=partner_linkgen',
      street: 'Av. Salvador Allende, 6500',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: '09/09/2022',
      phone: '2211-2211',
      startTime: '19:00',
      evetplace: 'Parque dos Atletas'
    },
    {
      id: '15',
      name: 'Irmãos - Alexandre Pires e Seu Jorge',
      link: 'https://www.eventoon.com.br/evento/alexandre-pires-e-seu-jorge-rio-de-janeiro-23-07-2022',
      street: 'Av. Infante Dom Henrique, S/N',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      eventDate: ' 23/07/2022',
      phone: '1155-1155',
      startTime: '19:00',
      evetplace: 'BR Marinas - Marina da Glória'
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
      eventDate: '1/07/2022',
      phone: '(61) 98468-3416',
      startTime: '13:00',
      evetplace: 'Armazém 14 Itaipava'
    },
    {
      id: '2',
      name: 'Whindersson Nunes em Recife',
      link: 'https://www.ingressodigital.com/evento/3878/Whindersson_Nunes__Isso_No__um_Culto',
      street: 'Av. Mal. Mascarenhas de Morais, 7787',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: ' 10/07/2022',
      phone: '(62) 99626-8845',
      startTime: '20:00',
      evetplace: 'Ginásio de Esportes Geraldo Magalhães'
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
      evetplace: 'Classic Hall'
    },
    {
      id: '10',
      name: 'A-HA',
      link: 'https://www.livepass.com.br/event/a-ha-classic-hall-14043234/',
      street: ' Av. Gov. Agamenon Magalhães, S/N',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: ' 13/7/2022',
      phone: '9988 - 9988',
      startTime: '20:00',
      evetplace: 'Classic Hall'
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
      evetplace: 'Teatro Guararapes'
    },
    {
      id: '12',
      name: 'Fresno no Recife | Clube Internacional do Recife| Turnê Vou Ter Que Me Virar',
      link: 'https://www.sympla.com.br/evento/fresno-no-recife-clube-internacional-do-recife-turne-vou-ter-que-me-virar/806938',
      street: ' R. Benfica, 505',
      city: 'Recife',
      state: 'Pernambuco',
      eventDate: ' 14/08/2022',
      phone: '4455-4455',
      startTime: '01:00',
      evetplace: 'Clube Internacional do Recife'
    }
  ];

  useEffect(() => {
    const getData = () => {
      axios
        .get('https://api.openbrewerydb.org/breweries')
        .then(function (response) {
          setData(response.data);
        })
        .finally(() => setIsLoading(false));
    };

    getData();
  }, []);

  function handleDelete(id: string) {
    setData(data.filter(data => data.id !== id));
  }

  const handleOnClickSelect = (e: any) => {
    setLocation(e.target.value);
  };

  return (
    <div className="mainContainer">
      <Header setCondicional={setCondicional} username={username} />
      <div>
        <div className="selectWrapper">
          <label className="selectTitle" htmlFor="select">
            Selecione a cidade:{' '}
          </label>

          <select
            className="select"
            onClick={e => handleOnClickSelect(e)}
            name="select"
          >
            <option value="Recife" selected>
              Recife
            </option>
            <option value="São Paulo">São Paulo</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
          </select>
        </div>
      </div>
      <main className="main">
        {isLoading && <p>Carregando</p>}
        {!data.length && !isLoading && (
          <div className="reqError">
            <div>
              <h1>Erro de requisição:</h1>
              <h2>
                Não foi possível acessar a API, <br /> ou a API não possui
                itens.
              </h2>
              <p>
                Por favor, tente se conectar à internet. Ou contate o
                administrador.
              </p>
            </div>
            <img
              src={Error}
              alt="Ícone de seta pra esquerda, para voltar pra tela de login"
            />
          </div>
        )}

        {location === 'São Paulo' &&
          saoPauloEvents.map((item, index) => (
            <Card
              handleDelete={handleDelete}
              key={index}
              allInformation={item}
            />
          ))}

        {location === 'Rio de Janeiro' &&
          rioEvents.map((item, index) => (
            <Card
              handleDelete={handleDelete}
              key={index}
              allInformation={item}
            />
          ))}

        {location === 'Recife' &&
          recifeEvents.map((item, index) => (
            <Card
              handleDelete={handleDelete}
              key={index}
              allInformation={item}
            />
          ))}

        {/* {location === 'Recife' &&
          data.map((item, index) => (
            <Card
              handleDelete={handleDelete}
              key={index}
              allInformation={item}
            />
          ))} */}
      </main>
    </div>
  );
}
