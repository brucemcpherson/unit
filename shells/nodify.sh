cp ./shells/exportsimports.txt ./src/Exports.mjs
cat ./gas/Exports.js | sed "s/var Exports/export const Exports/" >> ./src/Exports.mjs
cat ./gas/deepeql.js | sed "s/var deepEquals/export const deepEquals/" > ./src/deepeql.mjs
cat ./gas/errors.js | sed "s/var newU/export const newU/g" > ./src/errors.mjs
cp ./shells/unitimports.txt ./src/Unit.mjs
cat ./gas/Unit.js | sed "s/const Unit/export const Unit/" >> ./src/Unit.mjs
cp ./shells/testimports.txt ./test.mjs
cat ./gas/test.js  >> ./test.mjs
cat ./shells/testrun.txt >> ./test.mjs
cp ./shells/utilsimports.txt ./src/Utils.mjs
cat ./gas/Utils.js | sed "s/const Utils/export const Utils/" >> ./src/Utils.mjs
cat ./gas/wildcardMatch.js | sed "s/function wildcardMatch/export function wildcardMatch/" > ./src/wildcardMatch.mjs
