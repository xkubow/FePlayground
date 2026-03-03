import { http, HttpResponse } from 'msw';
import { pagedOutput } from '../data/vozidlo';
import { responses } from '../data/localhost_responses';

const BASE = '';

export const miscHandlers = [
  // Status
  http.get(`${BASE}/api/Status/version`, () => {
    return HttpResponse.json({ version: '1.0.0-mock', buildDate: '2024-01-01T00:00:00Z' });
  }),

  // Administrace
  http.get(`${BASE}/api/Administrace/Nastaveni`, () => {
    return HttpResponse.json({ prilohaVelikostMax: 52428800 });
  }),

  // SQS VozidloZavada Grid
  http.get(`${BASE}/api/Sqs/VozidloZavada/Grid`, () => {
    return HttpResponse.json(responses.vozidloZavadaGrid ? responses.vozidloZavadaGrid : []);
  }),

  // VraceniBaterie TypBaterie
  http.get(`${BASE}/api/VraceniBaterie/TypBaterie/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { id: 1, nazev: 'Li-Ion 77kWh', zkratka: 'Li77', operations: 15 },
        { id: 2, nazev: 'Li-Ion 58kWh', zkratka: 'Li58', operations: 15 },
      ]),
    );
  }),
  http.get(`${BASE}/api/VraceniBaterie/TypBaterie/GetDropDownList`, () => {
    return HttpResponse.json(responses.typBaterieDropDownList ? responses.typBaterieDropDownList : []);
  }),
  http.post(`${BASE}/api/VraceniBaterie/TypBaterie`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/VraceniBaterie/TypBaterie/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), nazev: 'Li-Ion 77kWh', zkratka: 'Li77', operations: 15 });
  }),
  http.put(`${BASE}/api/VraceniBaterie/TypBaterie/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/VraceniBaterie/TypBaterie/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VraceniBaterie Grid
  http.get(`${BASE}/api/VraceniBaterie/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),

  // VraceniBaterie Default
  http.get(`${BASE}/api/VraceniBaterie/Default`, () => {
    return HttpResponse.json({
      knr: null,
      vin: null,
      typBaterieId: null,
      vyrobniLinkaId: null,
      prirazenaSkupinaUzivateluId: null,
      operations: 15,
    });
  }),

  // VraceniBaterie CRUD
  http.post(`${BASE}/api/VraceniBaterie`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/VraceniBaterie/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      knr: 1234567,
      vin: 'WVWZZZ1JZXW000001',
      typBaterieId: 1,
      typBaterieText: 'Li-Ion 77kWh',
      vraceniBaterieStatusEnum: 0,
      vstupDatum: '2024-01-15T08:00:00Z',
      operations: 15,
    });
  }),
  http.put(`${BASE}/api/VraceniBaterie/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/VraceniBaterie/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VraceniBaterie Komentar
  http.get(`${BASE}/api/VraceniBaterie/Komentar/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/VraceniBaterie/Komentar`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/VraceniBaterie/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/VraceniBaterie/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VraceniBaterie Priloha
  http.get(`${BASE}/api/VraceniBaterie/Priloha/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/VraceniBaterie/Priloha`, () => {
    return HttpResponse.json(1, { status: 201 });
  }),
  http.get(`${BASE}/api/VraceniBaterie/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/VraceniBaterie/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
