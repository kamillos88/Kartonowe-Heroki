import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { saveVoteToFirebase } from './firebase';
import './index.css';

// KLIPY I KATEGORIE
const CATEGORIES = [
  {
    id: 1,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
    clips: [
      { id: 1, title: "Brzydki syn", videoUrl: "https://www.youtube.com/embed/o3_hys4a5Pk" },
      { id: 2, title: "Babunia", videoUrl: "https://www.youtube.com/embed/r8b67TF_Es0" },
      { id: 3, title: "Namawianie do złego", videoUrl: "https://www.youtube.com/embed/f--BXkCX_xY" },
      { id: 4, title: "Patryj z rodziną", videoUrl: "https://www.youtube.com/embed/nJRjmgKqHMU", context: "Istnieje na Imperium taki inside joke, że Patryj jest psem" },
      { id: 5, title: "Połączenie telefoniczne", videoUrl: "https://www.youtube.com/embed/8HWAfbuH1Ok"},
      { id: 6, title: "SKACZ", videoUrl: "https://www.youtube.com/embed/T8QGlkwUzlI" },
      { id: 7, title: "Steam family", videoUrl: "https://www.youtube.com/embed/HOaTTkKemfc", context: 'Unun został "wyrzucony" ze steam family' },
      { id: 8, title: "Zjadłeś?", videoUrl: "https://www.youtube.com/embed/XBWP91p3abc" },
    ]
  },
  {
    id: 2,
    name: "Najlepszy Timing",
    description: "Wybierz moment z idealnym timingiem",
    clips: [
      { id: 1, title: "Aura", videoUrl: "https://www.youtube.com/embed/LDyQ9O9nicg" },
      { id: 2, title: "Butla z gazem", videoUrl: "https://www.youtube.com/embed/A4CLrcWXSTs" },
      { id: 3, title: "Co jest prawdą", videoUrl: "https://www.youtube.com/embed/lFpmhFOhhHQ" },
      { id: 4, title: "Co to za stwór", videoUrl: "https://www.youtube.com/embed/lx_XvNe-P7U", context: "Proszę zwrócić uwagę na dialog z gry" },
      { id: 5, title: "Wolej", videoUrl: "https://www.youtube.com/embed/22MJEkKttPU" },
      { id: 6, title: "Przekaz myśli", videoUrl: "https://www.youtube.com/embed/eXqRyTrEyCs", context: "Proszę patrzeć na czat w lewym dolnym rogu" },
      { id: 7, title: "Czy on jest głupi?", videoUrl: "https://www.youtube.com/embed/Aq1kzNO0MPA" },
      { id: 8, title: "Walka Nazoida i Kridsa", videoUrl: "https://www.youtube.com/embed/7h-lq5B34xA", context: "Krids upada na ziemię idealnie wtedy, kiedy Kamil wychodzi zza Patryja" },
    ]
  },
  {
    id: 3,
    name: "Rozmowa Chuja z Butem",
    description: "Wybierz najbardziej absurdalną i bez sensu rozmowę",
    clips: [
      { id: 1, title: "Ciekawostka Patryja", videoUrl: "https://www.youtube.com/embed/vyZ64J_I0is" },
      { id: 2, title: "Debata o waleniu konia", videoUrl: "https://www.youtube.com/embed/WqWOSGUVyCI" },
      { id: 3, title: "Jaca nie dodał instrukcji", videoUrl: "https://www.youtube.com/embed/GHci-C5Vjlc" },
      { id: 4, title: "Nauka o DBD", videoUrl: "https://www.youtube.com/embed/3K_D1AvcZnQ" },
      { id: 5, title: "Palindrom", videoUrl: "https://www.youtube.com/embed/ZhYk8RdTYLA" },
      { id: 6, title: "Rozmo", videoUrl: "https://www.youtube.com/embed/H733-x18fmA" },
      { id: 7, title: "Krids i Unun", videoUrl: "https://www.youtube.com/embed/S47cC7RD-qQ" },
      { id: 8, title: "Sushi bar", videoUrl: "https://www.youtube.com/embed/uEr79672XOk" },
    ]
  },
  {
    id: 4,
    name: "Wielki Fart",
    description: "Wybierz moment gdzie ktoś miał niesamowite szczęście",
    clips: [
      { id: 1, title: "Teleport", videoUrl: "https://www.youtube.com/embed/-gY3YAzW-eM", context: "Kamil nie dość, że wydostał się z wymiaru, z którego szansa na ucieczkę była niska, to jeszcze został przeteleportowany za przeciwnika, dzięki czemu mógł go zabić" },
      { id: 2, title: "Debil", videoUrl: "https://www.youtube.com/embed/8LuC8PpRQVY", context: "W DBD jeden z zabójców może wysłać przetrwańca w losowe miejsce na mapie, a Kuboxa akurat przeteleportowało przed wyjście" },
      { id: 3, title: "GOOOL", videoUrl: "https://www.youtube.com/embed/kImgL9RS81Y" },
      { id: 4, title: "Grzyb", videoUrl: "https://www.youtube.com/embed/-fJSgMVK3_k", context: "Tylko Kubox przeżył i trzymał grzyba w ręce. Przypadkowo go upuścił gdzie akurat leżało ciało Relika i okazało się, że ten grzyb ożywia" },
      { id: 5, title: "Jedziemy", videoUrl: "https://www.youtube.com/embed/cJmV4a1hBWU", context: "Dwa razy Kamil wjechał w kogoś kto niósł przedmiot, a ten zamiast się rozbić, wpadł idealnie do wózka" },
      { id: 6, title: "Thor", videoUrl: "https://www.youtube.com/embed/hBG1WEfOzA4", context: "Przeciwnik użył ulta który wznosi ją w górę, ale akurat jego sojusznik otworzył nad nim portal w którego wpadł i przeniósł się na drugą stronę mapy" },
    ]
  },
  {
    id: 5,
    name: "Największy Niefart",
    description: "Wybierz moment w którym ktoś miał niezłego pecha",
    clips: [
      { id: 1, title: "Dobry teleport", videoUrl: "https://www.youtube.com/embed/tSd3GMGGOz0" },
      { id: 2, title: "Karma", videoUrl: "https://www.youtube.com/embed/NkIMRiG2CUo", context: "Krids zabił Kamila, a jego głowa odbiła się od ściany powalając Kridsa na ziemie, dzięki czemu Nazoid mógł go zabić" },
      { id: 3, title: "Lag", videoUrl: "https://www.youtube.com/embed/1apD6ADv_QM", context: "Przez laga Kamil zamiast zajebać randomowi, zajebał relikowi" },
      { id: 4, title: "Po linii", videoUrl: "https://www.youtube.com/embed/VKHb-uwsp_0" },
      { id: 5, title: "Piekło niepełnosprawnych", videoUrl: "https://www.youtube.com/embed/xx_X81U6sGs", context: "Skupcie się na żółtej postaci szopa na wózku" },
      { id: 6, title: "Unun dostał niechcący", videoUrl: "https://www.youtube.com/embed/0FwFQModhIU" },
      { id: 7, title: "Wybuch", videoUrl: "https://www.youtube.com/embed/dHPn2fAwAac" },
      { id: 8, title: "Zombie", videoUrl: "https://www.youtube.com/embed/zRRKzSys_s8" },
    ]
  },
  {
    id: 6,
    name: "Liczę na Glicze",
    description: "Wybierz najbardziej absurdalny glitch lub bug w grze kąkuterowej",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 7,
    name: "Najlepszy Żart",
    description: "Wybierz najbardziej śmieszny i dowcipny moment",
    clips: [
      { id: 1, title: "Autokar", videoUrl: "https://www.youtube.com/embed/vhuKhkel_ys" },
      { id: 2, title: "Odprawa", videoUrl: "https://www.youtube.com/embed/SiHMrFv1YNE" },
      { id: 3, title: "Klaun", videoUrl: "https://www.youtube.com/embed/9IAp7rmFf94" },
      { id: 4, title: "Sigma", videoUrl: "https://www.youtube.com/embed/MxLPxPv92cQ" },
      { id: 5, title: "Sposób na sashimi", videoUrl: "https://www.youtube.com/embed/_CcNPe0z94Q" },
      { id: 6, title: "Ten sam gość", videoUrl: "https://www.youtube.com/embed/_rqFCl1ZkCM" },
      { id: 7, title: "Widelec", videoUrl: "https://www.youtube.com/embed/YlwZX3RoD48", context: "Przychodzi Krids z grabiami w ręce" },
      { id: 8, title: "Wyłancznik", videoUrl: "https://www.youtube.com/embed/0qZWbUHCp30" },
    ]
  },
  {
    id: 8,
    name: "Najgorszy Żart",
    description: "Wybierz najbardziej nieśmieszny żart",
    clips: [
      { id: 1, title: "Żart Kridsa", videoUrl: "https://www.youtube.com/embed/v5kK9FHRplA" },
      { id: 2, title: "Jak śpi noob", videoUrl: "https://www.youtube.com/embed/hmEn2sXl8ns" },
      { id: 3, title: "Komunikaty w markecie", videoUrl: "https://www.youtube.com/embed/-rJgCJncgCA" },
      { id: 4, title: "Oliwka", videoUrl: "https://www.youtube.com/embed/X8ejPWsxNJA" },
      { id: 5, title: "Papier, kamień, nożyce", videoUrl: "https://www.youtube.com/embed/e8ckQ_jJrG8" },
      { id: 6, title: "Przychodzi baba", videoUrl: "https://www.youtube.com/embed/2L3FEdmUJ0s" },
      { id: 7, title: "Relik ze współlokatorem", videoUrl: "https://www.youtube.com/embed/skI0MzJqQNU" },
      { id: 8, title: "Urodziny", videoUrl: "https://www.youtube.com/embed/mpcspN9EYqk" },
    ]
  },
  {
    id: 9,
    name: "Największy Chaos",
    description: "Wybierz najbardziej chaotyczny moment w którym nie wiadomo co się dzieje",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 10,
    name: "Moment Radości",
    description: "Wybierz klipa na którym ktoś bardzo się cieszy",
    clips: [
      { id: 1, title: "Czarne wygrały", videoUrl: "https://www.youtube.com/embed/Rd7ER63Y0UI", context: "Patryj gra w ruletkę" },
      { id: 2, title: "Kot", videoUrl: "https://www.youtube.com/embed/0-524u1DCu0" },
      { id: 3, title: "Nazoid zabił pięciu", videoUrl: "https://www.youtube.com/embed/0sWxqh74W80" },
      { id: 4, title: "POLACY", videoUrl: "https://www.youtube.com/embed/xyHrsYSrqjM" },
      { id: 5, title: "Radość Heroka", videoUrl: "https://www.youtube.com/embed/HU2muTo6B9g" },
      { id: 6, title: "Radość Nazoida", videoUrl: "https://www.youtube.com/embed/bqG_rmaGJ3c" },
      { id: 7, title: "Rybki mamy", videoUrl: "https://www.youtube.com/embed/w-0cTvwQFsI" },
      { id: 8, title: "Kamiloski", videoUrl: "https://www.youtube.com/embed/zIP0NAr6Qjc" },
    ]
  },
  {
    id: 11,
    name: "Moment Katuszy",
    description: "Wybierz klipa na którym ktoś bardzo cierpi",
    clips: [
      { id: 1, title: "Wierny druh", videoUrl: "https://www.youtube.com/embed/8ORTiZj26JY" },
      { id: 2, title: "Skoki do dziury", videoUrl: "https://www.youtube.com/embed/W2PKwCAbmZM" },
      { id: 3, title: "Relik płacze", videoUrl: "https://www.youtube.com/embed/H2pGkZm8OBM" },
      { id: 4, title: "Relik nie wytrzymuje psychicznie", videoUrl: "https://www.youtube.com/embed/EMwIOJOhskM", context: "Powtarzaliśmy ten poziom kilkanaście razy" },
      { id: 5, title: "Nazoid w męczarniach", videoUrl: "https://www.youtube.com/embed/gI1BG2jYlnQ" },
      { id: 6, title: "Gdzie jest kasa", videoUrl: "https://www.youtube.com/embed/Zu3uQ6rtGEM", context: "Jacek niechcący sprzedał kasę" },
      { id: 7, title: "Coś ty zrobił", videoUrl: "https://www.youtube.com/embed/J6xcTQHMBVM", context: "Kamil wjebał niedorobioną potrawę na patelnię" },
      { id: 8, title: "Kolega", videoUrl: "https://www.youtube.com/embed/oLfdQ6zYLHk" },
    ]
  },
  {
    id: 12,
    name: "Największy Rage",
    description: "Wybierz najbardziej wkurzoną reakcję",
    clips: [
      { id: 1, title: "Beef Kamila i Nazoida", videoUrl: "https://www.youtube.com/embed/8VA-8uBklso" },
      { id: 2, title: "Ciągnik", videoUrl: "https://www.youtube.com/embed/bVKDJd-q1-k" },
      { id: 3, title: "Cziperki", videoUrl: "https://www.youtube.com/embed/6jMhnt-V7pY" },
      { id: 4, title: "Otwieranie sklepu", videoUrl: "https://www.youtube.com/embed/T99EkM3lx2I" },
      { id: 5, title: "Paleciak", videoUrl: "https://www.youtube.com/embed/-1ILRWTEYyc" },
      { id: 6, title: "Ragequit", videoUrl: "https://www.youtube.com/embed/-zWqSkmfO0c", context: "Krids był szkalowany cały poziom" },
      { id: 7, title: "Scyzoryk", videoUrl: "https://www.youtube.com/embed/0LqRBoQVMfI" },
      { id: 8, title: "Nienawiść do Relika", videoUrl: "https://www.youtube.com/embed/CJ33E8jdvSY" },
    ]
  },
  {
    id: 13,
    name: "Freaky",
    description: "Wybierz najbardziej freaky moment",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 14,
    name: "Freakazoid",
    description: "Wybierz najbardziej freaky moment Nazoida",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 15,
    name: "Najbardziej Przestrachany",
    description: "Wybierz klipa na którym ktoś jest bardzo przerażony",
    clips: [
      { id: 1, title: "Bomba", videoUrl: "https://www.youtube.com/embed/J1P3B0adlEQ" },
      { id: 2, title: "Czym ty jesteś", videoUrl: "https://www.youtube.com/embed/gg1GvI_Ztg4" },
      { id: 3, title: "Jester", videoUrl: "https://www.youtube.com/embed/Aibfhuk-2R4" },
      { id: 4, title: "Michael Myers", videoUrl: "https://www.youtube.com/embed/9u-bmfGxwtc" },
      { id: 5, title: "Nie rycz", videoUrl: "https://www.youtube.com/embed/YsXTIUtIYDw" },
      { id: 6, title: "PANOWIE", videoUrl: "https://www.youtube.com/embed/9LsPfBNl5dI" },
      { id: 7, title: "Rytuał", videoUrl: "https://www.youtube.com/embed/8W_nKPmJvmQ" },
      { id: 8, title: "Zawał", videoUrl: "https://www.youtube.com/embed/ERhxfgMCexU" },
    ]
  },
  {
    id: 16,
    name: "Rasizm",
    description: "Wybierz najbardziej rasistowską wypowiedź",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 17,
    name: "Największa Schiza",
    description: "Wybierz moment w którym ktoś odleciał mentalnie",
    clips: [
      { id: 1, title: "Yś", videoUrl: "https://www.youtube.com/embed/aqtdEfvMVOM" },
      { id: 2, title: "Trzy jajka", videoUrl: "https://www.youtube.com/embed/nXlW4YQLCH8", context: "Poziom powtarzany 50 razy" },
      { id: 3, title: "Unun szuka ptaka", videoUrl: "https://www.youtube.com/embed/8tE1DI91V8I", context: 'Krids nonstop powtarzał zagadkę o szukaniu ptaka, przez co Unun przez następne 2 godziny powtarzał "szukaj ptaka"' },
      { id: 4, title: "Pętla", videoUrl: "https://www.youtube.com/embed/XTP_mfXwXzg", context: "Relik zepsuł save'a" },
      { id: 5, title: "Okrzyki przeróżniste", videoUrl: "https://www.youtube.com/embed/LRkAAI4mgN8" },
      { id: 6, title: "Okno", videoUrl: "https://www.youtube.com/embed/O1wa6aDWn-E", context: "Pijany Kamil przez minutę pokazywał okno na kamerce i się śmiał bez powodu" },
      { id: 7, title: "How about that", videoUrl: "https://www.youtube.com/embed/IFMln3_rXCU" },
      { id: 8, title: "Diuna", videoUrl: "https://www.youtube.com/embed/mbyqynKU8oI" },
    ]
  },
  {
    id: 18,
    name: "Najlepsza Reakcja",
    description: "Wybierz najśmieszniejszą reakcję na coś",
    clips: [
      { id: 1, title: "Pies spawacz", videoUrl: "https://www.youtube.com/embed/ZrppxAy_IEk" },
      { id: 2, title: "Auchan", videoUrl: "https://www.youtube.com/embed/yVu-oFbdQII" },
      { id: 3, title: "Cichutko", videoUrl: "https://www.youtube.com/embed/n0tn2b7qYjk" },
      { id: 4, title: "Dobrze powiedział", videoUrl: "https://www.youtube.com/embed/a5MFe38bWn4" },
      { id: 5, title: "Jaca śmierć", videoUrl: "https://www.youtube.com/embed/MgIkKTfgHSA" },
      { id: 6, title: "Kurde co ty mi robisz", videoUrl: "https://www.youtube.com/embed/8WwP_d-UOsk" },
      { id: 7, title: "Nazoid przedrzeźnia", videoUrl: "https://www.youtube.com/embed/TX8CO6EV0Gs" },
      { id: 8, title: "Najlepiej na szczura najebać", videoUrl: "https://www.youtube.com/embed/Y7JhZQ0l114" },
    ]
  },
  {
    id: 19,
    name: "Najlepsza Reakcja Ununa",
    description: "Wybierz najśmieszniejszą reakcję Ununa na coś",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 20,
    name: "Najlepsza Scenka",
    description: "Wybierz najzabawnieszą przedstawioną scenę",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 21,
    name: "Najlepszy Drugi Plan",
    description: "Wybierz moment gdzie coś ciekawego dzieje się w tle",
    clips: [
      { id: 1, title: "Ja jechać", videoUrl: "https://www.youtube.com/embed/jdv-SZUnQWU" },
      { id: 2, title: "Relik umiera", videoUrl: "https://www.youtube.com/embed/uQlzuQWFNog", context: "Jeżeli detektyw umiera, to jego podwładny też. Zwróćcie uwagę na drugi plan, w momencie gdy Kamil kupuje w sklepie" },
      { id: 3, title: "Kubox", videoUrl: "https://www.youtube.com/embed/p1lnKGbbwZE" },
      { id: 4, title: "Telefon", videoUrl: "https://www.youtube.com/embed/wlec01XwCao" },
      { id: 5, title: "Patryj twerkuje", videoUrl: "https://www.youtube.com/embed/xvLb5A8l_TQ" },
      { id: 6, title: "Pies spawacz", videoUrl: "https://www.youtube.com/embed/_C91YrPv9ng", context: "Słuchajcie Ununa w tle" },
      { id: 7, title: "Pod prysznicem", videoUrl: "https://www.youtube.com/embed/DCN3dLkBkaQ" },
      { id: 8, title: "Upadek człowieka", videoUrl: "https://www.youtube.com/embed/NhQA9x7OxRY" },
    ]
  },
  {
    id: 22,
    name: "Największy Debil",
    description: "Wybierz największego głupca który zrobił głupią rzecz",
    clips: [
      { id: 1, title: "Szczur i garnek", videoUrl: "https://www.youtube.com/embed/NrdZDGjqmHk" },
      { id: 2, title: "Wieloryb", videoUrl: "https://www.youtube.com/embed/DH2QkVP-bjo" },
      { id: 3, title: "Relik na VR", videoUrl: "https://www.youtube.com/embed/Se0Dueodolw" },
      { id: 4, title: "Relik jest ślepy", videoUrl: "https://www.youtube.com/embed/CF_BGNu_FWo" },
      { id: 5, title: "Parkour Relika", videoUrl: "https://www.youtube.com/embed/K05B0bZheaw" },
      { id: 6, title: "Nieudany prank", videoUrl: "https://www.youtube.com/embed/rll5KwXUOx4" },
      { id: 7, title: "Dobrze idę?", videoUrl: "https://www.youtube.com/embed/qYic5xXVCsA" },
      { id: 8, title: "Banda jełopów", videoUrl: "https://www.youtube.com/embed/Sy6HsyQK43o" },
    ]
  },
  {
    id: 23,
    name: "Największy Szpont",
    description: "Wybierz największego szponciciela który odjebał maniane",
    clips: [
      { id: 1, title: "Lekki trolling", videoUrl: "https://www.youtube.com/embed/Pmmi4XLx2_g" },
      { id: 2, title: "Relik nie umie rzucać", videoUrl: "https://www.youtube.com/embed/Zk23tozlpfU" },
      { id: 3, title: "Ragebait", videoUrl: "https://www.youtube.com/embed/FooWcnT4iC8" },
      { id: 4, title: "Boże Relik zbudował kurnik", videoUrl: "https://www.youtube.com/embed/Jornf_R_RpI" },
      { id: 5, title: "Morderstwo Nazoida", videoUrl: "https://www.youtube.com/embed/Xu9NUar0HSI" },
      { id: 6, title: "Pół minuty z Relikiem", videoUrl: "https://www.youtube.com/embed/yCSVw4ixdqU" },
      { id: 7, title: "Vecna from DnD", videoUrl: "https://www.youtube.com/embed/lcyqzkkqF8k" },
      { id: 8, title: "Relik podaj szybko", videoUrl: "https://www.youtube.com/embed/RR8WaSEJ3TA" },
    ]
  },
  {
    id: 24,
    name: "Najlepsze zagranie",
    description: "Wybierz najbardziej imponującą akcję",
    clips: [
      { id: 1, title: "Bramka roku", videoUrl: "https://www.youtube.com/embed/QlXwmtIPl0c" },
      { id: 2, title: "Jaca władca piorunów", videoUrl: "https://www.youtube.com/embed/GnnVQj3_iQk" },
      { id: 3, title: "Jaca z rowerem", videoUrl: "https://www.youtube.com/embed/F3d0aVfEH2M" },
      { id: 4, title: "Nazoid i jego triki z Afryki", videoUrl: "https://www.youtube.com/embed/7O-gpL43LjY" },
      { id: 5, title: "Jackal", videoUrl: "https://www.youtube.com/embed/eLXWf-7QLbA" },
      { id: 6, title: "Refreks chudego byka", videoUrl: "https://www.youtube.com/embed/zSWeID8gJTU" },
      { id: 7, title: "Trickshot", videoUrl: "https://www.youtube.com/embed/otlEGIa8KrY" },
      { id: 8, title: "Technika Pijanego Mistrza", videoUrl: "https://www.youtube.com/embed/2T2E2j0jdyU", context: "Kamil był w stanie upojenia alkoholowego" },
    ]
  },
  {
    id: 25,
    name: "Najgorsze zagranie",
    description: "Wybierz najbardziej żenującą akcję",
    clips: [
      { id: 1, title: "Dziadu", videoUrl: "https://www.youtube.com/embed/AnvSvCc9dHA" },
      { id: 2, title: "Kamil ma cela jak baba z wesela", videoUrl: "https://www.youtube.com/embed/rQRw_tkhxu0" },
      { id: 3, title: "Helikopter", videoUrl: "https://www.youtube.com/embed/EKSR0Rarykc" },
      { id: 4, title: "Jak oni to trafili", videoUrl: "https://www.youtube.com/embed/wuaQViOHvhU" },
      { id: 5, title: "Krawężnik zasrany", videoUrl: "https://www.youtube.com/embed/z1_576aL2zo" },
      { id: 6, title: "Krids nie trafia", videoUrl: "https://www.youtube.com/embed/B4locHYpyqg" },
      { id: 7, title: "Nie wyszło", videoUrl: "https://www.youtube.com/embed/kIRtr2rY9ts" },
      { id: 8, title: "Wysnajpie go na linie", videoUrl: "https://www.youtube.com/embed/BCaZaK1Aacw" },
    ]
  },
  {
    id: 26,
    name: "Bombel Biba",
    description: "Wybierz najlepszy muzyczny klip lub śpiewanie",
    clips: [
      { id: 1, title: "Ballada", videoUrl: "https://www.youtube.com/embed/W01poAWAG0Y" },
      { id: 2, title: "Chodź ze mną", videoUrl: "https://www.youtube.com/embed/yv2ks_7YMZk" },
      { id: 3, title: "Deszcze niespokojne", videoUrl: "https://www.youtube.com/embed/XM2yzrI69pY" },
      { id: 4, title: "Herok mocno o Judaszu", videoUrl: "https://www.youtube.com/embed/vsWw_JZOhJM" },
      { id: 5, title: "Ja umieram, a moi koledzy tańczą", videoUrl: "https://www.youtube.com/embed/s57tXQkh71w" },
      { id: 6, title: "Jamming", videoUrl: "https://www.youtube.com/embed/JQYBCyFz3XQ" },
      { id: 7, title: "Ulubione Patryja", videoUrl: "https://www.youtube.com/embed/569MdfgtjVc" },
      { id: 8, title: "Wielka pizda", videoUrl: "https://www.youtube.com/embed/kV6P8ZsDXWQ" },
    ]
  },
  {
    id: 27,
    name: "Zwrot Akcji",
    description: "Wybierz moment z największym plot twistem",
    clips: [
      { id: 1, title: "Jutro pije, dzisiaj też pije", videoUrl: "https://www.youtube.com/embed/umbYYyfJmZM" },
      { id: 2, title: "Kamil ma full HP", videoUrl: "https://www.youtube.com/embed/8OUxMA9CCXQ" },
      { id: 3, title: "Musimy utonąć", videoUrl: "https://www.youtube.com/embed/CVu2DxuEdc8" },
      { id: 4, title: "Nie wyjdziemy stąd już nigdy", videoUrl: "https://www.youtube.com/embed/JWOAwiaZ3DQ" },
      { id: 5, title: "Niezręczna sytuacja", videoUrl: "https://www.youtube.com/embed/u-pqLCln9ws" },
      { id: 6, title: "Rudą nie wpuszczamy", videoUrl: "https://www.youtube.com/embed/YBHqYFuuP7s" },
      { id: 7, title: "Siema", videoUrl: "https://www.youtube.com/embed/rRa8FB34JYo" },
      { id: 8, title: "Tak się kończy trollowanie", videoUrl: "https://www.youtube.com/embed/6ILJ8IdWFFU" },
    ]
  },
  {
    id: 28,
    name: "Najlepiej Ucięte",
    description: "Wybierz klipa który ma najlepszy nagły koniec",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 29,
    name: "Najbardziej Ikoniczne",
    description: "Wybierz najbardziej ikoniczny bądź kultowy moment",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 30,
    name: "Najlepszy Random",
    description: "Wybierz najlepszą napotkaną osobę/osoby spoza Imperium",
    clips: [
      { id: 1, title: "Brytole", videoUrl: "https://www.youtube.com/embed/74YymyrHWl0" },
      { id: 2, title: "Hubert", videoUrl: "https://www.youtube.com/embed/ao10rGt7Vas" },
      { id: 3, title: "Japoński Winter Soldier", videoUrl: "https://www.youtube.com/embed/6flAHFk5c4M" },
      { id: 4, title: "Niemieccy piraci", videoUrl: "https://www.youtube.com/embed/MiTdnPskiP4" },
      { id: 5, title: "Parówka", videoUrl: "https://www.youtube.com/embed/9myZDkT6yOA", context: "Patrzcie pod koniec na chat w lewym dolnym rogu" },
      { id: 6, title: "Wait", videoUrl: "https://www.youtube.com/embed/__p748ByJLU" },
      { id: 7, title: "WAZAAA", videoUrl: "https://www.youtube.com/embed/PffC-i43qmI" },
      { id: 8, title: "Zemsta Ruska", videoUrl: "https://www.youtube.com/embed/jk7rA1rtDDY" },
    ]
  },
  {
    id: 31,
    name: "Garry's Mod",
    description: "Wybierz najlepszego klipa z gry Garry's Mod",
    clips: [
      { id: 1, title: "Kaj złamał nogę", videoUrl: "https://www.youtube.com/embed/N32D1GJ_oQ0" },
      { id: 2, title: "Mini Multak", videoUrl: "https://www.youtube.com/embed/XiOb01CdBjk" },
      { id: 3, title: "Nazoid poleciał", videoUrl: "https://www.youtube.com/embed/hEkYZtXwoMY" },
      { id: 4, title: "BLING BLING BOYY", videoUrl: "https://www.youtube.com/embed/IrEE4wuuQ2k" },
      { id: 5, title: "Ja to rozbroję", videoUrl: "https://www.youtube.com/embed/bwttenKVgGY" },
      { id: 6, title: "Zdrajca pośród nas", videoUrl: "https://www.youtube.com/embed/IRrIvXCeZDA" },
      { id: 7, title: "Pedały", videoUrl: "https://www.youtube.com/embed/YdDwCbxcxD4" },
      { id: 8, title: "Młot", videoUrl: "https://www.youtube.com/embed/N7YpEYIgQYY" },
    ]
  },
  {
    id: 32,
    name: "Overcooked",
    description: "Wybierz najlepszego klipa z gry Overcooked",
    clips: [
      { id: 1, title: "Relik odwala", videoUrl: "https://www.youtube.com/embed/6DglCgXO-gY", context: "Postać ufoludka to Relik" },
      { id: 2, title: "PALI SIĘ", videoUrl: "https://www.youtube.com/embed/84q0HVnBQZk" },
      { id: 3, title: "Mąkę", videoUrl: "https://www.youtube.com/embed/uKqDAsiV8Kk" },
      { id: 4, title: "Jak w zegarku", videoUrl: "https://www.youtube.com/embed/hKEy39_8IUo" },
      { id: 5, title: "Jaca sternik", videoUrl: "https://www.youtube.com/embed/-Flunt6wdRg" },
      { id: 6, title: "Jaca czyta", videoUrl: "https://www.youtube.com/embed/eSgbAgQrPys" },
      { id: 7, title: "Trzy jajka", videoUrl: "https://www.youtube.com/embed/JI9F_KnyXoY", context: "Poziom powtarzany 50 razy" },
      { id: 8, title: "Czeko-czeko-lada", videoUrl: "https://www.youtube.com/embed/5TBPcNy2uU0" },
    ]
  },
  {
    id: 33,
    name: "Pracownik Roku",
    description: "Wybierz najlepszego klipa z gry Supermarket Together",
    clips: [
      { id: 1, title: "Mobbing w pracy", videoUrl: "https://www.youtube.com/embed/RDX2AYjk9zM" },
      { id: 2, title: "To nie ja", videoUrl: "https://www.youtube.com/embed/asohhCuCwnc" },
      { id: 3, title: "Lody dla ochłody", videoUrl: "https://www.youtube.com/embed/ul6HvvxvKoM" },
      { id: 4, title: "Głupie pytanie", videoUrl: "https://www.youtube.com/embed/zNJL7xW1itI", context: "90% produktów kupowanych do sklepu Żobko to sól i pasta do zębów" },
      { id: 5, title: "Fontanna", videoUrl: "https://www.youtube.com/embed/ew-8hbCKUO4" },
      { id: 6, title: "Kurczak", videoUrl: "https://www.youtube.com/embed/Te8-4mPFnQU" },
      { id: 7, title: "Patryj biznesmen", videoUrl: "https://www.youtube.com/embed/mvkL9Ymij4I" },
      { id: 8, title: "W sklepie Andrzejka może być tylko sól", videoUrl: "https://www.youtube.com/embed/rjDUcz_2WJw", context: "Wbiliśmy do sklepu jakiegoś randoma którego jedynym produktem na półkach była sól" },
    ]
  },
  {
    id: 34,
    name: "Sea of Thieves",
    description: "Wybierz najlepszego klipa z gry Sea of Thieves",
    clips: [
      { id: 1, title: "Szukaj ptaka", videoUrl: "https://www.youtube.com/embed/j-dKjiWORfc" },
      { id: 2, title: "Wykręcę", videoUrl: "https://www.youtube.com/embed/wWOAJfY5bjM" },
      { id: 3, title: "Wielki ptak na mapie", videoUrl: "https://www.youtube.com/embed/cyL28N5mO34" },
      { id: 4, title: "Unun ostro o Kridsie", videoUrl: "https://www.youtube.com/embed/i8hJVkeLcLY" },
      { id: 5, title: "Unun się chyba", videoUrl: "https://www.youtube.com/embed/6a0JYOmgv7Y" },
      { id: 6, title: "Plan Ununa", videoUrl: "https://www.youtube.com/embed/OOVMqLBi6nI" },
      { id: 7, title: "Na pełnej", videoUrl: "https://www.youtube.com/embed/VcrDEwZo7eA" },
      { id: 8, title: "Maszt", videoUrl: "https://www.youtube.com/embed/obsCOyTUxUw" },
    ]
  },
  {
    id: 35,
    name: "R.E.P.O.",
    description: "Wybierz najlepszego klipa z gry R.E.P.O.",
    clips: [
      { id: 1, title: "Diament", videoUrl: "https://www.youtube.com/embed/11pTU6ZkuJU" },
      { id: 2, title: "Cisza", videoUrl: "https://www.youtube.com/embed/bQEVVy6Vebo" },
      { id: 3, title: "Kraksa", videoUrl: "https://www.youtube.com/embed/gqmtRkS4dkc" },
      { id: 4, title: "Kurzy jeździec", videoUrl: "https://www.youtube.com/embed/9JOeo4nskrI" },
      { id: 5, title: "Nie do gara", videoUrl: "https://www.youtube.com/embed/GDtCvuZF9Wk" },
      { id: 6, title: "Mosz rzyga", videoUrl: "https://www.youtube.com/embed/sMPKGOw0wtI" },
      { id: 7, title: "Potrzebuję silnego mężczyznę do pomocy", videoUrl: "https://www.youtube.com/embed/Uqly8Dmumbw" },
      { id: 8, title: "Wazę trzymam", videoUrl: "https://www.youtube.com/embed/_H_GAjq1smg" },
    ]
  },
  {
    id: 36,
    name: "Lethal Company",
    description: "Wybierz najlepszego klipa z gry Lethal Company",
    clips: [
      { id: 1, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 2, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 3, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 4, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 5, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 6, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 7, title: "", videoUrl: "https://www.youtube.com/embed/" },
      { id: 8, title: "", videoUrl: "https://www.youtube.com/embed/" },
    ]
  },
  {
    id: 37,
    name: "Najgłośniejszy Krzyk",
    description: "Wybierz najgłośniejszy wydany krzyk bądź odgłos z czyichś ust",
    clips: [
      { id: 1, title: "Ale kino", videoUrl: "https://www.youtube.com/embed/cY_x9rN_PF0" },
      { id: 2, title: "Spadek Jacka", videoUrl: "https://www.youtube.com/embed/42C6ajO6JQI" },
      { id: 3, title: "Jaca się topi", videoUrl: "https://www.youtube.com/embed/Hp-PRvwUYlQ" },
      { id: 4, title: "Kurde", videoUrl: "https://www.youtube.com/embed/0eBxbi06f9k" },
      { id: 5, title: "PANOWIE", videoUrl: "https://www.youtube.com/embed/c4IDXtFo45M" },
      { id: 6, title: "Patryj potężne sranie", videoUrl: "https://www.youtube.com/embed/0D_p3jbJNBU" },
      { id: 7, title: "Ślimak", videoUrl: "https://www.youtube.com/embed/51d_o0vTDnk" },
      { id: 8, title: "Stefan", videoUrl: "https://www.youtube.com/embed/r-rLCf0BSgA" },
    ]
  },
  {
    id: 38,
    name: "Najdziwniejszy Odgłos",
    description: "Wybierz najbardziej dziwny wydany dźwięk z czyichś ust",
    clips: [
      { id: 1, title: "Blue Lock Egoiści", videoUrl: "https://www.youtube.com/embed/gmyv_9_mzpY" },
      { id: 2, title: "Nazoid przedrzeźnia", videoUrl: "https://www.youtube.com/embed/TX8CO6EV0Gs" },
      { id: 3, title: "Okrzyki Mosza", videoUrl: "https://www.youtube.com/embed/XwlbYeLFWmE" },
      { id: 4, title: "Ona ma ace'a", videoUrl: "https://www.youtube.com/embed/WNtqDb-ANNk" },
      { id: 5, title: "Patryj odgania psa", videoUrl: "https://www.youtube.com/embed/bgbtlXF3GCc" },
      { id: 6, title: "Świnia", videoUrl: "https://www.youtube.com/embed/fjmV4csCAjE" },
      { id: 7, title: "Termit", videoUrl: "https://www.youtube.com/embed/hwEnKpan10Y" },
      { id: 8, title: "Wiewiór", videoUrl: "https://www.youtube.com/embed/5MqvRkuX9C4" },
    ]
  },
  {
    id: 39,
    name: "Najgorszy Odgłos",
    description: "Wybierz najgorszy wydany dźwięk z czyichś ust",
    clips: [
      { id: 1, title: "Beatbox", videoUrl: "https://www.youtube.com/embed/gQgvDxhPOC4" },
      { id: 2, title: "Evil Jonkler", videoUrl: "https://www.youtube.com/embed/1hVJEeQJwJg" },
      { id: 3, title: "Gra nie działa", videoUrl: "https://www.youtube.com/embed/7yFUarekKi4" },
      { id: 4, title: "Hehehehe", videoUrl: "https://www.youtube.com/embed/AsIbsE_bDX4" },
      { id: 5, title: "Hihihihi", videoUrl: "https://www.youtube.com/embed/7Sf92EHoaNI" },
      { id: 6, title: "Patryj się zesrał chyba", videoUrl: "https://www.youtube.com/embed/mIGYvyBizCk" },
      { id: 7, title: "Pierdolona sałata", videoUrl: "https://www.youtube.com/embed/7Ov7hkpYirQ" },
      { id: 8, title: "Wewnętrzny wilk", videoUrl: "https://www.youtube.com/embed/2fZTd1MMmRw" },
    ]
  },
  {
    id: 40,
    name: "Kategoria Herok",
    description: "Wybierz najlepszy moment z Herokiem w roli głównej",
    clips: [
      { id: 1, title: "Cenzura", videoUrl: "https://www.youtube.com/embed/lzDBKhXqHTU" },
      { id: 2, title: "Co on mu robi", videoUrl: "https://www.youtube.com/embed/vsxb0SzUm0E" },
      { id: 3, title: "Co powiedziały dzieci", videoUrl: "https://www.youtube.com/embed/v2hpEY-mzqQ" },
      { id: 4, title: "Gniew artysty", videoUrl: "https://www.youtube.com/embed/2AqMXe5XvRg" },
      { id: 5, title: "Mosz co ty mówisz", videoUrl: "https://www.youtube.com/embed/fV-ayYVHzI8" },
      { id: 6, title: "Robot", videoUrl: "https://www.youtube.com/embed/k3czmG2chk0" },
      { id: 7, title: "Herok niemiło o Pawełku", videoUrl: "https://www.youtube.com/embed/AsIbsE_bDX4" },
      { id: 8, title: "3:0 z Finlandią", videoUrl: "https://www.youtube.com/embed/HU2muTo6B9g" },
    ]
  },
];

// Generowanie unikalnego ID głosu
const generateVoteId = () => {
  return 'VOTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Storage helper - localStorage jako backup
const saveVote = (voteId, data) => {
  localStorage.setItem(`vote:${voteId}`, JSON.stringify(data));
  return { key: `vote:${voteId}`, value: JSON.stringify(data) };
};

const saveProgress = (progress) => {
  localStorage.setItem('voting_progress', JSON.stringify(progress));
};

const loadProgress = () => {
  const saved = localStorage.getItem('voting_progress');
  return saved ? JSON.parse(saved) : null;
};

const clearProgress = () => {
  localStorage.removeItem('voting_progress');
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [selectedClips, setSelectedClips] = useState({ tier1: null, tier2: null, tier3: null });
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [voteId, setVoteId] = useState(null);
  const [showContext, setShowContext] = useState({});

  const currentCategory = CATEGORIES[currentCategoryIndex];
  const hasVotedInCategory = selectedClips.tier1 || selectedClips.tier2 || selectedClips.tier3;

  // Wczytaj progress przy starcie
  useEffect(() => {
    const progress = loadProgress();
    if (progress && progress.currentScreen === 'voting') {
      const confirmResume = window.confirm(
        'Znaleziono zapisany postęp głosowania. Chcesz kontynuować od miejsca gdzie skończyłeś?'
      );
      if (confirmResume) {
        setCurrentScreen(progress.currentScreen);
        setCurrentCategoryIndex(progress.currentCategoryIndex);
        setVotes(progress.votes);
      } else {
        clearProgress();
      }
    }
  }, []);

  // Zapisuj progres przy każdej zmianie
  useEffect(() => {
    if (currentScreen === 'voting') {
      saveProgress({
        currentScreen,
        currentCategoryIndex,
        votes
      });
    }
  }, [currentScreen, currentCategoryIndex, votes]);

  // Funkcja głosowania
  const handleVote = async () => {
    if (!hasVotedInCategory) return;

    const categoryVote = {
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      tier1: selectedClips.tier1,
      tier2: selectedClips.tier2,
      tier3: selectedClips.tier3,
    };

    const newVotes = { ...votes, [currentCategory.id]: categoryVote };
    setVotes(newVotes);

    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSelectedClips({ tier1: null, tier2: null, tier3: null });
      setShowContext({});
    } else {
      // Koniec głosowania - zapisz do Firebase
      const id = generateVoteId();
      try {
        // Zapisz do Firebase
        await saveVoteToFirebase(id, newVotes);
        // Zapisz też lokalnie jako backup
        saveVote(id, newVotes);
        setVoteId(id);
        setCurrentScreen('summary');
        clearProgress();
      } catch (error) {
        console.error('Błąd zapisu:', error);
        alert('Błąd podczas zapisywania głosu. Spróbuj ponownie.');
      }
    }
  };

  // Funkcja skip z potwierdzeniem
  const handleSkip = async () => {
    if (hasVotedInCategory) return;
    
    if (!showSkipConfirm) {
      setShowSkipConfirm(true);
      return;
    }

    const categoryVote = {
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      skipped: true
    };

    const newVotes = { ...votes, [currentCategory.id]: categoryVote };
    setVotes(newVotes);

    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSelectedClips({ tier1: null, tier2: null, tier3: null });
      setShowSkipConfirm(false);
      setShowContext({});
    } else {
      const id = generateVoteId();
      try {
        // Zapisz do Firebase
        await saveVoteToFirebase(id, newVotes);
        // Zapisz też lokalnie jako backup
        saveVote(id, newVotes);
        setVoteId(id);
        setCurrentScreen('summary');
        clearProgress();
      } catch (error) {
        console.error('Błąd zapisu:', error);
        alert('Błąd podczas zapisywania głosu. Spróbuj ponownie.');
      }
    }
  };

  // Wybór klipu do tiera
  const selectClip = (clipId, tier) => {
    const currentTierClip = selectedClips[tier];
    
    if (currentTierClip === clipId) {
      setSelectedClips({ ...selectedClips, [tier]: null });
      return;
    }

    const otherTiers = Object.keys(selectedClips).filter(t => t !== tier);
    let newSelected = { ...selectedClips };
    
    for (let otherTier of otherTiers) {
      if (selectedClips[otherTier] === clipId) {
        newSelected[otherTier] = currentTierClip;
        break;
      }
    }
    
    newSelected[tier] = clipId;
    setSelectedClips(newSelected);
  };

  const getClipTier = (clipId) => {
    if (selectedClips.tier1 === clipId) return 'tier1';
    if (selectedClips.tier2 === clipId) return 'tier2';
    if (selectedClips.tier3 === clipId) return 'tier3';
    return null;
  };

  // INTRO SCREEN
  if (currentScreen === 'intro') {
    return (
      <div className="intro-screen">
        <div className="intro-container">
          <h1 className="intro-title">
            🏆 Kartonowe Heroki 2025 🏆
          </h1>
          <p className="intro-subtitle">
            Głosowanie na najlepsze klipy z naszego serwera!
          </p>
          
          <div className="video-container">
            <iframe 
              className="video-iframe"
              src="https://www.youtube.com/embed/W5zQJffGAk8"
              title="Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="info-box">
            <h2 className="info-title">📋 Jak głosować?</h2>
            <ul className="info-list">
              <li>• Zobaczysz {CATEGORIES.length} kategorii, prawie każda z 8 klipami</li>
              <li>• Możesz zagłosować na TOP 3 klipy (🥇 🥈 🥉)</li>
              <li>• Kliknij przycisk tier (1, 2 lub 3) pod klipem aby go wybrać</li>
              <li>• Najedź na ikonę ℹ️ przy niektórych klipach aby zobaczyć kontekst</li>
              <li>• Możesz pominąć kategorię przyciskiem SKIP (z potwierdzeniem)</li>
              <li>• Możesz wrócić do strony później - postęp się zapisuje!</li>
              <li>• Na końcu dostaniesz unikalny kod - wyślij go na priv!</li>
            </ul>
          </div>

          <button onClick={() => setCurrentScreen('voting')} className="start-button">
            Zacznij Głosowanie!
          </button>
        </div>
      </div>
    );
  }

  // SUMMARY SCREEN
  if (currentScreen === 'summary') {
    return (
      <div className="summary-screen">
        <div className="summary-container">
          <h1 className="summary-title">
            ✅ Dziękujemy za głosowanie!
          </h1>
          
          <div className="code-box">
            <p className="code-label">
              Twój unikalny kod głosowania:
            </p>
            <div className="code-display">
              <p className="code-text">
                {voteId}
              </p>
            </div>
            <p className="code-instruction">
              Skopiuj ten kod i wyślij go na priv do jednego z organizatorów!
            </p>
          </div>

          <div className="votes-summary">
            <h3 className="votes-title">📊 Twoje głosy:</h3>
            <div className="votes-list">
              {Object.values(votes).map((vote, idx) => (
                <div key={idx} className="vote-item">
                  <span className="vote-category">{vote.categoryName}:</span>{' '}
                  {vote.skipped ? '(pominięte)' : `${vote.tier1 ? '✓' : ''}${vote.tier2 ? '✓' : ''}${vote.tier3 ? '✓' : ''} zagłosowano`}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(voteId);
              alert('Kod skopiowany do schowka!');
            }}
            className="copy-button"
          >
            📋 Skopiuj Kod
          </button>
        </div>
      </div>
    );
  }

  // VOTING SCREEN
  return (
    <div className="voting-screen">
      <div className="voting-container">
        {/* Progress bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${((currentCategoryIndex + 1) / CATEGORIES.length) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="voting-header">
          <div className="header-info">
            <span className="category-counter">
              Kategoria {currentCategoryIndex + 1} z {CATEGORIES.length}
            </span>
          </div>
          <h1 className="category-name">{currentCategory.name}</h1>
          <p className="category-description">{currentCategory.description}</p>
        </div>

        {/* Clips grid - 4 w rzędzie */}
        <div className="clips-grid">
          {currentCategory.clips.map((clip) => {
            const tier = getClipTier(clip.id);
            
            return (
              <div key={clip.id} className={`clip-card tier-${tier || 'none'}`}>
                {/* Video */}
                <div className="clip-video">
                  <iframe
                    className="clip-iframe"
                    src={clip.videoUrl}
                    title={clip.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Title and context button */}
                <div className="clip-header">
                  <span className="clip-title">{clip.title}</span>
                  {clip.context && (
                    <button
                      onMouseEnter={() => setShowContext({ ...showContext, [clip.id]: true })}
                      onMouseLeave={() => setShowContext({ ...showContext, [clip.id]: false })}
                      className="context-button"
                    >
                      <AlertCircle size={20} />
                      {showContext[clip.id] && (
                        <div className="context-tooltip">
                          {clip.context}
                        </div>
                      )}
                    </button>
                  )}
                </div>

                {/* Tier selection buttons */}
                <div className="tier-buttons">
                  <button
                    onClick={() => selectClip(clip.id, 'tier1')}
                    className={`tier-button tier1-button ${tier === 'tier1' ? 'active' : ''}`}
                  >
                    🥇 1
                  </button>
                  <button
                    onClick={() => selectClip(clip.id, 'tier2')}
                    className={`tier-button tier2-button ${tier === 'tier2' ? 'active' : ''}`}
                  >
                    🥈 2
                  </button>
                  <button
                    onClick={() => selectClip(clip.id, 'tier3')}
                    className={`tier-button tier3-button ${tier === 'tier3' ? 'active' : ''}`}
                  >
                    🥉 3
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button
            onClick={handleSkip}
            disabled={hasVotedInCategory}
            className={`action-button skip-button ${hasVotedInCategory ? 'disabled' : ''} ${showSkipConfirm ? 'confirm' : ''}`}
          >
            {showSkipConfirm ? '⚠️ Potwierdź SKIP' : 'SKIP ⏭️'}
          </button>
          
          <button
            onClick={handleVote}
            disabled={!hasVotedInCategory}
            className={`action-button vote-button ${!hasVotedInCategory ? 'disabled' : ''}`}
          >
            ZAGŁOSUJ ✅
          </button>
        </div>

        {/* Info text */}
        {!hasVotedInCategory && (
          <p className="info-text">
            Wybierz przynajmniej 1 klip aby odblokować przycisk ZAGŁOSUJ
          </p>
        )}
        {showSkipConfirm && (
          <p className="info-text warning">
            Kliknij ponownie SKIP aby potwierdzić pominięcie tej kategorii
          </p>
        )}
      </div>
    </div>
  );
}

export default App;