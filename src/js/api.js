const fethcPokemons = (url) => fetch(url);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getNumbersRandom = () => {
  const temp = [1,2,3,4,5];
  return temp.map(() => getRandomInt(1, 807));
};

define(
  function() {
    const fetchPokemons = async () => {
      const pokemons = getNumbersRandom().map(async (number) => {
        const response = await fethcPokemons(`https://pokeapi.co/api/v2/pokemon/${number}`);
        const data = response.json();

        return data;
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
          const response = await fetch(urlForm);
          const url = await response.json();

          return url;
        }

        return '';
      });

      try {
        const formsData = await Promise.all(forms);

        return formsData;
      } catch (err) {

      }
    }

    const fetchPokemonImage = async (url) => {
      try {
        const response = await fetch(url);

        const data = await response.json();

        const { sprites } = data || {};

        const { front_default } = sprites || {};

        return front_default;
      } catch (err) {
        return null;
      }
    }

    return { fetchPokemons, fetchPokemonImage, fetchPokemonImages };
  }
);