define(
  function() {
    const fetchData = async (url) => {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    }

    const getRandomInt = (numbers) => numbers[Math.floor(Math.random() * numbers.length)];

    const getNumbersRandom = () => {
      const temp = [1,2,3,4,5];
      // easy to add or delete element that us why here i used Set
      const pokemonNumber = new Set();
      for (let i = 1; i < 808; i++) {
        pokemonNumber.add(i);
      }

      return temp.map(() => {
        const number = getRandomInt([...pokemonNumber]);
        pokemonNumber.delete(number);

        return number;
      })
    };

    const fetchPokemons = async () => {
      const pokemons = getNumbersRandom().map(async (number) => {
        return fetchData(`https://pokeapi.co/api/v2/pokemon/${number}`);
      });
      try {
        const result = await Promise.all(pokemons);
        return result;
      } catch (err) {
        return [];
      }
    };

    const fetchPokemonImages = async (pokemons) => {
      const forms = pokemons.map(async ({ forms }) => {
        const { url: urlForm } = forms[0] || {};

        if (urlForm) {
          return fetchData(urlForm);
        }

        return '';
      });

      try {
        const formsData = await Promise.all(forms);

        return formsData;
      } catch (err) {
        return [];
      }
    }

    return { fetchPokemons, fetchPokemonImages };
  }
);