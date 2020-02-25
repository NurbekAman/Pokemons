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
    self.getPokemons = async () => {
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

    return { getPokemons: getPokemons };
  }
);