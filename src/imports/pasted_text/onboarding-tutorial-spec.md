Zaprojektuj nowoczesny, elegancki i intuicyjny system interaktywnego samouczka (Onboarding / Product Tour) dla istniejącej aplikacji webowej.

### GŁÓWNY CEL

Użytkownik powinien móc w dowolnym momencie uruchomić samouczek za pomocą małej, okrągłej ikony „?” znajdującej się w prawym dolnym rogu ekranu.

Po kliknięciu ikony „?” uruchamia się interaktywny tutorial, który krok po kroku pokazuje użytkownikowi najważniejsze sekcje aktualnej strony i wyjaśnia ich funkcje.

### IKONA POMOCY

* Umieść okrągły przycisk z symbolem „?” w prawym dolnym rogu ekranu.
* Przycisk powinien być zawsze widoczny.
* Ma wyglądać nowocześnie i minimalistycznie.
* Dodaj delikatny efekt hover.
* Po kliknięciu przycisku rozpocznij animowany tutorial.
* Przycisk może mieć subtelną animację/pulsowanie, aby użytkownik wiedział, że jest interaktywny.

### TUTORIAL – ZACHOWANIE

Po uruchomieniu tutorialu:

1. Cała strona zostaje delikatnie przyciemniona / wyszarzona przez półprzezroczysty overlay.
2. Jedna konkretna sekcja pozostaje w pełni widoczna.
3. Wybrana sekcja zostaje mocno wyróżniona za pomocą:

   * jasnego borderu / obramowania,
   * delikatnego glow,
   * zaokrąglonego highlightu dopasowanego do kształtu elementu.
4. Pozostała część interfejsu powinna być wizualnie nieaktywna.
5. Obok wyróżnionej sekcji pojawia się nowoczesny tooltip / popup z instrukcją.
6. Popup powinien zawierać:

   * numer kroku, np. „1 z 5”,
   * krótki tytuł,
   * krótkie i konkretne wyjaśnienie funkcji,
   * przycisk „Dalej”,
   * opcjonalnie przycisk „Pomiń samouczek”.
7. Popup powinien automatycznie ustawiać się w miejscu, które nie zasłania zaznaczonego elementu.
8. Jeśli element znajduje się przy krawędzi ekranu, popup powinien odpowiednio zmienić pozycję.

### PRZYKŁADOWE KROKI

Zaprojektuj przykładowy tutorial składający się z 5 kroków:

KROK 1 – NAWIGACJA
Wyróżnij główną nawigację aplikacji.
Popup:
„Nawigacja”
„Tutaj znajdziesz najważniejsze sekcje aplikacji i możesz szybko przełączać się między nimi.”

KROK 2 – WYSZUKIWANIE / FILTROWANIE
Wyróżnij sekcję wyszukiwania lub filtrów.
Popup:
„Wyszukiwanie i filtry”
„Użyj filtrów, aby szybko znaleźć interesujące Cię informacje.”

KROK 3 – GŁÓWNA SEKCJA
Wyróżnij główny obszar roboczy aplikacji.
Popup:
„Główny obszar”
„Tutaj znajduje się najważniejsza część aplikacji, w której możesz wykonywać główne działania.”

KROK 4 – AKCJE UŻYTKOWNIKA
Wyróżnij najważniejsze przyciski akcji.
Popup:
„Działania”
„Z tego miejsca możesz wykonywać najważniejsze operacje dostępne w tej sekcji.”

KROK 5 – PROFIL / USTAWIENIA
Wyróżnij ikonę profilu lub ustawień.
Popup:
„Profil i ustawienia”
„Tutaj możesz zarządzać swoim kontem oraz ustawieniami aplikacji.”

### ANIMACJE

Zadbaj o płynne i profesjonalne przejścia pomiędzy krokami.

Przejście pomiędzy krokami powinno wyglądać następująco:

* aktualny highlight delikatnie zanika,
* border/highlight płynnie przesuwa się do kolejnej sekcji,
* nowa sekcja zostaje podświetlona,
* popup płynnie przesuwa się lub pojawia przy nowym elemencie,
* overlay pozostaje cały czas aktywny,
* nie używaj gwałtownych zmian ani nagłych przeskoków.

Preferuj animacje typu:

* fade,
* slide,
* smooth movement,
* scale,
* subtle glow.

Całość powinna sprawiać wrażenie jednego spójnego, płynnego procesu.

### HIGHLIGHT

Zaprojektuj highlight jako „spotlight”:

* reszta strony: przyciemniona,
* aktywny element: w pełni widoczny,
* wokół aktywnego elementu: wyraźny border,
* subtelny glow wokół borderu,
* możliwość zastosowania delikatnej animacji pulsowania obramowania.

Highlight powinien automatycznie dopasowywać się do rozmiaru i kształtu zaznaczanego elementu.

### POPUP / TOOLTIP

Popup powinien mieć nowoczesny wygląd pasujący do profesjonalnej aplikacji SaaS:

* zaokrąglone narożniki,
* subtelny cień,
* czytelna hierarchia typografii,
* wyraźny tytuł,
* krótki opis,
* numer kroku,
* przycisk „Dalej”,
* opcję „Pomiń”.

Popup może posiadać małą strzałkę wskazującą bezpośrednio na aktywną sekcję.

### OSTATNI KROK

Po zakończeniu ostatniego kroku:

* highlight znika,
* overlay płynnie zanika,
* popup znika,
* użytkownik wraca do normalnego widoku aplikacji,
* pokaż krótkie zakończenie:
  „Gotowe! Teraz znasz najważniejsze funkcje aplikacji.”
* przycisk „Zakończ”.

### RESPONSYWNOŚĆ

Zaprojektuj zachowanie tutorialu również dla mniejszych ekranów.
Popup nie może wychodzić poza ekran.
Highlight powinien poprawnie dopasowywać się do elementów interfejsu.
Na mobile popup może pojawiać się od dołu ekranu jako mała karta typu bottom sheet.

### STYL

Całość powinna wyglądać jak wysokiej jakości produkt SaaS:

* minimalistycznie,
* nowocześnie,
* profesjonalnie,
* dużo przestrzeni,
* subtelne animacje,
* wyraźna hierarchia informacji,
* bez przesadnych efektów.

Stwórz kilka stanów interfejsu:

1. Normalny widok aplikacji + ikona „?”
2. Tutorial – krok 1
3. Tutorial – krok 2
4. Tutorial – krok 3
5. Tutorial – krok 4
6. Tutorial – krok 5
7. Ekran zakończenia tutorialu

Zadbaj o to, aby wszystkie stany były wizualnie spójne i pokazywały dokładnie, jak powinno działać przechodzenie pomiędzy kolejnymi krokami.
