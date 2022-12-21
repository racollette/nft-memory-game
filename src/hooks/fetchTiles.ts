const COLLECTION_SIZE = 10420
const GRID_SIZE = 16

export const fetchTiles = () => {
    const tokenIDs = generateRandomNumbers(GRID_SIZE, COLLECTION_SIZE)
    const extended = tokenIDs.concat(tokenIDs)
    const shuffled = extended
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    const dimension = Math.sqrt(shuffled.length)
    const twoDimensionalArray = toMatrix(shuffled, dimension)
    return twoDimensionalArray

    // try {
    //   const response = await fetch(url);
    //   const json = await response.json();
    //   console.log(json);
    // } catch (error) {
    //   console.log("error", error);
    // }
  };

const generateRandomNumbers = (gridTotal: number, collectionSize: number) => {
  const randomTokenIDs = new Array(gridTotal / 2).fill("").map((token) => (Math.floor(Math.random() * collectionSize)).toString())
  return randomTokenIDs
}

const toMatrix = (arr: any[], width: number) => {
  return arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key]) 
      : rows[rows.length-1].push(key)) && rows, []);
}