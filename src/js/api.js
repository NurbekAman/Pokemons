define(['utils'],
  function(utils) {
    const fetchData = async (url) => {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    }

    const fetchPokemons = async () => {
      const requestPokemons = utils.getNumbersRandom().map((number) => fetchData(`https://pokeapi.co/api/v2/pokemon/${number}`));
      const result = await Promise.all(requestPokemons);
      return result;
    };

    return { fetchPokemons };
  }
);