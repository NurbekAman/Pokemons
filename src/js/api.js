define(
  function() {
    const fetchData = async (url) => {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    }

    // get random within the numbers
    const getRandomInt = (numbers) => numbers[Math.floor(Math.random() * numbers.length)];

    const getNumbersRandom = () => {
      const temp = [1,2,3,4,5];
      // for delete operation Set is cheaper and this is the reason of using it
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
      const requestPokemons = getNumbersRandom().map((number) => fetchData(`https://pokeapi.co/api/v2/pokemon/${number}`));
      try {
        const result = await Promise.all(requestPokemons);
        return result;
      } catch (err) {
        return [];
      }
    };

    const fetchPokemonImages = async (pokemons) => {
      const requestImages = pokemons.map(({ forms }) => {
        const { url } = forms[0] || {};

        if (url) {
          return fetchData(url);
        }

        return '';
      });

      try {
        const formsData = await Promise.all(requestImages);

        return formsData;
      } catch (err) {
        return [];
      }
    }

    return { fetchPokemons, fetchPokemonImages };
  }
);