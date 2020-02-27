define(function() {
  /**
   * getPokemonTypesCount - figure out the same types and calculate the count of same types
   *
   * @param types - [
   *  { type: { name: 'ground' }, slot: 1 },
   *  { type: { name: 'water' }, slot: 2 },
   *  { type: { name: 'ground' }, slot: 3 },
   *  { type: { name: 'fire' }, slot: 4 }
   * ]
   *
   * @return [{ name: 'ground', count: 2 }, { name: 'water', count: 1 }, { name: 'fire', count: 1 }]
   */
  const getPokemonTypesCount = (types) => {
    const result = [];

    function distributeTypes(typeList) {
      if (!typeList.length) {
        return;
      }

      const { type } = typeList[0];
      const others = typeList.filter(({ type: { name } }) => name !== type.name);

      if (others.length) {
        const countSameTypes = Math.abs(typeList.length - others.length);

        result.push({ name: type.name, count: countSameTypes });

        return distributeTypes(others);
      } else {
        result.push({ name: type.name, count: typeList.length });

        return;
      }
    }

    distributeTypes(types);

    return result;
  }

  const convertTypesToString = (types) => types.reduce((acc, { type: { name } }, index) => {
    if (index === types.length - 1) {
      return acc + name;
    }

    return acc + name + ', '
  }, '')

  const getTableData = (pokemons) => {
    return pokemons.map((pokemon) => {
      const { id, name, weight, height, moves, types } = pokemon;

      return {
        isChecked: false,
        id,
        name,
        height,
        weight,
        numberOfMoves: moves.length ? moves.length : 0,
        types: types.length ?  convertTypesToString(types) : '',
      };
    })
  }

  // get random within the numbers
  const getRandomInt = (numbers) => numbers[Math.floor(Math.random() * numbers.length)];

  const getNumbersRandom = () => {
    const numbers = [];
    // for delete operation Set is cheaper and this is the reason of using it
    const pokemonNumber = new Set();
    for (let i = 1; i < 808; i++) {
      pokemonNumber.add(i);
    }

    for(let i = 0; i < 5; i++) {
      const number = getRandomInt([...pokemonNumber]);
      pokemonNumber.delete(number);

      numbers.push(number);
    }

    return numbers;
  };

  return {
    getPokemonTypesCount,
    getTableData,
    getNumbersRandom
  };
});