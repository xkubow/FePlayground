import { http, HttpResponse } from 'msw';
import { pagedOutput } from '../data/vozidlo';
import { responses } from '../data/localhost_responses';

const BASE = '';

const intDdl = (items: string[]) => items.map((text, i) => ({ value: i + 1, text }));

export const ciselnikyHandlers = [
  // AutomatickeZpracovaniTestu
  http.get(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/:id`, ({ params }) => {
    return HttpResponse.json({ automatickeZpracovaniTestuEnum: 0, text: 'AZT ' + params.id, operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/:id`, () => {
    return HttpResponse.json(1);
  }),

  // AutomatickeZpracovaniTestu Resulty
  http.get(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Resulty/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Resulty`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Resulty/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), pblKod: 100, text: 'Result', operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Resulty/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/AutomatickeZpracovaniTestu/Resulty/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Barva2
  http.get(`${BASE}/api/Ciselniky/Barva2/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { barva2Kod: 'LB', uiBarvaKod: 1, text: 'Moonstone Grey' },
        { barva2Kod: 'WB', uiBarvaKod: 2, text: 'Race Blue' },
        { barva2Kod: 'RD', uiBarvaKod: 3, text: 'Burgundy Red' },
      ]),
    );
  }),
  http.get(`${BASE}/api/Ciselniky/Barva2/:barva2Kod`, ({ params }) => {
    return HttpResponse.json({ barva2Kod: params.barva2Kod, uiBarvaKod: 1, vstupDatum: '2024-01-01T00:00:00Z' });
  }),
  http.put(`${BASE}/api/Ciselniky/Barva2/:barva2Kod`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Ciselniky/Barva2`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Ciselniky/Barva2/:barva2Kod`, () => {
    return HttpResponse.json(1);
  }),

  // Barva2 Label
  http.get(`${BASE}/api/Ciselniky/Barva2/Label/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.get(`${BASE}/api/Ciselniky/Barva2/Label/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), barva2Kod: 'LB', jazykId: 1, text: 'Moonstone Grey', vstupDatum: '2024-01-01T00:00:00Z' });
  }),
  http.post(`${BASE}/api/Ciselniky/Barva2/Label`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/Barva2/Label/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/Barva2/Label/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Barva4
  http.get(`${BASE}/api/Ciselniky/Barva4/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { barva4Kod: 'LB9A', barva2Kod: 'LB', uiBarvaKod: 1 },
        { barva4Kod: 'WB9R', barva2Kod: 'WB', uiBarvaKod: 2 },
        { barva4Kod: 'RD9F', barva2Kod: 'RD', uiBarvaKod: 3 },
      ]),
    );
  }),
  http.get(`${BASE}/api/Ciselniky/Barva4/:barva4Kod`, ({ params }) => {
    return HttpResponse.json({ barva4Kod: params.barva4Kod, barva2Kod: 'LB', uiBarvaKod: 1, vstupDatum: '2024-01-01T00:00:00Z' });
  }),
  http.put(`${BASE}/api/Ciselniky/Barva4/:barva4Kod`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Ciselniky/Barva4`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Ciselniky/Barva4/:barva4Kod`, () => {
    return HttpResponse.json(1);
  }),

  // Barva4 Label
  http.get(`${BASE}/api/Ciselniky/Barva4/Label/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.get(`${BASE}/api/Ciselniky/Barva4/Label/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), barva4Kod: 'LB9A', jazykId: 1, text: 'Moonstone Grey', vstupDatum: '2024-01-01T00:00:00Z' });
  }),
  http.post(`${BASE}/api/Ciselniky/Barva4/Label`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/Barva4/Label/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/Barva4/Label/:id`, () => {
    return HttpResponse.json(1);
  }),

  // SQS DropDownLists
  http.get(`${BASE}/api/Ciselniky/Sqs/GetSqsZavadaVinikDropDownList`, () => {
    return HttpResponse.json(responses.getSqsZavadaVinikDropDownList ? responses.getSqsZavadaVinikDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/Sqs/GetSqsZavadaTypDropDownList`, () => {
    return HttpResponse.json(responses.getSqsZavadaTypDropDownList ? responses.getSqsZavadaTypDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/Sqs/GetSqsZavadaKategorieDropDownList`, () => {
    return HttpResponse.json(responses.getSqsZavadaKategorieDropDownList ? responses.getSqsZavadaKategorieDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/Sqs/GetSqsZavadaSkupinaDropDownList`, () => {
    return HttpResponse.json(responses.getSqsZavadaSkupinaDropDownList ? responses.getSqsZavadaSkupinaDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/Sqs/GetSqsZavadaRadekDropDownList`, () => {
    return HttpResponse.json(responses.getSqsZavadaRadekDropDownList ? responses.getSqsZavadaRadekDropDownList : []);
  }),

  // SQS Grid
  http.get(`${BASE}/api/Ciselniky/Sqs/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),

  // ModelovaSkupina
  http.get(`${BASE}/api/Ciselniky/ModelovaSkupina/GetDropDownList`, () => {
    return HttpResponse.json(responses.modelovaSkupinaDropDownList ? responses.modelovaSkupinaDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaSkupina/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { id: 'SKO', text: 'Skoda' },
        { id: 'VW', text: 'Volkswagen' },
      ]),
    );
  }),
  http.post(`${BASE}/api/Ciselniky/ModelovaSkupina`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaSkupina/:id`, ({ params }) => {
    return HttpResponse.json({ id: params.id, text: 'Skoda', operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/ModelovaSkupina/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/ModelovaSkupina/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaSkupina/Label/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Ciselniky/ModelovaSkupina/Label`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaSkupina/Label/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), jazykId: 1, text: 'Skoda', operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/ModelovaSkupina/Label/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/ModelovaSkupina/Label/:id`, () => {
    return HttpResponse.json(1);
  }),

  // ModelovaTrida
  http.get(`${BASE}/api/Ciselniky/ModelovaTrida/GetDropDownList`, () => {
    return HttpResponse.json(responses.modelovaTridaDropDownList ? responses.modelovaTridaDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaTrida/Grid`, () => {
    return HttpResponse.json(pagedOutput([{ id: 'E1', text: 'E1', modelovaSkupinaKod: 'SKO' }]));
  }),
  http.post(`${BASE}/api/Ciselniky/ModelovaTrida`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaTrida/:id`, ({ params }) => {
    return HttpResponse.json({ id: params.id, text: 'E1', operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/ModelovaTrida/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/ModelovaTrida/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaTrida/Label/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Ciselniky/ModelovaTrida/Label`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/ModelovaTrida/Label/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), jazykId: 1, text: 'E1', operations: 15 });
  }),
  http.put(`${BASE}/api/Ciselniky/ModelovaTrida/Label/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/ModelovaTrida/Label/:id`, () => {
    return HttpResponse.json(1);
  }),

  // PrCislo
  http.get(`${BASE}/api/Ciselniky/PrCislo/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { prCisloKod: 'PR001', prCisloText: 'PR 001', prRodinaKod: 'FAM1', prRodinaText: 'Rodina 1' },
        { prCisloKod: 'PR002', prCisloText: 'PR 002', prRodinaKod: 'FAM1', prRodinaText: 'Rodina 1' },
      ]),
    );
  }),
  http.get(`${BASE}/api/Ciselniky/PrCislo/GetDropDownList`, () => {
    return HttpResponse.json(responses.prCisloDropDownList ? responses.prCisloDropDownList : []);
  }),

  // RidiciJednotka
  http.get(`${BASE}/api/Ciselniky/RidiciJednotka/GetDropDownList`, () => {
    return HttpResponse.json(responses.ridiciJednotkaDropDownList ? responses.ridiciJednotkaDropDownList : []);
  }),
  http.get(`${BASE}/api/Ciselniky/RidiciJednotka/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { id: 1, diagnostickaAdresa: 0x17, ridiciJednotkaText: 'BMS' },
        { id: 2, diagnostickaAdresa: 0x01, ridiciJednotkaText: 'ECU' },
      ]),
    );
  }),
  http.post(`${BASE}/api/Ciselniky/RidiciJednotka`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/RidiciJednotka/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), diagnostickaAdresa: 0x17, ridiciJednotkaText: 'BMS' });
  }),
  http.put(`${BASE}/api/Ciselniky/RidiciJednotka/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/RidiciJednotka/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/RidiciJednotka/Label/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Ciselniky/RidiciJednotka/Label`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/RidiciJednotka/Label/:id`, ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), ridiciJednotkaId: 1, jazykId: 1, text: 'Battery Mgmt', vstupDatum: '2024-01-01T00:00:00Z' });
  }),
  http.put(`${BASE}/api/Ciselniky/RidiciJednotka/Label/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/RidiciJednotka/Label/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VyrobniLinka
  http.post(`${BASE}/api/Ciselniky/VyrobniLinka`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/VyrobniLinka/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/VyrobniLinka/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Grid`, () => {
    return HttpResponse.json(
      pagedOutput([
        { id: 1, nazev: 'Linka 1', zkratka: 'L1', vyrobniZavodId: 1, vyrobniZavodText: 'Zavod MB' },
        { id: 2, nazev: 'Linka 2', zkratka: 'L2', vyrobniZavodId: 1, vyrobniZavodText: 'Zavod MB' },
      ]),
    );
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Konfigurace/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/GetDropDownList`, () => {
    return HttpResponse.json(responses.vyrobniLinkaDropDownList ? responses.vyrobniLinkaDropDownList : []);
  }),

  // VyrobniLinka KontrolniBod
  http.post(`${BASE}/api/Ciselniky/VyrobniLinka/KontrolniBod`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/VyrobniLinka/KontrolniBod/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/VyrobniLinka/KontrolniBod/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/KontrolniBod/GetDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'KB-01' },
      { value: 2, text: 'KB-02' },
    ]);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/KontrolniBod/Aktivni/GetDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'KB-01' },
      { value: 2, text: 'KB-02' },
    ]);
  }),

  // VyrobniLinka Pracoviste
  http.post(`${BASE}/api/Ciselniky/VyrobniLinka/Pracoviste`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/VyrobniLinka/Pracoviste/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/VyrobniLinka/Pracoviste/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Pracoviste/Aktivni/GetDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Pracoviste 1', disabled: false, vyrobniLinkaSegmentId: 1 },
      { value: 2, text: 'Pracoviste 2', disabled: false, vyrobniLinkaSegmentId: 1 },
    ]);
  }),
  http.put(`${BASE}/api/Ciselniky/VyrobniLinka/Pracoviste/Archiv/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VyrobniLinka Segment
  http.post(`${BASE}/api/Ciselniky/VyrobniLinka/Segment`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${BASE}/api/Ciselniky/VyrobniLinka/Segment/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Ciselniky/VyrobniLinka/Segment/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Segment/GetDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Segment A' },
      { value: 2, text: 'Segment B' },
    ]);
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Segment/Aktivni/GetDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Segment A' },
      { value: 2, text: 'Segment B' },
    ]);
  }),

  // VyrobniLinka Verze
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Verze/Grid`, () => {
    return HttpResponse.json(pagedOutput([{ id: 1, verze: 1, aktivni: true, vyrobniLinkaId: 1 }]));
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Verze/PridejVerzi`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Verze/SmazVerzi`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Ciselniky/VyrobniLinka/Verze/AktivujPosledniVerzi`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // VyrobniZavod
  http.get(`${BASE}/api/Ciselniky/VyrobniZavod/Grid`, () => {
    return HttpResponse.json(pagedOutput([{ id: 1, nazev: 'Zavod MB', zkratka: 'MB' }]));
  }),
];
