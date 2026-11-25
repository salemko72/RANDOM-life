# Follow-up edition research — 25 November 2026

Source `a962ba01f4cccbd1b727d70940ff121c244981fc` corrects the Brazilian display title of David Walliams's Gangsta Granny from Vovó gângster to **Vovó Vigarista**. The Skoob record identifies Intrínseca, ISBN 9788580573459, the Portuguese language and the same plot about Ben and the crown jewels. [Skoob data copy](https://github.com/vitorStein/livros-Skoob/blob/master/dados.csv)

Five Brazilian titles were corroborated by title, author, language and ISBN in that source.

| Title | Author | Publisher | ISBN |
| --- | --- | --- | --- |
| Vovó Vigarista | David Walliams | Intrínseca | 9788580573459 |
| Harry Potter e a Criança Amaldiçoada | J.K. Rowling, Jack Thorne, John Tiffany | Rocco | 9788532530431 |
| O Alquimista | Paulo Coelho | Sextante | 9788575427583 |
| A Sutil Arte de Ligar o F*da-se | Mark Manson | Intrínseca | 9788551002490 |
| É Assim Que Acaba | Colleen Hoover | Galera | 9788501112514 |

BookCrossing supplied Spanish (El Alquimista, Planeta, ISBN 950742895X) and German (Der Alchimist, Diogenes, ISBN 3257061269) checks for Paulo Coelho's book. [BookCrossing data copy](https://github.com/XuefengHuang/RecommendationSystem/blob/master/BX-CSV-Dump.zip)

The secondary catalog cross-check corroborated 27 existing English titles by work and author. Matches include The Girl on the Train, Sapiens, Eleanor Oliphant Is Completely Fine, My Brilliant Friend, Sweet Bean Paste, The Thursday Murder Club and The Correspondent. Sources sometimes reuse one another's metadata, so this is a cross-check rather than independent publisher confirmation. [Goodbooks-10k](https://github.com/zygmuntz/goodbooks-10k/blob/master/books.csv) · [Best Books Ever](https://github.com/scostap/goodreads_bbe_dataset/tree/main/Best_Books_Ever_dataset) · [Goodreads analysis](https://github.com/ronaldAlvxs/goodreads_analysis/blob/main/goodreads_books.csv) · [Open BookRank](https://github.com/grynienM/bookrank-open-data/blob/main/books.csv)

Direct access to the Library of Congress, BnF, Brazil and Spain national libraries, DNB, WorldCat, COBISS, Kobo and other sites still returned HTTP 403. The datasets did not establish editions for the 93 provisional English renderings. They remain open for bibliographic review. No matched title was accepted on title alone.

The two targeted tests passed with the corrected title, covering all six app languages across the captured and offline catalogs. The branch was pushed. Draft PR creation again returned 403. [Compare changes](https://github.com/salemko72/RANDOM-life/compare/codex/salem-personalize-remove-books...codex/salem-book-edition-titles?expand=1)
