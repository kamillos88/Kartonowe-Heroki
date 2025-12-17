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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 6,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 8,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 9,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 11,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 12,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 13,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 16,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 18,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 19,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 20,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 22,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 23,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 24,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 25,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 26,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 27,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 28,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 31,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 32,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 33,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 34,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 35,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 36,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 38,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 39,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
    id: 40,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
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
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
              <li>• Kliknij na klip, a potem wybierz tier (1, 2 lub 3)</li>
              <li>• Możesz pominąć kategorię przyciskiem SKIP</li>
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