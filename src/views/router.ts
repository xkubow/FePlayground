import { Path } from '@/template/router/path';
import { Home } from '@/views/home';
import type { RouteRecordRaw } from 'vue-router';
import { About } from './about';
import { Administrace } from './administrace';
import { Blikacka } from './blikacka';
import { AutomatickeZpracovaniTestu } from './ciselniky/automatickeZpracovaniTestu';
import { AutomatickeZpracovaniTestuResulty } from './ciselniky/automatickeZpracovaniTestu/resulty';
import { Barva2 } from './ciselniky/barva2';
import { Barva4 } from './ciselniky/barva4';
import { Language } from './ciselniky/label';
import { ModelovaSkupina } from './ciselniky/modelovaSkupina';
import { ModelovaTrida } from './ciselniky/modelovaTrida';
import { PrCislo } from './ciselniky/prCislo';
import { RidiciJednotka } from './ciselniky/ridiciJednotka';
import { TypBaterie } from './ciselniky/typBaterie';
import { Eskalace } from './eskalace';
import { Tiket } from './tiket';
import { Uzivatel } from './uzivatel';
import { Skupina } from './uzivatel/skupina';
import { Vozidlo } from './vozidlo';
import { VozidloZavada } from './vozidlo/zavada';
import { VozidloZavadaNavrhovana } from './vozidlo/zavada/navrhovane';
import { VozidloStitek } from './vozidloStitek';
import { VraceniBaterie } from './vraceniBaterie';
import { VyrobniLinka } from './vyrobniLinka';
import { VyrobniLinkaKonfigurace } from './vyrobniLinka/konfigurace';
import { Zavada } from './zavada';

export const routes: Array<RouteRecordRaw> = [
  Home.route,
  new Path('/').addChildren([
    Vozidlo.route,
    VyrobniLinkaKonfigurace.route,
    VyrobniLinka.route,
    Zavada.route,
    VozidloZavada.route,
    Administrace.route,
    Blikacka.route,
    Barva2.route,
    Barva4.route,
    ModelovaSkupina.route,
    ModelovaTrida.route,
    Eskalace.route,
    Tiket.route,
    Skupina.route,
    Uzivatel.route,
    VozidloStitek.route,
    PrCislo.route,
    About.route,
    Language.route,
    VozidloZavadaNavrhovana.route,
    RidiciJednotka.route,
    AutomatickeZpracovaniTestu.route,
    AutomatickeZpracovaniTestuResulty.route,
    VraceniBaterie.route,
    TypBaterie.route,
  ]),
];
